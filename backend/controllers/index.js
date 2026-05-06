// Central export file for all controllers
const vehicleController = require('./vehicleController');
const orderController = require('./orderController');
const driverController = require('./driverController');
const gpsController = require('./gpsController');

module.exports = {
  vehicleController,
  orderController,
  driverController,
  gpsController
};