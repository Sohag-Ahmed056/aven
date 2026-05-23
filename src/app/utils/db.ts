import mongoose from 'mongoose';
import config from '../../config/index.js';

export const connectDB = async (): Promise<void> => {
  const dbUrl = config.database_url;
  if (!dbUrl) {
    console.error('❌ MongoDB Connection URI is missing in configuration!');
    process.exit(1);
  }

  const connect = async () => {
    try {
      await mongoose.connect(dbUrl, {
        autoIndex: true,
      });
      console.log('✅ Connected to MongoDB database successfully: ecommerceDB');
    } catch (error) {
      console.error('❌ MongoDB database connection error:', error);
      console.log('⚠️ Attempting to reconnect in 5 seconds...');
      setTimeout(connect, 5000);
    }
  };

  // Mongoose connection event listeners
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB connection lost! Trying to reconnect...');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`❌ Mongoose connection error: ${err}`);
  });

  await connect();
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('👋 Mongoose connection disconnected gracefully.');
  } catch (error) {
    console.error('Error during Mongoose disconnection:', error);
  }
};
