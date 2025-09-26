import { type TextShare, type InsertTextShare } from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { textShares } from "@shared/schema";
import { eq, lt } from "drizzle-orm";

// Check environment configuration
const isDatabaseAvailable = process.env.DATABASE_URL && process.env.NODE_ENV === 'production';
const isRedisAvailable = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

// Database client (only initialize if we have credentials)
let db: ReturnType<typeof drizzle> | null = null;
if (isDatabaseAvailable) {
  try {
    const client = postgres(process.env.DATABASE_URL!, { prepare: false });
    db = drizzle(client);
  } catch (error) {
    console.error('Failed to initialize database connection:', error);
  }
}

// Redis client for ephemeral storage
class UpstashRedisClient {
  private baseUrl: string;
  private token: string;

  constructor() {
    this.baseUrl = process.env.UPSTASH_REDIS_REST_URL!;
    this.token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  }

  async setex(key: string, ttl: number, value: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/setex/${key}/${ttl}/${encodeURIComponent(value)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`Redis setex failed: ${response.status} ${response.statusText}`);
    }
  }

  async get(key: string): Promise<string | null> {
    const response = await fetch(`${this.baseUrl}/get/${key}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Redis get failed: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.result;
  }

  async del(key: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/del/${key}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`Redis del failed: ${response.status} ${response.statusText}`);
    }
  }
}

const redis = isRedisAvailable ? new UpstashRedisClient() : null;

export interface IStorage {
  createTextShare(share: InsertTextShare): Promise<TextShare>;
  getTextShare(id: string): Promise<TextShare | undefined>;
  deleteExpiredShares(): Promise<number>;
}

// Redis-based storage implementation for ephemeral shares
export class RedisStorage implements IStorage {
  async createTextShare(insertShare: InsertTextShare): Promise<TextShare> {
    if (!redis) {
      throw new Error('Redis not available');
    }

    const id = randomUUID();
    const share: TextShare = {
      id,
      originalContent: insertShare.originalContent,
      manipulatedContent: insertShare.originalContent, // Will be updated after AI processing
      expiresAt: insertShare.expiresAt,
      createdAt: new Date(),
    };

    // Calculate TTL in seconds
    const ttl = Math.max(1, Math.floor((new Date(insertShare.expiresAt).getTime() - Date.now()) / 1000));
    
    // Store in Redis with expiration
    await redis.setex(`share:${id}`, ttl, JSON.stringify(share));

    return share;
  }

  async getTextShare(id: string): Promise<TextShare | undefined> {
    if (!redis) {
      throw new Error('Redis not available');
    }

    const dataString = await redis.get(`share:${id}`);
    if (!dataString) {
      return undefined;
    }

    try {
      const share = JSON.parse(dataString) as TextShare;
      // Check if expired (extra safety check)
      if (new Date(share.expiresAt) < new Date()) {
        await redis.del(`share:${id}`);
        return undefined;
      }
      return share;
    } catch (error) {
      console.error('Error parsing share data:', error);
      return undefined;
    }
  }

  async deleteExpiredShares(): Promise<number> {
    // Redis handles expiration automatically, but we can implement cleanup if needed
    return 0;
  }
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private textShares: Map<string, TextShare>;

  constructor() {
    this.textShares = new Map();
    // Only start cleanup interval in development
    if (process.env.NODE_ENV !== 'production') {
      // Start cleanup interval (every minute)
      setInterval(() => {
        this.deleteExpiredShares();
      }, 60000);
    }
  }

  async createTextShare(insertShare: InsertTextShare): Promise<TextShare> {
    const id = randomUUID().substring(0, 8); // Shorter IDs for easier sharing
    const now = new Date();
    
    const share: TextShare = {
      ...insertShare,
      id,
      manipulatedContent: insertShare.originalContent, // Will be replaced with AI-manipulated version
      createdAt: now,
    };
    
    this.textShares.set(id, share);
    return share;
  }

  async getTextShare(id: string): Promise<TextShare | undefined> {
    const share = this.textShares.get(id);
    
    // Check if expired
    if (share && new Date() > share.expiresAt) {
      this.textShares.delete(id);
      return undefined;
    }
    
    return share;
  }

  async deleteExpiredShares(): Promise<number> {
    const now = new Date();
    let deletedCount = 0;
    
    const entries = Array.from(this.textShares.entries());
    for (const [id, share] of entries) {
      if (now > share.expiresAt) {
        this.textShares.delete(id);
        deletedCount++;
      }
    }
    
    return deletedCount;
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  async createTextShare(insertShare: InsertTextShare): Promise<TextShare> {
    if (!db) {
      throw new Error('Database not initialized');
    }

    // Create the share with manipulated content placeholder
    const [share] = await db.insert(textShares)
      .values({
        originalContent: insertShare.originalContent,
        manipulatedContent: insertShare.originalContent, // Will be updated after AI processing
        expiresAt: insertShare.expiresAt,
      })
      .returning();

    return share;
  }

  async getTextShare(id: string): Promise<TextShare | undefined> {
    if (!db) {
      throw new Error('Database not initialized');
    }

    // First, delete expired shares
    await this.deleteExpiredShares();

    // Get the share
    const shares = await db.select()
      .from(textShares)
      .where(eq(textShares.id, id));

    return shares[0];
  }

  async deleteExpiredShares(): Promise<number> {
    if (!db) {
      throw new Error('Database not initialized');
    }

    const result = await db.delete(textShares)
      .where(lt(textShares.expiresAt, new Date()));

    return result.count;
  }
}

// Export the appropriate storage implementation
export const storage: IStorage = isRedisAvailable 
  ? new RedisStorage() 
  : isDatabaseAvailable && db 
    ? new DatabaseStorage() 
    : new MemStorage();