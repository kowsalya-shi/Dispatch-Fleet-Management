require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const logger = require('../config/logger');
const { User, Vehicle, Driver, Order, Route, GPSTracking } = require('../models');

class DatabaseSeeder {
  constructor() {
    this.isConnected = false;
  }

  async connect() {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      this.isConnected = true;
      logger.info('Connected to MongoDB for seeding');
    } catch (error) {
      logger.error('Failed to connect to MongoDB', { error: error.message });
      process.exit(1);
    }
  }

  async disconnect() {
    if (this.isConnected) {
      await mongoose.connection.close();
      logger.info('Disconnected from MongoDB');
    }
  }

  async clearDatabase() {
    try {
      await User.deleteMany({});
      await Vehicle.deleteMany({});
      await Driver.deleteMany({});
      await Order.deleteMany({});
      await Route.deleteMany({});
      await GPSTracking.deleteMany({});
      
      logger.info('Database cleared successfully');
    } catch (error) {
      logger.error('Failed to clear database', { error: error.message });
      throw error;
    }
  }

  async seedUsers() {
    try {
      const users = [
        {
          userId: 'CRMAI@23',
          password: 'AI0023',
          role: 'admin',
          name: 'Fleet Administrator',
          email: 'admin@fleetmanagement.com',
          phone: '+1-555-0001',
          permissions: [
            { resource: 'vehicles', actions: ['create', 'read', 'update', 'delete'] },
            { resource: 'orders', actions: ['create', 'read', 'update', 'delete'] },
            { resource: 'routes', actions: ['create', 'read', 'update', 'delete'] },
            { resource: 'drivers', actions: ['create', 'read', 'update', 'delete'] },
            { resource: 'reports', actions: ['create', 'read', 'update', 'delete'] },
            { resource: 'settings', actions: ['create', 'read', 'update', 'delete'] }
          ]
        },
        {
          userId: 'MGR001',
          password: 'manager123',
          role: 'manager',
          name: 'John Manager',
          email: 'manager@fleetmanagement.com',
          phone: '+1-555-0002',
          permissions: [
            { resource: 'vehicles', actions: ['read', 'update'] },
            { resource: 'orders', actions: ['create', 'read', 'update'] },
            { resource: 'routes', actions: ['create', 'read', 'update'] },
            { resource: 'drivers', actions: ['read', 'update'] },
            { resource: 'reports', actions: ['read'] }
          ]
        },
        {
          userId: 'DISP001',
          password: 'dispatch123',
          role: 'dispatcher',
          name: 'Sarah Dispatcher',
          email: 'dispatcher@fleetmanagement.com',
          phone: '+1-555-0003',
          permissions: [
            { resource: 'vehicles', actions: ['read'] },
            { resource: 'orders', actions: ['create', 'read', 'update'] },
            { resource: 'routes', actions: ['create', 'read', 'update'] },
            { resource: 'drivers', actions: ['read'] }
          ]
        }
      ];

      const createdUsers = await User.insertMany(users);
      logger.info(`Created ${createdUsers.length} users`);
      return createdUsers;
    } catch (error) {
      logger.error('Failed to seed users', { error: error.message });
      throw error;
    }
  }

  async seedDrivers() {
    try {
      const drivers = [
        {
          driverId: 'DRV001',
          personalInfo: {
            firstName: 'Mike',
            lastName: 'Johnson',
            dateOfBirth: new Date('1985-03-15'),
            phone: '+1-555-1001',
            email: 'mike.johnson@fleetmanagement.com',
            address: {
              street: '123 Main St',
              city: 'New York',
              state: 'NY',
              zipCode: '10001',
              country: 'USA'
            },
            emergencyContact: {
              name: 'Jane Johnson',
              phone: '+1-555-1002',
              relationship: 'Spouse'
            }
          },
          license: {
            number: 'CDL123456789',
            class: 'CDL-A',
            expiryDate: new Date('2025-12-31'),
            endorsements: ['Hazmat', 'Passenger']
          },
          employment: {
            hireDate: new Date('2020-01-15'),
            employeeId: 'EMP001',
            department: 'Transportation',
            salary: {
              amount: 25,
              currency: 'USD',
              payPeriod: 'hourly'
            }
          },
          workSchedule: {
            shiftStart: '06:00',
            shiftEnd: '14:00',
            workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
            timeZone: 'America/New_York'
          },
          performance: {
            rating: 4.5,
            totalTrips: 1250,
            totalDistance: 125000,
            onTimeDeliveries: 1200,
            lateDeliveries: 50
          }
        },
        {
          driverId: 'DRV002',
          personalInfo: {
            firstName: 'Lisa',
            lastName: 'Chen',
            dateOfBirth: new Date('1990-07-22'),
            phone: '+1-555-1003',
            email: 'lisa.chen@fleetmanagement.com',
            address: {
              street: '456 Oak Ave',
              city: 'Brooklyn',
              state: 'NY',
              zipCode: '11201',
              country: 'USA'
            }
          },
          license: {
            number: 'CDL987654321',
            class: 'CDL-B',
            expiryDate: new Date('2026-06-30')
          },
          employment: {
            hireDate: new Date('2021-03-01'),
            employeeId: 'EMP002',
            department: 'Transportation'
          },
          workSchedule: {
            shiftStart: '14:00',
            shiftEnd: '22:00',
            workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
          },
          performance: {
            rating: 4.8,
            totalTrips: 890,
            totalDistance: 67000,
            onTimeDeliveries: 875,
            lateDeliveries: 15
          }
        }
      ];

      const createdDrivers = await Driver.insertMany(drivers);
      logger.info(`Created ${createdDrivers.length} drivers`);
      return createdDrivers;
    } catch (error) {
      logger.error('Failed to seed drivers', { error: error.message });
      throw error;
    }
  }

  async seedVehicles(drivers) {
    try {
      const vehicles = [
        {
          vehicleId: 'VH001',
          licensePlate: 'FL001NY',
          type: 'truck',
          make: 'Freightliner',
          model: 'Cascadia',
          year: 2022,
          capacity: {
            weight: 26000,
            volume: 75,
            unit: 'kg'
          },
          currentLocation: {
            type: 'Point',
            coordinates: [-74.0060, 40.7128], // New York City
            address: '123 Fleet Depot, New York, NY 10001',
            lastUpdated: new Date()
          },
          assignedDriver: drivers[0]._id,
          specifications: {
            fuelType: 'diesel',
            fuelCapacity: 300,
            mileage: 125000,
            insuranceExpiry: new Date('2024-12-31'),
            registrationExpiry: new Date('2024-11-30'),
            lastMaintenanceDate: new Date('2024-01-15'),
            nextMaintenanceDate: new Date('2024-04-15')
          },
          tracking: {
            deviceId: 'GPS001',
            isOnline: true,
            lastPing: new Date(),
            speed: 0,
            heading: 0,
            odometer: 125000
          }
        },
        {
          vehicleId: 'VH002',
          licensePlate: 'FL002NY',
          type: 'van',
          make: 'Ford',
          model: 'Transit',
          year: 2023,
          capacity: {
            weight: 3500,
            volume: 15,
            unit: 'kg'
          },
          currentLocation: {
            type: 'Point',
            coordinates: [-73.9442, 40.6782], // Brooklyn
            address: '456 Delivery Hub, Brooklyn, NY 11201',
            lastUpdated: new Date()
          },
          assignedDriver: drivers[1]._id,
          specifications: {
            fuelType: 'gasoline',
            fuelCapacity: 80,
            mileage: 45000,
            insuranceExpiry: new Date('2025-03-31'),
            registrationExpiry: new Date('2025-02-28'),
            lastMaintenanceDate: new Date('2024-02-01'),
            nextMaintenanceDate: new Date('2024-05-01')
          },
          tracking: {
            deviceId: 'GPS002',
            isOnline: true,
            lastPing: new Date(),
            speed: 0,
            heading: 90,
            odometer: 45000
          }
        },
        {
          vehicleId: 'VH003',
          licensePlate: 'FL003NY',
          type: 'truck',
          make: 'Volvo',
          model: 'VNL',
          year: 2021,
          capacity: {
            weight: 34000,
            volume: 85,
            unit: 'kg'
          },
          currentLocation: {
            type: 'Point',
            coordinates: [-74.1776, 40.7282], // Jersey City
            address: '789 Logistics Center, Jersey City, NJ 07302',
            lastUpdated: new Date()
          },
          specifications: {
            fuelType: 'diesel',
            fuelCapacity: 350,
            mileage: 89000,
            insuranceExpiry: new Date('2024-10-31'),
            registrationExpiry: new Date('2024-09-30')
          },
          tracking: {
            deviceId: 'GPS003',
            isOnline: false,
            lastPing: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            speed: 0,
            odometer: 89000
          },
          status: 'maintenance'
        }
      ];

      const createdVehicles = await Vehicle.insertMany(vehicles);
      logger.info(`Created ${createdVehicles.length} vehicles`);
      return createdVehicles;
    } catch (error) {
      logger.error('Failed to seed vehicles', { error: error.message });
      throw error;
    }
  }

  async seedOrders(vehicles, drivers) {
    try {
      const orders = [
        {
          orderId: 'ORD001',
          customerInfo: {
            name: 'ABC Electronics',
            phone: '+1-555-2001',
            email: 'orders@abcelectronics.com',
            company: 'ABC Electronics Inc.'
          },
          pickup: {
            address: {
              street: '100 Industrial Blvd',
              city: 'Newark',
              state: 'NJ',
              zipCode: '07102'
            },
            location: {
              type: 'Point',
              coordinates: [-74.1723, 40.7357]
            },
            scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
            contactPerson: {
              name: 'Bob Smith',
              phone: '+1-555-2002'
            },
            instructions: 'Loading dock B, ask for Bob'
          },
          delivery: {
            address: {
              street: '500 Commerce St',
              city: 'New York',
              state: 'NY',
              zipCode: '10013'
            },
            location: {
              type: 'Point',
              coordinates: [-74.0059, 40.7209]
            },
            scheduledTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
            contactPerson: {
              name: 'Alice Johnson',
              phone: '+1-555-2003'
            },
            instructions: 'Delivery to 3rd floor, elevator available'
          },
          items: [
            {
              description: 'Computer Monitors',
              quantity: 50,
              weight: 500,
              dimensions: {
                length: 60,
                width: 40,
                height: 35,
                unit: 'cm'
              },
              value: {
                amount: 25000,
                currency: 'USD'
              },
              specialHandling: ['fragile']
            }
          ],
          status: 'confirmed',
          priority: 'high',
          assignedVehicle: vehicles[0]._id,
          assignedDriver: drivers[0]._id,
          pricing: {
            baseRate: 150,
            distanceRate: 2.5,
            specialHandlingFee: 25,
            totalAmount: 200,
            currency: 'USD',
            paymentStatus: 'pending'
          }
        },
        {
          orderId: 'ORD002',
          customerInfo: {
            name: 'Fresh Foods Market',
            phone: '+1-555-2004',
            email: 'delivery@freshfoods.com'
          },
          pickup: {
            address: {
              street: '200 Food Distribution Center',
              city: 'Bronx',
              state: 'NY',
              zipCode: '10451'
            },
            location: {
              type: 'Point',
              coordinates: [-73.9249, 40.8176]
            },
            scheduledTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
            instructions: 'Refrigerated items, temperature controlled'
          },
          delivery: {
            address: {
              street: '300 Market St',
              city: 'Brooklyn',
              state: 'NY',
              zipCode: '11201'
            },
            location: {
              type: 'Point',
              coordinates: [-73.9903, 40.6892]
            },
            scheduledTime: new Date(Date.now() + 7 * 60 * 60 * 1000), // 7 hours from now
            instructions: 'Back entrance, refrigerated delivery'
          },
          items: [
            {
              description: 'Fresh Produce',
              quantity: 100,
              weight: 2000,
              specialHandling: ['refrigerated']
            }
          ],
          status: 'pending',
          priority: 'normal',
          assignedVehicle: vehicles[1]._id,
          assignedDriver: drivers[1]._id,
          pricing: {
            baseRate: 120,
            distanceRate: 2.0,
            specialHandlingFee: 50,
            totalAmount: 180,
            currency: 'USD'
          }
        },
        {
          orderId: 'ORD003',
          customerInfo: {
            name: 'Office Supplies Plus',
            phone: '+1-555-2005',
            email: 'shipping@officesupplies.com'
          },
          pickup: {
            address: {
              street: '400 Warehouse Ave',
              city: 'Queens',
              state: 'NY',
              zipCode: '11101'
            },
            location: {
              type: 'Point',
              coordinates: [-73.9442, 40.7505]
            },
            scheduledTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago (overdue)
            actualTime: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
          },
          delivery: {
            address: {
              street: '600 Business Plaza',
              city: 'Manhattan',
              state: 'NY',
              zipCode: '10016'
            },
            location: {
              type: 'Point',
              coordinates: [-73.9857, 40.7484]
            },
            scheduledTime: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
            instructions: 'Office building, 15th floor'
          },
          items: [
            {
              description: 'Office Furniture',
              quantity: 25,
              weight: 800,
              value: {
                amount: 15000,
                currency: 'USD'
              }
            }
          ],
          status: 'in_transit',
          priority: 'normal',
          assignedVehicle: vehicles[0]._id,
          assignedDriver: drivers[0]._id,
          pricing: {
            baseRate: 100,
            distanceRate: 1.5,
            totalAmount: 130,
            currency: 'USD',
            paymentStatus: 'paid'
          }
        }
      ];

      const createdOrders = await Order.insertMany(orders);
      
      // Add status history for orders
      for (let order of createdOrders) {
        await order.updateStatus(order.status, null, 'Initial status', null);
      }
      
      logger.info(`Created ${createdOrders.length} orders`);
      return createdOrders;
    } catch (error) {
      logger.error('Failed to seed orders', { error: error.message });
      throw error;
    }
  }

  async seedGPSTracking(vehicles, drivers) {
    try {
      const trackingData = [];
      const now = new Date();
      
      // Generate GPS tracking data for the last 24 hours
      for (let vehicle of vehicles.slice(0, 2)) { // Only for first 2 vehicles (online ones)
        const driver = drivers.find(d => d._id.equals(vehicle.assignedDriver));
        
        for (let i = 0; i < 24; i++) {
          const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000); // Every hour
          const [baseLng, baseLat] = vehicle.currentLocation.coordinates;
          
          // Add some random movement
          const lng = baseLng + (Math.random() - 0.5) * 0.01;
          const lat = baseLat + (Math.random() - 0.5) * 0.01;
          
          trackingData.push({
            vehicle: vehicle._id,
            driver: driver._id,
            location: {
              type: 'Point',
              coordinates: [lng, lat]
            },
            speed: Math.random() * 80, // 0-80 km/h
            heading: Math.random() * 360,
            accuracy: 5 + Math.random() * 10,
            satellites: 8 + Math.floor(Math.random() * 4),
            engineStatus: i < 8 ? 'off' : (Math.random() > 0.1 ? 'on' : 'idle'),
            fuelLevel: 100 - (i * 2), // Decreasing fuel
            batteryLevel: 95 + Math.random() * 5,
            odometer: vehicle.tracking.odometer + (i * 10),
            createdAt: timestamp,
            source: 'gps_device',
            deviceInfo: {
              deviceId: vehicle.tracking.deviceId,
              deviceType: 'GPS Tracker Pro',
              firmwareVersion: '2.1.4',
              signalStrength: -70 + Math.random() * 20
            },
            processingInfo: {
              receivedAt: timestamp,
              processedAt: new Date(timestamp.getTime() + 100),
              processingTime: 100
            }
          });
        }
      }
      
      const createdTracking = await GPSTracking.insertMany(trackingData);
      logger.info(`Created ${createdTracking.length} GPS tracking records`);
      return createdTracking;
    } catch (error) {
      logger.error('Failed to seed GPS tracking data', { error: error.message });
      throw error;
    }
  }

  async seedAll() {
    try {
      logger.info('Starting database seeding...');
      
      await this.connect();
      await this.clearDatabase();
      
      const users = await this.seedUsers();
      const drivers = await this.seedDrivers();
      const vehicles = await this.seedVehicles(drivers);
      const orders = await this.seedOrders(vehicles, drivers);
      const gpsTracking = await this.seedGPSTracking(vehicles, drivers);
      
      logger.info('Database seeding completed successfully', {
        users: users.length,
        drivers: drivers.length,
        vehicles: vehicles.length,
        orders: orders.length,
        gpsTracking: gpsTracking.length
      });
      
      await this.disconnect();
      
    } catch (error) {
      logger.error('Database seeding failed', { error: error.message });
      await this.disconnect();
      process.exit(1);
    }
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  const seeder = new DatabaseSeeder();
  seeder.seedAll();
}

module.exports = DatabaseSeeder;