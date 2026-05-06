// Fuel Efficiency Solution System
// Track fuel usage, distance traveled, and route optimization

const fuelEfficiencySystem = {
    vehicles: [],
    fuelRecords: [],
    routes: [],
    analytics: {},
    alerts: [],
    costTracking: {}
};

// Initialize Fuel Efficiency System
function initializeFuelEfficiency() {
    console.log('Initializing Fuel Efficiency System...');
    loadFuelData();
    setupFuelDashboard();
    initializeFuelCharts();
    loadSampleFuelData();
}

// Load Fuel Data
function loadFuelData() {
    const stored = localStorage.getItem('fuelEfficiencyData');
    if (stored) {
        Object.assign(fuelEfficiencySystem, JSON.parse(stored));
    }
}

// Save Fuel Data
function saveFuelData() {
    localStorage.setItem('fuelEfficiencyData', JSON.stringify(fuelEfficiencySystem));
}

// Load Sample Fuel Data
function loadSampleFuelData() {
    if (fuelEfficiencySystem.fuelRecords.length === 0) {
        fuelEfficiencySystem.vehicles = [
            {
                id: 'V001',
                vehicleNumber: 'TN01AB1234',
                type: 'Truck',
                fuelType: 'Diesel',
                tankCapacity: 200,
                currentFuel: 150,
                avgMileage: 8.5,
                totalDistance: 45000,
                totalFuelUsed: 5294
            },
            {
                id: 'V002',
                vehicleNumber: 'TN02CD5678',
                type: 'Van',
                fuelType: 'Diesel',
                tankCapacity: 80,
                currentFuel: 60,
                avgMileage: 12.5,
                totalDistance: 32000,
                totalFuelUsed: 2560
            },
            {
                id: 'V003',
                vehicleNumber: 'TN03EF9012',
                type: 'Truck',
                fuelType: 'Diesel',
                tankCapacity: 250,
                currentFuel: 100,
                avgMileage: 7.2,
                totalDistance: 52000,
                totalFuelUsed: 7222
            }
        ];

        fuelEfficiencySystem.fuelRecords = [
            {
                id: 'FR001',
                vehicleId: 'V001',
                vehicleNumber: 'TN01AB1234',
                date: new Date().toISOString(),
                fuelAdded: 150,
                cost: 13500,
                pricePerLiter: 90,
                odometer: 45000,
                distanceSinceLast: 1275,
                mileage: 8.5,
                location: 'Chennai Fuel Station',
                attendant: 'John Doe'
            },
            {
                id: 'FR002',
                vehicleId: 'V002',
                vehicleNumber: 'TN02CD5678',
                date: new Date(Date.now() - 86400000).toISOString(),
                fuelAdded: 60,
                cost: 5400,
                pricePerLiter: 90,
                odometer: 32000,
                distanceSinceLast: 750,
                mileage: 12.5,
                location: 'Bangalore Fuel Station',
                attendant: 'Jane Smith'
            }
        ];

        fuelEfficiencySystem.routes = [
            {
                id: 'R001',
                name: 'Chennai to Bangalore',
                distance: 350,
                estimatedFuel: 41.2,
                actualFuel: 43.5,
                efficiency: 94.7,
                vehicleNumber: 'TN01AB1234'
            },
            {
                id: 'R002',
                name: 'Bangalore to Hyderabad',
                distance: 570,
                estimatedFuel: 67.1,
                actualFuel: 65.8,
                efficiency: 102.0,
                vehicleNumber: 'TN01AB1234'
            }
        ];

        saveFuelData();
    }
}

// Setup Fuel Dashboard
function setupFuelDashboard() {
    const dashboardHTML = `
        <div class="fuel-efficiency-dashboard">
            <div class="fuel-header">
                <h2><i class="fas fa-gas-pump"></i> Fuel Efficiency Dashboard</h2>
                <p class="text-muted">Monitor fuel usage, track efficiency, and optimize costs</p>
            </div>

            <!-- Key Metrics -->
            <div class="fuel-metrics">
                <div class="stat-card fuel-stat">
                    <div class="stat-icon"><i class="fas fa-gas-pump"></i></div>
                    <div class="stat-content">
                        <div class="stat-value" id="totalFuelUsed">0 L</div>
                        <div class="stat-label">Total Fuel Used (This Month)</div>
                    </div>
                </div>
                <div class="stat-card fuel-stat">
                    <div class="stat-icon"><i class="fas fa-road"></i></div>
                    <div class="stat-content">
                        <div class="stat-value" id="totalDistance">0 km</div>
                        <div class="stat-label">Total Distance Traveled</div>
                    </div>
                </div>
                <div class="stat-card fuel-stat">
                    <div class="stat-icon"><i class="fas fa-tachometer-alt"></i></div>
                    <div class="stat-content">
                        <div class="stat-value" id="avgMileage">0 km/L</div>
                        <div class="stat-label">Average Mileage</div>
                    </div>
                </div>
                <div class="stat-card fuel-stat">
                    <div class="stat-icon"><i class="fas fa-rupee-sign"></i></div>
                    <div class="stat-content">
                        <div class="stat-value" id="totalFuelCost">₹0</div>
                        <div class="stat-label">Total Fuel Cost</div>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="fuel-actions">
                <button class="btn btn-primary" onclick="showAddFuelRecordModal()">
                    <i class="fas fa-plus"></i> Add Fuel Record
                </button>
                <button class="btn btn-success" onclick="showFuelAnalytics()">
                    <i class="fas fa-chart-line"></i> View Analytics
                </button>
                <button class="btn btn-info" onclick="showRouteOptimization()">
                    <i class="fas fa-route"></i> Route Optimization
                </button>
                <button class="btn btn-warning" onclick="exportFuelReport()">
                    <i class="fas fa-download"></i> Export Report
                </button>
            </div>

            <!-- Charts Section -->
            <div class="fuel-charts-section">
                <div class="row">
                    <div class="col-md-6">
                        <div class="chart-card">
                            <h5><i class="fas fa-chart-line"></i> Fuel Consumption Trend</h5>
                            <canvas id="fuelConsumptionChart"></canvas>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="chart-card">
                            <h5><i class="fas fa-chart-pie"></i> Fuel Distribution by Vehicle</h5>
                            <canvas id="fuelDistributionChart"></canvas>
                        </div>
                    </div>
                </div>
                <div class="row mt-4">
                    <div class="col-md-12">
                        <div class="chart-card">
                            <h5><i class="fas fa-chart-bar"></i> Mileage Comparison</h5>
                            <canvas id="mileageComparisonChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Vehicle-wise Fuel Efficiency -->
            <div class="vehicle-fuel-section">
                <h3><i class="fas fa-truck"></i> Vehicle-wise Fuel Efficiency</h3>
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead class="table-dark">
                            <tr>
                                <th>Vehicle Number</th>
                                <th>Type</th>
                                <th>Fuel Type</th>
                                <th>Total Distance</th>
                                <th>Total Fuel Used</th>
                                <th>Avg Mileage</th>
                                <th>Current Fuel</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="vehicleFuelTable"></tbody>
                    </table>
                </div>
            </div>

            <!-- Recent Fuel Records -->
            <div class="fuel-records-section">
                <h3><i class="fas fa-history"></i> Recent Fuel Records</h3>
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead class="table-dark">
                            <tr>
                                <th>Date</th>
                                <th>Vehicle</th>
                                <th>Fuel Added (L)</th>
                                <th>Cost</th>
                                <th>Odometer</th>
                                <th>Distance</th>
                                <th>Mileage</th>
                                <th>Location</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="fuelRecordsTable"></tbody>
                    </table>
                </div>
            </div>

            <!-- Route Efficiency -->
            <div class="route-efficiency-section">
                <h3><i class="fas fa-route"></i> Route Efficiency Analysis</h3>
                <div id="routeEfficiencyContainer"></div>
            </div>
        </div>
    `;

    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        const fuelSection = document.createElement('div');
        fuelSection.id = 'fuelEfficiencySection';
        fuelSection.className = 'content-section';
        fuelSection.style.display = 'none';
        fuelSection.innerHTML = dashboardHTML;
        mainContent.appendChild(fuelSection);
    }

    updateFuelDashboard();
}

// Update Fuel Dashboard
function updateFuelDashboard() {
    // Calculate metrics
    const totalFuelUsed = fuelEfficiencySystem.vehicles.reduce((sum, v) => sum + v.totalFuelUsed, 0);
    const totalDistance = fuelEfficiencySystem.vehicles.reduce((sum, v) => sum + v.totalDistance, 0);
    const avgMileage = totalDistance / totalFuelUsed;
    const totalCost = fuelEfficiencySystem.fuelRecords.reduce((sum, r) => sum + r.cost, 0);

    // Update metrics
    document.getElementById('totalFuelUsed').textContent = totalFuelUsed.toFixed(0) + ' L';
    document.getElementById('totalDistance').textContent = totalDistance.toLocaleString() + ' km';
    document.getElementById('avgMileage').textContent = avgMileage.toFixed(2) + ' km/L';
    document.getElementById('totalFuelCost').textContent = '₹' + totalCost.toLocaleString();

    // Update tables
    updateVehicleFuelTable();
    updateFuelRecordsTable();
    updateRouteEfficiency();
}

// Update Vehicle Fuel Table
function updateVehicleFuelTable() {
    const tbody = document.getElementById('vehicleFuelTable');
    if (!tbody) return;

    tbody.innerHTML = fuelEfficiencySystem.vehicles.map(vehicle => {
        const fuelPercentage = (vehicle.currentFuel / vehicle.tankCapacity) * 100;
        const statusClass = fuelPercentage > 50 ? 'success' : fuelPercentage > 25 ? 'warning' : 'danger';
        const statusText = fuelPercentage > 50 ? 'Good' : fuelPercentage > 25 ? 'Low' : 'Critical';

        return `
            <tr>
                <td><strong>${vehicle.vehicleNumber}</strong></td>
                <td><span class="badge bg-primary">${vehicle.type}</span></td>
                <td>${vehicle.fuelType}</td>
                <td>${vehicle.totalDistance.toLocaleString()} km</td>
                <td>${vehicle.totalFuelUsed.toFixed(0)} L</td>
                <td><strong>${vehicle.avgMileage.toFixed(2)} km/L</strong></td>
                <td>
                    <div class="fuel-gauge">
                        <div class="fuel-gauge-bar">
                            <div class="fuel-gauge-fill bg-${statusClass}" style="width: ${fuelPercentage}%"></div>
                        </div>
                        <small>${vehicle.currentFuel}L / ${vehicle.tankCapacity}L</small>
                    </div>
                </td>
                <td><span class="badge bg-${statusClass}">${statusText}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewVehicleFuelDetails('${vehicle.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-success" onclick="addFuelForVehicle('${vehicle.id}')">
                        <i class="fas fa-gas-pump"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Update Fuel Records Table
function updateFuelRecordsTable() {
    const tbody = document.getElementById('fuelRecordsTable');
    if (!tbody) return;

    const recentRecords = fuelEfficiencySystem.fuelRecords.slice(-10).reverse();

    tbody.innerHTML = recentRecords.map(record => `
        <tr>
            <td>${new Date(record.date).toLocaleDateString()}</td>
            <td><strong>${record.vehicleNumber}</strong></td>
            <td>${record.fuelAdded} L</td>
            <td>₹${record.cost.toLocaleString()}</td>
            <td>${record.odometer.toLocaleString()} km</td>
            <td>${record.distanceSinceLast} km</td>
            <td><strong>${record.mileage.toFixed(2)} km/L</strong></td>
            <td>${record.location}</td>
            <td>
                <button class="btn btn-sm btn-outline-info" onclick="viewFuelRecordDetails('${record.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteFuelRecord('${record.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Update Route Efficiency
function updateRouteEfficiency() {
    const container = document.getElementById('routeEfficiencyContainer');
    if (!container) return;

    if (fuelEfficiencySystem.routes.length === 0) {
        container.innerHTML = '<p class="text-muted">No route data available</p>';
        return;
    }

    container.innerHTML = fuelEfficiencySystem.routes.map(route => `
        <div class="route-card">
            <div class="route-header">
                <h5><i class="fas fa-route"></i> ${route.name}</h5>
                <span class="badge bg-${route.efficiency >= 100 ? 'success' : route.efficiency >= 90 ? 'warning' : 'danger'}">
                    ${route.efficiency.toFixed(1)}% Efficient
                </span>
            </div>
            <div class="route-details">
                <div class="route-stat">
                    <strong>Distance:</strong> ${route.distance} km
                </div>
                <div class="route-stat">
                    <strong>Estimated Fuel:</strong> ${route.estimatedFuel.toFixed(1)} L
                </div>
                <div class="route-stat">
                    <strong>Actual Fuel:</strong> ${route.actualFuel.toFixed(1)} L
                </div>
                <div class="route-stat">
                    <strong>Vehicle:</strong> ${route.vehicleNumber}
                </div>
            </div>
            <div class="route-actions">
                <button class="btn btn-sm btn-primary" onclick="viewRouteMap('${route.id}')">
                    <i class="fas fa-map"></i> View Map
                </button>
                <button class="btn btn-sm btn-info" onclick="optimizeRoute('${route.id}')">
                    <i class="fas fa-magic"></i> Optimize
                </button>
            </div>
        </div>
    `).join('');
}

// Initialize Fuel Charts
function initializeFuelCharts() {
    // Wait for Chart.js to be available
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded yet, charts will be initialized later');
        return;
    }

    // Fuel Consumption Trend Chart
    const fuelConsumptionCtx = document.getElementById('fuelConsumptionChart');
    if (fuelConsumptionCtx) {
        new Chart(fuelConsumptionCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Fuel Consumption (Liters)',
                    data: [1200, 1350, 1100, 1450, 1300, 1250],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: true }
                }
            }
        });
    }

    // Fuel Distribution Chart
    const fuelDistributionCtx = document.getElementById('fuelDistributionChart');
    if (fuelDistributionCtx) {
        new Chart(fuelDistributionCtx, {
            type: 'pie',
            data: {
                labels: ['TN01AB1234', 'TN02CD5678', 'TN03EF9012'],
                datasets: [{
                    data: [5294, 2560, 7222],
                    backgroundColor: ['#667eea', '#764ba2', '#f093fb']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    // Mileage Comparison Chart
    const mileageComparisonCtx = document.getElementById('mileageComparisonChart');
    if (mileageComparisonCtx) {
        new Chart(mileageComparisonCtx, {
            type: 'bar',
            data: {
                labels: ['TN01AB1234', 'TN02CD5678', 'TN03EF9012'],
                datasets: [{
                    label: 'Average Mileage (km/L)',
                    data: [8.5, 12.5, 7.2],
                    backgroundColor: ['#667eea', '#764ba2', '#f093fb']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
}

// Show Add Fuel Record Modal
function showAddFuelRecordModal() {
    const modalHTML = `
        <div class="modal fade" id="addFuelRecordModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-gas-pump"></i> Add Fuel Record
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addFuelRecordForm">
                            <div class="mb-3">
                                <label class="form-label">Vehicle</label>
                                <select class="form-select" id="fuelVehicle" required>
                                    <option value="">Select vehicle...</option>
                                    ${fuelEfficiencySystem.vehicles.map(v => 
                                        `<option value="${v.id}">${v.vehicleNumber} (${v.type})</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Fuel Added (Liters)</label>
                                <input type="number" class="form-control" id="fuelAdded" 
                                       min="1" step="0.1" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Price per Liter (₹)</label>
                                <input type="number" class="form-control" id="fuelPrice" 
                                       value="90" min="1" step="0.1" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Current Odometer (km)</label>
                                <input type="number" class="form-control" id="fuelOdometer" 
                                       min="0" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Location</label>
                                <input type="text" class="form-control" id="fuelLocation" 
                                       placeholder="Fuel station name..." required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="saveFuelRecord()">
                            <i class="fas fa-save"></i> Save Record
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('addFuelRecordModal'));
    modal.show();
}

// Save Fuel Record
function saveFuelRecord() {
    const vehicleId = document.getElementById('fuelVehicle').value;
    const fuelAdded = parseFloat(document.getElementById('fuelAdded').value);
    const pricePerLiter = parseFloat(document.getElementById('fuelPrice').value);
    const odometer = parseInt(document.getElementById('fuelOdometer').value);
    const location = document.getElementById('fuelLocation').value;

    if (!vehicleId || !fuelAdded || !pricePerLiter || !odometer || !location) {
        showNotification('warning', 'Please fill in all fields');
        return;
    }

    const vehicle = fuelEfficiencySystem.vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;

    const newRecord = {
        id: 'FR' + Date.now(),
        vehicleId: vehicleId,
        vehicleNumber: vehicle.vehicleNumber,
        date: new Date().toISOString(),
        fuelAdded: fuelAdded,
        cost: fuelAdded * pricePerLiter,
        pricePerLiter: pricePerLiter,
        odometer: odometer,
        distanceSinceLast: 0,
        mileage: 0,
        location: location,
        attendant: 'Current User'
    };

    // Calculate distance and mileage
    const lastRecord = fuelEfficiencySystem.fuelRecords
        .filter(r => r.vehicleId === vehicleId)
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

    if (lastRecord) {
        newRecord.distanceSinceLast = odometer - lastRecord.odometer;
        newRecord.mileage = newRecord.distanceSinceLast / fuelAdded;
    }

    // Update vehicle data
    vehicle.currentFuel = Math.min(vehicle.currentFuel + fuelAdded, vehicle.tankCapacity);
    vehicle.totalFuelUsed += fuelAdded;
    vehicle.totalDistance = odometer;

    fuelEfficiencySystem.fuelRecords.push(newRecord);
    saveFuelData();
    updateFuelDashboard();

    bootstrap.Modal.getInstance(document.getElementById('addFuelRecordModal')).hide();
    showNotification('success', 'Fuel record added successfully');
}

// View Vehicle Fuel Details
function viewVehicleFuelDetails(vehicleId) {
    showNotification('info', 'Vehicle fuel details - Feature to be implemented');
}

// Add Fuel for Vehicle
function addFuelForVehicle(vehicleId) {
    showAddFuelRecordModal();
    setTimeout(() => {
        document.getElementById('fuelVehicle').value = vehicleId;
    }, 100);
}

// View Fuel Record Details
function viewFuelRecordDetails(recordId) {
    showNotification('info', 'Fuel record details - Feature to be implemented');
}

// Delete Fuel Record
function deleteFuelRecord(recordId) {
    if (confirm('Are you sure you want to delete this fuel record?')) {
        const index = fuelEfficiencySystem.fuelRecords.findIndex(r => r.id === recordId);
        if (index > -1) {
            fuelEfficiencySystem.fuelRecords.splice(index, 1);
            saveFuelData();
            updateFuelDashboard();
            showNotification('success', 'Fuel record deleted');
        }
    }
}

// Show Fuel Analytics
function showFuelAnalytics() {
    showNotification('info', 'Detailed fuel analytics - Feature to be implemented');
}

// Show Route Optimization
function showRouteOptimization() {
    showNotification('info', 'Route optimization - Feature to be implemented');
}

// Export Fuel Report
function exportFuelReport() {
    showNotification('info', 'Export fuel report - Feature to be implemented');
}

// View Route Map
function viewRouteMap(routeId) {
    showNotification('info', 'Route map visualization - Feature to be implemented');
}

// Optimize Route
function optimizeRoute(routeId) {
    showNotification('info', 'Route optimization - Feature to be implemented');
}

// Export functions
window.fuelEfficiencySystem = fuelEfficiencySystem;
window.initializeFuelEfficiency = initializeFuelEfficiency;
window.showAddFuelRecordModal = showAddFuelRecordModal;
window.saveFuelRecord = saveFuelRecord;
window.viewVehicleFuelDetails = viewVehicleFuelDetails;
window.addFuelForVehicle = addFuelForVehicle;
window.viewFuelRecordDetails = viewFuelRecordDetails;
window.deleteFuelRecord = deleteFuelRecord;
window.showFuelAnalytics = showFuelAnalytics;
window.showRouteOptimization = showRouteOptimization;
window.exportFuelReport = exportFuelReport;
window.viewRouteMap = viewRouteMap;
window.optimizeRoute = optimizeRoute;
