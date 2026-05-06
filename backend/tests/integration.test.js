const request = require('supertest');
const mongoose = require('mongoose');
const FleetManagementServer = require('../server');
const { User, Vehicle, Driver, Order, GPSTracking } = require('../models');
const DatabaseSeeder = require('../scripts/seed');

describe('Fleet Management System Integration Tests', () => {
  let app;
  let server;
  let adminToken;
  let testVehicle;
  let testDriver;
  let testOrder;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/fleet_management_test');
    
    // Create server instance
    server = new FleetManagementServer();
    await server.initialize();
    app = server.app;

    // Seed test data
    const seeder = new DatabaseSeeder();
    await seeder.seedAll();

    // Get admin token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        userId: 'CRMAI@23',
        password: 'AI0023'
      });

    adminToken = loginResponse.body.data.tokens.accessToken;

    // Get test entities
    testVehicle = await Vehicle.findOne({ vehicleId: 'VH001' });
    testDriver = await Driver.findOne({ driverId: 'DRV001' });
    testOrder = await Order.findOne({ orderId: 'ORD001' });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('System Health', () => {
    it('should return system health status', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(response.body.database).toBeDefined();
      expect(response.body.redis).toBeDefined();
    });
  });

  describe('Authentication System', () => {
    it('should authenticate with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          userId: 'CRMAI@23',
          password: 'AI0023'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.tokens.accessToken).toBeDefined();
    });

    it('should get current user info', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.user.userId).toBe('CRMAI@23');
      expect(response.body.data.user.role).toBe('admin');
    });
  });

  describe('Vehicle Management', () => {
    it('should get all vehicles', async () => {
      const response = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.vehicles)).toBe(true);
      expect(response.body.data.vehicles.length).toBeGreaterThan(0);
    });

    it('should get vehicle by ID', async () => {
      const response = await request(app)
        .get(`/api/vehicles/${testVehicle._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.vehicle.vehicleId).toBe('VH001');
    });

    it('should create new vehicle', async () => {
      const newVehicle = {
        vehicleId: 'TEST001',
        licensePlate: 'TEST001',
        type: 'van',
        make: 'Ford',
        model: 'Transit',
        year: 2023,
        capacity: {
          weight: 3500,
          volume: 15,
          unit: 'kg'
        },
        specifications: {
          fuelType: 'gasoline',
          fuelCapacity: 80
        },
        currentLocation: {
          coordinates: [-74.006, 40.7128],
          address: 'Test Location'
        }
      };

      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newVehicle);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.vehicle.vehicleId).toBe('TEST001');
    });

    it('should find nearby vehicles', async () => {
      const response = await request(app)
        .get('/api/vehicles/nearby')
        .query({
          longitude: -74.006,
          latitude: 40.7128,
          radius: 50
        })
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data.vehicles)).toBe(true);
    });
  });

  describe('Driver Management', () => {
    it('should get all drivers', async () => {
      const response = await request(app)
        .get('/api/drivers')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.drivers)).toBe(true);
    });

    it('should get driver by ID', async () => {
      const response = await request(app)
        .get(`/api/drivers/${testDriver._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.driver.driverId).toBe('DRV001');
    });

    it('should start driver shift', async () => {
      const response = await request(app)
        .post(`/api/drivers/${testDriver._id}/start-shift`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should get available drivers', async () => {
      const response = await request(app)
        .get('/api/drivers/available')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data.drivers)).toBe(true);
    });
  });

  describe('Order Management', () => {
    it('should get all orders', async () => {
      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.orders)).toBe(true);
    });

    it('should get order by ID', async () => {
      const response = await request(app)
        .get(`/api/orders/${testOrder._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.order.orderId).toBe('ORD001');
    });

    it('should update order status', async () => {
      const response = await request(app)
        .post(`/api/orders/${testOrder._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'confirmed',
          notes: 'Order confirmed by admin'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should assign order to vehicle and driver', async () => {
      const response = await request(app)
        .post(`/api/orders/${testOrder._id}/assign`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          vehicleId: testVehicle._id,
          driverId: testDriver._id
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GPS Tracking', () => {
    it('should update GPS location', async () => {
      const gpsUpdate = {
        vehicleId: 'VH001',
        location: {
          coordinates: [-74.007, 40.7129]
        },
        speed: 45,
        heading: 90,
        engineStatus: 'on',
        fuelLevel: 75
      };

      const response = await request(app)
        .post('/api/gps/update')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(gpsUpdate);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should get live vehicle positions', async () => {
      const response = await request(app)
        .get('/api/gps/vehicles/live')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data.positions)).toBe(true);
    });

    it('should get vehicle tracking history', async () => {
      const response = await request(app)
        .get('/api/gps/vehicle/VH001/history')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data.history)).toBe(true);
    });

    it('should batch update GPS locations', async () => {
      const batchUpdate = {
        updates: [
          {
            vehicleId: 'VH001',
            location: { coordinates: [-74.008, 40.713] },
            speed: 50
          },
          {
            vehicleId: 'VH002',
            location: { coordinates: [-73.944, 40.678] },
            speed: 35
          }
        ]
      };

      const response = await request(app)
        .post('/api/gps/batch-update')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(batchUpdate);

      expect(response.status).toBe(200);
      expect(response.body.data.successful.length).toBe(2);
    });
  });

  describe('Database Operations', () => {
    it('should maintain data relationships', async () => {
      // Test vehicle-driver relationship
      const vehicle = await Vehicle.findById(testVehicle._id).populate('assignedDriver');
      expect(vehicle.assignedDriver).toBeDefined();

      // Test order-vehicle-driver relationship
      const order = await Order.findById(testOrder._id)
        .populate('assignedVehicle')
        .populate('assignedDriver');
      
      expect(order.assignedVehicle).toBeDefined();
      expect(order.assignedDriver).toBeDefined();
    });

    it('should handle geospatial queries', async () => {
      const nearbyVehicles = await Vehicle.findNearby(-74.006, 40.7128, 10);
      expect(Array.isArray(nearbyVehicles)).toBe(true);
    });

    it('should validate GPS tracking data', async () => {
      const gpsData = new GPSTracking({
        vehicle: testVehicle._id,
        location: {
          coordinates: [-74.006, 40.7128]
        },
        speed: 45,
        source: 'test'
      });

      await gpsData.save();
      expect(gpsData.isValid).toBe(true);
    });
  });

  describe('Security and Validation', () => {
    it('should reject requests without authentication', async () => {
      const response = await request(app)
        .get('/api/vehicles');

      expect(response.status).toBe(401);
    });

    it('should validate input data', async () => {
      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          vehicleId: '', // Invalid empty ID
          type: 'invalid_type' // Invalid type
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should enforce rate limiting', async () => {
      // This test would need to be adjusted based on actual rate limits
      // For now, just verify the middleware is in place
      const response = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.headers['x-ratelimit-limit']).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for non-existent resources', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/vehicles/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });

    it('should handle invalid MongoDB ObjectIds', async () => {
      const response = await request(app)
        .get('/api/vehicles/invalid-id')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(400);
    });
  });
});