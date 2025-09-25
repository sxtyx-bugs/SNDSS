import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { manipulateText } from "./ai-manipulation";
import { insertTextShareSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new text share
  app.post("/api/shares", async (req, res) => {
    try {
      const body = insertTextShareSchema.parse(req.body);
      
      // Manipulate the text using AI
      const manipulatedContent = await manipulateText(body.originalContent);
      
      // Create the share with manipulated content
      const share = await storage.createTextShare({
        originalContent: body.originalContent,
        expiresAt: body.expiresAt,
      });
      
      // Update with manipulated content (simulating the AI processing)
      share.manipulatedContent = manipulatedContent;
      
      // Return only the ID and expiration, not the content
      res.json({
        id: share.id,
        expiresAt: share.expiresAt,
        url: `${req.protocol}://${req.get('host')}/share/${share.id}`
      });
    } catch (error) {
      console.error('Error creating share:', error);
      res.status(400).json({ error: 'Invalid request data' });
    }
  });

  // Get a text share by ID
  app.get("/api/shares/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const share = await storage.getTextShare(id);
      
      if (!share) {
        return res.status(404).json({ error: 'Share not found or expired' });
      }
      
      // Return the manipulated content, not the original
      res.json({
        id: share.id,
        content: share.manipulatedContent,
        expiresAt: share.expiresAt,
        createdAt: share.createdAt,
      });
    } catch (error) {
      console.error('Error retrieving share:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Cleanup endpoint (for development/testing only)
  if (process.env.NODE_ENV !== 'production') {
    app.post("/api/cleanup", async (req, res) => {
      try {
        const deletedCount = await storage.deleteExpiredShares();
        res.json({ deletedCount });
      } catch (error) {
        console.error('Error during cleanup:', error);
        res.status(500).json({ error: 'Cleanup failed' });
      }
    });
  }

  const httpServer = createServer(app);

  return httpServer;
}
