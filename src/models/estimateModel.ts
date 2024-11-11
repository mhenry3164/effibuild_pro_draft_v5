import { query } from '@/config/database';
import type { Estimate, EstimateItem } from '@/types';

interface CreateEstimateData {
  projectId: string;
  status?: 'draft' | 'sent' | 'approved' | 'rejected';
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
}

interface UpdateEstimateData {
  status?: 'draft' | 'sent' | 'approved' | 'rejected';
  items?: Array<{
    id?: string;
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
}

class EstimateModel {
  async createEstimate(data: CreateEstimateData): Promise<Estimate> {
    try {
      // Start transaction
      await query('START TRANSACTION');

      // Create estimate
      const estimateSql = `
        INSERT INTO estimates (project_id, status)
        VALUES (?, ?)
      `;

      const estimateResult = await query(estimateSql, [
        data.projectId,
        data.status || 'draft',
      ]);

      const estimateId = (estimateResult as any).insertId;

      // Create estimate items
      const itemsSql = `
        INSERT INTO estimate_items (
          estimate_id, description, quantity, unit_price, total
        ) VALUES ?
      `;

      const itemsValues = data.items.map(item => [
        estimateId,
        item.description,
        item.quantity,
        item.unitPrice,
        item.quantity * item.unitPrice,
      ]);

      await query(itemsSql, [itemsValues]);

      // Update estimate total
      const totalSql = `
        UPDATE estimates
        SET total = (
          SELECT SUM(total)
          FROM estimate_items
          WHERE estimate_id = ?
        )
        WHERE id = ?
      `;

      await query(totalSql, [estimateId, estimateId]);

      // Commit transaction
      await query('COMMIT');

      return this.getEstimateById(estimateId);
    } catch (error) {
      // Rollback on error
      await query('ROLLBACK');
      console.error('Error creating estimate:', error);
      throw new Error('Failed to create estimate');
    }
  }

  async getEstimates(projectId?: string): Promise<Estimate[]> {
    try {
      let sql = `
        SELECT 
          e.id,
          e.project_id as projectId,
          e.total,
          e.status,
          e.created_at as createdAt,
          e.updated_at as updatedAt
        FROM estimates e
      `;

      const params: any[] = [];
      if (projectId) {
        sql += ' WHERE e.project_id = ?';
        params.push(projectId);
      }

      sql += ' ORDER BY e.created_at DESC';

      const estimates = await query(sql, params) as Estimate[];

      // Fetch items for each estimate
      for (const estimate of estimates) {
        estimate.items = await this.getEstimateItems(estimate.id);
      }

      return estimates;
    } catch (error) {
      console.error('Error fetching estimates:', error);
      throw new Error('Failed to fetch estimates');
    }
  }

  async getEstimateById(id: string): Promise<Estimate> {
    try {
      const sql = `
        SELECT 
          e.id,
          e.project_id as projectId,
          e.total,
          e.status,
          e.created_at as createdAt,
          e.updated_at as updatedAt
        FROM estimates e
        WHERE e.id = ?
      `;

      const results = await query(sql, [id]);
      const estimates = results as Estimate[];

      if (estimates.length === 0) {
        throw new Error('Estimate not found');
      }

      const estimate = estimates[0];
      estimate.items = await this.getEstimateItems(id);

      return estimate;
    } catch (error) {
      console.error('Error fetching estimate:', error);
      throw new Error('Failed to fetch estimate');
    }
  }

  private async getEstimateItems(estimateId: string): Promise<EstimateItem[]> {
    const sql = `
      SELECT 
        id,
        description,
        quantity,
        unit_price as unitPrice,
        total
      FROM estimate_items
      WHERE estimate_id = ?
      ORDER BY id
    `;

    return query(sql, [estimateId]) as Promise<EstimateItem[]>;
  }

  async updateEstimate(id: string, data: UpdateEstimateData): Promise<Estimate> {
    try {
      // Start transaction
      await query('START TRANSACTION');

      const updates: string[] = [];
      const values: any[] = [];

      if (data.status) {
        updates.push('status = ?');
        values.push(data.status);
      }

      if (updates.length > 0) {
        const sql = `
          UPDATE estimates
          SET ${updates.join(', ')}, updated_at = NOW()
          WHERE id = ?
        `;
        values.push(id);
        await query(sql, values);
      }

      if (data.items) {
        // Delete existing items
        await query('DELETE FROM estimate_items WHERE estimate_id = ?', [id]);

        // Insert new items
        const itemsSql = `
          INSERT INTO estimate_items (
            estimate_id, description, quantity, unit_price, total
          ) VALUES ?
        `;

        const itemsValues = data.items.map(item => [
          id,
          item.description,
          item.quantity,
          item.unitPrice,
          item.quantity * item.unitPrice,
        ]);

        await query(itemsSql, [itemsValues]);

        // Update estimate total
        const totalSql = `
          UPDATE estimates
          SET total = (
            SELECT SUM(total)
            FROM estimate_items
            WHERE estimate_id = ?
          )
          WHERE id = ?
        `;

        await query(totalSql, [id, id]);
      }

      // Commit transaction
      await query('COMMIT');

      return this.getEstimateById(id);
    } catch (error) {
      // Rollback on error
      await query('ROLLBACK');
      console.error('Error updating estimate:', error);
      throw new Error('Failed to update estimate');
    }
  }

  async deleteEstimate(id: string): Promise<boolean> {
    try {
      const sql = 'DELETE FROM estimates WHERE id = ?';
      const result = await query(sql, [id]);
      return (result as any).affectedRows > 0;
    } catch (error) {
      console.error('Error deleting estimate:', error);
      throw new Error('Failed to delete estimate');
    }
  }
}

export const estimateModel = new EstimateModel();