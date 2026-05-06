// Thin Sheet Material Handling System
// Specialized handling for laminates, sheets, panels, and boards

const thinSheetHandling = {
    thinSheetCategories: ['laminates', 'sheets', 'panels', 'boards'],
    handlingRules: {},
    stackingLimits: {
        'laminates': { maxHeight: 50, optimalHeight: 40 },
        'sheets': { maxHeight: 50, optimalHeight: 40 },
        'panels': { maxHeight: 30, optimalHeight: 25 },
        'boards': { maxHeight: 40, optimalHeight: 35 }
    },
    climateRequirements: {
        temperatureMin: 15,
        temperatureMax: 25,
        humidityMin: 40,
        humidityMax: 60
    },
    damageTracking: [],
    complianceScores: {}
};

// Initialize Thin Sheet Handling System
function initializeThinSheetHandling() {
    console.log('Initializing Thin Sheet Material Handling System...');
    loadHandlingRules();
    setupHandlingDashboard();
}

// Load Handling Rules
function loadHandlingRules() {
    const stored = localStorage.getItem('thinSheetHandlingRules');
    if (stored) {
        thinSheetHandling.handlingRules = JSON.parse(stored);
    }
}

// Setup Handling Dashboard
function setupHandlingDashboard() {
    const dashboardHTML = `
        <div class="thin-sheet-handling-dashboard">
            <div class="handling-header">
                <h2><i class="fas fa-layer-group"></i> Thin Sheet Material Handling</h2>
                <p class="text-muted">Specialized handling for laminates, sheets, panels, and boards</p>
            </div>

            <div class="handling-rules-section">
                <h3>Handling Requirements</h3>
                <div class="rules-grid">
                    <div class="rule-card">
                        <div class="rule-icon">📏</div>
                        <h4>Flat Storage</h4>
                        <p>Store horizontally only. No vertical or angled storage permitted.</p>
                    </div>
                    <div class="rule-card">
                        <div class="rule-icon">🛡️</div>
                        <h4>Edge Protection</h4>
                        <p>Corner guards and edge protectors required at all times.</p>
                    </div>
                    <div class="rule-card">
                        <div class="rule-icon">📊</div>
                        <h4>Stack Height</h4>
                        <p>Maximum 50 sheets per stack. Optimal: 40 sheets.</p>
                    </div>
                    <div class="rule-card">
                        <div class="rule-icon">📦</div>
                        <h4>Packaging</h4>
                        <p>Bubble wrap, cardboard separators, and plastic covering required.</p>
                    </div>
                    <div class="rule-card">
                        <div class="rule-icon">🌡️</div>
                        <h4>Climate Control</h4>
                        <p>Temperature: 15-25°C<br>Humidity: 40-60%</p>
                    </div>
                    <div class="rule-card">
                        <div class="rule-icon">🚚</div>
                        <h4>Vehicle Type</h4>
                        <p>Flat bed trucks only. No tilting permitted during transport.</p>
                    </div>
                </div>
            </div>

            <div class="handling-tools-section">
                <h3>Handling Tools</h3>
                <div class="tools-grid">
                    <button class="tool-btn" onclick="showStackingCalculator()">
                        <i class="fas fa-calculator"></i>
                        Stacking Calculator
                    </button>
                    <button class="tool-btn" onclick="showClimateMonitor()">
                        <i class="fas fa-thermometer-half"></i>
                        Climate Monitor
                    </button>
                    <button class="tool-btn" onclick="showHandlingChecklist()">
                        <i class="fas fa-tasks"></i>
                        Handling Checklist
                    </button>
                    <button class="tool-btn" onclick="showDamageTracker()">
                        <i class="fas fa-exclamation-triangle"></i>
                        Damage Tracker
                    </button>
                    <button class="tool-btn" onclick="showVehicleChecker()">
                        <i class="fas fa-truck"></i>
                        Vehicle Suitability
                    </button>
                    <button class="tool-btn" onclick="showComplianceScore()">
                        <i class="fas fa-chart-line"></i>
                        Compliance Score
                    </button>
                </div>
            </div>

            <div class="handling-stats-section">
                <h3>Handling Statistics</h3>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value" id="thinSheetMaterialsCount">0</div>
                        <div class="stat-label">Thin Sheet Materials</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="damageIncidentsCount">0</div>
                        <div class="stat-label">Damage Incidents</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="complianceRateValue">100%</div>
                        <div class="stat-label">Compliance Rate</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="climateAlertsCount">0</div>
                        <div class="stat-label">Climate Alerts</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        const handlingSection = document.createElement('div');
        handlingSection.id = 'thinSheetHandlingSection';
        handlingSection.className = 'content-section';
        handlingSection.style.display = 'none';
        handlingSection.innerHTML = dashboardHTML;
        mainContent.appendChild(handlingSection);
    }
}

// Identify Thin Sheet Material
function identifyThinSheetMaterial(materialCategory) {
    return thinSheetHandling.thinSheetCategories.includes(materialCategory.toLowerCase());
}

// Calculate Optimal Stack Height
function calculateOptimalStackHeight(materialType, thickness, weight) {
    const limits = thinSheetHandling.stackingLimits[materialType.toLowerCase()] || 
                   { maxHeight: 50, optimalHeight: 40 };
    
    // Adjust based on thickness and weight
    let adjustedOptimal = limits.optimalHeight;
    if (thickness > 2) adjustedOptimal = Math.floor(adjustedOptimal * 0.8);
    if (weight > 10) adjustedOptimal = Math.floor(adjustedOptimal * 0.9);
    
    return {
        optimal: adjustedOptimal,
        maximum: limits.maxHeight,
        current: 0
    };
}

// Show Stacking Calculator
function showStackingCalculator() {
    const modalHTML = `
        <div class="modal fade" id="stackingCalculatorModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-calculator"></i> Stacking Height Calculator
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="stackingCalculatorForm">
                            <div class="mb-3">
                                <label class="form-label">Material Type</label>
                                <select class="form-select" id="stackMaterialType" required>
                                    <option value="">Select type...</option>
                                    <option value="laminates">Laminates</option>
                                    <option value="sheets">Sheets</option>
                                    <option value="panels">Panels</option>
                                    <option value="boards">Boards</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Thickness (mm)</label>
                                <input type="number" class="form-control" id="stackThickness" 
                                       min="0.5" max="10" step="0.1" value="1" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Weight per Sheet (kg)</label>
                                <input type="number" class="form-control" id="stackWeight" 
                                       min="1" max="50" step="0.5" value="5" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Current Stack Height</label>
                                <input type="number" class="form-control" id="stackCurrent" 
                                       min="0" max="100" value="0" required>
                            </div>
                        </form>
                        <div id="stackingResults" class="mt-4"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="calculateStacking()">
                            Calculate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('stackingCalculatorModal'));
    modal.show();
}

// Calculate Stacking
function calculateStacking() {
    const type = document.getElementById('stackMaterialType').value;
    const thickness = parseFloat(document.getElementById('stackThickness').value);
    const weight = parseFloat(document.getElementById('stackWeight').value);
    const current = parseInt(document.getElementById('stackCurrent').value);

    const result = calculateOptimalStackHeight(type, thickness, weight);
    const totalWeight = current * weight;
    const status = current <= result.optimal ? 'success' : 
                   current <= result.maximum ? 'warning' : 'danger';

    const resultsHTML = `
        <div class="alert alert-${status}">
            <h6>Stacking Analysis</h6>
            <table class="table table-sm mb-0">
                <tr>
                    <td><strong>Optimal Height:</strong></td>
                    <td>${result.optimal} sheets</td>
                </tr>
                <tr>
                    <td><strong>Maximum Height:</strong></td>
                    <td>${result.maximum} sheets</td>
                </tr>
                <tr>
                    <td><strong>Current Height:</strong></td>
                    <td>${current} sheets</td>
                </tr>
                <tr>
                    <td><strong>Total Weight:</strong></td>
                    <td>${totalWeight.toFixed(2)} kg</td>
                </tr>
                <tr>
                    <td><strong>Status:</strong></td>
                    <td>
                        ${current <= result.optimal ? '✅ Within optimal range' :
                          current <= result.maximum ? '⚠️ Approaching maximum' :
                          '❌ Exceeds maximum - UNSAFE'}
                    </td>
                </tr>
            </table>
        </div>
    `;

    document.getElementById('stackingResults').innerHTML = resultsHTML;
}

// Show Climate Monitor
function showClimateMonitor() {
    const modalHTML = `
        <div class="modal fade" id="climateMonitorModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-thermometer-half"></i> Climate Monitor
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="climate-requirements mb-4">
                            <h6>Required Conditions</h6>
                            <div class="alert alert-info">
                                <strong>Temperature:</strong> 15-25°C<br>
                                <strong>Humidity:</strong> 40-60%
                            </div>
                        </div>

                        <div class="climate-current">
                            <h6>Current Conditions</h6>
                            <div class="mb-3">
                                <label class="form-label">Temperature (°C)</label>
                                <input type="number" class="form-control" id="currentTemp" 
                                       value="22" min="0" max="50">
                                <div id="tempStatus" class="mt-2"></div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Humidity (%)</label>
                                <input type="number" class="form-control" id="currentHumidity" 
                                       value="50" min="0" max="100">
                                <div id="humidityStatus" class="mt-2"></div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="checkClimate()">
                            Check Conditions
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('climateMonitorModal'));
    modal.show();
}

// Check Climate
function checkClimate() {
    const temp = parseFloat(document.getElementById('currentTemp').value);
    const humidity = parseFloat(document.getElementById('currentHumidity').value);

    const tempOK = temp >= thinSheetHandling.climateRequirements.temperatureMin && 
                   temp <= thinSheetHandling.climateRequirements.temperatureMax;
    const humidityOK = humidity >= thinSheetHandling.climateRequirements.humidityMin && 
                       humidity <= thinSheetHandling.climateRequirements.humidityMax;

    document.getElementById('tempStatus').innerHTML = tempOK ?
        '<span class="text-success">✅ Temperature within acceptable range</span>' :
        '<span class="text-danger">❌ Temperature out of range - Adjust climate control</span>';

    document.getElementById('humidityStatus').innerHTML = humidityOK ?
        '<span class="text-success">✅ Humidity within acceptable range</span>' :
        '<span class="text-danger">❌ Humidity out of range - Adjust climate control</span>';
}

// Show Handling Checklist
function showHandlingChecklist() {
    const checklist = [
        'Verify material is thin sheet type (laminate/sheet/panel/board)',
        'Ensure flat horizontal storage surface is prepared',
        'Apply edge protection and corner guards',
        'Place cardboard separators between sheets',
        'Cover with protective plastic',
        'Verify stack height does not exceed 50 sheets',
        'Check climate control (15-25°C, 40-60% humidity)',
        'Use soft straps for securing (no metal contact)',
        'Confirm vehicle has flat bed (no tilting capability)',
        'Document handling with photos'
    ];

    const modalHTML = `
        <div class="modal fade" id="handlingChecklistModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-tasks"></i> Handling Checklist
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p class="text-muted">Complete all steps before handling thin sheet materials:</p>
                        <div class="checklist">
                            ${checklist.map((item, index) => `
                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="checkbox" id="check${index}">
                                    <label class="form-check-label" for="check${index}">
                                        ${item}
                                    </label>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-success" onclick="confirmChecklist()">
                            Confirm Completion
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('handlingChecklistModal'));
    modal.show();
}

// Confirm Checklist
function confirmChecklist() {
    const checkboxes = document.querySelectorAll('#handlingChecklistModal input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);

    if (allChecked) {
        showNotification('success', 'Handling checklist completed successfully');
        bootstrap.Modal.getInstance(document.getElementById('handlingChecklistModal')).hide();
    } else {
        showNotification('warning', 'Please complete all checklist items');
    }
}

// Show Damage Tracker
function showDamageTracker() {
    showNotification('info', 'Damage Tracker - Feature to be implemented');
}

// Show Vehicle Checker
function showVehicleChecker() {
    showNotification('info', 'Vehicle Suitability Checker - Feature to be implemented');
}

// Show Compliance Score
function showComplianceScore() {
    showNotification('info', 'Compliance Score Dashboard - Feature to be implemented');
}

// Export functions
window.thinSheetHandling = thinSheetHandling;
window.initializeThinSheetHandling = initializeThinSheetHandling;
window.identifyThinSheetMaterial = identifyThinSheetMaterial;
window.calculateOptimalStackHeight = calculateOptimalStackHeight;
window.showStackingCalculator = showStackingCalculator;
window.calculateStacking = calculateStacking;
window.showClimateMonitor = showClimateMonitor;
window.checkClimate = checkClimate;
window.showHandlingChecklist = showHandlingChecklist;
window.confirmChecklist = confirmChecklist;
window.showDamageTracker = showDamageTracker;
window.showVehicleChecker = showVehicleChecker;
window.showComplianceScore = showComplianceScore;
