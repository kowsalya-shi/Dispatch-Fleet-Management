// Central export file for all routes
const authRoutes = require('./auth');
const vehicleRoutes = require('./vehicles');
const orderRoutes = require('./orders');
const driverRoutes = require('./drivers');
const gpsRoutes = require('./gps');

module.exports = {
  authRoutes,
  vehicleRoutes,
  orderRoutes,
  driverRoutes,
  gpsRoutes
};