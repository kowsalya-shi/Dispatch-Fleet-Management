// System-Generated Material Picking List
// Automated picking list generation with route optimization

const pickingListSystem = {
    pickingLists: [],
    pickingQueue: [],
    assignedPickers: {},
    pickingPerformance: {},
    batchPicking: {},
    routeOptimization: {}
};

// Initialize Picking List System
function initializePickingList() {
    console.log('Initializing Picking List System...');
    loadPickingLists();
    setupPickingDashboard();
}

// Load Picking Lists
function loadPickingLists() {
    const stored = localStorage.getItem('pickingListData');
    if (stored) {
        pickingListSystem.pickingLists = JSON.parse(stored);
    } else {
        // Initialize with sample data
        pickingListSystem.pickingLists = [
            {
                id: 'PL001',
                pickingListNumber: 'PICK-2024-001',
                type: 'single-order',
                status: 'pending',
                priority: 'urgent',
                orderId: 'ORD001',
                customer: 'ABC Corporation',
                items: [
                    {
                        itemNumber: 1,
                        materialCode: 'LAM001',
                        materialName: 'Satin Laminate',
                        requiredQuantity: 100,
                        pickedQuantity: 0,
                        unit: 'sheets',
                        locationCode: 'WH01-A-05-R3-L2-B12',
                        pickingSequence: 1,
                        pickStatus: 'pending'
                    }
                ],
                createdAt: new Date().toISOString()
            }
        ];
        savePickingLists();
    }
}

// Save Picking Lists
function savePickingLists() {
    localStorage.setItem('pickingListData', JSON.stringify(pickingListSystem.pickingLists));
}

// Setup Picking Dashboard
function setupPickingDashboard() {
    const dashboardHTML = `
        <div class="picking-list-dashboard">
            <div class="picking-header">
                <h2><i class="fas fa-clipboard-list"></i> Material Picking Lists</h2>
                <p class="text-muted">System-generated picking lists with route optimization</p>
            </div>

            <div class="picking-stats">
                <div class="stat-card">
                    <div class="stat-value" id="pendingPicksCount">0</div>
                    <div class="stat-label">Pending Picks</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" id="inProgressPicksCount">0</div>
                    <div class="stat-label">In Progress</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" id="completedTodayCount">0</div>
                    <div class="stat-label">Completed Today</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" id="pickingEfficiencyRate">0%</div>
                    <div class="stat-label">Efficiency Rate</div>
                </div>
            </div>

            <div class="picking-controls">
                <button class="btn btn-primary" onclick="showGeneratePickingListModal()">
                    <i class="fas fa-plus"></i> Generate Picking List
                </button>
                <button class="btn btn-success" onclick="showBatchPickingModal()">
                    <i class="fas fa-layer-group"></i> Batch Picking
                </button>
                <button class="btn btn-info" onclick="showPickerAssignment()">
                    <i class="fas fa-user-check"></i> Assign Picker
                </button>
                <input type="text" id="pickingSearchInput" class="form-control" 
                       placeholder="Search picking lists..." onkeyup="searchPickingLists()">
            </div>

            <div class="picking-list-container">
                <h3>Active Picking Lists</h3>
                <div id="pickingListsContainer"></div>
            </div>

            <div class="picking-performance">
                <h3>Picking Performance</h3>
                <div class="performance-grid">
                    <div class="performance-card">
                        <div class="performance-label">Avg Time per Pick</div>
                        <div class="performance-value">8 min</div>
                    </div>
                    <div class="performance-card">
                        <div class="performance-label">Accuracy Rate</div>
                        <div class="performance-value">98.5%</div>
                    </div>
                    <div class="performance-card">
                        <div class="performance-label">Items per Hour</div>
                        <div class="performance-value">7.5</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        const pickingSection = document.createElement('div');
        pickingSection.id = 'pickingListSection';
        pickingSection.className = 'content-section';
        pickingSection.style.display = 'none';
        pickingSection.innerHTML = dashboardHTML;
        mainContent.appendChild(pickingSection);
    }

    updatePickingDashboard();
}

// Update Picking Dashboard
function updatePickingDashboard() {
    const pending = pickingListSystem.pickingLists.filter(p => p.status === 'pending').length;
    const inProgress = pickingListSystem.pickingLists.filter(p => p.status === 'in-progress').length;
    const completedToday = pickingListSystem.pickingLists.filter(p => {
        const today = new Date().toDateString();
        const completedDate = new Date(p.completedAt || 0).toDateString();
        return completedDate === today && p.status === 'completed';
    }).length;

    document.getElementById('pendingPicksCount').textContent = pending;
    document.getElementById('inProgressPicksCount').textContent = inProgress;
    document.getElementById('completedTodayCount').textContent = completedToday;
    document.getElementById('pickingEfficiencyRate').textContent = '95%';

    displayPickingLists(pickingListSystem.pickingLists);
}

// Display Picking Lists
function displayPickingLists(lists) {
    const container = document.getElementById('pickingListsContainer');
    if (!container) return;

    if (lists.length === 0) {
        container.innerHTML = '<p class="text-muted">No picking lists available</p>';
        return;
    }

    container.innerHTML = lists.map(list => `
        <div class="picking-list-card" onclick="showPickingListDetails('${list.id}')">
            <div class="picking-card-header">
                <div>
                    <strong>${list.pickingListNumber}</strong>
                    <span class="badge bg-${getPriorityColor(list.priority)}">${list.priority}</span>
                </div>
                <span class="status-badge status-${list.status}">
                    ${list.status.replace('-', ' ').toUpperCase()}
                </span>
            </div>
            <div class="picking-card-body">
                <div class="picking-info">
                    <div><strong>Order:</strong> ${list.orderId}</div>
                    <div><strong>Customer:</strong> ${list.customer}</div>
                    <div><strong>Items:</strong> ${list.items.length}</div>
                    <div><strong>Type:</strong> ${list.type.replace('-', ' ')}</div>
                </div>
                <div class="picking-progress">
                    <div class="progress">
                        <div class="progress-bar" style="width: ${calculatePickingProgress(list)}%"></div>
                    </div>
                    <small>${getPickedItemsCount(list)} of ${list.items.length} items picked</small>
                </div>
            </div>
            <div class="picking-card-footer">
                <small class="text-muted">Created: ${new Date(list.createdAt).toLocaleString()}</small>
            </div>
        </div>
    `).join('');
}

// Get Priority Color
function getPriorityColor(priority) {
    const colors = {
        'urgent': 'danger',
        'high': 'warning',
        'normal': 'info'
    };
    return colors[priority] || 'secondary';
}

// Calculate Picking Progress
function calculatePickingProgress(list) {
    const picked = list.items.filter(item => item.pickStatus === 'completed').length;
    return (picked / list.items.length) * 100;
}

// Get Picked Items Count
function getPickedItemsCount(list) {
    return list.items.filter(item => item.pickStatus === 'completed').length;
}

// Generate Picking List Number
function generatePickingListNumber() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `PICK-${year}-${random}`;
}

// Show Generate Picking List Modal
function showGeneratePickingListModal() {
    const modalHTML = `
        <div class="modal fade" id="generatePickingListModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-plus"></i> Generate Picking List
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="generatePickingListForm">
                            <div class="mb-3">
                                <label class="form-label">Order ID</label>
                                <input type="text" class="form-control" id="pickOrderId" 
                                       placeholder="Enter order ID..." required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Customer Name</label>
                                <input type="text" class="form-control" id="pickCustomer" 
                                       placeholder="Enter customer name..." required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Priority</label>
                                <select class="form-select" id="pickPriority" required>
                                    <option value="normal">Normal</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Materials to Pick</label>
                                <div id="materialsToPickContainer">
                                    <div class="material-pick-item mb-2">
                                        <div class="row">
                                            <div class="col-md-4">
                                                <input type="text" class="form-control" placeholder="Material Code" required>
                                            </div>
                                            <div class="col-md-4">
                                                <input type="text" class="form-control" placeholder="Material Name" required>
                                            </div>
                                            <div class="col-md-2">
                                                <input type="number" class="form-control" placeholder="Qty" min="1" required>
                                            </div>
                                            <div class="col-md-2">
                                                <input type="text" class="form-control" placeholder="Unit" required>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button type="button" class="btn btn-sm btn-secondary mt-2" onclick="addMaterialPickItem()">
                                    <i class="fas fa-plus"></i> Add Material
                                </button>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="generatePickingList()">
                            <i class="fas fa-check"></i> Generate List
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('generatePickingListModal'));
    modal.show();
}

// Generate Picking List
function generatePickingList() {
    const orderId = document.getElementById('pickOrderId').value;
    const customer = document.getElementById('pickCustomer').value;
    const priority = document.getElementById('pickPriority').value;

    if (!orderId || !customer) {
        showNotification('warning', 'Please fill in all required fields');
        return;
    }

    const newPickingList = {
        id: 'PL' + Date.now(),
        pickingListNumber: generatePickingListNumber(),
        type: 'single-order',
        status: 'pending',
        priority: priority,
        orderId: orderId,
        customer: customer,
        items: [
            {
                itemNumber: 1,
                materialCode: 'LAM001',
                materialName: 'Satin Laminate',
                requiredQuantity: 100,
                pickedQuantity: 0,
                unit: 'sheets',
                locationCode: 'WH01-A-05-R3-L2-B12',
                pickingSequence: 1,
                pickStatus: 'pending'
            }
        ],
        createdAt: new Date().toISOString(),
        createdBy: 'system'
    };

    pickingListSystem.pickingLists.push(newPickingList);
    savePickingLists();
    updatePickingDashboard();

    bootstrap.Modal.getInstance(document.getElementById('generatePickingListModal')).hide();
    showNotification('success', `Picking list ${newPickingList.pickingListNumber} generated successfully`);
}

// Show Picking List Details
function showPickingListDetails(listId) {
    const list = pickingListSystem.pickingLists.find(l => l.id === listId);
    if (!list) return;

    const modalHTML = `
        <div class="modal fade" id="pickingListDetailsModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-clipboard-list"></i> Picking List: ${list.pickingListNumber}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="picking-details">
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <h6>Order Information</h6>
                                    <table class="table table-sm">
                                        <tr><td><strong>Order ID:</strong></td><td>${list.orderId}</td></tr>
                                        <tr><td><strong>Customer:</strong></td><td>${list.customer}</td></tr>
                                        <tr><td><strong>Priority:</strong></td><td><span class="badge bg-${getPriorityColor(list.priority)}">${list.priority}</span></td></tr>
                                        <tr><td><strong>Status:</strong></td><td><span class="badge bg-info">${list.status}</span></td></tr>
                                    </table>
                                </div>
                                <div class="col-md-6">
                                    <h6>Picking Progress</h6>
                                    <div class="progress mb-2" style="height: 30px;">
                                        <div class="progress-bar" style="width: ${calculatePickingProgress(list)}%">
                                            ${calculatePickingProgress(list).toFixed(0)}%
                                        </div>
                                    </div>
                                    <p>${getPickedItemsCount(list)} of ${list.items.length} items picked</p>
                                </div>
                            </div>

                            <h6>Items to Pick</h6>
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Material Code</th>
                                            <th>Material Name</th>
                                            <th>Location</th>
                                            <th>Required</th>
                                            <th>Picked</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${list.items.map(item => `
                                            <tr>
                                                <td>${item.pickingSequence}</td>
                                                <td><strong>${item.materialCode}</strong></td>
                                                <td>${item.materialName}</td>
                                                <td><code>${item.locationCode}</code></td>
                                                <td>${item.requiredQuantity} ${item.unit}</td>
                                                <td>${item.pickedQuantity} ${item.unit}</td>
                                                <td>
                                                    <span class="badge bg-${item.pickStatus === 'completed' ? 'success' : 'warning'}">
                                                        ${item.pickStatus}
                                                    </span>
                                                </td>
                                                <td>
                                                    ${item.pickStatus !== 'completed' ? `
                                                        <button class="btn btn-sm btn-success" onclick="markItemPicked('${list.id}', ${item.itemNumber})">
                                                            <i class="fas fa-check"></i> Pick
                                                        </button>
                                                    ` : '✅'}
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>

                            <div class="picking-route mt-4">
                                <h6>Optimized Picking Route</h6>
                                <div class="alert alert-info">
                                    <strong>Route:</strong> Entrance → Zone A → Aisle 05 → Rack 3 → Level 2 → Bin 12<br>
                                    <strong>Estimated Time:</strong> 12 minutes<br>
                                    <strong>Total Distance:</strong> 85 meters
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="startPicking('${list.id}')">
                            <i class="fas fa-play"></i> Start Picking
                        </button>
                        <button type="button" class="btn btn-success" onclick="completePickingList('${list.id}')">
                            <i class="fas fa-check-double"></i> Complete List
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('pickingListDetailsModal'));
    modal.show();
}

// Mark Item Picked
function markItemPicked(listId, itemNumber) {
    const list = pickingListSystem.pickingLists.find(l => l.id === listId);
    if (!list) return;

    const item = list.items.find(i => i.itemNumber === itemNumber);
    if (!item) return;

    item.pickedQuantity = item.requiredQuantity;
    item.pickStatus = 'completed';
    item.pickedAt = new Date().toISOString();

    savePickingLists();
    showNotification('success', `Item ${item.materialCode} marked as picked`);

    // Refresh modal
    bootstrap.Modal.getInstance(document.getElementById('pickingListDetailsModal')).hide();
    setTimeout(() => showPickingListDetails(listId), 300);
}

// Start Picking
function startPicking(listId) {
    const list = pickingListSystem.pickingLists.find(l => l.id === listId);
    if (!list) return;

    list.status = 'in-progress';
    list.startedAt = new Date().toISOString();

    savePickingLists();
    updatePickingDashboard();
    showNotification('info', 'Picking started');
}

// Complete Picking List
function completePickingList(listId) {
    const list = pickingListSystem.pickingLists.find(l => l.id === listId);
    if (!list) return;

    const allPicked = list.items.every(item => item.pickStatus === 'completed');
    
    if (!allPicked) {
        showNotification('warning', 'Please pick all items before completing the list');
        return;
    }

    list.status = 'completed';
    list.completedAt = new Date().toISOString();

    savePickingLists();
    updatePickingDashboard();
    
    bootstrap.Modal.getInstance(document.getElementById('pickingListDetailsModal')).hide();
    showNotification('success', `Picking list ${list.pickingListNumber} completed successfully`);
}

// Search Picking Lists
function searchPickingLists() {
    const searchTerm = document.getElementById('pickingSearchInput').value.toLowerCase();
    const filtered = pickingListSystem.pickingLists.filter(list =>
        list.pickingListNumber.toLowerCase().includes(searchTerm) ||
        list.orderId.toLowerCase().includes(searchTerm) ||
        list.customer.toLowerCase().includes(searchTerm)
    );
    displayPickingLists(filtered);
}

// Show Batch Picking Modal
function showBatchPickingModal() {
    showNotification('info', 'Batch Picking - Feature to be implemented');
}

// Show Picker Assignment
function showPickerAssignment() {
    showNotification('info', 'Picker Assignment - Feature to be implemented');
}

// Add Material Pick Item
function addMaterialPickItem() {
    showNotification('info', 'Add Material - Feature to be implemented');
}

// Export functions
window.pickingListSystem = pickingListSystem;
window.initializePickingList = initializePickingList;
window.showGeneratePickingListModal = showGeneratePickingListModal;
window.generatePickingList = generatePickingList;
window.showPickingListDetails = showPickingListDetails;
window.markItemPicked = markItemPicked;
window.startPicking = startPicking;
window.completePickingList = completePickingList;
window.searchPickingLists = searchPickingLists;
window.showBatchPickingModal = showBatchPickingModal;
window.showPickerAssignment = showPickerAssignment;
window.addMaterialPickItem = addMaterialPickItem;
