import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables from .env file
dotenv.config();

// Get the MongoDB URI from the .env file
const dbURI: string | undefined = process.env.DB_URI;

// Check if the dbURI exists
if (!dbURI) {
  throw new Error(
    'MongoDB connection string is not defined in the environment variables.',
  );
}

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(dbURI);
      console.log('Database connected successfully');
    }
  } catch (err) {
    console.error('Database connection error:', err);
  }
};

// Default export of the API handler
export default async function handler(req, res) {
  await connectToDatabase();
  res.status(200).json({ message: 'Connected to MongoDB' });
}
