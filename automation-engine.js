// ========================================
// AUTOMATION ENGINE
// Reduces manual processes through intelligent automation
// ========================================

// Global automation settings
const automationConfig = {
    autoAssignment: {
        enabled: true,
        priorityThreshold: 'high', // auto-assign high and urgent only
        maxWaitTime: 15, // minutes before manual intervention required
        criteria: ['proximity', 'availability', 'cost']
    },
    autoRouting: {
        enabled: true,
        optimizationMethod: 'shortest', // shortest, fastest, cheapest
        recalculateInterval: 300000 // 5 minutes
    },
    autoNotifications: {
        enabled: true,
        channels: ['sms', 'email', 'push'],
        events: ['assignment', 'dispatch', 'delay', 'delivery']
    },
    autoDocumentation: {
        enabled: true,
        generateOnCompletion: true,
        emailToCustomer: true
    }
};

// Automation statistics
let automationStats = {
    ordersAutoAssigned: 0,
    routesOptimized: 0,
    notificationsSent: 0,
    documentsGenerated: 0,
    timeSaved: 0, // in minutes
    manualInterventions: 0
};

// ========================================
// 1. AUTO-ASSIGNMENT ENGINE
// ========================================

function autoAssignOrder(order) {
    console.log(`🤖 Auto-Assignment: Processing order ${order.id}`);
    
    if (!automationConfig.autoAssignment.enabled) {
        console.log('Auto-assignment disabled');
        return false;
    }
    
    // Check if order meets auto-assignment criteria
    if (!shouldAutoAssign(order)) {
        console.log(`Order ${order.id} does not meet auto-assignment criteria`);
        automationStats.manualInterventions++;
        return false;
    }
    
    // Find best vehicle
    const vehicle = findBestVehicle(order);
    if (!vehicle) {
        showNotification(`⚠️ No available vehicle for order ${order.id}. Manual assignment required.`, 'warning');
        automationStats.manualInterventions++;
        return false;
    }
    
    // Find best driver
    const driver = findBestDriver(vehicle, order);
    if (!driver) {
        showNotification(`⚠️ No available driver for order ${order.id}. Manual assignment required.`, 'warning');
        automationStats.manualInterventions++;
        return false;
    }
    
    // Calculate optimal route
    const route = calculateOptimalRoute(order);
    
    // Perform assignment
    const assignment = {
        orderId: order.id,
        vehicleId: vehicle.id,
        driverId: driver.id,
        routeId: route.id,
        assignedAt: new Date(),
        assignedBy: 'AUTO-SYSTEM',
        estimatedCost: route.totalCost,
        estimatedTime: route.estimatedTime
    };
    
    // Execute assignment
    executeAssignment(assignment);
    
    // Update statistics
    automationStats.ordersAutoAssigned++;
    automationStats.timeSaved += 10; // Average 10 minutes saved per auto-assignment
    
    // Send notifications
    sendAutoAssignmentNotifications(assignment, order, vehicle, driver);
    
    showNotification(`✅ Order ${order.id} auto-assigned to ${vehicle.number} with driver ${driver.name}`, 'success');
    
    return true;
}

function shouldAutoAssign(order) {
    // Check priority
    const priorityLevels = { urgent: 3, high: 2, normal: 1 };
    const threshold = priorityLevels[automationConfig.autoAssignment.priorityThreshold];
    const orderPriority = priorityLevels[order.priority];
    
    if (orderPriority < threshold) {
        return false;
    }
    
    // Check if all required fields are present
    if (!order.pickup || !order.delivery || !order.material) {
        return false;
    }
    
    // Check if resources are available
    const availableVehicles = sampleData.vehicles.filter(v => v.status === 'available');
    const availableDrivers = sampleData.drivers.filter(d => d.availability === 'available');
    
    if (availableVehicles.length === 0 || availableDrivers.length === 0) {
        return false;
    }
    
    return true;
}

function findBestVehicle(order) {
    const availableVehicles = sampleData.vehicles.filter(v => v.status === 'available');
    
    if (availableVehicles.length === 0) return null;
    
    // Score vehicles based on criteria
    const scoredVehicles = availableVehicles.map(vehicle => {
        let score = 0;
        
        // Proximity score (simulated)
        score += Math.random() * 30;
        
        // Capacity score
        if (vehicle.type === 'truck') score += 20;
        else if (vehicle.type === 'van') score += 15;
        else score += 10;
        
        // Availability score
        score += 20;
        
        // Cost efficiency score
        score += Math.random() * 30;
        
        return { vehicle, score };
    });
    
    // Sort by score and return best
    scoredVehicles.sort((a, b) => b.score - a.score);
    return scoredVehicles[0].vehicle;
}

function findBestDriver(vehicle, order) {
    const availableDrivers = sampleData.drivers.filter(d => d.availability === 'available');
    
    if (availableDrivers.length === 0) return null;
    
    // Score drivers based on criteria
    const scoredDrivers = availableDrivers.map(driver => {
        let score = 0;
        
        // Experience score
        score += driver.experience * 5;
        
        // License type match
        if (vehicle.type === 'truck' && driver.licenseType === 'HMV') score += 30;
        else if (vehicle.type === 'van' && driver.licenseType === 'LMV') score += 25;
        else score += 15;
        
        // Availability score
        score += 20;
        
        // Proximity score (simulated)
        score += Math.random() * 25;
        
        return { driver, score };
    });
    
    // Sort by score and return best
    scoredDrivers.sort((a, b) => b.score - a.score);
    return scoredDrivers[0].driver;
}

function calculateOptimalRoute(order) {
    // Find matching route or create new one
    const existingRoute = sampleData.routes.find(r => 
        r.source.includes(order.pickup.split(' ')[0]) && 
        r.destination.includes(order.delivery.split(' ')[0])
    );
    
    if (existingRoute) {
        return existingRoute;
    }
    
    // Create new route
    return {
        id: 'R' + String(Date.now()).slice(-3),
        name: `${order.pickup} to ${order.delivery}`,
        source: order.pickup,
        destination: order.delivery,
        distance: Math.floor(Math.random() * 500) + 100,
        estimatedTime: { hours: Math.floor(Math.random() * 8) + 2, minutes: 30 },
        totalCost: Math.floor(Math.random() * 5000) + 2000
    };
}

function executeAssignment(assignment) {
    // Update order status
    const order = sampleData.orders.find(o => o.id === assignment.orderId);
    if (order) {
        order.status = 'assigned';
        order.assignedVehicle = assignment.vehicleId;
        order.assignedDriver = assignment.driverId;
        order.assignedAt = assignment.assignedAt;
    }
    
    // Update vehicle status
    const vehicle = sampleData.vehicles.find(v => v.id === assignment.vehicleId);
    if (vehicle) {
        vehicle.status = 'assigned';
    }
    
    // Update driver availability
    const driver = sampleData.drivers.find(d => d.id === assignment.driverId);
    if (driver) {
        driver.availability = 'on-duty';
    }
    
    // Create trip
    const trip = {
        id: 'TRP' + String(Date.now()).slice(-3),
        orderId: assignment.orderId,
        vehicle: assignment.vehicleId,
        driver: driver.name,
        route: assignment.routeId,
        status: 'assigned',
        progress: 0,
        assignedBy: 'AUTO-SYSTEM'
    };
    
    sampleData.trips.push(trip);
    
    // Update UI
    updateOrderTable();
    updateDashboard();
}

function sendAutoAssignmentNotifications(assignment, order, vehicle, driver) {
    if (!automationConfig.autoNotifications.enabled) return;
    
    // Notify driver
    showNotification(`📱 SMS sent to ${driver.name}: New assignment - Order ${order.id}`, 'info');
    
    // Notify customer
    showNotification(`📧 Email sent to ${order.customer}: Order ${order.id} assigned and dispatched`, 'info');
    
    // Notify manager
    showNotification(`🔔 Manager notified: Order ${order.id} auto-assigned successfully`, 'info');
    
    automationStats.notificationsSent += 3;
}

// ========================================
// 2. AUTO-ROUTE OPTIMIZATION
// ========================================

function autoOptimizeRoutes() {
    console.log('🤖 Auto-Optimization: Optimizing routes...');
    
    if (!automationConfig.autoRouting.enabled) {
        return;
    }
    
    const pendingOrders = sampleData.orders.filter(o => o.status === 'pending');
    
    if (pendingOrders.length < 2) {
        console.log('Not enough orders for optimization');
        return;
    }
    
    // Group orders by destination area
    const groupedOrders = groupOrdersByDestination(pendingOrders);
    
    // Optimize each group
    Object.keys(groupedOrders).forEach(destination => {
        const orders = groupedOrders[destination];
        if (orders.length > 1) {
            optimizeOrderGroup(orders, destination);
            automationStats.routesOptimized++;
        }
    });
    
    automationStats.timeSaved += 15; // Average 15 minutes saved per optimization
    
    showNotification(`✅ Routes optimized for ${Object.keys(groupedOrders).length} destinations`, 'success');
}

function groupOrdersByDestination(orders) {
    const groups = {};
    
    orders.forEach(order => {
        const destination = order.delivery.split(' ')[0]; // Get city name
        if (!groups[destination]) {
            groups[destination] = [];
        }
        groups[destination].push(order);
    });
    
    return groups;
}

function optimizeOrderGroup(orders, destination) {
    console.log(`Optimizing ${orders.length} orders for ${destination}`);
    
    // Calculate combined route
    const totalDistance = orders.reduce((sum, order) => sum + (order.distance || 350), 0);
    const avgDistance = totalDistance / orders.length;
    
    // Suggest consolidation if beneficial
    if (orders.length >= 3 && avgDistance < 500) {
        showNotification(`💡 Suggestion: Consolidate ${orders.length} orders to ${destination} in one trip`, 'info');
    }
}

// ========================================
// 3. AUTO-STATUS UPDATES
// ========================================

function autoUpdateStatus() {
    console.log('🤖 Auto-Update: Updating trip statuses...');
    
    const activeTrips = sampleData.trips.filter(t => t.status === 'in-transit');
    
    activeTrips.forEach(trip => {
        // Simulate progress update
        if (trip.progress < 100) {
            trip.progress += Math.floor(Math.random() * 10) + 5;
            
            if (trip.progress >= 100) {
                trip.progress = 100;
                trip.status = 'completed';
                
                // Trigger completion workflow
                autoCompleteTrip(trip);
            }
            
            // Send progress notification
            if (trip.progress % 25 === 0) {
                showNotification(`📍 Trip ${trip.id} is ${trip.progress}% complete`, 'info');
                automationStats.notificationsSent++;
            }
        }
    });
}

function autoCompleteTrip(trip) {
    console.log(`🤖 Auto-Complete: Completing trip ${trip.id}`);
    
    // Find associated order
    const order = sampleData.orders.find(o => o.id === trip.orderId);
    if (order) {
        order.status = 'completed';
    }
    
    // Generate documents
    if (automationConfig.autoDocumentation.enabled) {
        autoGenerateDocuments(trip, order);
    }
    
    // Release resources
    const vehicle = sampleData.vehicles.find(v => v.id === trip.vehicle);
    if (vehicle) {
        vehicle.status = 'available';
    }
    
    const driver = sampleData.drivers.find(d => d.name === trip.driver);
    if (driver) {
        driver.availability = 'available';
    }
    
    showNotification(`✅ Trip ${trip.id} completed automatically`, 'success');
    automationStats.timeSaved += 5;
}

// ========================================
// 4. AUTO-DOCUMENT GENERATION
// ========================================

function autoGenerateDocuments(trip, order) {
    console.log(`🤖 Auto-Docs: Generating documents for trip ${trip.id}`);
    
    // Generate invoice
    const invoice = {
        id: 'INV' + String(Date.now()).slice(-6),
        orderId: order.id,
        tripId: trip.id,
        customer: order.customer,
        amount: calculateTripCost(trip),
        generatedAt: new Date(),
        generatedBy: 'AUTO-SYSTEM'
    };
    
    // Generate delivery report
    const report = {
        id: 'RPT' + String(Date.now()).slice(-6),
        tripId: trip.id,
        deliveryTime: new Date(),
        status: 'delivered',
        generatedBy: 'AUTO-SYSTEM'
    };
    
    // Send to customer
    if (automationConfig.autoDocumentation.emailToCustomer) {
        showNotification(`📧 Invoice ${invoice.id} sent to ${order.customer}`, 'success');
        automationStats.notificationsSent++;
    }
    
    automationStats.documentsGenerated += 2;
    automationStats.timeSaved += 8; // Average 8 minutes saved per document generation
    
    showNotification(`✅ Documents generated for trip ${trip.id}`, 'success');
}

function calculateTripCost(trip) {
    // Simplified cost calculation
    const baseCost = 5000;
    const distanceCost = Math.random() * 2000;
    return Math.floor(baseCost + distanceCost);
}

// ========================================
// 5. AUTOMATION CONTROL FUNCTIONS
// ========================================

function toggleAutomation(feature) {
    switch(feature) {
        case 'assignment':
            automationConfig.autoAssignment.enabled = !automationConfig.autoAssignment.enabled;
            showNotification(
                `Auto-Assignment ${automationConfig.autoAssignment.enabled ? 'enabled' : 'disabled'}`,
                automationConfig.autoAssignment.enabled ? 'success' : 'warning'
            );
            break;
        case 'routing':
            automationConfig.autoRouting.enabled = !automationConfig.autoRouting.enabled;
            showNotification(
                `Auto-Routing ${automationConfig.autoRouting.enabled ? 'enabled' : 'disabled'}`,
                automationConfig.autoRouting.enabled ? 'success' : 'warning'
            );
            break;
        case 'notifications':
            automationConfig.autoNotifications.enabled = !automationConfig.autoNotifications.enabled;
            showNotification(
                `Auto-Notifications ${automationConfig.autoNotifications.enabled ? 'enabled' : 'disabled'}`,
                automationConfig.autoNotifications.enabled ? 'success' : 'warning'
            );
            break;
        case 'documentation':
            automationConfig.autoDocumentation.enabled = !automationConfig.autoDocumentation.enabled;
            showNotification(
                `Auto-Documentation ${automationConfig.autoDocumentation.enabled ? 'enabled' : 'disabled'}`,
                automationConfig.autoDocumentation.enabled ? 'success' : 'warning'
            );
            break;
    }
    
    updateAutomationDashboard();
}

function getAutomationStats() {
    return {
        ...automationStats,
        timeSavedHours: (automationStats.timeSaved / 60).toFixed(1),
        automationRate: automationStats.ordersAutoAssigned > 0 
            ? ((automationStats.ordersAutoAssigned / (automationStats.ordersAutoAssigned + automationStats.manualInterventions)) * 100).toFixed(1)
            : 0
    };
}

function updateAutomationDashboard() {
    const stats = getAutomationStats();
    
    // Update UI elements
    document.getElementById('ordersAutoAssigned')?.textContent = stats.ordersAutoAssigned;
    document.getElementById('routesOptimized')?.textContent = stats.routesOptimized;
    document.getElementById('notificationsSent')?.textContent = stats.notificationsSent;
    document.getElementById('documentsGenerated')?.textContent = stats.documentsGenerated;
    document.getElementById('timeSavedHours')?.textContent = stats.timeSavedHours + ' hours';
    document.getElementById('manualInterventions')?.textContent = stats.manualInterventions;
    document.getElementById('automationRate')?.textContent = stats.automationRate + '%';
}

function resetAutomationStats() {
    automationStats = {
        ordersAutoAssigned: 0,
        routesOptimized: 0,
        notificationsSent: 0,
        documentsGenerated: 0,
        timeSaved: 0,
        manualInterventions: 0
    };
    
    updateAutomationDashboard();
    showNotification('Automation statistics reset', 'info');
}

// ========================================
// 6. AUTOMATION SCHEDULER
// ========================================

function startAutomationEngine() {
    console.log('🤖 Starting Automation Engine...');
    
    // Auto-assign new orders every 30 seconds
    setInterval(() => {
        const pendingOrders = sampleData.orders.filter(o => o.status === 'pending');
        pendingOrders.forEach(order => {
            autoAssignOrder(order);
        });
    }, 30000);
    
    // Auto-optimize routes every 5 minutes
    setInterval(() => {
        autoOptimizeRoutes();
    }, automationConfig.autoRouting.recalculateInterval);
    
    // Auto-update statuses every 10 seconds
    setInterval(() => {
        autoUpdateStatus();
    }, 10000);
    
    showNotification('🤖 Automation Engine started successfully', 'success');
}

// Initialize automation engine on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Automation Engine...');
    startAutomationEngine();
    updateAutomationDashboard();
});

console.log('✅ Automation Engine loaded successfully!');
