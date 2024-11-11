import express from 'express';
import multer from 'multer';
import { createWorker } from 'tesseract.js';
import { PDFDocument } from 'pdf-lib';
import { db } from '@/lib/db';
import { checkPermission } from '@/middleware/checkPermission';
import Logger from '@/lib/utils/logger';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// Process blueprint data using OCR
async function processBlueprint(buffer: Buffer, mimeType: string) {
  try {
    let imageBuffer = buffer;

    // If PDF, convert first page to image
    if (mimeType === 'application/pdf') {
      const pdfDoc = await PDFDocument.load(buffer);
      const pages = pdfDoc.getPages();
      if (pages.length === 0) {
        throw new Error('PDF has no pages');
      }
      // Convert PDF page to image (implementation depends on your needs)
      // This is a placeholder - you'll need to implement PDF to image conversion
      imageBuffer = buffer; // Replace with actual conversion
    }

    // Perform OCR using Tesseract.js
    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(imageBuffer);
    await worker.terminate();

    // Process the extracted text to find dimensions and materials
    // This is a basic example - you'll need to implement more sophisticated parsing
    const dimensions = extractDimensions(text);
    const materials = extractMaterials(text);

    return {
      dimensions,
      materials,
      rawText: text,
    };
  } catch (error) {
    Logger.error('Error processing blueprint:', error);
    throw new Error('Failed to process blueprint');
  }
}

// Extract dimensions from OCR text (placeholder implementation)
function extractDimensions(text: string) {
  // Implement dimension extraction logic
  return {
    width: 0,
    height: 0,
    unit: 'ft',
  };
}

// Extract materials from OCR text (placeholder implementation)
function extractMaterials(text: string) {
  // Implement materials extraction logic
  return [];
}

// Upload and process blueprint
router.post(
  '/upload',
  checkPermission(['estimates:create']),
  upload.single('blueprint'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const processedData = await processBlueprint(
        req.file.buffer,
        req.file.mimetype
      );

      // Save to database
      const result = await db.query(
        `INSERT INTO blueprints (
          user_id,
          file_name,
          processed_data,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, NOW(), NOW())`,
        [
          req.user.id,
          req.file.originalname,
          JSON.stringify(processedData),
        ]
      );

      res.json({
        id: result.insertId,
        ...processedData,
      });
    } catch (error) {
      Logger.error('Blueprint upload error:', error);
      res.status(500).json({ error: 'Failed to process blueprint' });
    }
  }
);

// Get processed blueprint by ID
router.get(
  '/:id',
  checkPermission(['estimates:read']),
  async (req, res) => {
    try {
      const [blueprint] = await db.query(
        'SELECT * FROM blueprints WHERE id = ? AND user_id = ?',
        [req.params.id, req.user.id]
      );

      if (!blueprint) {
        return res.status(404).json({ error: 'Blueprint not found' });
      }

      res.json({
        id: blueprint.id,
        fileName: blueprint.file_name,
        processedData: JSON.parse(blueprint.processed_data),
        createdAt: blueprint.created_at,
        updatedAt: blueprint.updated_at,
      });
    } catch (error) {
      Logger.error('Blueprint retrieval error:', error);
      res.status(500).json({ error: 'Failed to retrieve blueprint' });
    }
  }
);

export default router;