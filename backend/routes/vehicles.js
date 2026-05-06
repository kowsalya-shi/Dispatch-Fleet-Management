const express = require('express');
const vehicleController = require('../controllers/vehicleController');
const { authenticate, authorize, requireRole } = require('../middleware/auth');
const { validateBody, validateParams, validateQuery, paramSchemas, commonSchemas } = require('../middleware/validation');
const { generalLimiter } = require('../middleware/rateLimiter');
const Joi = require('joi');

const router = express.Router();

// Apply authentication and rate limiting to all routes
router.use(authenticate);
router.use(generalLimiter);

// Vehicle validation schemas
const vehicleSchemas = {
  createVehicle: Joi.object({
    vehicleId: Joi.string().required().trim(),
    licensePlate: Joi.string().required().trim().uppercase(),
    type: Joi.string().valid('truck', 'van', 'car', 'motorcycle', 'trailer').required(),
    make: Joi.string().required().trim(),
    model: Joi.string().required().trim(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required(),
    capacity: Joi.object({
      weight: Joi.number().min(0).required(),
      volume: Joi.number().min(0).required(),
      unit: Joi.string().valid('kg', 'tons', 'lbs').default('kg')
    }).required(),
    specifications: Joi.object({
      fuelType: Joi.string().valid('gasoline', 'diesel', 'electric', 'hybrid').required(),
      fuelCapacity: Joi.number().min(0),
      mileage: Joi.number().min(0),
      insuranceExpiry: Joi.date(),
      registrationExpiry: Joi.date(),
      lastMaintenanceDate: Joi.date(),
      nextMaintenanceDate: Joi.date(),
      maintenanceInterval: Joi.number().min(0).default(10000)
    }),
    currentLocation: Joi.object({
      type: Joi.string().valid('Point').default('Point'),
      coordinates: commonSchemas.coordinates.required(),
      address: Joi.string().trim().allow('')
    }),
    tracking: Joi.object({
      deviceId: Joi.string().trim(),
      speed: Joi.number().min(0).max(300).default(0),
      heading: Joi.number().min(0).max(360).default(0),
      odometer: Joi.number().min(0).default(0)
    })
  }),

  updateVehicle: Joi.object({
    licensePlate: Joi.string().trim().uppercase(),
    type: Joi.string().valid('truck', 'van', 'car', 'motorcycle', 'trailer'),
    make: Joi.string().trim(),
    model: Joi.string().trim(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1),
    capacity: Joi.object({
      weight: Joi.number().min(0),
      volume: Joi.number().min(0),
      unit: Joi.string().valid('kg', 'tons', 'lbs')
    }),
    status: Joi.string().valid('active', 'inactive', 'maintenance', 'out_of_service'),
    specifications: Joi.object({
      fuelType: Joi.string().valid('gasoline', 'diesel', 'electric', 'hybrid'),
      fuelCapacity: Joi.number().min(0),
      mileage: Joi.number().min(0),
      insuranceExpiry: Joi.date(),
      registrationExpiry: Joi.date(),
      lastMaintenanceDate: Joi.date(),
      nextMaintenanceDate: Joi.date(),
      maintenanceInterval: Joi.number().min(0)
    })
  }),

  assignDriver: Joi.object({
    driverId: commonSchemas.mongoId.required()
  }),

  nearbyQuery: Joi.object({
    longitude: Joi.number().min(-180).max(180).required(),
    latitude: Joi.number().min(-90).max(90).required(),
    radius: Joi.number().min(0.1).max(100).default(10)
  }),

  historyQuery: Joi.object({
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso(),
    limit: Joi.number().integer().min(1).max(1000).default(100),
    simplify: Joi.boolean().default(true)
  }),

  listQuery: Joi.object({
    ...commonSchemas.pagination.describe().keys,
    status: Joi.string().valid('active', 'inactive', 'maintenance', 'out_of_service'),
    type: Joi.string().valid('truck', 'van', 'car', 'motorcycle', 'trailer'),
    isOnline: Joi.boolean(),
    assignedDriver: commonSchemas.mongoId,
    search: Joi.string().trim().min(1).max(100)
  })
};

/**
 * GET /api/vehicles
 * Get all vehicles with filtering and pagination
 */
router.get('/',
  authorize('vehicles', 'read'),
  validateQuery(vehicleSchemas.listQuery),
  vehicleController.getAllVehicles
);

/**
 * GET /api/vehicles/nearby
 * Find vehicles near a location
 */
router.get('/nearby',
  authorize('vehicles', 'read'),
  validateQuery(vehicleSchemas.nearbyQuery),
  vehicleController.findNearbyVehicles
);

/**
 * GET /api/vehicles/idle
 * Find idle vehicles
 */
router.get('/idle',
  authorize('vehicles', 'read'),
  validateQuery(Joi.object({
    thresholdMinutes: Joi.number().integer().min(1).max(1440).default(5)
  })),
  vehicleController.findIdleVehicles
);

/**
 * GET /api/vehicles/:id
 * Get vehicle by ID
 */
router.get('/:id',
  authorize('vehicles', 'read'),
  validateParams(paramSchemas.id),
  vehicleController.getVehicleById
);

/**
 * GET /api/vehicles/:id/location-history
 * Get vehicle location history
 */
router.get('/:id/location-history',
  authorize('vehicles', 'read'),
  validateParams(paramSchemas.id),
  validateQuery(vehicleSchemas.historyQuery),
  vehicleController.getLocationHistory
);

/**
 * POST /api/vehicles
 * Create new vehicle
 */
router.post('/',
  authorize('vehicles', 'create'),
  validateBody(vehicleSchemas.createVehicle),
  vehicleController.createVehicle
);

/**
 * PUT /api/vehicles/:id
 * Update vehicle
 */
router.put('/:id',
  authorize('vehicles', 'update'),
  validateParams(paramSchemas.id),
  validateBody(vehicleSchemas.updateVehicle),
  vehicleController.updateVehicle
);

/**
 * DELETE /api/vehicles/:id
 * Delete vehicle (soft delete)
 */
router.delete('/:id',
  authorize('vehicles', 'delete'),
  validateParams(paramSchemas.id),
  vehicleController.deleteVehicle
);

/**
 * POST /api/vehicles/:id/assign-driver
 * Assign driver to vehicle
 */
router.post('/:id/assign-driver',
  authorize('vehicles', 'update'),
  validateParams(paramSchemas.id),
  validateBody(vehicleSchemas.assignDriver),
  vehicleController.assignDriver
);

/**
 * POST /api/vehicles/:id/unassign-driver
 * Unassign driver from vehicle
 */
router.post('/:id/unassign-driver',
  authorize('vehicles', 'update'),
  validateParams(paramSchemas.id),
  vehicleController.unassignDriver
);

module.exports = router;