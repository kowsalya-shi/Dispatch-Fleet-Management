require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const logger = require('./config/logger');
const database = require('./config/database');
const redis = require('./config/redis');

class FleetManagementServer {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socketIo(this.server, {
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? process.env.FRONTEND_URL 
          : ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5500"],
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });
    
    this.port = process.env.PORT || 3000;
    this.host = process.env.HOST || 'localhost';
    this.isShuttingDown = false;
  }

  async initialize() {
    try {
      // Connect to databases
      await database.connect();
      await redis.connect();
      
      // Setup middleware
      this.setupMiddleware();
      
      // Setup routes
      this.setupRoutes();
      
      // Setup WebSocket handlers
      this.setupWebSocket();
      
      // Setup error handlers
      this.setupErrorHandlers();
      
      // Setup graceful shutdown
      this.setupGracefulShutdown();
      
      logger.info('Server initialized successfully');
      
    } catch (error) {
      logger.error('Server initialization failed', { error: error.message });
      process.exit(1);
    }
  }

  setupMiddleware() {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));
    
    // CORS configuration
    this.app.use(cors({
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : true,
      credentials: true
    }));
    
    // Compression and parsing
    this.app.use(compression());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    // Logging
    if (process.env.NODE_ENV !== 'test') {
      this.app.use(morgan('combined', {
        stream: {
          write: (message) => logger.info(message.trim())
        }
      }));
    }
    
    logger.info('Middleware configured');
  }

  setupRoutes() {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: database.getStatus(),
        redis: redis.getStatus(),
        memory: process.memoryUsage(),
        version: process.env.npm_package_version || '1.0.0'
      };
      
      res.json(health);
    });

    // API routes
    const authRoutes = require('./routes/auth');
    const vehicleRoutes = require('./routes/vehicles');
    const orderRoutes = require('./routes/orders');
    const driverRoutes = require('./routes/drivers');
    const gpsRoutes = require('./routes/gps');

    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/vehicles', vehicleRoutes);
    this.app.use('/api/orders', orderRoutes);
    this.app.use('/api/drivers', driverRoutes);
    this.app.use('/api/gps', gpsRoutes);

    // API info endpoint
    this.app.get('/api', (req, res) => {
      res.json({ 
        message: 'Fleet Management API',
        version: '1.0.0',
        endpoints: {
          health: '/health',
          auth: '/api/auth',
          vehicles: '/api/vehicles',
          orders: '/api/orders',
          drivers: '/api/drivers',
          gps: '/api/gps',
          routes: '/api/routes (coming soon)'
        }
      });
    });

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`,
        timestamp: new Date().toISOString()
      });
    });
    
    logger.info('Routes configured');
  }

  setupWebSocket() {
    this.io.on('connection', (socket) => {
      logger.info('Client connected', { 
        socketId: socket.id,
        clientIP: socket.handshake.address 
      });

      // Basic connection handling
      socket.on('disconnect', (reason) => {
        logger.info('Client disconnected', { 
          socketId: socket.id,
          reason 
        });
      });

      // Heartbeat for connection monitoring
      socket.on('ping', () => {
        socket.emit('pong', { timestamp: Date.now() });
      });

      // Error handling
      socket.on('error', (error) => {
        logger.error('Socket error', { 
          socketId: socket.id,
          error: error.message 
        });
      });
    });
    
    logger.info('WebSocket configured');
  }

  setupErrorHandlers() {
    // Express error handler
    this.app.use((error, req, res, next) => {
      logger.error('Express error', {
        error: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method
      });

      if (res.headersSent) {
        return next(error);
      }

      res.status(error.status || 500).json({
        error: process.env.NODE_ENV === 'production' 
          ? 'Internal Server Error' 
          : error.message,
        timestamp: new Date().toISOString()
      });
    });

    // Unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Promise Rejection', {
        reason: reason.toString(),
        promise: promise.toString()
      });
    });

    // Uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception', {
        error: error.message,
        stack: error.stack
      });
      
      this.gracefulShutdown('UNCAUGHT_EXCEPTION');
    });
    
    logger.info('Error handlers configured');
  }

  setupGracefulShutdown() {
    const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
    
    signals.forEach(signal => {
      process.on(signal, () => {
        logger.info(`Received ${signal}, starting graceful shutdown`);
        this.gracefulShutdown(signal);
      });
    });
  }

  async gracefulShutdown(signal) {
    if (this.isShuttingDown) {
      logger.warn('Shutdown already in progress');
      return;
    }
    
    this.isShuttingDown = true;
    logger.info('Starting graceful shutdown', { signal });

    try {
      // Stop accepting new connections
      this.server.close(() => {
        logger.info('HTTP server closed');
      });

      // Close WebSocket connections
      this.io.close(() => {
        logger.info('WebSocket server closed');
      });

      // Close database connections
      await database.disconnect();
      await redis.disconnect();

      logger.info('Graceful shutdown completed');
      process.exit(0);
      
    } catch (error) {
      logger.error('Error during graceful shutdown', { error: error.message });
      process.exit(1);
    }
  }

  async start() {
    try {
      await this.initialize();
      
      this.server.listen(this.port, this.host, () => {
        logger.info('Fleet Management Server started', {
          port: this.port,
          host: this.host,
          environment: process.env.NODE_ENV,
          pid: process.pid
        });
      });
      
    } catch (error) {
      logger.error('Failed to start server', { error: error.message });
      process.exit(1);
    }
  }
}

// Start server if this file is run directly
if (require.main === module) {
  const server = new FleetManagementServer();
  server.start();
}

module.exports = FleetManagementServer;