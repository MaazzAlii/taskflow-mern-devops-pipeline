const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async (uri) => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const mongoURI =
    uri ||
    process.env.MONGO_URI ||
    process.env.MONGODB_URI;

  if (!mongoURI) {
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      throw new Error(
        'MongoDB connection error: MONGO_URI or MONGODB_URI environment variable is not defined in Vercel Project Settings.'
      );
    }
  }

  const finalURI = mongoURI || 'mongodb://localhost:27017/taskflow';

  try {
    // Disable buffering in serverless so queries fail fast with clear errors if DB is unreachable
    if (process.env.VERCEL) {
      mongoose.set('bufferCommands', false);
    }

    cachedConnection = await mongoose.connect(finalURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${cachedConnection.connection.host}`);
    return cachedConnection;
  } catch (error) {
    cachedConnection = null;
    console.error(`Error connecting to MongoDB: ${error.message}`);
    if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;
