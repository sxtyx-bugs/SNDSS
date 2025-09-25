import { type TextShare, type InsertTextShare } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createTextShare(share: InsertTextShare): Promise<TextShare>;
  getTextShare(id: string): Promise<TextShare | undefined>;
  deleteExpiredShares(): Promise<number>;
  getAllTextShares(): Promise<TextShare[]>;
}

export class MemStorage implements IStorage {
  private textShares: Map<string, TextShare>;

  constructor() {
    this.textShares = new Map();
    // Start cleanup interval (every minute)
    setInterval(() => {
      this.deleteExpiredShares();
    }, 60000);
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

  async getAllTextShares(): Promise<TextShare[]> {
    return Array.from(this.textShares.values());
  }
}

export const storage = new MemStorage();
