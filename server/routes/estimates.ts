import express from 'express';
import { checkPermission } from '@/middleware/checkPermission';
import { db } from '@/lib/db';
import { generatePDF } from '@/lib/pdf';
import Logger from '@/lib/utils/logger';

const router = express.Router();

// Create estimate
router.post(
  '/',
  checkPermission(['estimates:create']),
  async (req, res) => {
    try {
      const {
        projectId,
        customerId,
        blueprintId,
        materials,
        notes,
      } = req.body;

      // Start transaction
      await db.query('START TRANSACTION');

      // Create estimate
      const [estimateResult] = await db.query(
        `INSERT INTO estimates (
          project_id,
          customer_id,
          blueprint_id,
          notes,
          total_cost
        ) VALUES (?, ?, ?, ?, ?)`,
        [
          projectId,
          customerId,
          blueprintId,
          notes,
          materials.reduce((sum: number, m: any) => sum + (m.quantity * m.unitPrice), 0),
        ]
      );

      const estimateId = estimateResult.insertId;

      // Create estimate materials
      for (const material of materials) {
        await db.query(
          `INSERT INTO estimate_materials (
            estimate_id,
            name,
            description,
            quantity,
            unit_price,
            unit,
            total_price,
            ai_recommended
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            estimateId,
            material.name,
            material.description,
            material.quantity,
            material.unitPrice,
            material.unit,
            material.quantity * material.unitPrice,
            material.aiRecommended || false,
          ]
        );
      }

      // Commit transaction
      await db.query('COMMIT');

      // Get the created estimate
      const estimate = await getEstimateById(estimateId);
      res.status(201).json(estimate);
    } catch (error) {
      await db.query('ROLLBACK');
      Logger.error('Failed to create estimate:', error);
      res.status(500).json({ error: 'Failed to create estimate' });
    }
  }
);

// Get estimate by ID
router.get(
  '/:id',
  checkPermission(['estimates:read']),
  async (req, res) => {
    try {
      const estimate = await getEstimateById(req.params.id);
      if (!estimate) {
        return res.status(404).json({ error: 'Estimate not found' });
      }
      res.json(estimate);
    } catch (error) {
      Logger.error('Failed to get estimate:', error);
      res.status(500).json({ error: 'Failed to get estimate' });
    }
  }
);

// Update estimate
router.put(
  '/:id',
  checkPermission(['estimates:update']),
  async (req, res) => {
    try {
      const { materials, notes } = req.body;

      // Start transaction
      await db.query('START TRANSACTION');

      // Update estimate
      await db.query(
        'UPDATE estimates SET notes = ?, total_cost = ? WHERE id = ?',
        [
          notes,
          materials.reduce((sum: number, m: any) => sum + (m.quantity * m.unitPrice), 0),
          req.params.id,
        ]
      );

      // Delete existing materials
      await db.query(
        'DELETE FROM estimate_materials WHERE estimate_id = ?',
        [req.params.id]
      );

      // Create new materials
      for (const material of materials) {
        await db.query(
          `INSERT INTO estimate_materials (
            estimate_id,
            name,
            description,
            quantity,
            unit_price,
            unit,
            total_price,
            ai_recommended
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            req.params.id,
            material.name,
            material.description,
            material.quantity,
            material.unitPrice,
            material.unit,
            material.quantity * material.unitPrice,
            material.aiRecommended || false,
          ]
        );
      }

      // Commit transaction
      await db.query('COMMIT');

      // Get the updated estimate
      const estimate = await getEstimateById(req.params.id);
      res.json(estimate);
    } catch (error) {
      await db.query('ROLLBACK');
      Logger.error('Failed to update estimate:', error);
      res.status(500).json({ error: 'Failed to update estimate' });
    }
  }
);

// Delete estimate
router.delete(
  '/:id',
  checkPermission(['estimates:delete']),
  async (req, res) => {
    try {
      await db.query('DELETE FROM estimates WHERE id = ?', [req.params.id]);
      res.status(204).send();
    } catch (error) {
      Logger.error('Failed to delete estimate:', error);
      res.status(500).json({ error: 'Failed to delete estimate' });
    }
  }
);

// Generate PDF
router.get(
  '/:id/pdf',
  checkPermission(['estimates:read']),
  async (req, res) => {
    try {
      const estimate = await getEstimateById(req.params.id);
      if (!estimate) {
        return res.status(404).json({ error: 'Estimate not found' });
      }

      const pdf = await generatePDF(estimate);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="estimate-${estimate.id}.pdf"`
      );
      
      res.send(pdf);
    } catch (error) {
      Logger.error('Failed to generate PDF:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  }
);

async function getEstimateById(id: string) {
  const [estimate] = await db.query(
    `SELECT
      e.*,
      c.name as customer_name,
      c.email as customer_email,
      c.phone as customer_phone,
      p.name as project_name
    FROM estimates e
    LEFT JOIN customers c ON e.customer_id = c.id
    LEFT JOIN projects p ON e.project_id = p.id
    WHERE e.id = ?`,
    [id]
  );

  if (!estimate) {
    return null;
  }

  const materials = await db.query(
    'SELECT * FROM estimate_materials WHERE estimate_id = ?',
    [id]
  );

  return {
    ...estimate,
    materials,
  };
}

export default router;