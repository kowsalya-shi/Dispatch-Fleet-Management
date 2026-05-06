const redis = require('redis');
const logger = require('./logger');

class RedisConnection {
  constructor() {
    this.client = null;
    this.pubClient = null;
    this.subClient = null;
    this.isConnected = false;
    this.retryCount = 0;
    this.maxRetries = 5;
  }

  async connect() {
    try {
      const redisConfig = {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        retryDelayOnFailover: 100,
        enableReadyCheck: true,
        maxRetriesPerRequest: 3,
        lazyConnect: true
      };

      // Main Redis client
      this.client = redis.createClient(redisConfig);
      
      // Pub/Sub clients
      this.pubClient = redis.createClient(redisConfig);
      this.subClient = redis.createClient(redisConfig);

      // Setup error handlers
      this.client.on('error', this.handleError.bind(this, 'main'));
      this.pubClient.on('error', this.handleError.bind(this, 'pub'));
      this.subClient.on('error', this.handleError.bind(this, 'sub'));

      // Setup connection handlers
      this.client.on('connect', () => this.handleConnect('main'));
      this.pubClient.on('connect', () => this.handleConnect('pub'));
      this.subClient.on('connect', () => this.handleConnect('sub'));

      this.client.on('ready', () => this.handleReady('main'));
      this.pubClient.on('ready', () => this.handleReady('pub'));
      this.subClient.on('ready', () => this.handleReady('sub'));

      // Connect all clients
      await Promise.all([
        this.client.connect(),
        this.pubClient.connect(),
        this.subClient.connect()
      ]);

      this.isConnected = true;
      this.retryCount = 0;
      
      logger.info('Redis connected successfully', {
        host: redisConfig.host,
        port: redisConfig.port
      });

    } catch (error) {
      this.isConnected = false;
      logger.error('Redis connection failed', { error: error.message });
      await this.handleRetry();
    }
  }

  handleError(clientType, error) {
    logger.error(`Redis ${clientType} client error`, { error: error.message });
    this.isConnected = false;
  }

  handleConnect(clientType) {
    logger.debug(`Redis ${clientType} client connecting`);
  }

  handleReady(clientType) {
    logger.debug(`Redis ${clientType} client ready`);
  }

  async handleRetry() {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      const delay = Math.min(1000 * Math.pow(2, this.retryCount), 30000);
      
      logger.info(`Retrying Redis connection in ${delay}ms (attempt ${this.retryCount}/${this.maxRetries})`);
      
      setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      logger.warn('Max Redis connection retries exceeded, continuing without Redis');
    }
  }

  async disconnect() {
    try {
      if (this.client) await this.client.quit();
      if (this.pubClient) await this.pubClient.quit();
      if (this.subClient) await this.subClient.quit();
      
      this.isConnected = false;
      logger.info('Redis disconnected gracefully');
    } catch (error) {
      logger.error('Error disconnecting Redis', { error: error.message });
    }
  }

  // Cache operations with fallback
  async get(key) {
    try {
      if (!this.isConnected) return null;
      return await this.client.get(key);
    } catch (error) {
      logger.warn('Redis GET failed, falling back', { key, error: error.message });
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    try {
      if (!this.isConnected) return false;
      await this.client.setEx(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.warn('Redis SET failed', { key, error: error.message });
      return false;
    }
  }

  async del(key) {
    try {
      if (!this.isConnected) return false;
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.warn('Redis DEL failed', { key, error: error.message });
      return false;
    }
  }

  // Pub/Sub operations
  async publish(channel, message) {
    try {
      if (!this.isConnected) return false;
      await this.pubClient.publish(channel, JSON.stringify(message));
      return true;
    } catch (error) {
      logger.warn('Redis PUBLISH failed', { channel, error: error.message });
      return false;
    }
  }

  async subscribe(channel, callback) {
    try {
      if (!this.isConnected) return false;
      await this.subClient.subscribe(channel, (message) => {
        try {
          callback(JSON.parse(message));
        } catch (error) {
          logger.error('Error parsing Redis message', { channel, error: error.message });
        }
      });
      return true;
    } catch (error) {
      logger.warn('Redis SUBSCRIBE failed', { channel, error: error.message });
      return false;
    }
  }

  getStatus() {
    return {
      isConnected: this.isConnected,
      retryCount: this.retryCount,
      clientReady: this.client?.isReady || false,
      pubClientReady: this.pubClient?.isReady || false,
      subClientReady: this.subClient?.isReady || false
    };
  }
}

module.exports = new RedisConnection();