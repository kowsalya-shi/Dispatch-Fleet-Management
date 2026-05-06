require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('../config/logger');
const database = require('../config/database');
const redis = require('../config/redis');
const { User, Vehicle, Driver, Order, GPSTracking } = require('../models');

class SystemVerifier {
  constructor() {
    this.results = {
      database: { status: 'pending', tests: [] },
      redis: { status: 'pending', tests: [] },
      models: { status: 'pending', tests: [] },
      authentication: { status: 'pending', tests: [] },
      api: { status: 'pending', tests: [] },
      overall: { status: 'pending', score: 0 }
    };
  }

  async verifyDatabase() {
    console.log('\n🔍 Verifying Database Connection...');
    
    try {
      await database.connect();
      this.results.database.tests.push({ name: 'Connection', status: 'pass' });
      
      // Test basic operations
      const collections = await mongoose.connection.db.listCollections().toArray();
      this.results.database.tests.push({ 
        name: 'Collections Access', 
        status: 'pass',
        details: `Found ${collections.length} collections`
      });

      // Test indexes
      const vehicleIndexes = await Vehicle.collection.getIndexes();
      const hasGeospatialIndex = Object.keys(vehicleIndexes).some(key => 
        vehicleIndexes[key].some(index => index.key && index.key['currentLocation'])
      );
      
      this.results.database.tests.push({ 
        name: 'Geospatial Indexes', 
        status: hasGeospatialIndex ? 'pass' : 'fail',
        details: hasGeospatialIndex ? 'Geospatial indexes found' : 'Missing geospatial indexes'
      });

      this.results.database.status = 'pass';
      console.log('✅ Database verification completed');
      
    } catch (error) {
      this.results.database.status = 'fail';
      this.results.database.tests.push({ 
        name: 'Connection', 
        status: 'fail', 
        error: error.message 
      });
      console.log('❌ Database verification failed:', error.message);
    }
  }

  async verifyRedis() {
    console.log('\n🔍 Verifying Redis Connection...');
    
    try {
      await redis.connect();
      this.results.redis.tests.push({ name: 'Connection', status: 'pass' });

      // Test basic operations
      const testKey = 'system-verify-test';
      const testValue = { timestamp: Date.now(), test: true };
      
      await redis.set(testKey, testValue, 60);
      const retrieved = await redis.get(testKey);
      
      if (retrieved && JSON.parse(retrieved).test === true) {
        this.results.redis.tests.push({ name: 'Set/Get Operations', status: 'pass' });
      } else {
        this.results.redis.tests.push({ name: 'Set/Get Operations', status: 'fail' });
      }

      // Test pub/sub
      const pubSubTest = await redis.publish('test-channel', { message: 'test' });
      this.results.redis.tests.push({ 
        name: 'Pub/Sub', 
        status: pubSubTest ? 'pass' : 'fail' 
      });

      // Cleanup
      await redis.del(testKey);

      this.results.redis.status = 'pass';
      console.log('✅ Redis verification completed');
      
    } catch (error) {
      this.results.redis.status = 'fail';
      this.results.redis.tests.push({ 
        name: 'Connection', 
        status: 'fail', 
        error: error.message 
      });
      console.log('❌ Redis verification failed:', error.message);
    }
  }

  async verifyModels() {
    console.log('\n🔍 Verifying Database Models...');
    
    try {
      // Test User model
      const userCount = await User.countDocuments();
      this.results.models.tests.push({ 
        name: 'User Model', 
        status: 'pass',
        details: `${userCount} users found`
      });

      // Test Vehicle model with geospatial query
      const vehicleCount = await Vehicle.countDocuments();
      const nearbyVehicles = await Vehicle.findNearby(-74.006, 40.7128, 50);
      this.results.models.tests.push({ 
        name: 'Vehicle Model & Geospatial', 
        status: 'pass',
        details: `${vehicleCount} vehicles, ${nearbyVehicles.length} nearby`
      });

      // Test Driver model
      const driverCount = await Driver.countDocuments();
      const availableDrivers = await Driver.findAvailable();
      this.results.models.tests.push({ 
        name: 'Driver Model', 
        status: 'pass',
        details: `${driverCount} drivers, ${availableDrivers.length} available`
      });

      // Test Order model
      const orderCount = await Order.countDocuments();
      const overdueOrders = await Order.findOverdue();
      this.results.models.tests.push({ 
        name: 'Order Model', 
        status: 'pass',
        details: `${orderCount} orders, ${overdueOrders.length} overdue`
      });

      // Test GPS Tracking model
      const gpsCount = await GPSTracking.countDocuments();
      this.results.models.tests.push({ 
        name: 'GPS Tracking Model', 
        status: 'pass',
        details: `${gpsCount} GPS records`
      });

      // Test relationships
      const vehicleWithDriver = await Vehicle.findOne({ assignedDriver: { $ne: null } })
        .populate('assignedDriver');
      
      this.results.models.tests.push({ 
        name: 'Model Relationships', 
        status: vehicleWithDriver && vehicleWithDriver.assignedDriver ? 'pass' : 'fail',
        details: vehicleWithDriver ? 'Vehicle-Driver relationship working' : 'No relationships found'
      });

      this.results.models.status = 'pass';
      console.log('✅ Models verification completed');
      
    } catch (error) {
      this.results.models.status = 'fail';
      this.results.models.tests.push({ 
        name: 'Model Operations', 
        status: 'fail', 
        error: error.message 
      });
      console.log('❌ Models verification failed:', error.message);
    }
  }

  async verifyAuthentication() {
    console.log('\n🔍 Verifying Authentication System...');
    
    try {
      const authService = require('../services/authService');
      
      // Test user authentication
      const testUser = await User.findOne({ userId: 'CRMAI@23' });
      if (!testUser) {
        throw new Error('Test user not found');
      }

      // Test token generation
      const accessToken = authService.generateAccessToken(testUser);
      const refreshToken = authService.generateRefreshToken(testUser);
      
      this.results.authentication.tests.push({ 
        name: 'Token Generation', 
        status: accessToken && refreshToken ? 'pass' : 'fail' 
      });

      // Test token verification
      const decoded = authService.verifyToken(accessToken);
      this.results.authentication.tests.push({ 
        name: 'Token Verification', 
        status: decoded.userId === testUser._id.toString() ? 'pass' : 'fail' 
      });

      // Test permission system
      const hasPermission = authService.hasPermission(testUser, 'vehicles', 'read');
      this.results.authentication.tests.push({ 
        name: 'Permission System', 
        status: hasPermission ? 'pass' : 'fail' 
      });

      // Test password comparison
      const isValidPassword = await testUser.comparePassword('AI0023');
      this.results.authentication.tests.push({ 
        name: 'Password Verification', 
        status: isValidPassword ? 'pass' : 'fail' 
      });

      this.results.authentication.status = 'pass';
      console.log('✅ Authentication verification completed');
      
    } catch (error) {
      this.results.authentication.status = 'fail';
      this.results.authentication.tests.push({ 
        name: 'Authentication System', 
        status: 'fail', 
        error: error.message 
      });
      console.log('❌ Authentication verification failed:', error.message);
    }
  }

  async verifyAPI() {
    console.log('\n🔍 Verifying API Structure...');
    
    try {
      // Check if route files exist
      const fs = require('fs');
      const routes = ['auth', 'vehicles', 'orders', 'drivers', 'gps'];
      
      for (const route of routes) {
        const routePath = `./routes/${route}.js`;
        if (fs.existsSync(routePath)) {
          this.results.api.tests.push({ 
            name: `${route} routes`, 
            status: 'pass' 
          });
        } else {
          this.results.api.tests.push({ 
            name: `${route} routes`, 
            status: 'fail',
            error: 'Route file not found'
          });
        }
      }

      // Check controllers
      const controllers = ['vehicleController', 'orderController', 'driverController', 'gpsController'];
      
      for (const controller of controllers) {
        try {
          require(`../controllers/${controller}`);
          this.results.api.tests.push({ 
            name: `${controller}`, 
            status: 'pass' 
          });
        } catch (error) {
          this.results.api.tests.push({ 
            name: `${controller}`, 
            status: 'fail',
            error: error.message
          });
        }
      }

      // Check middleware
      const middleware = ['auth', 'validation', 'rateLimiter'];
      
      for (const mw of middleware) {
        try {
          require(`../middleware/${mw}`);
          this.results.api.tests.push({ 
            name: `${mw} middleware`, 
            status: 'pass' 
          });
        } catch (error) {
          this.results.api.tests.push({ 
            name: `${mw} middleware`, 
            status: 'fail',
            error: error.message
          });
        }
      }

      this.results.api.status = 'pass';
      console.log('✅ API verification completed');
      
    } catch (error) {
      this.results.api.status = 'fail';
      this.results.api.tests.push({ 
        name: 'API Structure', 
        status: 'fail', 
        error: error.message 
      });
      console.log('❌ API verification failed:', error.message);
    }
  }

  calculateOverallScore() {
    const categories = ['database', 'redis', 'models', 'authentication', 'api'];
    let totalTests = 0;
    let passedTests = 0;

    categories.forEach(category => {
      const tests = this.results[category].tests;
      totalTests += tests.length;
      passedTests += tests.filter(test => test.status === 'pass').length;
    });

    this.results.overall.score = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
    this.results.overall.status = this.results.overall.score >= 90 ? 'pass' : 
                                  this.results.overall.score >= 70 ? 'warning' : 'fail';
  }

  printResults() {
    console.log('\n' + '='.repeat(60));
    console.log('🏁 SYSTEM VERIFICATION RESULTS');
    console.log('='.repeat(60));

    const categories = ['database', 'redis', 'models', 'authentication', 'api'];
    
    categories.forEach(category => {
      const result = this.results[category];
      const statusIcon = result.status === 'pass' ? '✅' : 
                        result.status === 'warning' ? '⚠️' : '❌';
      
      console.log(`\n${statusIcon} ${category.toUpperCase()}: ${result.status}`);
      
      result.tests.forEach(test => {
        const testIcon = test.status === 'pass' ? '  ✓' : '  ✗';
        console.log(`${testIcon} ${test.name}${test.details ? ` (${test.details})` : ''}`);
        if (test.error) {
          console.log(`    Error: ${test.error}`);
        }
      });
    });

    console.log('\n' + '='.repeat(60));
    const overallIcon = this.results.overall.status === 'pass' ? '🎉' : 
                       this.results.overall.status === 'warning' ? '⚠️' : '🚨';
    
    console.log(`${overallIcon} OVERALL SCORE: ${this.results.overall.score}% (${this.results.overall.status.toUpperCase()})`);
    console.log('='.repeat(60));

    if (this.results.overall.score >= 90) {
      console.log('\n🚀 System is ready for real-time features implementation!');
    } else if (this.results.overall.score >= 70) {
      console.log('\n⚠️  System has some issues but can proceed with caution.');
    } else {
      console.log('\n🚨 System has critical issues that need to be resolved.');
    }
  }

  async runFullVerification() {
    console.log('🔧 Starting Fleet Management System Verification...');
    console.log('This will verify all core backend infrastructure components.\n');

    await this.verifyDatabase();
    await this.verifyRedis();
    await this.verifyModels();
    await this.verifyAuthentication();
    await this.verifyAPI();

    this.calculateOverallScore();
    this.printResults();

    // Cleanup connections
    await database.disconnect();
    await redis.disconnect();

    return this.results;
  }
}

// Run verification if this file is executed directly
if (require.main === module) {
  const verifier = new SystemVerifier();
  verifier.runFullVerification()
    .then(results => {
      process.exit(results.overall.status === 'pass' ? 0 : 1);
    })
    .catch(error => {
      console.error('Verification failed:', error);
      process.exit(1);
    });
}

module.exports = SystemVerifier;