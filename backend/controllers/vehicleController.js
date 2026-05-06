const { Vehicle, Driver, GPSTracking } = require('../models');
const logger = require('../config/logger');

class VehicleController {
  /**
   * GET /api/vehicles
   * Get all vehicles with filtering, sorting, and pagination
   */
  async getAllVehicles(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        sort = 'createdAt',
        order = 'desc',
        status,
        type,
        isOnline,
        assignedDriver,
        search
      } = req.query;

      // Build filter object
      const filter = { isActive: true };
      
      if (status) filter.status = status;
      if (type) filter.type = type;
      if (isOnline !== undefined) filter['tracking.isOnline'] = isOnline === 'true';
      if (assignedDriver) filter.assignedDriver = assignedDriver;
      
      if (search) {
        filter.$or = [
          { vehicleId: { $regex: search, $options: 'i' } },
          { licensePlate: { $regex: search, $options: 'i' } },
          { make: { $regex: search, $options: 'i' } },
          { model: { $regex: search, $options: 'i' } }
        ];
      }

      // Build sort object
      const sortObj = {};
      sortObj[sort] = order === 'asc' ? 1 : -1;

      // Execute query with pagination
      const skip = (page - 1) * limit;
      const vehicles = await Vehicle.find(filter)
        .populate('assignedDriver', 'driverId personalInfo.firstName personalInfo.lastName')
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Vehicle.countDocuments(filter);

      logger.info('Vehicles retrieved', {
        userId: req.user.userId,
        count: vehicles.length,
        total,
        filters: filter
      });

      res.json({
        success: true,
        data: {
          vehicles,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      logger.error('Get vehicles failed', {
        userId: req.user?.userId,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve vehicles',
        message: error.message
      });
    }
  }

  /**
   * GET /api/vehicles/:id
   * Get vehicle by ID
   */
  async getVehicleById(req, res) {
    try {
      const { id } = req.params;

      const vehicle = await Vehicle.findById(id)
        .populate('assignedDriver')
        .populate('currentRoute');

      if (!vehicle || !vehicle.isActive) {
        return res.status(404).json({
          success: false,
          error: 'Vehicle not found',
          message: 'Vehicle does not exist or has been deactivated'
        });
      }

      // Get latest GPS tracking data
      const latestTracking = await GPSTracking.findLatestForVehicle(vehicle._id);

      logger.info('Vehicle retrieved', {
        userId: req.user.userId,
        vehicleId: vehicle.vehicleId
      });

      res.json({
        success: true,
        data: {
          vehicle,
          latestTracking
        }
      });
    } catch (error) {
      logger.error('Get vehicle failed', {
        userId: req.user?.userId,
        vehicleId: req.params.id,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve vehicle',
        message: error.message
      });
    }
  }

  /**
   * POST /api/vehicles
   * Create new vehicle
   */
  async createVehicle(req, res) {
    try {
      const vehicleData = req.body;

      // Check if vehicle ID already exists
      const existingVehicle = await Vehicle.findOne({ 
        vehicleId: vehicleData.vehicleId 
      });

      if (existingVehicle) {
        return res.status(400).json({
          success: false,
          error: 'Vehicle already exists',
          message: `Vehicle with ID ${vehicleData.vehicleId} already exists`
        });
      }

      // Check if license plate already exists
      const existingPlate = await Vehicle.findOne({ 
        licensePlate: vehicleData.licensePlate 
      });

      if (existingPlate) {
        return res.status(400).json({
          success: false,
          error: 'License plate already exists',
          message: `Vehicle with license plate ${vehicleData.licensePlate} already exists`
        });
      }

      const vehicle = new Vehicle(vehicleData);
      await vehicle.save();

      logger.info('Vehicle created', {
        userId: req.user.userId,
        vehicleId: vehicle.vehicleId,
        licensePlate: vehicle.licensePlate
      });

      res.status(201).json({
        success: true,
        message: 'Vehicle created successfully',
        data: { vehicle }
      });
    } catch (error) {
      logger.error('Create vehicle failed', {
        userId: req.user?.userId,
        error: error.message
      });

      res.status(400).json({
        success: false,
        error: 'Failed to create vehicle',
        message: error.message
      });
    }
  }

  /**
   * PUT /api/vehicles/:id
   * Update vehicle
   */
  async updateVehicle(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const vehicle = await Vehicle.findById(id);
      if (!vehicle || !vehicle.isActive) {
        return res.status(404).json({
          success: false,
          error: 'Vehicle not found',
          message: 'Vehicle does not exist or has been deactivated'
        });
      }

      // Check for duplicate license plate if being updated
      if (updateData.licensePlate && updateData.licensePlate !== vehicle.licensePlate) {
        const existingPlate = await Vehicle.findOne({ 
          licensePlate: updateData.licensePlate,
          _id: { $ne: id }
        });

        if (existingPlate) {
          return res.status(400).json({
            success: false,
            error: 'License plate already exists',
            message: `Vehicle with license plate ${updateData.licensePlate} already exists`
          });
        }
      }

      // Update vehicle
      Object.assign(vehicle, updateData);
      await vehicle.save();

      logger.info('Vehicle updated', {
        userId: req.user.userId,
        vehicleId: vehicle.vehicleId,
        updatedFields: Object.keys(updateData)
      });

      res.json({
        success: true,
        message: 'Vehicle updated successfully',
        data: { vehicle }
      });
    } catch (error) {
      logger.error('Update vehicle failed', {
        userId: req.user?.userId,
        vehicleId: req.params.id,
        error: error.message
      });

      res.status(400).json({
        success: false,
        error: 'Failed to update vehicle',
        message: error.message
      });
    }
  }

  /**
   * DELETE /api/vehicles/:id
   * Soft delete vehicle
   */
  async deleteVehicle(req, res) {
    try {
      const { id } = req.params;

      const vehicle = await Vehicle.findById(id);
      if (!vehicle || !vehicle.isActive) {
        return res.status(404).json({
          success: false,
          error: 'Vehicle not found',
          message: 'Vehicle does not exist or has been deactivated'
        });
      }

      // Soft delete
      vehicle.isActive = false;
      vehicle.status = 'out_of_service';
      await vehicle.save();

      logger.info('Vehicle deleted', {
        userId: req.user.userId,
        vehicleId: vehicle.vehicleId
      });

      res.json({
        success: true,
        message: 'Vehicle deleted successfully'
      });
    } catch (error) {
      logger.error('Delete vehicle failed', {
        userId: req.user?.userId,
        vehicleId: req.params.id,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to delete vehicle',
        message: error.message
      });
    }
  }

  /**
   * POST /api/vehicles/:id/assign-driver
   * Assign driver to vehicle
   */
  async assignDriver(req, res) {
    try {
      const { id } = req.params;
      const { driverId } = req.body;

      const vehicle = await Vehicle.findById(id);
      if (!vehicle || !vehicle.isActive) {
        return res.status(404).json({
          success: false,
          error: 'Vehicle not found'
        });
      }

      const driver = await Driver.findById(driverId);
      if (!driver || !driver.isActive) {
        return res.status(404).json({
          success: false,
          error: 'Driver not found'
        });
      }

      // Check if driver is already assigned to another vehicle
      if (driver.currentVehicle && !driver.currentVehicle.equals(vehicle._id)) {
        return res.status(400).json({
          success: false,
          error: 'Driver already assigned to another vehicle'
        });
      }

      // Assign driver to vehicle
      vehicle.assignedDriver = driver._id;
      await vehicle.save();

      // Update driver's current vehicle
      await driver.assignVehicle(vehicle._id);

      logger.info('Driver assigned to vehicle', {
        userId: req.user.userId,
        vehicleId: vehicle.vehicleId,
        driverId: driver.driverId
      });

      res.json({
        success: true,
        message: 'Driver assigned successfully',
        data: {
          vehicle: await vehicle.populate('assignedDriver'),
          driver
        }
      });
    } catch (error) {
      logger.error('Assign driver failed', {
        userId: req.user?.userId,
        vehicleId: req.params.id,
        error: error.message
      });

      res.status(400).json({
        success: false,
        error: 'Failed to assign driver',
        message: error.message
      });
    }
  }

  /**
   * POST /api/vehicles/:id/unassign-driver
   * Unassign driver from vehicle
   */
  async unassignDriver(req, res) {
    try {
      const { id } = req.params;

      const vehicle = await Vehicle.findById(id);
      if (!vehicle || !vehicle.isActive) {
        return res.status(404).json({
          success: false,
          error: 'Vehicle not found'
        });
      }

      if (!vehicle.assignedDriver) {
        return res.status(400).json({
          success: false,
          error: 'No driver assigned to this vehicle'
        });
      }

      const driver = await Driver.findById(vehicle.assignedDriver);
      
      // Unassign driver from vehicle
      vehicle.assignedDriver = null;
      await vehicle.save();

      // Update driver's current vehicle
      if (driver) {
        await driver.unassignVehicle();
      }

      logger.info('Driver unassigned from vehicle', {
        userId: req.user.userId,
        vehicleId: vehicle.vehicleId,
        driverId: driver?.driverId
      });

      res.json({
        success: true,
        message: 'Driver unassigned successfully',
        data: { vehicle }
      });
    } catch (error) {
      logger.error('Unassign driver failed', {
        userId: req.user?.userId,
        vehicleId: req.params.id,
        error: error.message
      });

      res.status(400).json({
        success: false,
        error: 'Failed to unassign driver',
        message: error.message
      });
    }
  }

  /**
   * GET /api/vehicles/:id/location-history
   * Get vehicle location history
   */
  async getLocationHistory(req, res) {
    try {
      const { id } = req.params;
      const { 
        startDate, 
        endDate, 
        limit = 100,
        simplify = true 
      } = req.query;

      const vehicle = await Vehicle.findById(id);
      if (!vehicle || !vehicle.isActive) {
        return res.status(404).json({
          success: false,
          error: 'Vehicle not found'
        });
      }

      const start = startDate ? new Date(startDate) : new Date(Date.now() - 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();

      const history = await GPSTracking.getRouteHistory(
        vehicle._id, 
        start, 
        end, 
        simplify === 'true'
      ).limit(parseInt(limit));

      logger.info('Vehicle location history retrieved', {
        userId: req.user.userId,
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
          history,
          dateRange: { start, end },
          totalRecords: history.length
        }
      });
    } catch (error) {
      logger.error('Get location history failed', {
        userId: req.user?.userId,
        vehicleId: req.params.id,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve location history',
        message: error.message
      });
    }
  }

  /**
   * GET /api/vehicles/nearby
   * Find vehicles near a location
   */
  async findNearbyVehicles(req, res) {
    try {
      const { longitude, latitude, radius = 10 } = req.query;

      if (!longitude || !latitude) {
        return res.status(400).json({
          success: false,
          error: 'Longitude and latitude are required'
        });
      }

      const vehicles = await Vehicle.findNearby(
        parseFloat(longitude),
        parseFloat(latitude),
        parseFloat(radius)
      ).populate('assignedDriver', 'driverId personalInfo.firstName personalInfo.lastName');

      logger.info('Nearby vehicles found', {
        userId: req.user.userId,
        location: { longitude, latitude },
        radius,
        count: vehicles.length
      });

      res.json({
        success: true,
        data: {
          vehicles,
          searchLocation: {
            longitude: parseFloat(longitude),
            latitude: parseFloat(latitude)
          },
          radius: parseFloat(radius),
          count: vehicles.length
        }
      });
    } catch (error) {
      logger.error('Find nearby vehicles failed', {
        userId: req.user?.userId,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to find nearby vehicles',
        message: error.message
      });
    }
  }

  /**
   * GET /api/vehicles/idle
   * Find idle vehicles
   */
  async findIdleVehicles(req, res) {
    try {
      const { thresholdMinutes = 5 } = req.query;

      const idleVehicles = await Vehicle.findIdle(parseInt(thresholdMinutes));

      logger.info('Idle vehicles found', {
        userId: req.user.userId,
        threshold: thresholdMinutes,
        count: idleVehicles.length
      });

      res.json({
        success: true,
        data: {
          vehicles: idleVehicles,
          threshold: parseInt(thresholdMinutes),
          count: idleVehicles.length
        }
      });
    } catch (error) {
      logger.error('Find idle vehicles failed', {
        userId: req.user?.userId,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to find idle vehicles',
        message: error.message
      });
    }
  }
}

module.exports = new VehicleController();