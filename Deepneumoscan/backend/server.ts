import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import assessmentRoutes from './routes/assessments';
import xrayRoutes from './routes/xray';
import historyRoutes from './routes/history';
import hospitalRoutes from './routes/hospitals';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: true, // Allow all origins in development
  methods: ['GET','POST','DELETE','PUT','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/xray', xrayRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/hospitals', hospitalRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'DeepNeumoScan Backend Running 🩺' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});