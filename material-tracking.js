// Material Tracking System
// Real-time tracking of materials throughout delivery lifecycle

const materialTracking = {
    trackingRecords: [],
    lifecycleStages: [
        { id: 1, name: 'Warehouse Pickup', icon: '🏭', color: '#4CAF50' },
        { id: 2, name: 'In Transit', icon: '🚚', color: '#2196F3' },
        { id: 3, name: 'Checkpoint Scan', icon: '✅', color: '#FF9800' },
        { id: 4, name: 'Near Delivery', icon: '📍', color: '#9C27B0' },
        { id: 5, name: 'Delivered', icon: '📦', color: '#00BCD4' },
        { id: 6, name: 'Confirmed', icon: '✔️', color: '#8BC34A' }
    ],
    activeTracking: {},
    trackingHistory: [],
    alerts: [],
    customerPortal: {}
};

// Initialize Material Tracking System
function initializeMaterialTracking() {
    console.log('Initializing Material Tracking System...');
    loadTrackingRecords();
    setupTrackingDashboard();
    initializeTrackingMap();
    startAutoRefresh();
}

// Load tracking records from localStorage
function loadTrackingRecords() {
    const stored = localStorage.getItem('materialTrackingRecords');
    if (stored) {
        materialTracking.trackingRecords = JSON.parse(stored);
    } else {
        // Initialize with sample data
        materialTracking.trackingRecords = [
            {
                id: 'MT001',
                trackingNumber: 'TRK-2024-001',
                materialId: 'MAT001',
                materialCode: 'LAM001',
                materialName: 'Satin Laminate',
                quantity: 100,
                unit: 'sheets',
                orderId: 'ORD001',
                currentStage: 2,
                status: 'in-transit',
                currentLocation: {
                    lat: 13.0827,
                    lng: 80.2707,
                    address: 'Chennai Main Warehouse'
                },
                eta: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
                createdAt: new Date().toISOString()
            }
        ];
        saveTrackingRecords();
    }
}

// Save tracking records to localStorage
function saveTrackingRecords() {
    localStorage.setItem('materialTrackingRecords', JSON.stringify(materialTracking.trackingRecords));
}

// Setup Tracking Dashboard
function setupTrackingDashboard() {
    const dashboardHTML = `
        <div class="material-tracking-dashboard">
            <div class="tracking-header">
                <h2><i class="fas fa-map-marked-alt"></i> Material Tracking Dashboard</h2>
                <div class="tracking-stats">
                    <div class="stat-card">
                        <div class="stat-value" id="activeShipmentsCount">0</div>
                        <div class="stat-label">Active Shipments</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="inTransitCount">0</div>
                        <div class="stat-label">In Transit</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="deliveredTodayCount">0</div>
                        <div class="stat-label">Delivered Today</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="delayedCount">0</div>
                        <div class="stat-label">Delayed</div>
                    </div>
                </div>
            </div>
            
            <div class="tracking-controls">
                <button class="btn btn-primary" onclick="showAddTrackingModal()">
                    <i class="fas fa-plus"></i> Start New Tracking
                </button>
                <input type="text" id="trackingSearchInput" class="form-control" 
                       placeholder="Search by tracking number, material code, or order..." 
                       onkeyup="searchTracking()">
            </div>

            <div class="tracking-content">
                <div class="tracking-map-container">
                    <div id="trackingMap" style="height: 400px; border-radius: 8px;"></div>
                </div>
                
                <div class="tracking-list-container">
                    <h3>Active Shipments</h3>
                    <div id="trackingListContainer"></div>
                </div>
            </div>
        </div>
    `;
    
    // Add to main content area if it exists
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        const trackingSection = document.createElement('div');
        trackingSection.id = 'materialTrackingSection';
        trackingSection.className = 'content-section';
        trackingSection.style.display = 'none';
        trackingSection.innerHTML = dashboardHTML;
        mainContent.appendChild(trackingSection);
    }
    
    updateTrackingDashboard();
}

// Update Tracking Dashboard
function updateTrackingDashboard() {
    const activeShipments = materialTracking.trackingRecords.filter(t => 
        t.currentStage < 6 && t.status !== 'cancelled'
    );
    const inTransit = activeShipments.filter(t => t.currentStage === 2);
    const deliveredToday = materialTracking.trackingRecords.filter(t => {
        const today = new Date().toDateString();
        const deliveredDate = new Date(t.deliveredAt || 0).toDateString();
        return deliveredDate === today && t.currentStage === 5;
    });
    const delayed = activeShipments.filter(t => {
        const eta = new Date(t.eta);
        return eta < new Date() && t.currentStage < 5;
    });

    // Update stats
    document.getElementById('activeShipmentsCount').textContent = activeShipments.length;
    document.getElementById('inTransitCount').textContent = inTransit.length;
    document.getElementById('deliveredTodayCount').textContent = deliveredToday.length;
    document.getElementById('delayedCount').textContent = delayed.length;

    // Update tracking list
    displayTrackingList(activeShipments);
}

// Display Tracking List
function displayTrackingList(trackingList) {
    const container = document.getElementById('trackingListContainer');
    if (!container) return;

    if (trackingList.length === 0) {
        container.innerHTML = '<p class="text-muted">No active shipments</p>';
        return;
    }

    container.innerHTML = trackingList.map(tracking => `
        <div class="tracking-card" onclick="showTrackingDetails('${tracking.id}')">
            <div class="tracking-card-header">
                <div>
                    <strong>${tracking.trackingNumber}</strong>
                    <span class="badge bg-info">${tracking.materialCode}</span>
                </div>
                <span class="stage-badge stage-${tracking.currentStage}">
                    ${materialTracking.lifecycleStages[tracking.currentStage - 1].icon}
                    ${materialTracking.lifecycleStages[tracking.currentStage - 1].name}
                </span>
            </div>
            <div class="tracking-card-body">
                <div class="tracking-info">
                    <div><strong>Material:</strong> ${tracking.materialName}</div>
                    <div><strong>Quantity:</strong> ${tracking.quantity} ${tracking.unit}</div>
                    <div><strong>Order:</strong> ${tracking.orderId}</div>
                </div>
                <div class="tracking-location">
                    <i class="fas fa-map-marker-alt"></i> ${tracking.currentLocation.address}
                </div>
                <div class="tracking-eta">
                    <i class="fas fa-clock"></i> ETA: ${formatETA(tracking.eta)}
                </div>
            </div>
            <div class="tracking-progress">
                <div class="progress">
                    <div class="progress-bar" style="width: ${(tracking.currentStage / 6) * 100}%"></div>
                </div>
                <small>${tracking.currentStage} of 6 stages completed</small>
            </div>
        </div>
    `).join('');
}

// Initialize Tracking Map
function initializeTrackingMap() {
    // Placeholder for map initialization
    // In production, integrate with Leaflet.js or Google Maps
    console.log('Tracking map initialized');
}

// Generate Tracking Number
function generateTrackingNumber() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `TRK-${year}-${random}`;
}

// Initiate Material Tracking
function initiateMaterialTracking(shipmentData) {
    const trackingNumber = generateTrackingNumber();
    
    const newTracking = {
        id: 'MT' + Date.now(),
        trackingNumber: trackingNumber,
        materialId: shipmentData.materialId,
        materialCode: shipmentData.materialCode,
        materialName: shipmentData.materialName,
        quantity: shipmentData.quantity,
        unit: shipmentData.unit,
        orderId: shipmentData.orderId,
        currentStage: 1,
        status: 'warehouse-pickup',
        currentLocation: shipmentData.pickupLocation,
        destination: shipmentData.deliveryLocation,
        eta: calculateETA(shipmentData.pickupLocation, shipmentData.deliveryLocation),
        stages: [],
        createdAt: new Date().toISOString(),
        createdBy: 'system'
    };

    // Record first stage
    recordTrackingEvent(newTracking.id, 1, {
        location: shipmentData.pickupLocation,
        handler: shipmentData.handler,
        notes: 'Material picked up from warehouse'
    });

    materialTracking.trackingRecords.push(newTracking);
    saveTrackingRecords();
    updateTrackingDashboard();

    showNotification('success', `Tracking initiated: ${trackingNumber}`);
    return trackingNumber;
}

// Record Tracking Event
function recordTrackingEvent(trackingId, stage, eventData) {
    const tracking = materialTracking.trackingRecords.find(t => t.id === trackingId);
    if (!tracking) return;

    const event = {
        stage: stage,
        stageName: materialTracking.lifecycleStages[stage - 1].name,
        timestamp: new Date().toISOString(),
        location: eventData.location,
        handler: eventData.handler,
        condition: eventData.condition || 'good',
        notes: eventData.notes,
        photos: eventData.photos || [],
        barcodeScan: eventData.barcodeScan || null
    };

    if (!tracking.stages) tracking.stages = [];
    tracking.stages.push(event);
    tracking.currentStage = stage;
    tracking.currentLocation = eventData.location;

    // Update status based on stage
    const statusMap = {
        1: 'warehouse-pickup',
        2: 'in-transit',
        3: 'checkpoint-scan',
        4: 'near-delivery',
        5: 'delivered',
        6: 'confirmed'
    };
    tracking.status = statusMap[stage];

    if (stage === 5) {
        tracking.deliveredAt = new Date().toISOString();
    }

    saveTrackingRecords();
    updateTrackingDashboard();

    // Send notification
    sendTrackingNotification(trackingId, stage);
}

// Calculate ETA
function calculateETA(fromLocation, toLocation) {
    // Simplified ETA calculation (in production, use actual distance/traffic data)
    const baseHours = 6;
    const eta = new Date();
    eta.setHours(eta.getHours() + baseHours);
    return eta.toISOString();
}

// Format ETA
function formatETA(etaString) {
    const eta = new Date(etaString);
    const now = new Date();
    const diff = eta - now;
    
    if (diff < 0) return '<span class="text-danger">Delayed</span>';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
        const days = Math.floor(hours / 24);
        return `${days} day${days > 1 ? 's' : ''}`;
    }
    
    return `${hours}h ${minutes}m`;
}

// Send Tracking Notification
function sendTrackingNotification(trackingId, stage) {
    const tracking = materialTracking.trackingRecords.find(t => t.id === trackingId);
    if (!tracking) return;

    const stageName = materialTracking.lifecycleStages[stage - 1].name;
    const message = `Material ${tracking.materialCode} - ${stageName}`;
    
    console.log(`Notification: ${message}`);
    // In production, integrate with WhatsApp/Email API
}

// Show Tracking Details Modal
function showTrackingDetails(trackingId) {
    const tracking = materialTracking.trackingRecords.find(t => t.id === trackingId);
    if (!tracking) return;

    const modalHTML = `
        <div class="modal fade" id="trackingDetailsModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-box"></i> Tracking Details: ${tracking.trackingNumber}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="tracking-details">
                            <div class="detail-section">
                                <h6>Material Information</h6>
                                <table class="table table-sm">
                                    <tr><td><strong>Material Code:</strong></td><td>${tracking.materialCode}</td></tr>
                                    <tr><td><strong>Material Name:</strong></td><td>${tracking.materialName}</td></tr>
                                    <tr><td><strong>Quantity:</strong></td><td>${tracking.quantity} ${tracking.unit}</td></tr>
                                    <tr><td><strong>Order ID:</strong></td><td>${tracking.orderId}</td></tr>
                                </table>
                            </div>

                            <div class="detail-section">
                                <h6>Current Status</h6>
                                <div class="lifecycle-stages">
                                    ${materialTracking.lifecycleStages.map((stage, index) => `
                                        <div class="stage-item ${index + 1 <= tracking.currentStage ? 'completed' : ''}">
                                            <div class="stage-icon">${stage.icon}</div>
                                            <div class="stage-name">${stage.name}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <div class="detail-section">
                                <h6>Location & ETA</h6>
                                <p><i class="fas fa-map-marker-alt"></i> ${tracking.currentLocation.address}</p>
                                <p><i class="fas fa-clock"></i> ETA: ${formatETA(tracking.eta)}</p>
                            </div>

                            <div class="detail-section">
                                <h6>Tracking History</h6>
                                <div class="tracking-timeline">
                                    ${(tracking.stages || []).map(event => `
                                        <div class="timeline-item">
                                            <div class="timeline-marker"></div>
                                            <div class="timeline-content">
                                                <strong>${event.stageName}</strong>
                                                <div class="text-muted small">${new Date(event.timestamp).toLocaleString()}</div>
                                                <div>${event.location.address}</div>
                                                ${event.notes ? `<div class="text-muted">${event.notes}</div>` : ''}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="updateTrackingStage('${tracking.id}')">
                            Update Stage
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('trackingDetailsModal');
    if (existingModal) existingModal.remove();

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('trackingDetailsModal'));
    modal.show();
}

// Search Tracking
function searchTracking() {
    const searchTerm = document.getElementById('trackingSearchInput').value.toLowerCase();
    const filtered = materialTracking.trackingRecords.filter(t => 
        t.trackingNumber.toLowerCase().includes(searchTerm) ||
        t.materialCode.toLowerCase().includes(searchTerm) ||
        t.materialName.toLowerCase().includes(searchTerm) ||
        t.orderId.toLowerCase().includes(searchTerm)
    );
    displayTrackingList(filtered);
}

// Start Auto Refresh
function startAutoRefresh() {
    setInterval(() => {
        updateTrackingDashboard();
    }, 30000); // Refresh every 30 seconds
}

// Show Add Tracking Modal
function showAddTrackingModal() {
    // Implementation for adding new tracking
    showNotification('info', 'Add tracking modal - to be implemented');
}

// Update Tracking Stage
function updateTrackingStage(trackingId) {
    const tracking = materialTracking.trackingRecords.find(t => t.id === trackingId);
    if (!tracking) return;

    const nextStage = tracking.currentStage + 1;
    if (nextStage > 6) {
        showNotification('warning', 'Tracking already completed');
        return;
    }

    recordTrackingEvent(trackingId, nextStage, {
        location: tracking.currentLocation,
        handler: { name: 'System', id: 'SYS001' },
        notes: `Stage ${nextStage} completed`
    });

    showNotification('success', `Updated to stage: ${materialTracking.lifecycleStages[nextStage - 1].name}`);
    
    // Close modal and refresh
    bootstrap.Modal.getInstance(document.getElementById('trackingDetailsModal')).hide();
    updateTrackingDashboard();
}

// Export functions
window.materialTracking = materialTracking;
window.initializeMaterialTracking = initializeMaterialTracking;
window.initiateMaterialTracking = initiateMaterialTracking;
window.recordTrackingEvent = recordTrackingEvent;
window.showTrackingDetails = showTrackingDetails;
window.searchTracking = searchTracking;
window.showAddTrackingModal = showAddTrackingModal;
window.updateTrackingStage = updateTrackingStage;
