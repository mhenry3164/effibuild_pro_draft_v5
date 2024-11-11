import express from 'express';
import { checkPermission } from '@/middleware/checkPermission';
import { db } from '@/lib/db';
import Logger from '@/lib/utils/logger';
import type { LaborRate, ComplexityLevel } from '@/types/labor';

const router = express.Router();

// Get labor rates for client
router.get(
  '/rates/:clientId',
  checkPermission(['estimates:read']),
  async (req, res) => {
    try {
      const rates = await db.query(
        'SELECT * FROM labor_rates WHERE client_id = ?',
        [req.params.clientId]
      );
      res.json(rates);
    } catch (error) {
      Logger.error('Failed to fetch labor rates:', error);
      res.status(500).json({ error: 'Failed to fetch labor rates' });
    }
  }
);

// Calculate labor cost
router.post(
  '/calculate',
  checkPermission(['estimates:create']),
  async (req, res) => {
    try {
      const {
        clientId,
        projectType,
        area,
        complexity,
        additionalFactors = [],
      } = req.body;

      // Get client-specific labor rate
      const [rate] = await db.query(
        'SELECT * FROM labor_rates WHERE client_id = ? AND project_type = ?',
        [clientId, projectType]
      );

      if (!rate) {
        return res.status(404).json({ error: 'Labor rate not found' });
      }

      // Calculate base hours
      const baseHours = area * 0.5; // Simplified calculation

      // Apply complexity factor
      const complexityFactor = rate.complexity_factors[complexity as ComplexityLevel];
      const adjustedHours = baseHours * complexityFactor;

      // Apply additional factors
      const finalHours = additionalFactors.reduce((hours, factor) => {
        switch (factor) {
          case 'difficult_access':
            return hours * 1.2;
          case 'height_work':
            return hours * 1.3;
          case 'weather_conditions':
            return hours * 1.15;
          default:
            return hours;
        }
      }, adjustedHours);

      // Calculate total cost
      const totalCost = finalHours * rate.base_rate;

      res.json({
        hours: finalHours,
        rate: rate.base_rate,
        complexityFactor,
        totalCost,
        breakdown: {
          baseHours,
          adjustments: additionalFactors.map(factor => ({
            factor,
            value: factor === 'difficult_access' ? 1.2 :
                   factor === 'height_work' ? 1.3 :
                   factor === 'weather_conditions' ? 1.15 : 1,
          })),
        },
      });
    } catch (error) {
      Logger.error('Labor calculation failed:', error);
      res.status(500).json({ error: 'Failed to calculate labor cost' });
    }
  }
);

export default router;