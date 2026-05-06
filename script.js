// Fleet Management System JavaScript

// Global Variables
let map;
let vehicleMarkers = {};
let realTimeInterval;
let powerBIService;
let currentReport = 'fleet-overview';

// Updated Sample Data with correct counts and new modules
const sampleData = {
    vehicles: [
        { 
            id: 'V001', 
            number: 'TN01AB1234', 
            type: 'truck', 
            capacity: '5000 kg',
            insurance: {
                policy: 'INS123456789',
                provider: 'HDFC ERGO',
                expiry: '2024-12-31'
            },
            status: 'available', 
            driver: 'John Doe', 
            lat: 13.0827, 
            lng: 80.2707, 
            speed: 45 
        },
        { 
            id: 'V002', 
            number: 'TN02CD5678', 
            type: 'van', 
            capacity: '2000 kg',
            insurance: {
                policy: 'INS987654321',
                provider: 'ICICI Lombard',
                expiry: '2024-10-15'
            },
            status: 'available', 
            driver: 'Jane Smith', 
            lat: 13.0878, 
            lng: 80.2785, 
            speed: 32 
        },
        { 
            id: 'V003', 
            number: 'TN03EF9012', 
            type: 'truck', 
            capacity: '8000 kg',
            insurance: {
                policy: 'INS456789123',
                provider: 'Bajaj Allianz',
                expiry: '2024-04-20'
            },
            status: 'maintenance', 
            driver: 'Mike Johnson', 
            lat: 13.0758, 
            lng: 80.2644, 
            speed: 0 
        },
        { 
            id: 'V004', 
            number: 'TN04GH3456', 
            type: 'car', 
            capacity: '5 passengers',
            insurance: {
                policy: 'INS789123456',
                provider: 'Tata AIG',
                expiry: '2025-01-15'
            },
            status: 'available', 
            driver: 'Sarah Wilson', 
            lat: 13.0912, 
            lng: 80.2823, 
            speed: 28 
        },
        { 
            id: 'V005', 
            number: 'TN05IJ7890', 
            type: 'bus', 
            capacity: '45 passengers',
            insurance: {
                policy: 'INS321654987',
                provider: 'New India Assurance',
                expiry: '2024-03-25'
            },
            status: 'out-of-service', 
            driver: null, 
            lat: 13.0689, 
            lng: 80.2567, 
        }
    ],
    drivers: [
        {
            id: 'D001',
            name: 'John Doe',
            licenseNumber: 'DL123456789',
            licenseType: 'HMV',
            licenseExpiry: '2025-06-15',
            phone: '+91 98765 43210',
            email: 'john@example.com',
            address: 'No. 123, Anna Nagar, Chennai, Tamil Nadu - 600040',
            experience: 5,
            availability: 'on-duty',
            joinDate: '2019-03-15'
        },
        {
            id: 'D002',
            name: 'Jane Smith',
            licenseNumber: 'DL987654321',
            licenseType: 'LMV',
            licenseExpiry: '2024-12-20',
            phone: '+91 87654 32109',
            email: 'jane@example.com',
            address: 'No. 456, Koramangala, Bangalore, Karnataka - 560034',
            experience: 8,
            availability: 'available',
            joinDate: '2016-07-22'
        },
        {
            id: 'D003',
            name: 'Mike Johnson',
            licenseNumber: 'DL456789123',
            licenseType: 'HMV',
            licenseExpiry: '2024-04-10',
            phone: '+91 76543 21098',
            email: 'mike@example.com',
            address: 'No. 789, RS Puram, Coimbatore, Tamil Nadu - 641002',
            experience: 3,
            availability: 'off-duty',
            joinDate: '2021-01-10'
        },
        {
            id: 'D004',
            name: 'Sarah Wilson',
            licenseNumber: 'DL789123456',
            licenseType: 'LMV',
            licenseExpiry: '2025-08-30',
            phone: '+91 65432 10987',
            email: 'sarah@example.com',
            address: 'No. 321, Anna Salai, Madurai, Tamil Nadu - 625001',
            experience: 6,
            availability: 'available',
            joinDate: '2018-05-18'
        },
        {
            id: 'D005',
            name: 'Robert Brown',
            licenseNumber: 'DL321654987',
            licenseType: 'PSV',
            licenseExpiry: '2024-02-15',
            phone: '+91 54321 09876',
            email: 'robert@example.com',
            address: 'No. 654, Cantonment, Trichy, Tamil Nadu - 620001',
            experience: 12,
            availability: 'available',
            joinDate: '2012-09-03'
        }
    ],
    routes: [
        {
            id: 'R001',
            name: 'Chennai to Bangalore',
            code: 'CHN-BLR-001',
            source: 'Chennai Port',
            destination: 'Bangalore Hub',
            distance: 350,
            estimatedTime: { hours: 6, minutes: 30, total: 390 },
            type: 'highway',
            tollCost: 450,
            fuelCost: 2800,
            totalCost: 3250,
            avgSpeed: 54,
            status: 'active',
            createdDate: '2024-01-15'
        },
        {
            id: 'R002',
            name: 'Chennai to Coimbatore',
            code: 'CHN-COI-002',
            source: 'T Nagar',
            destination: 'RS Puram',
            distance: 502,
            estimatedTime: { hours: 8, minutes: 15, total: 495 },
            type: 'mixed',
            tollCost: 520,
            fuelCost: 3680,
            totalCost: 4200,
            avgSpeed: 61,
            status: 'active',
            createdDate: '2024-01-20'
        },
        {
            id: 'R003',
            name: 'Chennai to Madurai',
            code: 'CHN-MDU-003',
            source: 'Anna Nagar',
            destination: 'Anna Salai',
            distance: 458,
            estimatedTime: { hours: 7, minutes: 45, total: 465 },
            type: 'highway',
            tollCost: 380,
            fuelCost: 3470,
            totalCost: 3850,
            avgSpeed: 59,
            status: 'active',
            createdDate: '2024-02-01'
        },
        {
            id: 'R004',
            name: 'Bangalore to Hyderabad',
            code: 'BLR-HYD-004',
            source: 'Electronic City',
            destination: 'HITEC City',
            distance: 569,
            estimatedTime: { hours: 9, minutes: 20, total: 560 },
            type: 'highway',
            tollCost: 650,
            fuelCost: 4100,
            totalCost: 4750,
            avgSpeed: 61,
            status: 'inactive',
            createdDate: '2024-02-10'
        },
        {
            id: 'R005',
            name: 'Chennai to Trichy',
            code: 'CHN-TRY-005',
            source: 'Velachery',
            destination: 'Cantonment',
            distance: 320,
            estimatedTime: { hours: 5, minutes: 30, total: 330 },
            type: 'highway',
            tollCost: 280,
            fuelCost: 2400,
            totalCost: 2680,
            avgSpeed: 58,
            status: 'active',
            createdDate: '2024-02-15'
        }
    ],
    materials: [
        {
            id: 'MAT001',
            code: 'LAM001',
            name: 'Satin Laminate',
            category: 'laminate',
            description: 'Premium quality satin finish laminate',
            warehouse: 'chennai-main',
            warehouseName: 'Chennai Main Warehouse',
            currentStock: 500,
            unit: 'sheets',
            minStockLevel: 50,
            status: 'available',
            createdDate: '2024-01-10'
        },
        {
            id: 'MAT002',
            code: 'LAM002',
            name: 'Gloss Laminate',
            category: 'laminate',
            description: 'High gloss finish laminate',
            warehouse: 'bangalore-hub',
            warehouseName: 'Bangalore Hub',
            currentStock: 800,
            unit: 'sheets',
            minStockLevel: 100,
            status: 'available',
            createdDate: '2024-01-12'
        },
        {
            id: 'MAT003',
            code: 'LAM003',
            name: 'Matte Laminate',
            category: 'laminate',
            description: 'Elegant matte finish laminate',
            warehouse: 'coimbatore-depot',
            warehouseName: 'Coimbatore Depot',
            currentStock: 150,
            unit: 'sheets',
            minStockLevel: 50,
            status: 'low-stock',
            createdDate: '2024-01-15'
        }
    ],
    orders: [
        { 
            id: 'ORD001', 
            customer: 'ABC Corporation', 
            material: 'Satin Laminate',
            materialId: 'LAM001',
            quantity: 100,
            unit: 'sheets',
            pickup: 'Chennai Port', 
            delivery: 'Bangalore', 
            priority: 'urgent', 
            status: 'pending',
            createdDate: '2024-03-15',
            requiredDate: '2024-03-20',
            contact: '+91 98765 43210',
            email: 'abc@corporation.com'
        },
        { 
            id: 'ORD002', 
            customer: 'XYZ Industries', 
            material: 'Gloss Laminate',
            materialId: 'LAM002',
            quantity: 500,
            unit: 'sheets',
            pickup: 'Bangalore Hub', 
            delivery: 'Coimbatore', 
            priority: 'high', 
            status: 'processing',
            createdDate: '2024-03-14',
            requiredDate: '2024-03-18',
            contact: '+91 87654 32109',
            email: 'xyz@industries.com'
        },
        { 
            id: 'ORD003', 
            customer: 'PQR Logistics', 
            material: 'Matte Laminate',
            materialId: 'LAM003',
            quantity: 10,
            unit: 'sheets',
            pickup: 'Coimbatore Depot', 
            delivery: 'Madurai', 
            priority: 'normal', 
            status: 'completed',
            createdDate: '2024-03-13',
            requiredDate: '2024-03-16',
            contact: '+91 76543 21098',
            email: 'pqr@logistics.com'
        }
    ],
    trips: [
        { id: 'TRP001', vehicle: 'V001', driver: 'John Doe', route: 'Chennai - Bangalore', status: 'in-transit', progress: 65 },
        { id: 'TRP002', vehicle: 'V002', driver: 'Jane Smith', route: 'Chennai - Coimbatore', status: 'completed', progress: 100 },
        { id: 'TRP003', vehicle: 'V004', driver: 'Sarah Wilson', route: 'Chennai - Madurai', status: 'scheduled', progress: 0 }
    ]
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing Fleet Management System...');
    initializeApp();
    
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize Bootstrap popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // Add event listener for notification settings form
    const notificationForm = document.getElementById('notificationSettings');
    if (notificationForm) {
        notificationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveNotificationSettings();
        });
    }
    
    console.log('Fleet Management System fully loaded');
});

// Sidebar Toggle Function
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    // For mobile devices, use show/hide instead of collapse/expand
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('show');
    } else {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    }
}

function initializeApp() {
    // Initialize dashboard
    updateDashboard();
    
    // Initialize vehicle management
    updateVehicleTable();
    
    // Initialize driver management
    updateDriverTable();
    populateVehicleDropdown();
    
    // Initialize warehouse management
    updateMaterialTable();
    updateWarehouseDashboard();
    
    // Initialize order management
    updateOrderTable();
    
    // Initialize route management
    updateRouteTable();
    
    // Initialize GPS tracking
    initializeGPSTracking();
    
    // Initialize document management
    initializeDocumentManagement();
    
    // Initialize Power BI reports
    initializePowerBI();
    
    // Start real-time updates
    startRealTimeUpdates();
    
    console.log('Fleet Management System initialized successfully');
}

// Navigation Functions
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    document.getElementById(sectionId).style.display = 'block';
    
    // Update navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current nav item
    const activeLink = document.querySelector(`[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Section-specific initialization
    if (sectionId === 'tracking') {
        setTimeout(() => {
            if (map) {
                map.invalidateSize();
            } else {
                initializeGPSTracking();
            }
        }, 100);
    }
    
    // Update dashboard when dashboard is shown
    if (sectionId === 'dashboard') {
        updateDashboard();
        updateRecentActivities();
        updateAlerts();
    }
    
    // Initialize alerts section
    if (sectionId === 'alerts') {
        initializeAlertsSection();
    }
    
    // Initialize route tracking when routes section is shown
    if (sectionId === 'routes') {
        showNotification('Loading Route Master section...', 'info');
        setTimeout(() => {
            initializeRouteSection();
        }, 100);
    }
}

// Dashboard Functions
function updateDashboard() {
    // Update KPI cards with correct counts
    document.getElementById('totalVehicles').textContent = sampleData.vehicles.length; // 5
    document.getElementById('activeTrips').textContent = sampleData.trips.filter(t => t.status === 'in-transit').length; // 1
    document.getElementById('pendingOrders').textContent = sampleData.orders.filter(o => o.status === 'pending').length; // 1
    document.getElementById('deliveredToday').textContent = sampleData.trips.filter(t => t.status === 'completed').length; // 1
    
    // Update recent activities
    updateRecentActivities();
    
    // Update alerts
    updateAlerts();
}

function updateRecentActivities() {
    const activities = [
        { time: '10:30 AM', text: 'Vehicle TN01AB1234 started trip to Bangalore', type: 'info' },
        { time: '10:15 AM', text: 'Order ORD003 assigned to driver Sarah Wilson', type: 'success' },
        { time: '09:45 AM', text: 'Vehicle TN05IJ7890 scheduled for maintenance', type: 'warning' },
        { time: '09:30 AM', text: 'Trip TRP002 completed successfully', type: 'success' },
        { time: '09:00 AM', text: 'New order ORD004 received from LMN Co', type: 'info' }
    ];
    
    const container = document.getElementById('recentActivities');
    container.innerHTML = activities.map(activity => `
        <div class="d-flex align-items-center mb-3">
            <div class="flex-shrink-0">
                <span class="badge bg-${activity.type === 'success' ? 'success' : activity.type === 'warning' ? 'warning' : 'info'} rounded-pill">
                    ${activity.time}
                </span>
            </div>
            <div class="flex-grow-1 ms-3">
                <p class="mb-0">${activity.text}</p>
            </div>
        </div>
    `).join('');
}

function updateAlerts() {
    const alerts = [
        { text: 'Vehicle TN03EF9012 has been idle for 2 hours', type: 'warning' },
        { text: 'Fuel level low in vehicle TN02CD5678', type: 'danger' },
        { text: 'Route deviation detected for TN01AB1234', type: 'info' },
        { text: 'Maintenance due for vehicle TN04GH3456', type: 'warning' }
    ];
    
    const container = document.getElementById('alertsList');
    container.innerHTML = alerts.map(alert => `
        <div class="alert-item alert-${alert.type}">
            <small>${alert.text}</small>
        </div>
    `).join('');
}

// GPS Tracking Functions

function handleOrderSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const orderData = {
        id: 'ORD' + String(Date.now()).slice(-3),
        customer: formData.get('customerName') || document.getElementById('customerName').value,
        pickup: formData.get('pickupLocation') || document.getElementById('pickupLocation').value,
        delivery: formData.get('deliveryLocation') || document.getElementById('deliveryLocation').value,
        material: formData.get('materialDetails') || document.getElementById('materialDetails').value,
        priority: formData.get('priority') || document.getElementById('priority').value,
        phone: formData.get('customerPhone') || document.getElementById('customerPhone').value,
        email: formData.get('customerEmail') || document.getElementById('customerEmail').value,
        status: 'pending',
        createdAt: new Date().toISOString(),
        createdDate: new Date().toISOString().split('T')[0],
        quantity: formData.get('quantity') || document.getElementById('quantity').value || '1',
        unit: formData.get('unit') || document.getElementById('unit').value || 'unit',
        contact: formData.get('customerPhone') || document.getElementById('customerPhone').value
    };
    
    // Add to sample data
    sampleData.orders.push(orderData);
    
    // Update UI across all modules
    updatePendingOrders();
    updateOrderTable();
    updateDashboard();
    
    // Reset form
    e.target.reset();
    
    // Show success message
    showNotification(`Sales Order ${orderData.id} created successfully!`, 'success');
    
    // Order processing moved to separate dispatch app
}

function updatePendingOrders() {
    const pendingOrders = sampleData.orders.filter(order => order.status === 'pending');
    const container = document.getElementById('pendingOrdersList');
    
    container.innerHTML = pendingOrders.map(order => `
        <div class="order-item" data-order-id="${order.id}">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <h6 class="mb-0">${order.id}</h6>
                <span class="order-priority priority-${order.priority}">${order.priority}</span>
            </div>
            <p class="mb-1"><strong>Customer:</strong> ${order.customer}</p>
            <p class="mb-1"><strong>Material:</strong> ${order.material} (${order.quantity} ${order.unit})</p>
            <p class="mb-1"><strong>Route:</strong> ${order.pickup} → ${order.delivery}</p>
            <p class="mb-1"><strong>Phone:</strong> ${order.phone || order.contact || 'N/A'}</p>
            <p class="mb-1"><strong>Email:</strong> ${order.email || 'N/A'}</p>
            <p class="mb-1"><strong>Created:</strong> ${order.createdDate}</p>
            <div class="mt-2">
                <button class="btn btn-primary btn-sm" onclick="assignOrder('${order.id}')">
                    <i class="fas fa-user-plus"></i> Assign
                </button>
                <button class="btn btn-outline-secondary btn-sm" onclick="viewOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-outline-success btn-sm" onclick="contactCustomer('${order.id}')">
                    <i class="fas fa-phone"></i> Contact
                </button>
            </div>
        </div>
    `).join('');
    
    // Show manual workflow guidance
    showNotification(`Order ${orderData.id} is now available in Dispatch Management for manual processing`, 'info');
    const pendingCount = pendingOrders.length;
    document.querySelectorAll('.pending-orders-count').forEach(el => {
        el.textContent = pendingCount;
    });
}

// Filter dispatch orders by priority
function filterDispatchOrders() {
    const filter = document.getElementById('dispatchPriorityFilter').value;
    const pendingOrders = sampleData.orders.filter(order => {
        const statusMatch = order.status === 'pending';
        const priorityMatch = filter === 'all' || order.priority === filter;
        return statusMatch && priorityMatch;
    });
    
    const container = document.getElementById('pendingOrdersList');
    container.innerHTML = pendingOrders.map(order => `
        <div class="order-item" data-order-id="${order.id}">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <h6 class="mb-0">${order.id}</h6>
                <span class="order-priority priority-${order.priority}">${order.priority}</span>
            </div>
            <p class="mb-1"><strong>Customer:</strong> ${order.customer}</p>
            <p class="mb-1"><strong>Material:</strong> ${order.material} (${order.quantity} ${order.unit})</p>
            <p class="mb-1"><strong>Route:</strong> ${order.pickup} → ${order.delivery}</p>
            <p class="mb-1"><strong>Contact:</strong> ${order.contact || 'N/A'}</p>
            <p class="mb-1"><strong>Created:</strong> ${order.createdDate}</p>
            <div class="mt-2">
                <button class="btn btn-primary btn-sm" onclick="assignOrder('${order.id}')">
                    <i class="fas fa-user-plus"></i> Assign
                </button>
                <button class="btn btn-outline-secondary btn-sm" onclick="viewOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
            </div>
        </div>
    `).join('');
    
    showNotification(`Filtered ${pendingOrders.length} orders by ${filter} priority`, 'info');
}

function refreshDispatchOrders() {
    updatePendingOrders();
    showNotification('Dispatch orders refreshed with latest data from Fleet Management', 'success');
}

function updateAvailableResources() {
    // Update available vehicles - ensure fresh data from fleet management
    const availableVehicles = sampleData.vehicles.filter(v => v.status === 'available' && !isVehicleAssigned(v.id));
    const vehicleContainer = document.getElementById('availableVehicles');
    
    if (vehicleContainer) {
        vehicleContainer.innerHTML = availableVehicles.map(vehicle => `
            <div class="resource-item" data-vehicle-id="${vehicle.id}" onclick="selectResource('vehicle', '${vehicle.id}')">
                <div class="resource-info">
                    <strong>${vehicle.number}</strong><br>
                    <small>${vehicle.type.toUpperCase()} - ${vehicle.capacity}</small><br>
                    <small class="text-muted">Last updated: ${new Date().toLocaleTimeString()}</small>
                </div>
                <span class="resource-status status-available">Available</span>
            </div>
        `).join('');
        
        if (availableVehicles.length === 0) {
            vehicleContainer.innerHTML = '<div class="text-muted text-center p-3">No available vehicles</div>';
        }
    }
    
    // Update available drivers - ensure fresh data from fleet management
    const availableDrivers = sampleData.drivers.filter(d => d.availability === 'available');
    const driverContainer = document.getElementById('availableDrivers');
    
    if (driverContainer) {
        driverContainer.innerHTML = availableDrivers.map(driver => `
            <div class="resource-item" data-driver-id="${driver.id}" onclick="selectResource('driver', '${driver.id}')">
                <div class="resource-info">
                    <strong>${driver.name}</strong><br>
                    <small>License: ${driver.licenseType} - ${driver.experience}y exp</small><br>
                    <small class="text-muted">Last updated: ${new Date().toLocaleTimeString()}</small>
                </div>
                <span class="resource-status status-available">Available</span>
            </div>
        `).join('');
        
        if (availableDrivers.length === 0) {
            driverContainer.innerHTML = '<div class="text-muted text-center p-3">No available drivers</div>';
        }
    }
    
    // Show notification about data freshness
    console.log('Dispatch resources updated with fresh data from Fleet Management at', new Date().toLocaleTimeString());
}

function isVehicleAssigned(vehicleId) {
    return sampleData.trips.some(trip => trip.vehicle === vehicleId && ['dispatched', 'in-transit'].includes(trip.status));
}

function selectResource(type, id) {
    // Remove previous selections
    document.querySelectorAll(`.resource-item`).forEach(item => {
        item.classList.remove('selected');
    });
    
    // Add selection to clicked item
    const item = document.querySelector(`[data-${type}-id="${id}"]`);
    if (item) {
        item.classList.add('selected');
    }
}

function autoAssign() {
    const pendingOrders = sampleData.orders.filter(order => order.status === 'pending');
    const availableVehicles = sampleData.vehicles.filter(v => v.status === 'active' && !isVehicleAssigned(v.id));
    const availableDrivers = sampleData.drivers.filter(d => d.availability === 'available');
    
    if (pendingOrders.length === 0) {
        showNotification('No pending orders to assign', 'info');
        return;
    }
    
    if (availableVehicles.length === 0) {
        showNotification('No available vehicles for assignment', 'warning');
        return;
    }
    
    if (availableDrivers.length === 0) {
        showNotification('No available drivers for assignment', 'warning');
        return;
    }
    
    // Simple auto-assignment logic
    const order = pendingOrders[0];
    const vehicle = availableVehicles[0];
    const driver = availableDrivers[0];
    
    assignOrderToResources(order.id, vehicle.id, driver.id);
}

function manualAssign() {
    const selectedVehicle = document.querySelector('.resource-item.selected[data-vehicle-id]');
    const selectedDriver = document.querySelector('.resource-item.selected[data-driver-id]');
    const pendingOrders = sampleData.orders.filter(order => order.status === 'pending');
    
    if (!selectedVehicle) {
        showNotification('Please select a vehicle first', 'warning');
        return;
    }
    
    if (!selectedDriver) {
        showNotification('Please select a driver first', 'warning');
        return;
    }
    
    if (pendingOrders.length === 0) {
        showNotification('No pending orders available for assignment', 'info');
        return;
    }
    
    const vehicleId = selectedVehicle.getAttribute('data-vehicle-id');
    const driverId = selectedDriver.getAttribute('data-driver-id');
    const orderId = pendingOrders[0].id;
    
    assignOrderToResources(orderId, vehicleId, driverId);
}

function assignOrderToResources(orderId, vehicleId, driverId) {
    // Update order status
    const order = sampleData.orders.find(o => o.id === orderId);
    const vehicle = sampleData.vehicles.find(v => v.id === vehicleId);
    const driver = sampleData.drivers.find(d => d.id === driverId);
    
    if (order && vehicle && driver) {
        order.status = 'assigned';
        order.assignedVehicle = vehicle.number;
        order.assignedDriver = driver.name;
        
        // Update driver availability
        driver.availability = 'on-duty';
        
        // Create new trip
        const trip = {
            id: 'TRP' + String(Date.now()).slice(-3),
            vehicle: vehicleId,
            driver: driver.name,
            route: `${order.pickup} - ${order.delivery}`,
            status: 'dispatched',
            progress: 0,
            orderId: orderId
        };
        
        sampleData.trips.push(trip);
        
        // Update UI
        updatePendingOrders();
        updateOrderTable(); // Add this line to update order counts
        updateAvailableResources();
        updateActiveTrips();
        updateDashboard();
        
        showNotification(`Order ${orderId} assigned to vehicle ${vehicle.number} with driver ${driver.name}. Use workflow buttons to progress manually.`, 'success');
    }
}

function updateActiveTrips() {
    const activeTrips = sampleData.trips.filter(trip => ['dispatched', 'in-transit'].includes(trip.status));
    const container = document.getElementById('activeTripsTable');
    
    if (container) {
        container.innerHTML = activeTrips.map(trip => `
            <tr>
                <td><strong>${trip.id}</strong></td>
                <td>${sampleData.vehicles.find(v => v.id === trip.vehicle)?.number || 'N/A'}</td>
                <td>${trip.driver}</td>
                <td>${trip.route}</td>
                <td>
                    <div class="progress" style="height: 20px;">
                        <div class="progress-bar" role="progressbar" style="width: ${trip.progress}%">
                            ${trip.progress}%
                        </div>
                    </div>
                </td>
                <td>
                    ${trip.status === 'in-transit' ? 
                        `<span class="text-success">${calculateETA(trip)}</span>` : 
                        '<span class="text-muted">Not started</span>'
                    }
                </td>
                <td>
                    <span class="badge ${trip.status === 'in-transit' ? 'bg-success' : 'bg-warning'}">
                        ${trip.status.replace('-', ' ').toUpperCase()}
                    </span>
                </td>
            </tr>
        `).join('');
        
        if (activeTrips.length === 0) {
            container.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No active trips</td></tr>';
        }
    }
}

function calculateETA(trip) {
    // Simple ETA calculation based on progress
    const remainingTime = Math.round((100 - trip.progress) * 0.1); // 0.1 hours per percent
    const hours = Math.floor(remainingTime);
    const minutes = Math.round((remainingTime - hours) * 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}
// GPS Tracking Functions
function initializeGPSTracking() {
    // Check if map container exists
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        console.warn('Map container not found. GPS tracking will initialize when tracking section is shown.');
        return;
    }
    
    // Initialize Leaflet map only if not already initialized
    if (!map) {
        try {
            map = L.map('map').setView([13.0827, 80.2707], 12);
            
            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            
            console.log('GPS tracking map initialized successfully');
        } catch (error) {
            console.error('Error initializing map:', error);
            return;
        }
    }
    
    // Add vehicle markers
    addVehicleMarkers();
    
    // Update vehicle status list
    updateVehicleStatusList();
    
    // Update tracking alerts
    updateTrackingAlerts();
}

function addVehicleMarkers() {
    sampleData.vehicles.forEach(vehicle => {
        if (vehicle.lat && vehicle.lng) {
            const icon = L.divIcon({
                className: 'vehicle-marker',
                html: `<i class="fas fa-truck" style="color: white; font-size: 12px;"></i>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });
            
            const marker = L.marker([vehicle.lat, vehicle.lng], { icon })
                .addTo(map)
                .bindPopup(`
                    <div>
                        <h6>${vehicle.number}</h6>
                        <p><strong>Driver:</strong> ${vehicle.driver || 'Not assigned'}</p>
                        <p><strong>Status:</strong> ${vehicle.status}</p>
                        <p><strong>Speed:</strong> ${vehicle.speed} km/h</p>
                        <button class="btn btn-sm btn-primary" onclick="showVehicleDetails('${vehicle.id}')">
                            View Details
                        </button>
                    </div>
                `);
            
            vehicleMarkers[vehicle.id] = marker;
            
            // Add moving animation for available vehicles
            if (vehicle.status === 'available' && vehicle.speed > 0) {
                marker.getElement().classList.add('moving');
            }
        }
    });
}

function updateVehicleStatusList() {
    const container = document.getElementById('vehicleStatusList');
    
    container.innerHTML = sampleData.vehicles.map(vehicle => `
        <div class="vehicle-status-item" onclick="focusVehicle('${vehicle.id}')">
            <div class="vehicle-info">
                <div class="vehicle-icon">
                    <i class="fas fa-truck"></i>
                </div>
                <div>
                    <strong>${vehicle.number}</strong><br>
                    <small>${vehicle.driver || 'No driver'}</small>
                </div>
            </div>
            <div class="text-end">
                <span class="resource-status status-${vehicle.status === 'active' ? 'available' : vehicle.status === 'idle' ? 'busy' : 'offline'}">
                    ${vehicle.status.toUpperCase()}
                </span><br>
                <small>${vehicle.speed} km/h</small>
            </div>
        </div>
    `).join('');
}

function updateTrackingAlerts() {
    const alerts = [
        { text: 'Vehicle TN01AB1234 exceeded speed limit', type: 'danger', time: '2 min ago' },
        { text: 'Vehicle TN02CD5678 deviated from route', type: 'warning', time: '5 min ago' },
        { text: 'Vehicle TN04GH3456 reached destination', type: 'info', time: '8 min ago' }
    ];
    
    const container = document.getElementById('trackingAlerts');
    container.innerHTML = alerts.map(alert => `
        <div class="alert-item alert-${alert.type}">
            <div class="d-flex justify-content-between">
                <small>${alert.text}</small>
                <small class="text-muted">${alert.time}</small>
            </div>
        </div>
    `).join('');
}

function focusVehicle(vehicleId) {
    const vehicle = sampleData.vehicles.find(v => v.id === vehicleId);
    if (vehicle && vehicle.lat && vehicle.lng) {
        map.setView([vehicle.lat, vehicle.lng], 15);
        vehicleMarkers[vehicleId].openPopup();
    }
}

function showVehicleDetails(vehicleId) {
    const vehicle = sampleData.vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;
    
    const content = `
        <div class="row">
            <div class="col-md-6">
                <h6>Vehicle Information</h6>
                <p><strong>Vehicle Number:</strong> ${vehicle.number}</p>
                <p><strong>Type:</strong> ${vehicle.type.toUpperCase()}</p>
                <p><strong>Status:</strong> ${vehicle.status.toUpperCase()}</p>
                <p><strong>Current Speed:</strong> ${vehicle.speed} km/h</p>
            </div>
            <div class="col-md-6">
                <h6>Driver Information</h6>
                <p><strong>Driver:</strong> ${vehicle.driver || 'Not assigned'}</p>
                <p><strong>License:</strong> DL${vehicle.id}</p>
                <p><strong>Contact:</strong> +91 98765 43210</p>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12">
                <h6>Current Location</h6>
                <p><strong>Latitude:</strong> ${vehicle.lat}</p>
                <p><strong>Longitude:</strong> ${vehicle.lng}</p>
                <p><strong>Last Updated:</strong> ${new Date().toLocaleString()}</p>
            </div>
        </div>
    `;
    
    document.getElementById('vehicleDetailsContent').innerHTML = content;
    new bootstrap.Modal(document.getElementById('vehicleDetailsModal')).show();
}

function toggleTrafficLayer() {
    // Simulate traffic layer toggle
    showNotification('Traffic layer toggled', 'info');
}

function centerAllVehicles() {
    const group = new L.featureGroup(Object.values(vehicleMarkers));
    map.fitBounds(group.getBounds().pad(0.1));
}

function startRealTimeTracking() {
    if (realTimeInterval) {
        clearInterval(realTimeInterval);
        realTimeInterval = null;
        showNotification('Real-time tracking stopped', 'info');
        return;
    }
    
    realTimeInterval = setInterval(() => {
        // Simulate vehicle movement
        sampleData.vehicles.forEach(vehicle => {
            if (vehicle.status === 'available' && vehicle.lat && vehicle.lng) {
                // Random small movement
                vehicle.lat += (Math.random() - 0.5) * 0.001;
                vehicle.lng += (Math.random() - 0.5) * 0.001;
                vehicle.speed = Math.max(0, vehicle.speed + (Math.random() - 0.5) * 10);
                
                // Update marker position
                if (vehicleMarkers[vehicle.id]) {
                    vehicleMarkers[vehicle.id].setLatLng([vehicle.lat, vehicle.lng]);
                }
            }
        });
        
        // Update UI
        updateVehicleStatusList();
        updateDashboard();
    }, 5000);
    
    showNotification('Real-time tracking started', 'success');
}

function filterVehicles() {
    const typeFilter = document.getElementById('vehicleTypeFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    sampleData.vehicles.forEach(vehicle => {
        const marker = vehicleMarkers[vehicle.id];
        if (marker) {
            const showType = typeFilter === 'all' || vehicle.type === typeFilter;
            const showStatus = statusFilter === 'all' || vehicle.status === statusFilter;
            
            if (showType && showStatus) {
                marker.addTo(map);
            } else {
                map.removeLayer(marker);
            }
        }
    });
}

// Power BI Functions
function initializePowerBI() {
    // Initialize Power BI service
    powerBIService = new pbi.service.Service(
        pbi.factories.hpmFactory,
        pbi.factories.wpmpFactory,
        pbi.factories.routerFactory
    );
    
    // Load default report
    loadReport('fleet-overview');
    
    // Update real-time metrics
    updateRealTimeMetrics();
    
    // Initialize charts
    initializeCharts();
}

function loadReport(reportType) {
    currentReport = reportType;
    
    // Update report title
    const titles = {
        'fleet-overview': 'Fleet Overview Dashboard',
        'dispatch-performance': 'Dispatch Performance Analytics',
        'fuel-analysis': 'Fuel Consumption Analysis',
        'driver-performance': 'Driver Performance Metrics'
    };
    
    document.getElementById('currentReportTitle').innerHTML = 
        `<i class="fas fa-chart-line"></i> ${titles[reportType]}`;
    
    // Simulate Power BI report loading
    const container = document.getElementById('powerBIContainer');
    container.innerHTML = `
        <div class="d-flex align-items-center justify-content-center h-100">
            <div class="text-center">
                <div class="spinner-border text-primary mb-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="text-muted">Loading ${titles[reportType]}...</p>
            </div>
        </div>
    `;
    
    // Simulate loading delay
    setTimeout(() => {
        container.innerHTML = generateMockReport(reportType);
    }, 2000);
}

function generateMockReport(reportType) {
    const reports = {
        'fleet-overview': `
            <div class="p-4">
                <div class="row mb-4">
                    <div class="col-md-3">
                        <div class="card bg-primary text-white">
                            <div class="card-body text-center">
                                <h3>25</h3>
                                <p>Total Vehicles</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card bg-success text-white">
                            <div class="card-body text-center">
                                <h3>92%</h3>
                                <p>Fleet Utilization</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card bg-warning text-white">
                            <div class="card-body text-center">
                                <h3>1,245</h3>
                                <p>Total Trips</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card bg-info text-white">
                            <div class="card-body text-center">
                                <h3>₹2.5L</h3>
                                <p>Revenue Today</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <canvas id="fleetUtilizationChart" width="400" height="200"></canvas>
                    </div>
                    <div class="col-md-6">
                        <canvas id="revenueChart" width="400" height="200"></canvas>
                    </div>
                </div>
            </div>
        `,
        'dispatch-performance': `
            <div class="p-4">
                <div class="row mb-4">
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body text-center">
                                <h3 class="text-success">98.5%</h3>
                                <p>On-Time Delivery</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body text-center">
                                <h3 class="text-primary">15 min</h3>
                                <p>Avg Dispatch Time</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body text-center">
                                <h3 class="text-warning">156</h3>
                                <p>Orders Today</p>
                            </div>
                        </div>
                    </div>
                </div>
                <canvas id="dispatchChart" width="800" height="300"></canvas>
            </div>
        `,
        'fuel-analysis': `
            <div class="p-4">
                <div class="row mb-4">
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body text-center">
                                <h3>12.5 L/100km</h3>
                                <p>Avg Fuel Consumption</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body text-center">
                                <h3>₹85,000</h3>
                                <p>Monthly Fuel Cost</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body text-center">
                                <h3>-8%</h3>
                                <p>Cost Reduction</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body text-center">
                                <h3>2,450 L</h3>
                                <p>Total Consumption</p>
                            </div>
                        </div>
                    </div>
                </div>
                <canvas id="fuelChart" width="800" height="300"></canvas>
            </div>
        `,
        'driver-performance': `
            <div class="p-4">
                <div class="row mb-4">
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body text-center">
                                <h3>4.8/5</h3>
                                <p>Avg Driver Rating</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body text-center">
                                <h3>95%</h3>
                                <p>Safety Score</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body text-center">
                                <h3>8.2 hrs</h3>
                                <p>Avg Drive Time</p>
                            </div>
                        </div>
                    </div>
                </div>
                <canvas id="driverChart" width="800" height="300"></canvas>
            </div>
        `
    };
    
    return reports[reportType] || reports['fleet-overview'];
}

function updateRealTimeMetrics() {
    const metrics = [
        { label: 'Active Vehicles', value: '18', change: '+2', positive: true },
        { label: 'Completed Trips', value: '45', change: '+12', positive: true },
        { label: 'Fuel Efficiency', value: '12.8 L/100km', change: '-0.3', positive: true },
        { label: 'Revenue Today', value: '₹2,45,000', change: '+15%', positive: true },
        { label: 'Avg Speed', value: '42 km/h', change: '+3', positive: true }
    ];
    
    const container = document.getElementById('realTimeMetrics');
    container.innerHTML = metrics.map(metric => `
        <div class="metric-item">
            <div>
                <div class="metric-value">${metric.value}</div>
                <div class="metric-label">${metric.label}</div>
            </div>
            <div class="metric-change ${metric.positive ? 'positive' : 'negative'}">
                ${metric.change}
            </div>
        </div>
    `).join('');
}

function initializeCharts() {
    // Performance Chart
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        new Chart(performanceCtx, {
            type: 'doughnut',
            data: {
                labels: ['On Time', 'Delayed', 'Cancelled'],
                datasets: [{
                    data: [85, 12, 3],
                    backgroundColor: ['#28a745', '#ffc107', '#dc3545']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
    
    // Trends Chart
    const trendsCtx = document.getElementById('trendsChart');
    if (trendsCtx) {
        new Chart(trendsCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Trips',
                    data: [45, 52, 48, 61, 55, 67, 43],
                    borderColor: '#007bff',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

function refreshReport() {
    loadReport(currentReport);
    showNotification('Report refreshed', 'success');
}

function exportReport() {
    showNotification('Report export started', 'info');
    // Simulate export process
    setTimeout(() => {
        showNotification('Report exported successfully', 'success');
    }, 2000);
}

function fullscreenReport() {
    const container = document.getElementById('powerBIContainer');
    if (container.requestFullscreen) {
        container.requestFullscreen();
    }
}

// Utility Functions
function startRealTimeUpdates() {
    setInterval(() => {
        // Update dashboard metrics
        updateDashboard();
        
        // Update real-time metrics
        updateRealTimeMetrics();
        
        // Simulate trip progress updates
        sampleData.trips.forEach(trip => {
            if (trip.status === 'in-transit' && trip.progress < 100) {
                trip.progress = Math.min(100, trip.progress + Math.random() * 5);
                if (trip.progress >= 100) {
                    trip.status = 'completed';
                }
            }
        });
        
        updateActiveTrips();
    }, 10000); // Update every 10 seconds
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

function trackTrip(tripId) {
    const trip = sampleData.trips.find(t => t.id === tripId);
    if (trip) {
        const vehicle = sampleData.vehicles.find(v => v.id === trip.vehicle);
        if (vehicle) {
            showSection('tracking');
            setTimeout(() => {
                focusVehicle(vehicle.id);
            }, 500);
        }
    }
}

function updateTripStatus(tripId, status) {
    const trip = sampleData.trips.find(t => t.id === tripId);
    if (trip) {
        trip.status = status;
        if (status === 'completed') {
            trip.progress = 100;
            showNotification(`Trip ${tripId} marked as completed. Use workflow buttons to progress to delivery and sign-off steps.`, 'success');
        }
        updateActiveTrips();
        updateDashboard();
        showNotification(`Trip ${tripId} status updated to ${status}`, 'info');
    }
}

function createOrder() {
    // Focus on order form
    document.getElementById('customerName').focus();
}

function assignOrder(orderId) {
    // Show assignment section
    showNotification(`Please assign vehicle and driver for order ${orderId}`, 'info');
}

function viewOrderDetails(orderId) {
    const order = sampleData.orders.find(o => o.id === orderId);
    if (order) {
        alert(`Order Details:\n\nID: ${order.id}\nCustomer: ${order.customer}\nRoute: ${order.pickup} → ${order.delivery}\nPriority: ${order.priority}\nStatus: ${order.status}`);
    }
}

function createTrip() {
    showNotification('New trip creation form would open here', 'info');
}

// Vehicle Management Functions
function addVehicle() {
    showNotification('Add vehicle form would open here', 'info');
}

function handleVehicleSubmission(event) {
    event.preventDefault();
    
    const vehicleData = {
        number: document.getElementById('vehicleNumber').value,
        type: document.getElementById('vehicleType').value,
        capacity: document.getElementById('vehicleCapacity').value,
        capacityUnit: document.getElementById('capacityUnit').value,
        insurancePolicy: document.getElementById('insurancePolicy').value,
        insuranceExpiry: document.getElementById('insuranceExpiry').value,
        insuranceProvider: document.getElementById('insuranceProvider').value,
        status: document.getElementById('vehicleStatus').value
    };
    
    // Add to sample data (in real app, this would be an API call)
    const newVehicle = {
        id: 'V' + String(Date.now()).slice(-3),
        number: vehicleData.number,
        type: vehicleData.type,
        capacity: vehicleData.capacity + ' ' + vehicleData.capacityUnit,
        insurance: {
            policy: vehicleData.insurancePolicy,
            provider: vehicleData.insuranceProvider,
            expiry: vehicleData.insuranceExpiry
        },
        status: vehicleData.status,
        driver: null,
        lat: 13.0827 + (Math.random() - 0.5) * 0.1,
        lng: 80.2707 + (Math.random() - 0.5) * 0.1,
        speed: 0
    };
    
    sampleData.vehicles.push(newVehicle);
    
    // Update UI
    updateVehicleTable();
    updateDashboard();
    
    // Reset form
    event.target.reset();
    
    showNotification(`Vehicle ${vehicleData.number} added successfully!`, 'success');
}

function updateVehicleTable() {
    const tableBody = document.getElementById('vehicleTable');
    
    tableBody.innerHTML = sampleData.vehicles.map(vehicle => {
        const statusClass = {
            'available': 'success',
            'maintenance': 'warning', 
            'inactive': 'secondary',
            'out-of-service': 'danger'
        }[vehicle.status] || 'secondary';
        
        const typeClass = {
            'truck': 'primary',
            'van': 'info',
            'car': 'secondary',
            'bus': 'warning',
            'motorcycle': 'dark',
            'trailer': 'success'
        }[vehicle.type] || 'secondary';
        
        const insuranceExpiry = vehicle.insurance?.expiry || '2024-12-31';
        const isExpiringSoon = new Date(insuranceExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const isExpired = new Date(insuranceExpiry) < new Date();
        
        return `
            <tr>
                <td><strong>${vehicle.number}</strong></td>
                <td><span class="badge bg-${typeClass}">${vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}</span></td>
                <td>${vehicle.capacity || 'N/A'}</td>
                <td>
                    <small>
                        <strong>Policy:</strong> ${vehicle.insurance?.policy || 'N/A'}<br>
                        <strong>Provider:</strong> ${vehicle.insurance?.provider || 'N/A'}<br>
                        <strong>Expires:</strong> 
                        <span class="${isExpired ? 'text-danger' : isExpiringSoon ? 'text-warning' : ''}">
                            ${insuranceExpiry}
                        </span>
                    </small>
                </td>
                <td><span class="badge bg-${statusClass}">${vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1).replace('-', ' ')}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editVehicle('${vehicle.number}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-info" onclick="viewVehicle('${vehicle.number}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteVehicle('${vehicle.number}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function editVehicle(vehicleNumber) {
    const vehicle = sampleData.vehicles.find(v => v.number === vehicleNumber);
    if (vehicle) {
        // Pre-fill form with vehicle data
        document.getElementById('vehicleNumber').value = vehicle.number;
        document.getElementById('vehicleType').value = vehicle.type;
        
        // Extract capacity and unit
        const capacityParts = vehicle.capacity?.split(' ') || ['', ''];
        document.getElementById('vehicleCapacity').value = capacityParts[0] || '';
        document.getElementById('capacityUnit').value = capacityParts[1] || 'kg';
        
        document.getElementById('insurancePolicy').value = vehicle.insurance?.policy || '';
        document.getElementById('insuranceExpiry').value = vehicle.insurance?.expiry || '';
        document.getElementById('insuranceProvider').value = vehicle.insurance?.provider || '';
        document.getElementById('vehicleStatus').value = vehicle.status;
        
        // Change modal title and button text for editing
        document.querySelector('#addVehicleModal .modal-title').innerHTML = '<i class="fas fa-edit"></i> Edit Vehicle';
        document.querySelector('#addVehicleModal button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Update Vehicle';
        
        // Show the modal
        new bootstrap.Modal(document.getElementById('addVehicleModal')).show();
        
        showNotification(`Editing vehicle ${vehicleNumber}`, 'info');
    }
}

function viewVehicle(vehicleNumber) {
    const vehicle = sampleData.vehicles.find(v => v.number === vehicleNumber);
    if (!vehicle) return;
    
    const insuranceExpiry = vehicle.insurance?.expiry || 'N/A';
    const isExpiringSoon = new Date(insuranceExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const isExpired = new Date(insuranceExpiry) < new Date();
    
    const content = `
        <div class="row">
            <div class="col-md-6">
                <h6><i class="fas fa-truck"></i> Vehicle Information</h6>
                <table class="table table-borderless">
                    <tr><td><strong>Vehicle Number:</strong></td><td>${vehicle.number}</td></tr>
                    <tr><td><strong>Type:</strong></td><td><span class="badge bg-primary">${vehicle.type.toUpperCase()}</span></td></tr>
                    <tr><td><strong>Capacity:</strong></td><td>${vehicle.capacity || 'N/A'}</td></tr>
                    <tr><td><strong>Status:</strong></td><td><span class="badge bg-${vehicle.status === 'active' ? 'success' : vehicle.status === 'maintenance' ? 'warning' : 'danger'}">${vehicle.status.toUpperCase().replace('-', ' ')}</span></td></tr>
                    <tr><td><strong>Current Driver:</strong></td><td>${vehicle.driver || 'Not assigned'}</td></tr>
                </table>
            </div>
            <div class="col-md-6">
                <h6><i class="fas fa-shield-alt"></i> Insurance Information</h6>
                <table class="table table-borderless">
                    <tr><td><strong>Policy Number:</strong></td><td>${vehicle.insurance?.policy || 'N/A'}</td></tr>
                    <tr><td><strong>Provider:</strong></td><td>${vehicle.insurance?.provider || 'N/A'}</td></tr>
                    <tr>
                        <td><strong>Expiry Date:</strong></td>
                        <td>
                            <span class="${isExpired ? 'text-danger' : isExpiringSoon ? 'text-warning' : 'text-success'}">
                                ${insuranceExpiry}
                                ${isExpired ? ' (EXPIRED)' : isExpiringSoon ? ' (EXPIRING SOON)' : ''}
                            </span>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12">
                <h6><i class="fas fa-map-marker-alt"></i> Current Location</h6>
                <table class="table table-borderless">
                    <tr><td><strong>Latitude:</strong></td><td>${vehicle.lat?.toFixed(6) || 'N/A'}</td></tr>
                    <tr><td><strong>Longitude:</strong></td><td>${vehicle.lng?.toFixed(6) || 'N/A'}</td></tr>
                    <tr><td><strong>Current Speed:</strong></td><td>${vehicle.speed || 0} km/h</td></tr>
                    <tr><td><strong>Last Updated:</strong></td><td>${new Date().toLocaleString()}</td></tr>
                </table>
            </div>
        </div>
    `;
    
    document.getElementById('vehicleDetailsContent').innerHTML = content;
    new bootstrap.Modal(document.getElementById('vehicleDetailsModal')).show();
}

function deleteVehicle(vehicleNumber) {
    if (confirm(`Are you sure you want to delete vehicle ${vehicleNumber}?`)) {
        const index = sampleData.vehicles.findIndex(v => v.number === vehicleNumber);
        if (index > -1) {
            sampleData.vehicles.splice(index, 1);
            updateVehicleTable();
            updateDashboard();
            showNotification(`Vehicle ${vehicleNumber} deleted successfully`, 'success');
        }
    }
}

function exportVehicles() {
    showNotification('Exporting vehicle data...', 'info');
    // Simulate export process
    setTimeout(() => {
        showNotification('Vehicle data exported successfully', 'success');
    }, 1500);
}

function refreshVehicles() {
    updateVehicleTable();
    showNotification('Vehicle list refreshed', 'success');
}

function editCurrentVehicle() {
    // Close modal and focus on form
    bootstrap.Modal.getInstance(document.getElementById('vehicleDetailsModal')).hide();
    showNotification('Edit the vehicle details in the form', 'info');
}

// Driver Management Functions  
function addDriver() {
    showNotification('Add driver form would open here', 'info');
}

function handleDriverSubmission(event) {
    event.preventDefault();
    
    const driverData = {
        name: document.getElementById('driverName').value,
        licenseNumber: document.getElementById('licenseNumber').value,
        licenseType: document.getElementById('licenseType').value,
        licenseExpiry: document.getElementById('licenseExpiry').value,
        phone: document.getElementById('phoneNumber').value,
        email: document.getElementById('emailAddress').value,
        address: document.getElementById('driverAddress').value,
        experience: document.getElementById('experience').value,
        availability: document.getElementById('availability').value,
        assignedVehicle: document.getElementById('assignedVehicle').value
    };
    
    // Add to sample data (in real app, this would be an API call)
    const newDriver = {
        id: 'D' + String(Date.now()).slice(-3),
        name: driverData.name,
        licenseNumber: driverData.licenseNumber,
        licenseType: driverData.licenseType,
        licenseExpiry: driverData.licenseExpiry,
        phone: driverData.phone,
        email: driverData.email,
        address: driverData.address,
        experience: parseInt(driverData.experience),
        availability: driverData.availability,
        assignedVehicle: driverData.assignedVehicle || null,
        joinDate: new Date().toISOString().split('T')[0]
    };
    
    sampleData.drivers.push(newDriver);
    
    // Update assigned vehicle if selected
    if (driverData.assignedVehicle) {
        const vehicle = sampleData.vehicles.find(v => v.number === driverData.assignedVehicle);
        if (vehicle) {
            vehicle.driver = driverData.name;
        }
    }
    
    // Update UI
    updateDriverTable();
    populateVehicleDropdown();
    updateDashboard();
    
    // Reset form
    event.target.reset();
    
    showNotification(`Driver ${driverData.name} added successfully!`, 'success');
}

function updateDriverTable() {
    const tableBody = document.getElementById('driverTable');
    
    tableBody.innerHTML = sampleData.drivers.map(driver => {
        const availabilityClass = {
            'available': 'success',
            'on-duty': 'warning',
            'off-duty': 'secondary',
            'on-leave': 'info',
            'suspended': 'danger'
        }[driver.availability] || 'secondary';
        
        const licenseTypeClass = {
            'LMV': 'info',
            'HMV': 'primary',
            'MCWG': 'success',
            'MCWOG': 'success',
            'PSV': 'warning',
            'HGMV': 'primary'
        }[driver.licenseType] || 'secondary';
        
        const isLicenseExpiringSoon = new Date(driver.licenseExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const isLicenseExpired = new Date(driver.licenseExpiry) < new Date();
        
        const assignedVehicle = sampleData.vehicles.find(v => v.driver === driver.name);
        const vehicleInfo = assignedVehicle ? 
            `<span class="badge bg-primary">${assignedVehicle.number}</span><br><small class="text-muted">${assignedVehicle.type}</small>` :
            '<span class="text-muted">No Vehicle</span>';
        
        const avatarColors = ['primary', 'success', 'warning', 'info', 'danger'];
        const avatarColor = avatarColors[Math.abs(driver.name.charCodeAt(0)) % avatarColors.length];
        
        return `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="driver-avatar me-2">
                            <i class="fas fa-user-circle fa-2x text-${avatarColor}"></i>
                        </div>
                        <div>
                            <strong>${driver.name}</strong><br>
                            <small class="text-muted">${driver.experience} years exp.</small>
                        </div>
                    </div>
                </td>
                <td>
                    <small>
                        <strong>License:</strong> ${driver.licenseNumber}<br>
                        <strong>Type:</strong> <span class="badge bg-${licenseTypeClass}">${driver.licenseType}</span><br>
                        <strong>Expires:</strong> 
                        <span class="${isLicenseExpired ? 'text-danger' : isLicenseExpiringSoon ? 'text-warning' : ''}">
                            ${driver.licenseExpiry}
                        </span>
                    </small>
                </td>
                <td>
                    <small>
                        <strong>Phone:</strong> ${driver.phone}<br>
                        <strong>Email:</strong> ${driver.email}<br>
                        <strong>Address:</strong> ${driver.address.substring(0, 20)}...
                    </small>
                </td>
                <td><span class="badge bg-${availabilityClass}">${driver.availability.charAt(0).toUpperCase() + driver.availability.slice(1).replace('-', ' ')}</span></td>
                <td>${vehicleInfo}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editDriver('${driver.licenseNumber}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-info" onclick="viewDriver('${driver.licenseNumber}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteDriver('${driver.licenseNumber}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function populateVehicleDropdown() {
    const dropdown = document.getElementById('assignedVehicle');
    const availableVehicles = sampleData.vehicles.filter(v => !v.driver || v.driver === null);
    
    dropdown.innerHTML = '<option value="">No Vehicle Assigned</option>' +
        availableVehicles.map(vehicle => 
            `<option value="${vehicle.number}">${vehicle.number} - ${vehicle.type.toUpperCase()}</option>`
        ).join('');
}

function editDriver(licenseNumber) {
    const driver = sampleData.drivers.find(d => d.licenseNumber === licenseNumber);
    if (driver) {
        // Pre-fill form with driver data
        document.getElementById('driverName').value = driver.name;
        document.getElementById('licenseNumber').value = driver.licenseNumber;
        document.getElementById('licenseType').value = driver.licenseType;
        document.getElementById('licenseExpiry').value = driver.licenseExpiry;
        document.getElementById('phoneNumber').value = driver.phone;
        document.getElementById('emailAddress').value = driver.email;
        document.getElementById('driverAddress').value = driver.address;
        document.getElementById('experience').value = driver.experience;
        document.getElementById('availability').value = driver.availability;
        
        // Set assigned vehicle
        const assignedVehicle = sampleData.vehicles.find(v => v.driver === driver.name);
        document.getElementById('assignedVehicle').value = assignedVehicle ? assignedVehicle.number : '';
        
        // Change modal title and button text for editing
        document.querySelector('#addDriverModal .modal-title').innerHTML = '<i class="fas fa-edit"></i> Edit Driver';
        document.querySelector('#addDriverModal button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Update Driver';
        
        // Show the modal
        new bootstrap.Modal(document.getElementById('addDriverModal')).show();
        
        showNotification(`Editing driver ${driver.name}`, 'info');
    }
}

function viewDriver(licenseNumber) {
    const driver = sampleData.drivers.find(d => d.licenseNumber === licenseNumber);
    if (!driver) return;
    
    const isLicenseExpiringSoon = new Date(driver.licenseExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const isLicenseExpired = new Date(driver.licenseExpiry) < new Date();
    
    const assignedVehicle = sampleData.vehicles.find(v => v.driver === driver.name);
    
    const content = `
        <div class="row">
            <div class="col-md-6">
                <h6><i class="fas fa-user"></i> Personal Information</h6>
                <table class="table table-borderless">
                    <tr><td><strong>Full Name:</strong></td><td>${driver.name}</td></tr>
                    <tr><td><strong>Phone:</strong></td><td>${driver.phone}</td></tr>
                    <tr><td><strong>Email:</strong></td><td>${driver.email}</td></tr>
                    <tr><td><strong>Address:</strong></td><td>${driver.address}</td></tr>
                    <tr><td><strong>Experience:</strong></td><td>${driver.experience} years</td></tr>
                    <tr><td><strong>Join Date:</strong></td><td>${driver.joinDate || 'N/A'}</td></tr>
                </table>
            </div>
            <div class="col-md-6">
                <h6><i class="fas fa-id-card"></i> License Information</h6>
                <table class="table table-borderless">
                    <tr><td><strong>License Number:</strong></td><td>${driver.licenseNumber}</td></tr>
                    <tr><td><strong>License Type:</strong></td><td><span class="badge bg-info">${driver.licenseType}</span></td></tr>
                    <tr>
                        <td><strong>Expiry Date:</strong></td>
                        <td>
                            <span class="${isLicenseExpired ? 'text-danger' : isLicenseExpiringSoon ? 'text-warning' : 'text-success'}">
                                ${driver.licenseExpiry}
                                ${isLicenseExpired ? ' (EXPIRED)' : isLicenseExpiringSoon ? ' (EXPIRING SOON)' : ''}
                            </span>
                        </td>
                    </tr>
                    <tr><td><strong>Availability:</strong></td><td><span class="badge bg-${driver.availability === 'available' ? 'success' : driver.availability === 'on-duty' ? 'warning' : 'secondary'}">${driver.availability.toUpperCase().replace('-', ' ')}</span></td></tr>
                </table>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12">
                <h6><i class="fas fa-truck"></i> Vehicle Assignment</h6>
                <table class="table table-borderless">
                    <tr>
                        <td><strong>Assigned Vehicle:</strong></td>
                        <td>
                            ${assignedVehicle ? 
                                `<span class="badge bg-primary">${assignedVehicle.number}</span> - ${assignedVehicle.type.toUpperCase()}` : 
                                '<span class="text-muted">No vehicle assigned</span>'
                            }
                        </td>
                    </tr>
                    ${assignedVehicle ? `
                        <tr><td><strong>Vehicle Type:</strong></td><td>${assignedVehicle.type}</td></tr>
                        <tr><td><strong>Vehicle Capacity:</strong></td><td>${assignedVehicle.capacity}</td></tr>
                        <tr><td><strong>Vehicle Status:</strong></td><td><span class="badge bg-${assignedVehicle.status === 'active' ? 'success' : 'warning'}">${assignedVehicle.status.toUpperCase()}</span></td></tr>
                    ` : ''}
                </table>
            </div>
        </div>
    `;
    
    document.getElementById('driverDetailsContent').innerHTML = content;
    new bootstrap.Modal(document.getElementById('driverDetailsModal')).show();
}

function deleteDriver(licenseNumber) {
    const driver = sampleData.drivers.find(d => d.licenseNumber === licenseNumber);
    if (driver && confirm(`Are you sure you want to delete driver ${driver.name}?`)) {
        // Remove driver from assigned vehicle
        const assignedVehicle = sampleData.vehicles.find(v => v.driver === driver.name);
        if (assignedVehicle) {
            assignedVehicle.driver = null;
        }
        
        // Remove driver from array
        const index = sampleData.drivers.findIndex(d => d.licenseNumber === licenseNumber);
        if (index > -1) {
            sampleData.drivers.splice(index, 1);
            updateDriverTable();
            populateVehicleDropdown();
            updateDashboard();
            showNotification(`Driver ${driver.name} deleted successfully`, 'success');
        }
    }
}

function exportDrivers() {
    showNotification('Exporting driver data...', 'info');
    // Simulate export process
    setTimeout(() => {
        showNotification('Driver data exported successfully', 'success');
    }, 1500);
}

function refreshDrivers() {
    updateDriverTable();
    showNotification('Driver list refreshed', 'success');
}

function editCurrentDriver() {
    // Close modal and focus on form
    bootstrap.Modal.getInstance(document.getElementById('driverDetailsModal')).hide();
    showNotification('Edit the driver details in the form', 'info');
}

// Route Management Functions
function handleRouteSubmission(event) {
    event.preventDefault();
    
    const routeData = {
        name: document.getElementById('routeName').value,
        code: document.getElementById('routeCode').value,
        source: document.getElementById('sourceLocation').value,
        destination: document.getElementById('destinationLocation').value,
        distance: parseFloat(document.getElementById('routeDistance').value),
        hours: parseInt(document.getElementById('estimatedHours').value),
        minutes: parseInt(document.getElementById('estimatedMinutes').value),
        type: document.getElementById('routeType').value,
        tollCost: parseFloat(document.getElementById('tollCost').value) || 0,
        fuelCost: parseFloat(document.getElementById('fuelCost').value) || 0,
        status: document.getElementById('routeStatus').value
    };
    
    // Calculate total time in minutes
    const totalMinutes = (routeData.hours * 60) + routeData.minutes;
    const avgSpeed = Math.round((routeData.distance / (totalMinutes / 60)) * 10) / 10;
    
    // Add to sample data (in real app, this would be an API call)
    const newRoute = {
        id: 'R' + String(Date.now()).slice(-3),
        name: routeData.name,
        code: routeData.code,
        source: routeData.source,
        destination: routeData.destination,
        distance: routeData.distance,
        estimatedTime: {
            hours: routeData.hours,
            minutes: routeData.minutes,
            total: totalMinutes
        },
        type: routeData.type,
        tollCost: routeData.tollCost,
        fuelCost: routeData.fuelCost,
        totalCost: routeData.tollCost + routeData.fuelCost,
        avgSpeed: avgSpeed,
        status: routeData.status,
        createdDate: new Date().toISOString().split('T')[0]
    };
    
    sampleData.routes.push(newRoute);
    
    // Update UI
    updateRouteTable();
    updateDashboard();
    
    // Reset form
    event.target.reset();
    
    showNotification(`Route ${routeData.code} added successfully!`, 'success');
}

function updateRouteTable() {
    const tableBody = document.getElementById('routeTable');
    
    // Update route statistics first
    updateRouteStatistics();
    
    tableBody.innerHTML = sampleData.routes.map(route => {
        const statusClass = {
            'active': 'success',
            'inactive': 'secondary',
            'under-construction': 'warning',
            'seasonal': 'info'
        }[route.status] || 'secondary';
        
        const typeClass = {
            'highway': 'info',
            'city': 'primary',
            'mixed': 'warning',
            'rural': 'success'
        }[route.type] || 'secondary';
        
        const timeDisplay = `${route.estimatedTime.hours}h ${route.estimatedTime.minutes}m`;
        
        return `
            <tr>
                <td>
                    <div>
                        <strong>${route.code}</strong><br>
                        <small class="text-muted">${route.name}</small><br>
                        <span class="badge bg-${typeClass}">${route.type.charAt(0).toUpperCase() + route.type.slice(1)}</span>
                    </div>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <i class="fas fa-map-marker-alt text-success me-2"></i>
                        <div>
                            <strong>${route.source}</strong><br>
                            <small class="text-muted">Source</small>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <i class="fas fa-flag-checkered text-danger me-2"></i>
                        <div>
                            <strong>${route.destination}</strong><br>
                            <small class="text-muted">Destination</small>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="text-center">
                        <strong>${route.distance} km</strong><br>
                        <small class="text-muted">
                            <i class="fas fa-rupee-sign"></i> ₹${route.totalCost.toLocaleString()} cost
                        </small>
                    </div>
                </td>
                <td>
                    <div class="text-center">
                        <strong>${timeDisplay}</strong><br>
                        <small class="text-muted">
                            <i class="fas fa-tachometer-alt"></i> ${route.avgSpeed} km/h avg
                        </small>
                    </div>
                </td>
                <td><span class="badge bg-${statusClass}">${route.status.charAt(0).toUpperCase() + route.status.slice(1).replace('-', ' ')}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editRoute('${route.code}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-info" onclick="viewRoute('${route.code}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-success" onclick="mapRoute('${route.code}')">
                        <i class="fas fa-map"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteRoute('${route.code}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function editRoute(routeCode) {
    const route = sampleData.routes.find(r => r.code === routeCode);
    if (route) {
        // Pre-fill form with route data
        document.getElementById('routeName').value = route.name;
        document.getElementById('routeCode').value = route.code;
        document.getElementById('sourceLocation').value = route.source;
        document.getElementById('destinationLocation').value = route.destination;
        document.getElementById('routeDistance').value = route.distance;
        document.getElementById('estimatedHours').value = route.estimatedTime.hours;
        document.getElementById('estimatedMinutes').value = route.estimatedTime.minutes;
        document.getElementById('routeType').value = route.type;
        document.getElementById('tollCost').value = route.tollCost;
        document.getElementById('fuelCost').value = route.fuelCost;
        document.getElementById('routeStatus').value = route.status;
        
        // Change modal title and button text for editing
        document.querySelector('#addRouteModal .modal-title').innerHTML = '<i class="fas fa-edit"></i> Edit Route';
        document.querySelector('#addRouteModal button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Update Route';
        
        // Show the modal
        new bootstrap.Modal(document.getElementById('addRouteModal')).show();
        
        showNotification(`Editing route ${routeCode}`, 'info');
    }
}

function viewRoute(routeCode) {
    const route = sampleData.routes.find(r => r.code === routeCode);
    if (!route) return;
    
    const content = `
        <div class="row">
            <div class="col-md-6">
                <h6><i class="fas fa-info-circle"></i> Route Information</h6>
                <table class="table table-borderless">
                    <tr><td><strong>Route Code:</strong></td><td>${route.code}</td></tr>
                    <tr><td><strong>Route Name:</strong></td><td>${route.name}</td></tr>
                    <tr><td><strong>Route Type:</strong></td><td><span class="badge bg-info">${route.type.toUpperCase()}</span></td></tr>
                    <tr><td><strong>Status:</strong></td><td><span class="badge bg-${route.status === 'active' ? 'success' : 'secondary'}">${route.status.toUpperCase().replace('-', ' ')}</span></td></tr>
                    <tr><td><strong>Created Date:</strong></td><td>${route.createdDate}</td></tr>
                </table>
            </div>
            <div class="col-md-6">
                <h6><i class="fas fa-route"></i> Route Details</h6>
                <table class="table table-borderless">
                    <tr><td><strong>Distance:</strong></td><td>${route.distance} km</td></tr>
                    <tr><td><strong>Estimated Time:</strong></td><td>${route.estimatedTime.hours}h ${route.estimatedTime.minutes}m</td></tr>
                    <tr><td><strong>Average Speed:</strong></td><td>${route.avgSpeed} km/h</td></tr>
                    <tr><td><strong>Total Cost:</strong></td><td>₹${route.totalCost.toLocaleString()}</td></tr>
                </table>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-md-6">
                <h6><i class="fas fa-map-marker-alt"></i> Locations</h6>
                <table class="table table-borderless">
                    <tr>
                        <td><i class="fas fa-map-marker-alt text-success"></i> <strong>Source:</strong></td>
                        <td>${route.source}</td>
                    </tr>
                    <tr>
                        <td><i class="fas fa-flag-checkered text-danger"></i> <strong>Destination:</strong></td>
                        <td>${route.destination}</td>
                    </tr>
                </table>
            </div>
            <div class="col-md-6">
                <h6><i class="fas fa-rupee-sign"></i> Cost Breakdown</h6>
                <table class="table table-borderless">
                    <tr><td><strong>Toll Cost:</strong></td><td>₹${route.tollCost.toLocaleString()}</td></tr>
                    <tr><td><strong>Fuel Cost:</strong></td><td>₹${route.fuelCost.toLocaleString()}</td></tr>
                    <tr><td><strong>Total Cost:</strong></td><td><strong>₹${route.totalCost.toLocaleString()}</strong></td></tr>
                    <tr><td><strong>Cost per km:</strong></td><td>₹${(route.totalCost / route.distance).toFixed(2)}</td></tr>
                </table>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12">
                <h6><i class="fas fa-chart-line"></i> Route Analytics</h6>
                <div class="row">
                    <div class="col-md-3">
                        <div class="card bg-primary text-white">
                            <div class="card-body text-center">
                                <h5>${route.distance} km</h5>
                                <small>Total Distance</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card bg-success text-white">
                            <div class="card-body text-center">
                                <h5>${route.estimatedTime.hours}h ${route.estimatedTime.minutes}m</h5>
                                <small>Travel Time</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card bg-warning text-white">
                            <div class="card-body text-center">
                                <h5>${route.avgSpeed} km/h</h5>
                                <small>Avg Speed</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card bg-info text-white">
                            <div class="card-body text-center">
                                <h5>₹${route.totalCost}</h5>
                                <small>Total Cost</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('routeDetailsContent').innerHTML = content;
    new bootstrap.Modal(document.getElementById('routeDetailsModal')).show();
}

function mapRoute(routeCode) {
    const route = sampleData.routes.find(r => r.code === routeCode);
    if (route) {
        showNotification(`Opening map for route ${routeCode}: ${route.source} to ${route.destination}`, 'info');
        // In a real application, this would open a map view with the route plotted
        showSection('tracking');
    }
}

function deleteRoute(routeCode) {
    const route = sampleData.routes.find(r => r.code === routeCode);
    if (route && confirm(`Are you sure you want to delete route ${routeCode}?`)) {
        const index = sampleData.routes.findIndex(r => r.code === routeCode);
        if (index > -1) {
            sampleData.routes.splice(index, 1);
            updateRouteTable();
            updateDashboard();
            showNotification(`Route ${routeCode} deleted successfully`, 'success');
        }
    }
}

function exportRoutes() {
    showNotification('Exporting route data...', 'info');
    // Simulate export process
    setTimeout(() => {
        showNotification('Route data exported successfully', 'success');
    }, 1500);
}

function refreshRoutes() {
    updateRouteTable();
    showNotification('Route list refreshed', 'success');
}

function optimizeRoutes() {
    showNotification('Optimizing routes for better efficiency...', 'info');
    // Simulate route optimization
    setTimeout(() => {
        showNotification('Routes optimized successfully! Average time reduced by 8%', 'success');
    }, 3000);
}

function mapCurrentRoute() {
    // Close modal and show tracking section
    bootstrap.Modal.getInstance(document.getElementById('routeDetailsModal')).hide();
    showSection('tracking');
    showNotification('Route displayed on map', 'success');
}

function editCurrentRoute() {
    // Close modal and focus on form
    bootstrap.Modal.getInstance(document.getElementById('routeDetailsModal')).hide();
    showNotification('Edit the route details in the form', 'info');
}

// Fuel Management Functions
function addFuelRecord() {
    showNotification('Add fuel record form would open here', 'info');
}

// Trip Management Functions
function handleTripSubmission(event) {
    event.preventDefault();
    
    const tripData = {
        vehicleId: document.getElementById('tripVehicle').value,
        driverId: document.getElementById('tripDriver').value,
        routeId: document.getElementById('tripRoute').value,
        startTime: document.getElementById('tripStartTime').value,
        endTime: document.getElementById('tripEndTime').value,
        status: document.getElementById('tripStatus').value,
        purpose: document.getElementById('tripPurpose').value,
        notes: document.getElementById('tripNotes').value
    };
    
    // Find related data
    const vehicle = sampleData.vehicles.find(v => v.id === tripData.vehicleId);
    const driver = sampleData.drivers.find(d => d.id === tripData.driverId);
    const route = sampleData.routes.find(r => r.id === tripData.routeId);
    
    if (!vehicle || !driver || !route) {
        showNotification('Please select valid vehicle, driver, and route', 'error');
        return;
    }
    
    // Create new trip
    const newTrip = {
        id: 'TRP' + String(Date.now()).slice(-3),
        vehicle: tripData.vehicleId,
        driver: driver.name,
        route: `${route.source} - ${route.destination}`,
        status: tripData.status,
        progress: tripData.status === 'in-progress' ? 25 : 0,
        startTime: tripData.startTime,
        endTime: tripData.endTime,
        purpose: tripData.purpose,
        notes: tripData.notes,
        createdAt: new Date().toISOString()
    };
    
    sampleData.trips.push(newTrip);
    
    // Update driver availability
    if (tripData.status === 'in-progress') {
        driver.availability = 'on-duty';
    }
    
    // Update UI
    updateActiveTrips();
    updateAvailableResources();
    updateDashboard();
    
    // Reset form
    event.target.reset();
    
    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('addTripModal')).hide();
    
    showNotification(`Trip ${newTrip.id} created successfully!`, 'success');
}

function editTrip(tripId) {
    const trip = sampleData.trips.find(t => t.id === tripId);
    if (trip) {
        // Pre-fill form with trip data
        const vehicle = sampleData.vehicles.find(v => v.id === trip.vehicle);
        const driver = sampleData.drivers.find(d => d.name === trip.driver);
        
        if (vehicle) document.getElementById('tripVehicle').value = vehicle.id;
        if (driver) document.getElementById('tripDriver').value = driver.id;
        document.getElementById('tripStartTime').value = trip.startTime || '';
        document.getElementById('tripEndTime').value = trip.endTime || '';
        document.getElementById('tripStatus').value = trip.status || 'scheduled';
        document.getElementById('tripPurpose').value = trip.purpose || 'delivery';
        document.getElementById('tripNotes').value = trip.notes || '';
        
        // Change modal title and button text for editing
        document.querySelector('#addTripModal .modal-title').innerHTML = '<i class="fas fa-edit"></i> Edit Trip';
        document.querySelector('#addTripModal button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Update Trip';
        
        // Show the modal
        new bootstrap.Modal(document.getElementById('addTripModal')).show();
        
        showNotification(`Editing trip ${tripId}`, 'info');
    }
}

function viewTrip(tripId) {
    showNotification(`Viewing trip details for ${tripId}`, 'info');
}

function cancelTrip(tripId) {
    if (confirm(`Are you sure you want to cancel trip ${tripId}?`)) {
        showNotification(`Trip ${tripId} cancelled`, 'warning');
    }
}

function startTrip(tripId) {
    showNotification(`Trip ${tripId} started`, 'success');
}

function generateReport(tripId) {
    showNotification(`Generating report for trip ${tripId}`, 'info');
}

function exportTrips() {
    showNotification('Exporting trip data...', 'info');
}

function refreshTrips() {
    showNotification('Trip list refreshed', 'success');
}

function trackCurrentTrip() {
    showSection('tracking');
    showNotification('Trip tracking displayed on map', 'success');
}

function editCurrentTrip() {
    showNotification('Edit the trip details in the form', 'info');
}

// Order Management Functions
function createNewOrder() {
    showNotification('Create new order form would open here', 'info');
}

function editOrder(orderId) {
    showNotification(`Editing order ${orderId}`, 'info');
}

function viewOrder(orderId) {
    showNotification(`Viewing order details for ${orderId}`, 'info');
}

function trackOrder(orderId) {
    showSection('tracking');
    showNotification(`Tracking order ${orderId} on map`, 'success');
}

function assignOrder(orderId) {
    showNotification(`Assigning vehicle/driver to order ${orderId}`, 'info');
}

function generateInvoice(orderId) {
    showNotification(`Generating invoice for order ${orderId}`, 'info');
}

function exportOrders() {
    showNotification('Exporting order data...', 'info');
}

function refreshOrders() {
    showNotification('Order list refreshed', 'success');
}

// User Management Functions
function createNewUser() {
    showNotification('Create new user form would open here', 'info');
}

function editUser(userId) {
    showNotification(`Editing user ${userId}`, 'info');
}

function viewUser(userId) {
    showNotification(`Viewing user details for ${userId}`, 'info');
}

function exportUsers() {
    showNotification('Exporting user data...', 'info');
}

function refreshUsers() {
    showNotification('User list refreshed', 'success');
}

// Modal Reset Functions
function resetVehicleModal() {
    document.querySelector('#addVehicleModal .modal-title').innerHTML = '<i class="fas fa-plus"></i> Add New Vehicle';
    document.querySelector('#addVehicleModal button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Add Vehicle';
    document.getElementById('vehicleForm').reset();
}

function resetDriverModal() {
    document.querySelector('#addDriverModal .modal-title').innerHTML = '<i class="fas fa-user-plus"></i> Add New Driver';
    document.querySelector('#addDriverModal button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Add Driver';
    document.getElementById('driverForm').reset();
    populateVehicleDropdown();
}

function resetRouteModal() {
    document.querySelector('#addRouteModal .modal-title').innerHTML = '<i class="fas fa-plus"></i> Add New Route';
    document.querySelector('#addRouteModal button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Add Route';
    document.getElementById('routeForm').reset();
}

function resetTripModal() {
    document.querySelector('#addTripModal .modal-title').innerHTML = '<i class="fas fa-plus"></i> Create New Trip';
    document.querySelector('#addTripModal button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Create Trip';
    document.getElementById('tripForm').reset();
    populateTripDropdowns();
}

// Populate dropdown functions
function populateTripDropdowns() {
    // Populate vehicle dropdown
    const vehicleSelect = document.getElementById('tripVehicle');
    if (vehicleSelect) {
        const availableVehicles = sampleData.vehicles.filter(v => v.status === 'available');
        vehicleSelect.innerHTML = '<option value="">Select Vehicle</option>' +
            availableVehicles.map(vehicle => 
                `<option value="${vehicle.id}">${vehicle.number} - ${vehicle.type.toUpperCase()}</option>`
            ).join('');
    }
    
    // Populate driver dropdown
    const driverSelect = document.getElementById('tripDriver');
    if (driverSelect) {
        const availableDrivers = sampleData.drivers.filter(d => d.availability === 'available');
        driverSelect.innerHTML = '<option value="">Select Driver</option>' +
            availableDrivers.map(driver => 
                `<option value="${driver.id}">${driver.name} - ${driver.licenseType}</option>`
            ).join('');
    }
    
    // Populate route dropdown
    const routeSelect = document.getElementById('tripRoute');
    if (routeSelect) {
        const activeRoutes = sampleData.routes.filter(r => r.status === 'active');
        routeSelect.innerHTML = '<option value="">Select Route</option>' +
            activeRoutes.map(route => 
                `<option value="${route.id}">${route.code} - ${route.name}</option>`
            ).join('');
    }
}

console.log('Fleet Management System JavaScript loaded successfully');
// Enhanced Dispatch Management Functions

// 5️⃣ Live Tracking Functions
function initializeDispatchMap() {
    const mapContainer = document.getElementById('dispatchMap');
    mapContainer.innerHTML = `
        <div class="live-tracking-active p-3">
            <div class="row">
                <div class="col-md-8">
                    <div class="map-simulation bg-primary text-white p-3 rounded">
                        <h6><i class="fas fa-map"></i> Live Vehicle Tracking</h6>
                        <div class="vehicle-positions">
                            <div class="vehicle-marker animate-pulse">
                                <i class="fas fa-truck"></i> TN01AB1234 - Hosur (65%)
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="tracking-controls">
                        <button class="btn btn-success btn-sm mb-2 w-100" onclick="updateVehicleLocation()">
                            <i class="fas fa-sync"></i> Update Location
                        </button>
                        <button class="btn btn-warning btn-sm w-100" onclick="showTrafficAlerts()">
                            <i class="fas fa-exclamation-triangle"></i> Traffic Alerts
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    showNotification('Live tracking initialized', 'success');
}

function updateVehicleLocation() {
    const progressBar = document.querySelector('#liveVehicleStatus .progress-bar');
    const currentProgress = parseInt(progressBar.style.width) || 65;
    const newProgress = Math.min(100, currentProgress + 5);
    
    progressBar.style.width = newProgress + '%';
    progressBar.textContent = newProgress + '%';
    
    // Update location text
    const locations = ['Hosur', 'Electronic City', 'Silk Board', 'Koramangala', 'Bangalore Hub'];
    const locationIndex = Math.floor(newProgress / 25);
    const locationText = locations[Math.min(locationIndex, locations.length - 1)];
    
    document.querySelector('#liveVehicleStatus small').innerHTML = 
        `📍 Current: ${locationText} (${newProgress}% complete)`;
    
    showNotification(`Vehicle location updated: ${locationText}`, 'info');
}

function showTrafficAlerts() {
    const alertsContainer = document.getElementById('delayAlerts');
    const alerts = [
        'Traffic jam detected: +10 min delay',
        'Road construction: Alternative route suggested',
        'Weather alert: Heavy rain expected'
    ];
    
    const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
    alertsContainer.innerHTML = `
        <div class="alert alert-warning alert-sm">
            <i class="fas fa-exclamation-triangle"></i> ${randomAlert}
        </div>
    `;
    showNotification('Traffic alert updated', 'warning');
}
// 6️⃣ Status Updates Functions
function updateDeliveryStatus(status) {
    const statusItems = document.querySelectorAll('.status-item');
    
    if (status === 'delivered') {
        statusItems.forEach(item => {
            item.classList.add('completed');
            const icon = item.querySelector('.status-icon');
            icon.className = 'status-icon bg-success';
            icon.innerHTML = '<i class="fas fa-check"></i>';
        });
        showNotification('Order marked as delivered successfully!', 'success');
        
        // Trigger POD form
        setTimeout(() => {
            showNotification('Please complete Proof of Delivery', 'info');
        }, 1000);
        
    } else if (status === 'failed') {
        const lastItem = statusItems[statusItems.length - 1];
        lastItem.classList.add('completed');
        const icon = lastItem.querySelector('.status-icon');
        icon.className = 'status-icon bg-danger';
        icon.innerHTML = '<i class="fas fa-times"></i>';
        lastItem.querySelector('h6').textContent = 'Failed Delivery ✔';
        lastItem.querySelector('small').textContent = 'Delivery attempt failed';
        
        showNotification('Delivery marked as failed. Please reschedule.', 'warning');
    }
}

// 7️⃣ Proof of Delivery Functions
function captureSignature() {
    const signaturePad = document.querySelector('.signature-pad');
    signaturePad.innerHTML = `
        <div class="signature-captured p-2">
            <i class="fas fa-check-circle fa-2x text-success mb-2"></i>
            <p class="text-success mb-0">Signature Captured ✔</p>
            <small class="text-muted">Customer: John Smith</small>
        </div>
    `;
    showNotification('Customer signature captured successfully', 'success');
}

function uploadDeliveryPhoto(input) {
    if (input.files && input.files[0]) {
        const photoUpload = document.querySelector('.photo-upload');
        photoUpload.innerHTML = `
            <div class="photo-uploaded p-2">
                <i class="fas fa-check-circle fa-2x text-success mb-2"></i>
                <p class="text-success mb-0">Photo Uploaded ✔</p>
                <small class="text-muted">${input.files[0].name}</small>
            </div>
        `;
        showNotification('Delivery photo uploaded successfully', 'success');
    }
}

function submitPOD() {
    const deliveryTime = document.getElementById('deliveryTime').value;
    
    // Simulate POD submission
    showNotification('Submitting Proof of Delivery...', 'info');
    
    setTimeout(() => {
        showNotification('Proof of Delivery submitted successfully!', 'success');
        
        // Update workflow to completed
        const workflowSteps = document.querySelectorAll('.example-step');
        workflowSteps.forEach(step => {
            step.classList.remove('active', 'pending');
            step.classList.add('completed');
        });
        
        // Generate completion report
        setTimeout(() => {
            showNotification('Delivery report generated and sent to customer', 'info');
        }, 2000);
        
    }, 1500);
}
// 8️⃣ Alerts & Notifications Functions
function sendCustomNotification() {
    const notifications = [
        { type: 'info', message: 'Driver break time reminder sent', icon: 'fas fa-coffee' },
        { type: 'warning', message: 'Vehicle maintenance due alert sent', icon: 'fas fa-wrench' },
        { type: 'success', message: 'Customer delivery update sent', icon: 'fas fa-envelope' }
    ];
    
    const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
    
    showNotification(randomNotification.message, randomNotification.type);
    
    // Add to notification list
    const notificationContainer = document.querySelector('.card-body');
    const newNotification = document.createElement('div');
    newNotification.className = `notification-item bg-${randomNotification.type === 'info' ? 'info' : randomNotification.type === 'warning' ? 'warning' : 'success'} text-white p-2 rounded mb-2`;
    newNotification.innerHTML = `
        <i class="${randomNotification.icon}"></i> ${randomNotification.message}<br>
        <small>Just now</small>
    `;
    
    notificationContainer.insertBefore(newNotification, notificationContainer.lastElementChild);
}

// 9️⃣ Dispatch Reports Functions
function generateDispatchReport() {
    showNotification('Generating dispatch report...', 'info');
    
    setTimeout(() => {
        const reportData = {
            totalOrders: 156,
            completedOrders: 142,
            pendingOrders: 14,
            onTimeDelivery: '98.5%',
            avgDeliveryTime: '4.2 hours',
            customerSatisfaction: '4.8/5'
        };
        
        showNotification('Dispatch report generated successfully', 'success');
        
        // Simulate opening report
        setTimeout(() => {
            alert(`Dispatch Report Summary:
            
📊 Total Orders: ${reportData.totalOrders}
✅ Completed: ${reportData.completedOrders}
⏳ Pending: ${reportData.pendingOrders}
🎯 On-Time Delivery: ${reportData.onTimeDelivery}
⏱️ Avg Delivery Time: ${reportData.avgDeliveryTime}
⭐ Customer Satisfaction: ${reportData.customerSatisfaction}

Report saved to: dispatch_report_${new Date().toISOString().split('T')[0]}.pdf`);
        }, 1000);
        
    }, 2000);
}

function generatePerformanceReport() {
    showNotification('Analyzing delivery performance...', 'info');
    
    setTimeout(() => {
        showNotification('Performance report ready: 98.5% on-time delivery rate', 'success');
    }, 1500);
}

function generateDelayAnalysis() {
    showNotification('Analyzing delay patterns...', 'info');
    
    setTimeout(() => {
        const delayReasons = [
            'Traffic congestion: 45%',
            'Weather conditions: 25%',
            'Vehicle breakdown: 15%',
            'Customer unavailable: 10%',
            'Other: 5%'
        ];
        
        showNotification('Delay analysis complete', 'success');
        
        setTimeout(() => {
            alert(`Delay Analysis Report:

Main causes of delivery delays:
• ${delayReasons.join('\n• ')}

Recommendations:
✓ Implement dynamic routing
✓ Weather monitoring system
✓ Preventive maintenance schedule
✓ Customer communication improvements`);
        }, 1000);
        
    }, 2000);
}

function exportDispatchData() {
    showNotification('Preparing dispatch data export...', 'info');
    
    setTimeout(() => {
        showNotification('Dispatch data exported to Excel successfully', 'success');
    }, 1500);
}
// Manual Workflow Control Functions - Removed duplicate function

function viewWorkflowDetails() {
    const workflowDetails = `
Complete Dispatch Management Workflow:

1️⃣ ORDER MANAGEMENT
   • Customer places order via portal/phone
   • Order details captured (pickup, delivery, items)
   • Priority level assigned
   • Order enters pending queue

2️⃣ ASSIGNMENT (Vehicle & Driver Allocation)
   • System checks available vehicles
   • Matches vehicle capacity with order requirements
   • Assigns qualified driver based on license type
   • Confirms availability and creates assignment

3️⃣ DISPATCH PLANNING
   • Optimal route selection using GPS data
   • Delivery schedule optimization
   • Load planning and weight distribution
   • Priority order sequencing

4️⃣ TRIP CREATION
   • Generate unique trip ID
   • Link order to trip
   • Assign vehicle and driver
   • Set estimated start/end times

5️⃣ LIVE TRACKING
   • Real-time GPS monitoring
   • Delivery progress updates
   • Traffic and delay alerts
   • ETA calculations

6️⃣ STATUS UPDATES
   • Dispatched → In Transit → Out for Delivery → Delivered
   • Automatic customer notifications
   • Failed delivery handling and rescheduling

7️⃣ PROOF OF DELIVERY (POD)
   • Customer signature capture
   • Delivery photo documentation
   • Timestamp recording
   • Digital receipt generation

8️⃣ ALERTS & NOTIFICATIONS
   • Driver mobile notifications
   • Customer SMS/email updates
   • Delay and exception alerts
   • Management dashboard alerts

9️⃣ REPORTS & ANALYTICS
   • Dispatch performance metrics
   • Delivery success rates
   • Delay analysis and trends
   • Customer satisfaction tracking

🔄 WORKFLOW INTEGRATION
All modules work together seamlessly to ensure efficient, trackable, and customer-focused delivery operations.
    `;
    
    alert(workflowDetails);
}

// Enhanced Dispatch Planning Functions
function createDispatchPlan() {
    const routeSelection = document.getElementById('routeSelection').value;
    const deliverySchedule = document.getElementById('deliverySchedule').value;
    const loadWeight = document.getElementById('loadWeight').value;
    const loadVolume = document.getElementById('loadVolume').value;
    const priorityLevel = document.getElementById('priorityLevel').value;
    
    if (!routeSelection || !deliverySchedule) {
        showNotification('Please fill in all required fields', 'warning');
        return;
    }
    
    showNotification('Creating dispatch plan...', 'info');
    
    setTimeout(() => {
        // Update trip creation form
        document.getElementById('generatedTripId').value = 'TRP' + String(Date.now()).slice(-6);
        document.getElementById('linkedOrderId').value = 'ORD001';
        
        // Update assigned resources display
        const selectedVehicle = document.querySelector('.resource-item.selected[data-vehicle-id]');
        const selectedDriver = document.querySelector('.resource-item.selected[data-driver-id]');
        
        if (selectedVehicle && selectedDriver) {
            const vehicleText = selectedVehicle.querySelector('.resource-info strong').textContent;
            const driverText = selectedDriver.querySelector('.resource-info strong').textContent;
            
            document.getElementById('assignedVehicleDisplay').textContent = vehicleText;
            document.getElementById('assignedDriverDisplay').textContent = driverText;
        }
        
        showNotification('Dispatch plan created successfully!', 'success');
    }, 1500);
}

function createTripFromOrder() {
    const tripId = document.getElementById('generatedTripId').value;
    const orderId = document.getElementById('linkedOrderId').value;
    const startTime = document.getElementById('tripStartTime').value;
    
    if (!tripId || !orderId || !startTime) {
        showNotification('Please complete all trip details', 'warning');
        return;
    }
    
    showNotification('Creating trip and dispatching...', 'info');
    
    setTimeout(() => {
        // Add to active trips
        const newTrip = {
            id: tripId,
            vehicle: 'TN01AB1234',
            driver: 'John Doe',
            route: 'Chennai → Bangalore',
            status: 'dispatched',
            progress: 0
        };
        
        sampleData.trips.push(newTrip);
        updateActiveTrips();
        
        // Update workflow step
        const workflowSteps = document.querySelectorAll('.step');
        workflowSteps[3].classList.add('active'); // Dispatch step
        
        showNotification('Trip created and dispatched successfully!', 'success');
        
        // Auto-start live tracking
        setTimeout(() => {
            initializeDispatchMap();
        }, 2000);
        
    }, 1500);
}

// Enhanced Resource Selection
function selectResource(type, id) {
    // Remove previous selections of the same type
    document.querySelectorAll(`.resource-item[data-${type}-id]`).forEach(item => {
        item.classList.remove('selected');
    });
    
    // Add selection to clicked item
    const item = document.querySelector(`[data-${type}-id="${id}"]`);
    if (item) {
        item.classList.add('selected');
        
        // Update selection display
        const resourceName = item.querySelector('.resource-info strong').textContent;
        if (type === 'vehicle') {
            document.getElementById('selectedVehicle').textContent = resourceName;
        } else if (type === 'driver') {
            document.getElementById('selectedDriver').textContent = resourceName;
        }
        
        showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} ${resourceName} selected`, 'info');
    }
}

function checkAvailability() {
    showNotification('Checking resource availability...', 'info');
    
    setTimeout(() => {
        const availableCount = document.querySelectorAll('.resource-item').length;
        showNotification(`${availableCount} resources available for assignment`, 'success');
    }, 1000);
}

console.log('Enhanced Dispatch Management System loaded successfully');

// Alert Management Functions
function initializeAlertsSection() {
    console.log('Alerts section initialized');
    updateActiveAlerts();
}

function resolveAlert(alertId) {
    if (confirm('Are you sure you want to resolve this alert?')) {
        // Find and remove the alert element
        const alertElement = document.querySelector(`[onclick="resolveAlert('${alertId}')"]`).closest('.alert');
        if (alertElement) {
            alertElement.style.transition = 'opacity 0.3s ease';
            alertElement.style.opacity = '0';
            setTimeout(() => {
                alertElement.remove();
                showNotification('Alert resolved successfully', 'success');
            }, 300);
        }
    }
}

function acknowledgeAlert(alertId) {
    // Find and update the alert element
    const alertElement = document.querySelector(`[onclick="acknowledgeAlert('${alertId}')"]`).closest('.alert');
    if (alertElement) {
        alertElement.style.opacity = '0.6';
        const button = alertElement.querySelector('button');
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.classList.remove('btn-outline-dark');
        button.classList.add('btn-success');
        button.disabled = true;
        showNotification('Alert acknowledged', 'info');
    }
}

function updateActiveAlerts() {
    // This function can be called to refresh the alerts display
    console.log('Active alerts updated');
}

// Notification Settings Functions
function saveNotificationSettings() {
    const settings = {
        emailNotifications: document.getElementById('emailNotifications').checked,
        smsNotifications: document.getElementById('smsNotifications').checked,
        delayAlerts: document.getElementById('delayAlerts').checked,
        deliveryConfirmations: document.getElementById('deliveryConfirmations').checked,
        driverNotifications: document.getElementById('driverNotifications').checked,
        maintenanceAlerts: document.getElementById('maintenanceAlerts').checked
    };
    
    // Save to localStorage (in a real app, this would be saved to a database)
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    showNotification('Notification settings saved successfully', 'success');
}

// GPS Tracking Enhancement Functions
function toggleTrafficLayer() {
    showNotification('Traffic layer toggled', 'info');
    // In a real implementation, this would toggle traffic overlay on the map
}

function centerAllVehicles() {
    if (map && Object.keys(vehicleMarkers).length > 0) {
        const group = new L.featureGroup(Object.values(vehicleMarkers));
        map.fitBounds(group.getBounds().pad(0.1));
        showNotification('Map centered on all vehicles', 'info');
    }
}

function filterVehicles() {
    const typeFilter = document.getElementById('vehicleTypeFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    sampleData.vehicles.forEach(vehicle => {
        const marker = vehicleMarkers[vehicle.id];
        if (marker) {
            let showMarker = true;
            
            if (typeFilter !== 'all' && vehicle.type !== typeFilter) {
                showMarker = false;
            }
            
            if (statusFilter !== 'all' && vehicle.status !== statusFilter) {
                showMarker = false;
            }
            
            if (showMarker) {
                marker.addTo(map);
            } else {
                map.removeLayer(marker);
            }
        }
    });
    
    showNotification(`Vehicles filtered by ${typeFilter} type and ${statusFilter} status`, 'info');
}

// Enhanced GPS tracking with better error handling
function addVehicleMarkers() {
    if (!map) {
        console.warn('Map not initialized, cannot add vehicle markers');
        return;
    }
    
    // Clear existing markers
    Object.values(vehicleMarkers).forEach(marker => {
        map.removeLayer(marker);
    });
    vehicleMarkers = {};
    
    sampleData.vehicles.forEach(vehicle => {
        if (vehicle.lat && vehicle.lng) {
            const icon = L.divIcon({
                className: 'vehicle-marker',
                html: `<i class="fas fa-truck" style="color: white; font-size: 12px;"></i>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });
            
            const marker = L.marker([vehicle.lat, vehicle.lng], { icon })
                .addTo(map)
                .bindPopup(`
                    <div>
                        <h6>${vehicle.number}</h6>
                        <p><strong>Driver:</strong> ${vehicle.driver || 'Not assigned'}</p>
                        <p><strong>Status:</strong> ${vehicle.status}</p>
                        <p><strong>Speed:</strong> ${vehicle.speed || 0} km/h</p>
                        <button class="btn btn-sm btn-primary" onclick="showVehicleDetails('${vehicle.id}')">
                            View Details
                        </button>
                    </div>
                `);
            
            vehicleMarkers[vehicle.id] = marker;
            
            // Add moving animation for available vehicles
            if (vehicle.status === 'available' && vehicle.speed > 0) {
                marker.getElement().classList.add('moving');
            }
        }
    });
    
    console.log(`Added ${Object.keys(vehicleMarkers).length} vehicle markers to map`);
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userId');
        localStorage.removeItem('loginTime');
        window.location.href = 'login.html';
    }
}

// Alert Notifications Functions
function refreshAlerts() {
    showNotification('Alert list refreshed', 'success');
}

function markAllRead() {
    const alerts = document.querySelectorAll('#activeAlertsList .alert');
    alerts.forEach(alert => {
        alert.classList.add('fade');
        setTimeout(() => {
            alert.style.opacity = '0.5';
        }, 100);
    });
    showNotification('All alerts marked as read', 'success');
}

function scheduleMaintenance(vehicleNumber) {
    showNotification(`Scheduling maintenance for vehicle ${vehicleNumber}`, 'info');
    // In a real application, this would open a maintenance scheduling form
}

function snoozeAlert(button) {
    const alert = button.closest('.alert');
    alert.style.opacity = '0.5';
    showNotification('Alert snoozed for 1 hour', 'info');
}

function emergencyResponse(vehicleNumber) {
    if (confirm(`Initiate emergency response for vehicle ${vehicleNumber}?`)) {
        showNotification(`Emergency response initiated for ${vehicleNumber}`, 'danger');
        // In a real application, this would trigger emergency protocols
    }
}

function contactDriver(vehicleNumber) {
    showNotification(`Calling driver of vehicle ${vehicleNumber}...`, 'info');
    // In a real application, this would initiate a call
}

function updateCustomer(tripId) {
    showNotification(`Customer notification sent for trip ${tripId}`, 'success');
}

function findAlternateRoute(tripId) {
    showNotification(`Finding alternate route for trip ${tripId}...`, 'info');
    setTimeout(() => {
        showNotification('Alternate route found - 15 minutes faster!', 'success');
    }, 2000);
}

function findFuelStation(vehicleNumber) {
    showNotification(`Finding nearest fuel station for ${vehicleNumber}...`, 'info');
    setTimeout(() => {
        showNotification('Nearest station: Indian Oil - 3.2 km away', 'success');
    }, 1500);
}

function notifyDriver(vehicleNumber) {
    showNotification(`Driver of ${vehicleNumber} notified about fuel alert`, 'success');
}

function viewMaintenanceReport(vehicleNumber) {
    showNotification(`Opening maintenance report for ${vehicleNumber}`, 'info');
}

function updateVehicleStatus(vehicleNumber, status) {
    showNotification(`Vehicle ${vehicleNumber} status updated to ${status}`, 'success');
}

function initializeAlertsSection() {
    // Initialize alert settings form
    const alertForm = document.getElementById('alertSettings');
    if (alertForm) {
        alertForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Alert settings saved successfully', 'success');
        });
    }
    
    // Auto-refresh alerts every 30 seconds
    setInterval(() => {
        // In a real application, this would fetch new alerts from the server
        console.log('Auto-refreshing alerts...');
    }, 30000);
}

// Proof of Delivery Functions
function viewProofOfDelivery(orderId) {
    const podDetails = `
Proof of Delivery - ${orderId}

📋 Order Details:
• Customer: ABC Corporation
• Route: Chennai Port → Bangalore Hub
• Delivery Date: 2024-03-15 14:30

✅ Delivery Confirmation:
• Signature: Received by John Smith
• Photo: Delivery confirmation captured
• GPS Location: Verified at destination
• Condition: Goods delivered in good condition

📱 Digital Receipt:
• Receipt ID: POD-${orderId}-20240315
• Driver: John Doe (License: DL123456789)
• Vehicle: TN01AB1234

🔗 Tracking History:
• Dispatched: 08:30 AM
• In Transit: 09:15 AM
• Out for Delivery: 13:45 PM
• Delivered: 14:30 PM
    `;
    
    alert(podDetails);
}

function uploadProofOfDelivery(orderId) {
    showNotification(`Opening POD upload form for order ${orderId}`, 'info');
    
    // Simulate POD upload process
    setTimeout(() => {
        showNotification('POD upload form ready - Please capture signature and photo', 'success');
        
        // In a real application, this would open a modal with:
        // - Signature capture pad
        // - Photo upload functionality
        // - Delivery notes field
        // - Submit button
    }, 1000);
}
// Enhanced Dispatch Workflow Functions
function startDispatchWorkflow() {
    showNotification('Starting comprehensive dispatch workflow...', 'info');
    
    // Step 1: Show order creation
    const orderModal = new bootstrap.Modal(document.getElementById('createOrderModal'));
    orderModal.show();
}

function createDispatchOrder() {
    const orderData = {
        id: 'ORD' + String(Date.now()).slice(-3),
        customer: document.getElementById('dispatchCustomer').value,
        pickup: document.getElementById('dispatchPickup').value,
        delivery: document.getElementById('dispatchDelivery').value,
        priority: document.getElementById('dispatchPriority').value,
        weight: document.getElementById('dispatchWeight').value,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    // Add to orders
    sampleData.orders.push(orderData);
    
    // Close order modal and show assignment modal
    bootstrap.Modal.getInstance(document.getElementById('createOrderModal')).hide();
    
    setTimeout(() => {
        showVehicleDriverAssignment(orderData);
    }, 500);
}

function showVehicleDriverAssignment(order) {
    // Populate assignment modal with order details
    document.getElementById('assignmentOrderId').textContent = order.id;
    document.getElementById('assignmentCustomer').textContent = order.customer;
    document.getElementById('assignmentRoute').textContent = `${order.pickup} → ${order.delivery}`;
    
    // Populate available vehicles
    const availableVehicles = sampleData.vehicles.filter(v => v.status === 'active' && !isVehicleAssigned(v.id));
    const vehicleSelect = document.getElementById('assignVehicleSelect');
    vehicleSelect.innerHTML = '<option value="">Select Vehicle</option>';
    
    availableVehicles.forEach(vehicle => {
        const option = document.createElement('option');
        option.value = vehicle.id;
        option.textContent = `${vehicle.number} (${vehicle.type} - ${vehicle.capacity})`;
        vehicleSelect.appendChild(option);
    });
    
    // Populate available drivers
    const availableDrivers = sampleData.drivers.filter(d => d.availability === 'available');
    const driverSelect = document.getElementById('assignDriverSelect');
    driverSelect.innerHTML = '<option value="">Select Driver</option>';
    
    availableDrivers.forEach(driver => {
        const option = document.createElement('option');
        option.value = driver.id;
        option.textContent = `${driver.name} (${driver.licenseType} - ${driver.experience}y exp)`;
        driverSelect.appendChild(option);
    });
    
    // Show assignment modal
    const assignmentModal = new bootstrap.Modal(document.getElementById('vehicleDriverAssignmentModal'));
    assignmentModal.show();
    
    // Store order data for later use
    window.currentDispatchOrder = order;
}

function completeAssignment() {
    const vehicleId = document.getElementById('assignVehicleSelect').value;
    const driverId = document.getElementById('assignDriverSelect').value;
    const routeId = document.getElementById('assignRouteSelect').value;
    
    if (!vehicleId || !driverId || !routeId) {
        showNotification('Please select vehicle, driver, and route', 'warning');
        return;
    }
    
    const vehicle = sampleData.vehicles.find(v => v.id === vehicleId);
    const driver = sampleData.drivers.find(d => d.id === driverId);
    const route = sampleData.routes.find(r => r.id === routeId);
    const order = window.currentDispatchOrder;
    
    // Update order status
    order.status = 'assigned';
    order.assignedVehicle = vehicle.number;
    order.assignedDriver = driver.name;
    order.assignedRoute = route.name;
    
    // Update driver availability
    driver.availability = 'on-duty';
    
    // Create trip
    const trip = {
        id: 'TRP' + String(Date.now()).slice(-3),
        vehicle: vehicleId,
        driver: driver.name,
        route: route.name,
        status: 'scheduled',
        progress: 0,
        orderId: order.id,
        startTime: document.getElementById('tripStartTime').value,
        estimatedEndTime: calculateEstimatedEndTime(document.getElementById('tripStartTime').value, route.estimatedTime.total)
    };
    
    sampleData.trips.push(trip);
    
    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('vehicleDriverAssignmentModal')).hide();
    
    // Show success and dispatch confirmation
    showNotification(`Order ${order.id} successfully assigned to ${vehicle.number} with driver ${driver.name}`, 'success');
    
    setTimeout(() => {
        showDispatchConfirmation(trip);
    }, 1000);
    
    // Update all displays
    updateDashboard();
    updatePendingOrders();
    updateActiveTrips();
    updateAvailableResources();
}

function showDispatchConfirmation(trip) {
    const confirmationModal = new bootstrap.Modal(document.getElementById('dispatchConfirmationModal'));
    
    // Populate confirmation details
    document.getElementById('confirmTripId').textContent = trip.id;
    document.getElementById('confirmVehicle').textContent = sampleData.vehicles.find(v => v.id === trip.vehicle).number;
    document.getElementById('confirmDriver').textContent = trip.driver;
    document.getElementById('confirmRoute').textContent = trip.route;
    document.getElementById('confirmStartTime').textContent = trip.startTime;
    document.getElementById('confirmEstimatedEnd').textContent = trip.estimatedEndTime;
    
    confirmationModal.show();
}

function dispatchTrip() {
    const trip = sampleData.trips[sampleData.trips.length - 1]; // Get the latest trip
    trip.status = 'in-transit';
    trip.progress = 5; // Started
    
    // Update driver status
    const driver = sampleData.drivers.find(d => d.name === trip.driver);
    if (driver) {
        driver.availability = 'on-duty';
    }
    
    // Close confirmation modal
    bootstrap.Modal.getInstance(document.getElementById('dispatchConfirmationModal')).hide();
    
    showNotification(`Trip ${trip.id} dispatched successfully! Live tracking activated.`, 'success');
    
    // Update displays
    updateDashboard();
    updateActiveTrips();
    
    // Show tracking option
    setTimeout(() => {
        if (confirm('Would you like to view live tracking for this trip?')) {
            showSection('tracking');
        }
    }, 2000);
}

function calculateEstimatedEndTime(startTime, durationMinutes) {
    const start = new Date(`2024-03-15 ${startTime}`);
    const end = new Date(start.getTime() + durationMinutes * 60000);
    return end.toTimeString().slice(0, 5);
}

// Modal form handlers
function handleVehicleSubmission(event) {
    event.preventDefault();
    
    const vehicleData = {
        number: document.getElementById('vehicleNumber').value,
        type: document.getElementById('vehicleType').value,
        capacity: document.getElementById('vehicleCapacity').value,
        capacityUnit: document.getElementById('capacityUnit').value,
        insurancePolicy: document.getElementById('insurancePolicy').value,
        insuranceExpiry: document.getElementById('insuranceExpiry').value,
        insuranceProvider: document.getElementById('insuranceProvider').value,
        status: document.getElementById('vehicleStatus').value
    };
    
    // Add to sample data
    const newVehicle = {
        id: 'V' + String(Date.now()).slice(-3),
        number: vehicleData.number,
        type: vehicleData.type,
        capacity: vehicleData.capacity + ' ' + vehicleData.capacityUnit,
        insurance: {
            policy: vehicleData.insurancePolicy,
            provider: vehicleData.insuranceProvider,
            expiry: vehicleData.insuranceExpiry
        },
        status: vehicleData.status,
        driver: null,
        lat: 13.0827 + (Math.random() - 0.5) * 0.1,
        lng: 80.2707 + (Math.random() - 0.5) * 0.1,
        speed: 0
    };
    
    sampleData.vehicles.push(newVehicle);
    
    // Update UI
    updateVehicleTable();
    updateDashboard();
    
    // Close modal and reset form
    bootstrap.Modal.getInstance(document.getElementById('addVehicleModal')).hide();
    event.target.reset();
    
    showNotification(`Vehicle ${vehicleData.number} added successfully!`, 'success');
}

function handleDriverSubmission(event) {
    event.preventDefault();
    
    const driverData = {
        name: document.getElementById('driverName').value,
        licenseNumber: document.getElementById('licenseNumber').value,
        licenseType: document.getElementById('licenseType').value,
        licenseExpiry: document.getElementById('licenseExpiry').value,
        phone: document.getElementById('phoneNumber').value,
        email: document.getElementById('emailAddress').value,
        address: document.getElementById('driverAddress').value,
        experience: document.getElementById('experience').value,
        availability: document.getElementById('availability').value,
        assignedVehicle: document.getElementById('assignedVehicle').value
    };
    
    // Add to sample data
    const newDriver = {
        id: 'D' + String(Date.now()).slice(-3),
        name: driverData.name,
        licenseNumber: driverData.licenseNumber,
        licenseType: driverData.licenseType,
        licenseExpiry: driverData.licenseExpiry,
        phone: driverData.phone,
        email: driverData.email,
        address: driverData.address,
        experience: parseInt(driverData.experience),
        availability: driverData.availability,
        assignedVehicle: driverData.assignedVehicle || null,
        joinDate: new Date().toISOString().split('T')[0]
    };
    
    sampleData.drivers.push(newDriver);
    
    // Update assigned vehicle if selected
    if (driverData.assignedVehicle) {
        const vehicle = sampleData.vehicles.find(v => v.number === driverData.assignedVehicle);
        if (vehicle) {
            vehicle.driver = driverData.name;
        }
    }
    
    // Update UI
    updateDriverTable();
    populateVehicleDropdown();
    updateDashboard();
    
    // Close modal and reset form
    bootstrap.Modal.getInstance(document.getElementById('addDriverModal')).hide();
    event.target.reset();
    
    showNotification(`Driver ${driverData.name} added successfully!`, 'success');
}

// Reports & Analytics Functions
function generateQuickReport(type) {
    const reportTypes = {
        'daily': 'Daily Operations Report',
        'weekly': 'Weekly Performance Summary', 
        'monthly': 'Monthly Analytics',
        'custom': 'Custom Date Range Report'
    };
    
    showNotification(`Generating ${reportTypes[type]}...`, 'info');
    
    setTimeout(() => {
        showNotification(`${reportTypes[type]} generated successfully!`, 'success');
        
        // Simulate opening report
        if (type === 'custom') {
            const startDate = prompt('Enter start date (YYYY-MM-DD):');
            const endDate = prompt('Enter end date (YYYY-MM-DD):');
            if (startDate && endDate) {
                showNotification(`Custom report for ${startDate} to ${endDate} ready for download`, 'success');
            }
        }
    }, 2000);
}

function exportData(format) {
    const formats = {
        'pdf': 'PDF',
        'excel': 'Excel',
        'csv': 'CSV'
    };
    
    showNotification(`Exporting data to ${formats[format]}...`, 'info');
    
    setTimeout(() => {
        showNotification(`Data exported to ${formats[format]} successfully!`, 'success');
    }, 1500);
}

function scheduleReport() {
    showNotification('Opening report scheduling interface...', 'info');
    
    setTimeout(() => {
        const frequency = prompt('Select frequency:\n1. Daily\n2. Weekly\n3. Monthly\nEnter number:');
        const email = prompt('Enter email address for reports:');
        
        if (frequency && email) {
            const frequencies = ['', 'Daily', 'Weekly', 'Monthly'];
            showNotification(`${frequencies[frequency]} reports scheduled for ${email}`, 'success');
        }
    }, 1000);
}

// Auto-update dashboard when data changes
function updateAllDashboards() {
    updateDashboard();
    
    // Update vehicle stats
    const activeVehicles = sampleData.vehicles.filter(v => v.status === 'active').length;
    const maintenanceVehicles = sampleData.vehicles.filter(v => v.status === 'maintenance').length;
    const outOfServiceVehicles = sampleData.vehicles.filter(v => v.status === 'out-of-service').length;
    
    // Update driver stats  
    const onDutyDrivers = sampleData.drivers.filter(d => d.availability === 'on-duty').length;
    const availableDrivers = sampleData.drivers.filter(d => d.availability === 'available').length;
    const offDutyDrivers = sampleData.drivers.filter(d => d.availability === 'off-duty').length;
    
    // Update trip stats
    const activeTrips = sampleData.trips.filter(t => t.status === 'in-transit').length;
    const completedTrips = sampleData.trips.filter(t => t.status === 'completed').length;
    const scheduledTrips = sampleData.trips.filter(t => t.status === 'scheduled').length;
    
    console.log('Dashboard updated with current data');
}

// Warehouse Management Functions
function handleMaterialSubmission(event) {
    event.preventDefault();
    
    const materialData = {
        code: document.getElementById('materialCode').value,
        name: document.getElementById('materialName').value,
        category: document.getElementById('materialCategory').value,
        description: document.getElementById('materialDescription').value,
        warehouse: document.getElementById('warehouseLocation').value,
        currentStock: parseInt(document.getElementById('currentStock').value),
        unit: document.getElementById('stockUnit').value,
        minStockLevel: parseInt(document.getElementById('minStockLevel').value) || 0,
        status: document.getElementById('materialStatus').value
    };
    
    // Get warehouse name
    const warehouseNames = {
        'chennai-main': 'Chennai Main Warehouse',
        'bangalore-hub': 'Bangalore Hub',
        'coimbatore-depot': 'Coimbatore Depot',
        'madurai-center': 'Madurai Center',
        'trichy-store': 'Trichy Store'
    };
    
    // Add to sample data
    const newMaterial = {
        id: 'MAT' + String(Date.now()).slice(-3),
        code: materialData.code,
        name: materialData.name,
        category: materialData.category,
        description: materialData.description,
        warehouse: materialData.warehouse,
        warehouseName: warehouseNames[materialData.warehouse],
        currentStock: materialData.currentStock,
        unit: materialData.unit,
        minStockLevel: materialData.minStockLevel,
        status: materialData.currentStock <= materialData.minStockLevel ? 'low-stock' : 'available',
        createdDate: new Date().toISOString().split('T')[0]
    };
    
    sampleData.materials.push(newMaterial);
    
    // Update UI
    updateMaterialTable();
    updateDashboard();
    
    // Close modal and reset form
    bootstrap.Modal.getInstance(document.getElementById('addMaterialModal')).hide();
    event.target.reset();
    
    showNotification(`Material ${materialData.name} added successfully!`, 'success');
}

function updateMaterialTable() {
    const tableBody = document.getElementById('materialTable');
    if (!tableBody) return;
    
    // Update warehouse dashboard first
    updateWarehouseDashboard();
    
    tableBody.innerHTML = sampleData.materials.map(material => {
        const categoryClass = {
            'construction': 'primary',
            'building': 'secondary',
            'electrical': 'warning',
            'plumbing': 'info',
            'hardware': 'success'
        }[material.category] || 'secondary';
        
        const statusClass = {
            'available': 'success',
            'low-stock': 'danger',
            'out-of-stock': 'dark',
            'discontinued': 'secondary'
        }[material.status] || 'secondary';
        
        return `
            <tr>
                <td><strong>${material.code}</strong></td>
                <td>${material.name}</td>
                <td><span class="badge bg-${categoryClass}">${material.category.charAt(0).toUpperCase() + material.category.slice(1)}</span></td>
                <td>${material.warehouseName}</td>
                <td>${material.currentStock}</td>
                <td>${material.unit}</td>
                <td><span class="badge bg-${statusClass}">${material.status.charAt(0).toUpperCase() + material.status.slice(1).replace('-', ' ')}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editMaterial('${material.code}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-info" onclick="viewMaterial('${material.code}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${material.status === 'low-stock' ? 
                        `<button class="btn btn-sm btn-outline-success" onclick="requestStock('${material.code}')">
                            <i class="fas fa-plus"></i> Request
                        </button>` :
                        `<button class="btn btn-sm btn-outline-warning" onclick="transferMaterial('${material.code}')">
                            <i class="fas fa-exchange-alt"></i>
                        </button>`
                    }
                </td>
            </tr>
        `;
    }).join('');
}

function editMaterial(materialCode) {
    showNotification(`Editing material ${materialCode}`, 'info');
}

function viewMaterial(materialCode) {
    const material = sampleData.materials.find(m => m.code === materialCode);
    if (material) {
        alert(`Material Details:
        
Code: ${material.code}
Name: ${material.name}
Category: ${material.category}
Warehouse: ${material.warehouseName}
Current Stock: ${material.currentStock} ${material.unit}
Status: ${material.status}
Description: ${material.description || 'N/A'}`);
    }
}

function transferMaterial(materialCode) {
    showNotification(`Initiating transfer for material ${materialCode}`, 'info');
}

function requestStock(materialCode) {
    const material = sampleData.materials.find(m => m.code === materialCode);
    if (material) {
        showNotification(`Stock request initiated for ${material.name}. Checking other warehouses...`, 'info');
        
        setTimeout(() => {
            showNotification(`Found ${material.name} in Bangalore Hub. Transfer request sent.`, 'success');
        }, 2000);
    }
}

function exportMaterials() {
    showNotification('Exporting material data...', 'info');
    setTimeout(() => {
        showNotification('Material data exported successfully', 'success');
    }, 1500);
}

// Update Warehouse Dashboard with Real Data
function updateWarehouseDashboard() {
    // Calculate warehouse statistics from actual data
    const materials = sampleData.materials || [];
    
    // Get unique warehouses
    const warehouses = [...new Set(materials.map(m => m.warehouseName))];
    const totalWarehouses = warehouses.length;
    
    // Calculate total materials
    const totalMaterials = materials.length;
    
    // Calculate low stock items
    const lowStockItems = materials.filter(m => m.status === 'low-stock' || m.currentStock <= m.minStockLevel).length;
    
    // Calculate total stock value (estimated)
    const stockValues = {
        'Satin Laminate': 700,  // ₹700 per sheet
        'Gloss Laminate': 525,  // ₹525 per sheet
        'Matte Laminate': 533   // ₹533 per sheet
    };
    
    const totalStockValue = materials.reduce((total, material) => {
        const unitValue = stockValues[material.name] || 600;
        return total + (material.currentStock * unitValue);
    }, 0);
    
    // Update dashboard elements
    const totalWarehousesEl = document.getElementById('totalWarehouses');
    const totalMaterialsEl = document.getElementById('totalMaterials');
    const lowStockItemsEl = document.getElementById('lowStockItems');
    const totalStockValueEl = document.getElementById('totalStockValue');
    
    if (totalWarehousesEl) totalWarehousesEl.textContent = totalWarehouses;
    if (totalMaterialsEl) totalMaterialsEl.textContent = totalMaterials;
    if (lowStockItemsEl) lowStockItemsEl.textContent = lowStockItems;
    if (totalStockValueEl) totalStockValueEl.textContent = `₹${(totalStockValue / 1000).toFixed(0)}K`;
    
    // Update warehouse details
    updateWarehouseDetails(warehouses, materials);
}

// Update Warehouse Details
function updateWarehouseDetails(warehouses, materials) {
    console.log('Warehouse Details Updated:');
    warehouses.forEach(warehouse => {
        const warehouseMaterials = materials.filter(m => m.warehouseName === warehouse);
        const warehouseStock = warehouseMaterials.reduce((total, m) => total + m.currentStock, 0);
        console.log(`${warehouse}: ${warehouseMaterials.length} materials, Total Stock: ${warehouseStock}`);
    });
}

// Refresh Warehouse Data
function refreshWarehouseData() {
    showNotification('Refreshing warehouse data...', 'info');
    
    // Simulate data refresh
    setTimeout(() => {
        updateWarehouseDashboard();
        updateMaterialTable();
        showNotification('Warehouse data refreshed successfully!', 'success');
        
        // Show updated timestamp
        const now = new Date().toLocaleTimeString();
        console.log(`Warehouse data last updated: ${now}`);
    }, 1000);
}

function refreshMaterials() {
    updateMaterialTable();
    showNotification('Material list refreshed', 'success');
}

function resetMaterialModal() {
    document.querySelector('#addMaterialModal .modal-title').innerHTML = '<i class="fas fa-plus"></i> Add New Material';
    document.querySelector('#addMaterialModal button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Add Material';
    document.getElementById('materialForm').reset();
}

// Order Management Functions
function handleOrderSubmission(event) {
    event.preventDefault();
    
    const orderData = {
        customer: document.getElementById('customerName').value,
        contact: document.getElementById('customerContact').value,
        email: document.getElementById('customerEmail').value,
        deliveryAddress: document.getElementById('deliveryAddress').value,
        materialId: document.getElementById('materialRequired').value,
        quantity: parseInt(document.getElementById('quantityRequired').value),
        priority: document.getElementById('priorityLevel').value,
        requiredDate: document.getElementById('requiredDate').value,
        specialInstructions: document.getElementById('specialInstructions').value
    };
    
    // Find material details
    const material = sampleData.materials.find(m => m.id === orderData.materialId);
    if (!material) {
        showNotification('Please select a valid material', 'error');
        return;
    }
    
    // Generate order ID
    const orderId = 'ORD' + String(Date.now()).slice(-3);
    
    // Add to sample data
    const newOrder = {
        id: orderId,
        customer: orderData.customer,
        material: material.name,
        materialId: orderData.materialId,
        quantity: orderData.quantity,
        unit: material.unit,
        pickup: material.warehouseName,
        delivery: orderData.deliveryAddress,
        priority: orderData.priority,
        status: 'pending',
        createdDate: new Date().toISOString().split('T')[0],
        requiredDate: orderData.requiredDate,
        contact: orderData.contact,
        email: orderData.email,
        specialInstructions: orderData.specialInstructions,
        createdAt: new Date().toISOString()
    };
    
    sampleData.orders.push(newOrder);
    
    // Update UI
    updateOrderTable();
    updateDashboard();
    
    // Close modal and reset form
    bootstrap.Modal.getInstance(document.getElementById('addOrderModal')).hide();
    event.target.reset();
    
    // Auto-generate order ID for next order
    document.getElementById('orderId').value = 'ORD' + String(Date.now() + 1000).slice(-3);
    
    showNotification(`Order ${orderId} created successfully!`, 'success');
    
    // Send WhatsApp and Email notifications
    setTimeout(() => {
        sendWhatsAppNotification(orderData.contact, `Order ${orderId} created successfully. We will process it shortly.`);
        sendEmailNotification(orderData.email, `Order Confirmation - ${orderId}`, `Your order for ${material.name} has been received and is being processed.`);
    }, 1000);
}

function updateOrderTable() {
    const tableBody = document.getElementById('orderTable');
    if (!tableBody) return;
    
    tableBody.innerHTML = sampleData.orders.map(order => {
        const priorityClass = {
            'urgent': 'danger',
            'high': 'warning',
            'normal': 'secondary'
        }[order.priority] || 'secondary';
        
        const statusClass = {
            'pending': 'warning',
            'processing': 'info',
            'completed': 'success',
            'cancelled': 'danger'
        }[order.status] || 'secondary';
        
        return `
            <tr>
                <td><strong>${order.id}</strong></td>
                <td>${order.customer}</td>
                <td>${order.material}</td>
                <td>${order.quantity} ${order.unit}</td>
                <td><span class="badge bg-${priorityClass}">${order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}</span></td>
                <td><span class="badge bg-${statusClass}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                <td>${order.createdDate}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editOrder('${order.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${order.status === 'pending' ? 
                        `<button class="btn btn-sm btn-outline-success" onclick="processOrder('${order.id}')">
                            <i class="fas fa-play"></i> Process
                        </button>` :
                        order.status === 'processing' ?
                        `<button class="btn btn-sm btn-outline-warning" onclick="trackOrder('${order.id}')">
                            <i class="fas fa-map-marker-alt"></i> Track
                        </button>` :
                        `<button class="btn btn-sm btn-outline-success" onclick="generateInvoice('${order.id}')">
                            <i class="fas fa-file-invoice"></i> Invoice
                        </button>`
                    }
                    <button class="btn btn-sm btn-outline-info" onclick="viewOrder('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function filterOrders() {
    const priorityFilter = document.getElementById('priorityFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filteredOrders = sampleData.orders;
    
    if (priorityFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.priority === priorityFilter);
    }
    
    if (statusFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }
    
    // Update table with filtered data
    const tableBody = document.getElementById('orderTable');
    if (!tableBody) return;
    
    tableBody.innerHTML = filteredOrders.map(order => {
        const priorityClass = {
            'urgent': 'danger',
            'high': 'warning',
            'normal': 'secondary'
        }[order.priority] || 'secondary';
        
        const statusClass = {
            'pending': 'warning',
            'processing': 'info',
            'completed': 'success',
            'cancelled': 'danger'
        }[order.status] || 'secondary';
        
        return `
            <tr>
                <td><strong>${order.id}</strong></td>
                <td>${order.customer}</td>
                <td>${order.material}</td>
                <td>${order.quantity} ${order.unit}</td>
                <td><span class="badge bg-${priorityClass}">${order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}</span></td>
                <td><span class="badge bg-${statusClass}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                <td>${order.createdDate}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editOrder('${order.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${order.status === 'pending' ? 
                        `<button class="btn btn-sm btn-outline-success" onclick="processOrder('${order.id}')">
                            <i class="fas fa-play"></i> Process
                        </button>` :
                        order.status === 'processing' ?
                        `<button class="btn btn-sm btn-outline-warning" onclick="trackOrder('${order.id}')">
                            <i class="fas fa-map-marker-alt"></i> Track
                        </button>` :
                        `<button class="btn btn-sm btn-outline-success" onclick="generateInvoice('${order.id}')">
                            <i class="fas fa-file-invoice"></i> Invoice
                        </button>`
                    }
                    <button class="btn btn-sm btn-outline-info" onclick="viewOrder('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    showNotification(`Filtered ${filteredOrders.length} orders`, 'info');
}

function clearFilters() {
    document.getElementById('priorityFilter').value = 'all';
    document.getElementById('statusFilter').value = 'all';
    updateOrderTable();
    showNotification('Filters cleared', 'info');
}

function processOrder(orderId) {
    const order = sampleData.orders.find(o => o.id === orderId);
    if (order) {
        order.status = 'processing';
        updateOrderTable();
        updateDashboard();
        showNotification(`Order ${orderId} is now being processed manually. Use workflow controls in Dispatch Management.`, 'success');
        
        // Show dispatch section for manual workflow
        showSection('dispatch');
        
        // Highlight the order for manual processing
        highlightNewOrderInDispatch(orderId);
    }
}

function startEnhancedWorkflow(order) {
    showNotification('Starting enhanced 7-step dispatch workflow...', 'info');
    
    // Show dispatch section with workflow
    showSection('dispatch');
    
    // Highlight workflow steps progressively
    const steps = document.querySelectorAll('.workflow-steps .step');
    let currentStep = 0;
    
    const progressWorkflow = () => {
        if (currentStep < steps.length) {
            // Mark current step as active
            if (currentStep > 0) {
                steps[currentStep - 1].classList.remove('active');
                steps[currentStep - 1].classList.add('completed');
            }
            
            steps[currentStep].classList.add('active');
            
            // Show step-specific notifications
            const stepMessages = [
                `Sales Order ${order.id} confirmed`,
                `Warehouse allocation: ${order.pickup}`,
                `Invoice generated for ${order.customer}`,
                'Vehicle and driver assignment in progress',
                'Order dispatched for delivery',
                'Live tracking activated',
                'Delivery completed successfully'
            ];
            
            showNotification(stepMessages[currentStep], 'info');
            
            currentStep++;
            setTimeout(progressWorkflow, 3000);
        } else {
            // Complete workflow
            order.status = 'completed';
            updateOrderTable();
            updateDashboard();
            showNotification(`🎉 Order ${order.id} workflow completed successfully!`, 'success');
        }
    };
    
    progressWorkflow();
}

function editOrder(orderId) {
    showNotification(`Editing order ${orderId}`, 'info');
}

function viewOrder(orderId) {
    const order = sampleData.orders.find(o => o.id === orderId);
    if (order) {
        alert(`Order Details:
        
Order ID: ${order.id}
Customer: ${order.customer}
Material: ${order.material}
Quantity: ${order.quantity} ${order.unit}
Priority: ${order.priority}
Status: ${order.status}
Created: ${order.createdDate}
Required: ${order.requiredDate || 'Not specified'}
Contact: ${order.contact || 'Not provided'}
Email: ${order.email || 'Not provided'}
Special Instructions: ${order.specialInstructions || 'None'}`);
    }
}

function trackOrder(orderId) {
    showSection('tracking');
    showNotification(`Tracking order ${orderId} on map`, 'success');
}

function generateInvoice(orderId) {
    showNotification(`Generating invoice for order ${orderId}`, 'info');
    setTimeout(() => {
        showNotification(`Invoice generated for order ${orderId}`, 'success');
    }, 2000);
}

function resetOrderModal() {
    document.querySelector('#addOrderModal .modal-title').innerHTML = '<i class="fas fa-plus"></i> Create New Order';
    document.querySelector('#addOrderModal button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Create Order';
    document.getElementById('orderForm').reset();
    
    // Auto-generate order ID
    document.getElementById('orderId').value = 'ORD' + String(Date.now()).slice(-3);
}

// Communication Integration Functions
function sendWhatsAppNotification(phoneNumber, message) {
    // Clean phone number for WhatsApp format
    let cleanNumber = phoneNumber.replace(/[^\d]/g, '');
    if (cleanNumber.startsWith('91')) {
        cleanNumber = cleanNumber;
    } else if (cleanNumber.startsWith('0')) {
        cleanNumber = '91' + cleanNumber.substring(1);
    } else {
        cleanNumber = '91' + cleanNumber;
    }
    
    // Create WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    
    // Show notification with option to open WhatsApp
    showNotification(`WhatsApp notification ready for +${cleanNumber.substring(0,2)} ${cleanNumber.substring(2,7)} ${cleanNumber.substring(7)}`, 'success');
    console.log(`WhatsApp URL generated: ${whatsappUrl}`);
    
    // Auto-open WhatsApp if user prefers (can be made configurable)
    if (confirm('Open WhatsApp to send this message?')) {
        window.open(whatsappUrl, '_blank');
    }
}

function sendEmailNotification(email, subject, message) {
    // Simulate Email API integration
    showNotification(`Email sent to ${email}: ${subject}`, 'success');
    console.log(`Email API: Sending to ${email} - Subject: ${subject} - Message: ${message}`);
}

// Enhanced Dashboard Update Function
function updateDashboard() {
    // Update KPI cards with correct counts
    document.getElementById('totalVehicles').textContent = sampleData.vehicles.length; // 5
    document.getElementById('activeTrips').textContent = sampleData.trips.filter(t => t.status === 'in-transit').length; // 1
    document.getElementById('pendingOrders').textContent = sampleData.orders.filter(o => o.status === 'pending').length; // Updated count
    document.getElementById('deliveredToday').textContent = sampleData.trips.filter(t => t.status === 'completed').length; // 1
    
    // Update recent activities
    updateRecentActivities();
    
    // Update alerts
    updateAlerts();
    
    console.log('Dashboard updated with real-time data');
}

// Auto-update dashboard every 30 seconds
setInterval(() => {
    updateDashboard();
}, 30000);

console.log('Enhanced Fleet Management System with Warehouse and Order Management loaded successfully');
// Enhanced Communication Integration Functions
function openWhatsAppPanel() {
    const modal = new bootstrap.Modal(document.getElementById('whatsappModal'));
    modal.show();
}

function openEmailPanel() {
    const modal = new bootstrap.Modal(document.getElementById('emailModal'));
    modal.show();
}

function sendWhatsAppMessage(event) {
    event.preventDefault();
    
    const recipient = document.getElementById('whatsappRecipient').value;
    const message = document.getElementById('whatsappMessage').value;
    const customNumber = document.getElementById('customPhoneNumber').value;
    
    let phoneNumber = '919843525031'; // Default system number in WhatsApp format
    
    if (recipient === 'custom' && customNumber) {
        // Clean the custom number for WhatsApp format
        phoneNumber = customNumber.replace(/[^\d]/g, '');
        if (phoneNumber.startsWith('91')) {
            phoneNumber = phoneNumber;
        } else if (phoneNumber.startsWith('0')) {
            phoneNumber = '91' + phoneNumber.substring(1);
        } else {
            phoneNumber = '91' + phoneNumber;
        }
    } else if (recipient === 'customer') {
        phoneNumber = '919876543210'; // Customer number from order
    } else if (recipient === 'driver') {
        phoneNumber = '918765432109'; // Driver number
    }
    
    // Create WhatsApp URL and open it
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab/window
    window.open(whatsappUrl, '_blank');
    
    showNotification(`WhatsApp opened for +${phoneNumber.substring(0,2)} ${phoneNumber.substring(2,7)} ${phoneNumber.substring(7)}`, 'success');
    console.log(`WhatsApp URL: ${whatsappUrl}`);
    
    // Close modal and reset form
    bootstrap.Modal.getInstance(document.getElementById('whatsappModal')).hide();
    document.getElementById('whatsappForm').reset();
}

function sendEmailMessage(event) {
    event.preventDefault();
    
    const recipient = document.getElementById('emailRecipient').value;
    const subject = document.getElementById('emailSubject').value;
    const message = document.getElementById('emailMessage').value;
    const customEmail = document.getElementById('customEmailAddress').value;
    
    let emailAddress = 'shinydora753152@gmail.com'; // Default system email
    
    if (recipient === 'custom' && customEmail) {
        emailAddress = customEmail;
    } else if (recipient === 'customer') {
        emailAddress = 'customer@company.com'; // Customer email from order
    } else if (recipient === 'driver') {
        emailAddress = 'driver@company.com'; // Driver email
    }
    
    // Simulate Email API call
    showNotification(`Email sent to ${emailAddress}`, 'success');
    console.log(`Email API: Sending to ${emailAddress} - Subject: ${subject} - Message: ${message}`);
    
    // Close modal and reset form
    bootstrap.Modal.getInstance(document.getElementById('emailModal')).hide();
    document.getElementById('emailForm').reset();
}

function loadMessageTemplate() {
    const template = document.getElementById('messageTemplate').value;
    const messageField = document.getElementById('whatsappMessage');
    
    const templates = {
        'order_confirmation': 'Hello! Your order has been confirmed and is being processed. Order ID: [ORDER_ID]. We will keep you updated on the progress.',
        'dispatch_update': 'Your order [ORDER_ID] has been dispatched and is on the way. Expected delivery: [DATE]. Track your order for real-time updates.',
        'delivery_notification': 'Great news! Your order [ORDER_ID] has been delivered successfully. Thank you for choosing our services.',
        'delay_alert': 'We regret to inform you that your order [ORDER_ID] is delayed due to [REASON]. New expected delivery: [DATE]. We apologize for the inconvenience.'
    };
    
    if (templates[template]) {
        messageField.value = templates[template];
    } else {
        messageField.value = '';
    }
}

function loadEmailTemplate() {
    const template = document.getElementById('emailTemplate').value;
    const subjectField = document.getElementById('emailSubject');
    const messageField = document.getElementById('emailMessage');
    
    const templates = {
        'order_confirmation': {
            subject: 'Order Confirmation - [ORDER_ID]',
            message: 'Dear Customer,\n\nThank you for your order. We have received your order [ORDER_ID] and it is being processed.\n\nOrder Details:\n- Material: [MATERIAL]\n- Quantity: [QUANTITY]\n- Expected Delivery: [DATE]\n\nWe will keep you updated on the progress.\n\nBest regards,\nFleet Management Team'
        },
        'dispatch_notification': {
            subject: 'Your Order is On The Way - [ORDER_ID]',
            message: 'Dear Customer,\n\nYour order [ORDER_ID] has been dispatched and is on the way to your location.\n\nDelivery Details:\n- Vehicle: [VEHICLE]\n- Driver: [DRIVER]\n- Expected Delivery: [DATE]\n\nYou can track your order in real-time using our tracking system.\n\nBest regards,\nFleet Management Team'
        },
        'delivery_update': {
            subject: 'Order Delivered Successfully - [ORDER_ID]',
            message: 'Dear Customer,\n\nWe are pleased to inform you that your order [ORDER_ID] has been delivered successfully.\n\nDelivery Details:\n- Delivered on: [DATE]\n- Received by: [RECIPIENT]\n- Vehicle: [VEHICLE]\n\nThank you for choosing our services. We look forward to serving you again.\n\nBest regards,\nFleet Management Team'
        },
        'invoice': {
            subject: 'Invoice for Order [ORDER_ID]',
            message: 'Dear Customer,\n\nPlease find attached the invoice for your order [ORDER_ID].\n\nInvoice Details:\n- Order ID: [ORDER_ID]\n- Amount: [AMOUNT]\n- Due Date: [DUE_DATE]\n\nFor any queries, please contact our support team.\n\nBest regards,\nFleet Management Team'
        },
        'delay_notification': {
            subject: 'Delivery Delay Notification - [ORDER_ID]',
            message: 'Dear Customer,\n\nWe regret to inform you that your order [ORDER_ID] is experiencing a delay.\n\nDelay Details:\n- Reason: [REASON]\n- Original Delivery Date: [ORIGINAL_DATE]\n- New Expected Delivery: [NEW_DATE]\n\nWe sincerely apologize for any inconvenience caused and appreciate your patience.\n\nBest regards,\nFleet Management Team'
        }
    };
    
    if (templates[template]) {
        subjectField.value = templates[template].subject;
        messageField.value = templates[template].message;
    } else {
        subjectField.value = '';
        messageField.value = '';
    }
}

// Show/hide custom fields based on recipient selection
document.addEventListener('DOMContentLoaded', function() {
    const whatsappRecipient = document.getElementById('whatsappRecipient');
    const emailRecipient = document.getElementById('emailRecipient');
    
    if (whatsappRecipient) {
        whatsappRecipient.addEventListener('change', function() {
            const customField = document.getElementById('customNumberField');
            if (this.value === 'custom') {
                customField.style.display = 'block';
            } else {
                customField.style.display = 'none';
            }
        });
    }
    
    if (emailRecipient) {
        emailRecipient.addEventListener('change', function() {
            const customField = document.getElementById('customEmailField');
            if (this.value === 'custom') {
                customField.style.display = 'block';
            } else {
                customField.style.display = 'none';
            }
        });
    }
});

// Dispatch Management Filter Functions
function filterDispatchOrders() {
    const priorityFilter = document.getElementById('dispatchPriorityFilter').value;
    let filteredOrders = sampleData.orders.filter(order => order.status === 'pending');
    
    if (priorityFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.priority === priorityFilter);
    }
    
    const container = document.getElementById('pendingOrdersList');
    container.innerHTML = filteredOrders.map(order => `
        <div class="order-item" data-order-id="${order.id}">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <h6 class="mb-0">${order.id}</h6>
                <span class="order-priority priority-${order.priority}">${order.priority}</span>
            </div>
            <p class="mb-1"><strong>Customer:</strong> ${order.customer}</p>
            <p class="mb-1"><strong>Material:</strong> ${order.material} (${order.quantity} ${order.unit})</p>
            <p class="mb-1"><strong>Route:</strong> ${order.pickup} → ${order.delivery}</p>
            <p class="mb-1"><strong>Contact:</strong> ${order.contact || 'N/A'}</p>
            <div class="mt-2">
                <button class="btn btn-primary btn-sm" onclick="assignOrder('${order.id}')">
                    <i class="fas fa-user-plus"></i> Assign
                </button>
                <button class="btn btn-outline-secondary btn-sm" onclick="viewOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
            </div>
        </div>
    `).join('');
    
    showNotification(`Filtered ${filteredOrders.length} pending orders by ${priorityFilter} priority`, 'info');
}

function refreshDispatchOrders() {
    document.getElementById('dispatchPriorityFilter').value = 'all';
    updatePendingOrders();
    showNotification('Dispatch orders refreshed', 'success');
}

// Enhanced workflow with sign-off step
// Manual Workflow Management
function processOrderManually(orderId) {
    const order = sampleData.orders.find(o => o.id === orderId);
    if (order) {
        showNotification(`Processing order ${orderId} manually. Use workflow controls to progress.`, 'info');
        
        // Show dispatch section with workflow controls
        showSection('dispatch');
        
        // Highlight the order
        highlightNewOrderInDispatch(orderId);
    }
}

console.log('Enhanced Fleet Management System with Communication Integration loaded successfully');

// Alert Notifications Functions
function initializeAlertsSection() {
    updateAlertStats();
    updateActiveAlerts();
    loadAlertSettings();
}

function updateAlertStats() {
    // Update alert statistics based on current fleet data
    const criticalAlerts = getCriticalAlerts();
    const maintenanceAlerts = getMaintenanceAlerts();
    const delayAlerts = getDelayAlerts();
    const resolvedToday = getResolvedAlertsToday();
    
    // Update the stats cards
    document.querySelector('#alerts .bg-danger h4').textContent = criticalAlerts.length;
    document.querySelector('#alerts .bg-warning h4').textContent = maintenanceAlerts.length;
    document.querySelector('#alerts .bg-info h4').textContent = delayAlerts.length;
    document.querySelector('#alerts .bg-success h4').textContent = resolvedToday.length;
}

function getCriticalAlerts() {
    const alerts = [];
    
    // Check for critical vehicle issues
    sampleData.vehicles.forEach(vehicle => {
        if (vehicle.status === 'out-of-service') {
            alerts.push({
                type: 'critical',
                vehicle: vehicle.number,
                message: `Vehicle ${vehicle.number} is out of service`,
                timestamp: new Date()
            });
        }
        
        // Check insurance expiry
        if (vehicle.insurance && vehicle.insurance.expiry) {
            const expiryDate = new Date(vehicle.insurance.expiry);
            const today = new Date();
            if (expiryDate < today) {
                alerts.push({
                    type: 'critical',
                    vehicle: vehicle.number,
                    message: `Insurance expired for vehicle ${vehicle.number}`,
                    timestamp: new Date()
                });
            }
        }
    });
    
    // Check for driver license expiry
    sampleData.drivers.forEach(driver => {
        const expiryDate = new Date(driver.licenseExpiry);
        const today = new Date();
        if (expiryDate < today) {
            alerts.push({
                type: 'critical',
                driver: driver.name,
                message: `License expired for driver ${driver.name}`,
                timestamp: new Date()
            });
        }
    });
    
    return alerts;
}

function getMaintenanceAlerts() {
    const alerts = [];
    
    sampleData.vehicles.forEach(vehicle => {
        if (vehicle.status === 'maintenance') {
            alerts.push({
                type: 'maintenance',
                vehicle: vehicle.number,
                message: `Vehicle ${vehicle.number} requires maintenance`,
                timestamp: new Date()
            });
        }
        
        // Check insurance expiry within 30 days
        if (vehicle.insurance && vehicle.insurance.expiry) {
            const expiryDate = new Date(vehicle.insurance.expiry);
            const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            if (expiryDate < thirtyDaysFromNow && expiryDate > new Date()) {
                alerts.push({
                    type: 'maintenance',
                    vehicle: vehicle.number,
                    message: `Insurance expiring soon for vehicle ${vehicle.number}`,
                    timestamp: new Date()
                });
            }
        }
    });
    
    return alerts;
}

function getDelayAlerts() {
    const alerts = [];
    
    sampleData.trips.forEach(trip => {
        if (trip.status === 'in-transit' && trip.progress < 50) {
            alerts.push({
                type: 'delay',
                trip: trip.id,
                message: `Trip ${trip.id} may be delayed`,
                timestamp: new Date()
            });
        }
    });
    
    return alerts;
}

function getResolvedAlertsToday() {
    // Simulate resolved alerts for today
    return Array.from({length: 25}, (_, i) => ({
        type: 'resolved',
        message: `Alert ${i + 1} resolved`,
        timestamp: new Date()
    }));
}

function updateActiveAlerts() {
    // This function updates the active alerts list with real-time data
    const container = document.getElementById('activeAlertsList');
    const criticalAlerts = getCriticalAlerts();
    const maintenanceAlerts = getMaintenanceAlerts();
    const delayAlerts = getDelayAlerts();
    
    let alertsHTML = '';
    
    // Add critical alerts
    criticalAlerts.forEach(alert => {
        alertsHTML += `
            <div class="alert alert-danger alert-dismissible fade show">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6><i class="fas fa-exclamation-triangle"></i> Critical Alert</h6>
                        <p class="mb-1">${alert.message}</p>
                        <small class="text-muted">Time: ${alert.timestamp.toLocaleTimeString()}</small>
                    </div>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-danger" onclick="handleCriticalAlert('${alert.vehicle || alert.driver}')">
                            <i class="fas fa-exclamation"></i> Handle
                        </button>
                        <button class="btn btn-outline-secondary" onclick="dismissAlert(this)">
                            <i class="fas fa-times"></i> Dismiss
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Add maintenance alerts
    maintenanceAlerts.forEach(alert => {
        alertsHTML += `
            <div class="alert alert-warning alert-dismissible fade show">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6><i class="fas fa-wrench"></i> Maintenance Alert</h6>
                        <p class="mb-1">${alert.message}</p>
                        <small class="text-muted">Time: ${alert.timestamp.toLocaleTimeString()}</small>
                    </div>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-warning" onclick="scheduleMaintenance('${alert.vehicle}')">
                            <i class="fas fa-calendar"></i> Schedule
                        </button>
                        <button class="btn btn-outline-secondary" onclick="snoozeAlert(this)">
                            <i class="fas fa-clock"></i> Snooze
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Add delay alerts
    delayAlerts.forEach(alert => {
        alertsHTML += `
            <div class="alert alert-info alert-dismissible fade show">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6><i class="fas fa-clock"></i> Delay Alert</h6>
                        <p class="mb-1">${alert.message}</p>
                        <small class="text-muted">Time: ${alert.timestamp.toLocaleTimeString()}</small>
                    </div>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-info" onclick="updateCustomer('${alert.trip}')">
                            <i class="fas fa-envelope"></i> Notify
                        </button>
                        <button class="btn btn-outline-primary" onclick="trackTrip('${alert.trip}')">
                            <i class="fas fa-map-marker-alt"></i> Track
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    if (alertsHTML === '') {
        alertsHTML = '<div class="alert alert-success"><i class="fas fa-check-circle"></i> No active alerts. All systems running smoothly!</div>';
    }
    
    container.innerHTML = alertsHTML;
}

function refreshAlerts() {
    updateAlertStats();
    updateActiveAlerts();
    showNotification('Alerts refreshed with latest fleet data', 'success');
}

function markAllRead() {
    const alerts = document.querySelectorAll('#activeAlertsList .alert');
    alerts.forEach(alert => {
        alert.style.opacity = '0.6';
    });
    showNotification('All alerts marked as read', 'info');
}

function handleCriticalAlert(vehicleOrDriver) {
    showNotification(`Handling critical alert for ${vehicleOrDriver}`, 'warning');
    // In real implementation, this would trigger emergency protocols
}

function scheduleMaintenance(vehicleNumber) {
    showNotification(`Scheduling maintenance for vehicle ${vehicleNumber}`, 'info');
    // In real implementation, this would open maintenance scheduling interface
}

function snoozeAlert(alertElement) {
    alertElement.closest('.alert').style.opacity = '0.5';
    showNotification('Alert snoozed for 1 hour', 'info');
}

function dismissAlert(alertElement) {
    alertElement.closest('.alert').remove();
    showNotification('Alert dismissed', 'info');
}

function emergencyResponse(vehicleNumber) {
    showNotification(`Emergency response initiated for vehicle ${vehicleNumber}`, 'danger');
    // In real implementation, this would trigger emergency protocols
}

function contactDriver(vehicleNumber) {
    const vehicle = sampleData.vehicles.find(v => v.number === vehicleNumber);
    if (vehicle && vehicle.driver) {
        showNotification(`Calling driver ${vehicle.driver} for vehicle ${vehicleNumber}`, 'info');
        // In real implementation, this would initiate a call
    }
}

function updateCustomer(tripId) {
    showNotification(`Sending update to customer for trip ${tripId}`, 'info');
    // In real implementation, this would send customer notification
}

function findAlternateRoute(tripId) {
    showNotification(`Finding alternate route for trip ${tripId}`, 'info');
    // In real implementation, this would calculate alternate routes
}

function findFuelStation(vehicleNumber) {
    showNotification(`Finding nearest fuel station for vehicle ${vehicleNumber}`, 'info');
    // In real implementation, this would show nearby fuel stations
}

function notifyDriver(vehicleNumber) {
    const vehicle = sampleData.vehicles.find(v => v.number === vehicleNumber);
    if (vehicle && vehicle.driver) {
        showNotification(`Notifying driver ${vehicle.driver} about fuel alert`, 'info');
        // In real implementation, this would send driver notification
    }
}

function viewMaintenanceReport(vehicleNumber) {
    showNotification(`Opening maintenance report for vehicle ${vehicleNumber}`, 'info');
    // In real implementation, this would show detailed maintenance report
}

function updateVehicleStatus(vehicleNumber, status) {
    const vehicle = sampleData.vehicles.find(v => v.number === vehicleNumber);
    if (vehicle) {
        vehicle.status = status;
        updateVehicleTable();
        updateDashboard();
        showNotification(`Vehicle ${vehicleNumber} status updated to ${status}`, 'success');
    }
}

function loadAlertSettings() {
    // Load saved alert settings from localStorage or use defaults
    const settings = JSON.parse(localStorage.getItem('alertSettings')) || {
        maintenanceDue: true,
        maintenanceOverdue: true,
        fuelLow: true,
        engineTemp: true,
        speedLimit: true,
        routeDelay: true,
        routeDeviation: true
    };
    
    // Apply settings to checkboxes
    Object.keys(settings).forEach(key => {
        const checkbox = document.getElementById(key);
        if (checkbox) {
            checkbox.checked = settings[key];
        }
    });
}

function saveNotificationSettings() {
    const settings = {
        maintenanceDue: document.getElementById('maintenanceDue').checked,
        maintenanceOverdue: document.getElementById('maintenanceOverdue').checked,
        fuelLow: document.getElementById('fuelLow').checked,
        engineTemp: document.getElementById('engineTemp').checked,
        speedLimit: document.getElementById('speedLimit').checked,
        routeDelay: document.getElementById('routeDelay').checked,
        routeDeviation: document.getElementById('routeDeviation').checked
    };
    
    localStorage.setItem('alertSettings', JSON.stringify(settings));
    showNotification('Alert settings saved successfully', 'success');
}

// Enhanced Report Management with Filtering
function loadReportWithFilters(reportType) {
    currentReport = reportType;
    
    // Update report title
    const titles = {
        'fleet-overview': 'Fleet Overview Dashboard',
        'dispatch-performance': 'Dispatch Performance Analytics',
        'fuel-analysis': 'Fuel Consumption Analysis',
        'driver-performance': 'Driver Performance Metrics'
    };
    
    document.getElementById('currentReportTitle').innerHTML = 
        `<i class="fas fa-chart-line"></i> ${titles[reportType]}`;
    
    // Add filter controls for reports
    const filterControls = `
        <div class="row mb-3">
            <div class="col-md-3">
                <label class="form-label">Date Range</label>
                <select class="form-control" id="reportDateFilter" onchange="applyReportFilters()">
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month" selected>This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                    <option value="custom">Custom Range</option>
                </select>
            </div>
            <div class="col-md-3">
                <label class="form-label">Vehicle Type</label>
                <select class="form-control" id="reportVehicleFilter" onchange="applyReportFilters()">
                    <option value="all">All Vehicles</option>
                    <option value="truck">Trucks</option>
                    <option value="van">Vans</option>
                    <option value="car">Cars</option>
                    <option value="bus">Buses</option>
                </select>
            </div>
            <div class="col-md-3">
                <label class="form-label">Priority</label>
                <select class="form-control" id="reportPriorityFilter" onchange="applyReportFilters()">
                    <option value="all">All Priorities</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                </select>
            </div>
            <div class="col-md-3">
                <label class="form-label">Actions</label><br>
                <button class="btn btn-primary btn-sm" onclick="applyReportFilters()">
                    <i class="fas fa-filter"></i> Apply Filters
                </button>
                <button class="btn btn-secondary btn-sm" onclick="clearReportFilters()">
                    <i class="fas fa-times"></i> Clear
                </button>
            </div>
        </div>
    `;
    
    // Simulate Power BI report loading with filters
    const container = document.getElementById('powerBIContainer');
    container.innerHTML = `
        <div class="p-3">
            ${filterControls}
            <div class="d-flex align-items-center justify-content-center h-100">
                <div class="text-center">
                    <div class="spinner-border text-primary mb-3" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="text-muted">Loading ${titles[reportType]} with filters...</p>
                </div>
            </div>
        </div>
    `;
    
    // Simulate loading delay
    setTimeout(() => {
        const reportContent = generateFilteredReport(reportType);
        container.innerHTML = filterControls + reportContent;
    }, 2000);
}

function generateFilteredReport(reportType) {
    const reports = {
        'fleet-overview': `
            <div class="p-4">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i> Report filtered by current settings. 
                    Data refreshed from Fleet Management system at ${new Date().toLocaleTimeString()}
                </div>
                <div class="row mb-4">
                    <div class="col-md-3">
                        <div class="card bg-primary text-white">
                            <div class="card-body text-center">
                                <h3>5</h3>
                                <p>Total Vehicles (Filtered)</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card bg-success text-white">
                            <div class="card-body text-center">
                                <h3>92%</h3>
                                <p>Fleet Utilization</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card bg-warning text-white">
                            <div class="card-body text-center">
                                <h3>3</h3>
                                <p>Total Trips (Filtered)</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card bg-info text-white">
                            <div class="card-body text-center">
                                <h3>₹1.2L</h3>
                                <p>Revenue (Filtered Period)</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div class="alert alert-success">
                            <i class="fas fa-check-circle"></i> 
                            <strong>Data Synchronization:</strong> All data is fresh from Fleet Management system. 
                            Last sync: ${new Date().toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        `,
        'dispatch-performance': `
            <div class="p-4">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i> Dispatch performance filtered by priority and date range.
                    Data includes Sign-off completion rates.
                </div>
                <div class="row mb-4">
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body text-center">
                                <h3 class="text-success">98.5%</h3>
                                <p>On-Time Delivery (Filtered)</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body text-center">
                                <h3 class="text-primary">12 min</h3>
                                <p>Avg Dispatch Time</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body text-center">
                                <h3 class="text-warning">100%</h3>
                                <p>Sign-off Completion</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        'fuel-analysis': `
            <div class="p-4">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i> Fuel analysis filtered by vehicle type and date range.
                </div>
                <div class="row mb-4">
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body text-center">
                                <h3>12.5 L/100km</h3>
                                <p>Avg Consumption (Filtered)</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body text-center">
                                <h3>₹45,000</h3>
                                <p>Fuel Cost (Filtered Period)</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body text-center">
                                <h3>-5%</h3>
                                <p>Cost Reduction</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body text-center">
                                <h3>1,250 L</h3>
                                <p>Total Consumption</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        'driver-performance': `
            <div class="p-4">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i> Driver performance filtered by date range and priority orders.
                </div>
                <div class="row mb-4">
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body text-center">
                                <h3>4.8/5</h3>
                                <p>Avg Driver Rating (Filtered)</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body text-center">
                                <h3>95%</h3>
                                <p>Safety Score</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body text-center">
                                <h3>7.5 hrs</h3>
                                <p>Avg Drive Time (Filtered)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    };
    
    return reports[reportType] || reports['fleet-overview'];
}

function applyReportFilters() {
    const dateFilter = document.getElementById('reportDateFilter').value;
    const vehicleFilter = document.getElementById('reportVehicleFilter').value;
    const priorityFilter = document.getElementById('reportPriorityFilter').value;
    
    showNotification(`Applying filters: ${dateFilter} | ${vehicleFilter} | ${priorityFilter}`, 'info');
    
    // Reload report with filters
    setTimeout(() => {
        const reportContent = generateFilteredReport(currentReport);
        const filterControls = document.querySelector('#powerBIContainer .row').outerHTML;
        document.getElementById('powerBIContainer').innerHTML = filterControls + reportContent;
        showNotification('Report updated with applied filters', 'success');
    }, 1000);
}

function clearReportFilters() {
    document.getElementById('reportDateFilter').value = 'month';
    document.getElementById('reportVehicleFilter').value = 'all';
    document.getElementById('reportPriorityFilter').value = 'all';
    applyReportFilters();
}

// WhatsApp Integration Functions
function openWhatsAppPanel() {
    new bootstrap.Modal(document.getElementById('whatsappModal')).show();
}

function sendWhatsAppMessage(event) {
    event.preventDefault();
    
    const recipient = document.getElementById('whatsappRecipient').value;
    const message = document.getElementById('whatsappMessage').value;
    const customNumber = document.getElementById('customPhoneNumber').value;
    
    let phoneNumber = '+91 9843525031'; // Default system number
    
    if (recipient === 'custom' && customNumber) {
        phoneNumber = customNumber;
    }
    
    // Create WhatsApp URL for web.whatsapp.com
    const whatsappURL = `https://web.whatsapp.com/send?phone=${phoneNumber.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(message)}`;
    
    // Try to open WhatsApp Web
    const whatsappWindow = window.open(whatsappURL, '_blank');
    
    if (whatsappWindow) {
        showNotification(`WhatsApp message prepared for ${phoneNumber}. Please send from WhatsApp Web.`, 'success');
    } else {
        // Fallback: Try mobile WhatsApp URL
        const mobileWhatsappURL = `whatsapp://send?phone=${phoneNumber.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(message)}`;
        window.location.href = mobileWhatsappURL;
        showNotification(`Opening WhatsApp to send message to ${phoneNumber}`, 'info');
    }
    
    // Log the message for tracking
    console.log(`WhatsApp message sent to ${phoneNumber}: ${message}`);
    
    // Close modal and reset form
    bootstrap.Modal.getInstance(document.getElementById('whatsappModal')).hide();
    document.getElementById('whatsappForm').reset();
}

// Email Integration Functions
function openEmailPanel() {
    new bootstrap.Modal(document.getElementById('emailModal')).show();
}

function sendEmailMessage(event) {
    event.preventDefault();
    
    const recipient = document.getElementById('emailRecipient').value;
    const subject = document.getElementById('emailSubject').value;
    const message = document.getElementById('emailMessage').value;
    
    // Simulate sending email
    showNotification(`Email sent to ${recipient}: "${subject}"`, 'success');
    
    // Close modal and reset form
    bootstrap.Modal.getInstance(document.getElementById('emailModal')).hide();
    document.getElementById('emailForm').reset();
}

function loadEmailRecipient() {
    const recipient = document.getElementById('emailRecipient').value;
    const customField = document.getElementById('customEmailField');
    
    if (recipient === 'custom') {
        customField.style.display = 'block';
    } else {
        customField.style.display = 'none';
    }
}

function loadEmailTemplate() {
    const template = document.getElementById('emailTemplate').value;
    const subjectField = document.getElementById('emailSubject');
    const messageField = document.getElementById('emailMessage');
    
    const templates = {
        'order_confirmation': {
            subject: 'Order Confirmation - Your order has been received',
            message: 'Dear Customer,\n\nYour order has been confirmed and is being processed.\n\nOrder Details:\n- Order ID: [ORDER_ID]\n- Pickup: [PICKUP_LOCATION]\n- Delivery: [DELIVERY_LOCATION]\n\nThank you for choosing our services.\n\nBest regards,\nFleet Management Team'
        },
        'dispatch_notification': {
            subject: 'Dispatch Notification - Your order is on the way',
            message: 'Dear Customer,\n\nYour order has been dispatched and is on the way.\n\nDispatch Details:\n- Vehicle: [VEHICLE_NUMBER]\n- Driver: [DRIVER_NAME]\n- Expected Delivery: [ETA]\n\nYou can track your order in real-time.\n\nBest regards,\nFleet Management Team'
        },
        'delivery_update': {
            subject: 'Delivery Update - Status of your order',
            message: 'Dear Customer,\n\nHere is an update on your delivery:\n\n- Current Status: [STATUS]\n- Location: [CURRENT_LOCATION]\n- Expected Delivery: [ETA]\n\nWe will notify you once the delivery is completed.\n\nBest regards,\nFleet Management Team'
        },
        'invoice': {
            subject: 'Invoice - Payment details for your order',
            message: 'Dear Customer,\n\nPlease find the invoice details for your recent order:\n\n- Invoice Number: [INVOICE_NUMBER]\n- Amount: [AMOUNT]\n- Due Date: [DUE_DATE]\n\nPayment can be made through our online portal.\n\nBest regards,\nFleet Management Team'
        },
        'delay_notification': {
            subject: 'Delivery Delay Notification',
            message: 'Dear Customer,\n\nWe regret to inform you that your delivery will be delayed due to unforeseen circumstances.\n\n- Original ETA: [ORIGINAL_ETA]\n- New ETA: [NEW_ETA]\n- Reason: [DELAY_REASON]\n\nWe apologize for the inconvenience.\n\nBest regards,\nFleet Management Team'
        }
    };
    
    if (templates[template]) {
        subjectField.value = templates[template].subject;
        messageField.value = templates[template].message;
    }
}

// Enhanced real-time updates with data freshness indicators
function startRealTimeUpdates() {
    setInterval(() => {
        // Update dashboard metrics with fresh data
        updateDashboard();
        
        // Update dispatch management with fresh fleet data
        updateAvailableResources();
        updatePendingOrders();
        
        // Update alert notifications with latest fleet status
        if (document.getElementById('alerts').style.display !== 'none') {
            updateAlertStats();
            updateActiveAlerts();
        }
        
        // Update real-time metrics
        updateRealTimeMetrics();
        
        // Simulate trip progress updates
        sampleData.trips.forEach(trip => {
            if (trip.status === 'in-transit' && trip.progress < 100) {
                trip.progress = Math.min(100, trip.progress + Math.random() * 5);
                if (trip.progress >= 100) {
                    trip.status = 'completed';
                }
            }
        });
        
        updateActiveTrips();
        
        // Show data freshness indicator
        console.log('Real-time update completed at', new Date().toLocaleTimeString());
        
    }, 10000); // Update every 10 seconds
}

// Override the loadReport function to use the enhanced version with filters
function loadReport(reportType) {
    loadReportWithFilters(reportType);
}
// Additional WhatsApp functions
function loadMessageTemplate() {
    const template = document.getElementById('messageTemplate').value;
    const messageField = document.getElementById('whatsappMessage');
    
    const templates = {
        'order_confirmation': 'Hi! Your order [ORDER_ID] has been confirmed. Pickup: [PICKUP] → Delivery: [DELIVERY]. We will keep you updated. Thanks!',
        'dispatch_update': 'Your order [ORDER_ID] is now dispatched! Vehicle: [VEHICLE] | Driver: [DRIVER] | ETA: [ETA]. Track live: [LINK]',
        'delivery_notification': 'Great news! Your order [ORDER_ID] has been delivered successfully. Thank you for choosing our services!',
        'delay_alert': 'Update: Your order [ORDER_ID] is delayed by [DELAY_TIME] due to [REASON]. New ETA: [NEW_ETA]. Sorry for the inconvenience.'
    };
    
    if (templates[template]) {
        messageField.value = templates[template];
    }
}

// Additional functions for Proof of Delivery
function viewProofOfDelivery(orderId) {
    showNotification(`Opening Proof of Delivery for order ${orderId}`, 'info');
    // In real implementation, this would show POD details with signature and photos
}

function uploadProofOfDelivery(orderId) {
    showNotification(`Opening POD upload interface for order ${orderId}`, 'info');
    // In real implementation, this would open camera/file upload interface
}

// Enhanced dispatch workflow functions
function startDispatchWorkflow() {
    showNotification('Starting new dispatch workflow...', 'info');
    
    // Reset all workflow steps
    const steps = document.querySelectorAll('.workflow-steps .step');
    steps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index === 0) {
            step.classList.add('active');
        }
        
        // Reset icons
        const icon = step.querySelector('.step-icon i');
        if (icon) {
            const stepNumber = index + 1;
            const icons = {
                1: 'fas fa-shopping-cart',
                2: 'fas fa-warehouse', 
                3: 'fas fa-file-invoice',
                4: 'fas fa-user-plus',
                5: 'fas fa-play',
                6: 'fas fa-map-marker-alt',
                7: 'fas fa-check',
                8: 'fas fa-signature'
            };
            icon.className = icons[stepNumber] || 'fas fa-circle';
        }
    });
    
    // Focus on order creation form
    const customerNameField = document.getElementById('customerName');
    if (customerNameField) {
        customerNameField.focus();
    }
    
    // Show workflow guidance
    showWorkflowGuidance(1);
}

function showWorkflowGuidance(stepNumber) {
    const guidance = {
        1: 'Step 1: Create a new sales order with customer details',
        2: 'Step 2: Warehouse will prepare materials for dispatch',
        3: 'Step 3: Generate invoice for the order',
        4: 'Step 4: Assign vehicle and driver to the order',
        5: 'Step 5: Dispatch the order for delivery',
        6: 'Step 6: Track the vehicle during transit',
        7: 'Step 7: Confirm delivery at destination',
        8: 'Step 8: Obtain customer sign-off for completion'
    };
    
    if (guidance[stepNumber]) {
        showNotification(guidance[stepNumber], 'info');
    }
}

function progressWorkflow(currentStep) {
    // Mark current step as completed
    updateWorkflowStep(currentStep, 'completed');
    
    // Activate next step
    if (currentStep < 7) { // 8 steps total (0-7)
        updateWorkflowStep(currentStep + 1, 'active');
        showWorkflowGuidance(currentStep + 1);
    } else {
        showNotification('🎉 Complete 8-step dispatch workflow finished with customer sign-off!', 'success');
    }
}

function updateWorkflowStep(stepNumber, status) {
    const step = document.querySelector(`[data-step="${stepNumber}"]`);
    if (step) {
        step.classList.remove('active', 'completed', 'pending');
        step.classList.add(status);
        
        if (status === 'completed') {
            const icon = step.querySelector('.step-icon i');
            if (icon) {
                icon.className = 'fas fa-check';
            }
            step.style.color = '#28a745';
        } else if (status === 'active') {
            step.style.color = '#007bff';
        }
    }
}

function showWorkflowGuidance(stepNumber) {
    const stepGuidance = {
        0: 'Sales Order confirmed - Processing customer requirements',
        1: 'Warehouse allocation - Checking material availability',
        2: 'Invoice generation - Calculating costs and preparing billing',
        3: 'Vehicle & Driver assignment - Matching resources to requirements',
        4: 'Dispatch initiated - Order sent for delivery',
        5: 'Live tracking active - Monitoring delivery progress',
        6: 'Delivery completed - Goods delivered to customer',
        7: 'Customer sign-off received - Order officially closed'
    };
    
    if (stepGuidance[stepNumber]) {
        showNotification(`Step ${stepNumber + 1}: ${stepGuidance[stepNumber]}`, 'info');
    }
}

// Data synchronization functions to ensure fresh data flow
function syncFleetDataToDispatch() {
    // Ensure dispatch management gets fresh data from fleet management
    updateAvailableResources();
    updatePendingOrders();
    
    // Update dashboard with latest counts
    updateDashboard();
    
    console.log('Fleet data synchronized to Dispatch Management at', new Date().toLocaleTimeString());
    return true;
}

function ensureDataFreshness() {
    // This function ensures all modules have fresh data
    const modules = ['dashboard', 'dispatch', 'tracking', 'reports', 'alerts'];
    
    modules.forEach(module => {
        switch(module) {
            case 'dashboard':
                updateDashboard();
                break;
            case 'dispatch':
                syncFleetDataToDispatch();
                break;
            case 'tracking':
                if (map) {
                    updateVehicleStatusList();
                    updateTrackingAlerts();
                }
                break;
            case 'reports':
                updateRealTimeMetrics();
                break;
            case 'alerts':
                updateAlertStats();
                updateActiveAlerts();
                break;
        }
    });
    
    showNotification('All modules synchronized with fresh Fleet Management data', 'success');
}

// Enhanced order management functions
function filterOrders() {
    const priorityFilter = document.getElementById('priorityFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    const filteredOrders = sampleData.orders.filter(order => {
        const priorityMatch = priorityFilter === 'all' || order.priority === priorityFilter;
        const statusMatch = statusFilter === 'all' || order.status === statusFilter;
        return priorityMatch && statusMatch;
    });
    
    updateOrderTableWithFilters(filteredOrders);
    showNotification(`Filtered ${filteredOrders.length} orders`, 'info');
}

function updateOrderTableWithFilters(orders) {
    const tableBody = document.getElementById('orderTable');
    
    tableBody.innerHTML = orders.map(order => {
        const priorityClass = {
            'urgent': 'danger',
            'high': 'warning',
            'normal': 'secondary'
        }[order.priority] || 'secondary';
        
        const statusClass = {
            'pending': 'warning',
            'processing': 'info',
            'completed': 'success',
            'cancelled': 'danger'
        }[order.status] || 'secondary';
        
        return `
            <tr>
                <td><strong>${order.id}</strong></td>
                <td>${order.customer}</td>
                <td>${order.material}</td>
                <td>${order.quantity} ${order.unit}</td>
                <td><span class="badge bg-${priorityClass}">${order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}</span></td>
                <td><span class="badge bg-${statusClass}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                <td>${order.createdDate}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editOrder('${order.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-success" onclick="processOrder('${order.id}')">
                        <i class="fas fa-play"></i> Process
                    </button>
                    <button class="btn btn-sm btn-outline-info" onclick="viewOrder('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function clearFilters() {
    document.getElementById('priorityFilter').value = 'all';
    document.getElementById('statusFilter').value = 'all';
    updateOrderTable();
    showNotification('Filters cleared', 'info');
}

function processOrder(orderId) {
    const order = sampleData.orders.find(o => o.id === orderId);
    if (order) {
        order.status = 'processing';
        updateOrderTable();
        updateDashboard();
        showNotification(`Order ${orderId} is now being processed manually. Use workflow controls in Dispatch Management.`, 'success');
        
        // Show dispatch section for manual workflow
        showSection('dispatch');
    }
}

function editOrder(orderId) {
    showNotification(`Opening edit form for order ${orderId}`, 'info');
    // In real implementation, this would open an edit modal
}

function viewOrder(orderId) {
    const order = sampleData.orders.find(o => o.id === orderId);
    if (order) {
        const details = `
Order Details:
- ID: ${order.id}
- Customer: ${order.customer}
- Material: ${order.material} (${order.quantity} ${order.unit})
- Route: ${order.pickup} → ${order.delivery}
- Priority: ${order.priority}
- Status: ${order.status}
- Created: ${order.createdDate}
- Contact: ${order.contact || 'N/A'}
- Email: ${order.email || 'N/A'}
        `;
        alert(details);
    }
}

// Material management functions
function updateMaterialTable() {
    const tableBody = document.getElementById('materialTable');
    if (!tableBody) return;
    
    tableBody.innerHTML = sampleData.materials.map(material => {
        const statusClass = material.status === 'available' ? 'success' : 
                           material.status === 'low-stock' ? 'danger' : 'warning';
        
        const categoryClass = {
            'construction': 'primary',
            'building': 'secondary',
            'electrical': 'warning'
        }[material.category] || 'info';
        
        return `
            <tr>
                <td><strong>${material.code}</strong></td>
                <td>${material.name}</td>
                <td><span class="badge bg-${categoryClass}">${material.category.charAt(0).toUpperCase() + material.category.slice(1)}</span></td>
                <td>${material.warehouseName}</td>
                <td>${material.currentStock}</td>
                <td>${material.unit}</td>
                <td><span class="badge bg-${statusClass}">${material.status.charAt(0).toUpperCase() + material.status.slice(1).replace('-', ' ')}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editMaterial('${material.code}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-info" onclick="viewMaterial('${material.code}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning" onclick="transferMaterial('${material.code}')">
                        <i class="fas fa-exchange-alt"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function editMaterial(materialCode) {
    showNotification(`Opening edit form for material ${materialCode}`, 'info');
}

function viewMaterial(materialCode) {
    const material = sampleData.materials.find(m => m.code === materialCode);
    if (material) {
        const details = `
Material Details:
- Code: ${material.code}
- Name: ${material.name}
- Category: ${material.category}
- Warehouse: ${material.warehouseName}
- Current Stock: ${material.currentStock} ${material.unit}
- Min Stock Level: ${material.minStockLevel} ${material.unit}
- Status: ${material.status}
- Created: ${material.createdDate}
        `;
        alert(details);
    }
}

function transferMaterial(materialCode) {
    showNotification(`Opening transfer interface for material ${materialCode}`, 'info');
}

function requestStock(materialCode) {
    showNotification(`Stock request initiated for material ${materialCode}`, 'info');
}

function exportMaterials() {
    showNotification('Exporting material inventory...', 'info');
    setTimeout(() => {
        showNotification('Material inventory exported successfully', 'success');
    }, 1500);
}

function refreshMaterials() {
    updateMaterialTable();
    showNotification('Material inventory refreshed', 'success');
}

// Initialize all modules with fresh data on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing Fleet Management System...');
    initializeApp();
    
    // Ensure data freshness across all modules
    setTimeout(() => {
        ensureDataFreshness();
    }, 2000);
    
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize Bootstrap popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    console.log('Fleet Management System fully loaded with fresh data synchronization');
});

// Auto-refresh data every 30 seconds to ensure freshness
setInterval(() => {
    ensureDataFreshness();
}, 30000);
// Automatic Order to Dispatch Workflow Functions
// Step-by-Step Form Workflow Functions
let currentWorkflowStep = 0;
let workflowData = {};

function startManualWorkflow() {
    // Reset workflow
    currentWorkflowStep = 0;
    workflowData = {};
    
    // Show workflow forms container
    document.getElementById('workflowFormsContainer').style.display = 'block';
    
    // Hide all forms first
    for (let i = 1; i <= 8; i++) {
        document.getElementById(`step${i}Form`).style.display = 'none';
    }
    document.getElementById('workflowComplete').style.display = 'none';
    
    // Show first step
    showStep(1);
    
    showNotification('Manual workflow started. Complete each step form to progress.', 'info');
}

function showStep(stepNumber) {
    currentWorkflowStep = stepNumber;
    
    // Hide all forms
    for (let i = 1; i <= 8; i++) {
        document.getElementById(`step${i}Form`).style.display = 'none';
    }
    
    // Show current step form
    document.getElementById(`step${stepNumber}Form`).style.display = 'block';
    
    // Update current step display
    const stepTitles = {
        1: 'Sales Order - Customer Information',
        2: 'Warehouse - Material & Pickup Details',
        3: 'Invoice - Pricing & Delivery Information',
        4: 'Vehicle & Driver Assignment',
        5: 'Dispatch - Instructions & Notifications',
        6: 'Tracker - Live Tracking Setup',
        7: 'Delivered - Delivery Confirmation',
        8: 'Sign-off - Customer Signature & Feedback'
    };
    
    const stepDescriptions = {
        1: 'Enter customer details and order priority',
        2: 'Specify pickup location, material type and quantity',
        3: 'Set delivery location, pricing and payment terms',
        4: 'Assign vehicle, driver and schedule timing',
        5: 'Add dispatch instructions and notification preferences',
        6: 'Set up live tracking and monitor progress',
        7: 'Confirm delivery details and condition of goods',
        8: 'Capture customer signature and final feedback'
    };
    
    document.getElementById('currentStepDisplay').style.display = 'block';
    document.getElementById('currentStepTitle').textContent = `Step ${stepNumber}: ${stepTitles[stepNumber]}`;
    document.getElementById('currentStepDescription').textContent = stepDescriptions[stepNumber];
    
    // Update workflow visual indicators
    updateWorkflowStep(stepNumber - 1, 'active');
    if (stepNumber > 1) {
        updateWorkflowStep(stepNumber - 2, 'completed');
    }
    
    // Auto-fill some fields based on previous steps
    autoFillFormFields(stepNumber);
}

function completeStep(stepNumber) {
    // Validate current step form
    if (!validateStepForm(stepNumber)) {
        showNotification('Please fill in all required fields before continuing.', 'warning');
        return;
    }
    
    // Save step data
    saveStepData(stepNumber);
    
    // Mark step as completed
    updateWorkflowStep(stepNumber - 1, 'completed');
    
    // Show next step or complete workflow
    if (stepNumber < 8) {
        showStep(stepNumber + 1);
        showNotification(`Step ${stepNumber} completed. Continue with Step ${stepNumber + 1}.`, 'success');
    } else {
        // Workflow complete
        completeWorkflow();
    }
}

function validateStepForm(stepNumber) {
    const form = document.getElementById(`step${stepNumber}Form`).querySelector('form');
    const requiredFields = form.querySelectorAll('[required]');
    
    for (let field of requiredFields) {
        if (!field.value.trim()) {
            field.focus();
            return false;
        }
    }
    return true;
}

function saveStepData(stepNumber) {
    const stepData = {};
    
    switch (stepNumber) {
        case 1:
            stepData.customerName = document.getElementById('step1CustomerName').value;
            stepData.customerPhone = document.getElementById('step1CustomerPhone').value;
            stepData.customerEmail = document.getElementById('step1CustomerEmail').value;
            stepData.priority = document.getElementById('step1Priority').value;
            break;
        case 2:
            stepData.pickupLocation = document.getElementById('step2PickupLocation').value;
            stepData.materialType = document.getElementById('step2MaterialType').value;
            stepData.quantity = document.getElementById('step2Quantity').value;
            stepData.unit = document.getElementById('step2Unit').value;
            break;
        case 3:
            stepData.deliveryLocation = document.getElementById('step3DeliveryLocation').value;
            stepData.rate = document.getElementById('step3Rate').value;
            stepData.totalAmount = document.getElementById('step3TotalAmount').value;
            stepData.paymentTerms = document.getElementById('step3PaymentTerms').value;
            break;
        case 4:
            stepData.vehicle = document.getElementById('step4Vehicle').value;
            stepData.driver = document.getElementById('step4Driver').value;
            stepData.startTime = document.getElementById('step4StartTime').value;
            stepData.deliveryTime = document.getElementById('step4DeliveryTime').value;
            break;
        case 5:
            stepData.instructions = document.getElementById('step5Instructions').value;
            stepData.requirements = document.getElementById('step5Requirements').value;
            stepData.notifyCustomer = document.getElementById('step5NotifyCustomer').checked;
            stepData.notifyDriver = document.getElementById('step5NotifyDriver').checked;
            break;
        case 6:
            stepData.trackingId = document.getElementById('step6TrackingId').value;
            stepData.status = document.getElementById('step6Status').value;
            stepData.location = document.getElementById('step6Location').value;
            stepData.progress = document.getElementById('step6Progress').value;
            break;
        case 7:
            stepData.deliveryTime = document.getElementById('step7DeliveryTime').value;
            stepData.receivedBy = document.getElementById('step7ReceivedBy').value;
            stepData.condition = document.getElementById('step7Condition').value;
            stepData.notes = document.getElementById('step7Notes').value;
            break;
        case 8:
            stepData.feedback = document.getElementById('step8Feedback').value;
            stepData.comments = document.getElementById('step8Comments').value;
            stepData.signatureCaptured = true;
            stepData.photoCaptured = true;
            break;
    }
    
    workflowData[`step${stepNumber}`] = stepData;
}

function autoFillFormFields(stepNumber) {
    switch (stepNumber) {
        case 3:
            // Auto-calculate total amount when rate is entered
            const rateField = document.getElementById('step3Rate');
            const totalField = document.getElementById('step3TotalAmount');
            rateField.addEventListener('input', function() {
                if (workflowData.step2 && this.value) {
                    const total = parseFloat(this.value) * parseFloat(workflowData.step2.quantity);
                    totalField.value = total.toFixed(2);
                }
            });
            break;
        case 6:
            // Auto-generate tracking ID
            const trackingId = 'TRK' + Date.now().toString().slice(-6);
            document.getElementById('step6TrackingId').value = trackingId;
            document.getElementById('step6Progress').value = '0';
            break;
        case 7:
            // Set current date/time for delivery
            const now = new Date();
            const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
            document.getElementById('step7DeliveryTime').value = localDateTime;
            break;
    }
}

function completeWorkflow() {
    // Hide current form
    document.getElementById(`step8Form`).style.display = 'none';
    
    // Show completion message
    document.getElementById('workflowComplete').style.display = 'block';
    
    // Mark final step as completed
    updateWorkflowStep(7, 'completed');
    
    // Create order from workflow data
    createOrderFromWorkflow();
    
    showNotification('🎉 Complete 8-step workflow finished! Order created successfully.', 'success');
}

function createOrderFromWorkflow() {
    // Create order object from collected workflow data
    const orderData = {
        id: 'ORD' + String(Date.now()).slice(-3),
        customer: workflowData.step1.customerName,
        phone: workflowData.step1.customerPhone,
        email: workflowData.step1.customerEmail,
        priority: workflowData.step1.priority,
        pickup: workflowData.step2.pickupLocation,
        delivery: workflowData.step3.deliveryLocation,
        material: workflowData.step2.materialType,
        quantity: workflowData.step2.quantity,
        unit: workflowData.step2.unit,
        totalAmount: workflowData.step3.totalAmount,
        assignedVehicle: workflowData.step4.vehicle,
        assignedDriver: workflowData.step4.driver,
        status: 'completed',
        createdDate: new Date().toISOString().split('T')[0],
        completedDate: new Date().toISOString().split('T')[0]
    };
    
    // Add to sample data
    sampleData.orders.push(orderData);
    
    // Update UI
    updateOrderTable();
    updateDashboard();
    updatePendingOrders();
    
    // Send notifications if requested
    if (workflowData.step5.notifyCustomer) {
        sendWhatsAppNotification(orderData.phone, `Order ${orderData.id} completed successfully! Thank you for your business.`);
    }
    
    console.log('Order created from workflow:', orderData);
}

function captureSignature() {
    const signatureArea = event.target.closest('div');
    signatureArea.innerHTML = `
        <div class="signature-captured p-2">
            <i class="fas fa-check-circle fa-2x text-success mb-2"></i>
            <p class="text-success mb-0">Signature Captured ✔</p>
            <small class="text-muted">Customer: ${workflowData.step1?.customerName || 'Customer'}</small>
        </div>
    `;
    showNotification('Customer signature captured successfully', 'success');
}

function resetWorkflowForms() {
    // Reset all forms
    for (let i = 1; i <= 8; i++) {
        const form = document.getElementById(`step${i}Form`).querySelector('form');
        form.reset();
        document.getElementById(`step${i}Form`).style.display = 'none';
    }
    
    // Reset workflow state
    currentWorkflowStep = 0;
    workflowData = {};
    
    // Hide workflow container
    document.getElementById('workflowFormsContainer').style.display = 'none';
    document.getElementById('currentStepDisplay').style.display = 'none';
    document.getElementById('workflowComplete').style.display = 'none';
    
    // Reset workflow visual indicators
    resetWorkflow();
    
    showNotification('Workflow forms reset. Ready to start new workflow.', 'info');
}

// Handle delivery photo upload
document.addEventListener('DOMContentLoaded', function() {
    const deliveryPhotoInput = document.getElementById('deliveryPhoto');
    if (deliveryPhotoInput) {
        deliveryPhotoInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const photoArea = e.target.closest('div');
                photoArea.innerHTML = `
                    <div class="photo-uploaded p-2">
                        <i class="fas fa-check-circle fa-2x text-success mb-2"></i>
                        <p class="text-success mb-0">Photo Uploaded ✔</p>
                        <small class="text-muted">${e.target.files[0].name}</small>
                    </div>
                `;
                showNotification('Delivery photo uploaded successfully', 'success');
            }
        });
    }
});

function resetWorkflow() {
    // Reset all workflow steps to initial state
    const steps = document.querySelectorAll('.workflow-steps .step');
    steps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        step.classList.add('pending');
        if (index === 0) {
            step.classList.remove('pending');
            step.classList.add('active');
        }
        
        // Reset step icons
        const icon = step.querySelector('.step-icon i');
        if (icon && index === 0) {
            icon.className = 'fas fa-shopping-cart';
        } else if (icon && index === 1) {
            icon.className = 'fas fa-warehouse';
        } else if (icon && index === 2) {
            icon.className = 'fas fa-file-invoice';
        } else if (icon && index === 3) {
            icon.className = 'fas fa-user-plus';
        } else if (icon && index === 4) {
            icon.className = 'fas fa-play';
        } else if (icon && index === 5) {
            icon.className = 'fas fa-map-marker-alt';
        } else if (icon && index === 6) {
            icon.className = 'fas fa-check';
        } else if (icon && index === 7) {
            icon.className = 'fas fa-signature';
        }
    });
    
    showNotification('Workflow reset to beginning. Ready for manual processing.', 'info');
}

function highlightNewOrderInDispatch(orderId) {
    // Highlight the new order in dispatch management
    const orderElement = document.querySelector(`[data-order-id="${orderId}"]`);
    if (orderElement) {
        orderElement.style.border = '2px solid #28a745';
        orderElement.style.backgroundColor = '#d4edda';
        
        // Add a "NEW" badge
        const badge = document.createElement('span');
        badge.className = 'badge bg-success ms-2';
        badge.textContent = 'NEW';
        badge.style.animation = 'pulse 2s infinite';
        
        const orderTitle = orderElement.querySelector('h6');
        if (orderTitle) {
            orderTitle.appendChild(badge);
        }
        
        // Remove highlight after 10 seconds
        setTimeout(() => {
            orderElement.style.border = '';
            orderElement.style.backgroundColor = '';
            if (badge.parentNode) {
                badge.parentNode.removeChild(badge);
            }
        }, 10000);
    }
}

function updateWorkflowStep(stepNumber, status) {
    const step = document.querySelector(`[data-step="${stepNumber}"]`);
    if (step) {
        step.classList.remove('active', 'completed');
        step.classList.add(status);
        
        if (status === 'completed') {
            const icon = step.querySelector('.step-icon i');
            if (icon) {
                icon.className = 'fas fa-check';
            }
        }
    }
}

function contactCustomer(orderId) {
    const order = sampleData.orders.find(o => o.id === orderId);
    if (order) {
        const contactOptions = `
            <div class="btn-group-vertical w-100">
                <button class="btn btn-success mb-2" onclick="callCustomer('${order.phone}', '${order.customer}')">
                    <i class="fas fa-phone"></i> Call ${order.phone}
                </button>
                <button class="btn btn-primary mb-2" onclick="emailCustomer('${order.email}', '${order.customer}', '${orderId}')">
                    <i class="fas fa-envelope"></i> Email ${order.email}
                </button>
                <button class="btn btn-info" onclick="whatsappCustomer('${order.phone}', '${order.customer}', '${orderId}')">
                    <i class="fab fa-whatsapp"></i> WhatsApp ${order.phone}
                </button>
            </div>
        `;
        
        // Create a modal for contact options
        const modalHTML = `
            <div class="modal fade" id="contactModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title"><i class="fas fa-phone"></i> Contact Customer - ${order.customer}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-info">
                                <strong>Order:</strong> ${orderId}<br>
                                <strong>Customer:</strong> ${order.customer}<br>
                                <strong>Phone:</strong> ${order.phone}<br>
                                <strong>Email:</strong> ${order.email}
                            </div>
                            ${contactOptions}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('contactModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Show modal
        new bootstrap.Modal(document.getElementById('contactModal')).show();
    }
}

function callCustomer(phone, customerName) {
    showNotification(`Initiating call to ${customerName} at ${phone}`, 'info');
    // In real implementation, this would integrate with phone system
    bootstrap.Modal.getInstance(document.getElementById('contactModal')).hide();
}

function emailCustomer(email, customerName, orderId) {
    // Pre-fill email modal with customer details
    document.getElementById('emailRecipient').value = 'custom';
    document.getElementById('customEmailAddress').value = email;
    document.getElementById('customEmailField').style.display = 'block';
    document.getElementById('emailSubject').value = `Order Update - ${orderId}`;
    document.getElementById('emailMessage').value = `Dear ${customerName},\n\nWe have received your order ${orderId} and it is being processed.\n\nWe will keep you updated on the progress.\n\nBest regards,\nFleet Management Team`;
    
    // Close contact modal and open email modal
    bootstrap.Modal.getInstance(document.getElementById('contactModal')).hide();
    new bootstrap.Modal(document.getElementById('emailModal')).show();
}

function whatsappCustomer(phone, customerName, orderId) {
    // Pre-fill WhatsApp modal with customer details
    document.getElementById('whatsappRecipient').value = 'custom';
    document.getElementById('whatsappMessage').value = `Hi ${customerName}! Your order ${orderId} has been received and is being processed. We will keep you updated. Thanks!`;
    
    // Close contact modal and open WhatsApp modal
    bootstrap.Modal.getInstance(document.getElementById('contactModal')).hide();
    new bootstrap.Modal(document.getElementById('whatsappModal')).show();
}

// Enhanced Order Table to show integrated contact information
function updateOrderTableWithContacts() {
    const tableBody = document.getElementById('orderTable');
    if (!tableBody) return;
    
    tableBody.innerHTML = sampleData.orders.map(order => {
        const priorityClass = {
            'urgent': 'danger',
            'high': 'warning',
            'normal': 'secondary'
        }[order.priority] || 'secondary';
        
        const statusClass = {
            'pending': 'warning',
            'processing': 'info',
            'completed': 'success',
            'cancelled': 'danger'
        }[order.status] || 'secondary';
        
        return `
            <tr>
                <td><strong>${order.id}</strong></td>
                <td>
                    <div>
                        <strong>${order.customer}</strong><br>
                        <small class="text-muted">
                            <i class="fas fa-phone"></i> ${order.phone || 'N/A'}<br>
                            <i class="fas fa-envelope"></i> ${order.email || 'N/A'}
                        </small>
                    </div>
                </td>
                <td>${order.material}</td>
                <td>${order.quantity} ${order.unit}</td>
                <td><span class="badge bg-${priorityClass}">${order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}</span></td>
                <td><span class="badge bg-${statusClass}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                <td>${order.createdDate}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editOrder('${order.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-success" onclick="processOrder('${order.id}')">
                        <i class="fas fa-play"></i> Process
                    </button>
                    <button class="btn btn-sm btn-outline-info" onclick="contactCustomer('${order.id}')">
                        <i class="fas fa-phone"></i> Contact
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="removeOrder('${order.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                    ${order.status === 'completed' ? 
                        `<button class="btn btn-sm btn-outline-warning" onclick="reportDamage('${order.id}')">
                            <i class="fas fa-exclamation-triangle"></i> Damage
                        </button>` : ''
                    }
                </td>
            </tr>
        `;
    }).join('');
}

// Override the existing updateOrderTable function
function updateOrderTable() {
    updateOrderTableWithContacts();
    updateOrderCounts(); // Add this line to update counts
}

// Function to update order counts in Order Management dashboard
function updateOrderCounts() {
    const totalOrders = sampleData.orders.length;
    const pendingOrders = sampleData.orders.filter(order => order.status === 'pending').length;
    const completedOrders = sampleData.orders.filter(order => order.status === 'completed').length;
    const urgentOrders = sampleData.orders.filter(order => order.priority === 'urgent').length;
    
    // Update Order Management section counts
    const totalOrdersEl = document.getElementById('totalOrdersCount');
    const pendingOrdersEl = document.getElementById('pendingOrdersCount');
    const completedOrdersEl = document.getElementById('completedOrdersCount');
    const urgentOrdersEl = document.getElementById('urgentOrdersCount');
    
    if (totalOrdersEl) totalOrdersEl.textContent = totalOrders;
    if (pendingOrdersEl) pendingOrdersEl.textContent = pendingOrders;
    if (completedOrdersEl) completedOrdersEl.textContent = completedOrders;
    if (urgentOrdersEl) urgentOrdersEl.textContent = urgentOrders;
    
    // Also update dashboard pending orders count
    const dashboardPendingEl = document.getElementById('pendingOrders');
    if (dashboardPendingEl) dashboardPendingEl.textContent = pendingOrders;
}

// Enhanced sample data with contact information
sampleData.orders = sampleData.orders.map(order => ({
    ...order,
    phone: order.phone || '+91 98765 43210',
    email: order.email || 'customer@company.com',
    quantity: order.quantity || '100',
    unit: order.unit || 'tons'
}));

// Auto-display orders on website with integrated contact info
function displayOrdersOnWebsite() {
    // Update all order displays to show integrated contact information
    updateOrderTable();
    updatePendingOrders();
    
    // Show notification about integration
    showNotification('Sales orders now display with integrated phone and email information', 'success');
}

// Initialize the enhanced order system
document.addEventListener('DOMContentLoaded', function() {
    // Display orders with integrated contact info
    setTimeout(() => {
        displayOrdersOnWebsite();
    }, 1000);
});

// Real-time order integration - when new orders come in, they automatically display
function integrateNewSalesOrder(orderData) {
    // This function would be called when a new sales order comes from external system
    
    // Add the order to the system
    sampleData.orders.push(orderData);
    
    // Automatically flow to dispatch
    automaticOrderToDispatchFlow(orderData);
    
    // Update all displays
    displayOrdersOnWebsite();
    
    // Show integration notification
    showNotification(`New sales order ${orderData.id} integrated and displayed on website`, 'success');
    
    console.log('Sales order integrated:', orderData);
}

// Example function to simulate external sales order integration
function simulateExternalSalesOrder() {
    const externalOrder = {
        id: 'ORD' + String(Date.now()).slice(-3),
        customer: 'External Customer Ltd',
        phone: '+91 99887 76655',
        email: 'external@customer.com',
        pickup: 'External Warehouse',
        delivery: 'Customer Location',
        material: 'External Materials',
        quantity: '200',
        unit: 'boxes',
        priority: 'high',
        status: 'pending',
        createdAt: new Date().toISOString(),
        createdDate: new Date().toISOString().split('T')[0]
    };
    
    integrateNewSalesOrder(externalOrder);
}
// Mobile Application Functions
function openMobileApp() {
    // Check if we're on mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // On mobile, open in same window
        window.location.href = 'mobile-app.html';
    } else {
        // On desktop, open in popup window with mobile dimensions
        const mobileWindow = window.open(
            'mobile-app.html',
            'FleetMobileApp',
            'width=375,height=812,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no'
        );
        
        if (mobileWindow) {
            mobileWindow.focus();
            showNotification('Mobile app opened in new window', 'success');
        } else {
            // Fallback if popup blocked
            window.open('mobile-app.html', '_blank');
            showNotification('Mobile app opened in new tab', 'info');
        }
    }
}

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Enhanced mobile app integration
function launchMobileApp() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    
    if (isMobile) {
        // For mobile devices, open in same tab for better experience
        window.location.href = 'mobile-app.html';
    } else {
        // For desktop, open in popup window
        openMobileApp();
    }
}

// Add mobile app shortcut to dashboard
function addMobileAppShortcut() {
    // This would typically integrate with PWA manifest for "Add to Home Screen"
    if ('serviceWorker' in navigator) {
        showNotification('Mobile app can be added to home screen', 'info');
    }
}

// Mobile app sync function
function syncWithMobileApp() {
    // Sync data with mobile application
    const syncData = {
        orders: sampleData.orders,
        vehicles: sampleData.vehicles,
        drivers: sampleData.drivers,
        trips: sampleData.trips,
        lastSync: new Date().toISOString()
    };
    
    // Store in localStorage for mobile app access
    localStorage.setItem('fleetMobileSync', JSON.stringify(syncData));
    
    showNotification('Data synchronized with Mobile Application', 'success');
    console.log('Mobile app sync completed at', new Date().toLocaleTimeString());
}

// Auto-sync with mobile app every 30 seconds
setInterval(() => {
    syncWithMobileApp();
}, 30000);

// Initialize mobile app integration on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initial sync with mobile app
    setTimeout(() => {
        syncWithMobileApp();
    }, 3000);
});

// Order Management Functions
function removeOrder(orderId) {
    if (confirm(`Are you sure you want to remove order ${orderId}? This action cannot be undone.`)) {
        // Find and remove the order from sampleData
        const orderIndex = sampleData.orders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
            sampleData.orders.splice(orderIndex, 1);
            updateOrderTable();
            showNotification(`Order ${orderId} has been removed successfully.`, 'success');
            updateDashboard(); // Update dashboard counts
        } else {
            showNotification(`Order ${orderId} not found.`, 'error');
        }
    }
}

function reportDamage(orderId) {
    const order = sampleData.orders.find(order => order.id === orderId);
    if (!order) {
        showNotification('Order not found.', 'error');
        return;
    }
    
    // Show damage report modal
    const damageModal = `
        <div class="modal fade" id="damageReportModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="fas fa-exclamation-triangle text-warning"></i> Report Damage - Order ${orderId}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="damageReportForm">
                            <div class="mb-3">
                                <label class="form-label">Customer: <strong>${order.customer}</strong></label>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Material: <strong>${order.material}</strong></label>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Damage Type *</label>
                                <select class="form-control" id="damageType" required>
                                    <option value="">Select Damage Type</option>
                                    <option value="broken">Broken/Cracked</option>
                                    <option value="missing">Missing Items</option>
                                    <option value="water_damage">Water Damage</option>
                                    <option value="contaminated">Contaminated</option>
                                    <option value="wrong_item">Wrong Item Delivered</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Damage Description *</label>
                                <textarea class="form-control" id="damageDescription" rows="4" placeholder="Describe the damage in detail..." required></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Estimated Loss Amount</label>
                                <div class="input-group">
                                    <span class="input-group-text">₹</span>
                                    <input type="number" class="form-control" id="lossAmount" placeholder="0.00">
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Action Required</label>
                                <select class="form-control" id="actionRequired">
                                    <option value="replacement">Replacement Required</option>
                                    <option value="refund">Refund Required</option>
                                    <option value="repair">Repair Required</option>
                                    <option value="investigation">Investigation Required</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Priority Level</label>
                                <select class="form-control" id="damagePriority">
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-warning" onclick="submitDamageReport('${orderId}')">
                            <i class="fas fa-exclamation-triangle"></i> Submit Damage Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('damageReportModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', damageModal);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('damageReportModal'));
    modal.show();
}

function submitDamageReport(orderId) {
    const damageType = document.getElementById('damageType').value;
    const damageDescription = document.getElementById('damageDescription').value;
    const lossAmount = document.getElementById('lossAmount').value;
    const actionRequired = document.getElementById('actionRequired').value;
    const damagePriority = document.getElementById('damagePriority').value;
    
    if (!damageType || !damageDescription) {
        showNotification('Please fill in all required fields.', 'warning');
        return;
    }
    
    // Create damage report object
    const damageReport = {
        id: `DMG-${Date.now()}`,
        orderId: orderId,
        damageType: damageType,
        description: damageDescription,
        lossAmount: lossAmount || 0,
        actionRequired: actionRequired,
        priority: damagePriority,
        reportedDate: new Date().toLocaleDateString(),
        status: 'reported'
    };
    
    // Add to damage reports (you can store this in a separate array)
    if (!window.damageReports) {
        window.damageReports = [];
    }
    window.damageReports.push(damageReport);
    
    // Update order status to indicate damage reported
    const order = sampleData.orders.find(order => order.id === orderId);
    if (order) {
        order.status = 'damage_reported';
        order.damageReportId = damageReport.id;
    }
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('damageReportModal'));
    modal.hide();
    
    // Update table
    updateOrderTable();
    
    showNotification(`Damage report ${damageReport.id} has been submitted for order ${orderId}.`, 'success');
    
    // Send notifications
    sendDamageNotifications(orderId, damageReport);
}

function sendDamageNotifications(orderId, damageReport) {
    const order = sampleData.orders.find(order => order.id === orderId);
    if (!order) return;
    
    // WhatsApp notification
    if (order.phone) {
        const whatsappMessage = `🚨 DAMAGE REPORT ALERT
        
Order: ${orderId}
Customer: ${order.customer}
Damage Type: ${damageReport.damageType}
Action Required: ${damageReport.actionRequired}
Priority: ${damageReport.priority.toUpperCase()}

We will contact you shortly to resolve this issue.

Fleet Management Team`;
        
        sendWhatsAppNotification(order.phone, whatsappMessage);
    }
    
    // Email notification
    if (order.email) {
        const emailSubject = `Damage Report - Order ${orderId}`;
        const emailMessage = `Dear ${order.customer},

We have received a damage report for your order ${orderId}.

Damage Details:
- Type: ${damageReport.damageType}
- Description: ${damageReport.description}
- Action Required: ${damageReport.actionRequired}
- Priority: ${damageReport.priority.toUpperCase()}

Our team will contact you within 24 hours to resolve this issue.

Thank you for your patience.

Best regards,
Fleet Management Team`;
        
        sendEmailNotification(order.email, emailSubject, emailMessage);
    }
}

// Initialize Dispatch Map for Real-Time Tracking
function initializeDispatchMap() {
    const mapContainer = document.getElementById('dispatchMap');
    if (!mapContainer) {
        console.warn('Dispatch map container not found.');
        return;
    }

    try {
        if (typeof L !== 'undefined') {
            // Initialize dispatch map
            const dispatchMap = L.map('dispatchMap').setView([12.9716, 77.5946], 11);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(dispatchMap);
            
            // Add vehicle markers for dispatch
            addDispatchVehicleMarkers(dispatchMap);
            
            console.log('Dispatch map initialized successfully');
            return dispatchMap;
        } else {
            console.error('Leaflet library not loaded');
        }
    } catch (error) {
        console.error('Error initializing dispatch map:', error);
    }
}

// Add Vehicle Markers to Dispatch Map
function addDispatchVehicleMarkers(map) {
    const vehicles = [
        { id: 'V001', number: 'KA01AB1234', lat: 12.9716, lng: 77.5946, status: 'in-transit', driver: 'Ravi Kumar', speed: 45 },
        { id: 'V002', number: 'KA02CD5678', lat: 12.9352, lng: 77.6245, status: 'available', driver: 'Suresh Babu', speed: 0 },
        { id: 'V003', number: 'KA03EF9012', lat: 12.9698, lng: 77.7500, status: 'loading', driver: 'Manjunath', speed: 0 }
    ];
    
    vehicles.forEach(vehicle => {
        const iconColor = getVehicleStatusColor(vehicle.status);
        
        const vehicleIcon = L.divIcon({
            html: `<i class="fas fa-truck" style="color: ${iconColor}; font-size: 20px;"></i>`,
            iconSize: [25, 25],
            className: 'vehicle-marker'
        });
        
        const marker = L.marker([vehicle.lat, vehicle.lng], { icon: vehicleIcon })
            .addTo(map)
            .bindPopup(`
                <div class="vehicle-popup">
                    <strong>${vehicle.number}</strong><br>
                    <small>Driver: ${vehicle.driver}</small><br>
                    <small>Status: <span class="badge bg-${getStatusBadgeColor(vehicle.status)}">${vehicle.status}</span></small><br>
                    <small>Speed: ${vehicle.speed} km/h</small>
                </div>
            `);
    });
}

// Get Vehicle Status Color
function getVehicleStatusColor(status) {
    const colors = {
        'available': '#28a745',
        'in-transit': '#ffc107', 
        'loading': '#17a2b8',
        'maintenance': '#dc3545'
    };
    return colors[status] || '#6c757d';
}

// Get Status Badge Color
function getStatusBadgeColor(status) {
    const colors = {
        'available': 'success',
        'in-transit': 'warning',
        'loading': 'info', 
        'maintenance': 'danger'
    };
    return colors[status] || 'secondary';
}
// Delivery Tracking Functions (Uses GPS Data from Fleet Management)
function refreshDeliveryTracking() {
    showNotification('Delivery tracking refreshed with latest GPS data from Fleet Management', 'success');
    
    // Simulate updating delivery progress based on GPS data
    updateDeliveryProgress();
}

function updateDeliveryProgress() {
    // This function would get GPS data from Fleet Management and update delivery status
    console.log('Updating delivery progress using GPS data from Fleet Management');
    
    // Example: Update ETA based on current vehicle location and speed
    // This demonstrates how Dispatch Management uses GPS data without owning the GPS system
}

// Function to show that Dispatch uses GPS data from Fleet Management
function getGPSDataFromFleetManagement() {
    // This represents how Dispatch Management gets GPS data from Fleet Management
    return {
        vehicleLocation: { lat: 12.9716, lng: 77.5946 },
        speed: 45,
        eta: '2:30 PM',
        progress: 65
    };
}

// ===== ROUTE PLANNING & OPTIMIZATION FUNCTIONS =====
// Route Planning Functions for Dispatch Management (MAIN PLACE)

// Global route planning variables
let currentRoute = null;
let routePlanningMap = null;
let deliveryStops = [];

// Initialize Route Planning Map
function initializeRoutePlanningMap() {
    const mapContainer = document.getElementById('routePlanningMap');
    if (!mapContainer) {
        console.warn('Route planning map container not found.');
        return;
    }

    // Show route demo visualization
    const routeDemo = mapContainer.querySelector('.route-demo');
    if (routeDemo) {
        routeDemo.style.display = 'block';
    }
    
    console.log('Route planning map initialized');
}

// Plan Optimal Route
function planOptimalRoute() {
    showNotification('Planning optimal route...', 'info');
    
    // Get pending orders for route planning
    const pendingOrders = sampleData.orders.filter(order => order.status === 'pending');
    
    if (pendingOrders.length === 0) {
        showNotification('No pending orders available for route planning', 'warning');
        return;
    }
    
    // Simulate route planning process
    setTimeout(() => {
        const routeData = generateOptimalRoute(pendingOrders);
        displayRouteDetails(routeData);
        showRouteOnMap(routeData);
        showNotification('Optimal route planned successfully!', 'success');
    }, 2000);
}

// Generate Optimal Route (Simulation)
function generateOptimalRoute(orders) {
    const vehicleType = document.getElementById('routeVehicleType')?.value || 'all';
    const priorityFilter = document.getElementById('routePriorityFilter')?.value || 'all';
    const optimizationGoal = document.getElementById('optimizationGoal')?.value || 'distance';
    
    // Filter orders based on priority
    let filteredOrders = orders;
    if (priorityFilter !== 'all') {
        filteredOrders = orders.filter(order => order.priority === priorityFilter);
    }
    
    // Sort orders based on optimization goal
    if (optimizationGoal === 'urgent') {
        filteredOrders.sort((a, b) => {
            const priorityOrder = { urgent: 3, high: 2, normal: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }
    
    // Generate route data
    const totalDistance = Math.floor(Math.random() * 200) + 50; // 50-250 km
    const totalTime = Math.floor(totalDistance / 45 * 60); // Assuming 45 km/h average
    const fuelCost = Math.floor(totalDistance * 8.5); // ₹8.5 per km
    
    const routeData = {
        orders: filteredOrders.slice(0, 5), // Max 5 orders per route
        totalDistance: totalDistance,
        totalTime: totalTime,
        fuelCost: fuelCost,
        deliveryStops: filteredOrders.length,
        optimizationGoal: optimizationGoal,
        vehicleType: vehicleType,
        sequence: generateDeliverySequence(filteredOrders.slice(0, 5))
    };
    
    currentRoute = routeData;
    return routeData;
}

// Generate Delivery Sequence
function generateDeliverySequence(orders) {
    const sequence = [
        { type: 'start', location: 'Chennai Main Warehouse', time: '09:00 AM', icon: 'warehouse' }
    ];
    
    orders.forEach((order, index) => {
        const estimatedTime = new Date();
        estimatedTime.setHours(9 + Math.floor((index + 1) * 2.5));
        
        sequence.push({
            type: 'delivery',
            location: order.delivery,
            customer: order.customer,
            time: estimatedTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            priority: order.priority,
            icon: 'map-marker-alt',
            orderId: order.id
        });
    });
    
    return sequence;
}

// Display Route Details
function displayRouteDetails(routeData) {
    // Update route statistics
    document.getElementById('totalDistance').textContent = `${routeData.totalDistance} km`;
    document.getElementById('totalTime').textContent = `${Math.floor(routeData.totalTime / 60)}h ${routeData.totalTime % 60}m`;
    document.getElementById('fuelCost').textContent = `₹${routeData.fuelCost.toLocaleString()}`;
    document.getElementById('deliveryStops').textContent = routeData.deliveryStops;
    
    // Show route stats
    document.getElementById('routeStats').style.display = 'block';
    document.getElementById('deliverySequence').style.display = 'block';
    
    // Update route details
    document.getElementById('routeDetails').innerHTML = `
        <div class="alert alert-success">
            <i class="fas fa-check-circle"></i>
            <strong>Route Optimized:</strong> ${routeData.deliveryStops} stops planned with ${routeData.optimizationGoal} optimization.
        </div>
    `;
    
    // Display delivery sequence
    const sequenceList = document.getElementById('sequenceList');
    sequenceList.innerHTML = routeData.sequence.map((stop, index) => `
        <div class="sequence-item d-flex align-items-center mb-2 p-2 border rounded ${stop.type === 'start' ? 'bg-primary text-white' : 'bg-light'}">
            <div class="sequence-number me-2">
                <span class="badge ${stop.type === 'start' ? 'bg-white text-primary' : 'bg-primary'}">${index + 1}</span>
            </div>
            <div class="sequence-icon me-2">
                <i class="fas fa-${stop.icon}"></i>
            </div>
            <div class="sequence-details flex-grow-1">
                <strong>${stop.location}</strong>
                ${stop.customer ? `<br><small>Customer: ${stop.customer}</small>` : ''}
                ${stop.orderId ? `<br><small>Order: ${stop.orderId}</small>` : ''}
            </div>
            <div class="sequence-time">
                <small class="badge bg-info">${stop.time}</small>
                ${stop.priority ? `<br><small class="badge bg-${stop.priority === 'urgent' ? 'danger' : stop.priority === 'high' ? 'warning' : 'secondary'}">${stop.priority}</small>` : ''}
            </div>
        </div>
    `).join('');
}

// Show Route on Map
function showRouteOnMap(routeData) {
    const mapContainer = document.getElementById('routePlanningMap');
    
    // Update map with route visualization
    mapContainer.innerHTML = `
        <div class="route-visualization p-3">
            <div class="route-header mb-3">
                <h6><i class="fas fa-route"></i> Optimized Delivery Route</h6>
                <small class="text-muted">Total: ${routeData.totalDistance} km • ${Math.floor(routeData.totalTime / 60)}h ${routeData.totalTime % 60}m • ₹${routeData.fuelCost} fuel cost</small>
            </div>
            <div class="route-path-visual">
                ${routeData.sequence.map((stop, index) => `
                    <div class="route-stop d-flex align-items-center mb-2">
                        <div class="stop-marker ${stop.type === 'start' ? 'bg-success' : 'bg-primary'} text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 30px; height: 30px; font-size: 12px;">
                            ${stop.type === 'start' ? '<i class="fas fa-warehouse"></i>' : index}
                        </div>
                        <div class="stop-line ${index < routeData.sequence.length - 1 ? 'active' : ''}" style="width: 40px; height: 2px; background: #007bff; margin: 0 10px;"></div>
                        <div class="stop-details">
                            <strong style="font-size: 0.9rem;">${stop.location}</strong>
                            <br><small class="text-muted">${stop.time}</small>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="route-actions mt-3">
                <button class="btn btn-success btn-sm me-2" onclick="confirmRoute()">
                    <i class="fas fa-check"></i> Confirm Route
                </button>
                <button class="btn btn-warning btn-sm me-2" onclick="modifyRoute()">
                    <i class="fas fa-edit"></i> Modify
                </button>
                <button class="btn btn-info btn-sm" onclick="shareRoute()">
                    <i class="fas fa-share"></i> Share
                </button>
            </div>
        </div>
    `;
}

// Optimize Delivery Sequence
function optimizeDeliverySequence() {
    if (!currentRoute) {
        showNotification('Please plan a route first', 'warning');
        return;
    }
    
    showNotification('Optimizing delivery sequence...', 'info');
    
    setTimeout(() => {
        // Simulate sequence optimization
        const optimizedRoute = { ...currentRoute };
        optimizedRoute.totalDistance = Math.max(30, optimizedRoute.totalDistance - Math.floor(Math.random() * 20));
        optimizedRoute.totalTime = Math.floor(optimizedRoute.totalDistance / 50 * 60);
        optimizedRoute.fuelCost = Math.floor(optimizedRoute.totalDistance * 8.5);
        
        // Re-sort sequence for better optimization
        optimizedRoute.sequence = optimizedRoute.sequence.sort((a, b) => {
            if (a.type === 'start') return -1;
            if (b.type === 'start') return 1;
            if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
            if (b.priority === 'urgent' && a.priority !== 'urgent') return 1;
            return 0;
        });
        
        currentRoute = optimizedRoute;
        displayRouteDetails(optimizedRoute);
        showRouteOnMap(optimizedRoute);
        showNotification('Delivery sequence optimized! Distance reduced by 15%', 'success');
    }, 1500);
}

// Show Traffic Data
function showTrafficData() {
    showNotification('Loading real-time traffic data...', 'info');
    
    setTimeout(() => {
        const trafficAlerts = [
            { location: 'Electronic City', status: 'heavy', delay: '+15 min' },
            { location: 'Silk Board Junction', status: 'moderate', delay: '+8 min' },
            { location: 'Hosur Road', status: 'clear', delay: 'No delay' }
        ];
        
        const alertsHtml = trafficAlerts.map(alert => `
            <div class="alert alert-${alert.status === 'heavy' ? 'danger' : alert.status === 'moderate' ? 'warning' : 'success'} alert-sm mb-2">
                <i class="fas fa-traffic-light"></i>
                <strong>${alert.location}:</strong> ${alert.status.toUpperCase()} traffic (${alert.delay})
            </div>
        `).join('');
        
        document.getElementById('routeDetails').innerHTML = `
            <h6><i class="fas fa-traffic-light"></i> Live Traffic Updates</h6>
            ${alertsHtml}
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i>
                Traffic data updated every 5 minutes. Alternative routes suggested automatically.
            </div>
        `;
        
        showNotification('Traffic data loaded successfully', 'success');
    }, 1000);
}

// Apply Route Filters
function applyRouteFilters() {
    const vehicleType = document.getElementById('routeVehicleType').value;
    const priorityFilter = document.getElementById('routePriorityFilter').value;
    const optimizationGoal = document.getElementById('optimizationGoal').value;
    
    showNotification(`Filters applied: ${vehicleType} vehicles, ${priorityFilter} priority, ${optimizationGoal} optimization`, 'info');
    
    // Re-plan route with new filters
    if (currentRoute) {
        planOptimalRoute();
    }
}

// Reset Route Filters
function resetRouteFilters() {
    document.getElementById('routeVehicleType').value = 'all';
    document.getElementById('routePriorityFilter').value = 'all';
    document.getElementById('optimizationGoal').value = 'distance';
    
    showNotification('Route filters reset to default', 'info');
}

// Confirm Route
function confirmRoute() {
    if (!currentRoute) {
        showNotification('No route to confirm', 'warning');
        return;
    }
    
    showNotification('Route confirmed! Assigning to vehicles and drivers...', 'success');
    
    // Update orders status to assigned
    currentRoute.orders.forEach(order => {
        const orderIndex = sampleData.orders.findIndex(o => o.id === order.id);
        if (orderIndex > -1) {
            sampleData.orders[orderIndex].status = 'assigned';
            sampleData.orders[orderIndex].routePlanned = true;
        }
    });
    
    // Update UI
    updatePendingOrders();
    updateOrderTable();
    updateDashboard();
    
    setTimeout(() => {
        showNotification('Route assigned successfully! Vehicles are ready for dispatch.', 'success');
    }, 1500);
}

// Modify Route
function modifyRoute() {
    if (!currentRoute) {
        showNotification('No route to modify', 'warning');
        return;
    }
    
    showNotification('Route modification panel would open here', 'info');
    // In a real application, this would open a detailed route editor
}

// Share Route
function shareRoute() {
    if (!currentRoute) {
        showNotification('No route to share', 'warning');
        return;
    }
    
    const routeInfo = `Route Details:
- Total Distance: ${currentRoute.totalDistance} km
- Total Time: ${Math.floor(currentRoute.totalTime / 60)}h ${currentRoute.totalTime % 60}m
- Fuel Cost: ₹${currentRoute.fuelCost}
- Delivery Stops: ${currentRoute.deliveryStops}`;
    
    // Simulate sharing (in real app, this would integrate with WhatsApp/Email)
    showNotification('Route details copied to clipboard and shared via WhatsApp', 'success');
    console.log('Route shared:', routeInfo);
}

// Initialize route planning when dispatch section is shown
function initializeRouteManagement() {
    // Initialize route planning map
    initializeRoutePlanningMap();
    
    // Reset route planning state
    currentRoute = null;
    deliveryStops = [];
    
    // Hide route stats initially
    const routeStats = document.getElementById('routeStats');
    const deliverySequence = document.getElementById('deliverySequence');
    
    if (routeStats) routeStats.style.display = 'none';
    if (deliverySequence) deliverySequence.style.display = 'none';
    
    console.log('Route management initialized for dispatch');
}

console.log('Route Planning & Optimization functions loaded successfully');
// ===== DOCUMENT MANAGEMENT SYSTEM =====
// Document Management Functions for Insurance, RC, Permit storage and expiry alerts

// Sample document data
const sampleDocuments = [
    {
        id: 'DOC001',
        type: 'insurance',
        entity: 'TN01AB1234',
        entityName: 'TN01AB1234 - Truck',
        documentNumber: 'INS123456789',
        issuingAuthority: 'HDFC ERGO',
        issueDate: '2024-01-01',
        expiryDate: '2024-12-31',
        status: 'valid',
        fileName: 'insurance_TN01AB1234.pdf',
        notes: 'Comprehensive vehicle insurance'
    },
    {
        id: 'DOC002',
        type: 'insurance',
        entity: 'TN02CD5678',
        entityName: 'TN02CD5678 - Van',
        documentNumber: 'INS987654321',
        issuingAuthority: 'ICICI Lombard',
        issueDate: '2023-10-15',
        expiryDate: '2024-10-15',
        status: 'valid',
        fileName: 'insurance_TN02CD5678.pdf',
        notes: 'Third party insurance'
    },
    {
        id: 'DOC003',
        type: 'insurance',
        entity: 'TN03EF9012',
        entityName: 'TN03EF9012 - Truck',
        documentNumber: 'INS456789123',
        issuingAuthority: 'Bajaj Allianz',
        issueDate: '2023-04-20',
        expiryDate: '2024-04-20',
        status: 'expiring',
        fileName: 'insurance_TN03EF9012.pdf',
        notes: 'Expires soon - renewal required'
    },
    {
        id: 'DOC004',
        type: 'rc',
        entity: 'TN01AB1234',
        entityName: 'TN01AB1234 - Truck',
        documentNumber: 'RC123456789',
        issuingAuthority: 'RTO Chennai',
        issueDate: '2020-01-15',
        expiryDate: '2035-01-15',
        status: 'valid',
        fileName: 'rc_TN01AB1234.pdf',
        notes: 'Registration certificate'
    },
    {
        id: 'DOC005',
        type: 'fitness',
        entity: 'TN05IJ7890',
        entityName: 'TN05IJ7890 - Bus',
        documentNumber: 'FIT321654987',
        issuingAuthority: 'RTO Chennai',
        issueDate: '2023-03-25',
        expiryDate: '2024-03-25',
        status: 'expired',
        fileName: 'fitness_TN05IJ7890.pdf',
        notes: 'Fitness certificate expired - renewal urgent'
    },
    {
        id: 'DOC006',
        type: 'license',
        entity: 'D005',
        entityName: 'Robert Brown - Driver',
        documentNumber: 'DL321654987',
        issuingAuthority: 'RTO Trichy',
        issueDate: '2019-02-15',
        expiryDate: '2024-02-15',
        status: 'expiring',
        fileName: 'license_D005.pdf',
        notes: 'PSV license expiring soon'
    },
    {
        id: 'DOC007',
        type: 'permit',
        entity: 'TN01AB1234',
        entityName: 'TN01AB1234 - Truck',
        documentNumber: 'PER789123456',
        issuingAuthority: 'Transport Authority',
        issueDate: '2023-06-01',
        expiryDate: '2025-06-01',
        status: 'valid',
        fileName: 'permit_TN01AB1234.pdf',
        notes: 'Interstate transport permit'
    }
];

// Initialize Document Management
function initializeDocumentManagement() {
    updateDocumentsTable();
    updateDocumentStatistics();
    updateExpiryAlerts();
    console.log('Document Management System initialized');
}

// Update Documents Table
function updateDocumentsTable() {
    const tableBody = document.getElementById('documentsTable');
    if (!tableBody) return;
    
    tableBody.innerHTML = sampleDocuments.map(doc => {
        const statusClass = {
            'valid': 'success',
            'expiring': 'warning',
            'expired': 'danger'
        }[doc.status] || 'secondary';
        
        const typeIcon = {
            'insurance': 'shield-alt',
            'rc': 'id-card',
            'fitness': 'check-circle',
            'pollution': 'leaf',
            'permit': 'certificate',
            'license': 'id-badge',
            'other': 'file-alt'
        }[doc.type] || 'file-alt';
        
        const expiryDate = new Date(doc.expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        
        return `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <i class="fas fa-${typeIcon} text-primary me-2"></i>
                        <div>
                            <strong>${doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}</strong>
                            ${doc.notes ? `<br><small class="text-muted">${doc.notes}</small>` : ''}
                        </div>
                    </div>
                </td>
                <td>
                    <strong>${doc.entityName}</strong>
                </td>
                <td>
                    <code>${doc.documentNumber}</code><br>
                    <small class="text-muted">${doc.issuingAuthority}</small>
                </td>
                <td>
                    ${new Date(doc.issueDate).toLocaleDateString()}
                </td>
                <td>
                    ${new Date(doc.expiryDate).toLocaleDateString()}
                    ${daysUntilExpiry <= 30 && daysUntilExpiry > 0 ? `<br><small class="text-warning">${daysUntilExpiry} days left</small>` : ''}
                    ${daysUntilExpiry <= 0 ? `<br><small class="text-danger">Expired ${Math.abs(daysUntilExpiry)} days ago</small>` : ''}
                </td>
                <td>
                    <span class="badge bg-${statusClass}">${doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewDocument('${doc.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-success" onclick="downloadDocument('${doc.id}')">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning" onclick="renewDocument('${doc.entity}', '${doc.type}')">
                        <i class="fas fa-redo"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteDocument('${doc.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Update Document Statistics
function updateDocumentStatistics() {
    const totalDocs = sampleDocuments.length;
    const validDocs = sampleDocuments.filter(doc => doc.status === 'valid').length;
    const expiringDocs = sampleDocuments.filter(doc => doc.status === 'expiring').length;
    const expiredDocs = sampleDocuments.filter(doc => doc.status === 'expired').length;
    
    // Update dashboard cards
    const totalDocsEl = document.getElementById('totalDocuments');
    const validDocsEl = document.getElementById('validDocuments');
    const expiringDocsEl = document.getElementById('expiringDocuments');
    const expiredDocsEl = document.getElementById('expiredDocuments');
    
    if (totalDocsEl) totalDocsEl.textContent = totalDocs;
    if (validDocsEl) validDocsEl.textContent = validDocs;
    if (expiringDocsEl) expiringDocsEl.textContent = expiringDocs;
    if (expiredDocsEl) expiredDocsEl.textContent = expiredDocs;
}

// Update Expiry Alerts
function updateExpiryAlerts() {
    const alertsContainer = document.getElementById('expiryAlerts');
    if (!alertsContainer) return;
    
    const today = new Date();
    const alerts = [];
    
    sampleDocuments.forEach(doc => {
        const expiryDate = new Date(doc.expiryDate);
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry <= 0) {
            alerts.push({
                type: 'danger',
                icon: 'exclamation-circle',
                title: 'EXPIRED',
                message: `${doc.entityName} - ${doc.type.charAt(0).toUpperCase() + doc.type.slice(1)} expired on ${expiryDate.toLocaleDateString()} (${Math.abs(daysUntilExpiry)} days ago)`,
                entity: doc.entity,
                docType: doc.type
            });
        } else if (daysUntilExpiry <= 30) {
            alerts.push({
                type: 'warning',
                icon: 'clock',
                title: 'EXPIRING SOON',
                message: `${doc.entityName} - ${doc.type.charAt(0).toUpperCase() + doc.type.slice(1)} expires on ${expiryDate.toLocaleDateString()} (${daysUntilExpiry} days)`,
                entity: doc.entity,
                docType: doc.type
            });
        }
    });
    
    if (alerts.length === 0) {
        alertsContainer.innerHTML = `
            <div class="alert alert-success">
                <i class="fas fa-check-circle"></i>
                <strong>All Good!</strong> No documents are expired or expiring soon.
            </div>
        `;
    } else {
        alertsContainer.innerHTML = alerts.map(alert => `
            <div class="alert alert-${alert.type}">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <i class="fas fa-${alert.icon}"></i>
                        <strong>${alert.title}:</strong> ${alert.message}
                    </div>
                    <button class="btn btn-outline-${alert.type} btn-sm" onclick="renewDocument('${alert.entity}', '${alert.docType}')">
                        <i class="fas fa-redo"></i> Renew
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Document Management Functions
function manageInsuranceDocuments() {
    showNotification('Opening Insurance Document Management...', 'info');
    // Filter and show only insurance documents
    filterDocumentsByType('insurance');
}

function manageRCDocuments() {
    showNotification('Opening RC Document Management...', 'info');
    // Filter and show only RC documents
    filterDocumentsByType('rc');
}

function managePermitDocuments() {
    showNotification('Opening Permit Document Management...', 'info');
    // Filter and show only permit documents
    filterDocumentsByType('permit');
}

function filterDocumentsByType(type) {
    const tableBody = document.getElementById('documentsTable');
    if (!tableBody) return;
    
    const filteredDocs = sampleDocuments.filter(doc => doc.type === type);
    
    // Update table with filtered documents
    tableBody.innerHTML = filteredDocs.map(doc => {
        const statusClass = {
            'valid': 'success',
            'expiring': 'warning',
            'expired': 'danger'
        }[doc.status] || 'secondary';
        
        const typeIcon = {
            'insurance': 'shield-alt',
            'rc': 'id-card',
            'fitness': 'check-circle',
            'pollution': 'leaf',
            'permit': 'certificate',
            'license': 'id-badge',
            'other': 'file-alt'
        }[doc.type] || 'file-alt';
        
        return `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <i class="fas fa-${typeIcon} text-primary me-2"></i>
                        <div>
                            <strong>${doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}</strong>
                            ${doc.notes ? `<br><small class="text-muted">${doc.notes}</small>` : ''}
                        </div>
                    </div>
                </td>
                <td><strong>${doc.entityName}</strong></td>
                <td>
                    <code>${doc.documentNumber}</code><br>
                    <small class="text-muted">${doc.issuingAuthority}</small>
                </td>
                <td>${new Date(doc.issueDate).toLocaleDateString()}</td>
                <td>${new Date(doc.expiryDate).toLocaleDateString()}</td>
                <td><span class="badge bg-${statusClass}">${doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewDocument('${doc.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-success" onclick="downloadDocument('${doc.id}')">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning" onclick="renewDocument('${doc.entity}', '${doc.type}')">
                        <i class="fas fa-redo"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    showNotification(`Showing ${filteredDocs.length} ${type} documents`, 'info');
}

// Document Actions
function viewDocument(docId) {
    const doc = sampleDocuments.find(d => d.id === docId);
    if (doc) {
        showNotification(`Opening ${doc.fileName}...`, 'info');
        // In real implementation, this would open the document file
        console.log('Viewing document:', doc);
    }
}

function downloadDocument(docId) {
    const doc = sampleDocuments.find(d => d.id === docId);
    if (doc) {
        showNotification(`Downloading ${doc.fileName}...`, 'success');
        // In real implementation, this would trigger file download
        console.log('Downloading document:', doc);
    }
}

function renewDocument(entity, docType) {
    showNotification(`Initiating renewal process for ${entity} - ${docType}...`, 'info');
    
    setTimeout(() => {
        showNotification(`Renewal reminder sent for ${entity} ${docType}. Please upload new document when available.`, 'success');
    }, 1000);
}

function deleteDocument(docId) {
    const doc = sampleDocuments.find(d => d.id === docId);
    if (doc && confirm(`Are you sure you want to delete ${doc.fileName}?`)) {
        const index = sampleDocuments.findIndex(d => d.id === docId);
        if (index > -1) {
            sampleDocuments.splice(index, 1);
            updateDocumentsTable();
            updateDocumentStatistics();
            updateExpiryAlerts();
            showNotification('Document deleted successfully', 'success');
        }
    }
}

// Handle Document Upload
function handleDocumentUpload(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const documentData = {
        id: 'DOC' + String(Date.now()).slice(-3),
        type: document.getElementById('documentType').value,
        entity: document.getElementById('documentEntity').value,
        entityName: document.getElementById('documentEntity').selectedOptions[0].text,
        documentNumber: document.getElementById('documentNumber').value,
        issuingAuthority: document.getElementById('issuingAuthority').value,
        issueDate: document.getElementById('issueDate').value,
        expiryDate: document.getElementById('expiryDate').value,
        fileName: document.getElementById('documentFile').files[0]?.name || 'document.pdf',
        notes: document.getElementById('documentNotes').value,
        status: 'valid'
    };
    
    // Check if expiring soon
    const expiryDate = new Date(documentData.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 0) {
        documentData.status = 'expired';
    } else if (daysUntilExpiry <= 30) {
        documentData.status = 'expiring';
    }
    
    // Add to sample data
    sampleDocuments.push(documentData);
    
    // Update UI
    updateDocumentsTable();
    updateDocumentStatistics();
    updateExpiryAlerts();
    
    // Close modal and reset form
    bootstrap.Modal.getInstance(document.getElementById('uploadDocumentModal')).hide();
    event.target.reset();
    
    showNotification(`Document ${documentData.fileName} uploaded successfully!`, 'success');
}

// Export and Refresh Functions
function exportDocuments() {
    showNotification('Exporting document data...', 'info');
    setTimeout(() => {
        showNotification('Document data exported successfully', 'success');
    }, 1500);
}

function refreshDocuments() {
    updateDocumentsTable();
    updateDocumentStatistics();
    updateExpiryAlerts();
    showNotification('Document data refreshed', 'success');
}

console.log('Document Management System functions loaded successfully');
// ===== GOOGLE MAPS API INTEGRATION =====
// Enhanced Route Planning with Google Maps API, Start Location, Multiple Delivery Points, Route Lines

// Global Google Maps variables
let googleMap = null;
let directionsService = null;
let directionsRenderer = null;
let googleMapsLoaded = false;
let deliveryMarkers = [];
let warehouseMarker = null;

// Sample delivery locations for demonstration
const sampleDeliveryLocations = [
    { name: 'ABC Corporation', address: 'Electronic City, Bangalore', lat: 12.8456, lng: 77.6603, priority: 'urgent' },
    { name: 'XYZ Industries', address: 'Koramangala, Bangalore', lat: 12.9279, lng: 77.6271, priority: 'high' },
    { name: 'PQR Logistics', address: 'Whitefield, Bangalore', lat: 12.9698, lng: 77.7500, priority: 'normal' },
    { name: 'LMN Company', address: 'Indiranagar, Bangalore', lat: 12.9719, lng: 77.6412, priority: 'normal' }
];

// Warehouse location (start point)
const warehouseLocation = {
    name: 'Chennai Main Warehouse',
    address: 'Chennai Port, Chennai',
    lat: 13.0827,
    lng: 80.2707
};

// Initialize Google Maps API callback
function initGoogleMapsAPI() {
    googleMapsLoaded = true;
    console.log('Google Maps API loaded successfully');
}

// Initialize Google Maps
function initializeGoogleMaps() {
    if (!googleMapsLoaded) {
        showNotification('Google Maps API is loading... Please wait.', 'info');
        // Fallback to demo mode
        showRouteDemoMode();
        return;
    }
    
    const mapContainer = document.getElementById('googleMapContainer');
    const placeholder = document.getElementById('mapPlaceholder');
    
    if (!mapContainer) {
        console.error('Google Maps container not found');
        return;
    }
    
    // Hide placeholder and show map container
    placeholder.style.display = 'none';
    mapContainer.style.display = 'block';
    
    // Initialize Google Map
    googleMap = new google.maps.Map(mapContainer, {
        zoom: 8,
        center: warehouseLocation,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ]
    });
    
    // Initialize directions service and renderer
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
            strokeColor: '#007bff',
            strokeWeight: 4,
            strokeOpacity: 0.8
        }
    });
    directionsRenderer.setMap(googleMap);
    
    // Add warehouse marker (start location)
    addWarehouseMarker();
    
    // Add delivery point markers
    addDeliveryPointMarkers();
    
    showNotification('Google Maps initialized successfully!', 'success');
}

// Add Warehouse Marker (Start Location)
function addWarehouseMarker() {
    if (!googleMap) return;
    
    const warehouseIcon = {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#28a745">
                <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z"/>
                <path d="M12 8v8M8 12h8" stroke="white" stroke-width="2"/>
            </svg>
        `),
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 40)
    };
    
    warehouseMarker = new google.maps.Marker({
        position: warehouseLocation,
        map: googleMap,
        icon: warehouseIcon,
        title: warehouseLocation.name,
        zIndex: 1000
    });
    
    // Add info window for warehouse
    const warehouseInfoWindow = new google.maps.InfoWindow({
        content: `
            <div style="padding: 10px;">
                <h6><i class="fas fa-warehouse"></i> ${warehouseLocation.name}</h6>
                <p class="mb-1"><strong>Start Location</strong></p>
                <p class="mb-0">${warehouseLocation.address}</p>
            </div>
        `
    });
    
    warehouseMarker.addListener('click', () => {
        warehouseInfoWindow.open(googleMap, warehouseMarker);
    });
}

// Add Multiple Delivery Point Markers
function addDeliveryPointMarkers() {
    if (!googleMap) return;
    
    // Clear existing markers
    deliveryMarkers.forEach(marker => marker.setMap(null));
    deliveryMarkers = [];
    
    sampleDeliveryLocations.forEach((location, index) => {
        const priorityColor = {
            'urgent': '#dc3545',
            'high': '#ffc107',
            'normal': '#007bff'
        }[location.priority] || '#007bff';
        
        const deliveryIcon = {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="${priorityColor}">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5" fill="white"/>
                    <text x="12" y="13" text-anchor="middle" fill="white" font-size="8" font-weight="bold">${index + 1}</text>
                </svg>
            `),
            scaledSize: new google.maps.Size(30, 30),
            anchor: new google.maps.Point(15, 30)
        };
        
        const marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: googleMap,
            icon: deliveryIcon,
            title: location.name,
            zIndex: 100 + index
        });
        
        // Add info window for delivery point
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px;">
                    <h6><i class="fas fa-map-marker-alt"></i> Stop ${index + 1}: ${location.name}</h6>
                    <p class="mb-1"><strong>Priority:</strong> <span class="badge" style="background-color: ${priorityColor}; color: white;">${location.priority.toUpperCase()}</span></p>
                    <p class="mb-0">${location.address}</p>
                </div>
            `
        });
        
        marker.addListener('click', () => {
            infoWindow.open(googleMap, marker);
        });
        
        deliveryMarkers.push(marker);
    });
}

// Plan Route with Google Maps Directions API
function planGoogleMapsRoute() {
    if (!googleMap || !directionsService) {
        showNotification('Google Maps not initialized. Using demo mode.', 'warning');
        showRouteDemoMode();
        return;
    }
    
    showNotification('Planning optimal route with Google Maps...', 'info');
    
    // Create waypoints from delivery locations
    const waypoints = sampleDeliveryLocations.map(location => ({
        location: { lat: location.lat, lng: location.lng },
        stopover: true
    }));
    
    // Configure route request
    const request = {
        origin: warehouseLocation,
        destination: warehouseLocation, // Return to warehouse
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
    };
    
    // Calculate route
    directionsService.route(request, (result, status) => {
        if (status === 'OK') {
            // Display route on map
            directionsRenderer.setDirections(result);
            
            // Extract route information
            const route = result.routes[0];
            const legs = route.legs;
            
            let totalDistance = 0;
            let totalDuration = 0;
            
            legs.forEach(leg => {
                totalDistance += leg.distance.value;
                totalDuration += leg.duration.value;
            });
            
            // Update route statistics
            updateGoogleMapsRouteStats(totalDistance, totalDuration, result);
            
            showNotification('Route planned successfully with Google Maps!', 'success');
        } else {
            console.error('Directions request failed:', status);
            showNotification('Failed to plan route. Using demo mode.', 'error');
            showRouteDemoMode();
        }
    });
}

// Update Route Statistics from Google Maps
function updateGoogleMapsRouteStats(totalDistance, totalDuration, directionsResult) {
    const distanceKm = (totalDistance / 1000).toFixed(1);
    const durationHours = Math.floor(totalDuration / 3600);
    const durationMinutes = Math.floor((totalDuration % 3600) / 60);
    const estimatedFuelCost = Math.floor(distanceKm * 8.5); // ₹8.5 per km
    
    // Update route details
    document.getElementById('totalDistance').textContent = `${distanceKm} km`;
    document.getElementById('totalTime').textContent = `${durationHours}h ${durationMinutes}m`;
    document.getElementById('fuelCost').textContent = `₹${estimatedFuelCost}`;
    document.getElementById('deliveryStops').textContent = sampleDeliveryLocations.length;
    
    // Show route stats
    document.getElementById('routeStats').style.display = 'block';
    document.getElementById('deliverySequence').style.display = 'block';
    
    // Update delivery sequence with optimized order
    updateOptimizedDeliverySequence(directionsResult);
    
    // Update route details
    document.getElementById('routeDetails').innerHTML = `
        <div class="alert alert-success">
            <i class="fas fa-check-circle"></i>
            <strong>Google Maps Route Optimized:</strong> ${sampleDeliveryLocations.length} stops planned with real-time traffic data.
        </div>
        <div class="route-summary">
            <h6><i class="fas fa-route"></i> Route Summary</h6>
            <ul class="list-unstyled">
                <li><i class="fas fa-road"></i> Total Distance: ${distanceKm} km</li>
                <li><i class="fas fa-clock"></i> Estimated Time: ${durationHours}h ${durationMinutes}m</li>
                <li><i class="fas fa-rupee-sign"></i> Fuel Cost: ₹${estimatedFuelCost}</li>
                <li><i class="fas fa-map-marker-alt"></i> Delivery Stops: ${sampleDeliveryLocations.length}</li>
            </ul>
        </div>
    `;
}

// Update Optimized Delivery Sequence
function updateOptimizedDeliverySequence(directionsResult) {
    const route = directionsResult.routes[0];
    const waypointOrder = route.waypoint_order;
    
    // Reorder delivery locations based on Google Maps optimization
    const optimizedLocations = waypointOrder.map(index => sampleDeliveryLocations[index]);
    
    const sequence = [
        { type: 'start', location: warehouseLocation.name, time: '09:00 AM', icon: 'warehouse' }
    ];
    
    optimizedLocations.forEach((location, index) => {
        const estimatedTime = new Date();
        estimatedTime.setHours(9 + Math.floor((index + 1) * 1.5));
        
        sequence.push({
            type: 'delivery',
            location: location.name,
            address: location.address,
            time: estimatedTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            priority: location.priority,
            icon: 'map-marker-alt',
            optimized: true
        });
    });
    
    // Add return to warehouse
    sequence.push({
        type: 'return',
        location: warehouseLocation.name,
        time: 'End of Day',
        icon: 'warehouse'
    });
    
    // Display optimized sequence
    const sequenceList = document.getElementById('sequenceList');
    sequenceList.innerHTML = sequence.map((stop, index) => `
        <div class="sequence-item d-flex align-items-center mb-2 p-2 border rounded ${stop.type === 'start' ? 'bg-success text-white' : stop.type === 'return' ? 'bg-primary text-white' : 'bg-light'}">
            <div class="sequence-number me-2">
                <span class="badge ${stop.type === 'start' || stop.type === 'return' ? 'bg-white text-dark' : 'bg-primary'}">${index + 1}</span>
            </div>
            <div class="sequence-icon me-2">
                <i class="fas fa-${stop.icon}"></i>
            </div>
            <div class="sequence-details flex-grow-1">
                <strong>${stop.location}</strong>
                ${stop.address ? `<br><small>${stop.address}</small>` : ''}
                ${stop.optimized ? '<br><small class="text-success"><i class="fas fa-check"></i> Google Maps Optimized</small>' : ''}
            </div>
            <div class="sequence-time">
                <small class="badge bg-info">${stop.time}</small>
                ${stop.priority ? `<br><small class="badge bg-${stop.priority === 'urgent' ? 'danger' : stop.priority === 'high' ? 'warning' : 'secondary'}">${stop.priority}</small>` : ''}
            </div>
        </div>
    `).join('');
}

// Fallback Demo Mode
function showRouteDemoMode() {
    const mapContainer = document.getElementById('googleMapContainer');
    const placeholder = document.getElementById('mapPlaceholder');
    const routeDemo = document.querySelector('.route-demo');
    
    if (mapContainer) mapContainer.style.display = 'none';
    if (placeholder) placeholder.style.display = 'none';
    if (routeDemo) routeDemo.style.display = 'block';
    
    // Simulate route planning
    setTimeout(() => {
        const routeData = generateOptimalRoute(sampleData.orders.filter(o => o.status === 'pending'));
        displayRouteDetails(routeData);
        showRouteOnMap(routeData);
    }, 1000);
}

// Enhanced Plan Optimal Route (with Google Maps integration)
function planOptimalRoute() {
    if (googleMap && directionsService) {
        planGoogleMapsRoute();
    } else {
        // Initialize Google Maps first
        initializeGoogleMaps();
        setTimeout(() => {
            if (googleMap && directionsService) {
                planGoogleMapsRoute();
            } else {
                // Fallback to original route planning
                showNotification('Using demo route planning...', 'info');
                const pendingOrders = sampleData.orders.filter(order => order.status === 'pending');
                
                if (pendingOrders.length === 0) {
                    showNotification('No pending orders available for route planning', 'warning');
                    return;
                }
                
                setTimeout(() => {
                    const routeData = generateOptimalRoute(pendingOrders);
                    displayRouteDetails(routeData);
                    showRouteOnMap(routeData);
                    showNotification('Demo route planned successfully!', 'success');
                }, 2000);
            }
        }, 1000);
    }
}

console.log('Google Maps API Integration functions loaded successfully');

// ===== DISPATCH DASHBOARD FUNCTIONS =====
// Dispatch Dashboard Management Functions

function showDispatchSection(section) {
    // Remove active class from all menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to clicked menu item
    event.target.closest('.menu-item').classList.add('active');
    
    // Handle different sections
    switch(section) {
        case 'overview':
            showDispatchOverview();
            break;
        case 'orders':
            showDispatchOrders();
            break;
        case 'tracking':
            showDispatchTracking();
            break;
        case 'pod':
            showDispatchPOD();
            break;
        case 'analytics':
            showDispatchAnalytics();
            break;
        default:
            showDispatchOverview();
    }
    
    showNotification(`Switched to ${section} section`, 'info');
}

function showDispatchOverview() {
    // This is the default view - dashboard is already visible
    updateDispatchDashboard();
}

function showDispatchOrders() {
    // Show order tracking and pending orders
    showNotification('Loading order tracking...', 'info');
    updatePendingOrders();
    filterDispatchOrders();
}

function showDispatchTracking() {
    // Show active trip tracking
    showNotification('Loading active trip tracking...', 'info');
    updateActiveTrips();
    initializeDispatchMap();
}

function showDispatchPOD() {
    // Show proof of delivery management
    showNotification('Loading POD management...', 'info');
    updatePODList();
}

function showDispatchAnalytics() {
    // Show analytics and reports
    showNotification('Loading dispatch analytics...', 'info');
    generateDispatchAnalytics();
}

function refreshDispatchDashboard() {
    showNotification('Refreshing dispatch dashboard...', 'info');
    
    // Update all KPI values with real-time data
    updateDispatchKPIs();
    
    // Update quick stats
    updateQuickStats();
    
    // Refresh charts
    updateDispatchCharts();
    
    // Update pending orders and resources
    updatePendingOrders();
    updateAvailableResources();
    updateActiveTrips();
    
    showNotification('Dashboard refreshed successfully!', 'success');
}

function updateDispatchDashboard() {
    updateDispatchKPIs();
    updateQuickStats();
    initializeDispatchCharts();
}

function updateDispatchKPIs() {
    // Calculate real-time KPI values
    const totalOrders = sampleData.orders.length;
    const activeTrips = sampleData.trips.filter(t => t.status === 'in-transit').length;
    const completedTrips = sampleData.trips.filter(t => t.status === 'completed').length;
    
    // Calculate revenue (example calculation)
    const revenue = completedTrips * 150; // ₹150 per completed trip
    
    // Calculate rating (example calculation)
    const rating = Math.min(8.5 + (completedTrips * 0.1), 10.0);
    
    // Update KPI displays
    document.getElementById('dashboardTotalOrders').textContent = totalOrders;
    document.getElementById('dashboardActiveTrips').textContent = activeTrips;
    
    // Update revenue display
    const revenueElement = document.querySelector('.revenue-card .kpi-value');
    if (revenueElement) {
        revenueElement.textContent = `₹ ${revenue}`;
    }
    
    // Update rating display
    const ratingElement = document.querySelector('.rating-card .kpi-value');
    if (ratingElement) {
        ratingElement.textContent = rating.toFixed(1);
    }
    
    // Add live update animation
    document.querySelectorAll('.kpi-card').forEach(card => {
        card.classList.add('live-update');
        setTimeout(() => card.classList.remove('live-update'), 3000);
    });
}

function updateQuickStats() {
    // Update quick stats with real-time data
    const pendingOrders = sampleData.orders.filter(o => o.status === 'pending').length;
    const availableVehicles = sampleData.vehicles.filter(v => v.status === 'available').length;
    const availableDrivers = sampleData.drivers.filter(d => d.availability === 'available').length;
    const podPending = sampleData.trips.filter(t => t.status === 'completed' && !t.podCompleted).length;
    
    // Update displays
    const quickStatsPending = document.getElementById('quickStatsPending');
    const quickStatsVehicles = document.getElementById('quickStatsVehicles');
    const quickStatsDrivers = document.getElementById('quickStatsDrivers');
    const quickStatsPOD = document.getElementById('quickStatsPOD');
    
    if (quickStatsPending) quickStatsPending.textContent = pendingOrders;
    if (quickStatsVehicles) quickStatsVehicles.textContent = availableVehicles;
    if (quickStatsDrivers) quickStatsDrivers.textContent = availableDrivers;
    if (quickStatsPOD) quickStatsPOD.textContent = podPending;
}

function initializeDispatchCharts() {
    // Initialize Chart.js charts for dispatch dashboard
    initializeBarChart();
    initializeDonutChart();
    initializeAreaChart();
}

function initializeBarChart() {
    const ctx = document.getElementById('dispatchBarChart');
    if (!ctx) return;
    
    // Sample data for dispatch performance
    const data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Orders Dispatched',
            data: [12, 19, 15, 25, 22, 18, 20],
            backgroundColor: 'rgba(0, 123, 255, 0.8)',
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 1
        }, {
            label: 'Orders Delivered',
            data: [10, 16, 13, 22, 20, 15, 18],
            backgroundColor: 'rgba(40, 167, 69, 0.8)',
            borderColor: 'rgba(40, 167, 69, 1)',
            borderWidth: 1
        }]
    };
    
    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

function initializeDonutChart() {
    const ctx = document.getElementById('deliveryDonutChart');
    if (!ctx) return;
    
    const data = {
        labels: ['Completed', 'In Progress', 'Pending'],
        datasets: [{
            data: [65, 25, 10],
            backgroundColor: [
                '#007bff',
                '#ffc107',
                '#dc3545'
            ],
            borderWidth: 2,
            borderColor: '#fff'
        }]
    };
    
    new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            cutout: '70%'
        }
    });
}

function initializeAreaChart() {
    const ctx = document.getElementById('orderTrendsChart');
    if (!ctx) return;
    
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'This Week',
            data: [30, 45, 35, 50, 40, 60],
            borderColor: '#007bff',
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            fill: true,
            tension: 0.4
        }, {
            label: 'Last Week',
            data: [25, 35, 30, 40, 35, 45],
            borderColor: '#ffc107',
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function updateDispatchCharts() {
    // Update chart data with real-time information
    showNotification('Updating dispatch charts...', 'info');
    
    // Re-initialize charts with new data
    setTimeout(() => {
        initializeDispatchCharts();
        showNotification('Charts updated successfully!', 'success');
    }, 1000);
}

function updatePODList() {
    // Update proof of delivery list
    const completedTrips = sampleData.trips.filter(t => t.status === 'completed');
    showNotification(`Found ${completedTrips.length} completed deliveries for POD`, 'info');
}

function generateDispatchAnalytics() {
    // Generate analytics data
    const analytics = {
        totalOrders: sampleData.orders.length,
        completedOrders: sampleData.orders.filter(o => o.status === 'completed').length,
        pendingOrders: sampleData.orders.filter(o => o.status === 'pending').length,
        activeTrips: sampleData.trips.filter(t => t.status === 'in-transit').length,
        onTimeDeliveryRate: '94%',
        avgDeliveryTime: '2.5 hours'
    };
    
    showNotification(`Analytics generated: ${analytics.totalOrders} total orders, ${analytics.onTimeDeliveryRate} on-time rate`, 'success');
}

// Auto-refresh dispatch dashboard every 30 seconds
setInterval(() => {
    if (document.getElementById('dispatch').style.display !== 'none') {
        updateDispatchKPIs();
        updateQuickStats();
    }
}, 30000);

console.log('Dispatch Dashboard functions loaded successfully');

// ===== ROUTE TRACKING MAP FUNCTIONS =====
// Route Tracking Map Functions for Live Vehicle Monitoring

let routeTrackingMap = null;
let routeVehicleMarkers = {};
let routePolylines = {};
let trafficLayerEnabled = false;

function initializeRouteTrackingMap() {
    const mapContainer = document.getElementById('routeTrackingMap');
    if (!mapContainer) {
        console.error('Route tracking map container not found');
        showNotification('Route tracking map container not found', 'error');
        return;
    }
    
    console.log('Initializing route tracking map...');
    showNotification('Initializing route tracking map...', 'info');
    
    // Clear the placeholder content
    mapContainer.innerHTML = '';
    
    try {
        // Initialize Leaflet map
        routeTrackingMap = L.map('routeTrackingMap').setView([13.0827, 80.2707], 11);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(routeTrackingMap);
        
        // Add vehicle markers and routes
        addRouteVehicleMarkers();
        addRoutePolylines();
        updateActiveVehiclesList();
        
        // Start real-time updates
        startRouteTrackingUpdates();
        
        console.log('Route tracking map initialized successfully');
        showNotification('Route tracking map initialized successfully!', 'success');
        
    } catch (error) {
        console.error('Error initializing route tracking map:', error);
        showNotification('Error initializing route tracking map: ' + error.message, 'error');
        
        // Fallback: show a message in the map container
        mapContainer.innerHTML = `
            <div class="d-flex align-items-center justify-content-center h-100 bg-light">
                <div class="text-center">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <h5>Map Loading Error</h5>
                    <p class="text-muted">Unable to load the route tracking map</p>
                    <button class="btn btn-primary" onclick="forceInitializeRouteMap()">
                        <i class="fas fa-redo"></i> Try Again
                    </button>
                </div>
            </div>
        `;
    }
}

function addRouteVehicleMarkers() {
    if (!routeTrackingMap) return;
    
    // Sample vehicle data with routes
    const vehiclesOnRoute = [
        {
            id: 'V001',
            number: 'TN01AB1234',
            driver: 'John Doe',
            route: 'Chennai to Bangalore',
            lat: 13.0827,
            lng: 80.2707,
            speed: 45,
            status: 'in-transit',
            progress: 65,
            eta: '2.5 hours',
            color: '#28a745'
        },
        {
            id: 'V002',
            number: 'TN02CD5678',
            driver: 'Jane Smith',
            route: 'Chennai to Coimbatore',
            lat: 13.0878,
            lng: 80.2785,
            speed: 52,
            status: 'in-transit',
            progress: 40,
            eta: '3.2 hours',
            color: '#007bff'
        },
        {
            id: 'V004',
            number: 'TN04GH3456',
            driver: 'Sarah Wilson',
            route: 'Chennai to Madurai',
            lat: 13.0912,
            lng: 80.2823,
            speed: 38,
            status: 'in-transit',
            progress: 25,
            eta: '4.1 hours',
            color: '#ffc107'
        }
    ];
    
    vehiclesOnRoute.forEach(vehicle => {
        // Create custom icon
        const vehicleIcon = L.divIcon({
            className: 'custom-vehicle-marker',
            html: `
                <div class="vehicle-marker-container" style="background-color: ${vehicle.color};">
                    <i class="fas fa-truck"></i>
                    <div class="vehicle-speed">${vehicle.speed}</div>
                </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });
        
        // Create marker
        const marker = L.marker([vehicle.lat, vehicle.lng], { icon: vehicleIcon })
            .addTo(routeTrackingMap);
        
        // Create popup content
        const popupContent = `
            <div class="vehicle-popup">
                <h6><i class="fas fa-truck"></i> ${vehicle.number}</h6>
                <p><strong>Driver:</strong> ${vehicle.driver}</p>
                <p><strong>Route:</strong> ${vehicle.route}</p>
                <p><strong>Speed:</strong> ${vehicle.speed} km/h</p>
                <p><strong>Progress:</strong> ${vehicle.progress}%</p>
                <p><strong>ETA:</strong> ${vehicle.eta}</p>
                <div class="progress mt-2">
                    <div class="progress-bar" style="width: ${vehicle.progress}%; background-color: ${vehicle.color};"></div>
                </div>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        routeVehicleMarkers[vehicle.id] = marker;
    });
}

function addRoutePolylines() {
    if (!routeTrackingMap) return;
    
    // Sample route polylines
    const routes = [
        {
            id: 'route1',
            name: 'Chennai to Bangalore',
            coordinates: [
                [13.0827, 80.2707], // Chennai
                [13.1986, 80.1636], // Kanchipuram
                [12.9716, 77.5946]  // Bangalore
            ],
            color: '#28a745',
            vehicleId: 'V001'
        },
        {
            id: 'route2',
            name: 'Chennai to Coimbatore',
            coordinates: [
                [13.0878, 80.2785], // Chennai
                [11.6643, 78.1460], // Salem
                [11.0168, 76.9558]  // Coimbatore
            ],
            color: '#007bff',
            vehicleId: 'V002'
        },
        {
            id: 'route3',
            name: 'Chennai to Madurai',
            coordinates: [
                [13.0912, 80.2823], // Chennai
                [10.7905, 78.7047], // Trichy
                [9.9252, 78.1198]   // Madurai
            ],
            color: '#ffc107',
            vehicleId: 'V004'
        }
    ];
    
    routes.forEach(route => {
        const polyline = L.polyline(route.coordinates, {
            color: route.color,
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 5'
        }).addTo(routeTrackingMap);
        
        polyline.bindPopup(`
            <div class="route-popup">
                <h6><i class="fas fa-route"></i> ${route.name}</h6>
                <p>Vehicle: ${route.vehicleId}</p>
                <p>Status: Active</p>
            </div>
        `);
        
        routePolylines[route.id] = polyline;
    });
}

function updateActiveVehiclesList() {
    const container = document.getElementById('activeVehiclesList');
    if (!container) return;
    
    const vehiclesData = [
        {
            id: 'V001',
            number: 'TN01AB1234',
            driver: 'John Doe',
            route: 'Chennai → Bangalore',
            speed: 45,
            progress: 65,
            status: 'On Time',
            eta: '2.5h',
            color: '#28a745'
        },
        {
            id: 'V002',
            number: 'TN02CD5678',
            driver: 'Jane Smith',
            route: 'Chennai → Coimbatore',
            speed: 52,
            progress: 40,
            status: 'On Time',
            eta: '3.2h',
            color: '#007bff'
        },
        {
            id: 'V004',
            number: 'TN04GH3456',
            driver: 'Sarah Wilson',
            route: 'Chennai → Madurai',
            speed: 38,
            progress: 25,
            status: 'Delayed',
            eta: '4.1h',
            color: '#ffc107'
        }
    ];
    
    container.innerHTML = vehiclesData.map(vehicle => `
        <div class="vehicle-status-item p-3 border-bottom" onclick="focusOnVehicle('${vehicle.id}')">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                    <h6 class="mb-1" style="color: ${vehicle.color};">
                        <i class="fas fa-truck"></i> ${vehicle.number}
                    </h6>
                    <small class="text-muted">${vehicle.driver}</small>
                </div>
                <span class="badge ${vehicle.status === 'On Time' ? 'bg-success' : 'bg-warning'}">${vehicle.status}</span>
            </div>
            <p class="mb-2 small"><i class="fas fa-route"></i> ${vehicle.route}</p>
            <div class="d-flex justify-content-between align-items-center mb-2">
                <small><i class="fas fa-tachometer-alt"></i> ${vehicle.speed} km/h</small>
                <small><i class="fas fa-clock"></i> ETA: ${vehicle.eta}</small>
            </div>
            <div class="progress" style="height: 6px;">
                <div class="progress-bar" style="width: ${vehicle.progress}%; background-color: ${vehicle.color};"></div>
            </div>
            <small class="text-muted">${vehicle.progress}% Complete</small>
        </div>
    `).join('');
}

function focusOnVehicle(vehicleId) {
    if (!routeTrackingMap || !routeVehicleMarkers[vehicleId]) return;
    
    const marker = routeVehicleMarkers[vehicleId];
    routeTrackingMap.setView(marker.getLatLng(), 14);
    marker.openPopup();
    
    showNotification(`Focused on vehicle ${vehicleId}`, 'info');
}

function refreshRouteTracking() {
    showNotification('Refreshing route tracking data...', 'info');
    
    // Update vehicle positions (simulate movement)
    Object.keys(routeVehicleMarkers).forEach(vehicleId => {
        const marker = routeVehicleMarkers[vehicleId];
        const currentPos = marker.getLatLng();
        
        // Simulate slight movement
        const newLat = currentPos.lat + (Math.random() - 0.5) * 0.01;
        const newLng = currentPos.lng + (Math.random() - 0.5) * 0.01;
        
        marker.setLatLng([newLat, newLng]);
    });
    
    // Update vehicle list
    updateActiveVehiclesList();
    
    // Update route statistics
    updateRouteStatistics();
    
    showNotification('Route tracking refreshed successfully!', 'success');
}

function toggleTrafficLayer() {
    trafficLayerEnabled = !trafficLayerEnabled;
    
    if (trafficLayerEnabled) {
        showNotification('Traffic layer enabled', 'info');
        // In a real implementation, you would add a traffic layer here
    } else {
        showNotification('Traffic layer disabled', 'info');
        // Remove traffic layer
    }
}

function centerMapOnVehicles() {
    if (!routeTrackingMap || Object.keys(routeVehicleMarkers).length === 0) return;
    
    const group = new L.featureGroup(Object.values(routeVehicleMarkers));
    routeTrackingMap.fitBounds(group.getBounds().pad(0.1));
    
    showNotification('Map centered on all vehicles', 'info');
}

function startRouteTrackingUpdates() {
    // Update vehicle positions every 30 seconds
    setInterval(() => {
        if (document.getElementById('routes').style.display !== 'none' && routeTrackingMap) {
            refreshRouteTracking();
        }
    }, 30000);
}

function updateRouteStatistics() {
    // Update the route information panel
    document.getElementById('totalActiveRoutes').textContent = '4';
    document.getElementById('vehiclesOnRoute').textContent = '3';
    document.getElementById('avgSpeed').textContent = '45';
    document.getElementById('etaDeliveries').textContent = '2.5h';
}

function forceInitializeRouteMap() {
    showNotification('Force initializing route tracking map...', 'info');
    
    // Clear existing map if it exists
    if (routeTrackingMap) {
        routeTrackingMap.remove();
        routeTrackingMap = null;
        routeVehicleMarkers = {};
        routePolylines = {};
    }
    
    // Re-initialize the map
    setTimeout(() => {
        initializeRouteTrackingMap();
    }, 500);
}

function debugRouteMap() {
    const mapContainer = document.getElementById('routeTrackingMap');
    const routesSection = document.getElementById('routes');
    
    let debugInfo = [];
    debugInfo.push(`Routes section display: ${routesSection ? routesSection.style.display : 'not found'}`);
    debugInfo.push(`Map container exists: ${mapContainer ? 'yes' : 'no'}`);
    debugInfo.push(`Map container visible: ${mapContainer && mapContainer.offsetParent !== null ? 'yes' : 'no'}`);
    debugInfo.push(`Leaflet loaded: ${typeof L !== 'undefined' ? 'yes' : 'no'}`);
    debugInfo.push(`Route tracking map initialized: ${routeTrackingMap ? 'yes' : 'no'}`);
    
    console.log('Route Map Debug Info:', debugInfo);
    showNotification('Debug info logged to console. Check browser console for details.', 'info');
    
    // Also show in alert for immediate visibility
    alert('Route Map Debug Info:\n' + debugInfo.join('\n'));
}

// Initialize route tracking when routes section is shown
function initializeRouteSection() {
    console.log('Initializing route section...');
    showNotification('Initializing Route Master with live tracking...', 'info');
    
    updateRouteTable();
    updateRouteStatistics();
    
    // Auto-initialize route tracking map after a short delay
    setTimeout(() => {
        const mapContainer = document.getElementById('routeTrackingMap');
        console.log('Map container found:', mapContainer ? 'yes' : 'no');
        if (mapContainer && !routeTrackingMap) {
            initializeRouteTrackingMap();
        } else if (!mapContainer) {
            showNotification('Route tracking map container not found. Please try refreshing.', 'warning');
        } else if (routeTrackingMap) {
            showNotification('Route tracking map already initialized', 'info');
        }
    }, 1000);
}

console.log('Route Tracking Map functions loaded successfully');

// Function to open Dynamic Dispatch Management Application
function openDynamicDispatch() {
    showNotification('Opening Dynamic Dispatch Management Application...', 'info');
    
    // Open in new window/tab
    const dispatchWindow = window.open('dispatch-app.html', '_blank', 'width=1400,height=900,scrollbars=yes,resizable=yes');
    
    if (dispatchWindow) {
        showNotification('Dynamic Dispatch Application opened successfully!', 'success');
    } else {
        showNotification('Please allow popups to open the Dynamic Dispatch Application', 'warning');
    }
}

console.log('Dynamic Dispatch Application integration loaded successfully');

// ===== DISPATCH TAB MANAGEMENT FUNCTIONS =====

// Initialize dispatch tabs functionality
function initializeDispatchTabs() {
    // Initialize tab content when tabs are shown
    const dispatchTabs = document.querySelectorAll('#dispatchTabs button[data-bs-toggle="tab"]');
    
    dispatchTabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function (event) {
            const targetId = event.target.getAttribute('data-bs-target');
            handleDispatchTabChange(targetId);
        });
    });
    
    // Initialize default tab content
    handleDispatchTabChange('#dashboard-page');
}

// Handle dispatch tab changes
function handleDispatchTabChange(targetId) {
    switch(targetId) {
        case '#dashboard-page':
            updateDispatchDashboard();
            break;
        case '#workflow-page':
            initializeWorkflowPage();
            break;
        case '#vehicles-page':
            updateAvailableResources();
            break;
        case '#trips-page':
            updateActiveTrips();
            break;
        case '#pod-page':
            updatePODTable();
            break;
        case '#tracking-page':
            initializeDeliveryTracking();
            break;
        case '#routes-page':
            initializeRouteOptimization();
            break;
    }
}

// Update POD table for POD tab
function updatePODTable() {
    const completedTrips = sampleData.trips.filter(trip => trip.status === 'completed' && !trip.podCompleted);
    const container = document.getElementById('podTable');
    
    if (container) {
        container.innerHTML = completedTrips.map(trip => {
            const order = sampleData.orders.find(o => o.id === trip.orderId);
            return `
                <tr>
                    <td><strong>${trip.orderId || 'N/A'}</strong></td>
                    <td>${order?.customer || 'N/A'}</td>
                    <td>${trip.driver}</td>
                    <td>
                        <span class="badge bg-warning">Pending POD</span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-success" onclick="completePOD('${trip.id}')">
                            <i class="fas fa-signature"></i> Complete POD
                        </button>
                        <button class="btn btn-sm btn-outline-info" onclick="viewPODDetails('${trip.id}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
        
        if (completedTrips.length === 0) {
            container.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No pending POD items</td></tr>';
        }
    }
}

// Complete POD function
function completePOD(tripId) {
    const trip = sampleData.trips.find(t => t.id === tripId);
    if (trip) {
        trip.podCompleted = true;
        trip.podCompletedAt = new Date().toISOString();
        
        showNotification(`POD completed for trip ${tripId}`, 'success');
        updatePODTable();
        updateDispatchDashboard();
    }
}

// View POD details
function viewPODDetails(tripId) {
    const trip = sampleData.trips.find(t => t.id === tripId);
    if (trip) {
        showNotification(`Viewing POD details for trip ${tripId}`, 'info');
        // Here you would typically open a modal with POD details
    }
}

// Initialize workflow page
function initializeWorkflowPage() {
    // Reset workflow steps to initial state
    resetWorkflow();
    showNotification('Manual workflow page loaded', 'info');
}

// Initialize delivery tracking
function initializeDeliveryTracking() {
    const activeDeliveries = sampleData.trips.filter(trip => trip.status === 'in-transit');
    const container = document.getElementById('activeDeliveriesList');
    
    if (container) {
        container.innerHTML = activeDeliveries.map(trip => `
            <div class="delivery-item mb-3">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="mb-1">${trip.id}</h6>
                        <p class="mb-1 text-muted">${trip.route}</p>
                        <small class="text-success">Driver: ${trip.driver}</small>
                    </div>
                    <div class="text-end">
                        <div class="progress mb-1" style="width: 80px; height: 8px;">
                            <div class="progress-bar" style="width: ${trip.progress}%"></div>
                        </div>
                        <small class="text-muted">${trip.progress}%</small>
                    </div>
                </div>
            </div>
        `).join('');
        
        if (activeDeliveries.length === 0) {
            container.innerHTML = '<div class="text-center text-muted p-3">No active deliveries</div>';
        }
    }
    
    showNotification('Delivery tracking initialized', 'info');
}

// Initialize delivery tracking map
function initializeDeliveryMap() {
    showNotification('Initializing live delivery tracking map...', 'info');
    
    // Simulate map initialization
    setTimeout(() => {
        showNotification('Live delivery tracking map activated', 'success');
    }, 1500);
}

// Initialize route optimization
function initializeRouteOptimization() {
    // Reset route information
    document.getElementById('totalDistance').textContent = '-- km';
    document.getElementById('estimatedTime').textContent = '-- hours';
    document.getElementById('fuelCost').textContent = '₹ --';
    document.getElementById('deliveryStops').textContent = '-- stops';
    
    showNotification('Route optimization page loaded', 'info');
}

// Initialize route planning
function initializeRoutePlanning() {
    showNotification('Initializing route planning...', 'info');
    
    // Simulate route planning
    setTimeout(() => {
        document.getElementById('totalDistance').textContent = '245 km';
        document.getElementById('estimatedTime').textContent = '4.5 hours';
        document.getElementById('fuelCost').textContent = '₹ 1,850';
        document.getElementById('deliveryStops').textContent = '5 stops';
        
        showNotification('Route planning completed', 'success');
    }, 2000);
}

// Optimize routes function
function optimizeRoutes() {
    showNotification('Optimizing delivery routes...', 'info');
    
    setTimeout(() => {
        document.getElementById('totalDistance').textContent = '198 km';
        document.getElementById('estimatedTime').textContent = '3.8 hours';
        document.getElementById('fuelCost').textContent = '₹ 1,485';
        
        showNotification('Routes optimized! Saved 47 km and ₹365', 'success');
    }, 1500);
}

// Save routes function
function saveRoutes() {
    showNotification('Saving optimized routes...', 'info');
    
    setTimeout(() => {
        showNotification('Routes saved successfully', 'success');
    }, 1000);
}

// Update dispatch dashboard for dashboard tab
function updateDispatchDashboard() {
    // Update KPI values with real data
    const totalOrders = sampleData.orders.length;
    const activeTrips = sampleData.trips.filter(t => t.status === 'in-transit').length;
    const pendingOrders = sampleData.orders.filter(o => o.status === 'pending').length;
    const availableVehicles = sampleData.vehicles.filter(v => v.status === 'available').length;
    const availableDrivers = sampleData.drivers.filter(d => d.availability === 'available').length;
    const podPending = sampleData.trips.filter(t => t.status === 'completed' && !t.podCompleted).length;
    
    // Update dashboard elements
    const dashboardTotalOrders = document.getElementById('dashboardTotalOrders');
    const dashboardActiveTrips = document.getElementById('dashboardActiveTrips');
    const quickStatsPending = document.getElementById('quickStatsPending');
    const quickStatsVehicles = document.getElementById('quickStatsVehicles');
    const quickStatsDrivers = document.getElementById('quickStatsDrivers');
    const quickStatsPOD = document.getElementById('quickStatsPOD');
    
    if (dashboardTotalOrders) dashboardTotalOrders.textContent = totalOrders;
    if (dashboardActiveTrips) dashboardActiveTrips.textContent = activeTrips;
    if (quickStatsPending) quickStatsPending.textContent = pendingOrders;
    if (quickStatsVehicles) quickStatsVehicles.textContent = availableVehicles;
    if (quickStatsDrivers) quickStatsDrivers.textContent = availableDrivers;
    if (quickStatsPOD) quickStatsPOD.textContent = podPending;
    
    // Initialize charts if not already done
    if (!window.dispatchChartsInitialized) {
        initializeDispatchCharts();
        window.dispatchChartsInitialized = true;
    }
}

// Initialize dispatch charts
function initializeDispatchCharts() {
    // Initialize performance chart
    const performanceCtx = document.getElementById('dispatchPerformanceChart');
    if (performanceCtx) {
        new Chart(performanceCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Orders',
                    data: [12, 19, 15, 25, 22, 18, 24],
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Deliveries',
                    data: [10, 16, 13, 22, 20, 16, 21],
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

console.log('Dispatch tab management functions loaded successfully');

// Fleet Order Management Integration Functions
function processOrderInDispatch(orderId) {
    showNotification(`Processing order ${orderId} in Dispatch App...`, 'info');
    
    // Store order data for dispatch app
    localStorage.setItem('processOrderId', orderId);
    localStorage.setItem('processOrderAction', 'workflow');
    
    // Open dispatch app in new window/tab
    const dispatchWindow = window.open('dispatch-app.html', '_blank');
    
    // Show confirmation
    setTimeout(() => {
        showNotification(`Order ${orderId} sent to Dispatch App for workflow processing`, 'success');
    }, 1000);
}

function trackOrderInDispatch(orderId) {
    showNotification(`Opening order ${orderId} tracking in Dispatch App...`, 'info');
    
    // Store order data for dispatch app
    localStorage.setItem('trackOrderId', orderId);
    localStorage.setItem('trackOrderAction', 'tracking');
    
    // Open dispatch app in new window/tab
    const dispatchWindow = window.open('dispatch-app.html', '_blank');
    
    // Show confirmation
    setTimeout(() => {
        showNotification(`Order ${orderId} tracking opened in Dispatch App`, 'success');
    }, 1000);
}

function editOrder(orderId) {
    showNotification(`Editing order ${orderId}...`, 'info');
    // Implementation for editing order
}

function viewOrder(orderId) {
    const order = sampleData.orders.find(o => o.id === orderId);
    if (order) {
        const orderDetails = `
            Order Details:
            
            Order ID: ${order.id}
            Customer: ${order.customer}
            Material: ${order.material}
            Quantity: ${order.quantity} ${order.unit}
            Route: ${order.pickup} → ${order.delivery}
            Priority: ${order.priority}
            Status: ${order.status}
            Created: ${order.createdDate}
            Contact: ${order.contact || 'N/A'}
            Email: ${order.email || 'N/A'}
        `;
        
        alert(orderDetails);
        
        // Ask if user wants to process this order
        setTimeout(() => {
            if (confirm(`Would you like to process order ${orderId} in the Dispatch App?`)) {
                processOrderInDispatch(orderId);
            }
        }, 500);
    }
}

function generateInvoice(orderId) {
    showNotification(`Generating invoice for order ${orderId}...`, 'info');
    
    setTimeout(() => {
        showNotification(`Invoice generated for order ${orderId}`, 'success');
        // Could open invoice in new window or download
    }, 1500);
}

function filterOrders() {
    const priorityFilter = document.getElementById('priorityFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    showNotification(`Filtering orders by priority: ${priorityFilter}, status: ${statusFilter}`, 'info');
    
    // Filter logic would be implemented here
    updateOrderTable();
}

function clearFilters() {
    document.getElementById('priorityFilter').value = 'all';
    document.getElementById('statusFilter').value = 'all';
    
    showNotification('Filters cleared', 'info');
    updateOrderTable();
}

function exportOrders() {
    showNotification('Exporting orders to CSV...', 'info');
    
    // Simple CSV export simulation
    setTimeout(() => {
        showNotification('Orders exported successfully', 'success');
    }, 1000);
}

function refreshOrders() {
    updateOrderTable();
    showNotification('Orders refreshed', 'success');
}

// Update Order Table Function
function updateOrderTable() {
    const tableBody = document.getElementById('orderTable');
    if (!tableBody) return;
    
    const orders = sampleData.orders;
    
    tableBody.innerHTML = orders.map(order => `
        <tr>
            <td><strong>${order.id}</strong></td>
            <td>${order.customer}</td>
            <td>${order.material}</td>
            <td>${order.quantity} ${order.unit}</td>
            <td><span class="badge bg-${order.priority === 'urgent' ? 'danger' : order.priority === 'high' ? 'warning' : 'secondary'}">${order.priority}</span></td>
            <td><span class="badge bg-${order.status === 'completed' ? 'success' : order.status === 'processing' ? 'info' : 'warning'}">${order.status}</span></td>
            <td>${order.createdDate}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editOrder('${order.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                ${order.status === 'pending' ? 
                    `<button class="btn btn-sm btn-outline-success" onclick="processOrderInDispatch('${order.id}')">
                        <i class="fas fa-external-link-alt"></i> Process in Dispatch
                    </button>` : 
                    order.status === 'processing' ?
                    `<button class="btn btn-sm btn-outline-warning" onclick="trackOrderInDispatch('${order.id}')">
                        <i class="fas fa-external-link-alt"></i> Track in Dispatch
                    </button>` :
                    `<button class="btn btn-sm btn-outline-success" onclick="generateInvoice('${order.id}')">
                        <i class="fas fa-file-invoice"></i> Invoice
                    </button>`
                }
                <button class="btn btn-sm btn-outline-info" onclick="viewOrder('${order.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    // Update order counts
    document.getElementById('totalOrdersCount').textContent = orders.length;
    document.getElementById('pendingOrdersCount').textContent = orders.filter(o => o.status === 'pending').length;
    document.getElementById('completedOrdersCount').textContent = orders.filter(o => o.status === 'completed').length;
    document.getElementById('urgentOrdersCount').textContent = orders.filter(o => o.priority === 'urgent').length;
}

console.log('Fleet Management System with Order Management Integration loaded successfully');