import express from 'express';
import estimatesRouter from './estimates';
import materialsRouter from './materials';
import laborRouter from './labor';

const router = express.Router();

router.use('/estimates', estimatesRouter);
router.use('/materials', materialsRouter);
router.use('/labor', laborRouter);

export default router;