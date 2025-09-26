import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { manipulateText } from '../server/ai-manipulation';
import { insertTextShareSchema } from '../shared/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'POST') {
      // Create a new text share
      const body = insertTextShareSchema.parse(req.body);
      
      // Manipulate the text using AI
      const manipulatedContent = await manipulateText(body.originalContent);
      
      // Create the share with manipulated content
      const share = await storage.createTextShare({
        originalContent: body.originalContent,
        expiresAt: body.expiresAt,
      });
      
      // Update with manipulated content (simulating the AI processing)
      (share as any).manipulatedContent = manipulatedContent;
      
      // Return only the ID and expiration, not the content
      res.status(200).json({
        id: share.id,
        expiresAt: share.expiresAt,
        url: `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}/share/${share.id}`
      });
    } else if (req.method === 'GET') {
      // Get a text share by ID
      const { id } = req.query;
      
      if (!id || typeof id !== 'string') {
        res.status(400).json({ error: 'Share ID is required' });
        return;
      }
      
      const share = await storage.getTextShare(id);
      
      if (!share) {
        res.status(404).json({ error: 'Share not found or expired' });
        return;
      }
      
      // Return the manipulated content, not the original
      res.status(200).json({
        id: share.id,
        content: share.manipulatedContent,
        expiresAt: share.expiresAt,
        createdAt: share.createdAt,
      });
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}