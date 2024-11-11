import { Router } from 'express';
import { projectModel } from '@/models';
import { PermissionGate } from '@/components/auth/PermissionGate';
import { validateRequest } from '@/middleware/validateRequest';
import { createProjectSchema, updateProjectSchema } from '@/schemas/projectSchema';
import type { Request, Response } from 'express';

const router = Router();

router.post('/',
  PermissionGate(['projects:create']),
  validateRequest(createProjectSchema),
  async (req: Request, res: Response) => {
    try {
      const project = await projectModel.createProject(req.body);
      res.status(201).json(project);
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ error: 'Failed to create project' });
    }
  }
);

router.get('/',
  PermissionGate(['projects:read']),
  async (req: Request, res: Response) => {
    try {
      const { clientId } = req.query;
      const projects = await projectModel.getProjects(clientId as string);
      res.json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  }
);

router.get('/:id',
  PermissionGate(['projects:read']),
  async (req: Request, res: Response) => {
    try {
      const project = await projectModel.getProjectById(req.params.id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json(project);
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  }
);

router.put('/:id',
  PermissionGate(['projects:update']),
  validateRequest(updateProjectSchema),
  async (req: Request, res: Response) => {
    try {
      const project = await projectModel.updateProject(req.params.id, req.body);
      res.json(project);
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ error: 'Failed to update project' });
    }
  }
);

router.delete('/:id',
  PermissionGate(['projects:delete']),
  async (req: Request, res: Response) => {
    try {
      const success = await projectModel.deleteProject(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ error: 'Failed to delete project' });
    }
  }
);

export default router;