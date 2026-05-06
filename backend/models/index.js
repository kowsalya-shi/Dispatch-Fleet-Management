// Central export file for all database models
const User = require('./User');
const Vehicle = require('./Vehicle');
const Driver = require('./Driver');
const Order = require('./Order');
const Route = require('./Route');
const GPSTracking = require('./GPSTracking');

module.exports = {
  User,
  Vehicle,
  Driver,
  Order,
  Route,
  GPSTracking
};