const { GPSTracking, Vehicle, Driver } = require('../models');
const logger = require('../config/logger');

class GPSController {
  /**
   * POST /api/gps/update
   * Update GPS location for a vehicle
   */
  async updateGPSLocation(req, res) {
    try {
      const {
        vehicleId,
        location,
        speed = 0,
        heading = 0,
        accuracy = 10,
        altitude = 0,
        engineStatus = 'unknown',
        fuelLevel = 0,
        address
      } = req.body;

      // Find vehicle
      const vehicle = await Vehicle.findOne({ vehicleId, isActive: true });
      if (!vehicle) {
        return res.status(404).json({
          success: false,
          error: 'Vehicle not found',
          message: `Vehicle with ID ${vehicleId} not found`
        });
      }

      // Create GPS tracking record
      const gpsData = new GPSTracking({
        vehicle: vehicle._id,
        driver: vehicle.assignedDriver,
        location,
        address,
        speed,
        heading,
        altitude,
        accuracy,
        engineStatus,
        fuelLevel,
        source: 'gps_device',
        processingInfo: {
          receivedAt: new Date()
        }
      });

      // Validate and save GPS data
      await gpsData.save();

      // Update vehicle's current location
      await vehicle.updateLocation(
        location.coordinates[0],
        location.coordinates[1],
        address
      );

      // Update vehicle tracking info
      await vehicle.updateTracking({
        speed,
        heading,
        isOnline: true
      });

      // Check for events (speeding, harsh driving, etc.)
      const events = await gpsData.detectHarshEvents();
      if (events.length > 0) {
        logger.warn('Harsh driving events detected', {
          vehicleId: vehicle.vehicleId,
          events: events.map(e => e.type)
        });
      }

      logger.debug('GPS location updated', {
        vehicleId: vehicle.vehicleId,
        location: location.coordinates,
        speed,
        events: events.length
      });

      res.json({
        success: true,
        message: 'GPS location updated successfully',
        data: {
          gpsTracking: gpsData,
          vehicle: {
            id: vehicle._id,
            vehicleId: vehicle.vehicleId,
            currentLocation: vehicle.currentLocation,
            tracking: vehicle.tracking
          },
          events: events.length > 0 ? events : undefined
        }
      });
    } catch (error) {
      logger.error('GPS update failed', {
        vehicleId: req.body?.vehicleId,
        error: error.message
      });

      res.status(400).json({
        success: false,
        error: 'Failed to update GPS location',
        message: error.message
      });
    }
  }

  /**
   * GET /api/gps/vehicle/:vehicleId/latest
   * Get latest GPS position for a vehicle
   */
  async getLatestPosition(req, res) {
    try {
      const { vehicleId } = req.params;

      // Find vehicle
      const vehicle = await Vehicle.findOne({ vehicleId, isActive: true });
      if (!vehicle) {
        return res.status(404).json({
          success: false,
          error: 'Vehicle not found'
        });
      }

      // Get latest GPS tracking data
      const latestTracking = await GPSTracking.findLatestForVehicle(vehicle._id)
        .populate('driver', 'driverId personalInfo.firstName personalInfo.lastName');

      if (!latestTracking) {
        return res.status(404).json({
          success: false,
          error: 'No GPS data found',
          message: 'No GPS tracking data available for this vehicle'
        });
      }

      logger.debug('Latest GPS position retrieved', {
        userId: req.user?.userId,
        vehicleId: vehicle.vehicleId
      });

      res.json({
        success: true,
        data: {
          vehicle: {
            id: vehicle._id,
            vehicleId: vehicle.vehicleId,
            licensePlate: vehicle.licensePlate
          },
          tracking: latestTracking
        }
      });
    } catch (error) {
      logger.error('Get latest position failed', {
        userId: req.user?.userId,
        vehicleId: req.params.vehicleId,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve latest position',
        message: error.message
      });
    }
  }

  /**
   * GET /api/gps/vehicle/:vehicleId/history
   * Get GPS tracking history for a vehicle
   */
  async getTrackingHistory(req, res) {
    try {
      const { vehicleId } = req.params;
      const {
        startTime,
        endTime,
        limit = 100,
        simplify = true
      } = req.query;

      // Find vehicle
      const vehicle = await Vehicle.findOne({ vehicleId, isActive: true });
      if (!vehicle) {
        return res.status(404).json({
          success: false,
          error: 'Vehicle not found'
        });
      }

      // Set default time range (last 24 hours)
      const start = startTime ? new Date(startTime) : new Date(Date.now() - 24 * 60 * 60 * 1000);
      const end = endTime ? new Date(endTime) : new Date();

      // Get tracking history
      const history = await GPSTracking.findInTimeRange(vehicle._id, start, end)
        .limit(parseInt(limit))
        .populate('driver', 'driverId personalInfo.firstName personalInfo.lastName');

      // Simplify data if requested
      let processedHistory = history;
      if (simplify === 'true') {
        processedHistory = history.map(record => ({
          _id: record._id,
          location: record.location,
          speed: record.speed,
          heading: record.heading,
          engineStatus: record.engineStatus,
          createdAt: record.createdAt,
          events: record.events
        }));
      }

      logger.info('GPS tracking history retrieved', {
        userId: req.user?.userId,
        vehicleId: vehicle.vehicleId,
        recordCount: history.length,
        dateRange: { start, end }
      });

      res.json({
        success: true,
        data: {
          vehicle: {
            id: vehicle._id,
            vehicleId: vehicle.vehicleId,
            licensePlate: vehicle.licensePlate
          },
          history: processedHistory,
          dateRange: { start, end },
          totalRecords: history.length
        }
      });
    } catch (error) {
      logger.error('Get tracking history failed', {
        userId: req.user?.userId,
        vehicleId: req.params.vehicleId,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve tracking history',
        message: error.message
      });
    }
  }

  /**
   * GET /api/gps/vehicles/live
   * Get live positions of all active vehicles
   */
  async getLivePositions(req, res) {
    try {
      const { includeOffline = false } = req.query;

      // Build filter for active vehicles
      const vehicleFilter = { 
        isActive: true, 
        status: 'active' 
      };

      if (includeOffline !== 'true') {
        vehicleFilter['tracking.isOnline'] = true;
      }

      // Get active vehicles
      const vehicles = await Vehicle.find(vehicleFilter)
        .populate('assignedDriver', 'driverId personalInfo.firstName personalInfo.lastName')
        .select('vehicleId licensePlate type currentLocation tracking assignedDriver');

      // Get latest GPS data for each vehicle
      const livePositions = await Promise.all(
        vehicles.map(async (vehicle) => {
          const latestTracking = await GPSTracking.findLatestForVehicle(vehicle._id);
          
          return {
            vehicle: {
              id: vehicle._id,
              vehicleId: vehicle.vehicleId,
              licensePlate: vehicle.licensePlate,
              type: vehicle.type,
              assignedDriver: vehicle.assignedDriver
            },
            location: vehicle.currentLocation,
            tracking: vehicle.tracking,
            latestGPS: latestTracking ? {
              speed: latestTracking.speed,
              heading: latestTracking.heading,
              engineStatus: latestTracking.engineStatus,
              fuelLevel: latestTracking.fuelLevel,
              lastUpdate: latestTracking.createdAt
            } : null
          };
        })
      );

      logger.info('Live positions retrieved', {
        userId: req.user?.userId,
        vehicleCount: livePositions.length,
        includeOffline: includeOffline === 'true'
      });

      res.json({
        success: true,
        data: {
          positions: livePositions,
          timestamp: new Date(),
          count: livePositions.length
        }
      });
    } catch (error) {
      logger.error('Get live positions failed', {
        userId: req.user?.userId,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve live positions',
        message: error.message
      });
    }
  }

  /**
   * GET /api/gps/vehicles/idle
   * Get idle vehicles
   */
  async getIdleVehicles(req, res) {
    try {
      const { thresholdMinutes = 5 } = req.query;

      const idleVehicles = await GPSTracking.findIdleVehicles(parseInt(thresholdMinutes));

      // Populate vehicle and driver information
      const populatedIdleVehicles = await Promise.all(
        idleVehicles.map(async (item) => {
          const vehicle = await Vehicle.findById(item._id)
            .populate('assignedDriver', 'driverId personalInfo.firstName personalInfo.lastName');
          
          return {
            vehicle,
            idleInfo: {
              idleStartTime: item.idleStartTime,
              idleDuration: item.idleDuration,
              latestPosition: item.latestPosition
            }
          };
        })
      );

      logger.info('Idle vehicles retrieved', {
        userId: req.user?.userId,
        threshold: thresholdMinutes,
        count: populatedIdleVehicles.length
      });

      res.json({
        success: true,
        data: {
          idleVehicles: populatedIdleVehicles,
          threshold: parseInt(thresholdMinutes),
          count: populatedIdleVehicles.length
        }
      });
    } catch (error) {
      logger.error('Get idle vehicles failed', {
        userId: req.user?.userId,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve idle vehicles',
        message: error.message
      });
    }
  }

  /**
   * GET /api/gps/area
   * Get GPS positions in a geographical area
   */
  async getPositionsInArea(req, res) {
    try {
      const { longitude, latitude, radius = 1 } = req.query;

      if (!longitude || !latitude) {
        return res.status(400).json({
          success: false,
          error: 'Longitude and latitude are required'
        });
      }

      const positions = await GPSTracking.findInArea(
        parseFloat(longitude),
        parseFloat(latitude),
        parseFloat(radius)
      );

      logger.info('GPS positions in area retrieved', {
        userId: req.user?.userId,
        location: { longitude, latitude },
        radius,
        count: positions.length
      });

      res.json({
        success: true,
        data: {
          positions,
          searchArea: {
            center: {
              longitude: parseFloat(longitude),
              latitude: parseFloat(latitude)
            },
            radius: parseFloat(radius)
          },
          count: positions.length
        }
      });
    } catch (error) {
      logger.error('Get positions in area failed', {
        userId: req.user?.userId,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve positions in area',
        message: error.message
      });
    }
  }

  /**
   * GET /api/gps/events
   * Get GPS events (speeding, harsh braking, etc.)
   */
  async getGPSEvents(req, res) {
    try {
      const {
        vehicleId,
        eventType,
        startTime,
        endTime,
        page = 1,
        limit = 50
      } = req.query;

      // Build filter
      const filter = { isValid: true };
      
      if (vehicleId) {
        const vehicle = await Vehicle.findOne({ vehicleId, isActive: true });
        if (!vehicle) {
          return res.status(404).json({
            success: false,
            error: 'Vehicle not found'
          });
        }
        filter.vehicle = vehicle._id;
      }

      if (eventType) {
        filter['events.type'] = eventType;
      }

      // Date range filter
      if (startTime || endTime) {
        filter.createdAt = {};
        if (startTime) filter.createdAt.$gte = new Date(startTime);
        if (endTime) filter.createdAt.$lte = new Date(endTime);
      }

      // Only get records that have events
      filter.events = { $exists: true, $not: { $size: 0 } };

      // Execute query with pagination
      const skip = (page - 1) * limit;
      const gpsRecords = await GPSTracking.find(filter)
        .populate('vehicle', 'vehicleId licensePlate type')
        .populate('driver', 'driverId personalInfo.firstName personalInfo.lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await GPSTracking.countDocuments(filter);

      // Extract events from GPS records
      const events = [];
      gpsRecords.forEach(record => {
        record.events.forEach(event => {
          if (!eventType || event.type === eventType) {
            events.push({
              _id: `${record._id}_${event._id}`,
              vehicle: record.vehicle,
              driver: record.driver,
              location: record.location,
              speed: record.speed,
              event: event,
              timestamp: record.createdAt
            });
          }
        });
      });

      logger.info('GPS events retrieved', {
        userId: req.user?.userId,
        vehicleId,
        eventType,
        count: events.length
      });

      res.json({
        success: true,
        data: {
          events,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          },
          filters: {
            vehicleId,
            eventType,
            startTime,
            endTime
          }
        }
      });
    } catch (error) {
      logger.error('Get GPS events failed', {
        userId: req.user?.userId,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve GPS events',
        message: error.message
      });
    }
  }

  /**
   * POST /api/gps/batch-update
   * Batch update GPS locations for multiple vehicles
   */
  async batchUpdateGPS(req, res) {
    try {
      const { updates } = req.body;

      if (!Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Updates array is required'
        });
      }

      const results = [];
      const errors = [];

      // Process each update
      for (const update of updates) {
        try {
          const { vehicleId, location, speed, heading, engineStatus, fuelLevel } = update;

          // Find vehicle
          const vehicle = await Vehicle.findOne({ vehicleId, isActive: true });
          if (!vehicle) {
            errors.push({
              vehicleId,
              error: 'Vehicle not found'
            });
            continue;
          }

          // Create GPS tracking record
          const gpsData = new GPSTracking({
            vehicle: vehicle._id,
            driver: vehicle.assignedDriver,
            location,
            speed: speed || 0,
            heading: heading || 0,
            engineStatus: engineStatus || 'unknown',
            fuelLevel: fuelLevel || 0,
            source: 'batch_update',
            processingInfo: {
              receivedAt: new Date()
            }
          });

          await gpsData.save();

          // Update vehicle location
          await vehicle.updateLocation(
            location.coordinates[0],
            location.coordinates[1]
          );

          results.push({
            vehicleId,
            success: true,
            gpsId: gpsData._id
          });

        } catch (error) {
          errors.push({
            vehicleId: update.vehicleId,
            error: error.message
          });
        }
      }

      logger.info('Batch GPS update completed', {
        totalUpdates: updates.length,
        successful: results.length,
        failed: errors.length
      });

      res.json({
        success: true,
        message: 'Batch GPS update completed',
        data: {
          successful: results,
          failed: errors,
          summary: {
            total: updates.length,
            successful: results.length,
            failed: errors.length
          }
        }
      });
    } catch (error) {
      logger.error('Batch GPS update failed', {
        error: error.message
      });

      res.status(400).json({
        success: false,
        error: 'Batch GPS update failed',
        message: error.message
      });
    }
  }
}

module.exports = new GPSController();