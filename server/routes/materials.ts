import express from 'express';
import { checkPermission } from '@/middleware/checkPermission';
import { db } from '@/lib/db';
import { lowesService } from '@/services/lowesService';
import Logger from '@/lib/utils/logger';

const router = express.Router();

// Search materials
router.get(
  '/search',
  checkPermission(['estimates:read']),
  async (req, res) => {
    try {
      const { query, category } = req.query;
      
      let sql = `
        SELECT *
        FROM materials
        WHERE (name LIKE ? OR description LIKE ?)
      `;
      const params: any[] = [`%${query}%`, `%${query}%`];

      if (category) {
        sql += ' AND category = ?';
        params.push(category);
      }

      sql += ' ORDER BY name ASC LIMIT 50';

      const materials = await db.query(sql, params);
      res.json(materials);
    } catch (error) {
      Logger.error('Material search failed:', error);
      res.status(500).json({ error: 'Failed to search materials' });
    }
  }
);

// Get material price history
router.get(
  '/:id/price-history',
  checkPermission(['estimates:read']),
  async (req, res) => {
    try {
      const history = await db.query(
        `SELECT price, recorded_at
         FROM material_price_history
         WHERE material_id = ?
         ORDER BY recorded_at DESC
         LIMIT 30`,
        [req.params.id]
      );
      res.json(history);
    } catch (error) {
      Logger.error('Failed to fetch price history:', error);
      res.status(500).json({ error: 'Failed to fetch price history' });
    }
  }
);

// Sync material with Lowe's
router.post(
  '/sync',
  checkPermission(['materials:sync']),
  async (req, res) => {
    try {
      const { sku } = req.body;

      // Get current price from Lowe's
      const priceData = await lowesService.getProductPrice(sku);
      const productData = await lowesService.getProductDetails(sku);

      // Start transaction
      await db.query('START TRANSACTION');

      // Update or insert material
      const [existingMaterial] = await db.query(
        'SELECT id FROM materials WHERE lowes_sku = ?',
        [sku]
      );

      if (existingMaterial) {
        // Update existing material
        await db.query(
          `UPDATE materials
           SET unit_price = ?, last_sync = NOW()
           WHERE id = ?`,
          [priceData.price, existingMaterial.id]
        );

        // Record price history
        await db.query(
          `INSERT INTO material_price_history (
            material_id, price, recorded_at
          ) VALUES (?, ?, NOW())`,
          [existingMaterial.id, priceData.price]
        );
      } else {
        // Insert new material
        const result = await db.query(
          `INSERT INTO materials (
            lowes_sku, name, description, category,
            unit, unit_price, supplier, last_sync
          ) VALUES (?, ?, ?, ?, ?, ?, 'Lowes', NOW())`,
          [
            sku,
            productData.name,
            productData.description,
            productData.category,
            productData.unit,
            priceData.price,
          ]
        );

        // Record initial price history
        await db.query(
          `INSERT INTO material_price_history (
            material_id, price, recorded_at
          ) VALUES (?, ?, NOW())`,
          [result.insertId, priceData.price]
        );
      }

      await db.query('COMMIT');
      res.json({ success: true });
    } catch (error) {
      await db.query('ROLLBACK');
      Logger.error('Material sync failed:', error);
      res.status(500).json({ error: 'Failed to sync material' });
    }
  }
);

export default router;