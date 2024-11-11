import { db } from '@/lib/db';
import { lowesService } from './lowesService';
import Logger from '@/lib/utils/logger';
import type { Material } from '@/types';

class MaterialService {
  async syncMaterials() {
    try {
      Logger.info('Starting material sync with Lowe\'s');

      // Get all materials from database
      const materials = await db.query(
        'SELECT * FROM materials WHERE supplier = ?',
        ['lowes']
      );

      for (const material of materials) {
        try {
          // Get latest price from Lowe's
          const priceData = await lowesService.getProductPrice(material.sku);
          const newPrice = priceData.price;

          if (newPrice !== material.unit_price) {
            // Start transaction
            await db.query('START TRANSACTION');

            // Update material price
            await db.query(
              'UPDATE materials SET unit_price = ?, last_updated = NOW() WHERE id = ?',
              [newPrice, material.id]
            );

            // Record price history
            await db.query(
              `INSERT INTO material_price_history (
                material_id,
                price,
                recorded_at
              ) VALUES (?, ?, NOW())`,
              [material.id, newPrice]
            );

            await db.query('COMMIT');
          }
        } catch (error) {
          Logger.error(`Failed to sync material ${material.sku}:`, error);
          continue;
        }
      }

      Logger.info('Material sync completed');
    } catch (error) {
      Logger.error('Material sync failed:', error);
      throw error;
    }
  }

  async searchMaterials(
    query: string,
    category?: string
  ): Promise<Material[]> {
    try {
      const searchQuery = `
        SELECT *
        FROM materials
        WHERE
          (name LIKE ? OR description LIKE ?)
          ${category ? 'AND category = ?' : ''}
        ORDER BY name ASC
        LIMIT 50
      `;

      const searchParams = [
        `%${query}%`,
        `%${query}%`,
        ...(category ? [category] : []),
      ];

      return db.query(searchQuery, searchParams);
    } catch (error) {
      Logger.error('Material search failed:', error);
      throw error;
    }
  }

  async getMaterialById(id: string): Promise<Material | null> {
    try {
      const [material] = await db.query(
        'SELECT * FROM materials WHERE id = ?',
        [id]
      );
      return material || null;
    } catch (error) {
      Logger.error('Failed to get material:', error);
      throw error;
    }
  }

  async getMaterialPriceHistory(
    id: string,
    days: number = 30
  ): Promise<Array<{ price: number; recorded_at: Date }>> {
    try {
      return db.query(
        `SELECT price, recorded_at
        FROM material_price_history
        WHERE
          material_id = ?
          AND recorded_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        ORDER BY recorded_at ASC`,
        [id, days]
      );
    } catch (error) {
      Logger.error('Failed to get material price history:', error);
      throw error;
    }
  }
}

export const materialService = new MaterialService();