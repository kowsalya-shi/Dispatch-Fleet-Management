const express = require('express');
const gpsController = require('../controllers/gpsController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateBody, validateParams, validateQuery, gpsSchemas, commonSchemas } = require('../middleware/validation');
const { gpsLimiter, generalLimiter } = require('../middleware/rateLimiter');
const Joi = require('joi');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// GPS-specific validation schemas
const gpsRouteSchemas = {
  batchUpdate: Joi.object({
    updates: Joi.array().items(
      Joi.object({
        vehicleId: Joi.string().required(),
        location: Joi.object({
          type: Joi.string().valid('Point').default('Point'),
          coordinates: commonSchemas.coordinates.required()
        }).required(),
        speed: Joi.number().min(0).max(300).default(0),
        heading: Joi.number().min(0).max(360).default(0),
        engineStatus: Joi.string().valid('on', 'off', 'idle', 'unknown').default('unknown'),
        fuelLevel: Joi.number().min(0).max(100).default(0),
        address: Joi.string().trim().allow('')
      })
    ).min(1).max(100).required()
  }),

  historyQuery: Joi.object({
    startTime: Joi.date().iso(),
    endTime: Joi.date().iso(),
    limit: Joi.number().integer().min(1).max(1000).default(100),
    simplify: Joi.boolean().default(true)
  }),

  liveQuery: Joi.object({
    includeOffline: Joi.boolean().default(false)
  }),

  idleQuery: Joi.object({
    thresholdMinutes: Joi.number().integer().min(1).max(1440).default(5)
  }),

  areaQuery: Joi.object({
    longitude: Joi.number().min(-180).max(180).required(),
    latitude: Joi.number().min(-90).max(90).required(),
    radius: Joi.number().min(0.1).max(100).default(1)
  }),

  eventsQuery: Joi.object({
    vehicleId: Joi.string().trim(),
    eventType: Joi.string().valid(
      'ignition_on', 'ignition_off', 'speeding', 'harsh_braking',
      'harsh_acceleration', 'idle_start', 'idle_end', 'geofence_enter',
      'geofence_exit', 'panic_button', 'maintenance_due', 'low_fuel',
      'battery_low', 'device_offline', 'device_online'
    ),
    startTime: Joi.date().iso(),
    endTime: Joi.date().iso(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(50)
  })
};

/**
 * POST /api/gps/update
 * Update GPS location for a vehicle (high frequency endpoint)
 */
router.post('/update',
  gpsLimiter, // More permissive rate limiting for GPS updates
  authorize('vehicles', 'update'),
  validateBody(gpsSchemas.updateLocation),
  gpsController.updateGPSLocation
);

/**
 * POST /api/gps/batch-update
 * Batch update GPS locations for multiple vehicles
 */
router.post('/batch-update',
  gpsLimiter,
  authorize('vehicles', 'update'),
  validateBody(gpsRouteSchemas.batchUpdate),
  gpsController.batchUpdateGPS
);

/**
 * GET /api/gps/vehicles/live
 * Get live positions of all active vehicles
 */
router.get('/vehicles/live',
  generalLimiter,
  authorize('vehicles', 'read'),
  validateQuery(gpsRouteSchemas.liveQuery),
  gpsController.getLivePositions
);

/**
 * GET /api/gps/vehicles/idle
 * Get idle vehicles
 */
router.get('/vehicles/idle',
  generalLimiter,
  authorize('vehicles', 'read'),
  validateQuery(gpsRouteSchemas.idleQuery),
  gpsController.getIdleVehicles
);

/**
 * GET /api/gps/vehicle/:vehicleId/latest
 * Get latest GPS position for a vehicle
 */
router.get('/vehicle/:vehicleId/latest',
  generalLimiter,
  authorize('vehicles', 'read'),
  validateParams(Joi.object({
    vehicleId: Joi.string().required()
  })),
  gpsController.getLatestPosition
);

/**
 * GET /api/gps/vehicle/:vehicleId/history
 * Get GPS tracking history for a vehicle
 */
router.get('/vehicle/:vehicleId/history',
  generalLimiter,
  authorize('vehicles', 'read'),
  validateParams(Joi.object({
    vehicleId: Joi.string().required()
  })),
  validateQuery(gpsRouteSchemas.historyQuery),
  gpsController.getTrackingHistory
);

/**
 * GET /api/gps/area
 * Get GPS positions in a geographical area
 */
router.get('/area',
  generalLimiter,
  authorize('vehicles', 'read'),
  validateQuery(gpsRouteSchemas.areaQuery),
  gpsController.getPositionsInArea
);

/**
 * GET /api/gps/events
 * Get GPS events (speeding, harsh braking, etc.)
 */
router.get('/events',
  generalLimiter,
  authorize('vehicles', 'read'),
  validateQuery(gpsRouteSchemas.eventsQuery),
  gpsController.getGPSEvents
);

module.exports = router;