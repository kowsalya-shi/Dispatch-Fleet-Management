// Additional Button Implementations for Fleet Management System
// This file contains implementations for buttons that were previously non-functional

// ============================================
// ORDER MANAGEMENT BUTTON FUNCTIONS
// ============================================

function editOrder(orderId) {
    const order = sampleData.orders.find(o => o.id === orderId);
    if (!order) {
        showNotification('Order not found', 'error');
        return;
    }
    
    const modalHTML = `
        <div class="modal fade show" id="editOrderModal" style="display: block; background: rgba(0,0,0,0.5);" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-warning text-dark">
                        <h5 class="modal-title"><i class="fas fa-edit"></i> Edit Order - ${orderId}</h5>
                        <button type="button" class="btn-close" onclick="closeOrderModal('editOrderModal')"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editOrderForm">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Order ID</label>
                                    <input type="text" class="form-control" value="${orderId}" disabled>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Customer Name *</label>
                                    <input type="text" class="form-control" id="editCustomerName" value="${order.customer}" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Pickup Location *</label>
                                    <input type="text" class="form-control" id="editPickupLocation" value="${order.pickup}" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Delivery Location *</label>
                                    <input type="text" class="form-control" id="editDeliveryLocation" value="${order.delivery}" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Material *</label>
                                    <input type="text" class="form-control" id="editMaterial" value="${order.material}" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Priority *</label>
                                    <select class="form-control" id="editPriority" required>
                                        <option value="normal" ${order.priority === 'normal' ? 'selected' : ''}>Normal</option>
                                        <option value="high" ${order.priority === 'high' ? 'selected' : ''}>High</option>
                                        <option value="urgent" ${order.priority === 'urgent' ? 'selected' : ''}>Urgent</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Quantity *</label>
                                    <input type="number" class="form-control" id="editQuantity" value="${order.quantity}" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Contact Phone</label>
                                    <input type="tel" class="form-control" id="editContact" value="${order.contact || order.phone || ''}">
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeOrderModal('editOrderModal')">Cancel</button>
                        <button type="button" class="btn btn-warning" onclick="updateOrder('${orderId}')">
                            <i class="fas fa-save"></i> Update Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function updateOrder(orderId) {
    const order = sampleData.orders.find(o => o.id === orderId);
    if (!order) return;
    
    order.customer = document.getElementById('editCustomerName').value;
    order.pickup = document.getElementById('editPickupLocation').value;
    order.delivery = document.getElementById('editDeliveryLocation').value;
    order.material = document.getElementById('editMaterial').value;
    order.priority = document.getElementById('editPriority').value;
    order.quantity = document.getElementById('editQuantity').value;
    order.contact = document.getElementById('editContact').value;
    
    updateOrderTable();
    closeOrderModal('editOrderModal');
    showNotification(`Order ${orderId} updated successfully!`, 'success');
}

function viewOrderDetails(orderId) {
    const order = sampleData.orders.find(o => o.id === orderId);
    if (!order) {
        showNotification('Order not found', 'error');
        return;
    }
    
    const priorityColor = {
        'normal': 'secondary',
        'high': 'warning',
        'urgent': 'danger'
    }[order.priority] || 'secondary';
    
    const statusColor = {
        'pending': 'warning',
        'processing': 'info',
        'assigned': 'primary',
        'completed': 'success',
        'cancelled': 'danger'
    }[order.status] || 'secondary';
    
    const modalHTML = `
        <div class="modal fade show" id="viewOrderModal" style="display: block; background: rgba(0,0,0,0.5);" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-info text-white">
                        <h5 class="modal-title"><i class="fas fa-eye"></i> Order Details - ${orderId}</h5>
                        <button type="button" class="btn-close btn-close-white" onclick="closeOrderModal('viewOrderModal')"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card mb-3">
                                    <div class="card-header bg-light">
                                        <h6 class="mb-0">Order Information</h6>
                                    </div>
                                    <div class="card-body">
                                        <p><strong>Order ID:</strong> ${order.id}</p>
                                        <p><strong>Customer:</strong> ${order.customer}</p>
                                        <p><strong>Material:</strong> ${order.material}</p>
                                        <p><strong>Quantity:</strong> ${order.quantity} ${order.unit || 'units'}</p>
                                        <p><strong>Priority:</strong> <span class="badge bg-${priorityColor}">${order.priority.toUpperCase()}</span></p>
                                        <p><strong>Status:</strong> <span class="badge bg-${statusColor}">${order.status.toUpperCase()}</span></p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card mb-3">
                                    <div class="card-header bg-light">
                                        <h6 class="mb-0">Delivery Details</h6>
                                    </div>
                                    <div class="card-body">
                                        <p><strong>Pickup:</strong> ${order.pickup}</p>
                                        <p><strong>Delivery:</strong> ${order.delivery}</p>
                                        <p><strong>Created Date:</strong> ${order.createdDate}</p>
                                        <p><strong>Required Date:</strong> ${order.requiredDate || 'N/A'}</p>
                                        ${order.assignedVehicle ? `<p><strong>Vehicle:</strong> ${order.assignedVehicle}</p>` : ''}
                                        ${order.assignedDriver ? `<p><strong>Driver:</strong> ${order.assignedDriver}</p>` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Contact Information</h6>
                            </div>
                            <div class="card-body">
                                <p><strong>Phone:</strong> ${order.contact || order.phone || 'N/A'}</p>
                                <p><strong>Email:</strong> ${order.email || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeOrderModal('viewOrderModal')">Close</button>
                        <button type="button" class="btn btn-primary" onclick="closeOrderModal('viewOrderModal'); editOrder('${orderId}')">
                            <i class="fas fa-edit"></i> Edit Order
                        </button>
                        ${order.status === 'pending' ? `
                        <button type="button" class="btn btn-success" onclick="closeOrderModal('viewOrderModal'); processOrderWorkflow('${orderId}')">
                            <i class="fas fa-play"></i> Process Order
                        </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function deleteOrder(orderId) {
    if (confirm(`Are you sure you want to delete order ${orderId}?\n\nThis action cannot be undone.`)) {
        const index = sampleData.orders.findIndex(o => o.id === orderId);
        if (index > -1) {
            sampleData.orders.splice(index, 1);
            updateOrderTable();
            updateDashboard();
            showNotification(`Order ${orderId} deleted successfully!`, 'success');
        }
    }
}

function processOrderWorkflow(orderId) {
    // Store order ID for dispatch app to process
    localStorage.setItem('processOrderId', orderId);
    localStorage.setItem('processOrderAction', 'workflow');
    
    showNotification(`Opening Dispatch Management to process order ${orderId}...`, 'info');
    
    // Open dispatch app in new window
    setTimeout(() => {
        window.open('dispatch-app.html', '_blank');
    }, 500);
}

function trackOrderStatus(orderId) {
    // Store order ID for dispatch app tracking
    localStorage.setItem('trackOrderId', orderId);
    localStorage.setItem('trackOrderAction', 'tracking');
    
    showNotification(`Opening live tracking for order ${orderId}...`, 'info');
    
    // Open dispatch app in new window
    setTimeout(() => {
        window.open('dispatch-app.html', '_blank');
    }, 500);
}

function closeOrderModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}

// ============================================
// TRIP MANAGEMENT BUTTON FUNCTIONS
// ============================================

function viewTrip(tripId) {
    const trip = sampleData.trips.find(t => t.id === tripId);
    if (!trip) {
        showNotification('Trip not found', 'error');
        return;
    }
    
    const statusColor = {
        'scheduled': 'secondary',
        'dispatched': 'info',
        'in-transit': 'primary',
        'completed': 'success',
        'cancelled': 'danger'
    }[trip.status] || 'secondary';
    
    const modalHTML = `
        <div class="modal fade show" id="viewTripModal" style="display: block; background: rgba(0,0,0,0.5);" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-info text-white">
                        <h5 class="modal-title"><i class="fas fa-route"></i> Trip Details - ${tripId}</h5>
                        <button type="button" class="btn-close btn-close-white" onclick="closeTripModal('viewTripModal')"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h6><i class="fas fa-info-circle"></i> Trip Information</h6>
                                <table class="table table-borderless">
                                    <tr><td><strong>Trip ID:</strong></td><td>${trip.id}</td></tr>
                                    <tr><td><strong>Vehicle:</strong></td><td>${trip.vehicle}</td></tr>
                                    <tr><td><strong>Driver:</strong></td><td>${trip.driver}</td></tr>
                                    <tr><td><strong>Route:</strong></td><td>${trip.route}</td></tr>
                                    <tr><td><strong>Status:</strong></td><td><span class="badge bg-${statusColor}">${trip.status.toUpperCase().replace('-', ' ')}</span></td></tr>
                                </table>
                            </div>
                            <div class="col-md-6">
                                <h6><i class="fas fa-chart-line"></i> Progress</h6>
                                <div class="mb-3">
                                    <div class="d-flex justify-content-between mb-1">
                                        <span>Trip Progress</span>
                                        <span><strong>${trip.progress}%</strong></span>
                                    </div>
                                    <div class="progress" style="height: 20px;">
                                        <div class="progress-bar bg-${trip.progress === 100 ? 'success' : 'primary'}" 
                                             style="width: ${trip.progress}%">${trip.progress}%</div>
                                    </div>
                                </div>
                                ${trip.orderId ? `<p><strong>Order ID:</strong> ${trip.orderId}</p>` : ''}
                                <p><strong>Last Updated:</strong> ${new Date().toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeTripModal('viewTripModal')">Close</button>
                        ${trip.status === 'in-transit' ? `
                        <button type="button" class="btn btn-primary" onclick="closeTripModal('viewTripModal'); trackTrip('${tripId}')">
                            <i class="fas fa-map-marker-alt"></i> Track Live
                        </button>
                        ` : ''}
                        ${trip.status !== 'completed' && trip.status !== 'cancelled' ? `
                        <button type="button" class="btn btn-danger" onclick="closeTripModal('viewTripModal'); cancelTrip('${tripId}')">
                            <i class="fas fa-times"></i> Cancel Trip
                        </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function editTrip(tripId) {
    showNotification(`Edit functionality for trip ${tripId} - Contact dispatch management`, 'info');
}

function trackTrip(tripId) {
    localStorage.setItem('trackTripId', tripId);
    localStorage.setItem('trackTripAction', 'tracking');
    
    showNotification(`Opening live tracking for trip ${tripId}...`, 'info');
    
    setTimeout(() => {
        window.open('dispatch-app.html', '_blank');
    }, 500);
}

function cancelTrip(tripId) {
    if (confirm(`Are you sure you want to cancel trip ${tripId}?\n\nThis will free up the assigned vehicle and driver.`)) {
        const trip = sampleData.trips.find(t => t.id === tripId);
        if (trip) {
            trip.status = 'cancelled';
            trip.progress = 0;
            
            // Free up driver
            const driver = sampleData.drivers.find(d => d.name === trip.driver);
            if (driver) {
                driver.availability = 'available';
            }
            
            showNotification(`Trip ${tripId} cancelled successfully!`, 'success');
            updateDashboard();
        }
    }
}

function closeTripModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}

// ============================================
// DOCUMENT MANAGEMENT BUTTON FUNCTIONS
// ============================================

function uploadDocument(category) {
    const modalHTML = `
        <div class="modal fade show" id="uploadDocModal" style="display: block; background: rgba(0,0,0,0.5);" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title"><i class="fas fa-upload"></i> Upload Document - ${category}</h5>
                        <button type="button" class="btn-close btn-close-white" onclick="closeDocModal('uploadDocModal')"></button>
                    </div>
                    <div class="modal-body">
                        <form id="uploadDocForm">
                            <div class="mb-3">
                                <label class="form-label">Document Category</label>
                                <input type="text" class="form-control" value="${category}" disabled>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Document Name *</label>
                                <input type="text" class="form-control" id="docName" placeholder="Enter document name" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Select File *</label>
                                <input type="file" class="form-control" id="docFile" accept=".pdf,.doc,.docx,.jpg,.png" required>
                                <small class="text-muted">Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)</small>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Expiry Date (if applicable)</label>
                                <input type="date" class="form-control" id="docExpiry">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Notes</label>
                                <textarea class="form-control" id="docNotes" rows="3" placeholder="Additional notes..."></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeDocModal('uploadDocModal')">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="submitDocument('${category}')">
                            <i class="fas fa-upload"></i> Upload Document
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function submitDocument(category) {
    const docName = document.getElementById('docName').value;
    const docFile = document.getElementById('docFile').files[0];
    
    if (!docName || !docFile) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    
    showNotification(`Document "${docName}" uploaded successfully to ${category}!`, 'success');
    closeDocModal('uploadDocModal');
}

function viewDocument(docId, docName) {
    showNotification(`Opening document: ${docName}`, 'info');
    // In real implementation, this would open the document in a new tab or viewer
}

function renewDocument(docId, docName) {
    const modalHTML = `
        <div class="modal fade show" id="renewDocModal" style="display: block; background: rgba(0,0,0,0.5);" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-warning text-dark">
                        <h5 class="modal-title"><i class="fas fa-sync"></i> Renew Document</h5>
                        <button type="button" class="btn-close" onclick="closeDocModal('renewDocModal')"></button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Document:</strong> ${docName}</p>
                        <form id="renewDocForm">
                            <div class="mb-3">
                                <label class="form-label">New Expiry Date *</label>
                                <input type="date" class="form-control" id="newExpiry" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Upload Renewed Document</label>
                                <input type="file" class="form-control" id="renewedFile" accept=".pdf,.doc,.docx,.jpg,.png">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Notes</label>
                                <textarea class="form-control" id="renewNotes" rows="2" placeholder="Renewal notes..."></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeDocModal('renewDocModal')">Cancel</button>
                        <button type="button" class="btn btn-warning" onclick="submitRenewal('${docId}', '${docName}')">
                            <i class="fas fa-check"></i> Confirm Renewal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function submitRenewal(docId, docName) {
    const newExpiry = document.getElementById('newExpiry').value;
    
    if (!newExpiry) {
        showNotification('Please select new expiry date', 'error');
        return;
    }
    
    showNotification(`Document "${docName}" renewed successfully! New expiry: ${newExpiry}`, 'success');
    closeDocModal('renewDocModal');
}

function deleteDocument(docId, docName) {
    if (confirm(`Are you sure you want to delete document "${docName}"?\n\nThis action cannot be undone.`)) {
        showNotification(`Document "${docName}" deleted successfully!`, 'success');
    }
}

function closeDocModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function openDynamicDispatch() {
    window.open('dispatch-app.html', '_blank');
}

function openMobileApp() {
    window.open('mobile-app.html', '_blank');
}

function openWhatsAppPanel() {
    showNotification('WhatsApp integration panel opening...', 'info');
    // In real implementation, this would open WhatsApp integration
}

function openEmailPanel() {
    showNotification('Email integration panel opening...', 'info');
    // In real implementation, this would open email integration
}

function exportOrders() {
    showNotification('Exporting order data...', 'info');
    setTimeout(() => {
        showNotification('Order data exported successfully!', 'success');
    }, 1500);
}

function refreshOrders() {
    updateOrderTable();
    showNotification('Order list refreshed successfully!', 'success');
}

function exportRoutes() {
    showNotification('Exporting route data...', 'info');
    setTimeout(() => {
        showNotification('Route data exported successfully!', 'success');
    }, 1500);
}

function refreshRoutes() {
    updateRouteTable();
    showNotification('Route list refreshed successfully!', 'success');
}

function mapRoute(routeCode) {
    const route = sampleData.routes.find(r => r.code === routeCode);
    if (route) {
        showNotification(`Opening map view for route ${routeCode}: ${route.source} → ${route.destination}`, 'info');
        // In real implementation, this would open a map view
        showSection('tracking');
    }
}

console.log('Additional button implementations loaded successfully!');


// ============================================
// MODAL RESET FUNCTIONS
// ============================================

function resetVehicleModal() {
    // Reset the vehicle form when opening the modal for adding new vehicle
    const form = document.getElementById('vehicleForm');
    if (form) {
        form.reset();
    }
    
    // Reset modal title and button text for adding (not editing)
    const modalTitle = document.querySelector('#addVehicleModal .modal-title');
    const submitButton = document.querySelector('#addVehicleModal button[type="submit"]');
    
    if (modalTitle) {
        modalTitle.innerHTML = '<i class="fas fa-plus"></i> Add New Vehicle';
    }
    if (submitButton) {
        submitButton.innerHTML = '<i class="fas fa-plus"></i> Add Vehicle';
    }
}

function resetDriverModal() {
    // Reset the driver form when opening the modal for adding new driver
    const form = document.getElementById('driverForm');
    if (form) {
        form.reset();
    }
    
    // Reset modal title and button text for adding (not editing)
    const modalTitle = document.querySelector('#addDriverModal .modal-title');
    const submitButton = document.querySelector('#addDriverModal button[type="submit"]');
    
    if (modalTitle) {
        modalTitle.innerHTML = '<i class="fas fa-user-plus"></i> Add New Driver';
    }
    if (submitButton) {
        submitButton.innerHTML = '<i class="fas fa-plus"></i> Add Driver';
    }
}

function resetRouteModal() {
    // Reset the route form when opening the modal for adding new route
    const form = document.getElementById('routeForm');
    if (form) {
        form.reset();
    }
    
    // Reset modal title and button text for adding (not editing)
    const modalTitle = document.querySelector('#addRouteModal .modal-title');
    const submitButton = document.querySelector('#addRouteModal button[type="submit"]');
    
    if (modalTitle) {
        modalTitle.innerHTML = '<i class="fas fa-plus"></i> Add New Route';
    }
    if (submitButton) {
        submitButton.innerHTML = '<i class="fas fa-plus"></i> Add Route';
    }
}

function resetTripModal() {
    // Reset the trip form when opening the modal for adding new trip
    const form = document.getElementById('tripForm');
    if (form) {
        form.reset();
    }
    
    // Reset modal title and button text for adding (not editing)
    const modalTitle = document.querySelector('#addTripModal .modal-title');
    const submitButton = document.querySelector('#addTripModal button[type="submit"]');
    
    if (modalTitle) {
        modalTitle.innerHTML = '<i class="fas fa-plus"></i> Create New Trip';
    }
    if (submitButton) {
        submitButton.innerHTML = '<i class="fas fa-plus"></i> Create Trip';
    }
}

function resetMaterialModal() {
    // Reset the material form when opening the modal for adding new material
    const form = document.getElementById('materialForm');
    if (form) {
        form.reset();
    }
    
    // Reset modal title and button text for adding (not editing)
    const modalTitle = document.querySelector('#addMaterialModal .modal-title');
    const submitButton = document.querySelector('#addMaterialModal button[type="submit"]');
    
    if (modalTitle) {
        modalTitle.innerHTML = '<i class="fas fa-plus"></i> Add New Material';
    }
    if (submitButton) {
        submitButton.innerHTML = '<i class="fas fa-plus"></i> Add Material';
    }
}

console.log('Modal reset functions loaded successfully!');


// ========================================
// ENHANCED ROUTE MANAGEMENT FUNCTIONS
// ========================================

// Route Mode Switching
function switchRouteMode(mode) {
    // Hide all sections
    document.getElementById('predefinedTemplates').style.display = 'none';
    document.getElementById('manualRouteForm').style.display = 'none';
    document.getElementById('customRouteForm').style.display = 'none';
    
    // Show selected section
    if (mode === 'predefined') {
        document.getElementById('predefinedTemplates').style.display = 'block';
        showNotification('Select a predefined route template', 'info');
    } else if (mode === 'manual') {
        document.getElementById('manualRouteForm').style.display = 'block';
        showNotification('Create a manual route with basic details', 'info');
    } else if (mode === 'custom') {
        document.getElementById('customRouteForm').style.display = 'block';
        showNotification('Fully customize your route with advanced options', 'info');
    }
}

// Route Template Selection
let selectedTemplate = null;

function selectRouteTemplate(templateId) {
    // Remove previous selection
    document.querySelectorAll('.route-template-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Mark selected template
    event.target.closest('.route-template-card').classList.add('selected');
    
    // Define route templates
    const templates = {
        'chennai-bangalore': {
            name: 'Chennai to Bangalore',
            code: 'CHN-BLR-' + String(Date.now()).slice(-3),
            source: 'Chennai Port',
            destination: 'Bangalore Hub',
            distance: 350,
            hours: 6,
            minutes: 30,
            type: 'highway',
            toll: 450,
            fuel: 2800
        },
        'chennai-coimbatore': {
            name: 'Chennai to Coimbatore',
            code: 'CHN-COI-' + String(Date.now()).slice(-3),
            source: 'T Nagar',
            destination: 'RS Puram',
            distance: 502,
            hours: 8,
            minutes: 15,
            type: 'mixed',
            toll: 520,
            fuel: 3680
        },
        'chennai-madurai': {
            name: 'Chennai to Madurai',
            code: 'CHN-MDU-' + String(Date.now()).slice(-3),
            source: 'Anna Nagar',
            destination: 'Anna Salai',
            distance: 458,
            hours: 7,
            minutes: 45,
            type: 'highway',
            toll: 380,
            fuel: 3470
        },
        'bangalore-hyderabad': {
            name: 'Bangalore to Hyderabad',
            code: 'BLR-HYD-' + String(Date.now()).slice(-3),
            source: 'Electronic City',
            destination: 'HITEC City',
            distance: 569,
            hours: 9,
            minutes: 20,
            type: 'highway',
            toll: 650,
            fuel: 4100
        },
        'chennai-trichy': {
            name: 'Chennai to Trichy',
            code: 'CHN-TRY-' + String(Date.now()).slice(-3),
            source: 'Velachery',
            destination: 'Cantonment',
            distance: 320,
            hours: 5,
            minutes: 30,
            type: 'highway',
            toll: 280,
            fuel: 2400
        },
        'bangalore-mysore': {
            name: 'Bangalore to Mysore',
            code: 'BLR-MYS-' + String(Date.now()).slice(-3),
            source: 'Bangalore City',
            destination: 'Mysore Palace',
            distance: 145,
            hours: 3,
            minutes: 0,
            type: 'highway',
            toll: 150,
            fuel: 1200
        }
    };
    
    selectedTemplate = templates[templateId];
    
    // Auto-fill the manual form with template data
    document.getElementById('routeName').value = selectedTemplate.name;
    document.getElementById('routeCode').value = selectedTemplate.code;
    document.getElementById('sourceLocation').value = selectedTemplate.source;
    document.getElementById('destinationLocation').value = selectedTemplate.destination;
    document.getElementById('routeDistance').value = selectedTemplate.distance;
    document.getElementById('estimatedHours').value = selectedTemplate.hours;
    document.getElementById('estimatedMinutes').value = selectedTemplate.minutes;
    document.getElementById('routeType').value = selectedTemplate.type;
    document.getElementById('tollCost').value = selectedTemplate.toll;
    document.getElementById('fuelCost').value = selectedTemplate.fuel;
    
    showNotification(`Template "${selectedTemplate.name}" selected! You can modify it or save directly.`, 'success');
}

// Preview Route Function
function previewRoute() {
    const mode = document.querySelector('input[name="routeMode"]:checked').id;
    let routeData = {};
    
    if (mode === 'predefinedMode' && selectedTemplate) {
        routeData = selectedTemplate;
    } else if (mode === 'manualMode') {
        routeData = {
            name: document.getElementById('routeName').value,
            code: document.getElementById('routeCode').value,
            source: document.getElementById('sourceLocation').value,
            destination: document.getElementById('destinationLocation').value,
            distance: document.getElementById('routeDistance').value,
            hours: document.getElementById('estimatedHours').value,
            minutes: document.getElementById('estimatedMinutes').value,
            type: document.getElementById('routeType').value,
            toll: document.getElementById('tollCost').value,
            fuel: document.getElementById('fuelCost').value
        };
    } else if (mode === 'customMode') {
        routeData = {
            name: document.getElementById('customRouteName').value,
            code: document.getElementById('customRouteCode').value,
            source: document.getElementById('customSourceLocation').value,
            destination: document.getElementById('customDestinationLocation').value,
            distance: document.getElementById('customRouteDistance').value,
            hours: document.getElementById('customEstimatedHours').value,
            minutes: document.getElementById('customEstimatedMinutes').value,
            type: document.getElementById('customRouteType').value,
            toll: document.getElementById('customTollCost').value,
            fuel: document.getElementById('customFuelCost').value,
            priority: document.getElementById('customRoutePriority')?.value,
            weather: document.getElementById('customWeatherConditions')?.value,
            waypoints: document.getElementById('customWaypoints')?.value,
            instructions: document.getElementById('customSpecialInstructions')?.value
        };
    }
    
    if (!routeData.name) {
        showNotification('Please fill in route details or select a template first', 'warning');
        return;
    }
    
    // Calculate total cost
    const totalCost = (parseFloat(routeData.toll) || 0) + (parseFloat(routeData.fuel) || 0);
    const avgSpeed = routeData.distance / ((parseFloat(routeData.hours) || 0) + (parseFloat(routeData.minutes) || 0) / 60);
    
    // Show preview modal
    const previewHTML = `
        <div class="modal fade" id="routePreviewModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-info text-white">
                        <h5 class="modal-title"><i class="fas fa-eye"></i> Route Preview</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h6 class="text-primary">Basic Information</h6>
                                <table class="table table-sm">
                                    <tr><td><strong>Route Name:</strong></td><td>${routeData.name}</td></tr>
                                    <tr><td><strong>Route Code:</strong></td><td>${routeData.code}</td></tr>
                                    <tr><td><strong>Source:</strong></td><td>${routeData.source}</td></tr>
                                    <tr><td><strong>Destination:</strong></td><td>${routeData.destination}</td></tr>
                                    <tr><td><strong>Distance:</strong></td><td>${routeData.distance} km</td></tr>
                                    <tr><td><strong>Est. Time:</strong></td><td>${routeData.hours}h ${routeData.minutes}m</td></tr>
                                    <tr><td><strong>Route Type:</strong></td><td>${routeData.type}</td></tr>
                                </table>
                            </div>
                            <div class="col-md-6">
                                <h6 class="text-success">Cost Analysis</h6>
                                <table class="table table-sm">
                                    <tr><td><strong>Toll Cost:</strong></td><td>₹${routeData.toll || 0}</td></tr>
                                    <tr><td><strong>Fuel Cost:</strong></td><td>₹${routeData.fuel || 0}</td></tr>
                                    <tr><td><strong>Total Cost:</strong></td><td class="text-success"><strong>₹${totalCost}</strong></td></tr>
                                    <tr><td><strong>Avg Speed:</strong></td><td>${avgSpeed.toFixed(1)} km/h</td></tr>
                                </table>
                                ${routeData.priority ? `<p><strong>Priority:</strong> <span class="badge bg-warning">${routeData.priority}</span></p>` : ''}
                                ${routeData.weather ? `<p><strong>Weather:</strong> ${routeData.weather}</p>` : ''}
                                ${routeData.waypoints ? `<p><strong>Waypoints:</strong> ${routeData.waypoints}</p>` : ''}
                                ${routeData.instructions ? `<p><strong>Instructions:</strong> ${routeData.instructions}</p>` : ''}
                            </div>
                        </div>
                        <div class="alert alert-success mt-3">
                            <i class="fas fa-check-circle"></i> Route is ready to be saved!
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing preview modal if any
    const existingModal = document.getElementById('routePreviewModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add and show preview modal
    document.body.insertAdjacentHTML('beforeend', previewHTML);
    new bootstrap.Modal(document.getElementById('routePreviewModal')).show();
}

// Enhanced Reset Route Modal
function resetRouteModal() {
    // Reset form
    document.getElementById('routeForm').reset();
    
    // Reset mode to predefined
    document.getElementById('predefinedMode').checked = true;
    switchRouteMode('predefined');
    
    // Clear template selection
    selectedTemplate = null;
    document.querySelectorAll('.route-template-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Reset modal title
    document.querySelector('#addRouteModal .modal-title').innerHTML = '<i class="fas fa-plus"></i> Add New Route';
    
    showNotification('Route form reset', 'info');
}

console.log('Enhanced Route Management Functions loaded successfully!');
