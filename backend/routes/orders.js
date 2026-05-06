const express = require('express');
const orderController = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateBody, validateParams, validateQuery, paramSchemas, commonSchemas, orderSchemas } = require('../middleware/validation');
const { generalLimiter } = require('../middleware/rateLimiter');
const Joi = require('joi');

const router = express.Router();

// Apply authentication and rate limiting to all routes
router.use(authenticate);
router.use(generalLimiter);

// Additional order validation schemas
const orderRouteSchemas = {
  assignOrder: Joi.object({
    vehicleId: commonSchemas.mongoId.required(),
    driverId: commonSchemas.mongoId.required()
  }),

  addNote: Joi.object({
    content: Joi.string().required().trim().min(1).max(500),
    type: Joi.string().valid('general', 'pickup', 'delivery', 'customer', 'internal').default('general')
  }),

  listQuery: Joi.object({
    ...commonSchemas.pagination.describe().keys,
    status: Joi.string().valid(
      'pending', 'confirmed', 'assigned', 'pickup_scheduled',
      'en_route_pickup', 'arrived_pickup', 'picked_up', 'in_transit',
      'en_route_delivery', 'arrived_delivery', 'delivered',
      'failed_pickup', 'failed_delivery', 'cancelled', 'returned'
    ),
    priority: Joi.string().valid('low', 'normal', 'high', 'urgent'),
    assignedVehicle: commonSchemas.mongoId,
    assignedDriver: commonSchemas.mongoId,
    paymentStatus: Joi.string().valid('pending', 'paid', 'failed', 'refunded'),
    search: Joi.string().trim().min(1).max(100),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso()
  }),

  areaQuery: Joi.object({
    longitude: Joi.number().min(-180).max(180).required(),
    latitude: Joi.number().min(-90).max(90).required(),
    radius: Joi.number().min(0.1).max(100).default(10)
  })
};

/**
 * GET /api/orders
 * Get all orders with filtering and pagination
 */
router.get('/',
  authorize('orders', 'read'),
  validateQuery(orderRouteSchemas.listQuery),
  orderController.getAllOrders
);

/**
 * GET /api/orders/overdue
 * Get overdue orders
 */
router.get('/overdue',
  authorize('orders', 'read'),
  orderController.getOverdueOrders
);

/**
 * GET /api/orders/in-area
 * Find orders in geographical area
 */
router.get('/in-area',
  authorize('orders', 'read'),
  validateQuery(orderRouteSchemas.areaQuery),
  orderController.getOrdersInArea
);

/**
 * GET /api/orders/by-priority/:priority
 * Get orders by priority level
 */
router.get('/by-priority/:priority',
  authorize('orders', 'read'),
  validateParams(Joi.object({
    priority: Joi.string().valid('low', 'normal', 'high', 'urgent').required()
  })),
  orderController.getOrdersByPriority
);

/**
 * GET /api/orders/:id
 * Get order by ID
 */
router.get('/:id',
  authorize('orders', 'read'),
  validateParams(paramSchemas.id),
  orderController.getOrderById
);

/**
 * POST /api/orders
 * Create new order
 */
router.post('/',
  authorize('orders', 'create'),
  validateBody(orderSchemas.createOrder),
  orderController.createOrder
);

/**
 * PUT /api/orders/:id
 * Update order
 */
router.put('/:id',
  authorize('orders', 'update'),
  validateParams(paramSchemas.id),
  validateBody(Joi.object({
    customerInfo: Joi.object({
      name: Joi.string().trim(),
      phone: Joi.string().trim(),
      email: Joi.string().email().trim().lowercase(),
      company: Joi.string().trim().allow('')
    }),
    pickup: Joi.object({
      address: Joi.object({
        street: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        zipCode: Joi.string(),
        country: Joi.string().default('USA')
      }),
      location: Joi.object({
        type: Joi.string().valid('Point').default('Point'),
        coordinates: commonSchemas.coordinates
      }),
      scheduledTime: Joi.date().iso(),
      instructions: Joi.string().trim().allow('')
    }),
    delivery: Joi.object({
      address: Joi.object({
        street: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        zipCode: Joi.string(),
        country: Joi.string().default('USA')
      }),
      location: Joi.object({
        type: Joi.string().valid('Point').default('Point'),
        coordinates: commonSchemas.coordinates
      }),
      scheduledTime: Joi.date().iso(),
      instructions: Joi.string().trim().allow('')
    }),
    items: Joi.array().items(
      Joi.object({
        description: Joi.string(),
        quantity: Joi.number().integer().min(1),
        weight: Joi.number().min(0),
        specialHandling: Joi.array().items(
          Joi.string().valid('fragile', 'hazardous', 'refrigerated', 'oversized', 'high_value')
        )
      })
    ),
    priority: Joi.string().valid('low', 'normal', 'high', 'urgent'),
    pricing: Joi.object({
      baseRate: Joi.number().min(0),
      totalAmount: Joi.number().min(0),
      paymentStatus: Joi.string().valid('pending', 'paid', 'failed', 'refunded')
    })
  })),
  orderController.updateOrder
);

/**
 * DELETE /api/orders/:id
 * Delete order (soft delete)
 */
router.delete('/:id',
  authorize('orders', 'delete'),
  validateParams(paramSchemas.id),
  orderController.deleteOrder
);

/**
 * POST /api/orders/:id/status
 * Update order status
 */
router.post('/:id/status',
  authorize('orders', 'update'),
  validateParams(paramSchemas.id),
  validateBody(orderSchemas.updateOrderStatus),
  orderController.updateOrderStatus
);

/**
 * POST /api/orders/:id/assign
 * Assign vehicle and driver to order
 */
router.post('/:id/assign',
  authorize('orders', 'update'),
  validateParams(paramSchemas.id),
  validateBody(orderRouteSchemas.assignOrder),
  orderController.assignOrder
);

/**
 * POST /api/orders/:id/notes
 * Add note to order
 */
router.post('/:id/notes',
  authorize('orders', 'update'),
  validateParams(paramSchemas.id),
  validateBody(orderRouteSchemas.addNote),
  orderController.addOrderNote
);

module.exports = router;