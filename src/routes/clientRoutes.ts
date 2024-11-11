import { Router } from 'express';
import { clientModel } from '@/models';
import { PermissionGate } from '@/components/auth/PermissionGate';
import { validateRequest } from '@/middleware/validateRequest';
import { createClientSchema, updateClientSchema } from '@/schemas/clientSchema';
import type { Request, Response } from 'express';

const router = Router();

router.post('/',
  PermissionGate(['clients:create']),
  validateRequest(createClientSchema),
  async (req: Request, res: Response) => {
    try {
      const client = await clientModel.createClient(req.body);
      res.status(201).json(client);
    } catch (error) {
      console.error('Error creating client:', error);
      res.status(500).json({ error: 'Failed to create client' });
    }
  }
);

router.get('/',
  PermissionGate(['clients:read']),
  async (_req: Request, res: Response) => {
    try {
      const clients = await clientModel.getClients();
      res.json(clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      res.status(500).json({ error: 'Failed to fetch clients' });
    }
  }
);

router.get('/:id',
  PermissionGate(['clients:read']),
  async (req: Request, res: Response) => {
    try {
      const client = await clientModel.getClientById(req.params.id);
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
      res.json(client);
    } catch (error) {
      console.error('Error fetching client:', error);
      res.status(500).json({ error: 'Failed to fetch client' });
    }
  }
);

router.put('/:id',
  PermissionGate(['clients:update']),
  validateRequest(updateClientSchema),
  async (req: Request, res: Response) => {
    try {
      const client = await clientModel.updateClient(req.params.id, req.body);
      res.json(client);
    } catch (error) {
      console.error('Error updating client:', error);
      res.status(500).json({ error: 'Failed to update client' });
    }
  }
);

router.delete('/:id',
  PermissionGate(['clients:delete']),
  async (req: Request, res: Response) => {
    try {
      const success = await clientModel.deleteClient(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Client not found' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting client:', error);
      res.status(500).json({ error: 'Failed to delete client' });
    }
  }
);

export default router;