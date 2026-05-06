const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  licensePlate: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },
  type: {
    type: String,
    enum: ['truck', 'van', 'car', 'motorcycle', 'trailer'],
    required: true,
    index: true
  },
  make: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  capacity: {
    weight: {
      type: Number,
      required: true,
      min: 0
    },
    volume: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: ['kg', 'tons', 'lbs'],
      default: 'kg'
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'out_of_service'],
    default: 'active',
    index: true
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    },
    address: String,
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    index: true
  },
  currentRoute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route'
  },
  specifications: {
    fuelType: {
      type: String,
      enum: ['gasoline', 'diesel', 'electric', 'hybrid'],
      required: true
    },
    fuelCapacity: Number,
    mileage: Number,
    insuranceExpiry: Date,
    registrationExpiry: Date,
    lastMaintenanceDate: Date,
    nextMaintenanceDate: Date,
    maintenanceInterval: {
      type: Number,
      default: 10000 // kilometers
    }
  },
  tracking: {
    deviceId: String,
    isOnline: {
      type: Boolean,
      default: false,
      index: true
    },
    lastPing: Date,
    speed: {
      type: Number,
      default: 0,
      min: 0
    },
    heading: {
      type: Number,
      min: 0,
      max: 360
    },
    odometer: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  metrics: {
    totalDistance: {
      type: Number,
      default: 0,
      min: 0
    },
    totalTrips: {
      type: Number,
      default: 0,
      min: 0
    },
    averageSpeed: {
      type: Number,
      default: 0,
      min: 0
    },
    fuelConsumption: {
      type: Number,
      default: 0,
      min: 0
    },
    lastTripDate: Date
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});

// Geospatial index for location queries
vehicleSchema.index({ 'currentLocation': '2dsphere' });

// Compound indexes for performance
vehicleSchema.index({ status: 1, isActive: 1 });
vehicleSchema.index({ type: 1, status: 1 });
vehicleSchema.index({ assignedDriver: 1, status: 1 });
vehicleSchema.index({ 'tracking.isOnline': 1, isActive: 1 });

// Virtual for vehicle age
vehicleSchema.virtual('age').get(function() {
  return new Date().getFullYear() - this.year;
});

// Virtual for maintenance status
vehicleSchema.virtual('maintenanceStatus').get(function() {
  if (!this.specifications.nextMaintenanceDate) return 'unknown';
  
  const now = new Date();
  const nextMaintenance = new Date(this.specifications.nextMaintenanceDate);
  const daysUntilMaintenance = Math.ceil((nextMaintenance - now) / (1000 * 60 * 60 * 24));
  
  if (daysUntilMaintenance < 0) return 'overdue';
  if (daysUntilMaintenance <= 7) return 'due_soon';
  return 'ok';
});

// Method to update location
vehicleSchema.methods.updateLocation = function(longitude, latitude, address = null) {
  this.currentLocation = {
    type: 'Point',
    coordinates: [longitude, latitude],
    address: address,
    lastUpdated: new Date()
  };
  
  // Update tracking info
  this.tracking.lastPing = new Date();
  this.tracking.isOnline = true;
  
  return this.save();
};

// Method to calculate distance from point
vehicleSchema.methods.distanceFrom = function(longitude, latitude) {
  const [vLng, vLat] = this.currentLocation.coordinates;
  
  const R = 6371; // Earth's radius in kilometers
  const dLat = (latitude - vLat) * Math.PI / 180;
  const dLng = (longitude - vLng) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(vLat * Math.PI / 180) * Math.cos(latitude * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

// Method to check if vehicle is idle
vehicleSchema.methods.isIdle = function(thresholdMinutes = 5) {
  if (!this.tracking.lastPing) return false;
  
  const now = new Date();
  const lastPing = new Date(this.tracking.lastPing);
  const minutesSinceLastPing = (now - lastPing) / (1000 * 60);
  
  return minutesSinceLastPing >= thresholdMinutes && this.tracking.speed === 0;
};

// Method to update tracking data
vehicleSchema.methods.updateTracking = function(trackingData) {
  Object.assign(this.tracking, {
    ...trackingData,
    lastPing: new Date(),
    isOnline: true
  });
  
  return this.save();
};

// Static method to find nearby vehicles
vehicleSchema.statics.findNearby = function(longitude, latitude, maxDistance = 10) {
  return this.find({
    currentLocation: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance * 1000 // Convert km to meters
      }
    },
    isActive: true,
    status: 'active'
  });
};

// Static method to find idle vehicles
vehicleSchema.statics.findIdle = function(thresholdMinutes = 5) {
  const thresholdTime = new Date(Date.now() - thresholdMinutes * 60 * 1000);
  
  return this.find({
    'tracking.lastPing': { $lt: thresholdTime },
    'tracking.speed': 0,
    'tracking.isOnline': true,
    isActive: true,
    status: 'active'
  });
};

module.exports = mongoose.model('Vehicle', vehicleSchema);