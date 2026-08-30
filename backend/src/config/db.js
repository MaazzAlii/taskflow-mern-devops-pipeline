const mongoose = require('mongoose');

const connectDB = async (uri) => {
  try {
    const mongoURI = uri || process.env.MONGO_URI || 'mongodb://localhost:27017/taskflow';
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;
