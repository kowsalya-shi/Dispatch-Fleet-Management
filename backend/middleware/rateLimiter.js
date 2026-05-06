const rateLimit = require('express-rate-limit');
const logger = require('../config/logger');

/**
 * Create rate limiter with custom options
 */
const createRateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests',
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        url: req.originalUrl,
        method: req.method,
        userId: req.user?.userId
      });

      res.status(429).json(options.message || defaultOptions.message);
    },
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === '/health';
    },
    keyGenerator: (req) => {
      // Use user ID if authenticated, otherwise IP
      return req.user?.userId || req.ip;
    }
  };

  return rateLimit({ ...defaultOptions, ...options });
};

/**
 * General API rate limiter
 */
const generalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: {
    error: 'Too many requests',
    message: 'Too many API requests, please try again later.',
    retryAfter: 900 // 15 minutes in seconds
  }
});

/**
 * Strict rate limiter for authentication endpoints
 */
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per 15 minutes
  message: {
    error: 'Too many login attempts',
    message: 'Too many login attempts from this IP, please try again later.',
    retryAfter: 900
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  keyGenerator: (req) => {
    // For auth endpoints, always use IP (user might not be authenticated yet)
    return req.ip;
  }
});

/**
 * Moderate rate limiter for password reset
 */
const passwordResetLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 password reset attempts per hour
  message: {
    error: 'Too many password reset attempts',
    message: 'Too many password reset attempts, please try again later.',
    retryAfter: 3600
  }
});

/**
 * GPS tracking rate limiter (more permissive for real-time data)
 */
const gpsLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 GPS updates per minute (1 per second)
  message: {
    error: 'Too many GPS updates',
    message: 'GPS update rate limit exceeded.',
    retryAfter: 60
  }
});

/**
 * WebSocket connection rate limiter
 */
const websocketLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 10 WebSocket connection attempts per 5 minutes
  message: {
    error: 'Too many WebSocket connections',
    message: 'Too many WebSocket connection attempts.',
    retryAfter: 300
  }
});

/**
 * File upload rate limiter
 */
const uploadLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // 20 file uploads per 10 minutes
  message: {
    error: 'Too many file uploads',
    message: 'File upload rate limit exceeded.',
    retryAfter: 600
  }
});

/**
 * Report generation rate limiter
 */
const reportLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // 5 report generations per 10 minutes
  message: {
    error: 'Too many report requests',
    message: 'Report generation rate limit exceeded.',
    retryAfter: 600
  }
});

/**
 * Dynamic rate limiter based on user role
 */
const roleBased = (limits = {}) => {
  const defaultLimits = {
    admin: { windowMs: 15 * 60 * 1000, max: 200 },
    manager: { windowMs: 15 * 60 * 1000, max: 150 },
    dispatcher: { windowMs: 15 * 60 * 1000, max: 100 },
    driver: { windowMs: 15 * 60 * 1000, max: 50 },
    default: { windowMs: 15 * 60 * 1000, max: 30 }
  };

  const roleLimits = { ...defaultLimits, ...limits };

  return (req, res, next) => {
    const userRole = req.user?.role || 'default';
    const limit = roleLimits[userRole] || roleLimits.default;

    const limiter = createRateLimiter({
      ...limit,
      message: {
        error: 'Rate limit exceeded',
        message: `Rate limit exceeded for role: ${userRole}`,
        retryAfter: Math.ceil(limit.windowMs / 1000)
      }
    });

    limiter(req, res, next);
  };
};

/**
 * Burst rate limiter for high-frequency operations
 */
const burstLimiter = createRateLimiter({
  windowMs: 1 * 1000, // 1 second
  max: 10, // 10 requests per second
  message: {
    error: 'Request burst limit exceeded',
    message: 'Too many requests in a short time period.',
    retryAfter: 1
  }
});

/**
 * Progressive rate limiter that increases limits for authenticated users
 */
const progressive = (req, res, next) => {
  const isAuthenticated = !!req.user;
  const userRole = req.user?.role;

  let limiter;

  if (!isAuthenticated) {
    // Strict limits for unauthenticated users
    limiter = createRateLimiter({
      windowMs: 15 * 60 * 1000,
      max: 20,
      message: {
        error: 'Rate limit exceeded',
        message: 'Please authenticate for higher rate limits.',
        retryAfter: 900
      }
    });
  } else {
    // More permissive limits for authenticated users
    const roleMultiplier = {
      admin: 4,
      manager: 3,
      dispatcher: 2,
      driver: 1.5
    };

    const multiplier = roleMultiplier[userRole] || 1;
    const baseLimit = 50;

    limiter = createRateLimiter({
      windowMs: 15 * 60 * 1000,
      max: Math.floor(baseLimit * multiplier),
      message: {
        error: 'Rate limit exceeded',
        message: `Rate limit exceeded for authenticated user (${userRole}).`,
        retryAfter: 900
      }
    });
  }

  limiter(req, res, next);
};

/**
 * Custom rate limiter for specific endpoints
 */
const custom = (windowMs, max, message) => {
  return createRateLimiter({
    windowMs,
    max,
    message: {
      error: 'Rate limit exceeded',
      message: message || 'Custom rate limit exceeded.',
      retryAfter: Math.ceil(windowMs / 1000)
    }
  });
};

module.exports = {
  createRateLimiter,
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  gpsLimiter,
  websocketLimiter,
  uploadLimiter,
  reportLimiter,
  roleBased,
  burstLimiter,
  progressive,
  custom
};