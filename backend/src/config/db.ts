import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nutrimind';

export const connectDB = async (): Promise<void> => {
  try {
    if (MONGODB_URI.includes('<db_password>')) {
      console.warn('\x1b[33m%s\x1b[0m', 'WARNING: MONGODB_URI contains <db_password> placeholder. Please replace it in backend/.env with your actual password.');
    }
    
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`\x1b[32mMongoDB Connected: ${conn.connection.host}\x1b[0m`);
  } catch (error) {
    console.error(`MongoDB Connection to Atlas failed: ${(error as Error).message}`);
    
    // Check if network resolution failed, and attempt to fallback to local MongoDB
    if (MONGODB_URI.startsWith('mongodb+srv://')) {
      console.log('\x1b[33m%s\x1b[0m', 'Attempting connection fallback to local MongoDB (mongodb://127.0.0.1:27017/nutrimind)...');
      try {
        const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/nutrimind');
        console.log(`\x1b[32mFallback Successful! MongoDB Connected Locally: ${localConn.connection.host}\x1b[0m`);
      } catch (localError) {
        console.error(`Local MongoDB Connection failed: ${(localError as Error).message}`);
        console.error('\x1b[31m%s\x1b[0m', 'Please ensure either your database password in backend/.env is correct, your DNS allows SRV connections, or you have a local MongoDB server running.');
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
};
