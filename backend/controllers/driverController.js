const { Driver, Vehicle, Order } = require('../models');
const logger = require('../config/logger');

class DriverController {
  /**
   * GET /api/drivers
   * Get all drivers with filtering, sorting, and pagination
   */
  async getAllDrivers(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        sort = 'createdAt',
        order = 'desc',
        status,
        isOnDuty,
        currentVehicle,
        search
      } = req.query;

      // Build filter object
      const filter = { isActive: true };
      
      if (status) filter.status = status;
      if (isOnDuty !== undefined) filter['tracking.isOnDuty'] = isOnDuty === 'true';
      if (currentVehicle) filter.currentVehicle = currentVehicle;
      
      if (search) {
        filter.$or = [
          { driverId: { $regex: search, $options: 'i' } },
          { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
          { 'personalInfo.lastName': { $regex: search, $options: 'i' } },
          { 'personalInfo.email': { $regex: search, $options: 'i' } },
          { 'license.number': { $regex: search, $options: 'i' } }
        ];
      }

      // Build sort object
      const sortObj = {};
      sortObj[sort] = order === 'asc' ? 1 : -1;

      // Execute query with pagination
      const skip = (page - 1) * limit;
      const drivers = await Driver.find(filter)
        .populate('currentVehicle', 'vehicleId licensePlate type')
        .populate('employment.supervisor', 'name userId')
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Driver.countDocuments(filter);

      logger.info('Drivers retrieved', {
        userId: req.user.userId,
        count: drivers.length,
        total,
        filters: filter
      });

      res.json({
        success: true,
        data: {
          drivers,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      logger.error('Get drivers failed', {
        userId: req.user?.userId,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve drivers',
        message: error.message
      });
    }
  }

  /**
   * GET /api/drivers/:id
   * Get driver by ID
   */
  async getDriverById(req, res) {
    try {
      const { id } = req.params;

      const driver = await Driver.findById(id)
        .populate('currentVehicle')
        .populate('employment.supervisor', 'name userId');

      if (!driver || !driver.isActive) {
        return res.status(404).json({
          success: false,
          error: 'Driver not found',
          message: 'Driver does not exist or has been deactivated'
        });
      }

      // Get recent orders assigned to this driver
      const recentOrders = await Order.find({
        assignedDriver: driver._id,
        isActive: true
      })
      .populate('assignedVehicle', 'vehicleId licensePlate')
      .sort({ createdAt: -1 })
      .limit(10);

      logger.info('Driver retrieved', {
        userId: req.user.userId,
        driverId: driver.driverId
      });

      res.json({
        success: true,
        data: {
          driver,
          recentOrders
        }
      });
    } catch (error) {
      logger.error('Get driver failed', {
        userId: req.user?.userId,
        driverId: req.params.id,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve driver',
        message: error.message
      });
    }
  }

  /**
   * POST /api/drivers
   * Create new driver
   */
  async createDriver(req, res) {
    try {
      const driverData = req.body;

      // Check if driver ID already exists
      const existingDriver = await Driver.findOne({ 
        driverId: driverData.driverId 
      });

      if (existingDriver) {
        return res.status(400).json({
          success: false,
          error: 'Driver already exists',
          message: `Driver with ID ${driverData.driverId} already exists`
        });
      }

      // Check if license number already exists
      const existingLicense = await Driver.findOne({ 
        'license.number': driverData.license?.number 
      });

      if (existingLicense) {
        return res.status(400).json({
          success: false,
          error: 'License number already exists',
          message: `Driver with license number ${driverData.license.number} already exists`
        });
      }

      // Check if email already exists
      const existingEmail = await Driver.findOne({ 
        'personalInfo.email': driverData.personalInfo?.email 
      });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          error: 'Email already exists',
          message: `Driver with email ${driverData.personalInfo.email} already exists`
        });
      }

      const driver = new Driver(driverData);
      await driver.save();

      logger.info('Driver created', {
        userId: req.user.userId,
        driverId: driver.driverId,
        email: driver.personalInfo.email
      });

      res.status(201).json({
        success: true,
        message: 'Driver created successfully',
        data: { driver }
      });
    } catch (error) {
      logger.error('Create driver failed', {
        userId: req.user?.userId,
        error: error.message
      });

      res.status(400).json({
        success: false,
        error: 'Failed to create driver',
        message: error.message
      });
    }
  }

  /**
   * PUT /api/drivers/:id
   * Update driver
   */
  async updateDriver(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const driver = await Driver.findById(id);
      if (!driver || !driver.isActive) {
        return res.status(404).json({
          success: false,
          error: 'Driver not found'
        });
      }

      // Check for duplicate license number if being updated
      if (updateData.license?.number && updateData.license.number !== driver.license.number) {
        const existingLicense = await Driver.findOne({ 
          'license.number': updateData.license.number,
          _id: { $ne: id }
        });

        if (existingLicense) {
          return res.status(400).json({
            success: false,
            error: 'License number already exists'
          });
        }
      }

      // Check for duplicate email if being updated
      if (updateData.personalInfo?.email && updateData.personalInfo.email !== driver.personalInfo.email) {
        const existingEmail = await Driver.findOne({ 
          'personalInfo.email': updateData.personalInfo.email,
          _id: { $ne: id }
        });

        if (existingEmail) {
          return res.status(400).json({
            success: false,
            error: 'Email already exists'
          });
        }
      }

      // Update driver
      Object.assign(driver, updateData);
      await driver.save();

      logger.info('Driver updated', {
        userId: req.user.userId,
        driverId: driver.driverId,
        updatedFields: Object.keys(updateData)
      });

      res.json({
        success: true,
        message: 'Driver updated successfully',
        data: { driver }
      });
    } catch (error) {
      logger.error('Update driver failed', {
        userId: req.user?.userId,
        driverId: req.params.id,
        error: error.message
      });

      res.status(400).json({
        success: false,
        error: 'Failed to update driver',
        message: error.message
      });
    }
  }

  /**
   * DELETE /api/drivers/:id
   * Soft delete driver
   */
  async deleteDriver(req, res) {
    try {
      const { id } = req.params;

      const driver = await Driver.findById(id);
      if (!driver || !driver.isActive) {
        return res.status(404).json({
          success: false,
          error: 'Driver not found'
        });
      }

      // Check if driver has active orders
      const activeOrders = await Order.countDocuments({
        assignedDriver: driver._id,
        status: { $nin: ['delivered', 'cancelled', 'returned'] },
        isActive: true
      });

      if (activeOrders > 0) {
        return res.status(400).json({
          success: false,
          error: 'Cannot delete driver',
          message: 'Driver has active orders and cannot be deleted'
        });
      }

      // Unassign from vehicle if assigned
      if (driver.currentVehicle) {
        const vehicle = await Vehicle.findById(driver.currentVehicle);
        if (vehicle) {
          vehicle.assignedDriver = null;
          await vehicle.save();
        }
      }

      // Soft delete
      driver.isActive = false;
      driver.status = 'terminated';
      await driver.save();

      logger.info('Driver deleted', {
        userId: req.user.userId,
        driverId: driver.driverId
      });

      res.json({
        success: true,
        message: 'Driver deleted successfully'
      });
    } catch (error) {
      logger.error('Delete driver failed', {
        userId: req.user?.userId,
        driverId: req.params.id,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to delete driver',
        message: error.message
      });
    }
  }

  /**
   * POST /api/drivers/:id/start-shift
   * Start driver shift
   */
  async startShift(req, res) {
    try {
      const { id } = req.params;

      const driver = await Driver.findById(id);
      if (!driver || !driver.isActive) {
        return res.status(404).json({
          success: false,
          error: 'Driver not found'
        });
      }

      if (driver.tracking.isOnDuty) {
        return res.status(400).json({
          success: false,
          error: 'Driver already on duty'
        });
      }

      await driver.startShift();

      logger.info('Driver shift started', {
        userId: req.user.userId,
        driverId: driver.driverId
      });

      res.json({
        success: true,
        message: 'Shift started successfully',
        data: { driver }
      });
    } catch (error) {
      logger.error('Start shift failed', {
        userId: req.user?.userId,
        driverId: req.params.id,
        error: error.message
      });

      res.status(400).json({
        success: false,
        error: 'Failed to start shift',
        message: error.message
      });
    }
  }

  /**
   * POST /api/drivers/:id/end-shift
   * End driver shift
   */
  async endShift(req, res) {
    try {
      const { id } = req.params;

      const driver = await Driver.findById(id);
      if (!driver || !driver.isActive) {
        return res.status(404).json({
          success: false,
          error: 'Driver not found'
        });
      }

      if (!driver.tracking.isOnDuty) {
        return res.status(400).json({
          success: false,
          error: 'Driver not on duty'
        });
      }

      await driver.endShift();

      logger.info('Driver shift ended', {
        userId: req.user.userId,
        driverId: driver.driverId
      });

      res.json({
        success: true,
        message: 'Shift ended successfully',
        data: { driver }
      });
    } catch (error) {
      logger.error('End shift failed', {
        userId: req.user?.userId,
        driverId: req.params.id,
        error: error.message
      });

      res.status(400).json({
        success: false,
        error: 'Failed to end shift',
        message: error.message
      });
    }
  }

  /**
   * POST /api/drivers/:id/location
   * Update driver location
   */
  async updateLocation(req, res) {
    try {
      const { id } = req.params;
      const { longitude, latitude, address } = req.body;

      const driver = await Driver.findById(id);
      if (!driver || !driver.isActive) {
        return res.status(404).json({
          success: false,
          error: 'Driver not found'
        });
      }

      await driver.updateLocation(longitude, latitude, address);

      logger.debug('Driver location updated', {
        userId: req.user.userId,
        driverId: driver.driverId,
        location: { longitude, latitude }
      });

      res.json({
        success: true,
        message: 'Location updated successfully',
        data: {
          driver: {
            id: driver._id,
            driverId: driver.driverId,
            currentLocation: driver.currentLocation
          }
        }
      });
    } catch (error) {
      logger.error('Update driver location failed', {
        userId: req.user?.userId,
        driverId: req.params.id,
        error: error.message
      });

      res.status(400).json({
        success: false,
        error: 'Failed to update location',
        message: error.message
      });
    }
  }

  /**
   * GET /api/drivers/available
   * Get available drivers
   */
  async getAvailableDrivers(req, res) {
    try {
      const drivers = await Driver.findAvailable();

      logger.info('Available drivers retrieved', {
        userId: req.user.userId,
        count: drivers.length
      });

      res.json({
        success: true,
        data: {
          drivers,
          count: drivers.length
        }
      });
    } catch (error) {
      logger.error('Get available drivers failed', {
        userId: req.user?.userId,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve available drivers',
        message: error.message
      });
    }
  }

  /**
   * GET /api/drivers/on-duty
   * Get drivers currently on duty
   */
  async getOnDutyDrivers(req, res) {
    try {
      const drivers = await Driver.findOnDuty();

      logger.info('On-duty drivers retrieved', {
        userId: req.user.userId,
        count: drivers.length
      });

      res.json({
        success: true,
        data: {
          drivers,
          count: drivers.length
        }
      });
    } catch (error) {
      logger.error('Get on-duty drivers failed', {
        userId: req.user?.userId,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve on-duty drivers',
        message: error.message
      });
    }
  }

  /**
   * GET /api/drivers/expiring-licenses
   * Get drivers with expiring licenses
   */
  async getExpiringLicenses(req, res) {
    try {
      const { days = 30 } = req.query;

      const drivers = await Driver.findExpiringLicenses(parseInt(days));

      logger.info('Drivers with expiring licenses retrieved', {
        userId: req.user.userId,
        days: parseInt(days),
        count: drivers.length
      });

      res.json({
        success: true,
        data: {
          drivers,
          expiringWithinDays: parseInt(days),
          count: drivers.length
        }
      });
    } catch (error) {
      logger.error('Get expiring licenses failed', {
        userId: req.user?.userId,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve drivers with expiring licenses',
        message: error.message
      });
    }
  }

  /**
   * GET /api/drivers/:id/performance
   * Get driver performance metrics
   */
  async getDriverPerformance(req, res) {
    try {
      const { id } = req.params;

      const driver = await Driver.findById(id);
      if (!driver || !driver.isActive) {
        return res.status(404).json({
          success: false,
          error: 'Driver not found'
        });
      }

      // Get recent orders for performance calculation
      const recentOrders = await Order.find({
        assignedDriver: driver._id,
        status: 'delivered',
        isActive: true,
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
      });

      const performanceMetrics = {
        driver: {
          id: driver._id,
          driverId: driver.driverId,
          name: driver.fullName
        },
        performance: driver.performance,
        virtualMetrics: {
          performanceScore: driver.performanceScore,
          licenseStatus: driver.licenseStatus,
          age: driver.age
        },
        recentActivity: {
          ordersLast30Days: recentOrders.length,
          averageDeliveryTime: recentOrders.length > 0 
            ? recentOrders.reduce((sum, order) => sum + (order.tracking.actualDuration || 0), 0) / recentOrders.length
            : 0
        }
      };

      logger.info('Driver performance retrieved', {
        userId: req.user.userId,
        driverId: driver.driverId
      });

      res.json({
        success: true,
        data: performanceMetrics
      });
    } catch (error) {
      logger.error('Get driver performance failed', {
        userId: req.user?.userId,
        driverId: req.params.id,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve driver performance',
        message: error.message
      });
    }
  }
}

module.exports = new DriverController();