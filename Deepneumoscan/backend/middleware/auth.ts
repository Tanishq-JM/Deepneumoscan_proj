import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { readData } from '../utils/jsonDb';

const JWT_SECRET = process.env.JWT_SECRET || 'deepneumoscan_local_secret';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const users = readData<any>('users');
    const user = users.find((u: any) => u.id === decoded.id);
    
    if (!user) {
      res.status(403).json({ error: 'User not found' });
      return;
    }
    req.user = { id: user.id, email: user.email };
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
    return;
  }
};