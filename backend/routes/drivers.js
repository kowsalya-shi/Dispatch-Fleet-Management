const express = require('express');
const driverController = require('../controllers/driverController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateBody, validateParams, validateQuery, paramSchemas, commonSchemas } = require('../middleware/validation');
const { generalLimiter } = require('../middleware/rateLimiter');
const Joi = require('joi');

const router = express.Router();

// Apply authentication and rate limiting to all routes
router.use(authenticate);
router.use(generalLimiter);

// Driver validation schemas
const driverSchemas = {
  createDriver: Joi.object({
    driverId: Joi.string().required().trim(),
    personalInfo: Joi.object({
      firstName: Joi.string().required().trim(),
      lastName: Joi.string().required().trim(),
      dateOfBirth: Joi.date().required(),
      phone: Joi.string().required().trim(),
      email: Joi.string().email().required().lowercase().trim(),
      address: Joi.object({
        street: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        zipCode: Joi.string(),
        country: Joi.string().default('USA')
      }),
      emergencyContact: Joi.object({
        name: Joi.string(),
        phone: Joi.string(),
        relationship: Joi.string()
      })
    }).required(),
    license: Joi.object({
      number: Joi.string().required().trim(),
      class: Joi.string().valid('A', 'B', 'C', 'CDL-A', 'CDL-B', 'CDL-C').required(),
      expiryDate: Joi.date().required(),
      restrictions: Joi.array().items(Joi.string()),
      endorsements: Joi.array().items(Joi.string())
    }).required(),
    employment: Joi.object({
      hireDate: Joi.date().required(),
      employeeId: Joi.string().required().trim(),
      department: Joi.string().default('Transportation'),
      supervisor: commonSchemas.mongoId,
      salary: Joi.object({
        amount: Joi.number().min(0),
        currency: Joi.string().default('USD'),
        payPeriod: Joi.string().valid('hourly', 'weekly', 'monthly', 'yearly').default('hourly')
      })
    }).required(),
    workSchedule: Joi.object({
      shiftStart: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).default('08:00'),
      shiftEnd: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).default('17:00'),
      workDays: Joi.array().items(
        Joi.string().valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')
      ),
      timeZone: Joi.string().default('America/New_York')
    }),
    certifications: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        issuedBy: Joi.string(),
        issuedDate: Joi.date(),
        expiryDate: Joi.date(),
        certificateNumber: Joi.string(),
        isActive: Joi.boolean().default(true)
      })
    )
  }),

  updateDriver: Joi.object({
    personalInfo: Joi.object({
      firstName: Joi.string().trim(),
      lastName: Joi.string().trim(),
      dateOfBirth: Joi.date(),
      phone: Joi.string().trim(),
      email: Joi.string().email().lowercase().trim(),
      address: Joi.object({
        street: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        zipCode: Joi.string(),
        country: Joi.string()
      }),
      emergencyContact: Joi.object({
        name: Joi.string(),
        phone: Joi.string(),
        relationship: Joi.string()
      })
    }),
    license: Joi.object({
      number: Joi.string().trim(),
      class: Joi.string().valid('A', 'B', 'C', 'CDL-A', 'CDL-B', 'CDL-C'),
      expiryDate: Joi.date(),
      restrictions: Joi.array().items(Joi.string()),
      endorsements: Joi.array().items(Joi.string())
    }),
    employment: Joi.object({
      hireDate: Joi.date(),
      employeeId: Joi.string().trim(),
      department: Joi.string(),
      supervisor: commonSchemas.mongoId,
      salary: Joi.object({
        amount: Joi.number().min(0),
        currency: Joi.string(),
        payPeriod: Joi.string().valid('hourly', 'weekly', 'monthly', 'yearly')
      })
    }),
    status: Joi.string().valid('active', 'inactive', 'on_leave', 'suspended', 'terminated'),
    workSchedule: Joi.object({
      shiftStart: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      shiftEnd: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      workDays: Joi.array().items(
        Joi.string().valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')
      ),
      timeZone: Joi.string()
    }),
    performance: Joi.object({
      rating: Joi.number().min(1).max(5),
      totalTrips: Joi.number().min(0),
      totalDistance: Joi.number().min(0),
      onTimeDeliveries: Joi.number().min(0),
      lateDeliveries: Joi.number().min(0),
      accidents: Joi.number().min(0),
      violations: Joi.number().min(0)
    })
  }),

  updateLocation: Joi.object({
    longitude: Joi.number().min(-180).max(180).required(),
    latitude: Joi.number().min(-90).max(90).required(),
    address: Joi.string().trim().allow('')
  }),

  listQuery: Joi.object({
    ...commonSchemas.pagination.describe().keys,
    status: Joi.string().valid('active', 'inactive', 'on_leave', 'suspended', 'terminated'),
    isOnDuty: Joi.boolean(),
    currentVehicle: commonSchemas.mongoId,
    search: Joi.string().trim().min(1).max(100)
  }),

  expiringLicensesQuery: Joi.object({
    days: Joi.number().integer().min(1).max(365).default(30)
  })
};

/**
 * GET /api/drivers
 * Get all drivers with filtering and pagination
 */
router.get('/',
  authorize('drivers', 'read'),
  validateQuery(driverSchemas.listQuery),
  driverController.getAllDrivers
);

/**
 * GET /api/drivers/available
 * Get available drivers
 */
router.get('/available',
  authorize('drivers', 'read'),
  driverController.getAvailableDrivers
);

/**
 * GET /api/drivers/on-duty
 * Get drivers currently on duty
 */
router.get('/on-duty',
  authorize('drivers', 'read'),
  driverController.getOnDutyDrivers
);

/**
 * GET /api/drivers/expiring-licenses
 * Get drivers with expiring licenses
 */
router.get('/expiring-licenses',
  authorize('drivers', 'read'),
  validateQuery(driverSchemas.expiringLicensesQuery),
  driverController.getExpiringLicenses
);

/**
 * GET /api/drivers/:id
 * Get driver by ID
 */
router.get('/:id',
  authorize('drivers', 'read'),
  validateParams(paramSchemas.id),
  driverController.getDriverById
);

/**
 * GET /api/drivers/:id/performance
 * Get driver performance metrics
 */
router.get('/:id/performance',
  authorize('drivers', 'read'),
  validateParams(paramSchemas.id),
  driverController.getDriverPerformance
);

/**
 * POST /api/drivers
 * Create new driver
 */
router.post('/',
  authorize('drivers', 'create'),
  validateBody(driverSchemas.createDriver),
  driverController.createDriver
);

/**
 * PUT /api/drivers/:id
 * Update driver
 */
router.put('/:id',
  authorize('drivers', 'update'),
  validateParams(paramSchemas.id),
  validateBody(driverSchemas.updateDriver),
  driverController.updateDriver
);

/**
 * DELETE /api/drivers/:id
 * Delete driver (soft delete)
 */
router.delete('/:id',
  authorize('drivers', 'delete'),
  validateParams(paramSchemas.id),
  driverController.deleteDriver
);

/**
 * POST /api/drivers/:id/start-shift
 * Start driver shift
 */
router.post('/:id/start-shift',
  authorize('drivers', 'update'),
  validateParams(paramSchemas.id),
  driverController.startShift
);

/**
 * POST /api/drivers/:id/end-shift
 * End driver shift
 */
router.post('/:id/end-shift',
  authorize('drivers', 'update'),
  validateParams(paramSchemas.id),
  driverController.endShift
);

/**
 * POST /api/drivers/:id/location
 * Update driver location
 */
router.post('/:id/location',
  authorize('drivers', 'update'),
  validateParams(paramSchemas.id),
  validateBody(driverSchemas.updateLocation),
  driverController.updateLocation
);

module.exports = router;