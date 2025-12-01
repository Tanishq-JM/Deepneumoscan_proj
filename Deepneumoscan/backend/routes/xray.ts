import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateToken } from '../middleware/auth';
import { readData, writeData, generateId } from '../utils/jsonDb';

const router = Router();

interface XrayResult {
  id: string;
  userId: string;
  imageUrl: string;
  age: number;
  gender: string;
  smoking: boolean;
  medicalHistory: string;
  prediction: string;
  confidence: number;
  modelUsed: string;
  createdAt: string;
}

// Configure multer
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG images allowed'));
    }
  },
});

router.use(authenticateToken);

// Mock AI prediction function
function mockPredict(age: number, smoking: boolean) {
  const confidence = 70 + Math.random() * 30; // 70–100%
  const model = confidence >= 90 ? 'KNN' : 'SVM';
  const prediction = Math.random() > 0.4 ? 'Pneumonia' : 'Normal';
  return { prediction, confidence, model };
}

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { age, gender, smoking, medicalHistory } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Image required' });

    const mock = mockPredict(parseInt(age), smoking === 'true');
    const results = readData<XrayResult>('xray_results');

    const newResult: XrayResult = {
      id: generateId(),
      userId: req.user!.id,
      imageUrl: `/uploads/${req.file.filename}`,
      age: parseInt(age),
      gender,
      smoking: smoking === 'true',
      medicalHistory: medicalHistory || '',
      prediction: mock.prediction,
      confidence: mock.confidence,
      modelUsed: mock.model,
      createdAt: new Date().toISOString()
    };

    results.push(newResult);
    writeData('xray_results', results);

    res.json(newResult);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

router.get('/', async (req, res) => {
  try {
    const results = readData<XrayResult>('xray_results');
    const userResults = results
      .filter(r => r.userId === req.user!.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(userResults);
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const results = readData<XrayResult>('xray_results');
    const index = results.findIndex(r => r.id === req.params.id && r.userId === req.user!.id);
    
    if (index === -1) return res.status(404).json({ error: 'Not found' });
    
    results.splice(index, 1);
    writeData('xray_results', results);
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

export default router;