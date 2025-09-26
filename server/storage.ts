import { type TextShare, type InsertTextShare } from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { textShares } from "@shared/schema";
import { eq, lt } from "drizzle-orm";

// Check if we're in a Vercel environment or have database credentials
const isDatabaseAvailable = process.env.DATABASE_URL && process.env.NODE_ENV === 'production';

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

export interface IStorage {
  createTextShare(share: InsertTextShare): Promise<TextShare>;
  getTextShare(id: string): Promise<TextShare | undefined>;
  deleteExpiredShares(): Promise<number>;
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
export const storage: IStorage = isDatabaseAvailable && db ? new DatabaseStorage() : new MemStorage();