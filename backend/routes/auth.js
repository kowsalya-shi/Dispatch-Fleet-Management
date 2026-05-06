const express = require('express');
const Joi = require('joi');
const authService = require('../services/authService');
const { authenticate, checkTokenExpiration } = require('../middleware/auth');
const { validateBody, authSchemas } = require('../middleware/validation');
const { authLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');
const logger = require('../config/logger');

const router = express.Router();

/**
 * POST /api/auth/login
 * Authenticate user with credentials
 */
router.post('/login', 
  authLimiter,
  validateBody(authSchemas.login),
  async (req, res) => {
    try {
      const { userId, password } = req.body;
      
      const result = await authService.authenticate(userId, password);
      
      logger.info('User login successful', {
        userId: result.user.userId,
        role: result.user.role,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      logger.warn('Login failed', {
        userId: req.body.userId,
        error: error.message,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(401).json({
        success: false,
        error: 'Authentication failed',
        message: error.message
      });
    }
  }
);

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh',
  authLimiter,
  validateBody(authSchemas.refreshToken),
  async (req, res) => {
    try {
      const { refreshToken } = req.body;
      
      const result = await authService.refreshAccessToken(refreshToken);
      
      logger.info('Token refresh successful', {
        ip: req.ip
      });

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: result
      });
    } catch (error) {
      logger.warn('Token refresh failed', {
        error: error.message,
        ip: req.ip
      });

      res.status(401).json({
        success: false,
        error: 'Token refresh failed',
        message: error.message
      });
    }
  }
);

/**
 * POST /api/auth/logout
 * Logout user by invalidating refresh token
 */
router.post('/logout',
  authenticate,
  async (req, res) => {
    try {
      const { refreshToken } = req.body;
      
      await authService.logout(req.user.userId, refreshToken);
      
      logger.info('User logout successful', {
        userId: req.user.userId,
        ip: req.ip
      });

      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      logger.error('Logout failed', {
        userId: req.user?.userId,
        error: error.message,
        ip: req.ip
      });

      res.status(500).json({
        success: false,
        error: 'Logout failed',
        message: error.message
      });
    }
  }
);

/**
 * POST /api/auth/logout-all
 * Logout user from all devices
 */
router.post('/logout-all',
  authenticate,
  async (req, res) => {
    try {
      await authService.logoutAll(req.user.userId);
      
      logger.info('User logout from all devices successful', {
        userId: req.user.userId,
        ip: req.ip
      });

      res.json({
        success: true,
        message: 'Logged out from all devices successfully'
      });
    } catch (error) {
      logger.error('Logout all failed', {
        userId: req.user?.userId,
        error: error.message,
        ip: req.ip
      });

      res.status(500).json({
        success: false,
        error: 'Logout all failed',
        message: error.message
      });
    }
  }
);

/**
 * GET /api/auth/me
 * Get current user information
 */
router.get('/me',
  authenticate,
  checkTokenExpiration,
  async (req, res) => {
    try {
      const user = {
        id: req.user._id,
        userId: req.user.userId,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        permissions: req.user.permissions,
        lastLogin: req.user.lastLogin,
        isActive: req.user.isActive
      };

      res.json({
        success: true,
        message: 'User information retrieved successfully',
        data: {
          user,
          tokenInfo: req.tokenInfo
        }
      });
    } catch (error) {
      logger.error('Get user info failed', {
        userId: req.user?.userId,
        error: error.message,
        ip: req.ip
      });

      res.status(500).json({
        success: false,
        error: 'Failed to get user information',
        message: error.message
      });
    }
  }
);

/**
 * POST /api/auth/change-password
 * Change user password
 */
router.post('/change-password',
  authenticate,
  validateBody(authSchemas.changePassword),
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      await authService.changePassword(req.user.userId, currentPassword, newPassword);
      
      logger.info('Password change successful', {
        userId: req.user.userId,
        ip: req.ip
      });

      res.json({
        success: true,
        message: 'Password changed successfully. Please login again.'
      });
    } catch (error) {
      logger.warn('Password change failed', {
        userId: req.user?.userId,
        error: error.message,
        ip: req.ip
      });

      res.status(400).json({
        success: false,
        error: 'Password change failed',
        message: error.message
      });
    }
  }
);

/**
 * POST /api/auth/forgot-password
 * Request password reset token
 */
router.post('/forgot-password',
  passwordResetLimiter,
  validateBody(Joi.object({
    userId: Joi.string().required()
  })),
  async (req, res) => {
    try {
      const { userId } = req.body;
      
      // Find user (but don't reveal if user exists or not for security)
      const { User } = require('../models');
      const user = await User.findOne({ userId, isActive: true });
      
      if (user) {
        const resetToken = authService.generatePasswordResetToken(user);
        
        // In a real application, you would send this token via email
        // For now, we'll just log it (remove this in production)
        logger.info('Password reset token generated', {
          userId: user.userId,
          resetToken, // Remove this in production
          ip: req.ip
        });
        
        // TODO: Send email with reset token
        // await emailService.sendPasswordResetEmail(user.email, resetToken);
      }

      // Always return success to prevent user enumeration
      res.json({
        success: true,
        message: 'If the user exists, a password reset link has been sent.'
      });
    } catch (error) {
      logger.error('Forgot password failed', {
        error: error.message,
        ip: req.ip
      });

      res.status(500).json({
        success: false,
        error: 'Password reset request failed',
        message: 'Internal server error'
      });
    }
  }
);

/**
 * POST /api/auth/reset-password
 * Reset password using reset token
 */
router.post('/reset-password',
  passwordResetLimiter,
  validateBody(authSchemas.resetPassword),
  async (req, res) => {
    try {
      const { resetToken, newPassword } = req.body;
      
      await authService.resetPassword(resetToken, newPassword);
      
      logger.info('Password reset successful', {
        ip: req.ip
      });

      res.json({
        success: true,
        message: 'Password reset successfully. Please login with your new password.'
      });
    } catch (error) {
      logger.warn('Password reset failed', {
        error: error.message,
        ip: req.ip
      });

      res.status(400).json({
        success: false,
        error: 'Password reset failed',
        message: error.message
      });
    }
  }
);

/**
 * GET /api/auth/verify-token
 * Verify token validity and get token info
 */
router.get('/verify-token',
  authenticate,
  checkTokenExpiration,
  async (req, res) => {
    try {
      res.json({
        success: true,
        message: 'Token is valid',
        data: {
          valid: true,
          tokenInfo: req.tokenInfo,
          user: {
            userId: req.user.userId,
            role: req.user.role
          }
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Token verification failed',
        message: error.message
      });
    }
  }
);

module.exports = router;