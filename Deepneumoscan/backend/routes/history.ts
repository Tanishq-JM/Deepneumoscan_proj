import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { readData } from '../utils/jsonDb';

const router = Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const assessments = readData<any>('assessments')
      .filter(a => a.userId === req.user!.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
    const xrayResults = readData<any>('xray_results')
      .filter(r => r.userId === req.user!.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      assessments,
      xrayResults,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;