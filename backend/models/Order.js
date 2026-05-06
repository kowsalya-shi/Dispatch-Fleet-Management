const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  customerInfo: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    company: {
      type: String,
      trim: true
    }
  },
  pickup: {
    address: {
      street: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      zipCode: {
        type: String,
        required: true
      },
      country: {
        type: String,
        default: 'USA'
      }
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    contactPerson: {
      name: String,
      phone: String
    },
    scheduledTime: {
      type: Date,
      required: true,
      index: true
    },
    actualTime: Date,
    instructions: String,
    accessCode: String
  },
  delivery: {
    address: {
      street: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      zipCode: {
        type: String,
        required: true
      },
      country: {
        type: String,
        default: 'USA'
      }
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    contactPerson: {
      name: String,
      phone: String
    },
    scheduledTime: {
      type: Date,
      required: true,
      index: true
    },
    actualTime: Date,
    instructions: String,
    accessCode: String,
    signature: {
      data: String, // Base64 encoded signature
      signedBy: String,
      timestamp: Date
    },
    photo: {
      data: String, // Base64 encoded photo
      timestamp: Date
    }
  },
  items: [{
    description: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    weight: {
      type: Number,
      required: true,
      min: 0
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        enum: ['cm', 'in', 'm', 'ft'],
        default: 'cm'
      }
    },
    value: {
      amount: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    },
    specialHandling: [{
      type: String,
      enum: ['fragile', 'hazardous', 'refrigerated', 'oversized', 'high_value']
    }],
    barcode: String,
    sku: String
  }],
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'assigned',
      'pickup_scheduled',
      'en_route_pickup',
      'arrived_pickup',
      'picked_up',
      'in_transit',
      'en_route_delivery',
      'arrived_delivery',
      'delivered',
      'failed_pickup',
      'failed_delivery',
      'cancelled',
      'returned'
    ],
    default: 'pending',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal',
    index: true
  },
  assignedVehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    index: true
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    index: true
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route'
  },
  pricing: {
    baseRate: {
      type: Number,
      required: true,
      min: 0
    },
    distanceRate: {
      type: Number,
      default: 0,
      min: 0
    },
    weightRate: {
      type: Number,
      default: 0,
      min: 0
    },
    specialHandlingFee: {
      type: Number,
      default: 0,
      min: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'bank_transfer', 'check', 'account']
    }
  },
  tracking: {
    estimatedDistance: {
      type: Number,
      min: 0
    },
    actualDistance: {
      type: Number,
      min: 0
    },
    estimatedDuration: {
      type: Number, // in minutes
      min: 0
    },
    actualDuration: {
      type: Number, // in minutes
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
    deliveryWindow: {
      start: Date,
      end: Date
    }
  },
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    location: {
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: [Number]
    },
    notes: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  notes: [{
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['general', 'pickup', 'delivery', 'customer', 'internal'],
      default: 'general'
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
orderSchema.index({ 'pickup.location': '2dsphere' });
orderSchema.index({ 'delivery.location': '2dsphere' });
orderSchema.index({ 'tracking.currentLocation': '2dsphere' });

// Compound indexes for performance
orderSchema.index({ status: 1, priority: 1, isActive: 1 });
orderSchema.index({ assignedVehicle: 1, status: 1 });
orderSchema.index({ assignedDriver: 1, status: 1 });
orderSchema.index({ 'pickup.scheduledTime': 1, status: 1 });
orderSchema.index({ 'delivery.scheduledTime': 1, status: 1 });
orderSchema.index({ 'pricing.paymentStatus': 1, isActive: 1 });

// Virtual for total weight
orderSchema.virtual('totalWeight').get(function() {
  return this.items.reduce((total, item) => total + (item.weight * item.quantity), 0);
});

// Virtual for total value
orderSchema.virtual('totalValue').get(function() {
  return this.items.reduce((total, item) => {
    const itemValue = item.value ? item.value.amount * item.quantity : 0;
    return total + itemValue;
  }, 0);
});

// Virtual for delivery status
orderSchema.virtual('deliveryStatus').get(function() {
  const now = new Date();
  const scheduledTime = new Date(this.delivery.scheduledTime);
  
  if (this.status === 'delivered') return 'delivered';
  if (this.status === 'cancelled') return 'cancelled';
  if (now > scheduledTime && !['delivered', 'cancelled'].includes(this.status)) return 'overdue';
  if (scheduledTime - now <= 60 * 60 * 1000) return 'due_soon'; // 1 hour
  return 'on_time';
});

// Virtual for estimated delivery time
orderSchema.virtual('estimatedDeliveryTime').get(function() {
  if (this.tracking.estimatedDuration && this.pickup.actualTime) {
    return new Date(this.pickup.actualTime.getTime() + this.tracking.estimatedDuration * 60 * 1000);
  }
  return this.delivery.scheduledTime;
});

// Method to update status
orderSchema.methods.updateStatus = function(newStatus, location = null, notes = null, updatedBy = null) {
  // Add to status history
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    location: location,
    notes: notes,
    updatedBy: updatedBy
  });
  
  // Update current status
  this.status = newStatus;
  
  // Update specific timestamps based on status
  switch (newStatus) {
    case 'picked_up':
      this.pickup.actualTime = new Date();
      break;
    case 'delivered':
      this.delivery.actualTime = new Date();
      if (this.pickup.actualTime) {
        this.tracking.actualDuration = (new Date() - this.pickup.actualTime) / (1000 * 60);
      }
      break;
  }
  
  return this.save();
};

// Method to assign vehicle and driver
orderSchema.methods.assign = function(vehicleId, driverId) {
  this.assignedVehicle = vehicleId;
  this.assignedDriver = driverId;
  return this.updateStatus('assigned');
};

// Method to add note
orderSchema.methods.addNote = function(content, author, type = 'general') {
  this.notes.push({
    content: content,
    author: author,
    type: type,
    timestamp: new Date()
  });
  return this.save();
};

// Method to update location
orderSchema.methods.updateLocation = function(longitude, latitude) {
  this.tracking.currentLocation = {
    type: 'Point',
    coordinates: [longitude, latitude]
  };
  this.tracking.lastLocationUpdate = new Date();
  return this.save();
};

// Method to calculate distance
orderSchema.methods.calculateDistance = function() {
  const [pickupLng, pickupLat] = this.pickup.location.coordinates;
  const [deliveryLng, deliveryLat] = this.delivery.location.coordinates;
  
  const R = 6371; // Earth's radius in kilometers
  const dLat = (deliveryLat - pickupLat) * Math.PI / 180;
  const dLng = (deliveryLng - pickupLng) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(pickupLat * Math.PI / 180) * Math.cos(deliveryLat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  this.tracking.estimatedDistance = distance;
  return distance;
};

// Static method to find orders by status
orderSchema.statics.findByStatus = function(status) {
  return this.find({ status: status, isActive: true })
    .populate('assignedVehicle assignedDriver')
    .sort({ 'pickup.scheduledTime': 1 });
};

// Static method to find overdue orders
orderSchema.statics.findOverdue = function() {
  const now = new Date();
  return this.find({
    'delivery.scheduledTime': { $lt: now },
    status: { $nin: ['delivered', 'cancelled', 'returned'] },
    isActive: true
  }).populate('assignedVehicle assignedDriver');
};

// Static method to find orders by priority
orderSchema.statics.findByPriority = function(priority) {
  return this.find({ priority: priority, isActive: true })
    .populate('assignedVehicle assignedDriver')
    .sort({ 'pickup.scheduledTime': 1 });
};

// Static method to find orders in area
orderSchema.statics.findInArea = function(longitude, latitude, radius = 10) {
  return this.find({
    $or: [
      {
        'pickup.location': {
          $near: {
            $geometry: { type: 'Point', coordinates: [longitude, latitude] },
            $maxDistance: radius * 1000
          }
        }
      },
      {
        'delivery.location': {
          $near: {
            $geometry: { type: 'Point', coordinates: [longitude, latitude] },
            $maxDistance: radius * 1000
          }
        }
      }
    ],
    isActive: true
  });
};

module.exports = mongoose.model('Order', orderSchema);