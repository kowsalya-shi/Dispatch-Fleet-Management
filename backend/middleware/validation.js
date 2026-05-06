const Joi = require('joi');
const logger = require('../config/logger');

/**
 * Generic validation middleware factory
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      logger.warn('Validation failed', {
        property,
        errors,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      return res.status(400).json({
        error: 'Validation failed',
        message: 'Request data is invalid',
        details: errors
      });
    }

    // Replace request property with validated and sanitized value
    req[property] = value;
    next();
  };
};

/**
 * Authentication validation schemas
 */
const authSchemas = {
  login: Joi.object({
    userId: Joi.string()
      .trim()
      .min(3)
      .max(50)
      .required()
      .messages({
        'string.empty': 'User ID is required',
        'string.min': 'User ID must be at least 3 characters',
        'string.max': 'User ID must not exceed 50 characters'
      }),
    password: Joi.string()
      .min(6)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters',
        'string.max': 'Password must not exceed 100 characters'
      })
  }),

  refreshToken: Joi.object({
    refreshToken: Joi.string()
      .required()
      .messages({
        'string.empty': 'Refresh token is required'
      })
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string()
      .required()
      .messages({
        'string.empty': 'Current password is required'
      }),
    newPassword: Joi.string()
      .min(6)
      .max(100)
      .required()
      .messages({
        'string.empty': 'New password is required',
        'string.min': 'New password must be at least 6 characters',
        'string.max': 'New password must not exceed 100 characters'
      })
  }),

  resetPassword: Joi.object({
    resetToken: Joi.string()
      .required()
      .messages({
        'string.empty': 'Reset token is required'
      }),
    newPassword: Joi.string()
      .min(6)
      .max(100)
      .required()
      .messages({
        'string.empty': 'New password is required',
        'string.min': 'New password must be at least 6 characters',
        'string.max': 'New password must not exceed 100 characters'
      })
  })
};

/**
 * Common validation schemas
 */
const commonSchemas = {
  mongoId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid ID format'
    }),

  coordinates: Joi.array()
    .items(Joi.number().min(-180).max(180))
    .length(2)
    .messages({
      'array.length': 'Coordinates must contain exactly 2 numbers [longitude, latitude]',
      'number.min': 'Longitude must be between -180 and 180, latitude between -90 and 90',
      'number.max': 'Longitude must be between -180 and 180, latitude between -90 and 90'
    }),

  pagination: Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .messages({
        'number.min': 'Page must be at least 1'
      }),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(20)
      .messages({
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit must not exceed 100'
      }),
    sort: Joi.string()
      .default('createdAt')
      .messages({
        'string.base': 'Sort field must be a string'
      }),
    order: Joi.string()
      .valid('asc', 'desc')
      .default('desc')
      .messages({
        'any.only': 'Order must be either "asc" or "desc"'
      })
  })
};

/**
 * GPS tracking validation schemas
 */
const gpsSchemas = {
  updateLocation: Joi.object({
    vehicleId: Joi.string()
      .required()
      .messages({
        'string.empty': 'Vehicle ID is required'
      }),
    location: Joi.object({
      type: Joi.string()
        .valid('Point')
        .default('Point'),
      coordinates: commonSchemas.coordinates.required()
    }).required(),
    speed: Joi.number()
      .min(0)
      .max(300)
      .default(0)
      .messages({
        'number.min': 'Speed cannot be negative',
        'number.max': 'Speed cannot exceed 300 km/h'
      }),
    heading: Joi.number()
      .min(0)
      .max(360)
      .default(0)
      .messages({
        'number.min': 'Heading must be between 0 and 360 degrees',
        'number.max': 'Heading must be between 0 and 360 degrees'
      }),
    accuracy: Joi.number()
      .min(0)
      .default(10),
    altitude: Joi.number()
      .default(0),
    engineStatus: Joi.string()
      .valid('on', 'off', 'idle', 'unknown')
      .default('unknown'),
    fuelLevel: Joi.number()
      .min(0)
      .max(100)
      .default(0),
    address: Joi.string()
      .trim()
      .max(200)
      .allow('')
  })
};

/**
 * Order validation schemas
 */
const orderSchemas = {
  createOrder: Joi.object({
    orderId: Joi.string()
      .trim()
      .required()
      .messages({
        'string.empty': 'Order ID is required'
      }),
    customerInfo: Joi.object({
      name: Joi.string()
        .trim()
        .required()
        .messages({
          'string.empty': 'Customer name is required'
        }),
      phone: Joi.string()
        .trim()
        .required()
        .messages({
          'string.empty': 'Customer phone is required'
        }),
      email: Joi.string()
        .email()
        .trim()
        .lowercase(),
      company: Joi.string()
        .trim()
        .allow('')
    }).required(),
    pickup: Joi.object({
      address: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipCode: Joi.string().required(),
        country: Joi.string().default('USA')
      }).required(),
      location: Joi.object({
        type: Joi.string().valid('Point').default('Point'),
        coordinates: commonSchemas.coordinates.required()
      }).required(),
      scheduledTime: Joi.date()
        .iso()
        .required()
        .messages({
          'date.base': 'Pickup scheduled time must be a valid date'
        }),
      instructions: Joi.string()
        .trim()
        .allow('')
    }).required(),
    delivery: Joi.object({
      address: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipCode: Joi.string().required(),
        country: Joi.string().default('USA')
      }).required(),
      location: Joi.object({
        type: Joi.string().valid('Point').default('Point'),
        coordinates: commonSchemas.coordinates.required()
      }).required(),
      scheduledTime: Joi.date()
        .iso()
        .required()
        .messages({
          'date.base': 'Delivery scheduled time must be a valid date'
        }),
      instructions: Joi.string()
        .trim()
        .allow('')
    }).required(),
    items: Joi.array()
      .items(
        Joi.object({
          description: Joi.string()
            .required()
            .messages({
              'string.empty': 'Item description is required'
            }),
          quantity: Joi.number()
            .integer()
            .min(1)
            .required()
            .messages({
              'number.min': 'Quantity must be at least 1'
            }),
          weight: Joi.number()
            .min(0)
            .required()
            .messages({
              'number.min': 'Weight cannot be negative'
            }),
          specialHandling: Joi.array()
            .items(
              Joi.string().valid('fragile', 'hazardous', 'refrigerated', 'oversized', 'high_value')
            )
            .default([])
        })
      )
      .min(1)
      .required()
      .messages({
        'array.min': 'At least one item is required'
      }),
    priority: Joi.string()
      .valid('low', 'normal', 'high', 'urgent')
      .default('normal'),
    pricing: Joi.object({
      baseRate: Joi.number()
        .min(0)
        .required(),
      totalAmount: Joi.number()
        .min(0)
        .required()
    }).required()
  }),

  updateOrderStatus: Joi.object({
    status: Joi.string()
      .valid(
        'pending', 'confirmed', 'assigned', 'pickup_scheduled',
        'en_route_pickup', 'arrived_pickup', 'picked_up', 'in_transit',
        'en_route_delivery', 'arrived_delivery', 'delivered',
        'failed_pickup', 'failed_delivery', 'cancelled', 'returned'
      )
      .required()
      .messages({
        'any.only': 'Invalid order status'
      }),
    notes: Joi.string()
      .trim()
      .max(500)
      .allow(''),
    location: Joi.object({
      type: Joi.string().valid('Point').default('Point'),
      coordinates: commonSchemas.coordinates
    }).optional()
  })
};

/**
 * Parameter validation middleware
 */
const validateParams = (schema) => validate(schema, 'params');
const validateQuery = (schema) => validate(schema, 'query');
const validateBody = (schema) => validate(schema, 'body');

/**
 * Common parameter validations
 */
const paramSchemas = {
  id: Joi.object({
    id: commonSchemas.mongoId.required()
  }),
  vehicleId: Joi.object({
    vehicleId: Joi.string().required()
  }),
  orderId: Joi.object({
    orderId: Joi.string().required()
  })
};

/**
 * Error handling for validation middleware
 */
const handleValidationError = (error, req, res, next) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: error.message,
      details: error.details
    });
  }
  next(error);
};

module.exports = {
  validate,
  validateParams,
  validateQuery,
  validateBody,
  authSchemas,
  commonSchemas,
  gpsSchemas,
  orderSchemas,
  paramSchemas,
  handleValidationError
};