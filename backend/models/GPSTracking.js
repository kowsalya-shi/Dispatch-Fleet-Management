const mongoose = require('mongoose');

const gpsTrackingSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
    index: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    index: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      validate: {
        validator: function(coords) {
          return coords.length === 2 && 
                 coords[0] >= -180 && coords[0] <= 180 && // longitude
                 coords[1] >= -90 && coords[1] <= 90;     // latitude
        },
        message: 'Invalid coordinates: longitude must be between -180 and 180, latitude between -90 and 90'
      }
    }
  },
  address: {
    type: String,
    trim: true
  },
  speed: {
    type: Number,
    required: true,
    min: 0,
    max: 300, // km/h - reasonable max speed
    default: 0
  },
  heading: {
    type: Number,
    min: 0,
    max: 360,
    default: 0
  },
  altitude: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    min: 0,
    default: 10 // meters
  },
  satellites: {
    type: Number,
    min: 0,
    max: 50,
    default: 0
  },
  hdop: { // Horizontal Dilution of Precision
    type: Number,
    min: 0,
    default: 1
  },
  odometer: {
    type: Number,
    min: 0,
    default: 0
  },
  engineStatus: {
    type: String,
    enum: ['on', 'off', 'idle', 'unknown'],
    default: 'unknown',
    index: true
  },
  fuelLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  batteryLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  temperature: {
    engine: Number,
    cabin: Number,
    outside: Number
  },
  diagnostics: {
    engineRPM: {
      type: Number,
      min: 0,
      max: 10000
    },
    coolantTemp: Number,
    oilPressure: Number,
    batteryVoltage: Number,
    fuelConsumption: Number,
    errorCodes: [String]
  },
  events: [{
    type: {
      type: String,
      enum: [
        'ignition_on',
        'ignition_off',
        'speeding',
        'harsh_braking',
        'harsh_acceleration',
        'idle_start',
        'idle_end',
        'geofence_enter',
        'geofence_exit',
        'panic_button',
        'maintenance_due',
        'low_fuel',
        'battery_low',
        'device_offline',
        'device_online'
      ]
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    value: mongoose.Schema.Types.Mixed,
    description: String
  }],
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route'
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  isValid: {
    type: Boolean,
    default: true,
    index: true
  },
  source: {
    type: String,
    enum: ['gps_device', 'mobile_app', 'manual', 'simulation'],
    default: 'gps_device',
    index: true
  },
  deviceInfo: {
    deviceId: String,
    deviceType: String,
    firmwareVersion: String,
    signalStrength: Number
  },
  processingInfo: {
    receivedAt: {
      type: Date,
      default: Date.now
    },
    processedAt: Date,
    processingTime: Number, // milliseconds
    errors: [String],
    warnings: [String]
  }
}, {
  timestamps: true,
  // TTL index to automatically delete old GPS data after 90 days
  index: { createdAt: 1 },
  expireAfterSeconds: 90 * 24 * 60 * 60 // 90 days
});

// Geospatial index for location queries
gpsTrackingSchema.index({ location: '2dsphere' });

// Compound indexes for performance
gpsTrackingSchema.index({ vehicle: 1, createdAt: -1 });
gpsTrackingSchema.index({ vehicle: 1, engineStatus: 1, createdAt: -1 });
gpsTrackingSchema.index({ driver: 1, createdAt: -1 });
gpsTrackingSchema.index({ route: 1, createdAt: -1 });
gpsTrackingSchema.index({ order: 1, createdAt: -1 });
gpsTrackingSchema.index({ source: 1, createdAt: -1 });
gpsTrackingSchema.index({ isValid: 1, createdAt: -1 });

// Sparse indexes for optional fields
gpsTrackingSchema.index({ 'events.type': 1, createdAt: -1 }, { sparse: true });

// Virtual for coordinate string
gpsTrackingSchema.virtual('coordinateString').get(function() {
  const [lng, lat] = this.location.coordinates;
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
});

// Virtual for speed in different units
gpsTrackingSchema.virtual('speedMph').get(function() {
  return Math.round(this.speed * 0.621371 * 100) / 100; // km/h to mph
});

gpsTrackingSchema.virtual('speedKnots').get(function() {
  return Math.round(this.speed * 0.539957 * 100) / 100; // km/h to knots
});

// Virtual for age of GPS data
gpsTrackingSchema.virtual('dataAge').get(function() {
  return Date.now() - this.createdAt.getTime(); // milliseconds
});

// Method to validate GPS coordinates
gpsTrackingSchema.methods.validateCoordinates = function() {
  const [lng, lat] = this.location.coordinates;
  
  // Basic coordinate validation
  if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
    this.isValid = false;
    this.processingInfo.errors.push('Invalid coordinates range');
    return false;
  }
  
  // Check for null island (0,0) which is often invalid
  if (lng === 0 && lat === 0) {
    this.isValid = false;
    this.processingInfo.warnings.push('Coordinates at null island (0,0)');
    return false;
  }
  
  return true;
};

// Method to calculate distance from previous point
gpsTrackingSchema.methods.calculateDistanceFromPrevious = async function() {
  const previousPoint = await this.constructor.findOne({
    vehicle: this.vehicle,
    createdAt: { $lt: this.createdAt },
    isValid: true
  }).sort({ createdAt: -1 });
  
  if (!previousPoint) return 0;
  
  const [lng1, lat1] = previousPoint.location.coordinates;
  const [lng2, lat2] = this.location.coordinates;
  
  return this.calculateDistance(lng1, lat1, lng2, lat2);
};

// Method to calculate distance between two points
gpsTrackingSchema.methods.calculateDistance = function(lng1, lat1, lng2, lat2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

// Method to add event
gpsTrackingSchema.methods.addEvent = function(eventType, value = null, description = null) {
  this.events.push({
    type: eventType,
    timestamp: new Date(),
    value: value,
    description: description
  });
  
  return this.save();
};

// Method to check for speeding
gpsTrackingSchema.methods.checkSpeeding = function(speedLimit = 80) {
  if (this.speed > speedLimit) {
    this.addEvent('speeding', { 
      currentSpeed: this.speed, 
      speedLimit: speedLimit 
    }, `Vehicle exceeding speed limit: ${this.speed} km/h (limit: ${speedLimit} km/h)`);
    return true;
  }
  return false;
};

// Method to detect harsh events
gpsTrackingSchema.methods.detectHarshEvents = async function() {
  const previousPoint = await this.constructor.findOne({
    vehicle: this.vehicle,
    createdAt: { $lt: this.createdAt },
    isValid: true
  }).sort({ createdAt: -1 });
  
  if (!previousPoint) return [];
  
  const events = [];
  const timeDiff = (this.createdAt - previousPoint.createdAt) / 1000; // seconds
  const speedDiff = this.speed - previousPoint.speed;
  const acceleration = speedDiff / timeDiff; // km/h per second
  
  // Convert to m/s² for standard acceleration units
  const accelerationMps2 = acceleration * (1000/3600);
  
  // Harsh acceleration (> 2.5 m/s²)
  if (accelerationMps2 > 2.5) {
    events.push({
      type: 'harsh_acceleration',
      value: { acceleration: accelerationMps2 },
      description: `Harsh acceleration detected: ${accelerationMps2.toFixed(2)} m/s²`
    });
  }
  
  // Harsh braking (< -2.5 m/s²)
  if (accelerationMps2 < -2.5) {
    events.push({
      type: 'harsh_braking',
      value: { deceleration: Math.abs(accelerationMps2) },
      description: `Harsh braking detected: ${Math.abs(accelerationMps2).toFixed(2)} m/s²`
    });
  }
  
  // Add events to this tracking point
  events.forEach(event => {
    this.events.push({
      type: event.type,
      timestamp: new Date(),
      value: event.value,
      description: event.description
    });
  });
  
  return events;
};

// Static method to find latest position for vehicle
gpsTrackingSchema.statics.findLatestForVehicle = function(vehicleId) {
  return this.findOne({
    vehicle: vehicleId,
    isValid: true
  }).sort({ createdAt: -1 });
};

// Static method to find positions in time range
gpsTrackingSchema.statics.findInTimeRange = function(vehicleId, startTime, endTime) {
  return this.find({
    vehicle: vehicleId,
    createdAt: {
      $gte: startTime,
      $lte: endTime
    },
    isValid: true
  }).sort({ createdAt: 1 });
};

// Static method to find positions in area
gpsTrackingSchema.statics.findInArea = function(longitude, latitude, radius = 1) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: radius * 1000 // Convert km to meters
      }
    },
    isValid: true
  }).populate('vehicle driver');
};

// Static method to find idle vehicles
gpsTrackingSchema.statics.findIdleVehicles = function(thresholdMinutes = 5) {
  const thresholdTime = new Date(Date.now() - thresholdMinutes * 60 * 1000);
  
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: thresholdTime },
        speed: 0,
        engineStatus: { $in: ['on', 'idle'] },
        isValid: true
      }
    },
    {
      $group: {
        _id: '$vehicle',
        latestPosition: { $last: '$$ROOT' },
        idleStartTime: { $first: '$createdAt' },
        idleDuration: {
          $sum: {
            $divide: [
              { $subtract: ['$$NOW', '$createdAt'] },
              60000 // Convert to minutes
            ]
          }
        }
      }
    },
    {
      $match: {
        idleDuration: { $gte: thresholdMinutes }
      }
    }
  ]);
};

// Static method to get vehicle route history
gpsTrackingSchema.statics.getRouteHistory = function(vehicleId, startTime, endTime, simplify = true) {
  const query = this.find({
    vehicle: vehicleId,
    createdAt: {
      $gte: startTime,
      $lte: endTime
    },
    isValid: true
  }).sort({ createdAt: 1 });
  
  if (simplify) {
    // Return only essential fields for route visualization
    query.select('location createdAt speed heading events');
  }
  
  return query;
};

// Pre-save middleware for data validation and processing
gpsTrackingSchema.pre('save', function(next) {
  // Set processing timestamp
  this.processingInfo.processedAt = new Date();
  
  // Calculate processing time if receivedAt is set
  if (this.processingInfo.receivedAt) {
    this.processingInfo.processingTime = Date.now() - this.processingInfo.receivedAt.getTime();
  }
  
  // Validate coordinates
  this.validateCoordinates();
  
  // Ensure arrays are initialized
  if (!this.events) this.events = [];
  if (!this.processingInfo.errors) this.processingInfo.errors = [];
  if (!this.processingInfo.warnings) this.processingInfo.warnings = [];
  
  next();
});

module.exports = mongoose.model('GPSTracking', gpsTrackingSchema);