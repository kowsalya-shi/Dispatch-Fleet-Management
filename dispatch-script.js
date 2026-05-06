// Dynamic Dispatch Management System JavaScript

// Global Variables
let currentSection = 'dashboard';
let dispatchData = {
    orders: [],
    vehicles: [],
    drivers: [],
    trips: [],
    analytics: {}
};

// Workflow storage
let allWorkflows = [
    {
        id: 'WF001',
        customer: 'ABC Corporation',
        currentStep: 3,
        stepName: 'Invoice',
        progress: 37,
        status: 'active',
        startedTime: '10:30 AM',
        completedTime: null,
        orderDetails: {
            pickup: 'Chennai Main Warehouse',
            delivery: 'Bangalore',
            material: 'LAM001 - Satin Laminate'
        }
    },
    {
        id: 'WF002',
        customer: 'XYZ Industries',
        currentStep: 6,
        stepName: 'Tracking',
        progress: 75,
        status: 'active',
        startedTime: '09:15 AM',
        completedTime: null,
        orderDetails: {
            pickup: 'Bangalore Hub',
            delivery: 'Coimbatore',
            material: 'LAM002 - Gloss Laminate'
        }
    },
    {
        id: 'WF003',
        customer: 'PQR Logistics',
        currentStep: 2,
        stepName: 'Warehouse',
        progress: 25,
        status: 'active',
        startedTime: '08:45 AM',
        completedTime: null,
        orderDetails: {
            pickup: 'Coimbatore Depot',
            delivery: 'Madurai',
            material: 'LAM003 - Matte Laminate'
        }
    }
];

// Sample Data
const sampleDispatchData = {
    orders: [
        { 
            id: 'ORD001', 
            customer: 'ABC Corporation', 
            pickup: 'Chennai Port', 
            delivery: 'Bangalore', 
            priority: 'urgent', 
            status: 'pending',
            createdDate: '2024-03-15',
            value: 25000
        },
        { 
            id: 'ORD002', 
            customer: 'XYZ Industries', 
            pickup: 'Bangalore Hub', 
            delivery: 'Coimbatore', 
            priority: 'high', 
            status: 'processing',
            createdDate: '2024-03-14',
            value: 18000
        },
        { 
            id: 'ORD003', 
            customer: 'PQR Logistics', 
            pickup: 'Coimbatore Depot', 
            delivery: 'Madurai', 
            priority: 'normal', 
            status: 'completed',
            createdDate: '2024-03-13',
            value: 12000
        }
    ],
    vehicles: [
        { 
            id: 'V001', 
            number: 'TN01AB1234', 
            type: 'truck', 
            status: 'available', 
            driver: 'John Doe', 
            location: 'Chennai',
            fuel: 85
        },
        { 
            id: 'V002', 
            number: 'TN02CD5678', 
            type: 'van', 
            status: 'in-transit', 
            driver: 'Jane Smith', 
            location: 'Highway',
            fuel: 60
        }
    ]
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dynamic Dispatch Management System loading...');
    initializeApp();
});

function initializeApp() {
    // Load initial data
    dispatchData = { ...sampleDispatchData };
    
    // Show dashboard by default
    showDynamicSection('dashboard');
    
    // Start real-time updates
    startRealTimeUpdates();
    
    console.log('Dynamic Dispatch Management System loaded successfully');
}
// Navigation Functions
function showDynamicSection(section) {
    currentSection = section;
    
    // Update navigation
    updateNavigation(section);
    
    // Load section content immediately without loading overlay
    loadSectionContent(section);
}

function updateNavigation(activeSection) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[onclick="showDynamicSection('${activeSection}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function loadSectionContent(section) {
    const content = document.getElementById('dynamicContent');
    
    switch(section) {
        case 'dashboard':
            content.innerHTML = getDashboardContent();
            initializeDashboard();
            break;
        case 'orders':
            content.innerHTML = getOrdersContent();
            initializeOrders();
            break;
        case 'vehicles':
            content.innerHTML = getVehiclesContent();
            initializeVehicles();
            break;
        case 'tracking':
            content.innerHTML = getTrackingContent();
            initializeTracking();
            break;
        case 'routemap':
            content.innerHTML = getRouteMapContent();
            initializeRouteMap();
            break;
        case 'pod':
            content.innerHTML = getPODContent();
            initializePOD();
            break;
        case 'trips':
            content.innerHTML = getTripsContent();
            initializeTrips();
            break;
        case 'analytics':
            content.innerHTML = getAnalyticsContent();
            initializeAnalytics();
            break;
        case 'materials':
            content.innerHTML = getMaterialsContent();
            initializeMaterials();
            break;
        case 'warehouse':
            content.innerHTML = getWarehouseContent();
            initializeWarehouse();
            break;
        case 'workflow':
            content.innerHTML = getWorkflowContent();
            initializeWorkflow();
            break;
        default:
            content.innerHTML = getDashboardContent();
            initializeDashboard();
    }
    
    // Add fade-in animation
    content.classList.add('fade-in');
    setTimeout(() => content.classList.remove('fade-in'), 500);
}

// Content Templates
function getDashboardContent() {
    return `
        <div class="dashboard-header mb-4">
            <h2><i class="fas fa-tachometer-alt"></i> Dispatch Dashboard</h2>
            <p class="text-muted">Real-time dispatch operations overview</p>
        </div>
        
        <div class="kpi-grid">
            <div class="kpi-card">
                <div class="kpi-value" id="totalRevenue">₹ 628K</div>
                <div class="kpi-label">Total Revenue</div>
                <div class="kpi-change">+12% from last month</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-value" id="totalOrders">2,434</div>
                <div class="kpi-label">Total Orders</div>
                <div class="kpi-change">+8% from last week</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-value" id="activeTrips">1,259</div>
                <div class="kpi-label">Active Trips</div>
                <div class="kpi-change">+15% from yesterday</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-value" id="avgRating">8.5</div>
                <div class="kpi-label">Avg Rating</div>
                <div class="kpi-change">+0.3 from last month</div>
            </div>
        </div>
        
        <div class="dashboard-grid">
            <div class="dashboard-card">
                <div class="card-header-custom">
                    <h5 class="card-title">Performance Chart</h5>
                    <div class="card-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                </div>
                <div class="chart-container-modern">
                    <canvas id="performanceChart" width="400" height="200"></canvas>
                </div>
            </div>
            
            <div class="dashboard-card">
                <div class="card-header-custom">
                    <h5 class="card-title">Order Status</h5>
                    <div class="card-icon">
                        <i class="fas fa-chart-pie"></i>
                    </div>
                </div>
                <div class="chart-container-modern">
                    <canvas id="orderStatusChart" width="300" height="300"></canvas>
                </div>
            </div>
            
            <div class="dashboard-card">
                <div class="card-header-custom">
                    <h5 class="card-title">Recent Activities</h5>
                    <div class="card-icon">
                        <i class="fas fa-list"></i>
                    </div>
                </div>
                <div id="recentActivities">
                    <!-- Activities will be loaded here -->
                </div>
            </div>
            
            <div class="dashboard-card">
                <div class="card-header-custom">
                    <h5 class="card-title">Live Map</h5>
                    <div class="card-icon">
                        <i class="fas fa-map"></i>
                    </div>
                </div>
                <div id="dashboardMap" style="height: 300px; border-radius: 10px; background: #f8f9fa;">
                    <div class="d-flex align-items-center justify-content-center h-100">
                        <div class="text-center">
                            <i class="fas fa-map fa-2x text-primary mb-2"></i>
                            <p class="text-muted">Live vehicle tracking</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getOrdersContent() {
    return `
        <div class="section-header mb-4">
            <h2><i class="fas fa-shopping-cart"></i> Order Tracking</h2>
            <div class="d-flex gap-2">
                <button class="btn btn-primary btn-modern" onclick="createNewOrder()">
                    <i class="fas fa-plus"></i> New Order
                </button>
                <button class="btn btn-outline-secondary btn-modern" onclick="refreshOrders()">
                    <i class="fas fa-sync"></i> Refresh
                </button>
            </div>
        </div>
        
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="dashboard-card text-center">
                    <h3 class="text-primary" id="pendingOrdersCount">3</h3>
                    <p class="mb-0">Pending Orders</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="dashboard-card text-center">
                    <h3 class="text-success" id="processingOrdersCount">2</h3>
                    <p class="mb-0">Processing</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="dashboard-card text-center">
                    <h3 class="text-info" id="completedOrdersCount">1</h3>
                    <p class="mb-0">Completed</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="dashboard-card text-center">
                    <h3 class="text-warning" id="urgentOrdersCount">1</h3>
                    <p class="mb-0">Urgent</p>
                </div>
            </div>
        </div>
        
        <div class="dashboard-card">
            <div class="card-header-custom">
                <h5 class="card-title">Order List</h5>
                <div class="d-flex gap-2">
                    <select class="form-select form-select-sm" id="orderFilter" onchange="filterOrders()">
                        <option value="all">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table table-modern">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Route</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Value</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="ordersTableBody">
                        <!-- Orders will be loaded here -->
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function getVehiclesContent() {
    return `
        <div class="section-header mb-4">
            <h2><i class="fas fa-truck"></i> Vehicle & Driver Management</h2>
            <button class="btn btn-success btn-modern" onclick="assignVehicle()">
                <i class="fas fa-user-plus"></i> Assign Vehicle
            </button>
        </div>
        
        <div class="row">
            <div class="col-md-6">
                <div class="dashboard-card">
                    <div class="card-header-custom">
                        <h5 class="card-title">Available Vehicles</h5>
                        <span class="badge bg-success" id="availableVehiclesCount">5</span>
                    </div>
                    <div id="availableVehiclesList">
                        <!-- Available vehicles will be loaded here -->
                    </div>
                </div>
            </div>
            
            <div class="col-md-6">
                <div class="dashboard-card">
                    <div class="card-header-custom">
                        <h5 class="card-title">Available Drivers</h5>
                        <span class="badge bg-info" id="availableDriversCount">8</span>
                    </div>
                    <div id="availableDriversList">
                        <!-- Available drivers will be loaded here -->
                    </div>
                </div>
            </div>
        </div>
        
        <div class="dashboard-card mt-4">
            <div class="card-header-custom">
                <h5 class="card-title">Vehicle Status Overview</h5>
            </div>
            <div class="chart-container-modern">
                <canvas id="vehicleStatusChart" width="400" height="200"></canvas>
            </div>
        </div>
    `;
}
function getTrackingContent() {
    return `
        <div class="section-header mb-4">
            <h2><i class="fas fa-map-marker-alt"></i> Live Tracking</h2>
            <div class="d-flex gap-2">
                <button class="btn btn-primary btn-modern" onclick="refreshTracking()">
                    <i class="fas fa-sync"></i> Refresh
                </button>
                <button class="btn btn-outline-info btn-modern" onclick="toggleTrafficLayer()">
                    <i class="fas fa-traffic-light"></i> Traffic
                </button>
                <button class="btn btn-outline-success btn-modern" onclick="centerAllVehicles()">
                    <i class="fas fa-crosshairs"></i> Center All
                </button>
            </div>
        </div>
        
        <!-- Live Stats Row -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="dashboard-card text-center">
                    <h3 class="text-success" id="liveVehiclesCount">5</h3>
                    <p class="mb-0">Vehicles Online</p>
                    <small class="text-muted">Real-time tracking</small>
                </div>
            </div>
            <div class="col-md-3">
                <div class="dashboard-card text-center">
                    <h3 class="text-primary" id="activeTripsCount">3</h3>
                    <p class="mb-0">Active Trips</p>
                    <small class="text-muted">In progress</small>
                </div>
            </div>
            <div class="col-md-3">
                <div class="dashboard-card text-center">
                    <h3 class="text-warning" id="avgSpeedDisplay">45</h3>
                    <p class="mb-0">Avg Speed (km/h)</p>
                    <small class="text-muted">Fleet average</small>
                </div>
            </div>
            <div class="col-md-3">
                <div class="dashboard-card text-center">
                    <h3 class="text-info" id="alertsCount">2</h3>
                    <p class="mb-0">Active Alerts</p>
                    <small class="text-muted">Requires attention</small>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-8">
                <div class="dashboard-card">
                    <div class="card-header-custom">
                        <h5 class="card-title">Live Vehicle Map</h5>
                        <div class="d-flex gap-2">
                            <button class="btn btn-sm btn-outline-primary" onclick="initializeLiveMap()">
                                <i class="fas fa-play"></i> Start Tracking
                            </button>
                            <button class="btn btn-sm btn-outline-secondary" onclick="toggleMapView()">
                                <i class="fas fa-layer-group"></i> View
                            </button>
                        </div>
                    </div>
                    <div id="liveTrackingMap" style="height: 500px; border-radius: 10px; background: linear-gradient(135deg, #e3f2fd, #bbdefb); position: relative;">
                        <div class="d-flex align-items-center justify-content-center h-100">
                            <div class="text-center">
                                <i class="fas fa-map fa-3x text-primary mb-3"></i>
                                <h5>Live Vehicle Tracking</h5>
                                <p class="text-muted">Real-time vehicle positions and routes</p>
                                <button class="btn btn-primary btn-modern" onclick="initializeLiveMap()">
                                    <i class="fas fa-play"></i> Start Live Tracking
                                </button>
                            </div>
                        </div>
                        
                        <!-- Map Controls Overlay -->
                        <div class="map-controls" style="position: absolute; top: 10px; right: 10px; z-index: 1000; display: none;">
                            <div class="btn-group-vertical">
                                <button class="btn btn-sm btn-light" onclick="zoomIn()" title="Zoom In">
                                    <i class="fas fa-plus"></i>
                                </button>
                                <button class="btn btn-sm btn-light" onclick="zoomOut()" title="Zoom Out">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <button class="btn btn-sm btn-light" onclick="resetMapView()" title="Reset View">
                                    <i class="fas fa-home"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Map Legend -->
                    <div class="mt-3">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="d-flex justify-content-center gap-4">
                                    <div class="d-flex align-items-center">
                                        <div class="legend-dot bg-success me-2"></div>
                                        <small>On Route</small>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <div class="legend-dot bg-warning me-2"></div>
                                        <small>Delayed</small>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <div class="legend-dot bg-danger me-2"></div>
                                        <small>Alert</small>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <div class="legend-dot bg-info me-2"></div>
                                        <small>Idle</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="dashboard-card">
                    <div class="card-header-custom">
                        <h5 class="card-title">Live Vehicle Status</h5>
                        <span class="badge bg-success pulse-indicator"></span>
                    </div>
                    <div id="activeVehiclesTracking" style="max-height: 450px; overflow-y: auto;">
                        <!-- Active vehicles will be loaded here -->
                    </div>
                </div>
                
                <!-- Alerts Panel -->
                <div class="dashboard-card mt-3">
                    <div class="card-header-custom">
                        <h5 class="card-title">Live Alerts</h5>
                        <span class="badge bg-danger" id="liveAlertsCount">2</span>
                    </div>
                    <div id="liveAlertsPanel">
                        <div class="alert alert-warning alert-sm mb-2">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            <strong>TN02CD5678</strong> - Speed limit exceeded
                            <small class="d-block text-muted">2 minutes ago</small>
                        </div>
                        <div class="alert alert-info alert-sm mb-2">
                            <i class="fas fa-info-circle me-2"></i>
                            <strong>TN01AB1234</strong> - Route deviation detected
                            <small class="d-block text-muted">5 minutes ago</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Trip Progress Section -->
        <div class="row mt-4">
            <div class="col-12">
                <div class="dashboard-card">
                    <div class="card-header-custom">
                        <h5 class="card-title">Active Trip Progress</h5>
                        <button class="btn btn-sm btn-outline-primary" onclick="refreshTripProgress()">
                            <i class="fas fa-sync"></i> Refresh
                        </button>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-modern">
                            <thead>
                                <tr>
                                    <th>Vehicle</th>
                                    <th>Driver</th>
                                    <th>Route</th>
                                    <th>Progress</th>
                                    <th>Speed</th>
                                    <th>ETA</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="tripProgressTable">
                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <div class="vehicle-status-dot bg-success me-2"></div>
                                            <strong>TN01AB1234</strong>
                                        </div>
                                    </td>
                                    <td>John Doe</td>
                                    <td>Chennai → Bangalore</td>
                                    <td>
                                        <div class="progress">
                                            <div class="progress-bar bg-success" style="width: 65%">65%</div>
                                        </div>
                                        <small class="text-muted">180 km remaining</small>
                                    </td>
                                    <td>
                                        <span class="badge bg-success">52 km/h</span>
                                    </td>
                                    <td>2h 30m</td>
                                    <td><span class="badge bg-success">On Time</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary" onclick="trackVehicle('TN01AB1234')">
                                            <i class="fas fa-crosshairs"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-info" onclick="contactDriver('TN01AB1234')">
                                            <i class="fas fa-phone"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <div class="vehicle-status-dot bg-warning me-2"></div>
                                            <strong>TN02CD5678</strong>
                                        </div>
                                    </td>
                                    <td>Jane Smith</td>
                                    <td>Chennai → Coimbatore</td>
                                    <td>
                                        <div class="progress">
                                            <div class="progress-bar bg-warning" style="width: 40%">40%</div>
                                        </div>
                                        <small class="text-muted">300 km remaining</small>
                                    </td>
                                    <td>
                                        <span class="badge bg-warning">38 km/h</span>
                                    </td>
                                    <td>4h 15m</td>
                                    <td><span class="badge bg-warning">Delayed</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary" onclick="trackVehicle('TN02CD5678')">
                                            <i class="fas fa-crosshairs"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-info" onclick="contactDriver('TN02CD5678')">
                                            <i class="fas fa-phone"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <div class="vehicle-status-dot bg-success me-2"></div>
                                            <strong>TN04GH3456</strong>
                                        </div>
                                    </td>
                                    <td>Sarah Wilson</td>
                                    <td>Chennai → Madurai</td>
                                    <td>
                                        <div class="progress">
                                            <div class="progress-bar bg-success" style="width: 25%">25%</div>
                                        </div>
                                        <small class="text-muted">340 km remaining</small>
                                    </td>
                                    <td>
                                        <span class="badge bg-success">48 km/h</span>
                                    </td>
                                    <td>3h 45m</td>
                                    <td><span class="badge bg-success">On Time</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary" onclick="trackVehicle('TN04GH3456')">
                                            <i class="fas fa-crosshairs"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-info" onclick="contactDriver('TN04GH3456')">
                                            <i class="fas fa-phone"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}
function getRouteMapContent() {
    return `
        <div class="section-header mb-4">
            <h2><i class="fas fa-route"></i> Route Map Tracking</h2>
            <div class="d-flex gap-2">
                <button class="btn btn-primary btn-modern" onclick="initializeRouteMap()">
                    <i class="fas fa-play"></i> Start Route Tracking
                </button>
                <button class="btn btn-outline-success btn-modern" onclick="refreshRouteMap()">
                    <i class="fas fa-sync"></i> Refresh Routes
                </button>
                <button class="btn btn-outline-info btn-modern" onclick="optimizeRoutes()">
                    <i class="fas fa-route"></i> Optimize
                </button>
            </div>
        </div>
        
        <!-- Route Statistics -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="dashboard-card text-center">
                    <h3 class="text-primary" id="totalRoutesCount">5</h3>
                    <p class="mb-0">Total Routes</p>
                    <small class="text-muted">Active routes</small>
                </div>
            </div>
            <div class="col-md-3">
                <div class="dashboard-card text-center">
                    <h3 class="text-success" id="activeRoutesCount">4</h3>
                    <p class="mb-0">Active Routes</p>
                    <small class="text-muted">Currently running</small>
                </div>
            </div>
            <div class="col-md-3">
                <div class="dashboard-card text-center">
                    <h3 class="text-info" id="totalDistanceCount">1,879</h3>
                    <p class="mb-0">Total Distance (km)</p>
                    <small class="text-muted">All routes combined</small>
                </div>
            </div>
            <div class="col-md-3">
                <div class="dashboard-card text-center">
                    <h3 class="text-warning" id="avgTimeCount">32h</h3>
                    <p class="mb-0">Total Time</p>
                    <small class="text-muted">Estimated duration</small>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-8">
                <div class="dashboard-card">
                    <div class="card-header-custom">
                        <h5 class="card-title">Route Map with Vehicle Tracking</h5>
                        <div class="d-flex gap-2">
                            <button class="btn btn-sm btn-outline-primary" onclick="showAllRoutes()">
                                <i class="fas fa-eye"></i> Show All
                            </button>
                            <button class="btn btn-sm btn-outline-success" onclick="showActiveRoutes()">
                                <i class="fas fa-play"></i> Active Only
                            </button>
                            <button class="btn btn-sm btn-outline-info" onclick="centerRouteMap()">
                                <i class="fas fa-crosshairs"></i> Center
                            </button>
                        </div>
                    </div>
                    <div id="routeTrackingMap" style="height: 500px; border-radius: 10px; background: linear-gradient(135deg, #e3f2fd, #bbdefb); position: relative;">
                        <div class="d-flex align-items-center justify-content-center h-100">
                            <div class="text-center">
                                <i class="fas fa-route fa-3x text-primary mb-3"></i>
                                <h5>Route Map Tracking</h5>
                                <p class="text-muted">Interactive route visualization with live vehicle tracking</p>
                                <button class="btn btn-primary btn-modern" onclick="initializeRouteMap()">
                                    <i class="fas fa-play"></i> Initialize Route Map
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Route Information Panel -->
                    <div class="row mt-3">
                        <div class="col-12">
                            <div class="card border-success">
                                <div class="card-header bg-success text-white">
                                    <h6><i class="fas fa-route"></i> Route Information</h6>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-3">
                                            <div class="text-center">
                                                <h4 class="text-primary" id="totalActiveRoutes">4</h4>
                                                <small class="text-muted">Active Routes</small>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="text-center">
                                                <h4 class="text-success" id="vehiclesOnRoute">3</h4>
                                                <small class="text-muted">Vehicles on Route</small>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="text-center">
                                                <h4 class="text-warning" id="avgSpeed">45</h4>
                                                <small class="text-muted">Avg Speed (km/h)</small>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="text-center">
                                                <h4 class="text-info" id="etaDeliveries">2.5h</h4>
                                                <small class="text-muted">Avg ETA</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="dashboard-card">
                    <div class="card-header-custom">
                        <h5 class="card-title">Route List</h5>
                        <span class="badge bg-primary" id="routeListCount">5</span>
                    </div>
                    <div id="routesList" style="max-height: 450px; overflow-y: auto;">
                        <!-- Routes will be loaded here -->
                    </div>
                </div>
                
                <!-- Route Optimization Panel -->
                <div class="dashboard-card mt-3">
                    <div class="card-header-custom">
                        <h5 class="card-title">Route Optimization</h5>
                        <span class="badge bg-success">AI Powered</span>
                    </div>
                    <div class="p-3">
                        <div class="mb-3">
                            <label class="form-label">Optimization Type</label>
                            <select class="form-select form-select-sm">
                                <option>Shortest Distance</option>
                                <option>Fastest Time</option>
                                <option>Fuel Efficient</option>
                                <option>Cost Effective</option>
                            </select>
                        </div>
                        <button class="btn btn-success btn-sm w-100" onclick="runOptimization()">
                            <i class="fas fa-magic"></i> Optimize Routes
                        </button>
                        <div class="mt-3">
                            <small class="text-muted">
                                <i class="fas fa-info-circle"></i> 
                                Last optimization: 2 hours ago<br>
                                Saved: 15% fuel, 20 minutes
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Route Master Table -->
        <div class="row mt-4">
            <div class="col-12">
                <div class="dashboard-card">
                    <div class="card-header-custom">
                        <h5 class="card-title">Route Master</h5>
                        <div class="d-flex gap-2">
                            <button class="btn btn-sm btn-outline-secondary" onclick="exportRoutes()">
                                <i class="fas fa-download"></i> Export
                            </button>
                            <button class="btn btn-sm btn-outline-primary" onclick="refreshRoutes()">
                                <i class="fas fa-sync"></i> Refresh
                            </button>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-modern">
                            <thead>
                                <tr>
                                    <th>Route Code</th>
                                    <th>Source → Destination</th>
                                    <th>Distance</th>
                                    <th>Est. Time</th>
                                    <th>Cost</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="routeMasterTable">
                                <tr>
                                    <td><strong>CHN-BLR-001</strong></td>
                                    <td>Chennai Port → Bangalore Hub</td>
                                    <td>350 km</td>
                                    <td>6h 30m</td>
                                    <td>₹3,250</td>
                                    <td><span class="badge bg-success">Active</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary" onclick="viewRoute('CHN-BLR-001')">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-success" onclick="trackRoute('CHN-BLR-001')">
                                            <i class="fas fa-map"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>CHN-COI-002</strong></td>
                                    <td>T Nagar → RS Puram</td>
                                    <td>502 km</td>
                                    <td>8h 15m</td>
                                    <td>₹4,200</td>
                                    <td><span class="badge bg-success">Active</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary" onclick="viewRoute('CHN-COI-002')">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-success" onclick="trackRoute('CHN-COI-002')">
                                            <i class="fas fa-map"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>CHN-MDU-003</strong></td>
                                    <td>Anna Nagar → Anna Salai</td>
                                    <td>458 km</td>
                                    <td>7h 45m</td>
                                    <td>₹3,850</td>
                                    <td><span class="badge bg-success">Active</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary" onclick="viewRoute('CHN-MDU-003')">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-success" onclick="trackRoute('CHN-MDU-003')">
                                            <i class="fas fa-map"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}
function getWorkflowContent() {
    return `
        <div class="section-header mb-4">
            <h2><i class="fas fa-sitemap"></i> Dispatch Workflow</h2>
            <div class="d-flex gap-2">
                <button class="btn btn-success btn-modern" onclick="startManualWorkflow()">
                    <i class="fas fa-play"></i> Start Manual Dispatch
                </button>
                <button class="btn btn-outline-secondary btn-modern" onclick="resetWorkflow()">
                    <i class="fas fa-undo"></i> Reset Workflow
                </button>
            </div>
        </div>
        
        <!-- Workflow Steps -->
        <div class="dashboard-card mb-4">
            <div class="card-header-custom">
                <h5 class="card-title">8-Step Dispatch Workflow</h5>
                <div class="badge bg-info">Step-by-Step Process</div>
            </div>
            <div class="card-body">
                <div class="workflow-steps">
                    <div class="step active" data-step="1">
                        <div class="step-icon"><i class="fas fa-shopping-cart"></i></div>
                        <div class="step-text">Sales Order</div>
                    </div>
                    <div class="step-arrow">→</div>
                    <div class="step" data-step="2">
                        <div class="step-icon"><i class="fas fa-warehouse"></i></div>
                        <div class="step-text">Warehouse</div>
                    </div>
                    <div class="step-arrow">→</div>
                    <div class="step" data-step="3">
                        <div class="step-icon"><i class="fas fa-file-invoice"></i></div>
                        <div class="step-text">Invoice</div>
                    </div>
                    <div class="step-arrow">→</div>
                    <div class="step" data-step="4">
                        <div class="step-icon"><i class="fas fa-user-plus"></i></div>
                        <div class="step-text">Vehicle & Driver</div>
                    </div>
                    <div class="step-arrow">→</div>
                    <div class="step" data-step="5">
                        <div class="step-icon"><i class="fas fa-play"></i></div>
                        <div class="step-text">Dispatch</div>
                    </div>
                    <div class="step-arrow">→</div>
                    <div class="step" data-step="6">
                        <div class="step-icon"><i class="fas fa-map-marker-alt"></i></div>
                        <div class="step-text">Tracker</div>
                    </div>
                    <div class="step-arrow">→</div>
                    <div class="step" data-step="7">
                        <div class="step-icon"><i class="fas fa-check"></i></div>
                        <div class="step-text">Delivered</div>
                    </div>
                    <div class="step-arrow">→</div>
                    <div class="step" data-step="8">
                        <div class="step-icon"><i class="fas fa-signature"></i></div>
                        <div class="step-text">Sign-off</div>
                    </div>
                </div>
                
                <!-- Current Step Display -->
                <div id="currentStepDisplay" class="alert alert-primary mt-4" style="display: none;">
                    <h6 id="currentStepTitle">Current Step</h6>
                    <p id="currentStepDescription">Step description</p>
                </div>
            </div>
        </div>
        
        <!-- Workflow Forms Container -->
        <div id="workflowFormsContainer" style="display: none;">
            <!-- Step 1: Sales Order Form -->
            <div id="step1Form" class="workflow-step-form dashboard-card" style="display: none;">
                <div class="card-header-custom">
                    <h5><i class="fas fa-shopping-cart"></i> Step 1: Sales Order</h5>
                </div>
                <div class="card-body">
                    <form id="salesOrderForm">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Customer Name *</label>
                                    <input type="text" class="form-control" id="step1CustomerName" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Customer Phone *</label>
                                    <input type="tel" class="form-control" id="step1CustomerPhone" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Pickup Location *</label>
                                    <select class="form-select" id="step1PickupLocation" required>
                                        <option value="">Select Warehouse</option>
                                        <option value="Chennai Main Warehouse">Chennai Main Warehouse</option>
                                        <option value="Bangalore Hub">Bangalore Hub</option>
                                        <option value="Coimbatore Depot">Coimbatore Depot</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Delivery Location *</label>
                                    <input type="text" class="form-control" id="step1DeliveryLocation" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Material Details *</label>
                                    <select class="form-select" id="step1MaterialDetails" required>
                                        <option value="">Select Material</option>
                                        <option value="LAM001 - Satin Laminate">LAM001 - Satin Laminate (500 sheets available)</option>
                                        <option value="LAM002 - Gloss Laminate">LAM002 - Gloss Laminate (800 sheets available)</option>
                                        <option value="LAM003 - Matte Laminate">LAM003 - Matte Laminate (150 sheets available)</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Priority *</label>
                                    <select class="form-select" id="step1Priority" required>
                                        <option value="">Select Priority</option>
                                        <option value="normal">Normal</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex justify-content-end">
                            <button type="button" class="btn btn-primary" onclick="nextWorkflowStep(2)">
                                Next: Warehouse <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            <!-- Additional workflow steps would be added here -->
        </div>
        
        <!-- Active Workflows -->
        <div class="row mt-4">
            <div class="col-12">
                <div class="dashboard-card">
                    <div class="card-header-custom">
                        <h5 class="card-title">Workflow History</h5>
                        <div class="d-flex gap-2 align-items-center">
                            <span class="badge bg-success" id="activeWorkflowsCount">3</span>
                            <small class="text-muted">Active Workflows</small>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-modern">
                            <thead>
                                <tr>
                                    <th>Workflow ID</th>
                                    <th>Customer</th>
                                    <th>Current Step</th>
                                    <th>Progress</th>
                                    <th>Started</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="activeWorkflowsTable">
                                <tr>
                                    <td><strong>WF001</strong></td>
                                    <td>ABC Corporation</td>
                                    <td><span class="workflow-status step-3">Step 3: Invoice</span></td>
                                    <td>
                                        <div class="progress">
                                            <div class="progress-bar workflow-progress bg-warning" style="width: 37%">37%</div>
                                        </div>
                                        <small class="text-muted">3 of 8 steps completed</small>
                                    </td>
                                    <td>10:30 AM</td>
                                    <td>
                                        <button class="btn btn-sm btn-continue-workflow" onclick="continueWorkflow('WF001')">
                                            <i class="fas fa-play"></i> Continue
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>WF002</strong></td>
                                    <td>XYZ Industries</td>
                                    <td><span class="workflow-status step-6">Step 6: Tracking</span></td>
                                    <td>
                                        <div class="progress">
                                            <div class="progress-bar workflow-progress bg-info" style="width: 75%">75%</div>
                                        </div>
                                        <small class="text-muted">6 of 8 steps completed</small>
                                    </td>
                                    <td>09:15 AM</td>
                                    <td>
                                        <button class="btn btn-sm btn-continue-workflow" onclick="continueWorkflow('WF002')">
                                            <i class="fas fa-play"></i> Continue
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>WF003</strong></td>
                                    <td>PQR Logistics</td>
                                    <td><span class="workflow-status step-2">Step 2: Warehouse</span></td>
                                    <td>
                                        <div class="progress">
                                            <div class="progress-bar workflow-progress bg-primary" style="width: 25%">25%</div>
                                        </div>
                                        <small class="text-muted">2 of 8 steps completed</small>
                                    </td>
                                    <td>08:45 AM</td>
                                    <td>
                                        <button class="btn btn-sm btn-continue-workflow" onclick="continueWorkflow('WF003')">
                                            <i class="fas fa-play"></i> Continue
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getPODContent() {
    return `
        <div class="section-header mb-4">
            <h2><i class="fas fa-file-signature"></i> Proof of Delivery Management</h2>
            <button class="btn btn-success btn-modern" onclick="createPOD()">
                <i class="fas fa-plus"></i> New POD
            </button>
        </div>
        
        <div class="dashboard-card">
            <div class="card-header-custom">
                <h5 class="card-title">Pending POD</h5>
                <span class="badge bg-warning" id="pendingPODCount">2</span>
            </div>
            <div class="table-responsive">
                <table class="table table-modern">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Delivery Date</th>
                            <th>Driver</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="podTableBody">
                        <tr>
                            <td>ORD001</td>
                            <td>ABC Corporation</td>
                            <td>2024-03-15</td>
                            <td>John Doe</td>
                            <td><span class="badge bg-warning">Pending</span></td>
                            <td>
                                <button class="btn btn-sm btn-success btn-modern" onclick="completePOD('ORD001')">
                                    <i class="fas fa-check"></i> Complete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function getTripsContent() {
    return `
        <div class="section-header mb-4">
            <h2><i class="fas fa-route"></i> Active Trips</h2>
            <button class="btn btn-primary btn-modern" onclick="createTrip()">
                <i class="fas fa-plus"></i> New Trip
            </button>
        </div>
        
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="dashboard-card text-center">
                    <h3 class="text-primary">4</h3>
                    <p class="mb-0">Active Trips</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="dashboard-card text-center">
                    <h3 class="text-success">12</h3>
                    <p class="mb-0">Completed Today</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="dashboard-card text-center">
                    <h3 class="text-warning">2</h3>
                    <p class="mb-0">Delayed</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="dashboard-card text-center">
                    <h3 class="text-info">94%</h3>
                    <p class="mb-0">On-Time Rate</p>
                </div>
            </div>
        </div>
        
        <div class="dashboard-card">
            <div class="card-header-custom">
                <h5 class="card-title">Trip List</h5>
            </div>
            <div class="table-responsive">
                <table class="table table-modern">
                    <thead>
                        <tr>
                            <th>Trip ID</th>
                            <th>Vehicle</th>
                            <th>Driver</th>
                            <th>Route</th>
                            <th>Progress</th>
                            <th>ETA</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="tripsTableBody">
                        <tr>
                            <td>TRP001</td>
                            <td>TN01AB1234</td>
                            <td>John Doe</td>
                            <td>Chennai → Bangalore</td>
                            <td>
                                <div class="progress">
                                    <div class="progress-bar bg-success" style="width: 65%">65%</div>
                                </div>
                            </td>
                            <td>2.5 hours</td>
                            <td><span class="badge bg-success">In Transit</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function getAnalyticsContent() {
    return `
        <div class="section-header mb-4">
            <h2><i class="fas fa-chart-bar"></i> Dispatch Analytics</h2>
            <div class="d-flex gap-2">
                <select class="form-select form-select-sm" style="width: auto;">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                </select>
                <button class="btn btn-outline-primary btn-modern" onclick="exportAnalytics()">
                    <i class="fas fa-download"></i> Export
                </button>
            </div>
        </div>
        
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="dashboard-card text-center">
                    <h3 class="text-primary">₹ 2.5M</h3>
                    <p class="mb-0">Total Revenue</p>
                    <small class="text-success">+15% vs last month</small>
                </div>
            </div>
            <div class="col-md-3">
                <div class="dashboard-card text-center">
                    <h3 class="text-success">1,234</h3>
                    <p class="mb-0">Orders Completed</p>
                    <small class="text-success">+8% vs last month</small>
                </div>
            </div>
            <div class="col-md-3">
                <div class="dashboard-card text-center">
                    <h3 class="text-info">2.3h</h3>
                    <p class="mb-0">Avg Delivery Time</p>
                    <small class="text-success">-12% vs last month</small>
                </div>
            </div>
            <div class="col-md-3">
                <div class="dashboard-card text-center">
                    <h3 class="text-warning">94.5%</h3>
                    <p class="mb-0">Customer Satisfaction</p>
                    <small class="text-success">+2% vs last month</small>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-8">
                <div class="dashboard-card">
                    <div class="card-header-custom">
                        <h5 class="card-title">Revenue Trends</h5>
                    </div>
                    <div class="chart-container-modern">
                        <canvas id="revenueTrendsChart" width="400" height="200"></canvas>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="dashboard-card">
                    <div class="card-header-custom">
                        <h5 class="card-title">Performance Metrics</h5>
                    </div>
                    <div class="p-3">
                        <div class="mb-3">
                            <div class="d-flex justify-content-between mb-1">
                                <small>On-Time Delivery</small>
                                <small>94%</small>
                            </div>
                            <div class="progress">
                                <div class="progress-bar bg-success" style="width: 94%"></div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="d-flex justify-content-between mb-1">
                                <small>Vehicle Utilization</small>
                                <small>87%</small>
                            </div>
                            <div class="progress">
                                <div class="progress-bar bg-info" style="width: 87%"></div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="d-flex justify-content-between mb-1">
                                <small>Driver Efficiency</small>
                                <small>91%</small>
                            </div>
                            <div class="progress">
                                <div class="progress-bar bg-warning" style="width: 91%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getMaterialsContent() {
    return `
        <div class="section-header mb-4">
            <h2><i class="fas fa-layer-group"></i> Material Master</h2>
            <p class="text-muted">Comprehensive laminate material catalog and specifications</p>
        </div>

        <!-- Material Stats -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card bg-primary text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h4>3</h4>
                                <p class="mb-0">Total Materials</p>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-layer-group fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-success text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h4>3</h4>
                                <p class="mb-0">Active SKUs</p>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-check-circle fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-info text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h4>3</h4>
                                <p class="mb-0">Finish Types</p>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-palette fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-warning text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h4>1450</h4>
                                <p class="mb-0">Total Stock</p>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-boxes fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Material Cards -->
        <div class="row mb-4">
            <!-- Satin Laminate -->
            <div class="col-md-4">
                <div class="card border-primary">
                    <div class="card-header bg-primary text-white">
                        <h5><i class="fas fa-layer-group"></i> Satin Laminate</h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <span class="badge bg-primary">Satin Finish</span>
                            <span class="badge bg-success">In Stock</span>
                        </div>
                        <div class="material-details">
                            <p><strong>Code:</strong> LAM001</p>
                            <p><strong>Finish:</strong> Satin (Semi-Gloss)</p>
                            <p><strong>Thickness:</strong> 1mm</p>
                            <p><strong>Size:</strong> 8ft x 4ft</p>
                            <p><strong>Stock:</strong> 500 sheets</p>
                            <p><strong>Price:</strong> ₹700/sheet</p>
                            <p><strong>Location:</strong> Chennai Main Warehouse</p>
                        </div>
                        <div class="mt-3">
                            <button class="btn btn-sm btn-primary w-100 mb-2" onclick="viewMaterialDetails('LAM001')">
                                <i class="fas fa-eye"></i> View Details
                            </button>
                            <button class="btn btn-sm btn-outline-primary w-100" onclick="editMaterial('LAM001')">
                                <i class="fas fa-edit"></i> Edit Material
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Gloss Laminate -->
            <div class="col-md-4">
                <div class="card border-success">
                    <div class="card-header bg-success text-white">
                        <h5><i class="fas fa-layer-group"></i> Gloss Laminate</h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <span class="badge bg-success">Gloss Finish</span>
                            <span class="badge bg-success">In Stock</span>
                        </div>
                        <div class="material-details">
                            <p><strong>Code:</strong> LAM002</p>
                            <p><strong>Finish:</strong> High Gloss</p>
                            <p><strong>Thickness:</strong> 1mm</p>
                            <p><strong>Size:</strong> 8ft x 4ft</p>
                            <p><strong>Stock:</strong> 800 sheets</p>
                            <p><strong>Price:</strong> ₹525/sheet</p>
                            <p><strong>Location:</strong> Bangalore Hub</p>
                        </div>
                        <div class="mt-3">
                            <button class="btn btn-sm btn-success w-100 mb-2" onclick="viewMaterialDetails('LAM002')">
                                <i class="fas fa-eye"></i> View Details
                            </button>
                            <button class="btn btn-sm btn-outline-success w-100" onclick="editMaterial('LAM002')">
                                <i class="fas fa-edit"></i> Edit Material
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Matte Laminate -->
            <div class="col-md-4">
                <div class="card border-warning">
                    <div class="card-header bg-warning text-dark">
                        <h5><i class="fas fa-layer-group"></i> Matte Laminate</h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <span class="badge bg-warning">Matte Finish</span>
                            <span class="badge bg-danger">Low Stock</span>
                        </div>
                        <div class="material-details">
                            <p><strong>Code:</strong> LAM003</p>
                            <p><strong>Finish:</strong> Matte (Non-Reflective)</p>
                            <p><strong>Thickness:</strong> 1mm</p>
                            <p><strong>Size:</strong> 8ft x 4ft</p>
                            <p><strong>Stock:</strong> 150 sheets</p>
                            <p><strong>Price:</strong> ₹533/sheet</p>
                            <p><strong>Location:</strong> Coimbatore Depot</p>
                        </div>
                        <div class="mt-3">
                            <button class="btn btn-sm btn-warning w-100 mb-2" onclick="viewMaterialDetails('LAM003')">
                                <i class="fas fa-eye"></i> View Details
                            </button>
                            <button class="btn btn-sm btn-outline-danger w-100" onclick="requestStock('LAM003')">
                                <i class="fas fa-plus"></i> Request Stock
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Material Master Table -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5><i class="fas fa-table"></i> Material Master List</h5>
                        <div class="btn-group">
                            <button class="btn btn-primary btn-sm" onclick="addNewMaterial()">
                                <i class="fas fa-plus"></i> Add Material
                            </button>
                            <button class="btn btn-outline-secondary btn-sm" onclick="exportMaterials()">
                                <i class="fas fa-download"></i> Export
                            </button>
                            <button class="btn btn-outline-primary btn-sm" onclick="refreshMaterials()">
                                <i class="fas fa-sync"></i> Refresh
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-striped table-hover">
                                <thead class="table-dark">
                                    <tr>
                                        <th>Code</th>
                                        <th>Material Name</th>
                                        <th>Finish Type</th>
                                        <th>Thickness</th>
                                        <th>Size</th>
                                        <th>Price/Sheet</th>
                                        <th>Stock</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>LAM001</strong></td>
                                        <td>Satin Laminate</td>
                                        <td><span class="badge bg-primary">Satin</span></td>
                                        <td>1mm</td>
                                        <td>8ft x 4ft</td>
                                        <td>₹700</td>
                                        <td>500 sheets</td>
                                        <td><span class="badge bg-success">In Stock</span></td>
                                        <td>
                                            <button class="btn btn-sm btn-outline-primary" onclick="editMaterial('LAM001')">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn btn-sm btn-outline-info" onclick="viewMaterialDetails('LAM001')">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="btn btn-sm btn-outline-danger" onclick="deleteMaterial('LAM001')">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>LAM002</strong></td>
                                        <td>Gloss Laminate</td>
                                        <td><span class="badge bg-success">Gloss</span></td>
                                        <td>1mm</td>
                                        <td>8ft x 4ft</td>
                                        <td>₹525</td>
                                        <td>800 sheets</td>
                                        <td><span class="badge bg-success">In Stock</span></td>
                                        <td>
                                            <button class="btn btn-sm btn-outline-primary" onclick="editMaterial('LAM002')">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn btn-sm btn-outline-info" onclick="viewMaterialDetails('LAM002')">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="btn btn-sm btn-outline-danger" onclick="deleteMaterial('LAM002')">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>LAM003</strong></td>
                                        <td>Matte Laminate</td>
                                        <td><span class="badge bg-warning">Matte</span></td>
                                        <td>1mm</td>
                                        <td>8ft x 4ft</td>
                                        <td>₹533</td>
                                        <td>150 sheets</td>
                                        <td><span class="badge bg-danger">Low Stock</span></td>
                                        <td>
                                            <button class="btn btn-sm btn-outline-primary" onclick="editMaterial('LAM003')">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn btn-sm btn-outline-info" onclick="viewMaterialDetails('LAM003')">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="btn btn-sm btn-outline-success" onclick="requestStock('LAM003')">
                                                <i class="fas fa-plus"></i> Request
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getWarehouseContent() {
    return `
        <div class="section-header mb-4">
            <h2><i class="fas fa-warehouse"></i> Warehouse Management</h2>
            <p class="text-muted">Manage warehouse inventory, stock levels, and laminate material tracking</p>
        </div>

        <!-- Warehouse Stats -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card bg-primary text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h4>3</h4>
                                <p class="mb-0">Warehouses</p>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-warehouse fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-success text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h4>3</h4>
                                <p class="mb-0">Laminate Types</p>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-layer-group fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-warning text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h4>1</h4>
                                <p class="mb-0">Low Stock</p>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-exclamation-triangle fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-info text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h4>₹8.5L</h4>
                                <p class="mb-0">Stock Value</p>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-rupee-sign fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Warehouse Locations -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5><i class="fas fa-building"></i> Warehouse Locations</h5>
                        <button class="btn btn-primary btn-sm" onclick="refreshWarehouseData()">
                            <i class="fas fa-sync"></i> Refresh
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <!-- Chennai Main Warehouse -->
                            <div class="col-md-4">
                                <div class="card border-primary">
                                    <div class="card-header bg-primary text-white">
                                        <h6><i class="fas fa-warehouse"></i> Chennai Main Warehouse</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="mb-2">
                                            <small><i class="fas fa-layer-group text-primary"></i> Materials: <strong>1</strong></small>
                                        </div>
                                        <div class="mb-2">
                                            <small><i class="fas fa-boxes text-success"></i> Stock: <strong>500 sheets</strong></small>
                                        </div>
                                        <div class="mb-2">
                                            <small><i class="fas fa-rupee-sign text-info"></i> Value: <strong>₹3.5L</strong></small>
                                        </div>
                                        <div class="mb-2">
                                            <small><i class="fas fa-check-circle text-success"></i> Status: <span class="badge bg-success">Operational</span></small>
                                        </div>
                                        <hr>
                                        <small class="text-muted">
                                            <strong>Materials:</strong> Satin Laminate (500 sheets)<br>
                                            <strong>Location:</strong> Chennai Port Area<br>
                                            <strong>Manager:</strong> Rajesh Kumar
                                        </small>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Bangalore Hub -->
                            <div class="col-md-4">
                                <div class="card border-success">
                                    <div class="card-header bg-success text-white">
                                        <h6><i class="fas fa-warehouse"></i> Bangalore Hub</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="mb-2">
                                            <small><i class="fas fa-layer-group text-primary"></i> Materials: <strong>1</strong></small>
                                        </div>
                                        <div class="mb-2">
                                            <small><i class="fas fa-boxes text-success"></i> Stock: <strong>800 sheets</strong></small>
                                        </div>
                                        <div class="mb-2">
                                            <small><i class="fas fa-rupee-sign text-info"></i> Value: <strong>₹4.2L</strong></small>
                                        </div>
                                        <div class="mb-2">
                                            <small><i class="fas fa-check-circle text-success"></i> Status: <span class="badge bg-success">Operational</span></small>
                                        </div>
                                        <hr>
                                        <small class="text-muted">
                                            <strong>Materials:</strong> Gloss Laminate (800 sheets)<br>
                                            <strong>Location:</strong> Electronic City<br>
                                            <strong>Manager:</strong> Suresh Babu
                                        </small>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Coimbatore Depot -->
                            <div class="col-md-4">
                                <div class="card border-warning">
                                    <div class="card-header bg-warning text-dark">
                                        <h6><i class="fas fa-warehouse"></i> Coimbatore Depot</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="mb-2">
                                            <small><i class="fas fa-layer-group text-primary"></i> Materials: <strong>1</strong></small>
                                        </div>
                                        <div class="mb-2">
                                            <small><i class="fas fa-boxes text-warning"></i> Stock: <strong>150 sheets</strong></small>
                                        </div>
                                        <div class="mb-2">
                                            <small><i class="fas fa-rupee-sign text-info"></i> Value: <strong>₹80K</strong></small>
                                        </div>
                                        <div class="mb-2">
                                            <small><i class="fas fa-exclamation-triangle text-warning"></i> Status: <span class="badge bg-warning">Low Stock</span></small>
                                        </div>
                                        <hr>
                                        <small class="text-muted">
                                            <strong>Materials:</strong> Matte Laminate (150 sheets)<br>
                                            <strong>Location:</strong> RS Puram<br>
                                            <strong>Manager:</strong> Manjunath R
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Material Inventory Table -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5><i class="fas fa-list"></i> Laminate Inventory</h5>
                        <div class="btn-group">
                            <button class="btn btn-outline-secondary btn-sm" onclick="exportMaterials()">
                                <i class="fas fa-download"></i> Export
                            </button>
                            <button class="btn btn-outline-primary btn-sm" onclick="refreshMaterials()">
                                <i class="fas fa-sync"></i> Refresh
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-striped table-hover">
                                <thead class="table-dark">
                                    <tr>
                                        <th>Material Code</th>
                                        <th>Laminate Type</th>
                                        <th>Finish</th>
                                        <th>Warehouse</th>
                                        <th>Stock</th>
                                        <th>Unit</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>LAM001</strong></td>
                                        <td>Satin Laminate</td>
                                        <td><span class="badge bg-primary">Satin Finish</span></td>
                                        <td>Chennai Main</td>
                                        <td>500</td>
                                        <td>Sheets</td>
                                        <td><span class="badge bg-success">Available</span></td>
                                        <td>
                                            <button class="btn btn-sm btn-outline-primary" onclick="editMaterial('LAM001')">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn btn-sm btn-outline-info" onclick="viewMaterial('LAM001')">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>LAM002</strong></td>
                                        <td>Gloss Laminate</td>
                                        <td><span class="badge bg-success">Gloss Finish</span></td>
                                        <td>Bangalore Hub</td>
                                        <td>800</td>
                                        <td>Sheets</td>
                                        <td><span class="badge bg-success">Available</span></td>
                                        <td>
                                            <button class="btn btn-sm btn-outline-primary" onclick="editMaterial('LAM002')">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn btn-sm btn-outline-info" onclick="viewMaterial('LAM002')">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>LAM003</strong></td>
                                        <td>Matte Laminate</td>
                                        <td><span class="badge bg-warning">Matte Finish</span></td>
                                        <td>Coimbatore Depot</td>
                                        <td>150</td>
                                        <td>Sheets</td>
                                        <td><span class="badge bg-danger">Low Stock</span></td>
                                        <td>
                                            <button class="btn btn-sm btn-outline-primary" onclick="editMaterial('LAM003')">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn btn-sm btn-outline-success" onclick="requestStock('LAM003')">
                                                <i class="fas fa-plus"></i> Request
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Utility Functions
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="d-flex justify-content-between align-items-start">
            <div>
                <i class="fas fa-${getNotificationIcon(type)} me-2"></i>
                ${message}
            </div>
            <button class="btn-close btn-close-sm" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'warning': return 'exclamation-triangle';
        case 'error': return 'times-circle';
        default: return 'info-circle';
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('show');
    } else {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    }
}

// Section Initialization Functions
function initializeDashboard() {
    updateDashboardKPIs();
    initializeDashboardCharts();
    loadRecentActivities();
    showNotification('Dashboard loaded successfully', 'success');
}

function initializeOrders() {
    loadOrdersTable();
    updateOrderCounts();
    showNotification('Order tracking loaded', 'info');
}

function initializeVehicles() {
    loadAvailableVehicles();
    loadAvailableDrivers();
    initializeVehicleChart();
    showNotification('Vehicle management loaded', 'info');
}

function initializeTracking() {
    loadActiveVehiclesTracking();
    updateLiveStats();
    showNotification('Live tracking ready - Click "Start Live Tracking" to begin', 'info');
}

function initializeRouteMap() {
    loadRoutesList();
    updateRouteStatistics();
    showNotification('Route map tracking initialized', 'info');
}

function initializeWorkflow() {
    resetWorkflowSteps();
    loadActiveWorkflows();
    showNotification('Workflow management ready', 'info');
}

function initializePOD() {
    showNotification('POD management loaded', 'info');
}

function initializeTrips() {
    showNotification('Active trips loaded', 'info');
}

function initializeAnalytics() {
    showNotification('Analytics loaded', 'info');
}

function initializeMaterials() {
    showNotification('Material Master loaded', 'info');
    console.log('Material Master module initialized');
}

function initializeWarehouse() {
    showNotification('Warehouse Management loaded', 'info');
    console.log('Warehouse module initialized');
}

// Material Master Functions
function addNewMaterial() {
    const modalHTML = `
        <div class="modal fade show" id="addMaterialModal" style="display: block; background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title"><i class="fas fa-plus"></i> Add New Material</h5>
                        <button type="button" class="btn-close btn-close-white" onclick="closeModal('addMaterialModal')"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addMaterialForm">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Material Code *</label>
                                    <input type="text" class="form-control" id="materialCode" placeholder="e.g., LAM004" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Material Name *</label>
                                    <input type="text" class="form-control" id="materialName" placeholder="e.g., Premium Laminate" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Finish Type *</label>
                                    <select class="form-control" id="finishType" required>
                                        <option value="">Select Finish</option>
                                        <option value="Satin">Satin Finish</option>
                                        <option value="Gloss">Gloss Finish</option>
                                        <option value="Matte">Matte Finish</option>
                                        <option value="Textured">Textured Finish</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Thickness *</label>
                                    <select class="form-control" id="thickness" required>
                                        <option value="">Select Thickness</option>
                                        <option value="0.8mm">0.8mm</option>
                                        <option value="1mm">1mm</option>
                                        <option value="1.2mm">1.2mm</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Size *</label>
                                    <input type="text" class="form-control" id="size" value="8ft x 4ft" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Price per Sheet *</label>
                                    <input type="number" class="form-control" id="price" placeholder="e.g., 600" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Initial Stock *</label>
                                    <input type="number" class="form-control" id="stock" placeholder="e.g., 100" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Warehouse Location *</label>
                                    <select class="form-control" id="warehouse" required>
                                        <option value="">Select Warehouse</option>
                                        <option value="Chennai Main">Chennai Main Warehouse</option>
                                        <option value="Bangalore Hub">Bangalore Hub</option>
                                        <option value="Coimbatore Depot">Coimbatore Depot</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeModal('addMaterialModal')">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="saveMaterial()"><i class="fas fa-save"></i> Save Material</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function saveMaterial() {
    const code = document.getElementById('materialCode').value;
    const name = document.getElementById('materialName').value;
    const finish = document.getElementById('finishType').value;
    const thickness = document.getElementById('thickness').value;
    const size = document.getElementById('size').value;
    const price = document.getElementById('price').value;
    const stock = document.getElementById('stock').value;
    const warehouse = document.getElementById('warehouse').value;
    
    if (!code || !name || !finish || !thickness || !price || !stock || !warehouse) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    
    showNotification(`Material ${code} - ${name} added successfully!`, 'success');
    closeModal('addMaterialModal');
    setTimeout(() => showDynamicSection('materials'), 500);
}

function viewMaterialDetails(materialId) {
    const materials = {
        'LAM001': {
            code: 'LAM001',
            name: 'Satin Laminate',
            finish: 'Satin (Semi-Gloss)',
            thickness: '1mm',
            size: '8ft x 4ft',
            price: '₹700',
            stock: '500 sheets',
            warehouse: 'Chennai Main Warehouse',
            status: 'In Stock',
            description: 'Premium quality satin finish laminate with semi-gloss appearance. Ideal for modern interiors.',
            supplier: 'Laminate Industries Ltd.',
            lastUpdated: '2024-03-15'
        },
        'LAM002': {
            code: 'LAM002',
            name: 'Gloss Laminate',
            finish: 'High Gloss',
            thickness: '1mm',
            size: '8ft x 4ft',
            price: '₹525',
            stock: '800 sheets',
            warehouse: 'Bangalore Hub',
            status: 'In Stock',
            description: 'High gloss finish laminate with reflective surface. Perfect for contemporary designs.',
            supplier: 'Premium Laminates Co.',
            lastUpdated: '2024-03-14'
        },
        'LAM003': {
            code: 'LAM003',
            name: 'Matte Laminate',
            finish: 'Matte (Non-Reflective)',
            thickness: '1mm',
            size: '8ft x 4ft',
            price: '₹533',
            stock: '150 sheets',
            warehouse: 'Coimbatore Depot',
            status: 'Low Stock',
            description: 'Elegant matte finish laminate with non-reflective surface. Suitable for minimalist designs.',
            supplier: 'Elite Surfaces Pvt. Ltd.',
            lastUpdated: '2024-03-13'
        }
    };
    
    const material = materials[materialId];
    if (!material) {
        showNotification('Material not found', 'error');
        return;
    }
    
    const modalHTML = `
        <div class="modal fade show" id="viewMaterialModal" style="display: block; background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-info text-white">
                        <h5 class="modal-title"><i class="fas fa-eye"></i> Material Details - ${material.code}</h5>
                        <button type="button" class="btn-close btn-close-white" onclick="closeModal('viewMaterialModal')"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card mb-3">
                                    <div class="card-header bg-light">
                                        <h6 class="mb-0">Basic Information</h6>
                                    </div>
                                    <div class="card-body">
                                        <p><strong>Code:</strong> ${material.code}</p>
                                        <p><strong>Name:</strong> ${material.name}</p>
                                        <p><strong>Finish Type:</strong> <span class="badge bg-primary">${material.finish}</span></p>
                                        <p><strong>Status:</strong> <span class="badge ${material.status === 'In Stock' ? 'bg-success' : 'bg-danger'}">${material.status}</span></p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card mb-3">
                                    <div class="card-header bg-light">
                                        <h6 class="mb-0">Specifications</h6>
                                    </div>
                                    <div class="card-body">
                                        <p><strong>Thickness:</strong> ${material.thickness}</p>
                                        <p><strong>Size:</strong> ${material.size}</p>
                                        <p><strong>Price:</strong> ${material.price}/sheet</p>
                                        <p><strong>Current Stock:</strong> ${material.stock}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card mb-3">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Additional Details</h6>
                            </div>
                            <div class="card-body">
                                <p><strong>Description:</strong> ${material.description}</p>
                                <p><strong>Warehouse:</strong> ${material.warehouse}</p>
                                <p><strong>Supplier:</strong> ${material.supplier}</p>
                                <p><strong>Last Updated:</strong> ${material.lastUpdated}</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeModal('viewMaterialModal')">Close</button>
                        <button type="button" class="btn btn-primary" onclick="closeModal('viewMaterialModal'); editMaterial('${materialId}')">
                            <i class="fas fa-edit"></i> Edit Material
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function deleteMaterial(materialId) {
    if (confirm(`Are you sure you want to delete material ${materialId}?\n\nThis action cannot be undone.`)) {
        showNotification(`Material ${materialId} deleted successfully!`, 'success');
        setTimeout(() => showDynamicSection('materials'), 500);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}

// Warehouse Management Functions
function refreshWarehouseData() {
    showNotification('Refreshing warehouse data...', 'info');
    setTimeout(() => {
        showNotification('Warehouse data refreshed successfully!', 'success');
        showDynamicSection('warehouse');
    }, 1000);
}

function exportMaterials() {
    showNotification('Preparing export file...', 'info');
    setTimeout(() => {
        showNotification('Materials exported successfully! Download started.', 'success');
    }, 1500);
}

function refreshMaterials() {
    showNotification('Refreshing materials list...', 'info');
    setTimeout(() => {
        showNotification('Materials list refreshed successfully!', 'success');
        const currentSection = document.querySelector('.nav-link.active')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
        if (currentSection) {
            showDynamicSection(currentSection);
        }
    }, 1000);
}

function editMaterial(materialId) {
    const materials = {
        'LAM001': { code: 'LAM001', name: 'Satin Laminate', finish: 'Satin', thickness: '1mm', size: '8ft x 4ft', price: '700', stock: '500', warehouse: 'Chennai Main' },
        'LAM002': { code: 'LAM002', name: 'Gloss Laminate', finish: 'Gloss', thickness: '1mm', size: '8ft x 4ft', price: '525', stock: '800', warehouse: 'Bangalore Hub' },
        'LAM003': { code: 'LAM003', name: 'Matte Laminate', finish: 'Matte', thickness: '1mm', size: '8ft x 4ft', price: '533', stock: '150', warehouse: 'Coimbatore Depot' }
    };
    
    const material = materials[materialId];
    if (!material) {
        showNotification('Material not found', 'error');
        return;
    }
    
    const modalHTML = `
        <div class="modal fade show" id="editMaterialModal" style="display: block; background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-warning text-dark">
                        <h5 class="modal-title"><i class="fas fa-edit"></i> Edit Material - ${material.code}</h5>
                        <button type="button" class="btn-close" onclick="closeModal('editMaterialModal')"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editMaterialForm">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Material Code</label>
                                    <input type="text" class="form-control" value="${material.code}" disabled>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Material Name *</label>
                                    <input type="text" class="form-control" id="editMaterialName" value="${material.name}" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Finish Type *</label>
                                    <select class="form-control" id="editFinishType" required>
                                        <option value="Satin" ${material.finish === 'Satin' ? 'selected' : ''}>Satin Finish</option>
                                        <option value="Gloss" ${material.finish === 'Gloss' ? 'selected' : ''}>Gloss Finish</option>
                                        <option value="Matte" ${material.finish === 'Matte' ? 'selected' : ''}>Matte Finish</option>
                                        <option value="Textured">Textured Finish</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Thickness *</label>
                                    <select class="form-control" id="editThickness" required>
                                        <option value="0.8mm">0.8mm</option>
                                        <option value="1mm" ${material.thickness === '1mm' ? 'selected' : ''}>1mm</option>
                                        <option value="1.2mm">1.2mm</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Size *</label>
                                    <input type="text" class="form-control" id="editSize" value="${material.size}" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Price per Sheet *</label>
                                    <input type="number" class="form-control" id="editPrice" value="${material.price}" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Current Stock *</label>
                                    <input type="number" class="form-control" id="editStock" value="${material.stock}" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Warehouse Location *</label>
                                    <select class="form-control" id="editWarehouse" required>
                                        <option value="Chennai Main" ${material.warehouse === 'Chennai Main' ? 'selected' : ''}>Chennai Main Warehouse</option>
                                        <option value="Bangalore Hub" ${material.warehouse === 'Bangalore Hub' ? 'selected' : ''}>Bangalore Hub</option>
                                        <option value="Coimbatore Depot" ${material.warehouse === 'Coimbatore Depot' ? 'selected' : ''}>Coimbatore Depot</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeModal('editMaterialModal')">Cancel</button>
                        <button type="button" class="btn btn-warning" onclick="updateMaterial('${materialId}')">
                            <i class="fas fa-save"></i> Update Material
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function updateMaterial(materialId) {
    showNotification(`Material ${materialId} updated successfully!`, 'success');
    closeModal('editMaterialModal');
    setTimeout(() => {
        const currentSection = document.querySelector('.nav-link.active')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
        if (currentSection) {
            showDynamicSection(currentSection);
        }
    }, 500);
}

function viewMaterial(materialId) {
    viewMaterialDetails(materialId);
}

function requestStock(materialId) {
    const modalHTML = `
        <div class="modal fade show" id="requestStockModal" style="display: block; background: rgba(0,0,0,0.5);">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title"><i class="fas fa-plus"></i> Request Stock - ${materialId}</h5>
                        <button type="button" class="btn-close btn-close-white" onclick="closeModal('requestStockModal')"></button>
                    </div>
                    <div class="modal-body">
                        <form id="requestStockForm">
                            <div class="mb-3">
                                <label class="form-label">Material Code</label>
                                <input type="text" class="form-control" value="${materialId}" disabled>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Quantity to Request *</label>
                                <input type="number" class="form-control" id="requestQuantity" placeholder="Enter quantity" min="1" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Priority *</label>
                                <select class="form-control" id="requestPriority" required>
                                    <option value="Normal">Normal</option>
                                    <option value="High">High</option>
                                    <option value="Urgent" selected>Urgent</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Notes</label>
                                <textarea class="form-control" id="requestNotes" rows="3" placeholder="Additional notes..."></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeModal('requestStockModal')">Cancel</button>
                        <button type="button" class="btn btn-success" onclick="submitStockRequest('${materialId}')">
                            <i class="fas fa-paper-plane"></i> Submit Request
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function submitStockRequest(materialId) {
    const quantity = document.getElementById('requestQuantity').value;
    const priority = document.getElementById('requestPriority').value;
    
    if (!quantity || quantity <= 0) {
        showNotification('Please enter a valid quantity', 'error');
        return;
    }
    
    showNotification(`Stock request for ${quantity} sheets of ${materialId} submitted successfully! Priority: ${priority}`, 'success');
    closeModal('requestStockModal');
}

// Data Loading Functions
function updateDashboardKPIs() {
    // Calculate real-time KPIs
    const totalRevenue = dispatchData.orders.reduce((sum, order) => sum + (order.value || 0), 0);
    const totalOrders = dispatchData.orders.length;
    const activeTrips = dispatchData.vehicles.filter(v => v.status === 'in-transit').length;
    
    document.getElementById('totalRevenue').textContent = `₹ ${(totalRevenue / 1000).toFixed(0)}K`;
    document.getElementById('totalOrders').textContent = totalOrders.toLocaleString();
    document.getElementById('activeTrips').textContent = activeTrips.toLocaleString();
}

function initializeDashboardCharts() {
    // Performance Chart
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        new Chart(performanceCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Orders',
                    data: [12, 19, 15, 25, 22, 18, 24],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
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
    
    // Order Status Chart
    const orderStatusCtx = document.getElementById('orderStatusChart');
    if (orderStatusCtx) {
        new Chart(orderStatusCtx, {
            type: 'doughnut',
            data: {
                labels: ['Pending', 'Processing', 'Completed'],
                datasets: [{
                    data: [30, 45, 25],
                    backgroundColor: ['#ffc107', '#0dcaf0', '#198754'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

function loadRecentActivities() {
    const container = document.getElementById('recentActivities');
    if (!container) return;
    
    const activities = [
        { time: '10:30 AM', text: 'Order ORD001 assigned to vehicle TN01AB1234', type: 'success' },
        { time: '10:15 AM', text: 'New order received from ABC Corporation', type: 'info' },
        { time: '09:45 AM', text: 'Vehicle TN02CD5678 reached destination', type: 'success' },
        { time: '09:30 AM', text: 'Delay reported for order ORD002', type: 'warning' }
    ];
    
    container.innerHTML = activities.map(activity => `
        <div class="d-flex align-items-center mb-3 p-2 rounded" style="background: rgba(102, 126, 234, 0.05);">
            <div class="me-3">
                <span class="badge bg-${activity.type === 'success' ? 'success' : activity.type === 'warning' ? 'warning' : 'info'} rounded-pill">
                    ${activity.time}
                </span>
            </div>
            <div class="flex-grow-1">
                <small>${activity.text}</small>
            </div>
        </div>
    `).join('');
}

function loadOrdersTable() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = dispatchData.orders.map(order => `
        <tr>
            <td><strong>${order.id}</strong></td>
            <td>${order.customer}</td>
            <td>${order.pickup} → ${order.delivery}</td>
            <td><span class="badge bg-${order.priority === 'urgent' ? 'danger' : order.priority === 'high' ? 'warning' : 'secondary'}">${order.priority}</span></td>
            <td><span class="badge bg-${order.status === 'completed' ? 'success' : order.status === 'processing' ? 'info' : 'warning'}">${order.status}</span></td>
            <td>₹ ${order.value?.toLocaleString() || 'N/A'}</td>
            <td>
                <button class="btn btn-sm btn-primary btn-modern" onclick="viewOrder('${order.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function updateOrderCounts() {
    const pending = dispatchData.orders.filter(o => o.status === 'pending').length;
    const processing = dispatchData.orders.filter(o => o.status === 'processing').length;
    const completed = dispatchData.orders.filter(o => o.status === 'completed').length;
    const urgent = dispatchData.orders.filter(o => o.priority === 'urgent').length;
    
    document.getElementById('pendingOrdersCount').textContent = pending;
    document.getElementById('processingOrdersCount').textContent = processing;
    document.getElementById('completedOrdersCount').textContent = completed;
    document.getElementById('urgentOrdersCount').textContent = urgent;
}

function loadAvailableVehicles() {
    const container = document.getElementById('availableVehiclesList');
    if (!container) return;
    
    const availableVehicles = dispatchData.vehicles.filter(v => v.status === 'available');
    
    container.innerHTML = availableVehicles.map(vehicle => `
        <div class="p-3 border-bottom">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="mb-1">${vehicle.number}</h6>
                    <small class="text-muted">${vehicle.type.toUpperCase()}</small>
                </div>
                <span class="badge bg-success">Available</span>
            </div>
            <div class="mt-2">
                <small><i class="fas fa-map-marker-alt"></i> ${vehicle.location}</small>
                <div class="d-flex justify-content-between mt-1">
                    <small><i class="fas fa-gas-pump"></i> Fuel: ${vehicle.fuel}%</small>
                    <button class="btn btn-sm btn-outline-primary btn-modern" onclick="assignVehicleToOrder('${vehicle.id}')">
                        Assign
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function loadAvailableDrivers() {
    const container = document.getElementById('availableDriversList');
    if (!container) return;
    
    // Sample driver data
    const drivers = [
        { id: 'D001', name: 'John Doe', experience: '5 years', rating: 4.8 },
        { id: 'D002', name: 'Jane Smith', experience: '3 years', rating: 4.9 },
        { id: 'D003', name: 'Mike Johnson', experience: '7 years', rating: 4.7 }
    ];
    
    container.innerHTML = drivers.map(driver => `
        <div class="p-3 border-bottom">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="mb-1">${driver.name}</h6>
                    <small class="text-muted">${driver.experience} experience</small>
                </div>
                <span class="badge bg-info">Available</span>
            </div>
            <div class="mt-2">
                <div class="d-flex justify-content-between align-items-center">
                    <small><i class="fas fa-star text-warning"></i> ${driver.rating}</small>
                    <button class="btn btn-sm btn-outline-success btn-modern" onclick="assignDriver('${driver.id}')">
                        Assign
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Real-time Updates
function startRealTimeUpdates() {
    setInterval(() => {
        if (currentSection === 'dashboard') {
            updateDashboardKPIs();
        }
        // Add other real-time updates as needed
    }, 30000); // Update every 30 seconds
}

// Quick Action Functions
function createNewDispatch() {
    showNotification('Opening new dispatch form...', 'info');
    showDynamicSection('workflow');
}

function emergencyAlert() {
    showNotification('Emergency alert activated!', 'error');
    // Implementation for emergency alert
}

function generateReport() {
    showNotification('Generating dispatch report...', 'info');
    // Implementation for report generation
}

console.log('Dynamic Dispatch Management System JavaScript loaded successfully');
// Live Tracking Functions
let liveTrackingMap = null;
let liveVehicleMarkers = {};

function initializeLiveMap() {
    const mapContainer = document.getElementById('liveTrackingMap');
    if (!mapContainer) {
        showNotification('Live tracking map container not found', 'error');
        return;
    }
    
    showNotification('Initializing live tracking map...', 'info');
    
    // Create simulated map
    mapContainer.innerHTML = `
        <div style="height: 500px; background: linear-gradient(135deg, #e3f2fd, #bbdefb); position: relative; border-radius: 10px; overflow: hidden;">
            <!-- Vehicle Markers -->
            <div class="vehicle-marker" style="position: absolute; top: 35%; left: 25%; transform: translate(-50%, -50%);">
                <div class="marker-icon bg-success" style="width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; animation: pulse 2s infinite;">
                    <i class="fas fa-truck"></i>
                </div>
                <div class="marker-label" style="background: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; margin-top: 2px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">TN01AB1234</div>
            </div>
            
            <div class="vehicle-marker" style="position: absolute; top: 55%; left: 45%; transform: translate(-50%, -50%);">
                <div class="marker-icon bg-warning" style="width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; animation: pulse 2s infinite;">
                    <i class="fas fa-truck"></i>
                </div>
                <div class="marker-label" style="background: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; margin-top: 2px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">TN02CD5678</div>
            </div>
            
            <div class="vehicle-marker" style="position: absolute; top: 70%; left: 65%; transform: translate(-50%, -50%);">
                <div class="marker-icon bg-info" style="width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; animation: pulse 2s infinite;">
                    <i class="fas fa-truck"></i>
                </div>
                <div class="marker-label" style="background: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; margin-top: 2px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">TN04GH3456</div>
            </div>
            
            <!-- Route Lines -->
            <svg style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
                <path d="M200,210 Q300,180 360,270" stroke="#28a745" stroke-width="3" fill="none" stroke-dasharray="10,5" opacity="0.7"/>
                <path d="M360,330 Q450,300 520,390" stroke="#ffc107" stroke-width="3" fill="none" stroke-dasharray="10,5" opacity="0.7"/>
                <path d="M520,420 Q580,400 650,480" stroke="#17a2b8" stroke-width="3" fill="none" stroke-dasharray="10,5" opacity="0.7"/>
            </svg>
            
            <!-- Map Info -->
            <div style="position: absolute; bottom: 10px; left: 10px; background: rgba(255,255,255,0.9); padding: 8px; border-radius: 6px; font-size: 12px;">
                <div><strong>Live Tracking Active</strong></div>
                <div>5 vehicles online</div>
                <div>Last update: ${new Date().toLocaleTimeString()}</div>
            </div>
        </div>
    `;
    
    loadActiveVehiclesTracking();
    showNotification('Live tracking map initialized successfully!', 'success');
}
function loadActiveVehiclesTracking() {
    const container = document.getElementById('activeVehiclesTracking');
    if (!container) return;
    
    const vehicles = [
        { id: 'TN01AB1234', driver: 'John Doe', route: 'Chennai → Bangalore', speed: 52, status: 'On Route', progress: 65, eta: '2h 30m', color: 'success' },
        { id: 'TN02CD5678', driver: 'Jane Smith', route: 'Chennai → Coimbatore', speed: 38, status: 'Delayed', progress: 40, eta: '4h 15m', color: 'warning' },
        { id: 'TN04GH3456', driver: 'Sarah Wilson', route: 'Chennai → Madurai', speed: 48, status: 'On Route', progress: 25, eta: '3h 45m', color: 'success' },
        { id: 'TN03EF9012', driver: 'Mike Johnson', route: 'Bangalore → Chennai', speed: 0, status: 'Idle', progress: 0, eta: 'N/A', color: 'info' },
        { id: 'TN05IJ7890', driver: 'Robert Brown', route: 'Coimbatore → Chennai', speed: 55, status: 'On Route', progress: 80, eta: '1h 20m', color: 'success' }
    ];
    
    container.innerHTML = vehicles.map(vehicle => `
        <div class="vehicle-tracking-item p-3 border-bottom" onclick="trackVehicle('${vehicle.id}')">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                    <h6 class="mb-1">
                        <div class="vehicle-status-dot bg-${vehicle.color} me-2" style="width: 8px; height: 8px; border-radius: 50%; display: inline-block;"></div>
                        ${vehicle.id}
                    </h6>
                    <small class="text-muted">${vehicle.driver}</small>
                </div>
                <span class="badge bg-${vehicle.color}">${vehicle.status}</span>
            </div>
            <p class="mb-2 small"><i class="fas fa-route"></i> ${vehicle.route}</p>
            <div class="d-flex justify-content-between align-items-center mb-2">
                <small><i class="fas fa-tachometer-alt"></i> ${vehicle.speed} km/h</small>
                <small><i class="fas fa-clock"></i> ETA: ${vehicle.eta}</small>
            </div>
            <div class="progress mb-1" style="height: 6px;">
                <div class="progress-bar bg-${vehicle.color}" style="width: ${vehicle.progress}%;"></div>
            </div>
            <small class="text-muted">${vehicle.progress}% Complete</small>
        </div>
    `).join('');
}

function updateLiveStats() {
    document.getElementById('liveVehiclesCount').textContent = '5';
    document.getElementById('activeTripsCount').textContent = '3';
    document.getElementById('avgSpeedDisplay').textContent = Math.floor(Math.random() * 10 + 40);
    document.getElementById('alertsCount').textContent = Math.floor(Math.random() * 3 + 1);
}

// Route Map Functions
function loadRoutesList() {
    const container = document.getElementById('routesList');
    if (!container) return;
    
    const routes = [
        { code: 'CHN-BLR-001', name: 'Chennai to Bangalore', distance: '350 km', status: 'Active', vehicles: 1 },
        { code: 'CHN-COI-002', name: 'Chennai to Coimbatore', distance: '502 km', status: 'Active', vehicles: 1 },
        { code: 'CHN-MDU-003', name: 'Chennai to Madurai', distance: '458 km', status: 'Active', vehicles: 1 },
        { code: 'BLR-HYD-004', name: 'Bangalore to Hyderabad', distance: '569 km', status: 'Inactive', vehicles: 0 },
        { code: 'CHN-TRY-005', name: 'Chennai to Trichy', distance: '320 km', status: 'Active', vehicles: 0 }
    ];
    
    container.innerHTML = routes.map(route => `
        <div class="p-3 border-bottom route-item" onclick="focusRoute('${route.code}')">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                    <h6 class="mb-1">${route.code}</h6>
                    <small class="text-muted">${route.name}</small>
                </div>
                <span class="badge bg-${route.status === 'Active' ? 'success' : 'secondary'}">${route.status}</span>
            </div>
            <div class="d-flex justify-content-between align-items-center">
                <small><i class="fas fa-road"></i> ${route.distance}</small>
                <small><i class="fas fa-truck"></i> ${route.vehicles} vehicles</small>
            </div>
        </div>
    `).join('');
}

function updateRouteStatistics() {
    document.getElementById('totalActiveRoutes').textContent = '4';
    document.getElementById('vehiclesOnRoute').textContent = '3';
    document.getElementById('avgSpeed').textContent = '45';
    document.getElementById('etaDeliveries').textContent = '2.5h';
}

// Enhanced Workflow Functions
function resetWorkflowSteps() {
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.remove('active', 'completed', 'current');
        if (index === 0) step.classList.add('active');
    });
}

function loadActiveWorkflows() {
    // Update active workflows table with real-time data
    updateActiveWorkflowsTable();
}

function startManualWorkflow() {
    showNotification('Starting manual dispatch workflow...', 'info');
    document.getElementById('workflowFormsContainer').style.display = 'block';
    document.getElementById('step1Form').style.display = 'block';
    
    // Highlight step 1
    highlightWorkflowStep(1);
    showNotification('Workflow Step 1: Sales Order - Enter customer details', 'info');
}

function nextWorkflowStep(step) {
    showNotification(`Moving to step ${step}...`, 'info');
    
    // Hide current form
    document.querySelectorAll('.workflow-step-form').forEach(form => {
        form.style.display = 'none';
    });
    
    // Highlight current step
    highlightWorkflowStep(step);
    
    // Show appropriate form for the step
    showWorkflowStepForm(step);
    
    // Update step status
    updateWorkflowProgress(step);
}

function highlightWorkflowStep(currentStep) {
    document.querySelectorAll('.step').forEach((stepEl, index) => {
        stepEl.classList.remove('active', 'completed', 'current');
        
        if (index < currentStep - 1) {
            stepEl.classList.add('completed');
        } else if (index === currentStep - 1) {
            stepEl.classList.add('current', 'active');
            stepEl.style.transform = 'scale(1.1)';
            stepEl.style.boxShadow = '0 0 20px rgba(13, 110, 253, 0.5)';
        } else {
            stepEl.style.transform = 'scale(1)';
            stepEl.style.boxShadow = 'none';
        }
    });
    
    // Scroll to current step if needed
    const currentStepElement = document.querySelector('.step.current');
    if (currentStepElement) {
        currentStepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function showWorkflowStepForm(step) {
    const stepNames = {
        1: 'Sales Order',
        2: 'Warehouse Assignment', 
        3: 'Invoice Generation',
        4: 'Vehicle & Driver Assignment',
        5: 'Delivery Initiation',
        6: 'Live Tracking',
        7: 'Delivery Confirmation',
        8: 'Sign-off & POD'
    };
    
    const stepDescriptions = {
        1: 'Enter customer and order details to begin the dispatch process',
        2: 'Assign warehouse location and allocate materials for the order',
        3: 'Generate invoice and billing information for the customer',
        4: 'Assign vehicle and driver for order delivery',
        5: 'Initiate delivery process and notify customer',
        6: 'Monitor real-time delivery progress and location',
        7: 'Confirm successful delivery at destination',
        8: 'Obtain customer signature and complete proof of delivery'
    };
    
    showNotification(`Workflow Step ${step}: ${stepNames[step]} - ${stepDescriptions[step]}`, 'info');
    
    // Show the appropriate step form
    const stepFormId = `step${step}Form`;
    const stepForm = document.getElementById(stepFormId);
    if (stepForm) {
        stepForm.style.display = 'block';
    } else {
        // Create dynamic form for steps that don't have predefined forms
        createDynamicStepForm(step, stepNames[step], stepDescriptions[step]);
    }
}

function createDynamicStepForm(step, stepName, stepDescription) {
    const container = document.getElementById('workflowFormsContainer');
    
    const formHTML = `
        <div id="step${step}Form" class="workflow-step-form dashboard-card" style="display: block;">
            <div class="card-header-custom">
                <h5><i class="fas fa-${getStepIcon(step)}"></i> Step ${step}: ${stepName}</h5>
                <span class="badge bg-primary">Step ${step} of 8</span>
            </div>
            <div class="card-body">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    <strong>Current Step:</strong> ${stepDescription}
                </div>
                
                <div class="step-content">
                    ${getStepContent(step)}
                </div>
                
                <div class="d-flex justify-content-between mt-4">
                    ${step > 1 ? `<button type="button" class="btn btn-outline-secondary" onclick="previousWorkflowStep(${step - 1})">
                        <i class="fas fa-arrow-left"></i> Previous
                    </button>` : '<div></div>'}
                    
                    ${step < 8 ? `<button type="button" class="btn btn-primary" onclick="nextWorkflowStep(${step + 1})">
                        Next: ${getNextStepName(step)} <i class="fas fa-arrow-right"></i>
                    </button>` : `<button type="button" class="btn btn-success" onclick="completeWorkflow()">
                        <i class="fas fa-check"></i> Complete Workflow
                    </button>`}
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', formHTML);
}

function getStepIcon(step) {
    const icons = {
        1: 'shopping-cart',
        2: 'warehouse', 
        3: 'file-invoice',
        4: 'user-plus',
        5: 'play',
        6: 'map-marker-alt',
        7: 'check',
        8: 'signature'
    };
    return icons[step] || 'circle';
}

function getStepContent(step) {
    switch(step) {
        case 2:
            return `
                <div class="row">
                    <div class="col-md-6">
                        <label class="form-label">Warehouse Location</label>
                        <select class="form-control">
                            <option>Chennai Main Warehouse</option>
                            <option>Bangalore Hub</option>
                            <option>Coimbatore Depot</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Material Allocation</label>
                        <input type="text" class="form-control" placeholder="Enter materials to allocate">
                    </div>
                </div>
            `;
        case 3:
            return `
                <div class="row">
                    <div class="col-md-6">
                        <label class="form-label">Invoice Amount</label>
                        <input type="number" class="form-control" placeholder="Enter amount">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Payment Terms</label>
                        <select class="form-control">
                            <option>Cash on Delivery</option>
                            <option>Advance Payment</option>
                            <option>Credit - 15 Days</option>
                            <option>Credit - 30 Days</option>
                            <option>Partial Payment (50% Advance)</option>
                        </select>
                    </div>
                </div>
            `;
        case 4:
            return `
                <div class="row">
                    <div class="col-md-6">
                        <label class="form-label">Assign Vehicle</label>
                        <select class="form-control">
                            <option>TN01AB1234 - Truck (Available)</option>
                            <option>TN02CD5678 - Van (Available)</option>
                            <option>TN04GH3456 - Car (Available)</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Assign Driver</label>
                        <select class="form-control">
                            <option>John Doe (Available)</option>
                            <option>Jane Smith (Available)</option>
                            <option>Sarah Wilson (Available)</option>
                        </select>
                    </div>
                </div>
            `;
        default:
            return `
                <div class="text-center py-4">
                    <i class="fas fa-${getStepIcon(step)} fa-3x text-primary mb-3"></i>
                    <p class="text-muted">Complete this step to continue with the workflow.</p>
                </div>
            `;
    }
}

function getNextStepName(step) {
    const nextSteps = {
        1: 'Warehouse',
        2: 'Invoice', 
        3: 'Vehicle & Driver',
        4: 'Delivery',
        5: 'Tracking',
        6: 'Delivered',
        7: 'Sign-off'
    };
    return nextSteps[step] || 'Next Step';
}

function previousWorkflowStep(step) {
    showNotification(`Going back to step ${step}...`, 'info');
    
    // Hide current form
    document.querySelectorAll('.workflow-step-form').forEach(form => {
        form.style.display = 'none';
    });
    
    // Highlight previous step
    highlightWorkflowStep(step);
    
    // Show previous step form
    showWorkflowStepForm(step);
}

function updateWorkflowProgress(currentStep) {
    const progressPercentage = (currentStep / 8) * 100;
    
    // Update any progress bars
    const progressBars = document.querySelectorAll('.workflow-progress');
    progressBars.forEach(bar => {
        bar.style.width = `${progressPercentage}%`;
    });
    
    showNotification(`Workflow Progress: ${Math.round(progressPercentage)}% Complete`, 'success');
}

function continueWorkflow(workflowId) {
    showNotification(`Continuing workflow ${workflowId}...`, 'info');
    
    // Get current step for this workflow (simulate from data)
    const currentStep = getCurrentWorkflowStep(workflowId);
    
    // Navigate to workflow section
    showDynamicSection('workflow');
    
    // Highlight and show the current step
    setTimeout(() => {
        highlightWorkflowStep(currentStep);
        showWorkflowStepForm(currentStep);
        showNotification(`Resumed workflow ${workflowId} at step ${currentStep}`, 'success');
    }, 500);
}

function getCurrentWorkflowStep(workflowId) {
    // Simulate getting current step from data
    const workflowSteps = {
        'WF001': 3, // At Invoice step (Step 3)
        'WF002': 6, // At Tracking step (Step 6) 
        'WF003': 2  // At Warehouse step (Step 2)
    };
    return workflowSteps[workflowId] || 1;
}

function updateActiveWorkflowsTable() {
    // Update the active workflows table with current data
    const tableBody = document.getElementById('activeWorkflowsTable');
    const countBadge = document.getElementById('activeWorkflowsCount');
    
    if (tableBody) {
        // Count active workflows
        const activeCount = allWorkflows.filter(w => w.status === 'active').length;
        if (countBadge) {
            countBadge.textContent = activeCount;
        }
        
        // Generate table rows for all workflows (active and completed)
        tableBody.innerHTML = allWorkflows.map(workflow => {
            const isCompleted = workflow.status === 'completed';
            const progressColor = isCompleted ? 'bg-success' : 
                                 workflow.progress >= 75 ? 'bg-info' :
                                 workflow.progress >= 50 ? 'bg-warning' : 'bg-primary';
            
            const statusBadge = isCompleted ? 
                '<span class="badge bg-success"><i class="fas fa-check-circle"></i> Completed</span>' :
                `<span class="workflow-status step-${workflow.currentStep}">Step ${workflow.currentStep}: ${workflow.stepName}</span>`;
            
            return `
                <tr class="${isCompleted ? 'table-success' : ''}">
                    <td><strong>${workflow.id}</strong></td>
                    <td>${workflow.customer}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <div class="progress">
                            <div class="progress-bar workflow-progress ${progressColor}" style="width: ${workflow.progress}%">${workflow.progress}%</div>
                        </div>
                        <small class="text-muted">${Math.round(workflow.progress / 12.5)} of 8 steps completed</small>
                    </td>
                    <td>
                        ${workflow.startedTime}
                        ${isCompleted ? `<br><small class="text-success">Completed: ${workflow.completedTime}</small>` : ''}
                    </td>
                    <td>
                        ${isCompleted ? 
                            `<button class="btn btn-sm btn-outline-success" onclick="viewCompletedWorkflow('${workflow.id}')">
                                <i class="fas fa-eye"></i> View
                            </button>` :
                            `<button class="btn btn-sm btn-continue-workflow" onclick="continueWorkflow('${workflow.id}')">
                                <i class="fas fa-play"></i> Continue
                            </button>`
                        }
                    </td>
                </tr>
            `;
        }).join('');
        
        showNotification('Workflows table updated', 'success');
    }
}

function viewCompletedWorkflow(workflowId) {
    const workflow = allWorkflows.find(w => w.id === workflowId);
    if (!workflow) {
        showNotification('Workflow not found', 'error');
        return;
    }
    
    const modalHTML = `
        <div class="modal fade show" id="viewWorkflowModal" style="display: block; background: rgba(0,0,0,0.5);" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title"><i class="fas fa-check-circle"></i> Completed Workflow - ${workflowId}</h5>
                        <button type="button" class="btn-close btn-close-white" onclick="closeWorkflowModal()"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card mb-3">
                                    <div class="card-header bg-light">
                                        <h6 class="mb-0">Workflow Information</h6>
                                    </div>
                                    <div class="card-body">
                                        <p><strong>Workflow ID:</strong> ${workflow.id}</p>
                                        <p><strong>Customer:</strong> ${workflow.customer}</p>
                                        <p><strong>Status:</strong> <span class="badge bg-success">Completed</span></p>
                                        <p><strong>Progress:</strong> ${workflow.progress}% (8/8 steps)</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card mb-3">
                                    <div class="card-header bg-light">
                                        <h6 class="mb-0">Timeline</h6>
                                    </div>
                                    <div class="card-body">
                                        <p><strong>Started:</strong> ${workflow.startedTime}</p>
                                        <p><strong>Completed:</strong> ${workflow.completedTime}</p>
                                        <p><strong>Duration:</strong> Completed successfully</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Order Details</h6>
                            </div>
                            <div class="card-body">
                                <p><strong>Pickup Location:</strong> ${workflow.orderDetails.pickup}</p>
                                <p><strong>Delivery Location:</strong> ${workflow.orderDetails.delivery}</p>
                                <p><strong>Material:</strong> ${workflow.orderDetails.material}</p>
                            </div>
                        </div>
                        <div class="card mt-3">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Completed Steps</h6>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <p><i class="fas fa-check-circle text-success"></i> Step 1: Sales Order</p>
                                        <p><i class="fas fa-check-circle text-success"></i> Step 2: Warehouse</p>
                                        <p><i class="fas fa-check-circle text-success"></i> Step 3: Invoice</p>
                                        <p><i class="fas fa-check-circle text-success"></i> Step 4: Vehicle & Driver</p>
                                    </div>
                                    <div class="col-md-6">
                                        <p><i class="fas fa-check-circle text-success"></i> Step 5: Delivery</p>
                                        <p><i class="fas fa-check-circle text-success"></i> Step 6: Tracking</p>
                                        <p><i class="fas fa-check-circle text-success"></i> Step 7: Delivered</p>
                                        <p><i class="fas fa-check-circle text-success"></i> Step 8: Sign-off</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeWorkflowModal()">Close</button>
                        <button type="button" class="btn btn-primary" onclick="printWorkflow('${workflowId}')">
                            <i class="fas fa-print"></i> Print
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeWorkflowModal() {
    const modal = document.getElementById('viewWorkflowModal');
    if (modal) {
        modal.remove();
    }
}

function printWorkflow(workflowId) {
    showNotification(`Printing workflow ${workflowId}...`, 'info');
    // In real implementation, this would generate and print a PDF
}

function completeWorkflow() {
    showNotification('Workflow completed successfully!', 'success');
    
    // Mark all steps as completed
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active', 'current');
        step.classList.add('completed');
        step.style.transform = 'scale(1)';
        step.style.boxShadow = 'none';
    });
    
    // Save completed workflow
    const completedWorkflow = {
        id: 'WF' + String(Date.now()).slice(-3),
        customer: document.getElementById('step1CustomerName')?.value || 'Customer',
        currentStep: 8,
        stepName: 'Completed',
        progress: 100,
        status: 'completed',
        startedTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        completedTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        orderDetails: {
            pickup: document.getElementById('step1PickupLocation')?.value || 'N/A',
            delivery: document.getElementById('step1DeliveryLocation')?.value || 'N/A',
            material: document.getElementById('step1MaterialDetails')?.value || 'N/A'
        }
    };
    
    // Add to workflows array
    allWorkflows.push(completedWorkflow);
    
    // Update the workflows table
    updateActiveWorkflowsTable();
    
    // Hide workflow forms
    document.getElementById('workflowFormsContainer').style.display = 'none';
    
    // Show completion message
    setTimeout(() => {
        alert('🎉 Dispatch Workflow Completed!\n\nOrder has been successfully processed through all 8 steps:\n✅ Sales Order\n✅ Warehouse\n✅ Invoice\n✅ Vehicle & Driver\n✅ Delivery\n✅ Tracking\n✅ Delivered\n✅ Sign-off');
        resetWorkflowSteps();
        
        // Refresh the workflow section to show updated table
        showDynamicSection('workflow');
    }, 1000);
}

// Enhanced Order Processing Integration
function processOrder(orderId) {
    showNotification(`Processing order ${orderId} through workflow...`, 'info');
    
    // Navigate to workflow section
    showDynamicSection('workflow');
    
    // Start workflow for this order
    setTimeout(() => {
        startManualWorkflow();
        showNotification(`Order ${orderId} entered into dispatch workflow`, 'success');
    }, 500);
}

// Placeholder functions for actions
function createNewOrder() { 
    showNotification('New order form opened', 'info');
    // Navigate to workflow to create order
    showDynamicSection('workflow');
    setTimeout(() => startManualWorkflow(), 300);
}

function refreshOrders() { showNotification('Orders refreshed', 'success'); }
function filterOrders() { showNotification('Orders filtered', 'info'); }
function viewOrder(id) { 
    showNotification(`Viewing order ${id}`, 'info');
    // Option to process this order through workflow
    setTimeout(() => {
        if (confirm(`Would you like to process order ${id} through the dispatch workflow?`)) {
            processOrder(id);
        }
    }, 1000);
}
function assignVehicle() { showNotification('Vehicle assignment panel opened', 'info'); }
function assignVehicleToOrder(id) { showNotification(`Vehicle ${id} assigned`, 'success'); }
function assignDriver(id) { showNotification(`Driver ${id} assigned`, 'success'); }
function refreshTracking() { showNotification('Tracking data refreshed', 'success'); }
function trackVehicle(id) { showNotification(`Tracking vehicle ${id}`, 'info'); }
function contactDriver(id) { showNotification(`Contacting driver of ${id}...`, 'info'); }
function refreshTripProgress() { showNotification('Trip progress refreshed', 'success'); }
function createPOD() { showNotification('POD creation form opened', 'info'); }
function completePOD(id) { showNotification(`POD completed for ${id}`, 'success'); }
function createTrip() { showNotification('Trip creation form opened', 'info'); }
function exportAnalytics() { showNotification('Analytics export started', 'info'); }

console.log('All Dynamic Dispatch Management functions loaded successfully');
// Integration with Fleet Management System
function checkFleetIntegration() {
    // Check if we were redirected from Fleet Management with an order to process
    const processOrderId = localStorage.getItem('processOrderId');
    const processOrderAction = localStorage.getItem('processOrderAction');
    const trackOrderId = localStorage.getItem('trackOrderId');
    const trackOrderAction = localStorage.getItem('trackOrderAction');
    
    if (processOrderId && processOrderAction === 'workflow') {
        // Clear the stored data
        localStorage.removeItem('processOrderId');
        localStorage.removeItem('processOrderAction');
        
        // Navigate to workflow section and start processing
        showNotification(`Processing order ${processOrderId} from Fleet Management...`, 'info');
        showDynamicSection('workflow');
        
        setTimeout(() => {
            startManualWorkflow();
            showNotification(`Order ${processOrderId} loaded into dispatch workflow`, 'success');
        }, 1000);
        
    } else if (trackOrderId && trackOrderAction === 'tracking') {
        // Clear the stored data
        localStorage.removeItem('trackOrderId');
        localStorage.removeItem('trackOrderAction');
        
        // Navigate to tracking section
        showNotification(`Opening tracking for order ${trackOrderId} from Fleet Management...`, 'info');
        showDynamicSection('tracking');
        
        setTimeout(() => {
            showNotification(`Order ${trackOrderId} tracking loaded`, 'success');
        }, 1000);
    }
}

// Enhanced initialization to check for fleet integration
function initializeApp() {
    // Load initial data
    dispatchData = { ...sampleDispatchData };
    
    // Check for fleet management integration
    checkFleetIntegration();
    
    // Show dashboard by default (unless redirected from fleet)
    if (!localStorage.getItem('processOrderId') && !localStorage.getItem('trackOrderId')) {
        showDynamicSection('dashboard');
    }
    
    // Start real-time updates
    startRealTimeUpdates();
    
    console.log('Dynamic Dispatch Management System with Fleet Integration loaded successfully');
}