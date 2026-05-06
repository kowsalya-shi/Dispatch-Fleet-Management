const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const logger = require('../config/logger');

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET;
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '8h';
    this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    
    if (!this.jwtSecret) {
      throw new Error('JWT_SECRET environment variable is required');
    }
  }

  /**
   * Generate JWT access token
   */
  generateAccessToken(user) {
    const payload = {
      userId: user._id,
      userIdString: user.userId,
      role: user.role,
      permissions: user.permissions,
      tokenType: 'access'
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
      issuer: 'fleet-management-system',
      audience: 'fleet-management-client'
    });
  }

  /**
   * Generate JWT refresh token
   */
  generateRefreshToken(user) {
    const payload = {
      userId: user._id,
      userIdString: user.userId,
      tokenType: 'refresh'
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.refreshExpiresIn,
      issuer: 'fleet-management-system',
      audience: 'fleet-management-client'
    });
  }

  /**
   * Verify JWT token
   */
  verifyToken(token, tokenType = 'access') {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, {
        issuer: 'fleet-management-system',
        audience: 'fleet-management-client'
      });

      if (decoded.tokenType !== tokenType) {
        throw new Error(`Invalid token type. Expected ${tokenType}, got ${decoded.tokenType}`);
      }

      return decoded;
    } catch (error) {
      logger.warn('Token verification failed', { 
        error: error.message,
        tokenType 
      });
      throw error;
    }
  }

  /**
   * Authenticate user with credentials
   */
  async authenticate(userId, password) {
    try {
      // Find user by userId
      const user = await User.findOne({ 
        userId: userId.trim(),
        isActive: true 
      });

      if (!user) {
        logger.warn('Authentication failed - user not found', { userId });
        throw new Error('Invalid credentials');
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        logger.warn('Authentication failed - invalid password', { userId });
        throw new Error('Invalid credentials');
      }

      // Update last login
      await user.updateLastLogin();

      // Generate tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Store refresh token
      await user.addRefreshToken(refreshToken);

      logger.info('User authenticated successfully', { 
        userId: user.userId,
        role: user.role 
      });

      return {
        user: {
          id: user._id,
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
          permissions: user.permissions,
          lastLogin: user.lastLogin
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: this.jwtExpiresIn
        }
      };
    } catch (error) {
      logger.error('Authentication error', { 
        userId,
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = this.verifyToken(refreshToken, 'refresh');

      // Find user and check if refresh token exists
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      // Check if refresh token exists in user's tokens
      const tokenExists = user.refreshTokens.some(rt => rt.token === refreshToken);
      if (!tokenExists) {
        throw new Error('Invalid refresh token');
      }

      // Generate new access token
      const newAccessToken = this.generateAccessToken(user);

      logger.info('Access token refreshed', { 
        userId: user.userId 
      });

      return {
        accessToken: newAccessToken,
        expiresIn: this.jwtExpiresIn
      };
    } catch (error) {
      logger.error('Token refresh error', { 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Logout user by removing refresh token
   */
  async logout(userId, refreshToken) {
    try {
      const user = await User.findOne({ userId });
      if (user && refreshToken) {
        await user.removeRefreshToken(refreshToken);
        logger.info('User logged out', { userId });
      }
    } catch (error) {
      logger.error('Logout error', { 
        userId,
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Logout from all devices by clearing all refresh tokens
   */
  async logoutAll(userId) {
    try {
      const user = await User.findOne({ userId });
      if (user) {
        user.refreshTokens = [];
        await user.save();
        logger.info('User logged out from all devices', { userId });
      }
    } catch (error) {
      logger.error('Logout all error', { 
        userId,
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Get user by token
   */
  async getUserByToken(token) {
    try {
      const decoded = this.verifyToken(token);
      const user = await User.findById(decoded.userId);
      
      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      return user;
    } catch (error) {
      logger.error('Get user by token error', { 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Check if user has permission for resource and action
   */
  hasPermission(user, resource, action) {
    // Admin has all permissions
    if (user.role === 'admin') {
      return true;
    }

    // Check specific permissions
    const permission = user.permissions.find(p => p.resource === resource);
    return permission && permission.actions.includes(action);
  }

  /**
   * Generate password reset token
   */
  generatePasswordResetToken(user) {
    const payload = {
      userId: user._id,
      userIdString: user.userId,
      tokenType: 'password_reset',
      timestamp: Date.now()
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: '1h', // Password reset tokens expire in 1 hour
      issuer: 'fleet-management-system',
      audience: 'fleet-management-client'
    });
  }

  /**
   * Verify password reset token
   */
  verifyPasswordResetToken(token) {
    try {
      const decoded = this.verifyToken(token);
      
      if (decoded.tokenType !== 'password_reset') {
        throw new Error('Invalid token type for password reset');
      }

      return decoded;
    } catch (error) {
      logger.warn('Password reset token verification failed', { 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Change user password
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findOne({ userId });
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      user.password = newPassword;
      await user.save();

      // Clear all refresh tokens to force re-login
      user.refreshTokens = [];
      await user.save();

      logger.info('Password changed successfully', { userId });
      
      return true;
    } catch (error) {
      logger.error('Change password error', { 
        userId,
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Reset password using reset token
   */
  async resetPassword(resetToken, newPassword) {
    try {
      const decoded = this.verifyPasswordResetToken(resetToken);
      
      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Update password
      user.password = newPassword;
      await user.save();

      // Clear all refresh tokens
      user.refreshTokens = [];
      await user.save();

      logger.info('Password reset successfully', { 
        userId: user.userId 
      });
      
      return true;
    } catch (error) {
      logger.error('Reset password error', { 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Validate token expiration and return time remaining
   */
  getTokenInfo(token) {
    try {
      const decoded = this.verifyToken(token);
      const now = Math.floor(Date.now() / 1000);
      const timeRemaining = decoded.exp - now;
      
      return {
        valid: true,
        expiresAt: new Date(decoded.exp * 1000),
        timeRemaining: timeRemaining,
        isExpiringSoon: timeRemaining < 300, // Less than 5 minutes
        userId: decoded.userIdString,
        role: decoded.role
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }
}

module.exports = new AuthService();