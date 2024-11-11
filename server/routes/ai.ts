import express from 'express';
import OpenAI from 'openai';
import multer from 'multer';
import { db } from '@/lib/db';
import { checkPermission } from '@/middleware/checkPermission';
import Logger from '@/lib/utils/logger';

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Analyze blueprint data with assistant
router.post(
  '/analyze-blueprint',
  checkPermission(['estimates:create']),
  async (req, res) => {
    try {
      const { processedData, fileName, assistantId } = req.body;

      // Create a thread for this analysis
      const thread = await openai.beta.threads.create();

      // Add the blueprint data as a message
      await openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: `Please analyze this blueprint data and provide material and labor estimates. The blueprint is from ${fileName}:\n\n${JSON.stringify(processedData, null, 2)}`,
      });

      // Run the assistant
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistantId,
      });

      // Wait for completion
      let runStatus = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
      );

      while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(
          thread.id,
          run.id
        );
      }

      if (runStatus.status === 'completed') {
        // Get the assistant's response
        const messages = await openai.beta.threads.messages.list(thread.id);
        const lastMessage = messages.data[0];

        // Parse the assistant's response
        const response = {
          materials: [],
          laborEstimate: {
            hours: 0,
            rate: 0,
            total: 0,
          },
          recommendations: [],
        };

        // Save the analysis results
        await db.query(
          `UPDATE blueprints 
           SET ai_analysis = ?, updated_at = NOW()
           WHERE id = ?`,
          [JSON.stringify(response), processedData.id]
        );

        res.json(response);
      } else {
        throw new Error(`Assistant run failed: ${runStatus.status}`);
      }
    } catch (error) {
      Logger.error('Blueprint analysis failed:', error);
      res.status(500).json({ error: 'Failed to analyze blueprint' });
    }
  }
);

// Create a new thread
router.post(
  '/threads',
  checkPermission(['ai:use']),
  async (_req, res) => {
    try {
      const thread = await openai.beta.threads.create();
      res.json({ threadId: thread.id });
    } catch (error) {
      Logger.error('Failed to create thread:', error);
      res.status(500).json({ error: 'Failed to create thread' });
    }
  }
);

// Send a message
router.post(
  '/messages',
  checkPermission(['ai:use']),
  upload.array('files'),
  async (req, res) => {
    try {
      const { threadId, content, assistantId } = req.body;
      const files = req.files as Express.Multer.File[];

      // Create message with files if any
      const message = await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content,
        ...(files?.length && {
          file_ids: await Promise.all(
            files.map(async (file) => {
              const response = await openai.files.create({
                file: file.buffer,
                purpose: 'assistants',
              });
              return response.id;
            })
          ),
        }),
      });

      // Run the assistant
      const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
      });

      // Wait for completion
      let runStatus = await openai.beta.threads.runs.retrieve(
        threadId,
        run.id
      );

      while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(
          threadId,
          run.id
        );
      }

      if (runStatus.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(threadId);
        const lastMessage = messages.data[0];

        res.json({
          id: lastMessage.id,
          content: lastMessage.content[0].text.value,
          role: lastMessage.role,
          timestamp: new Date(),
        });
      } else {
        throw new Error(`Assistant run failed: ${runStatus.status}`);
      }
    } catch (error) {
      Logger.error('Message processing failed:', error);
      res.status(500).json({ error: 'Failed to process message' });
    }
  }
);

// Get thread messages
router.get(
  '/threads/:threadId/messages',
  checkPermission(['ai:use']),
  async (req, res) => {
    try {
      const messages = await openai.beta.threads.messages.list(
        req.params.threadId
      );

      res.json(
        messages.data.map(message => ({
          id: message.id,
          content: message.content[0].text.value,
          role: message.role,
          timestamp: message.created_at,
        }))
      );
    } catch (error) {
      Logger.error('Failed to fetch messages:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  }
);

export default router;