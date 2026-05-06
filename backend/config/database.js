const mongoose = require('mongoose');
const logger = require('./logger');

class DatabaseConnection {
  constructor() {
    this.isConnected = false;
    this.retryCount = 0;
    this.maxRetries = 5;
  }

  async connect() {
    try {
      const mongoUri = process.env.NODE_ENV === 'test' 
        ? process.env.MONGODB_TEST_URI 
        : process.env.MONGODB_URI;

      const options = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
        bufferMaxEntries: 0
      };

      await mongoose.connect(mongoUri, options);
      this.isConnected = true;
      this.retryCount = 0;
      
      logger.info('MongoDB connected successfully', { 
        uri: mongoUri.replace(/\/\/.*@/, '//***:***@'),
        environment: process.env.NODE_ENV 
      });

      // Handle connection events
      mongoose.connection.on('error', this.handleError.bind(this));
      mongoose.connection.on('disconnected', this.handleDisconnect.bind(this));
      mongoose.connection.on('reconnected', this.handleReconnect.bind(this));

    } catch (error) {
      this.isConnected = false;
      logger.error('MongoDB connection failed', { error: error.message });
      await this.handleRetry();
    }
  }

  async handleError(error) {
    logger.error('MongoDB connection error', { error: error.message });
    this.isConnected = false;
  }

  async handleDisconnect() {
    logger.warn('MongoDB disconnected');
    this.isConnected = false;
    await this.handleRetry();
  }

  handleReconnect() {
    logger.info('MongoDB reconnected');
    this.isConnected = true;
    this.retryCount = 0;
  }

  async handleRetry() {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      const delay = Math.min(1000 * Math.pow(2, this.retryCount), 30000);
      
      logger.info(`Retrying MongoDB connection in ${delay}ms (attempt ${this.retryCount}/${this.maxRetries})`);
      
      setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      logger.error('Max MongoDB connection retries exceeded');
      process.exit(1);
    }
  }

  async disconnect() {
    if (this.isConnected) {
      await mongoose.connection.close();
      this.isConnected = false;
      logger.info('MongoDB disconnected gracefully');
    }
  }

  getStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      retryCount: this.retryCount
    };
  }
}

module.exports = new DatabaseConnection();