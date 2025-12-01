import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(__dirname, '../data');
console.log('Database directory:', DATA_DIR);

export const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const files = ['users.json', 'assessments.json', 'xray_results.json'];
  files.forEach(file => {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }
  });
};

export const readData = <T>(file: string): T[] => {
  const filePath = path.join(DATA_DIR, `${file}.json`);
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, 'utf-8');
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export const writeData = <T>(file: string, data: T[]) => {
  const filePath = path.join(DATA_DIR, `${file}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};
