const authService = require('../services/authService');
const logger = require('../config/logger');

/**
 * Authentication middleware - verifies JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'No authorization header provided'
      });
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'No token provided'
      });
    }

    // Verify token and get user
    const user = await authService.getUserByToken(token);
    
    // Add user and token info to request
    req.user = user;
    req.token = token;
    req.tokenInfo = authService.getTokenInfo(token);

    // Log authentication
    logger.debug('User authenticated', {
      userId: user.userId,
      role: user.role,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    next();
  } catch (error) {
    logger.warn('Authentication failed', {
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    return res.status(401).json({
      error: 'Authentication failed',
      message: error.message
    });
  }
};

/**
 * Authorization middleware - checks user permissions
 */
const authorize = (resource, action) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'User not authenticated'
        });
      }

      const hasPermission = authService.hasPermission(req.user, resource, action);
      
      if (!hasPermission) {
        logger.warn('Authorization failed', {
          userId: req.user.userId,
          role: req.user.role,
          resource,
          action,
          ip: req.ip
        });

        return res.status(403).json({
          error: 'Access denied',
          message: `Insufficient permissions for ${action} on ${resource}`
        });
      }

      logger.debug('User authorized', {
        userId: req.user.userId,
        role: req.user.role,
        resource,
        action
      });

      next();
    } catch (error) {
      logger.error('Authorization error', {
        error: error.message,
        userId: req.user?.userId,
        resource,
        action
      });

      return res.status(500).json({
        error: 'Authorization error',
        message: 'Internal server error'
      });
    }
  };
};

/**
 * Role-based authorization middleware
 */
const requireRole = (roles) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'User not authenticated'
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        logger.warn('Role authorization failed', {
          userId: req.user.userId,
          userRole: req.user.role,
          requiredRoles: allowedRoles,
          ip: req.ip
        });

        return res.status(403).json({
          error: 'Access denied',
          message: `Role '${req.user.role}' not authorized. Required: ${allowedRoles.join(', ')}`
        });
      }

      next();
    } catch (error) {
      logger.error('Role authorization error', {
        error: error.message,
        userId: req.user?.userId,
        requiredRoles: allowedRoles
      });

      return res.status(500).json({
        error: 'Authorization error',
        message: 'Internal server error'
      });
    }
  };
};

/**
 * Optional authentication middleware - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next();
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return next();
    }

    try {
      const user = await authService.getUserByToken(token);
      req.user = user;
      req.token = token;
      req.tokenInfo = authService.getTokenInfo(token);
    } catch (error) {
      // Log but don't fail - this is optional auth
      logger.debug('Optional authentication failed', {
        error: error.message,
        ip: req.ip
      });
    }

    next();
  } catch (error) {
    logger.error('Optional authentication error', {
      error: error.message,
      ip: req.ip
    });
    next(); // Continue even on error
  }
};

/**
 * WebSocket authentication middleware
 */
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || 
                  socket.handshake.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return next(new Error('Authentication required'));
    }

    const user = await authService.getUserByToken(token);
    
    // Add user info to socket
    socket.user = user;
    socket.token = token;
    socket.tokenInfo = authService.getTokenInfo(token);

    logger.info('WebSocket user authenticated', {
      userId: user.userId,
      role: user.role,
      socketId: socket.id,
      ip: socket.handshake.address
    });

    next();
  } catch (error) {
    logger.warn('WebSocket authentication failed', {
      error: error.message,
      socketId: socket.id,
      ip: socket.handshake.address
    });

    next(new Error('Authentication failed'));
  }
};

/**
 * Token expiration warning middleware
 */
const checkTokenExpiration = (req, res, next) => {
  if (req.tokenInfo && req.tokenInfo.isExpiringSoon) {
    res.set('X-Token-Expiring-Soon', 'true');
    res.set('X-Token-Expires-At', req.tokenInfo.expiresAt.toISOString());
    res.set('X-Token-Time-Remaining', req.tokenInfo.timeRemaining.toString());
  }
  next();
};

/**
 * Admin only middleware
 */
const adminOnly = requireRole('admin');

/**
 * Manager or admin middleware
 */
const managerOrAdmin = requireRole(['manager', 'admin']);

/**
 * Dispatcher, manager, or admin middleware
 */
const dispatcherOrAbove = requireRole(['dispatcher', 'manager', 'admin']);

module.exports = {
  authenticate,
  authorize,
  requireRole,
  optionalAuth,
  authenticateSocket,
  checkTokenExpiration,
  adminOnly,
  managerOrAdmin,
  dispatcherOrAbove
};