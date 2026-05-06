// Location-Based Storage Management System
// Centralized storage with hierarchical location tracking

const locationStorage = {
    locationHierarchy: {
        warehouses: [],
        zones: [],
        aisles: [],
        racks: [],
        levels: [],
        bins: []
    },
    locationCodes: {},
    materialLocations: {},
    capacityTracking: {},
    warehouseMaps: {},
    locationHistory: [],
    heatMaps: {}
};

// Initialize Location Storage System
function initializeLocationStorage() {
    console.log('Initializing Location-Based Storage System...');
    loadLocationData();
    setupLocationDashboard();
    initializeSampleLocations();
}

// Load Location Data
function loadLocationData() {
    const stored = localStorage.getItem('locationStorageData');
    if (stored) {
        Object.assign(locationStorage, JSON.parse(stored));
    }
}

// Save Location Data
function saveLocationData() {
    localStorage.setItem('locationStorageData', JSON.stringify(locationStorage));
}

// Initialize Sample Locations
function initializeSampleLocations() {
    if (locationStorage.locationHierarchy.warehouses.length === 0) {
        // Create sample warehouse structure
        const warehouse = {
            id: 'WH001',
            code: 'WH01',
            name: 'Chennai Main Warehouse',
            zones: ['A', 'B', 'C']
        };
        
        locationStorage.locationHierarchy.warehouses.push(warehouse);
        
        // Create sample locations
        for (let zone of ['A', 'B']) {
            for (let aisle = 1; aisle <= 10; aisle++) {
                for (let rack = 1; rack <= 5; rack++) {
                    for (let level = 1; level <= 4; level++) {
                        for (let bin = 1; bin <= 12; bin++) {
                            const locationCode = generateLocationCode(
                                'WH01', zone, aisle.toString().padStart(2, '0'),
                                `R${rack}`, `L${level}`, `B${bin.toString().padStart(2, '0')}`
                            );
                            
                            locationStorage.locationCodes[locationCode] = {
                                warehouse: 'WH01',
                                zone: zone,
                                aisle: aisle.toString().padStart(2, '0'),
                                rack: `R${rack}`,
                                level: `L${level}`,
                                bin: `B${bin.toString().padStart(2, '0')}`,
                                capacity: 500,
                                occupied: 0,
                                status: 'available'
                            };
                        }
                    }
                }
            }
        }
        
        saveLocationData();
    }
}

// Setup Location Dashboard
function setupLocationDashboard() {
    const dashboardHTML = `
        <div class="location-storage-dashboard">
            <div class="location-header">
                <h2><i class="fas fa-warehouse"></i> Location-Based Storage Management</h2>
                <p class="text-muted">Hierarchical storage tracking: Warehouse → Zone → Aisle → Rack → Level → Bin</p>
            </div>

            <div class="location-stats">
                <div class="stat-card">
                    <div class="stat-value" id="totalLocationsCount">0</div>
                    <div class="stat-label">Total Locations</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" id="occupiedLocationsCount">0</div>
                    <div class="stat-label">Occupied</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" id="availableLocationsCount">0</div>
                    <div class="stat-label">Available</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" id="capacityUtilizationPercent">0%</div>
                    <div class="stat-label">Capacity Utilization</div>
                </div>
            </div>

            <div class="location-tools">
                <div class="tool-buttons">
                    <button class="btn btn-primary" onclick="showLocationSearch()">
                        <i class="fas fa-search"></i> Find Material
                    </button>
                    <button class="btn btn-success" onclick="showOptimalLocationFinder()">
                        <i class="fas fa-map-marked-alt"></i> Find Optimal Location
                    </button>
                    <button class="btn btn-info" onclick="showWarehouseMap()">
                        <i class="fas fa-map"></i> Warehouse Map
                    </button>
                    <button class="btn btn-warning" onclick="showHeatMap()">
                        <i class="fas fa-fire"></i> Heat Map
                    </button>
                </div>
            </div>

            <div class="location-browser">
                <h3>Location Browser</h3>
                <div class="location-hierarchy">
                    <div class="hierarchy-level">
                        <label>Warehouse</label>
                        <select class="form-select" id="selectWarehouse" onchange="updateZones()">
                            <option value="">Select warehouse...</option>
                        </select>
                    </div>
                    <div class="hierarchy-level">
                        <label>Zone</label>
                        <select class="form-select" id="selectZone" onchange="updateAisles()">
                            <option value="">Select zone...</option>
                        </select>
                    </div>
                    <div class="hierarchy-level">
                        <label>Aisle</label>
                        <select class="form-select" id="selectAisle" onchange="updateRacks()">
                            <option value="">Select aisle...</option>
                        </select>
                    </div>
                    <div class="hierarchy-level">
                        <label>Rack</label>
                        <select class="form-select" id="selectRack" onchange="updateLevels()">
                            <option value="">Select rack...</option>
                        </select>
                    </div>
                    <div class="hierarchy-level">
                        <label>Level</label>
                        <select class="form-select" id="selectLevel" onchange="updateBins()">
                            <option value="">Select level...</option>
                        </select>
                    </div>
                    <div class="hierarchy-level">
                        <label>Bin</label>
                        <select class="form-select" id="selectBin" onchange="showLocationDetails()">
                            <option value="">Select bin...</option>
                        </select>
                    </div>
                </div>
                <div id="locationDetailsContainer" class="mt-4"></div>
            </div>
        </div>
    `;

    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        const locationSection = document.createElement('div');
        locationSection.id = 'locationStorageSection';
        locationSection.className = 'content-section';
        locationSection.style.display = 'none';
        locationSection.innerHTML = dashboardHTML;
        mainContent.appendChild(locationSection);
    }

    updateLocationStats();
    populateWarehouseSelect();
}

// Generate Location Code
function generateLocationCode(warehouse, zone, aisle, rack, level, bin) {
    return `${warehouse}-${zone}-${aisle}-${rack}-${level}-${bin}`;
}

// Parse Location Code
function parseLocationCode(locationCode) {
    const parts = locationCode.split('-');
    return {
        warehouse: parts[0],
        zone: parts[1],
        aisle: parts[2],
        rack: parts[3],
        level: parts[4],
        bin: parts[5]
    };
}

// Update Location Stats
function updateLocationStats() {
    const totalLocations = Object.keys(locationStorage.locationCodes).length;
    const occupiedLocations = Object.values(locationStorage.locationCodes)
        .filter(loc => loc.occupied > 0).length;
    const availableLocations = totalLocations - occupiedLocations;
    const utilization = totalLocations > 0 ? 
        ((occupiedLocations / totalLocations) * 100).toFixed(1) : 0;

    document.getElementById('totalLocationsCount').textContent = totalLocations;
    document.getElementById('occupiedLocationsCount').textContent = occupiedLocations;
    document.getElementById('availableLocationsCount').textContent = availableLocations;
    document.getElementById('capacityUtilizationPercent').textContent = utilization + '%';
}

// Populate Warehouse Select
function populateWarehouseSelect() {
    const select = document.getElementById('selectWarehouse');
    if (!select) return;

    select.innerHTML = '<option value="">Select warehouse...</option>';
    locationStorage.locationHierarchy.warehouses.forEach(wh => {
        select.innerHTML += `<option value="${wh.code}">${wh.name}</option>`;
    });
}

// Update Zones
function updateZones() {
    const warehouse = document.getElementById('selectWarehouse').value;
    const select = document.getElementById('selectZone');
    
    select.innerHTML = '<option value="">Select zone...</option>';
    
    if (warehouse) {
        const wh = locationStorage.locationHierarchy.warehouses.find(w => w.code === warehouse);
        if (wh && wh.zones) {
            wh.zones.forEach(zone => {
                select.innerHTML += `<option value="${zone}">Zone ${zone}</option>`;
            });
        }
    }
}

// Update Aisles
function updateAisles() {
    const zone = document.getElementById('selectZone').value;
    const select = document.getElementById('selectAisle');
    
    select.innerHTML = '<option value="">Select aisle...</option>';
    
    if (zone) {
        for (let i = 1; i <= 10; i++) {
            const aisle = i.toString().padStart(2, '0');
            select.innerHTML += `<option value="${aisle}">Aisle ${aisle}</option>`;
        }
    }
}

// Update Racks
function updateRacks() {
    const aisle = document.getElementById('selectAisle').value;
    const select = document.getElementById('selectRack');
    
    select.innerHTML = '<option value="">Select rack...</option>';
    
    if (aisle) {
        for (let i = 1; i <= 5; i++) {
            select.innerHTML += `<option value="R${i}">Rack ${i}</option>`;
        }
    }
}

// Update Levels
function updateLevels() {
    const rack = document.getElementById('selectRack').value;
    const select = document.getElementById('selectLevel');
    
    select.innerHTML = '<option value="">Select level...</option>';
    
    if (rack) {
        for (let i = 1; i <= 4; i++) {
            select.innerHTML += `<option value="L${i}">Level ${i}</option>`;
        }
    }
}

// Update Bins
function updateBins() {
    const level = document.getElementById('selectLevel').value;
    const select = document.getElementById('selectBin');
    
    select.innerHTML = '<option value="">Select bin...</option>';
    
    if (level) {
        for (let i = 1; i <= 12; i++) {
            const bin = i.toString().padStart(2, '0');
            select.innerHTML += `<option value="B${bin}">Bin ${bin}</option>`;
        }
    }
}

// Show Location Details
function showLocationDetails() {
    const warehouse = document.getElementById('selectWarehouse').value;
    const zone = document.getElementById('selectZone').value;
    const aisle = document.getElementById('selectAisle').value;
    const rack = document.getElementById('selectRack').value;
    const level = document.getElementById('selectLevel').value;
    const bin = document.getElementById('selectBin').value;

    if (!warehouse || !zone || !aisle || !rack || !level || !bin) return;

    const locationCode = generateLocationCode(warehouse, zone, aisle, rack, level, bin);
    const location = locationStorage.locationCodes[locationCode];

    if (!location) return;

    const detailsHTML = `
        <div class="location-details-card">
            <h4>Location Details</h4>
            <div class="location-code-display">
                <strong>Location Code:</strong> 
                <span class="badge bg-primary">${locationCode}</span>
            </div>
            <table class="table table-sm mt-3">
                <tr>
                    <td><strong>Warehouse:</strong></td>
                    <td>${warehouse}</td>
                </tr>
                <tr>
                    <td><strong>Zone:</strong></td>
                    <td>${zone}</td>
                </tr>
                <tr>
                    <td><strong>Aisle:</strong></td>
                    <td>${aisle}</td>
                </tr>
                <tr>
                    <td><strong>Rack:</strong></td>
                    <td>${rack}</td>
                </tr>
                <tr>
                    <td><strong>Level:</strong></td>
                    <td>${level}</td>
                </tr>
                <tr>
                    <td><strong>Bin:</strong></td>
                    <td>${bin}</td>
                </tr>
                <tr>
                    <td><strong>Capacity:</strong></td>
                    <td>${location.capacity} units</td>
                </tr>
                <tr>
                    <td><strong>Occupied:</strong></td>
                    <td>${location.occupied} units</td>
                </tr>
                <tr>
                    <td><strong>Available:</strong></td>
                    <td>${location.capacity - location.occupied} units</td>
                </tr>
                <tr>
                    <td><strong>Status:</strong></td>
                    <td>
                        <span class="badge bg-${location.status === 'available' ? 'success' : 'warning'}">
                            ${location.status}
                        </span>
                    </td>
                </tr>
            </table>
            <div class="location-actions mt-3">
                <button class="btn btn-sm btn-primary" onclick="navigateToLocation('${locationCode}')">
                    <i class="fas fa-directions"></i> Navigate Here
                </button>
                <button class="btn btn-sm btn-info" onclick="showLocationHistory('${locationCode}')">
                    <i class="fas fa-history"></i> View History
                </button>
            </div>
        </div>
    `;

    document.getElementById('locationDetailsContainer').innerHTML = detailsHTML;
}

// Show Location Search
function showLocationSearch() {
    const modalHTML = `
        <div class="modal fade" id="locationSearchModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-search"></i> Find Material Location
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Material Code or Name</label>
                            <input type="text" class="form-control" id="materialSearchInput" 
                                   placeholder="Enter material code or name...">
                        </div>
                        <div id="searchResults"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="searchMaterialLocation()">
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('locationSearchModal'));
    modal.show();
}

// Search Material Location
function searchMaterialLocation() {
    const searchTerm = document.getElementById('materialSearchInput').value;
    
    // Placeholder - in production, search actual material locations
    const resultsHTML = `
        <div class="alert alert-info">
            <strong>Search Results for "${searchTerm}"</strong>
            <p class="mb-0">Material location search - to be integrated with material master data</p>
        </div>
    `;
    
    document.getElementById('searchResults').innerHTML = resultsHTML;
}

// Show Optimal Location Finder
function showOptimalLocationFinder() {
    showNotification('info', 'Optimal Location Finder - Feature to be implemented');
}

// Show Warehouse Map
function showWarehouseMap() {
    showNotification('info', 'Warehouse Map Visualization - Feature to be implemented');
}

// Show Heat Map
function showHeatMap() {
    showNotification('info', 'Location Heat Map - Feature to be implemented');
}

// Navigate to Location
function navigateToLocation(locationCode) {
    const location = parseLocationCode(locationCode);
    const directions = [
        `1. Enter warehouse through main entrance`,
        `2. Turn right into Zone ${location.zone}`,
        `3. Walk straight to Aisle ${location.aisle}`,
        `4. Locate ${location.rack} on the left`,
        `5. Access ${location.level} (height marker visible)`,
        `6. Find ${location.bin}`
    ];

    const modalHTML = `
        <div class="modal fade" id="navigationModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-directions"></i> Navigation to ${locationCode}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="navigation-steps">
                            ${directions.map(dir => `
                                <div class="nav-step">
                                    <i class="fas fa-arrow-right"></i> ${dir}
                                </div>
                            `).join('')}
                        </div>
                        <div class="alert alert-success mt-3">
                            <strong>Estimated Time:</strong> 3 minutes<br>
                            <strong>Distance:</strong> 45 meters
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('navigationModal'));
    modal.show();
}

// Show Location History
function showLocationHistory(locationCode) {
    showNotification('info', `Location History for ${locationCode} - Feature to be implemented`);
}

// Export functions
window.locationStorage = locationStorage;
window.initializeLocationStorage = initializeLocationStorage;
window.generateLocationCode = generateLocationCode;
window.parseLocationCode = parseLocationCode;
window.updateZones = updateZones;
window.updateAisles = updateAisles;
window.updateRacks = updateRacks;
window.updateLevels = updateLevels;
window.updateBins = updateBins;
window.showLocationDetails = showLocationDetails;
window.showLocationSearch = showLocationSearch;
window.searchMaterialLocation = searchMaterialLocation;
window.showOptimalLocationFinder = showOptimalLocationFinder;
window.showWarehouseMap = showWarehouseMap;
window.showHeatMap = showHeatMap;
window.navigateToLocation = navigateToLocation;
window.showLocationHistory = showLocationHistory;
