// ========================================
// ROUTE MONITORING & CONTROL SYSTEM
// JavaScript Functions
// ========================================

// Global variables for route monitoring
let routeMonitoringActive = true;
let gpsAccuracyThreshold = 10; // meters
let deviationThreshold = 2; // kilometers
let autoContactEnabled = true;
let routeBlockingEnabled = true;

// ========================================
// 1. ROUTE DEVIATION DETECTION
// ========================================

function detectRouteDeviation(vehicleId, currentLocation, plannedRoute) {
    // Calculate distance from planned route
    const deviation = calculateDeviationDistance(currentLocation, plannedRoute);
    
    if (deviation > deviationThreshold) {
        triggerDeviationAlert(vehicleId, deviation, currentLocation);
        
        if (autoContactEnabled) {
            autoContactDriver(vehicleId);
        }
        
        if (routeBlockingEnabled && deviation > 5) {
            blockUnauthorizedPayment(vehicleId, deviation);
        }
    }
    
    return deviation;
}

function calculateDeviationDistance(currentLocation, plannedRoute) {
    // Simulate deviation calculation
    // In real implementation, use Google Maps Distance Matrix API
    const randomDeviation = Math.random() * 10;
    return randomDeviation;
}

function triggerDeviationAlert(vehicleId, deviation, location) {
    const alertData = {
        vehicleId: vehicleId,
        deviation: deviation.toFixed(2),
        location: location,
        timestamp: new Date().toLocaleTimeString(),
        severity: deviation > 5 ? 'high' : 'medium'
    };
    
    // Add to deviation alerts list
    addDeviationAlertToUI(alertData);
    
    // Send notification
    showNotification(
        `⚠️ Route Deviation: ${vehicleId} is ${deviation.toFixed(1)} km off route!`,
        'warning'
    );
    
    // Log to system
    console.log('Route Deviation Detected:', alertData);
}

function addDeviationAlertToUI(alertData) {
    const alertsContainer = document.getElementById('deviationAlerts');
    if (!alertsContainer) return;
    
    const alertHTML = `
        <div class="alert alert-${alertData.severity === 'high' ? 'danger' : 'warning'} mb-3">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="mb-1"><i class="fas fa-truck"></i> ${alertData.vehicleId} - Route Deviation</h6>
                    <p class="mb-2 mt-2">
                        <strong>Deviation:</strong> ${alertData.deviation} km off planned route<br>
                        <strong>Location:</strong> ${alertData.location}<br>
                        <strong>Time:</strong> ${alertData.timestamp}
                    </p>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-warning" onclick="contactDriver('${alertData.vehicleId}')">
                            <i class="fas fa-phone"></i> Contact Driver
                        </button>
                        <button class="btn btn-info" onclick="viewDeviationMap('${alertData.vehicleId}')">
                            <i class="fas fa-map"></i> View Map
                        </button>
                        <button class="btn btn-danger" onclick="blockRoute('${alertData.vehicleId}')">
                            <i class="fas fa-ban"></i> Block Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    alertsContainer.insertAdjacentHTML('afterbegin', alertHTML);
}

// ========================================
// 2. GPS ACCURACY MONITORING
// ========================================

function monitorGPSAccuracy() {
    const vehicles = sampleData.vehicles;
    
    vehicles.forEach(vehicle => {
        const accuracy = simulateGPSAccuracy();
        updateGPSAccuracyUI(vehicle.id, accuracy);
        
        if (accuracy.signal === 'weak') {
            alertLowGPSSignal(vehicle.id, accuracy);
        }
    });
}

function simulateGPSAccuracy() {
    const signals = ['strong', 'strong', 'strong', 'moderate', 'weak'];
    const signal = signals[Math.floor(Math.random() * signals.length)];
    
    let accuracy;
    switch(signal) {
        case 'strong':
            accuracy = Math.floor(Math.random() * 5) + 3; // 3-8m
            break;
        case 'moderate':
            accuracy = Math.floor(Math.random() * 10) + 10; // 10-20m
            break;
        case 'weak':
            accuracy = Math.floor(Math.random() * 40) + 30; // 30-70m
            break;
    }
    
    return {
        signal: signal,
        accuracy: accuracy,
        lastUpdate: Math.floor(Math.random() * 10) + 1
    };
}

function updateGPSAccuracyUI(vehicleId, accuracyData) {
    // Update GPS accuracy display
    const accuracyElement = document.getElementById('gpsAccuracy');
    if (accuracyElement) {
        const overallAccuracy = 98.5 - (accuracyData.accuracy * 0.1);
        accuracyElement.textContent = overallAccuracy.toFixed(1) + '%';
    }
}

function alertLowGPSSignal(vehicleId, accuracyData) {
    showNotification(
        `⚠️ Low GPS Signal: ${vehicleId} - Accuracy: ±${accuracyData.accuracy}m`,
        'warning'
    );
}

// ========================================
// 3. AUTOMATIC FARE CALCULATION
// ========================================

function calculateAutomaticFare(vehicleId, routeData) {
    const baseRatePerKm = parseFloat(document.getElementById('baseRatePerKm')?.value || 12);
    const fuelSurcharge = parseFloat(document.getElementById('fuelSurcharge')?.value || 15);
    const calculationMethod = document.getElementById('calculationMethod')?.value || 'gps-actual';
    
    let distance;
    switch(calculationMethod) {
        case 'gps-actual':
            distance = routeData.actualDistance;
            break;
        case 'map-planned':
            distance = routeData.plannedDistance;
            break;
        case 'shortest':
            distance = routeData.shortestDistance;
            break;
        default:
            distance = routeData.actualDistance;
    }
    
    // Calculate base fare
    const baseFare = distance * baseRatePerKm;
    
    // Add fuel surcharge
    const fuelCharge = baseFare * (fuelSurcharge / 100);
    
    // Add toll charges
    const tollCharges = routeData.tollCost || 0;
    
    // Calculate total fare
    const totalFare = baseFare + fuelCharge + tollCharges;
    
    return {
        distance: distance,
        baseFare: baseFare,
        fuelCharge: fuelCharge,
        tollCharges: tollCharges,
        totalFare: totalFare,
        deviation: routeData.actualDistance - routeData.plannedDistance
    };
}

function updateFareCalculationTable() {
    const tableBody = document.getElementById('fareCalculationTable');
    if (!tableBody) return;
    
    // Sample calculation data
    const calculations = [
        {
            vehicle: 'TN01AB1234',
            route: 'CHN-BLR-001',
            planned: 350,
            actual: 355.2,
            deviation: 5.2,
            fare: 4682,
            status: 'review'
        },
        {
            vehicle: 'TN02CD5678',
            route: 'CHN-COI-002',
            planned: 502,
            actual: 503.8,
            deviation: 1.8,
            fare: 6566,
            status: 'approve'
        },
        {
            vehicle: 'TN04GH3456',
            route: 'CHN-MDU-003',
            planned: 458,
            actual: 458,
            deviation: 0,
            fare: 5876,
            status: 'approved'
        }
    ];
    
    tableBody.innerHTML = calculations.map(calc => {
        const deviationClass = calc.deviation > 3 ? 'danger' : calc.deviation > 0 ? 'warning' : 'success';
        const statusButton = calc.status === 'approved' 
            ? `<button class="btn btn-sm btn-success"><i class="fas fa-check-circle"></i> Auto-Approved</button>`
            : calc.status === 'review'
            ? `<button class="btn btn-sm btn-warning" onclick="reviewFare('${calc.vehicle}')"><i class="fas fa-exclamation-triangle"></i> Review</button>`
            : `<button class="btn btn-sm btn-info" onclick="approveFare('${calc.vehicle}')"><i class="fas fa-check"></i> Approve</button>`;
        
        return `
            <tr>
                <td><strong>${calc.vehicle}</strong></td>
                <td>${calc.route}</td>
                <td>${calc.planned} km</td>
                <td class="text-${deviationClass}">${calc.actual} km</td>
                <td><span class="badge bg-${deviationClass}">${calc.deviation > 0 ? '+' : ''}${calc.deviation} km</span></td>
                <td>
                    <strong>₹${calc.fare.toLocaleString()}</strong><br>
                    <small class="text-muted">Base: ₹${(calc.fare * 0.85).toFixed(0)} | Toll: ₹${(calc.fare * 0.15).toFixed(0)}</small>
                </td>
                <td>${statusButton}</td>
            </tr>
        `;
    }).join('');
}

function updateCalculationSettings() {
    const baseRate = document.getElementById('baseRatePerKm').value;
    const fuelSurcharge = document.getElementById('fuelSurcharge').value;
    const method = document.getElementById('calculationMethod').value;
    
    showNotification(
        `Calculation settings updated: ₹${baseRate}/km, ${fuelSurcharge}% fuel surcharge, Method: ${method}`,
        'success'
    );
    
    // Recalculate all fares
    updateFareCalculationTable();
}

// ========================================
// 4. DRIVER CONTACT & CONTROL ACTIONS
// ========================================

function contactDriver(vehicleId) {
    showNotification(`📞 Calling driver of ${vehicleId}...`, 'info');
    
    setTimeout(() => {
        showNotification(`✅ Connected to driver of ${vehicleId}. Requesting route explanation.`, 'success');
    }, 2000);
}

function autoContactDriver(vehicleId) {
    if (!autoContactEnabled) return;
    
    showNotification(`🤖 Auto-contacting driver of ${vehicleId} for route deviation...`, 'warning');
    contactDriver(vehicleId);
}

function viewDeviationMap(vehicleId) {
    showNotification(`🗺️ Opening deviation map for ${vehicleId}...`, 'info');
    
    // In real implementation, show map with planned vs actual route
    setTimeout(() => {
        alert(`Deviation Map for ${vehicleId}\n\nPlanned Route: Chennai → Hosur → Bangalore\nActual Route: Chennai → Hosur Bypass → Bangalore\n\nDeviation: 5.2 km\nExtra Cost: ₹420`);
    }, 500);
}

function blockRoute(vehicleId) {
    if (confirm(`Are you sure you want to block payment for unauthorized route deviation by ${vehicleId}?`)) {
        showNotification(`🚫 Payment blocked for ${vehicleId}. Driver will be notified.`, 'danger');
        
        // Log the action
        console.log(`Payment blocked for ${vehicleId} due to route deviation`);
    }
}

function blockUnauthorizedPayment(vehicleId, deviation) {
    if (!routeBlockingEnabled) return;
    
    const extraCost = deviation * 12; // ₹12 per km
    
    showNotification(
        `🚫 Unauthorized route payment blocked for ${vehicleId}. Extra cost: ₹${extraCost.toFixed(0)}`,
        'danger'
    );
}

function approveDeviation(vehicleId) {
    showNotification(`✅ Route deviation approved for ${vehicleId}`, 'success');
    
    // Remove alert from UI
    const alerts = document.querySelectorAll('#deviationAlerts .alert');
    alerts.forEach(alert => {
        if (alert.textContent.includes(vehicleId)) {
            alert.remove();
        }
    });
}

// ========================================
// 5. FARE REVIEW & APPROVAL
// ========================================

function reviewFare(vehicleId) {
    const reviewHTML = `
        <div class="modal fade" id="fareReviewModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-warning text-dark">
                        <h5 class="modal-title"><i class="fas fa-exclamation-triangle"></i> Fare Review - ${vehicleId}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <h6>Route Deviation Details:</h6>
                        <table class="table table-bordered">
                            <tr>
                                <td><strong>Planned Distance:</strong></td>
                                <td>350 km</td>
                            </tr>
                            <tr>
                                <td><strong>Actual Distance:</strong></td>
                                <td class="text-danger">355.2 km</td>
                            </tr>
                            <tr>
                                <td><strong>Deviation:</strong></td>
                                <td class="text-danger">+5.2 km</td>
                            </tr>
                            <tr>
                                <td><strong>Planned Fare:</strong></td>
                                <td>₹4,200</td>
                            </tr>
                            <tr>
                                <td><strong>Calculated Fare (with deviation):</strong></td>
                                <td class="text-danger">₹4,682</td>
                            </tr>
                            <tr>
                                <td><strong>Extra Cost:</strong></td>
                                <td class="text-danger">₹482</td>
                            </tr>
                        </table>
                        
                        <h6 class="mt-3">Action Required:</h6>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="fareAction" id="approveOriginal" checked>
                            <label class="form-check-label" for="approveOriginal">
                                Approve Original Fare (₹4,200) - Block extra cost
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="fareAction" id="approveActual">
                            <label class="form-check-label" for="approveActual">
                                Approve Actual Fare (₹4,682) - Allow deviation
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="fareAction" id="customFare">
                            <label class="form-check-label" for="customFare">
                                Set Custom Fare
                            </label>
                        </div>
                        <input type="number" class="form-control mt-2" id="customFareAmount" placeholder="Enter custom fare" disabled>
                        
                        <div class="mt-3">
                            <label class="form-label">Notes:</label>
                            <textarea class="form-control" rows="2" placeholder="Add notes about this decision..."></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="submitFareReview('${vehicleId}')">
                            <i class="fas fa-check"></i> Submit Decision
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal
    const existingModal = document.getElementById('fareReviewModal');
    if (existingModal) existingModal.remove();
    
    // Add and show modal
    document.body.insertAdjacentHTML('beforeend', reviewHTML);
    new bootstrap.Modal(document.getElementById('fareReviewModal')).show();
    
    // Enable custom fare input when selected
    document.getElementById('customFare').addEventListener('change', function() {
        document.getElementById('customFareAmount').disabled = !this.checked;
    });
}

function submitFareReview(vehicleId) {
    const action = document.querySelector('input[name="fareAction"]:checked').id;
    let message = '';
    
    switch(action) {
        case 'approveOriginal':
            message = `Original fare approved for ${vehicleId}. Extra cost blocked.`;
            break;
        case 'approveActual':
            message = `Actual fare approved for ${vehicleId}. Deviation allowed.`;
            break;
        case 'customFare':
            const customAmount = document.getElementById('customFareAmount').value;
            message = `Custom fare ₹${customAmount} set for ${vehicleId}.`;
            break;
    }
    
    showNotification(message, 'success');
    bootstrap.Modal.getInstance(document.getElementById('fareReviewModal')).hide();
    updateFareCalculationTable();
}

function approveFare(vehicleId) {
    showNotification(`✅ Fare approved for ${vehicleId}`, 'success');
    updateFareCalculationTable();
}

// ========================================
// 6. CONTROL TOGGLES
// ========================================

function enableRouteBlocking() {
    routeBlockingEnabled = !routeBlockingEnabled;
    const btn = event.target.closest('button');
    
    if (routeBlockingEnabled) {
        btn.className = 'btn btn-danger btn-sm';
        btn.innerHTML = '<i class="fas fa-toggle-on"></i> Enabled';
        showNotification('Route blocking enabled', 'success');
    } else {
        btn.className = 'btn btn-secondary btn-sm';
        btn.innerHTML = '<i class="fas fa-toggle-off"></i> Disabled';
        showNotification('Route blocking disabled', 'warning');
    }
}

function toggleAlerts() {
    const btn = event.target.closest('button');
    const isActive = btn.classList.contains('btn-success');
    
    if (isActive) {
        btn.className = 'btn btn-secondary btn-sm';
        btn.innerHTML = '<i class="fas fa-toggle-off"></i> Inactive';
        showNotification('Real-time alerts disabled', 'warning');
    } else {
        btn.className = 'btn btn-success btn-sm';
        btn.innerHTML = '<i class="fas fa-toggle-on"></i> Active';
        showNotification('Real-time alerts enabled', 'success');
    }
}

function toggleAutoContact() {
    autoContactEnabled = !autoContactEnabled;
    const btn = event.target.closest('button');
    
    if (autoContactEnabled) {
        btn.className = 'btn btn-success btn-sm';
        btn.innerHTML = '<i class="fas fa-toggle-on"></i> Active';
        showNotification('Auto-contact driver enabled', 'success');
    } else {
        btn.className = 'btn btn-secondary btn-sm';
        btn.innerHTML = '<i class="fas fa-toggle-off"></i> Inactive';
        showNotification('Auto-contact driver disabled', 'warning');
    }
}

function generateDeviationReport() {
    showNotification('Generating deviation report...', 'info');
    
    setTimeout(() => {
        const report = `
ROUTE DEVIATION REPORT
Generated: ${new Date().toLocaleString()}

SUMMARY:
- Total Trips: 15
- Deviations Detected: 3
- Compliance Rate: 80%
- Blocked Costs: ₹2,450
- GPS Accuracy: 98.5%

DEVIATIONS:
1. TN01AB1234 - 5.2 km deviation - ₹482 blocked
2. TN02CD5678 - 1.8 km deviation - ₹145 under review
3. TN03EF9012 - 3.5 km deviation - ₹350 approved

RECOMMENDATIONS:
- Review driver training for TN01AB1234
- Monitor TN02CD5678 for pattern
- Continue current monitoring protocols
        `;
        
        console.log(report);
        showNotification('✅ Deviation report generated and downloaded', 'success');
        
        // In real implementation, download as PDF
        alert(report);
    }, 2000);
}

// ========================================
// 7. INITIALIZATION
// ========================================

function initializeRouteMonitoring() {
    console.log('Initializing Route Monitoring & Control System...');
    
    // Start GPS accuracy monitoring
    setInterval(monitorGPSAccuracy, 5000);
    
    // Update fare calculations
    updateFareCalculationTable();
    
    // Start route deviation detection
    setInterval(() => {
        // Simulate route monitoring
        const vehicles = ['TN01AB1234', 'TN02CD5678', 'TN04GH3456'];
        vehicles.forEach(vehicleId => {
            const deviation = Math.random() * 10;
            if (deviation > deviationThreshold) {
                detectRouteDeviation(vehicleId, 'Current Location', 'Planned Route');
            }
        });
    }, 30000); // Check every 30 seconds
    
    showNotification('Route Monitoring System initialized successfully', 'success');
}

// Auto-initialize when section is shown
document.addEventListener('DOMContentLoaded', function() {
    // Initialize when route monitoring section is shown
    const routeMonitoringSection = document.getElementById('routeMonitoring');
    if (routeMonitoringSection) {
        initializeRouteMonitoring();
    }
});

console.log('Route Monitoring & Control System loaded successfully!');
