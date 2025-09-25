import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const textShares = pgTable("text_shares", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  originalContent: text("original_content").notNull(),
  manipulatedContent: text("manipulated_content").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTextShareSchema = createInsertSchema(textShares)
  .pick({
    originalContent: true,
    expiresAt: true,
  })
  .extend({
    expiresAt: z.coerce.date(), // Allow ISO string conversion to Date
  });

export type InsertTextShare = z.infer<typeof insertTextShareSchema>;
export type TextShare = typeof textShares.$inferSelect;