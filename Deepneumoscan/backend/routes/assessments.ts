import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { readData, writeData, generateId } from '../utils/jsonDb';

const router = Router();

interface Assessment {
  id: string;
  userId: string;
  type: string;
  answers: any;
  score: number;
  riskLevel: string;
  createdAt: string;
}

router.use(authenticateToken);

router.post('/', async (req, res) => {
  try {
    const { type, answers, score, riskLevel } = req.body;
    const assessments = readData<Assessment>('assessments');
    
    const newAssessment: Assessment = {
      id: generateId(),
      userId: req.user!.id,
      type,
      answers,
      score,
      riskLevel,
      createdAt: new Date().toISOString()
    };

    assessments.push(newAssessment);
    writeData('assessments', assessments);
    
    res.status(201).json(newAssessment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save assessment' });
  }
});

router.get('/', async (req, res) => {
  try {
    const assessments = readData<Assessment>('assessments');
    const userAssessments = assessments
      .filter(a => a.userId === req.user!.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(userAssessments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const assessments = readData<Assessment>('assessments');
    const index = assessments.findIndex(a => a.id === req.params.id && a.userId === req.user!.id);
    
    if (index === -1) return res.status(404).json({ error: 'Not found' });
    
    assessments.splice(index, 1);
    writeData('assessments', assessments);
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

export default router;