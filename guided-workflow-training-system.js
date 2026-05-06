// ========================================
// GUIDED WORKFLOW & TRAINING SYSTEM
// Eliminates dependency on experienced staff
// Enables new employees to operate independently
// ========================================

// Global workflow configuration
const workflowConfig = {
    guidedMode: true,
    showTooltips: true,
    showTutorials: true,
    stepByStepMode: true,
    validationEnabled: true,
    autoSave: true,
    contextHelp: true
};

// User progress tracking
let userProgress = {
    completedTutorials: [],
    completedWorkflows: [],
    currentLevel: 'beginner', // beginner, intermediate, advanced
    totalTasksCompleted: 0,
    lastActivity: null,
    needsHelp: false
};

// Standardized workflows
const standardWorkflows = {
    createOrder: {
        id: 'create-order',
        name: 'Create New Order',
        description: 'Step-by-step process to create a new delivery order',
        difficulty: 'beginner',
        estimatedTime: '5 minutes',
        steps: [
            {
                step: 1,
                title: 'Customer Information',
                description: 'Enter customer details',
                fields: ['customerName', 'customerPhone', 'customerEmail'],
                validation: {
                    customerName: { required: true, minLength: 3 },
                    customerPhone: { required: true, pattern: /^[0-9]{10}$/ },
                    customerEmail: { required: false, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
                },
                help: 'Enter the customer name and contact information. Phone number must be 10 digits.',
                tips: [
                    'Use existing customer from dropdown if available',
                    'Phone number format: 9876543210 (no spaces or dashes)',
                    'Email is optional but recommended for notifications'
                ]
            },
            {
                step: 2,
                title: 'Pickup & Delivery Locations',
                description: 'Specify pickup and delivery addresses',
                fields: ['pickupLocation', 'deliveryLocation'],
                validation: {
                    pickupLocation: { required: true, minLength: 5 },
                    deliveryLocation: { required: true, minLength: 5 }
                },
                help: 'Select warehouse for pickup and enter delivery address',
                tips: [
                    'Pickup location should be one of our warehouses',
                    'Delivery address should include city and pincode',
                    'Use full address for accurate route calculation'
                ]
            },
            {
                step: 3,
                title: 'Material Details',
                description: 'Select material and quantity',
                fields: ['material', 'quantity', 'unit'],
                validation: {
                    material: { required: true },
                    quantity: { required: true, min: 1 },
                    unit: { required: true }
                },
                help: 'Choose the material to be delivered and specify quantity',
                tips: [
                    'Check material availability before ordering',
                    'Quantity must be greater than 0',
                    'Unit will be auto-filled based on material type'
                ]
            },
            {
                step: 4,
                title: 'Priority & Special Instructions',
                description: 'Set delivery priority and add notes',
                fields: ['priority', 'specialInstructions'],
                validation: {
                    priority: { required: true },
                    specialInstructions: { required: false, maxLength: 500 }
                },
                help: 'Set priority level and add any special delivery instructions',
                tips: [
                    'Urgent orders are processed immediately',
                    'High priority orders within 24 hours',
                    'Normal orders within 48 hours',
                    'Special instructions help driver with delivery'
                ]
            },
            {
                step: 5,
                title: 'Review & Submit',
                description: 'Review all details before submitting',
                fields: [],
                validation: {},
                help: 'Review all entered information and submit the order',
                tips: [
                    'Double-check customer contact information',
                    'Verify pickup and delivery addresses',
                    'Confirm material and quantity',
                    'You can edit any field before submitting'
                ]
            }
        ]
    },
    
    assignVehicle: {
        id: 'assign-vehicle',
        name: 'Assign Vehicle & Driver',
        description: 'Assign vehicle and driver to an order',
        difficulty: 'beginner',
        estimatedTime: '3 minutes',
        steps: [
            {
                step: 1,
                title: 'Select Order',
                description: 'Choose the order to assign',
                help: 'Select a pending order from the list',
                tips: [
                    'Urgent orders should be assigned first',
                    'Check order details before assigning',
                    'Ensure material is available'
                ]
            },
            {
                step: 2,
                title: 'Choose Vehicle',
                description: 'Select appropriate vehicle',
                help: 'Choose a vehicle based on capacity and availability',
                tips: [
                    'Match vehicle capacity with order quantity',
                    'Check vehicle availability status',
                    'Consider vehicle location for efficiency'
                ]
            },
            {
                step: 3,
                title: 'Assign Driver',
                description: 'Select available driver',
                help: 'Choose a driver with appropriate license',
                tips: [
                    'Check driver availability',
                    'Verify license type matches vehicle',
                    'Consider driver experience for urgent orders'
                ]
            },
            {
                step: 4,
                title: 'Confirm Assignment',
                description: 'Review and confirm assignment',
                help: 'Verify all details before confirming',
                tips: [
                    'Ensure vehicle and driver are compatible',
                    'Check estimated delivery time',
                    'Confirm route is optimal'
                ]
            }
        ]
    },
    
    physicalCount: {
        id: 'physical-count',
        name: 'Physical Inventory Count',
        description: 'Perform physical count and reconcile inventory',
        difficulty: 'beginner',
        estimatedTime: '2 minutes per item',
        steps: [
            {
                step: 1,
                title: 'Scan Material',
                description: 'Scan barcode or enter material code',
                help: 'Use barcode scanner or manually enter material code',
                tips: [
                    'Barcode scanning is faster and more accurate',
                    'Ensure good lighting for scanning',
                    'Material code is printed on label'
                ]
            },
            {
                step: 2,
                title: 'Count Physical Stock',
                description: 'Count actual units in warehouse',
                help: 'Count all units of this material physically',
                tips: [
                    'Count carefully to avoid errors',
                    'Check all storage locations',
                    'Include items in receiving area',
                    'Exclude damaged items'
                ]
            },
            {
                step: 3,
                title: 'Enter Count',
                description: 'Enter the physical count',
                help: 'Type the number of units counted',
                tips: [
                    'Double-check your count before entering',
                    'System will show current system stock',
                    'Any difference will be highlighted'
                ]
            },
            {
                step: 4,
                title: 'Review Discrepancy',
                description: 'Check if count matches system',
                help: 'System will show any difference between physical and system stock',
                tips: [
                    'Small differences (1-2 units) are common',
                    'Large differences need investigation',
                    'Add notes explaining any discrepancy'
                ]
            },
            {
                step: 5,
                title: 'Reconcile',
                description: 'Approve reconciliation if needed',
                help: 'Update system stock to match physical count',
                tips: [
                    'Only reconcile after verifying count',
                    'Document reason for discrepancy',
                    'Manager approval needed for large differences'
                ]
            }
        ]
    }
};

// ========================================
// 1. GUIDED WORKFLOW ENGINE
// ========================================

let currentWorkflow = null;
let currentStep = 0;
let workflowData = {};

function startGuidedWorkflow(workflowId) {
    const workflow = standardWorkflows[workflowId];
    if (!workflow) {
        showNotification('Workflow not found', 'error');
        return;
    }
    
    currentWorkflow = workflow;
    currentStep = 0;
    workflowData = {};
    
    console.log(`🎯 Starting guided workflow: ${workflow.name}`);
    
    // Show workflow modal
    showWorkflowModal();
    
    // Track user progress
    userProgress.lastActivity = new Date();
    
    showNotification(`📚 Starting: ${workflow.name}`, 'info');
}

function showWorkflowModal() {
    const workflow = currentWorkflow;
    const step = workflow.steps[currentStep];
    
    const modalHTML = `
        <div class="modal fade" id="guidedWorkflowModal" tabindex="-1" data-bs-backdrop="static">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <div class="w-100">
                            <h5 class="modal-title">
                                <i class="fas fa-route"></i> ${workflow.name}
                                <span class="badge bg-light text-dark ms-2">${workflow.difficulty}</span>
                            </h5>
                            <small>${workflow.description}</small>
                        </div>
                        <button type="button" class="btn-close btn-close-white" onclick="exitWorkflow()"></button>
                    </div>
                    
                    <div class="modal-body">
                        <!-- Progress Bar -->
                        <div class="mb-4">
                            <div class="d-flex justify-content-between mb-2">
                                <span><strong>Progress:</strong> Step ${currentStep + 1} of ${workflow.steps.length}</span>
                                <span><i class="fas fa-clock"></i> Est. Time: ${workflow.estimatedTime}</span>
                            </div>
                            <div class="progress" style="height: 25px;">
                                <div class="progress-bar bg-success" style="width: ${((currentStep + 1) / workflow.steps.length) * 100}%">
                                    ${Math.round(((currentStep + 1) / workflow.steps.length) * 100)}%
                                </div>
                            </div>
                        </div>
                        
                        <!-- Step Navigation -->
                        <div class="row mb-3">
                            <div class="col-12">
                                <div class="btn-group w-100" role="group">
                                    ${workflow.steps.map((s, i) => `
                                        <button type="button" class="btn ${i === currentStep ? 'btn-primary' : i < currentStep ? 'btn-success' : 'btn-outline-secondary'}" 
                                                ${i > currentStep ? 'disabled' : ''} 
                                                onclick="goToStep(${i})">
                                            ${i < currentStep ? '<i class="fas fa-check"></i>' : ''} 
                                            ${i + 1}
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        
                        <!-- Current Step Content -->
                        <div class="card border-primary">
                            <div class="card-header bg-primary text-white">
                                <h5 class="mb-0">
                                    <i class="fas fa-arrow-right"></i> Step ${step.step}: ${step.title}
                                </h5>
                            </div>
                            <div class="card-body">
                                <p class="lead">${step.description}</p>
                                
                                <!-- Help Section -->
                                <div class="alert alert-info">
                                    <h6><i class="fas fa-info-circle"></i> Help</h6>
                                    <p class="mb-0">${step.help}</p>
                                </div>
                                
                                <!-- Tips Section -->
                                ${step.tips && step.tips.length > 0 ? `
                                    <div class="alert alert-success">
                                        <h6><i class="fas fa-lightbulb"></i> Tips</h6>
                                        <ul class="mb-0">
                                            ${step.tips.map(tip => `<li>${tip}</li>`).join('')}
                                        </ul>
                                    </div>
                                ` : ''}
                                
                                <!-- Form Fields -->
                                <div id="stepFormFields">
                                    ${renderStepFields(step)}
                                </div>
                                
                                <!-- Video Tutorial Link -->
                                <div class="mt-3">
                                    <button class="btn btn-outline-info btn-sm" onclick="showVideoTutorial('${workflow.id}', ${step.step})">
                                        <i class="fas fa-video"></i> Watch Video Tutorial
                                    </button>
                                    <button class="btn btn-outline-secondary btn-sm" onclick="showDetailedHelp('${workflow.id}', ${step.step})">
                                        <i class="fas fa-question-circle"></i> Detailed Help
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="exitWorkflow()">
                            <i class="fas fa-times"></i> Exit
                        </button>
                        ${currentStep > 0 ? `
                            <button type="button" class="btn btn-outline-primary" onclick="previousStep()">
                                <i class="fas fa-arrow-left"></i> Previous
                            </button>
                        ` : ''}
                        <button type="button" class="btn btn-primary" onclick="nextStep()">
                            ${currentStep === workflow.steps.length - 1 ? '<i class="fas fa-check"></i> Complete' : '<i class="fas fa-arrow-right"></i> Next'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal
    const existingModal = document.getElementById('guidedWorkflowModal');
    if (existingModal) existingModal.remove();
    
    // Add and show modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('guidedWorkflowModal'));
    modal.show();
}

function renderStepFields(step) {
    if (!step.fields || step.fields.length === 0) {
        return '<p class="text-muted">No input required for this step. Review the information and click Next.</p>';
    }
    
    let html = '<div class="row">';
    
    step.fields.forEach(fieldName => {
        const validation = step.validation[fieldName] || {};
        const value = workflowData[fieldName] || '';
        
        html += `
            <div class="col-md-6 mb-3">
                <label class="form-label">
                    ${formatFieldName(fieldName)}
                    ${validation.required ? '<span class="text-danger">*</span>' : ''}
                </label>
                ${renderFieldInput(fieldName, validation, value)}
                ${validation.required ? '<small class="text-muted">Required field</small>' : ''}
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function renderFieldInput(fieldName, validation, value) {
    // Render appropriate input based on field name
    if (fieldName === 'material') {
        return `
            <select class="form-control" id="field_${fieldName}" ${validation.required ? 'required' : ''}>
                <option value="">Select Material</option>
                ${sampleData.materials.map(m => `
                    <option value="${m.code}" ${value === m.code ? 'selected' : ''}>
                        ${m.code} - ${m.name} (${m.currentStock} ${m.unit} available)
                    </option>
                `).join('')}
            </select>
        `;
    } else if (fieldName === 'priority') {
        return `
            <select class="form-control" id="field_${fieldName}" ${validation.required ? 'required' : ''}>
                <option value="">Select Priority</option>
                <option value="urgent" ${value === 'urgent' ? 'selected' : ''}>Urgent</option>
                <option value="high" ${value === 'high' ? 'selected' : ''}>High</option>
                <option value="normal" ${value === 'normal' ? 'selected' : ''}>Normal</option>
            </select>
        `;
    } else if (fieldName === 'pickupLocation') {
        return `
            <select class="form-control" id="field_${fieldName}" ${validation.required ? 'required' : ''}>
                <option value="">Select Warehouse</option>
                <option value="Chennai Main Warehouse" ${value === 'Chennai Main Warehouse' ? 'selected' : ''}>Chennai Main Warehouse</option>
                <option value="Bangalore Hub" ${value === 'Bangalore Hub' ? 'selected' : ''}>Bangalore Hub</option>
                <option value="Coimbatore Depot" ${value === 'Coimbatore Depot' ? 'selected' : ''}>Coimbatore Depot</option>
            </select>
        `;
    } else if (fieldName === 'specialInstructions') {
        return `
            <textarea class="form-control" id="field_${fieldName}" rows="3" 
                      ${validation.required ? 'required' : ''}
                      ${validation.maxLength ? `maxlength="${validation.maxLength}"` : ''}
                      placeholder="Enter any special instructions...">${value}</textarea>
        `;
    } else if (fieldName === 'quantity') {
        return `
            <input type="number" class="form-control" id="field_${fieldName}" 
                   value="${value}" 
                   ${validation.required ? 'required' : ''}
                   ${validation.min ? `min="${validation.min}"` : ''}
                   ${validation.max ? `max="${validation.max}"` : ''}
                   placeholder="Enter quantity">
        `;
    } else {
        return `
            <input type="text" class="form-control" id="field_${fieldName}" 
                   value="${value}" 
                   ${validation.required ? 'required' : ''}
                   ${validation.minLength ? `minlength="${validation.minLength}"` : ''}
                   ${validation.maxLength ? `maxlength="${validation.maxLength}"` : ''}
                   ${validation.pattern ? `pattern="${validation.pattern.source}"` : ''}
                   placeholder="Enter ${formatFieldName(fieldName)}">
        `;
    }
}

function formatFieldName(fieldName) {
    return fieldName
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
}

function nextStep() {
    const workflow = currentWorkflow;
    const step = workflow.steps[currentStep];
    
    // Validate current step
    if (!validateStep(step)) {
        showNotification('Please fill in all required fields correctly', 'warning');
        return;
    }
    
    // Save step data
    saveStepData(step);
    
    // Move to next step or complete
    if (currentStep < workflow.steps.length - 1) {
        currentStep++;
        showWorkflowModal();
    } else {
        completeWorkflow();
    }
}

function previousStep() {
    if (currentStep > 0) {
        currentStep--;
        showWorkflowModal();
    }
}

function goToStep(stepIndex) {
    if (stepIndex <= currentStep) {
        currentStep = stepIndex;
        showWorkflowModal();
    }
}

function validateStep(step) {
    if (!step.fields || step.fields.length === 0) {
        return true;
    }
    
    let isValid = true;
    
    step.fields.forEach(fieldName => {
        const validation = step.validation[fieldName];
        const input = document.getElementById(`field_${fieldName}`);
        
        if (!input) return;
        
        const value = input.value.trim();
        
        // Required validation
        if (validation.required && !value) {
            input.classList.add('is-invalid');
            isValid = false;
            return;
        }
        
        // Pattern validation
        if (validation.pattern && value && !validation.pattern.test(value)) {
            input.classList.add('is-invalid');
            isValid = false;
            return;
        }
        
        // Min/Max validation
        if (validation.min && parseFloat(value) < validation.min) {
            input.classList.add('is-invalid');
            isValid = false;
            return;
        }
        
        if (validation.max && parseFloat(value) > validation.max) {
            input.classList.add('is-invalid');
            isValid = false;
            return;
        }
        
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    });
    
    return isValid;
}

function saveStepData(step) {
    if (!step.fields) return;
    
    step.fields.forEach(fieldName => {
        const input = document.getElementById(`field_${fieldName}`);
        if (input) {
            workflowData[fieldName] = input.value;
        }
    });
    
    // Auto-save to localStorage
    if (workflowConfig.autoSave) {
        localStorage.setItem(`workflow_${currentWorkflow.id}`, JSON.stringify(workflowData));
    }
}

function completeWorkflow() {
    console.log('✅ Workflow completed:', workflowData);
    
    // Execute workflow action based on type
    executeWorkflowAction(currentWorkflow.id, workflowData);
    
    // Update user progress
    if (!userProgress.completedWorkflows.includes(currentWorkflow.id)) {
        userProgress.completedWorkflows.push(currentWorkflow.id);
    }
    userProgress.totalTasksCompleted++;
    
    // Check if user should level up
    checkUserLevelUp();
    
    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('guidedWorkflowModal')).hide();
    
    // Show success message
    showNotification(`✅ ${currentWorkflow.name} completed successfully!`, 'success');
    
    // Clear workflow data
    currentWorkflow = null;
    currentStep = 0;
    workflowData = {};
}

function executeWorkflowAction(workflowId, data) {
    switch(workflowId) {
        case 'create-order':
            // Create order with collected data
            const order = {
                id: 'ORD' + String(Date.now()).slice(-3),
                customer: data.customerName,
                phone: data.customerPhone,
                email: data.customerEmail,
                pickup: data.pickupLocation,
                delivery: data.deliveryLocation,
                material: data.material,
                quantity: data.quantity,
                priority: data.priority,
                specialInstructions: data.specialInstructions,
                status: 'pending',
                createdDate: new Date().toISOString().split('T')[0]
            };
            sampleData.orders.push(order);
            updateOrderTable();
            updateDashboard();
            break;
            
        case 'assign-vehicle':
            // Execute vehicle assignment
            console.log('Assigning vehicle:', data);
            break;
            
        case 'physical-count':
            // Record physical count
            console.log('Recording physical count:', data);
            break;
    }
}

function exitWorkflow() {
    if (confirm('Are you sure you want to exit? Your progress will be saved.')) {
        bootstrap.Modal.getInstance(document.getElementById('guidedWorkflowModal')).hide();
        currentWorkflow = null;
        currentStep = 0;
    }
}

// ========================================
// 2. INTERACTIVE TUTORIALS
// ========================================

function showVideoTutorial(workflowId, stepNumber) {
    showNotification(`📹 Opening video tutorial for Step ${stepNumber}...`, 'info');
    
    // In real implementation, open video modal
    alert(`Video Tutorial\n\nWorkflow: ${workflowId}\nStep: ${stepNumber}\n\nThis would open a video showing how to complete this step.`);
}

function showDetailedHelp(workflowId, stepNumber) {
    const workflow = standardWorkflows[workflowId];
    const step = workflow.steps[stepNumber - 1];
    
    const helpHTML = `
        <div class="modal fade" id="detailedHelpModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-info text-white">
                        <h5 class="modal-title"><i class="fas fa-question-circle"></i> Detailed Help</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <h6>${step.title}</h6>
                        <p>${step.description}</p>
                        
                        <h6 class="mt-3">Instructions:</h6>
                        <p>${step.help}</p>
                        
                        ${step.tips ? `
                            <h6 class="mt-3">Tips & Best Practices:</h6>
                            <ul>
                                ${step.tips.map(tip => `<li>${tip}</li>`).join('')}
                            </ul>
                        ` : ''}
                        
                        <h6 class="mt-3">Common Mistakes to Avoid:</h6>
                        <ul>
                            <li>Not filling required fields</li>
                            <li>Entering incorrect format</li>
                            <li>Skipping validation checks</li>
                        </ul>
                        
                        <div class="alert alert-success mt-3">
                            <strong>Need more help?</strong> Contact your supervisor or call support at 1800-XXX-XXXX
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const existingModal = document.getElementById('detailedHelpModal');
    if (existingModal) existingModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', helpHTML);
    new bootstrap.Modal(document.getElementById('detailedHelpModal')).show();
}

// ========================================
// 3. USER LEVEL SYSTEM
// ========================================

function checkUserLevelUp() {
    const tasksCompleted = userProgress.totalTasksCompleted;
    let newLevel = userProgress.currentLevel;
    
    if (tasksCompleted >= 50 && userProgress.currentLevel === 'intermediate') {
        newLevel = 'advanced';
    } else if (tasksCompleted >= 20 && userProgress.currentLevel === 'beginner') {
        newLevel = 'intermediate';
    }
    
    if (newLevel !== userProgress.currentLevel) {
        userProgress.currentLevel = newLevel;
        showLevelUpNotification(newLevel);
    }
}

function showLevelUpNotification(level) {
    const messages = {
        intermediate: '🎉 Congratulations! You\'ve reached Intermediate level!',
        advanced: '🏆 Amazing! You\'re now an Advanced user!'
    };
    
    showNotification(messages[level], 'success');
}

// ========================================
// 4. CONTEXT-SENSITIVE HELP
// ========================================

function showContextHelp(context) {
    const helpContent = {
        'dashboard': 'Dashboard shows overview of all operations. Click on any card for details.',
        'orders': 'Manage all delivery orders here. Use filters to find specific orders.',
        'vehicles': 'Track all vehicles and their current status.',
        'drivers': 'Manage driver information and availability.',
        'routes': 'View and manage delivery routes.',
        'warehouse': 'Monitor inventory levels and perform stock counts.'
    };
    
    const content = helpContent[context] || 'Help information not available for this section.';
    
    showNotification(`💡 ${content}`, 'info');
}

// ========================================
// 5. INITIALIZATION
// ========================================

function initializeGuidedSystem() {
    console.log('📚 Initializing Guided Workflow & Training System...');
    
    // Load user progress from localStorage
    const savedProgress = localStorage.getItem('userProgress');
    if (savedProgress) {
        userProgress = JSON.parse(savedProgress);
    }
    
    // Show welcome message for new users
    if (userProgress.totalTasksCompleted === 0) {
        showNewUserWelcome();
    }
    
    // Add help buttons to all sections
    addHelpButtons();
    
    showNotification('✅ Guided system ready. Click "Start Workflow" for step-by-step guidance!', 'success');
}

function showNewUserWelcome() {
    setTimeout(() => {
        if (confirm('Welcome! Would you like to take a quick tour of the system?')) {
            startSystemTour();
        }
    }, 1000);
}

function startSystemTour() {
    showNotification('🎯 Starting system tour...', 'info');
    // In real implementation, start interactive tour
}

function addHelpButtons() {
    // Add help buttons to each section
    const sections = ['dashboard', 'orders', 'vehicles', 'drivers', 'routes', 'warehouse'];
    
    sections.forEach(section => {
        const sectionElement = document.getElementById(section);
        if (sectionElement) {
            const helpButton = document.createElement('button');
            helpButton.className = 'btn btn-info btn-sm position-fixed';
            helpButton.style.cssText = 'bottom: 20px; right: 20px; z-index: 1000;';
            helpButton.innerHTML = '<i class="fas fa-question-circle"></i> Help';
            helpButton.onclick = () => showContextHelp(section);
            sectionElement.appendChild(helpButton);
        }
    });
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeGuidedSystem();
});

console.log('✅ Guided Workflow & Training System loaded successfully!');
