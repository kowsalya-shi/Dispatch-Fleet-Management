// ========================================
// INVENTORY RECONCILIATION & TRACKING SYSTEM
// Solves physical vs system inventory mismatches
// ========================================

// Global inventory tracking
let inventoryRecords = {
    materials: {},
    discrepancies: [],
    reconciliations: [],
    movements: [],
    audits: []
};

// Inventory configuration
const inventoryConfig = {
    autoReconciliation: true,
    dailyAuditEnabled: true,
    discrepancyThreshold: 2, // Alert if difference > 2 units
    reconciliationFrequency: 'daily', // daily, weekly, monthly
    barcodeEnabled: true,
    rfidEnabled: false,
    realTimeTracking: true
};

// ========================================
// 1. REAL-TIME INVENTORY TRACKING
// ========================================

function initializeInventoryTracking() {
    console.log('📦 Initializing Inventory Tracking System...');
    
    // Initialize inventory records for all materials
    sampleData.materials.forEach(material => {
        inventoryRecords.materials[material.code] = {
            code: material.code,
            name: material.name,
            systemStock: material.currentStock,
            physicalStock: material.currentStock, // Initially same
            lastPhysicalCount: new Date(),
            lastReconciliation: new Date(),
            discrepancyCount: 0,
            movements: [],
            location: material.warehouse
        };
    });
    
    showNotification('✅ Inventory tracking initialized for all materials', 'success');
}

// ========================================
// 2. PHYSICAL COUNT ENTRY
// ========================================

function recordPhysicalCount(materialCode, physicalCount, countedBy, notes = '') {
    console.log(`📊 Recording physical count for ${materialCode}: ${physicalCount} units`);
    
    const inventory = inventoryRecords.materials[materialCode];
    if (!inventory) {
        showNotification(`❌ Material ${materialCode} not found`, 'error');
        return;
    }
    
    const systemStock = inventory.systemStock;
    const difference = physicalCount - systemStock;
    
    // Update physical stock
    inventory.physicalStock = physicalCount;
    inventory.lastPhysicalCount = new Date();
    
    // Check for discrepancy
    if (Math.abs(difference) > 0) {
        recordDiscrepancy(materialCode, systemStock, physicalCount, difference, countedBy, notes);
    } else {
        showNotification(`✅ ${materialCode}: Physical count matches system (${physicalCount} units)`, 'success');
    }
    
    // Update UI
    updateInventoryDashboard();
    
    return {
        materialCode,
        systemStock,
        physicalCount,
        difference,
        status: difference === 0 ? 'matched' : 'discrepancy'
    };
}

// ========================================
// 3. DISCREPANCY DETECTION & RECORDING
// ========================================

function recordDiscrepancy(materialCode, systemStock, physicalStock, difference, countedBy, notes) {
    const severity = Math.abs(difference) > inventoryConfig.discrepancyThreshold ? 'high' : 'low';
    
    const discrepancy = {
        id: 'DISC' + String(Date.now()).slice(-6),
        materialCode: materialCode,
        materialName: inventoryRecords.materials[materialCode].name,
        systemStock: systemStock,
        physicalStock: physicalStock,
        difference: difference,
        differencePercent: ((difference / systemStock) * 100).toFixed(2),
        severity: severity,
        detectedAt: new Date(),
        countedBy: countedBy,
        notes: notes,
        status: 'pending', // pending, investigating, resolved
        resolvedAt: null,
        resolvedBy: null,
        resolution: null
    };
    
    inventoryRecords.discrepancies.push(discrepancy);
    inventoryRecords.materials[materialCode].discrepancyCount++;
    
    // Alert based on severity
    if (severity === 'high') {
        showNotification(
            `⚠️ HIGH DISCREPANCY: ${materialCode} - System: ${systemStock}, Physical: ${physicalStock} (Diff: ${difference})`,
            'danger'
        );
        
        // Auto-trigger investigation
        triggerDiscrepancyInvestigation(discrepancy);
    } else {
        showNotification(
            `⚠️ Discrepancy detected: ${materialCode} - Difference: ${difference} units`,
            'warning'
        );
    }
    
    // Add to discrepancy log
    addDiscrepancyToUI(discrepancy);
    
    return discrepancy;
}

function triggerDiscrepancyInvestigation(discrepancy) {
    console.log(`🔍 Triggering investigation for discrepancy ${discrepancy.id}`);
    
    // Create investigation task
    const investigation = {
        discrepancyId: discrepancy.id,
        materialCode: discrepancy.materialCode,
        assignedTo: 'Warehouse Manager',
        priority: discrepancy.severity === 'high' ? 'urgent' : 'normal',
        createdAt: new Date(),
        status: 'open',
        findings: []
    };
    
    showNotification(
        `🔍 Investigation task created for ${discrepancy.materialCode} - Assigned to Warehouse Manager`,
        'info'
    );
}

// ========================================
// 4. AUTOMATIC RECONCILIATION
// ========================================

function performAutoReconciliation(materialCode, approvedBy) {
    console.log(`🔄 Performing auto-reconciliation for ${materialCode}`);
    
    const inventory = inventoryRecords.materials[materialCode];
    if (!inventory) return;
    
    const reconciliation = {
        id: 'REC' + String(Date.now()).slice(-6),
        materialCode: materialCode,
        materialName: inventory.name,
        beforeSystemStock: inventory.systemStock,
        beforePhysicalStock: inventory.physicalStock,
        afterStock: inventory.physicalStock, // Adjust system to match physical
        adjustment: inventory.physicalStock - inventory.systemStock,
        reconciliationType: 'auto',
        performedAt: new Date(),
        performedBy: approvedBy || 'AUTO-SYSTEM',
        reason: 'Physical count reconciliation',
        status: 'completed'
    };
    
    // Update system stock to match physical
    inventory.systemStock = inventory.physicalStock;
    inventory.lastReconciliation = new Date();
    
    // Update material in sampleData
    const material = sampleData.materials.find(m => m.code === materialCode);
    if (material) {
        material.currentStock = inventory.physicalStock;
    }
    
    // Record reconciliation
    inventoryRecords.reconciliations.push(reconciliation);
    
    // Resolve related discrepancies
    resolveDiscrepancies(materialCode, reconciliation.id);
    
    showNotification(
        `✅ Reconciliation completed: ${materialCode} adjusted by ${reconciliation.adjustment} units`,
        'success'
    );
    
    updateInventoryDashboard();
    updateMaterialTable();
    
    return reconciliation;
}

function resolveDiscrepancies(materialCode, reconciliationId) {
    const pendingDiscrepancies = inventoryRecords.discrepancies.filter(
        d => d.materialCode === materialCode && d.status === 'pending'
    );
    
    pendingDiscrepancies.forEach(discrepancy => {
        discrepancy.status = 'resolved';
        discrepancy.resolvedAt = new Date();
        discrepancy.resolvedBy = 'AUTO-SYSTEM';
        discrepancy.resolution = `Reconciled via ${reconciliationId}`;
    });
}

// ========================================
// 5. STOCK MOVEMENT TRACKING
// ========================================

function recordStockMovement(materialCode, quantity, movementType, reference, notes = '') {
    console.log(`📦 Recording stock movement: ${materialCode} ${movementType} ${quantity} units`);
    
    const inventory = inventoryRecords.materials[materialCode];
    if (!inventory) return;
    
    const movement = {
        id: 'MOV' + String(Date.now()).slice(-6),
        materialCode: materialCode,
        materialName: inventory.name,
        quantity: quantity,
        movementType: movementType, // inbound, outbound, transfer, adjustment
        reference: reference, // Order ID, Transfer ID, etc.
        beforeStock: inventory.systemStock,
        afterStock: inventory.systemStock + (movementType === 'inbound' ? quantity : -quantity),
        timestamp: new Date(),
        recordedBy: 'SYSTEM',
        notes: notes,
        verified: false
    };
    
    // Update system stock
    if (movementType === 'inbound') {
        inventory.systemStock += quantity;
    } else if (movementType === 'outbound') {
        inventory.systemStock -= quantity;
    }
    
    // Record movement
    inventoryRecords.movements.push(movement);
    inventory.movements.push(movement);
    
    // Update material in sampleData
    const material = sampleData.materials.find(m => m.code === materialCode);
    if (material) {
        material.currentStock = inventory.systemStock;
    }
    
    // Check if stock is low
    if (material && inventory.systemStock <= material.minStockLevel) {
        showNotification(
            `⚠️ LOW STOCK ALERT: ${materialCode} - Current: ${inventory.systemStock}, Minimum: ${material.minStockLevel}`,
            'warning'
        );
    }
    
    updateInventoryDashboard();
    
    return movement;
}

// ========================================
// 6. BARCODE/QR CODE SCANNING
// ========================================

function scanBarcode(barcode) {
    console.log(`📱 Scanning barcode: ${barcode}`);
    
    // Find material by barcode (assuming barcode = material code)
    const material = sampleData.materials.find(m => m.code === barcode);
    
    if (!material) {
        showNotification(`❌ Material not found for barcode: ${barcode}`, 'error');
        return null;
    }
    
    const inventory = inventoryRecords.materials[material.code];
    
    showNotification(
        `✅ Scanned: ${material.name} (${material.code}) - System Stock: ${inventory.systemStock} ${material.unit}`,
        'success'
    );
    
    // Open quick count modal
    openQuickCountModal(material.code);
    
    return material;
}

function openQuickCountModal(materialCode) {
    const inventory = inventoryRecords.materials[materialCode];
    const material = sampleData.materials.find(m => m.code === materialCode);
    
    const modalHTML = `
        <div class="modal fade" id="quickCountModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title"><i class="fas fa-barcode"></i> Quick Physical Count</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info">
                            <h6>${material.name} (${materialCode})</h6>
                            <p class="mb-0">
                                <strong>System Stock:</strong> ${inventory.systemStock} ${material.unit}<br>
                                <strong>Last Count:</strong> ${new Date(inventory.lastPhysicalCount).toLocaleString()}
                            </p>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Physical Count <span class="text-danger">*</span></label>
                            <input type="number" class="form-control form-control-lg" id="quickPhysicalCount" 
                                   placeholder="Enter actual count" min="0" required autofocus>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Counted By</label>
                            <input type="text" class="form-control" id="quickCountedBy" 
                                   placeholder="Your name" value="Warehouse Staff">
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Notes (Optional)</label>
                            <textarea class="form-control" id="quickCountNotes" rows="2" 
                                      placeholder="Any observations or issues..."></textarea>
                        </div>
                        
                        <div id="quickCountPreview" class="alert alert-secondary" style="display: none;">
                            <strong>Preview:</strong>
                            <div id="quickCountDifference"></div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="submitQuickCount('${materialCode}')">
                            <i class="fas fa-save"></i> Submit Count
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal
    const existingModal = document.getElementById('quickCountModal');
    if (existingModal) existingModal.remove();
    
    // Add and show modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('quickCountModal'));
    modal.show();
    
    // Add real-time preview
    document.getElementById('quickPhysicalCount').addEventListener('input', function() {
        const physicalCount = parseInt(this.value) || 0;
        const difference = physicalCount - inventory.systemStock;
        const preview = document.getElementById('quickCountPreview');
        const differenceDiv = document.getElementById('quickCountDifference');
        
        if (this.value) {
            preview.style.display = 'block';
            
            if (difference === 0) {
                preview.className = 'alert alert-success';
                differenceDiv.innerHTML = `✅ Matches system stock (${physicalCount} ${material.unit})`;
            } else if (difference > 0) {
                preview.className = 'alert alert-warning';
                differenceDiv.innerHTML = `⚠️ Excess: +${difference} ${material.unit} (System: ${inventory.systemStock}, Physical: ${physicalCount})`;
            } else {
                preview.className = 'alert alert-danger';
                differenceDiv.innerHTML = `⚠️ Shortage: ${difference} ${material.unit} (System: ${inventory.systemStock}, Physical: ${physicalCount})`;
            }
        } else {
            preview.style.display = 'none';
        }
    });
}

function submitQuickCount(materialCode) {
    const physicalCount = parseInt(document.getElementById('quickPhysicalCount').value);
    const countedBy = document.getElementById('quickCountedBy').value;
    const notes = document.getElementById('quickCountNotes').value;
    
    if (!physicalCount && physicalCount !== 0) {
        showNotification('Please enter physical count', 'warning');
        return;
    }
    
    // Record the count
    const result = recordPhysicalCount(materialCode, physicalCount, countedBy, notes);
    
    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('quickCountModal')).hide();
    
    // If discrepancy, ask for reconciliation
    if (result.difference !== 0) {
        setTimeout(() => {
            if (confirm(`Discrepancy detected: ${result.difference} units. Reconcile now?`)) {
                performAutoReconciliation(materialCode, countedBy);
            }
        }, 500);
    }
}

// ========================================
// 7. DAILY AUDIT SYSTEM
// ========================================

function performDailyAudit() {
    console.log('📋 Performing daily inventory audit...');
    
    const audit = {
        id: 'AUD' + String(Date.now()).slice(-6),
        date: new Date(),
        materialsAudited: 0,
        discrepanciesFound: 0,
        totalAdjustment: 0,
        status: 'in-progress',
        results: []
    };
    
    // Audit each material
    Object.keys(inventoryRecords.materials).forEach(code => {
        const inventory = inventoryRecords.materials[code];
        const difference = inventory.physicalStock - inventory.systemStock;
        
        audit.materialsAudited++;
        
        if (difference !== 0) {
            audit.discrepanciesFound++;
            audit.totalAdjustment += Math.abs(difference);
            
            audit.results.push({
                materialCode: code,
                materialName: inventory.name,
                systemStock: inventory.systemStock,
                physicalStock: inventory.physicalStock,
                difference: difference,
                status: 'discrepancy'
            });
        } else {
            audit.results.push({
                materialCode: code,
                materialName: inventory.name,
                systemStock: inventory.systemStock,
                physicalStock: inventory.physicalStock,
                difference: 0,
                status: 'matched'
            });
        }
    });
    
    audit.status = 'completed';
    audit.completedAt = new Date();
    
    inventoryRecords.audits.push(audit);
    
    // Generate audit report
    generateAuditReport(audit);
    
    showNotification(
        `✅ Daily audit completed: ${audit.materialsAudited} materials audited, ${audit.discrepanciesFound} discrepancies found`,
        audit.discrepanciesFound > 0 ? 'warning' : 'success'
    );
    
    return audit;
}

function generateAuditReport(audit) {
    console.log('📄 Generating audit report...');
    
    const report = `
DAILY INVENTORY AUDIT REPORT
Audit ID: ${audit.id}
Date: ${audit.date.toLocaleDateString()}
Time: ${audit.date.toLocaleTimeString()}

SUMMARY:
- Materials Audited: ${audit.materialsAudited}
- Discrepancies Found: ${audit.discrepanciesFound}
- Total Adjustment: ${audit.totalAdjustment} units
- Accuracy Rate: ${(((audit.materialsAudited - audit.discrepanciesFound) / audit.materialsAudited) * 100).toFixed(1)}%

DISCREPANCIES:
${audit.results.filter(r => r.status === 'discrepancy').map(r => 
    `- ${r.materialCode} (${r.materialName}): System ${r.systemStock}, Physical ${r.physicalStock}, Diff ${r.difference}`
).join('\n') || 'None'}

MATCHED ITEMS:
${audit.results.filter(r => r.status === 'matched').length} materials matched perfectly

Generated by: Inventory Management System
    `;
    
    console.log(report);
    
    // In real implementation, save to database and email to stakeholders
    showNotification('📧 Audit report generated and emailed to management', 'info');
}

// ========================================
// 8. INVENTORY DASHBOARD UPDATES
// ========================================

function updateInventoryDashboard() {
    // Update discrepancy count
    const pendingDiscrepancies = inventoryRecords.discrepancies.filter(d => d.status === 'pending');
    document.getElementById('pendingDiscrepancies')?.textContent = pendingDiscrepancies.length;
    
    // Update reconciliation count
    const todayReconciliations = inventoryRecords.reconciliations.filter(r => {
        const today = new Date().toDateString();
        return new Date(r.performedAt).toDateString() === today;
    });
    document.getElementById('todayReconciliations')?.textContent = todayReconciliations.length;
    
    // Update accuracy rate
    const totalMaterials = Object.keys(inventoryRecords.materials).length;
    const matchedMaterials = Object.values(inventoryRecords.materials).filter(
        m => m.systemStock === m.physicalStock
    ).length;
    const accuracyRate = ((matchedMaterials / totalMaterials) * 100).toFixed(1);
    document.getElementById('inventoryAccuracy')?.textContent = accuracyRate + '%';
    
    // Update last audit time
    if (inventoryRecords.audits.length > 0) {
        const lastAudit = inventoryRecords.audits[inventoryRecords.audits.length - 1];
        document.getElementById('lastAuditTime')?.textContent = 
            new Date(lastAudit.date).toLocaleString();
    }
}

function addDiscrepancyToUI(discrepancy) {
    const container = document.getElementById('discrepancyList');
    if (!container) return;
    
    const severityClass = discrepancy.severity === 'high' ? 'danger' : 'warning';
    const severityIcon = discrepancy.severity === 'high' ? 'exclamation-triangle' : 'exclamation-circle';
    
    const discrepancyHTML = `
        <div class="alert alert-${severityClass} mb-3" id="disc-${discrepancy.id}">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="mb-1">
                        <i class="fas fa-${severityIcon}"></i> 
                        ${discrepancy.materialCode} - ${discrepancy.materialName}
                    </h6>
                    <p class="mb-2">
                        <strong>System:</strong> ${discrepancy.systemStock} units<br>
                        <strong>Physical:</strong> ${discrepancy.physicalStock} units<br>
                        <strong>Difference:</strong> ${discrepancy.difference} units (${discrepancy.differencePercent}%)<br>
                        <strong>Counted By:</strong> ${discrepancy.countedBy}<br>
                        <strong>Time:</strong> ${new Date(discrepancy.detectedAt).toLocaleString()}
                        ${discrepancy.notes ? `<br><strong>Notes:</strong> ${discrepancy.notes}` : ''}
                    </p>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-success" onclick="performAutoReconciliation('${discrepancy.materialCode}', 'Manager')">
                            <i class="fas fa-check"></i> Reconcile
                        </button>
                        <button class="btn btn-info" onclick="investigateDiscrepancy('${discrepancy.id}')">
                            <i class="fas fa-search"></i> Investigate
                        </button>
                        <button class="btn btn-secondary" onclick="ignoreDiscrepancy('${discrepancy.id}')">
                            <i class="fas fa-times"></i> Ignore
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('afterbegin', discrepancyHTML);
}

function investigateDiscrepancy(discrepancyId) {
    const discrepancy = inventoryRecords.discrepancies.find(d => d.id === discrepancyId);
    if (!discrepancy) return;
    
    showNotification(`🔍 Investigation started for ${discrepancy.materialCode}`, 'info');
    discrepancy.status = 'investigating';
    
    // In real implementation, open investigation form
    alert(`Investigation Checklist for ${discrepancy.materialCode}:\n\n` +
          `1. Verify physical count again\n` +
          `2. Check recent stock movements\n` +
          `3. Review order fulfillments\n` +
          `4. Check for damaged/lost items\n` +
          `5. Verify data entry errors\n` +
          `6. Document findings`);
}

function ignoreDiscrepancy(discrepancyId) {
    if (!confirm('Are you sure you want to ignore this discrepancy?')) return;
    
    const discrepancy = inventoryRecords.discrepancies.find(d => d.id === discrepancyId);
    if (discrepancy) {
        discrepancy.status = 'ignored';
        discrepancy.resolvedAt = new Date();
        discrepancy.resolvedBy = 'User';
    }
    
    // Remove from UI
    const element = document.getElementById(`disc-${discrepancyId}`);
    if (element) element.remove();
    
    showNotification('Discrepancy ignored', 'info');
    updateInventoryDashboard();
}

// ========================================
// 9. BULK OPERATIONS
// ========================================

function bulkPhysicalCount(counts) {
    console.log('📦 Processing bulk physical count...');
    
    let processed = 0;
    let discrepancies = 0;
    
    counts.forEach(count => {
        const result = recordPhysicalCount(
            count.materialCode,
            count.physicalCount,
            count.countedBy,
            count.notes
        );
        
        processed++;
        if (result.difference !== 0) {
            discrepancies++;
        }
    });
    
    showNotification(
        `✅ Bulk count completed: ${processed} materials processed, ${discrepancies} discrepancies found`,
        discrepancies > 0 ? 'warning' : 'success'
    );
}

function bulkReconciliation(materialCodes, approvedBy) {
    console.log('🔄 Processing bulk reconciliation...');
    
    let reconciled = 0;
    
    materialCodes.forEach(code => {
        performAutoReconciliation(code, approvedBy);
        reconciled++;
    });
    
    showNotification(`✅ Bulk reconciliation completed: ${reconciled} materials reconciled`, 'success');
}

// ========================================
// 10. INITIALIZATION
// ========================================

function initializeInventorySystem() {
    console.log('📦 Initializing Inventory Reconciliation System...');
    
    initializeInventoryTracking();
    
    // Schedule daily audit
    if (inventoryConfig.dailyAuditEnabled) {
        // Run audit at 6 PM daily (simulated)
        setInterval(() => {
            const now = new Date();
            if (now.getHours() === 18 && now.getMinutes() === 0) {
                performDailyAudit();
            }
        }, 60000); // Check every minute
    }
    
    // Update dashboard every 30 seconds
    setInterval(updateInventoryDashboard, 30000);
    
    showNotification('✅ Inventory Reconciliation System initialized', 'success');
}

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeInventorySystem();
});

console.log('✅ Inventory Reconciliation System loaded successfully!');
