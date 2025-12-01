import { Router } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { readData, writeData, generateId } from '../utils/jsonDb';

const JWT_SECRET = process.env.JWT_SECRET || 'deepneumoscan_local_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

const router = Router();

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, username } = req.body;
    const finalName = (name || username || '').trim();
    if (!email || !password || !finalName) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const users = readData<User>('users');
    const normalizedEmail = email.trim().toLowerCase();
    const existing = users.find(u => u.email === normalizedEmail);
    if (existing) return res.status(400).json({ error: 'User exists' });

    const newUser: User = {
      id: generateId(),
      email: normalizedEmail,
      password, // NOTE: In production hash this password.
      name: finalName
    };

    users.push(newUser);
    writeData('users', users);

    const expiresIn: string | number = JWT_EXPIRES_IN;
    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn });

    res.status(201).json({
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);
    
    const users = readData<User>('users');
    console.log(`Total users in database: ${users.length}`);
    console.log('Users:', users.map(u => ({ email: u.email, name: u.name })));
    
    const normalizedEmail = email.trim().toLowerCase();
    console.log(`Normalized email: ${normalizedEmail}`);
    
    const user = users.find(u => u.email === normalizedEmail && u.password === password);
    
    if (!user) {
      const emailMatch = users.find(u => u.email === normalizedEmail);
      console.log(`Email found: ${!!emailMatch}`);
      if (emailMatch) console.log(`Password mismatch for user: ${normalizedEmail}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('Login successful');
    const expiresIn: string | number = JWT_EXPIRES_IN;
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;