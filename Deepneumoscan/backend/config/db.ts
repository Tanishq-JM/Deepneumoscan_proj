import { ensureDataDir } from '../utils/jsonDb';

const connectDB = async () => {
  try {
    ensureDataDir();
    console.log("✅ Local JSON Database initialized");
  } catch (err) {
    console.error("Database initialization error:", err);
  }
};

export default connectDB;