const { Order, Vehicle, Driver, Route } = require('../models');
const logger = require('../config/logger');

class OrderController {
  /**
   * GET /api/orders
   * Get all orders with filtering, sorting, and pagination
   */
  async getAllOrders(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        sort = 'createdAt',
        order = 'desc',
        status,
        priority,
        assignedVehicle,
        assignedDriver,
        paymentStatus,
        search,
        startDate,
        endDate
      } = req.query;

      // Build filter object
      const filter = { isActive: true };
      
      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      if (assignedVehicle) filter.assignedVehicle = assignedVehicle;
      if (assignedDriver) filter.assignedDriver = assignedDriver;
      if (paymentStatus) filter['pricing.paymentStatus'] = paymentStatus;
      
      if (search) {
        filter.$or = [
          { orderId: { $regex: search, $options: 'i' } },
          { 'customerInfo.name': { $regex: search, $options: 'i' } },
          { 'customerInfo.company': { $regex: search, $options: 'i' } }
        ];
      }

      // Date range filter
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
      }

      // Build sort object
      const sortObj = {};
      sortObj[sort] = order === 'asc' ? 1 : -1;

      // Execute query with pagination
      const skip = (page - 1) * limit;
      const orders = await Order.find(filter)
        .populate('assignedVehicle', 'vehicleId licensePlate type')
        .populate('assignedDriver', 'driverId personalInfo.firstName personalInfo.lastName')
        .populate('route', 'routeId name status')
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Order.countDocuments(filter);

      logger.info('Orders retrieved', {
        userId: req.user.userId,
        count: orders.length,
        total,
        filters: filter
      });

      res.json({
        success: true,
        data: {
          orders,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      logger.error('Get orders failed', {
        userId: req.user?.userId,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve orders',
        message: error.message
      });
    }
  }

  /**
   * GET /api/orders/:id
   * Get order by ID
   */
  async getOrderById(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.findById(id)
        .populate('assignedVehicle')
        .populate('assignedDriver')
        .populate('route')
        .populate('statusHistory.updatedBy', 'name userId')
        .populate('notes.author', 'name userId');

      if (!order || !order.isActive) {
        return res.status(404).json({
          success: false,
          error: 'Order not found',
          message: 'Order does not exist or has been deactivated'
        });
      }

      logger.info('Order retrieved', {
        userId: req.user.userId,
        orderId: order.orderId
      });

      res.json({
        success: true,
        data: { order }
      });
    } catch (error) {
      logger.error('Get order failed', {
        userId: req.user?.userId,
        orderId: req.params.id,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve order',
        message: error.message
      });
    }
  }

  /**
   * POST /api/orders
   * Create new order
   */
  async createOrder(req, res) {
    try {
      const orderData = req.body;

      // Check if order ID already exists
      const existingOrder = await Order.findOne({ 
        orderId: orderData.orderId 
      });

      if (existingOrder) {
        return res.status(400).json({
          success: false,
          error: 'Order already exists',
          message: `Order with ID ${orderData.orderId} already exists`
        });
      }

      // Calculate distance if not provided
      const order = new Order(orderData);
      if (!order.tracking.estimatedDistance) {
        order.calculateDistance();
      }

      await order.save();

      // Add initial status to history
      await order.updateStatus('pending', null, 'Order created', req.user._id);

      logger.info('Order created', {
        userId: req.user.userId,
        orderId: order.orderId,
        customerId: order.customerInfo.name
      });

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: { order }
      });
    } catch (error) {
      logger.error('Create order failed', {
        userId: req.user?.userId,
        error: error.message
      });

      res.status(400).json({
        success: false,
        error: 'Failed to create order',
        message: error.message
      });
    }
  }

  /**
   * PUT /api/orders/:id
   * Update order
   */
  async updateOrder(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const order = await Order.findById(id);
      if (!order || !order.isActive) {
        return res.status(404).json({
          success: false,
          error: 'Order not found'
        });
      }

      // Prevent updating certain fields if order is in progress
      const restrictedStatuses = ['picked_up', 'in_transit', 'delivered'];
      if (restrictedStatuses.includes(order.status)) {
        const restrictedFields = ['pickup', 'delivery', 'items'];
        const hasRestrictedUpdate = restrictedFields.some(field => 
          updateData.hasOwnProperty(field)
        );

        if (hasRestrictedUpdate) {
          return res.status(400).json({
            success: false,
            error: 'Cannot update order details',
            message: 'Order details cannot be modified after pickup'
          });
        }
      }

      // Update order
      Object.assign(order, updateData);
      
      // Recalculate distance if pickup/delivery locations changed
      if (updateData.pickup || updateData.delivery) {
        order.calculateDistance();
      }

      await order.save();

      logger.info('Order updated', {
        userId: req.user.userId,
        orderId: order.orderId,
        updatedFields: Object.keys(updateData)
      });

      res.json({
        success: true,
        message: 'Order updated successfully',
        data: { order }
      });
    } catch (error) {
      logger.error('Update order failed', {
        userId: req.user?.userId,
        orderId: req.params.id,
        error: error.message
      });

      res.status(400).json({
        success: false,
        error: 'Failed to update order',
        message: error.message
      });
    }
  }

  /**
   * DELETE /api/orders/:id
   * Soft delete order
   */
  async deleteOrder(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.findById(id);
      if (!order || !order.isActive) {
        return res.status(404).json({
          success: false,
          error: 'Order not found'
        });
      }

      // Check if order can be deleted
      const nonDeletableStatuses = ['picked_up', 'in_transit', 'delivered'];
      if (nonDeletableStatuses.includes(order.status)) {
        return res.status(400).json({
          success: false,
          error: 'Cannot delete order',
          message: 'Order cannot be deleted after pickup'
        });
      }

      // Soft delete
      order.isActive = false;
      await order.save();

      logger.info('Order deleted', {
        userId: req.user.userId,
        orderId: order.orderId
      });

      res.json({
        success: true,
        message: 'Order deleted successfully'
      });
    } catch (error) {
      logger.error('Delete order failed', {
        userId: req.user?.userId,
        orderId: req.params.id,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to delete order',
        message: error.message
      });
    }
  }

  /**
   * POST /api/orders/:id/status
   * Update order status
   */
  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, notes, location } = req.body;

      const order = await Order.findById(id);
      if (!order || !order.isActive) {
        return res.status(404).json({
          success: false,
          error: 'Order not found'
        });
      }

      // Validate status transition
      const validTransitions = {
        'pending': ['confirmed', 'cancelled'],
        'confirmed': ['assigned', 'cancelled'],
        'assigned': ['pickup_scheduled', 'cancelled'],
        'pickup_scheduled': ['en_route_pickup', 'failed_pickup', 'cancelled'],
        'en_route_pickup': ['arrived_pickup', 'failed_pickup'],
        'arrived_pickup': ['picked_up', 'failed_pickup'],
        'picked_up': ['in_transit'],
        'in_transit': ['en_route_delivery', 'returned'],
        'en_route_delivery': ['arrived_delivery', 'failed_delivery'],
        'arrived_delivery': ['delivered', 'failed_delivery'],
        'failed_pickup': ['pickup_scheduled', 'cancelled'],
        'failed_delivery': ['en_route_delivery', 'returned']
      };

      const allowedStatuses = validTransitions[order.status] || [];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status transition',
          message: `Cannot change status from ${order.status} to ${status}`
        });
      }

      // Update status
      await order.updateStatus(status, location, notes, req.user._id);

      logger.info('Order status updated', {
        userId: req.user.userId,
        orderId: order.orderId,
        oldStatus: order.status,
        newStatus: status
      });

      res.json({
        success: true,
        message: 'Order status updated successfully',
        data: { 
          order: await order.populate('assignedVehicle assignedDriver')
        }
      });
    } catch (error) {
      logger.error('Update order status failed', {
        userId: req.user?.userId,
        orderId: req.params.id,
        error: error.message
      });

      res.status(400).json({
        success: false,
        error: 'Failed to update order status',
        message: error.message
      });
    }
  }

  /**
   * POST /api/orders/:id/assign
   * Assign vehicle and driver to order
   */
  async assignOrder(req, res) {
    try {
      const { id } = req.params;
      const { vehicleId, driverId } = req.body;

      const order = await Order.findById(id);
      if (!order || !order.isActive) {
        return res.status(404).json({
          success: false,
          error: 'Order not found'
        });
      }

      // Validate order status
      if (!['confirmed', 'assigned'].includes(order.status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid order status',
          message: 'Order must be confirmed before assignment'
        });
      }

      // Validate vehicle
      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle || !vehicle.isActive || vehicle.status !== 'active') {
        return res.status(400).json({
          success: false,
          error: 'Vehicle not available',
          message: 'Selected vehicle is not available for assignment'
        });
      }

      // Validate driver
      const driver = await Driver.findById(driverId);
      if (!driver || !driver.isActive || driver.status !== 'active') {
        return res.status(400).json({
          success: false,
          error: 'Driver not available',
          message: 'Selected driver is not available for assignment'
        });
      }

      // Assign order
      await order.assign(vehicleId, driverId);

      logger.info('Order assigned', {
        userId: req.user.userId,
        orderId: order.orderId,
        vehicleId: vehicle.vehicleId,
        driverId: driver.driverId
      });

      res.json({
        success: true,
        message: 'Order assigned successfully',
        data: {
          order: await order.populate('assignedVehicle assignedDriver')
        }
      });
    } catch (error) {
      logger.error('Assign order failed', {
        userId: req.user?.userId,
        orderId: req.params.id,
        error: error.message
      });

      res.status(400).json({
        success: false,
        error: 'Failed to assign order',
        message: error.message
      });
    }
  }

  /**
   * POST /api/orders/:id/notes
   * Add note to order
   */
  async addOrderNote(req, res) {
    try {
      const { id } = req.params;
      const { content, type = 'general' } = req.body;

      const order = await Order.findById(id);
      if (!order || !order.isActive) {
        return res.status(404).json({
          success: false,
          error: 'Order not found'
        });
      }

      await order.addNote(content, req.user._id, type);

      logger.info('Order note added', {
        userId: req.user.userId,
        orderId: order.orderId,
        noteType: type
      });

      res.json({
        success: true,
        message: 'Note added successfully',
        data: {
          order: await order.populate('notes.author', 'name userId')
        }
      });
    } catch (error) {
      logger.error('Add order note failed', {
        userId: req.user?.userId,
        orderId: req.params.id,
        error: error.message
      });

      res.status(400).json({
        success: false,
        error: 'Failed to add note',
        message: error.message
      });
    }
  }

  /**
   * GET /api/orders/overdue
   * Get overdue orders
   */
  async getOverdueOrders(req, res) {
    try {
      const overdueOrders = await Order.findOverdue();

      logger.info('Overdue orders retrieved', {
        userId: req.user.userId,
        count: overdueOrders.length
      });

      res.json({
        success: true,
        data: {
          orders: overdueOrders,
          count: overdueOrders.length
        }
      });
    } catch (error) {
      logger.error('Get overdue orders failed', {
        userId: req.user?.userId,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve overdue orders',
        message: error.message
      });
    }
  }

  /**
   * GET /api/orders/by-priority/:priority
   * Get orders by priority
   */
  async getOrdersByPriority(req, res) {
    try {
      const { priority } = req.params;

      const orders = await Order.findByPriority(priority);

      logger.info('Orders by priority retrieved', {
        userId: req.user.userId,
        priority,
        count: orders.length
      });

      res.json({
        success: true,
        data: {
          orders,
          priority,
          count: orders.length
        }
      });
    } catch (error) {
      logger.error('Get orders by priority failed', {
        userId: req.user?.userId,
        priority: req.params.priority,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve orders by priority',
        message: error.message
      });
    }
  }

  /**
   * GET /api/orders/in-area
   * Find orders in geographical area
   */
  async getOrdersInArea(req, res) {
    try {
      const { longitude, latitude, radius = 10 } = req.query;

      if (!longitude || !latitude) {
        return res.status(400).json({
          success: false,
          error: 'Longitude and latitude are required'
        });
      }

      const orders = await Order.findInArea(
        parseFloat(longitude),
        parseFloat(latitude),
        parseFloat(radius)
      );

      logger.info('Orders in area found', {
        userId: req.user.userId,
        location: { longitude, latitude },
        radius,
        count: orders.length
      });

      res.json({
        success: true,
        data: {
          orders,
          searchLocation: {
            longitude: parseFloat(longitude),
            latitude: parseFloat(latitude)
          },
          radius: parseFloat(radius),
          count: orders.length
        }
      });
    } catch (error) {
      logger.error('Find orders in area failed', {
        userId: req.user?.userId,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to find orders in area',
        message: error.message
      });
    }
  }
}

module.exports = new OrderController();