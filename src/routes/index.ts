import { Router } from 'express';
import userRoutes from './userRoutes';
import clientRoutes from './clientRoutes';
import projectRoutes from './projectRoutes';
import estimateRoutes from './estimateRoutes';

const router = Router();

router.use('/users', userRoutes);
router.use('/clients', clientRoutes);
router.use('/projects', projectRoutes);
router.use('/estimates', estimateRoutes);

export default router;