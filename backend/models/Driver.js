const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  driverId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  personalInfo: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: 'USA'
      }
    },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    }
  },
  license: {
    number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    class: {
      type: String,
      enum: ['A', 'B', 'C', 'CDL-A', 'CDL-B', 'CDL-C'],
      required: true
    },
    expiryDate: {
      type: Date,
      required: true,
      index: true
    },
    restrictions: [String],
    endorsements: [String]
  },
  employment: {
    hireDate: {
      type: Date,
      required: true
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    department: {
      type: String,
      default: 'Transportation'
    },
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    salary: {
      amount: Number,
      currency: {
        type: String,
        default: 'USD'
      },
      payPeriod: {
        type: String,
        enum: ['hourly', 'weekly', 'monthly', 'yearly'],
        default: 'hourly'
      }
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on_leave', 'suspended', 'terminated'],
    default: 'active',
    index: true
  },
  currentVehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
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
  workSchedule: {
    shiftStart: {
      type: String, // HH:MM format
      default: '08:00'
    },
    shiftEnd: {
      type: String, // HH:MM format
      default: '17:00'
    },
    workDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    timeZone: {
      type: String,
      default: 'America/New_York'
    }
  },
  performance: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    totalTrips: {
      type: Number,
      default: 0,
      min: 0
    },
    totalDistance: {
      type: Number,
      default: 0,
      min: 0
    },
    averageSpeed: {
      type: Number,
      default: 0,
      min: 0
    },
    fuelEfficiency: {
      type: Number,
      default: 0,
      min: 0
    },
    onTimeDeliveries: {
      type: Number,
      default: 0,
      min: 0
    },
    lateDeliveries: {
      type: Number,
      default: 0,
      min: 0
    },
    accidents: {
      type: Number,
      default: 0,
      min: 0
    },
    violations: {
      type: Number,
      default: 0,
      min: 0
    },
    lastPerformanceReview: Date
  },
  certifications: [{
    name: {
      type: String,
      required: true
    },
    issuedBy: String,
    issuedDate: Date,
    expiryDate: Date,
    certificateNumber: String,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  medicalCertification: {
    expiryDate: Date,
    restrictions: [String],
    lastExamDate: Date
  },
  tracking: {
    isOnDuty: {
      type: Boolean,
      default: false,
      index: true
    },
    shiftStartTime: Date,
    shiftEndTime: Date,
    breakStartTime: Date,
    totalHoursToday: {
      type: Number,
      default: 0,
      min: 0
    },
    totalHoursWeek: {
      type: Number,
      default: 0,
      min: 0
    },
    lastActivity: Date
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
driverSchema.index({ 'currentLocation': '2dsphere' });

// Compound indexes for performance
driverSchema.index({ status: 1, isActive: 1 });
driverSchema.index({ 'license.expiryDate': 1, isActive: 1 });
driverSchema.index({ 'tracking.isOnDuty': 1, status: 1 });
driverSchema.index({ currentVehicle: 1, status: 1 });

// Virtual for full name
driverSchema.virtual('fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

// Virtual for age
driverSchema.virtual('age').get(function() {
  const today = new Date();
  const birthDate = new Date(this.personalInfo.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Virtual for license status
driverSchema.virtual('licenseStatus').get(function() {
  const now = new Date();
  const expiryDate = new Date(this.license.expiryDate);
  const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= 30) return 'expiring_soon';
  return 'valid';
});

// Virtual for performance score
driverSchema.virtual('performanceScore').get(function() {
  const { onTimeDeliveries, lateDeliveries, accidents, violations } = this.performance;
  const totalDeliveries = onTimeDeliveries + lateDeliveries;
  
  if (totalDeliveries === 0) return 0;
  
  const onTimeRate = onTimeDeliveries / totalDeliveries;
  const safetyPenalty = (accidents * 0.1) + (violations * 0.05);
  
  return Math.max(0, Math.min(100, (onTimeRate * 100) - safetyPenalty));
});

// Method to update location
driverSchema.methods.updateLocation = function(longitude, latitude, address = null) {
  this.currentLocation = {
    type: 'Point',
    coordinates: [longitude, latitude],
    address: address,
    lastUpdated: new Date()
  };
  
  this.tracking.lastActivity = new Date();
  return this.save();
};

// Method to start shift
driverSchema.methods.startShift = function() {
  this.tracking.isOnDuty = true;
  this.tracking.shiftStartTime = new Date();
  this.tracking.lastActivity = new Date();
  return this.save();
};

// Method to end shift
driverSchema.methods.endShift = function() {
  if (this.tracking.shiftStartTime) {
    const shiftDuration = (new Date() - this.tracking.shiftStartTime) / (1000 * 60 * 60);
    this.tracking.totalHoursToday += shiftDuration;
    this.tracking.totalHoursWeek += shiftDuration;
  }
  
  this.tracking.isOnDuty = false;
  this.tracking.shiftEndTime = new Date();
  this.tracking.lastActivity = new Date();
  return this.save();
};

// Method to start break
driverSchema.methods.startBreak = function() {
  this.tracking.breakStartTime = new Date();
  this.tracking.lastActivity = new Date();
  return this.save();
};

// Method to end break
driverSchema.methods.endBreak = function() {
  this.tracking.breakStartTime = null;
  this.tracking.lastActivity = new Date();
  return this.save();
};

// Method to assign vehicle
driverSchema.methods.assignVehicle = function(vehicleId) {
  this.currentVehicle = vehicleId;
  return this.save();
};

// Method to unassign vehicle
driverSchema.methods.unassignVehicle = function() {
  this.currentVehicle = null;
  return this.save();
};

// Static method to find available drivers
driverSchema.statics.findAvailable = function() {
  return this.find({
    status: 'active',
    isActive: true,
    currentVehicle: null,
    'tracking.isOnDuty': false
  });
};

// Static method to find drivers on duty
driverSchema.statics.findOnDuty = function() {
  return this.find({
    status: 'active',
    isActive: true,
    'tracking.isOnDuty': true
  }).populate('currentVehicle');
};

// Static method to find drivers with expiring licenses
driverSchema.statics.findExpiringLicenses = function(days = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    'license.expiryDate': { $lte: futureDate },
    isActive: true,
    status: 'active'
  });
};

module.exports = mongoose.model('Driver', driverSchema);