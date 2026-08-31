const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async (uri) => {
  if (cachedConnection) {
    return cachedConnection;
  }

  const mongoURI = uri || process.env.MONGO_URI || 'mongodb://localhost:27017/taskflow';
  
  try {
    cachedConnection = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${cachedConnection.connection.host}`);
    return cachedConnection;
  } catch (error) {
    cachedConnection = null;
    console.error(`Error connecting to MongoDB: ${error.message}`);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;
