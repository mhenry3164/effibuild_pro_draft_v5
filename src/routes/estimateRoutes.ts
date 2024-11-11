import { Router } from 'express';
import { estimateModel } from '@/models';
import { PermissionGate } from '@/components/auth/PermissionGate';
import { validateRequest } from '@/middleware/validateRequest';
import { createEstimateSchema, updateEstimateSchema } from '@/schemas/estimateSchema';
import type { Request, Response } from 'express';

const router = Router();

router.post('/',
  PermissionGate(['estimates:create']),
  validateRequest(createEstimateSchema),
  async (req: Request, res: Response) => {
    try {
      const estimate = await estimateModel.createEstimate(req.body);
      res.status(201).json(estimate);
    } catch (error) {
      console.error('Error creating estimate:', error);
      res.status(500).json({ error: 'Failed to create estimate' });
    }
  }
);

router.get('/',
  PermissionGate(['estimates:read']),
  async (req: Request, res: Response) => {
    try {
      const { projectId } = req.query;
      const estimates = await estimateModel.getEstimates(projectId as string);
      res.json(estimates);
    } catch (error) {
      console.error('Error fetching estimates:', error);
      res.status(500).json({ error: 'Failed to fetch estimates' });
    }
  }
);

router.get('/:id',
  PermissionGate(['estimates:read']),
  async (req: Request, res: Response) => {
    try {
      const estimate = await estimateModel.getEstimateById(req.params.id);
      if (!estimate) {
        return res.status(404).json({ error: 'Estimate not found' });
      }
      res.json(estimate);
    } catch (error) {
      console.error('Error fetching estimate:', error);
      res.status(500).json({ error: 'Failed to fetch estimate' });
    }
  }
);

router.put('/:id',
  PermissionGate(['estimates:update']),
  validateRequest(updateEstimateSchema),
  async (req: Request, res: Response) => {
    try {
      const estimate = await estimateModel.updateEstimate(req.params.id, req.body);
      res.json(estimate);
    } catch (error) {
      console.error('Error updating estimate:', error);
      res.status(500).json({ error: 'Failed to update estimate' });
    }
  }
);

router.delete('/:id',
  PermissionGate(['estimates:delete']),
  async (req: Request, res: Response) => {
    try {
      const success = await estimateModel.deleteEstimate(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Estimate not found' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting estimate:', error);
      res.status(500).json({ error: 'Failed to delete estimate' });
    }
  }
);

export default router;