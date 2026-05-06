const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['pickup', 'delivery', 'round_trip', 'multi_stop'],
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['planned', 'active', 'completed', 'cancelled', 'paused'],
    default: 'planned',
    index: true
  },
  assignedVehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
    index: true
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true,
    index: true
  },
  orders: [{
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    sequence: {
      type: Number,
      required: true,
      min: 1
    },
    type: {
      type: String,
      enum: ['pickup', 'delivery'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'failed', 'skipped'],
      default: 'pending'
    },
    scheduledTime: {
      type: Date,
      required: true
    },
    actualTime: Date,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    },
    estimatedDuration: {
      type: Number, // in minutes
      default: 30
    },
    actualDuration: Number,
    notes: String
  }],
  schedule: {
    startTime: {
      type: Date,
      required: true,
      index: true
    },
    endTime: Date,
    estimatedDuration: {
      type: Number, // in minutes
      required: true
    },
    actualDuration: Number,
    breaks: [{
      startTime: Date,
      endTime: Date,
      duration: Number, // in minutes
      type: {
        type: String,
        enum: ['lunch', 'rest', 'fuel', 'maintenance'],
        default: 'rest'
      },
      location: {
        type: {
          type: String,
          enum: ['Point']
        },
        coordinates: [Number]
      }
    }]
  },
  optimization: {
    isOptimized: {
      type: Boolean,
      default: false
    },
    optimizationCriteria: {
      type: String,
      enum: ['distance', 'time', 'fuel', 'cost'],
      default: 'distance'
    },
    originalDistance: Number,
    optimizedDistance: Number,
    originalDuration: Number,
    optimizedDuration: Number,
    fuelSavings: Number,
    costSavings: Number
  },
  tracking: {
    currentStop: {
      type: Number,
      default: 0,
      min: 0
    },
    currentLocation: {
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: [Number]
    },
    lastLocationUpdate: Date,
    totalDistance: {
      type: Number,
      default: 0,
      min: 0
    },
    completedDistance: {
      type: Number,
      default: 0,
      min: 0
    },
    averageSpeed: {
      type: Number,
      default: 0,
      min: 0
    },
    estimatedArrival: Date,
    deviations: [{
      timestamp: Date,
      location: {
        type: {
          type: String,
          enum: ['Point']
        },
        coordinates: [Number]
      },
      distanceFromRoute: Number,
      reason: String,
      resolved: {
        type: Boolean,
        default: false
      }
    }]
  },
  performance: {
    onTimeStops: {
      type: Number,
      default: 0,
      min: 0
    },
    lateStops: {
      type: Number,
      default: 0,
      min: 0
    },
    failedStops: {
      type: Number,
      default: 0,
      min: 0
    },
    totalStops: {
      type: Number,
      default: 0,
      min: 0
    },
    fuelConsumption: {
      type: Number,
      default: 0,
      min: 0
    },
    averageStopTime: {
      type: Number,
      default: 0,
      min: 0
    },
    customerRating: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  geofences: [{
    name: String,
    center: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    radius: {
      type: Number,
      required: true,
      min: 10 // minimum 10 meters
    },
    type: {
      type: String,
      enum: ['pickup', 'delivery', 'depot', 'rest_area', 'fuel_station'],
      required: true
    },
    alerts: {
      onEnter: {
        type: Boolean,
        default: true
      },
      onExit: {
        type: Boolean,
        default: true
      },
      onDwell: {
        enabled: {
          type: Boolean,
          default: false
        },
        duration: {
          type: Number,
          default: 300 // 5 minutes
        }
      }
    }
  }],
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});

// Geospatial indexes for location queries
routeSchema.index({ 'orders.location': '2dsphere' });
routeSchema.index({ 'tracking.currentLocation': '2dsphere' });
routeSchema.index({ 'geofences.center': '2dsphere' });

// Compound indexes for performance
routeSchema.index({ status: 1, 'schedule.startTime': 1 });
routeSchema.index({ assignedVehicle: 1, status: 1 });
routeSchema.index({ assignedDriver: 1, status: 1 });
routeSchema.index({ type: 1, status: 1, isActive: 1 });

// Virtual for completion percentage
routeSchema.virtual('completionPercentage').get(function() {
  if (this.orders.length === 0) return 0;
  
  const completedOrders = this.orders.filter(order => order.status === 'completed').length;
  return Math.round((completedOrders / this.orders.length) * 100);
});

// Virtual for estimated completion time
routeSchema.virtual('estimatedCompletionTime').get(function() {
  if (!this.schedule.startTime || !this.schedule.estimatedDuration) return null;
  
  return new Date(this.schedule.startTime.getTime() + this.schedule.estimatedDuration * 60 * 1000);
});

// Virtual for route efficiency
routeSchema.virtual('routeEfficiency').get(function() {
  if (!this.optimization.originalDistance || !this.optimization.optimizedDistance) return 0;
  
  const savings = this.optimization.originalDistance - this.optimization.optimizedDistance;
  return Math.round((savings / this.optimization.originalDistance) * 100);
});

// Virtual for on-time performance
routeSchema.virtual('onTimePerformance').get(function() {
  const { onTimeStops, totalStops } = this.performance;
  if (totalStops === 0) return 0;
  
  return Math.round((onTimeStops / totalStops) * 100);
});

// Method to start route
routeSchema.methods.startRoute = function() {
  this.status = 'active';
  this.schedule.startTime = new Date();
  this.tracking.currentStop = 1;
  return this.save();
};

// Method to complete route
routeSchema.methods.completeRoute = function() {
  this.status = 'completed';
  this.schedule.endTime = new Date();
  
  if (this.schedule.startTime) {
    this.schedule.actualDuration = (new Date() - this.schedule.startTime) / (1000 * 60);
  }
  
  return this.save();
};

// Method to update current location
routeSchema.methods.updateLocation = function(longitude, latitude) {
  this.tracking.currentLocation = {
    type: 'Point',
    coordinates: [longitude, latitude]
  };
  this.tracking.lastLocationUpdate = new Date();
  return this.save();
};

// Method to complete current stop
routeSchema.methods.completeCurrentStop = function(actualDuration = null) {
  const currentStopIndex = this.tracking.currentStop - 1;
  
  if (currentStopIndex >= 0 && currentStopIndex < this.orders.length) {
    this.orders[currentStopIndex].status = 'completed';
    this.orders[currentStopIndex].actualTime = new Date();
    
    if (actualDuration) {
      this.orders[currentStopIndex].actualDuration = actualDuration;
    }
    
    // Update performance metrics
    const scheduledTime = this.orders[currentStopIndex].scheduledTime;
    const actualTime = this.orders[currentStopIndex].actualTime;
    
    if (actualTime <= scheduledTime) {
      this.performance.onTimeStops++;
    } else {
      this.performance.lateStops++;
    }
    
    this.performance.totalStops++;
    
    // Move to next stop
    this.tracking.currentStop++;
    
    // Check if route is completed
    if (this.tracking.currentStop > this.orders.length) {
      this.completeRoute();
    }
  }
  
  return this.save();
};

// Method to add deviation
routeSchema.methods.addDeviation = function(longitude, latitude, distanceFromRoute, reason = null) {
  this.tracking.deviations.push({
    timestamp: new Date(),
    location: {
      type: 'Point',
      coordinates: [longitude, latitude]
    },
    distanceFromRoute: distanceFromRoute,
    reason: reason,
    resolved: false
  });
  
  return this.save();
};

// Method to resolve deviation
routeSchema.methods.resolveDeviation = function(deviationId) {
  const deviation = this.tracking.deviations.id(deviationId);
  if (deviation) {
    deviation.resolved = true;
  }
  return this.save();
};

// Method to optimize route
routeSchema.methods.optimizeRoute = function(criteria = 'distance') {
  // This is a placeholder for route optimization logic
  // In a real implementation, this would use algorithms like:
  // - Traveling Salesman Problem (TSP) solvers
  // - Vehicle Routing Problem (VRP) solvers
  // - Google Maps Optimization API
  // - HERE Routing API
  
  this.optimization.isOptimized = true;
  this.optimization.optimizationCriteria = criteria;
  
  // Placeholder optimization results
  if (this.optimization.originalDistance) {
    this.optimization.optimizedDistance = this.optimization.originalDistance * 0.85; // 15% improvement
    this.optimization.fuelSavings = this.optimization.originalDistance * 0.15 * 0.1; // Estimated fuel savings
  }
  
  return this.save();
};

// Method to check geofence violations
routeSchema.methods.checkGeofences = function(longitude, latitude) {
  const violations = [];
  
  this.geofences.forEach(geofence => {
    const distance = this.calculateDistance(
      longitude, latitude,
      geofence.center.coordinates[0], geofence.center.coordinates[1]
    );
    
    if (distance <= geofence.radius) {
      violations.push({
        geofence: geofence,
        distance: distance,
        type: 'enter'
      });
    }
  });
  
  return violations;
};

// Method to calculate distance between two points
routeSchema.methods.calculateDistance = function(lng1, lat1, lng2, lat2) {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in meters
};

// Static method to find active routes
routeSchema.statics.findActive = function() {
  return this.find({ status: 'active', isActive: true })
    .populate('assignedVehicle assignedDriver orders.order')
    .sort({ 'schedule.startTime': 1 });
};

// Static method to find routes by vehicle
routeSchema.statics.findByVehicle = function(vehicleId) {
  return this.find({ assignedVehicle: vehicleId, isActive: true })
    .populate('assignedDriver orders.order')
    .sort({ 'schedule.startTime': -1 });
};

// Static method to find routes by driver
routeSchema.statics.findByDriver = function(driverId) {
  return this.find({ assignedDriver: driverId, isActive: true })
    .populate('assignedVehicle orders.order')
    .sort({ 'schedule.startTime': -1 });
};

// Static method to find routes in date range
routeSchema.statics.findInDateRange = function(startDate, endDate) {
  return this.find({
    'schedule.startTime': {
      $gte: startDate,
      $lte: endDate
    },
    isActive: true
  }).populate('assignedVehicle assignedDriver');
};

module.exports = mongoose.model('Route', routeSchema);