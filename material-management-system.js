// Complete Material Management System
// End-to-end material lifecycle: Purchase → Storage → Movement → Dispatch → Delivery → Reporting

const materialManagementSystem = {
    // Module 1: Material Master Data
    materials: [],
    materialCategories: ['Raw Material', 'Finished Goods', 'Laminates', 'Sheets', 'Panels', 'Boards'],
    
    // Module 2: Purchase & Inward Tracking
    purchaseOrders: [],
    grns: [],
    
    // Module 3: Stock Management
    stockLevels: {},
    stockMovements: [],
    
    // Module 4: Material Movement
    movements: [],
    
    // Module 5: Barcode/QR System
    qrCodes: {},
    
    // Module 6: Reporting
    reports: {},
    
    // Settings
    settings: {
        lowStockThreshold: 10,
        currency: '₹',
        defaultUnit: 'pieces'
    }
};

// Initialize Material Management System
function initializeMaterialManagementSystem() {
    console.log('Initializing Complete Material Management System...');
    loadMaterialData();
    setupMaterialManagementDashboard();
    loadSampleMaterialData();
}

// Load Material Data
function loadMaterialData() {
    const stored = localStorage.getItem('materialManagementData');
    if (stored) {
        Object.assign(materialManagementSystem, JSON.parse(stored));
    }
}

// Save Material Data
function saveMaterialData() {
    localStorage.setItem('materialManagementData', JSON.stringify(materialManagementSystem));
}

// Load Sample Material Data
function loadSampleMaterialData() {
    if (materialManagementSystem.materials.length === 0) {
        // Sample Materials (15 materials)
        materialManagementSystem.materials = [
            // Laminates
            {
                id: 'MAT001',
                sku: 'LAM001',
                name: 'Satin Laminate',
                description: 'High-quality satin finish laminate',
                category: 'Laminates',
                unit: 'sheets',
                size: '8x4 feet',
                thickness: '1mm',
                supplier: 'ABC Suppliers',
                costPerUnit: 450,
                reorderLevel: 50,
                currentStock: 250,
                location: 'WH01-A-05-R3-L2-B12',
                qrCode: 'QR-MAT001',
                createdAt: new Date().toISOString()
            },
            {
                id: 'MAT002',
                sku: 'LAM002',
                name: 'Glossy Laminate',
                description: 'High-gloss finish laminate',
                category: 'Laminates',
                unit: 'sheets',
                size: '8x4 feet',
                thickness: '1mm',
                supplier: 'ABC Suppliers',
                costPerUnit: 480,
                reorderLevel: 50,
                currentStock: 180,
                location: 'WH01-A-05-R3-L2-B13',
                qrCode: 'QR-MAT002',
                createdAt: new Date().toISOString()
            },
            {
                id: 'MAT003',
                sku: 'LAM003',
                name: 'Matte Laminate',
                description: 'Matte finish laminate',
                category: 'Laminates',
                unit: 'sheets',
                size: '8x4 feet',
                thickness: '0.8mm',
                supplier: 'ABC Suppliers',
                costPerUnit: 420,
                reorderLevel: 40,
                currentStock: 320,
                location: 'WH01-A-05-R3-L2-B14',
                qrCode: 'QR-MAT003',
                createdAt: new Date().toISOString()
            },
            
            // Sheets
            {
                id: 'MAT004',
                sku: 'SHT001',
                name: 'Acrylic Sheet Clear',
                description: 'Transparent acrylic sheet',
                category: 'Sheets',
                unit: 'sheets',
                size: '4x8 feet',
                thickness: '3mm',
                supplier: 'XYZ Materials',
                costPerUnit: 850,
                reorderLevel: 30,
                currentStock: 120,
                location: 'WH01-A-06-R2-L3-B08',
                qrCode: 'QR-MAT004',
                createdAt: new Date().toISOString()
            },
            {
                id: 'MAT005',
                sku: 'SHT002',
                name: 'Acrylic Sheet Frosted',
                description: 'Frosted acrylic sheet',
                category: 'Sheets',
                unit: 'sheets',
                size: '4x8 feet',
                thickness: '3mm',
                supplier: 'XYZ Materials',
                costPerUnit: 900,
                reorderLevel: 25,
                currentStock: 85,
                location: 'WH01-A-06-R2-L3-B09',
                qrCode: 'QR-MAT005',
                createdAt: new Date().toISOString()
            },
            {
                id: 'MAT006',
                sku: 'SHT003',
                name: 'Polycarbonate Sheet',
                description: 'Impact-resistant polycarbonate',
                category: 'Sheets',
                unit: 'sheets',
                size: '4x8 feet',
                thickness: '4mm',
                supplier: 'XYZ Materials',
                costPerUnit: 1200,
                reorderLevel: 20,
                currentStock: 45,
                location: 'WH01-A-06-R2-L3-B10',
                qrCode: 'QR-MAT006',
                createdAt: new Date().toISOString()
            },
            
            // Panels
            {
                id: 'MAT007',
                sku: 'PNL001',
                name: 'MDF Panel 18mm',
                description: 'Medium Density Fiberboard',
                category: 'Panels',
                unit: 'sheets',
                size: '8x4 feet',
                thickness: '18mm',
                supplier: 'Panel Corp',
                costPerUnit: 650,
                reorderLevel: 20,
                currentStock: 8,
                location: 'WH01-B-02-R1-L1-B05',
                qrCode: 'QR-MAT007',
                createdAt: new Date().toISOString()
            },
            {
                id: 'MAT008',
                sku: 'PNL002',
                name: 'MDF Panel 12mm',
                description: 'Medium Density Fiberboard',
                category: 'Panels',
                unit: 'sheets',
                size: '8x4 feet',
                thickness: '12mm',
                supplier: 'Panel Corp',
                costPerUnit: 480,
                reorderLevel: 25,
                currentStock: 65,
                location: 'WH01-B-02-R1-L1-B06',
                qrCode: 'QR-MAT008',
                createdAt: new Date().toISOString()
            },
            {
                id: 'MAT009',
                sku: 'PNL003',
                name: 'Plywood Panel',
                description: 'Marine grade plywood',
                category: 'Panels',
                unit: 'sheets',
                size: '8x4 feet',
                thickness: '18mm',
                supplier: 'Panel Corp',
                costPerUnit: 1200,
                reorderLevel: 15,
                currentStock: 42,
                location: 'WH01-B-02-R1-L1-B07',
                qrCode: 'QR-MAT009',
                createdAt: new Date().toISOString()
            },
            
            // Boards
            {
                id: 'MAT010',
                sku: 'BRD001',
                name: 'Particle Board',
                description: 'Standard particle board',
                category: 'Boards',
                unit: 'sheets',
                size: '8x4 feet',
                thickness: '18mm',
                supplier: 'Board Suppliers',
                costPerUnit: 380,
                reorderLevel: 30,
                currentStock: 150,
                location: 'WH01-B-03-R2-L2-B01',
                qrCode: 'QR-MAT010',
                createdAt: new Date().toISOString()
            },
            {
                id: 'MAT011',
                sku: 'BRD002',
                name: 'Chipboard',
                description: 'High-density chipboard',
                category: 'Boards',
                unit: 'sheets',
                size: '8x4 feet',
                thickness: '16mm',
                supplier: 'Board Suppliers',
                costPerUnit: 420,
                reorderLevel: 25,
                currentStock: 95,
                location: 'WH01-B-03-R2-L2-B02',
                qrCode: 'QR-MAT011',
                createdAt: new Date().toISOString()
            },
            
            // Raw Materials
            {
                id: 'MAT012',
                sku: 'RAW001',
                name: 'Wood Veneer',
                description: 'Natural wood veneer sheets',
                category: 'Raw Material',
                unit: 'sheets',
                size: '8x4 feet',
                thickness: '0.6mm',
                supplier: 'Veneer Suppliers',
                costPerUnit: 280,
                reorderLevel: 50,
                currentStock: 220,
                location: 'WH01-C-01-R1-L1-B01',
                qrCode: 'QR-MAT012',
                createdAt: new Date().toISOString()
            },
            {
                id: 'MAT013',
                sku: 'RAW002',
                name: 'Edge Banding',
                description: 'PVC edge banding roll',
                category: 'Raw Material',
                unit: 'rolls',
                size: '50m x 22mm',
                thickness: '0.5mm',
                supplier: 'Edge Suppliers',
                costPerUnit: 150,
                reorderLevel: 100,
                currentStock: 450,
                location: 'WH01-C-01-R1-L2-B05',
                qrCode: 'QR-MAT013',
                createdAt: new Date().toISOString()
            },
            
            // Finished Goods
            {
                id: 'MAT014',
                sku: 'FIN001',
                name: 'Kitchen Cabinet Door',
                description: 'Pre-finished cabinet door',
                category: 'Finished Goods',
                unit: 'pieces',
                size: '24x18 inches',
                thickness: '18mm',
                supplier: 'In-house Production',
                costPerUnit: 850,
                reorderLevel: 10,
                currentStock: 35,
                location: 'WH01-C-05-R3-L2-B10',
                qrCode: 'QR-MAT014',
                createdAt: new Date().toISOString()
            },
            {
                id: 'MAT015',
                sku: 'FIN002',
                name: 'Wardrobe Shutter',
                description: 'Pre-finished wardrobe shutter',
                category: 'Finished Goods',
                unit: 'pieces',
                size: '72x24 inches',
                thickness: '18mm',
                supplier: 'In-house Production',
                costPerUnit: 1500,
                reorderLevel: 5,
                currentStock: 18,
                location: 'WH01-C-05-R3-L2-B11',
                qrCode: 'QR-MAT015',
                createdAt: new Date().toISOString()
            }
        ];

        // Sample Purchase Orders (5 POs)
        materialManagementSystem.purchaseOrders = [
            {
                id: 'PO001',
                poNumber: 'PO-2024-001',
                supplier: 'ABC Suppliers',
                date: new Date(Date.now() - 10 * 86400000).toISOString(),
                expectedDelivery: new Date(Date.now() + 5 * 86400000).toISOString(),
                status: 'completed',
                items: [
                    { materialId: 'MAT001', sku: 'LAM001', name: 'Satin Laminate', quantity: 100, rate: 450, amount: 45000 },
                    { materialId: 'MAT002', sku: 'LAM002', name: 'Glossy Laminate', quantity: 80, rate: 480, amount: 38400 }
                ],
                totalAmount: 83400,
                createdBy: 'Admin'
            },
            {
                id: 'PO002',
                poNumber: 'PO-2024-002',
                supplier: 'XYZ Materials',
                date: new Date(Date.now() - 5 * 86400000).toISOString(),
                expectedDelivery: new Date(Date.now() + 10 * 86400000).toISOString(),
                status: 'pending',
                items: [
                    { materialId: 'MAT004', sku: 'SHT001', name: 'Acrylic Sheet Clear', quantity: 50, rate: 850, amount: 42500 },
                    { materialId: 'MAT005', sku: 'SHT002', name: 'Acrylic Sheet Frosted', quantity: 40, rate: 900, amount: 36000 }
                ],
                totalAmount: 78500,
                createdBy: 'Admin'
            },
            {
                id: 'PO003',
                poNumber: 'PO-2024-003',
                supplier: 'Panel Corp',
                date: new Date(Date.now() - 3 * 86400000).toISOString(),
                expectedDelivery: new Date(Date.now() + 7 * 86400000).toISOString(),
                status: 'pending',
                items: [
                    { materialId: 'MAT007', sku: 'PNL001', name: 'MDF Panel 18mm', quantity: 100, rate: 650, amount: 65000 },
                    { materialId: 'MAT008', sku: 'PNL002', name: 'MDF Panel 12mm', quantity: 80, rate: 480, amount: 38400 }
                ],
                totalAmount: 103400,
                createdBy: 'Admin'
            },
            {
                id: 'PO004',
                poNumber: 'PO-2024-004',
                supplier: 'Board Suppliers',
                date: new Date(Date.now() - 8 * 86400000).toISOString(),
                expectedDelivery: new Date(Date.now() + 2 * 86400000).toISOString(),
                status: 'in-transit',
                items: [
                    { materialId: 'MAT010', sku: 'BRD001', name: 'Particle Board', quantity: 150, rate: 380, amount: 57000 }
                ],
                totalAmount: 57000,
                createdBy: 'Admin'
            },
            {
                id: 'PO005',
                poNumber: 'PO-2024-005',
                supplier: 'Veneer Suppliers',
                date: new Date(Date.now() - 15 * 86400000).toISOString(),
                expectedDelivery: new Date(Date.now() - 5 * 86400000).toISOString(),
                status: 'completed',
                items: [
                    { materialId: 'MAT012', sku: 'RAW001', name: 'Wood Veneer', quantity: 200, rate: 280, amount: 56000 },
                    { materialId: 'MAT013', sku: 'RAW002', name: 'Edge Banding', quantity: 500, rate: 150, amount: 75000 }
                ],
                totalAmount: 131000,
                createdBy: 'Admin'
            }
        ];

        // Sample GRNs (3 GRNs)
        materialManagementSystem.grns = [
            {
                id: 'GRN001',
                grnNumber: 'GRN-2024-001',
                poId: 'PO001',
                poNumber: 'PO-2024-001',
                supplier: 'ABC Suppliers',
                receivedDate: new Date(Date.now() - 5 * 86400000).toISOString(),
                items: [
                    { 
                        materialId: 'MAT001', 
                        sku: 'LAM001', 
                        name: 'Satin Laminate', 
                        orderedQty: 100, 
                        receivedQty: 98, 
                        acceptedQty: 95, 
                        rejectedQty: 3,
                        reason: 'Minor damage on edges',
                        location: 'WH01-A-05-R3-L2-B12'
                    },
                    { 
                        materialId: 'MAT002', 
                        sku: 'LAM002', 
                        name: 'Glossy Laminate', 
                        orderedQty: 80, 
                        receivedQty: 80, 
                        acceptedQty: 78, 
                        rejectedQty: 2,
                        reason: 'Surface scratches',
                        location: 'WH01-A-05-R3-L2-B13'
                    }
                ],
                qualityCheck: 'passed',
                receivedBy: 'John Doe',
                status: 'completed'
            },
            {
                id: 'GRN002',
                grnNumber: 'GRN-2024-002',
                poId: 'PO005',
                poNumber: 'PO-2024-005',
                supplier: 'Veneer Suppliers',
                receivedDate: new Date(Date.now() - 4 * 86400000).toISOString(),
                items: [
                    { 
                        materialId: 'MAT012', 
                        sku: 'RAW001', 
                        name: 'Wood Veneer', 
                        orderedQty: 200, 
                        receivedQty: 200, 
                        acceptedQty: 198, 
                        rejectedQty: 2,
                        reason: 'Color mismatch',
                        location: 'WH01-C-01-R1-L1-B01'
                    },
                    { 
                        materialId: 'MAT013', 
                        sku: 'RAW002', 
                        name: 'Edge Banding', 
                        orderedQty: 500, 
                        receivedQty: 500, 
                        acceptedQty: 500, 
                        rejectedQty: 0,
                        reason: 'All good',
                        location: 'WH01-C-01-R1-L2-B05'
                    }
                ],
                qualityCheck: 'passed',
                receivedBy: 'Jane Smith',
                status: 'completed'
            },
            {
                id: 'GRN003',
                grnNumber: 'GRN-2024-003',
                poId: 'PO002',
                poNumber: 'PO-2024-002',
                supplier: 'XYZ Materials',
                receivedDate: new Date().toISOString(),
                items: [
                    { 
                        materialId: 'MAT004', 
                        sku: 'SHT001', 
                        name: 'Acrylic Sheet Clear', 
                        orderedQty: 50, 
                        receivedQty: 50, 
                        acceptedQty: 48, 
                        rejectedQty: 2,
                        reason: 'Cracks found',
                        location: 'WH01-A-06-R2-L3-B08'
                    }
                ],
                qualityCheck: 'passed',
                receivedBy: 'Mike Johnson',
                status: 'pending'
            }
        ];

        // Sample Stock Movements (10 movements)
        materialManagementSystem.stockMovements = [
            {
                id: 'MOV001',
                materialId: 'MAT001',
                sku: 'LAM001',
                type: 'inward',
                quantity: 95,
                fromLocation: 'Receiving Area',
                toLocation: 'WH01-A-05-R3-L2-B12',
                date: new Date(Date.now() - 5 * 86400000).toISOString(),
                reason: 'GRN Receipt',
                reference: 'GRN-2024-001',
                authorizedBy: 'Admin'
            },
            {
                id: 'MOV002',
                materialId: 'MAT002',
                sku: 'LAM002',
                type: 'inward',
                quantity: 78,
                fromLocation: 'Receiving Area',
                toLocation: 'WH01-A-05-R3-L2-B13',
                date: new Date(Date.now() - 5 * 86400000).toISOString(),
                reason: 'GRN Receipt',
                reference: 'GRN-2024-001',
                authorizedBy: 'Admin'
            },
            {
                id: 'MOV003',
                materialId: 'MAT012',
                sku: 'RAW001',
                type: 'inward',
                quantity: 198,
                fromLocation: 'Receiving Area',
                toLocation: 'WH01-C-01-R1-L1-B01',
                date: new Date(Date.now() - 4 * 86400000).toISOString(),
                reason: 'GRN Receipt',
                reference: 'GRN-2024-002',
                authorizedBy: 'Admin'
            },
            {
                id: 'MOV004',
                materialId: 'MAT013',
                sku: 'RAW002',
                type: 'inward',
                quantity: 500,
                fromLocation: 'Receiving Area',
                toLocation: 'WH01-C-01-R1-L2-B05',
                date: new Date(Date.now() - 4 * 86400000).toISOString(),
                reason: 'GRN Receipt',
                reference: 'GRN-2024-002',
                authorizedBy: 'Admin'
            },
            {
                id: 'MOV005',
                materialId: 'MAT001',
                sku: 'LAM001',
                type: 'outward',
                quantity: 50,
                fromLocation: 'WH01-A-05-R3-L2-B12',
                toLocation: 'Production Floor',
                date: new Date(Date.now() - 3 * 86400000).toISOString(),
                reason: 'Issue to Production',
                reference: 'PROD-REQ-001',
                authorizedBy: 'Production Manager'
            },
            {
                id: 'MOV006',
                materialId: 'MAT007',
                sku: 'PNL001',
                type: 'outward',
                quantity: 15,
                fromLocation: 'WH01-B-02-R1-L1-B05',
                toLocation: 'Production Floor',
                date: new Date(Date.now() - 2 * 86400000).toISOString(),
                reason: 'Issue to Production',
                reference: 'PROD-REQ-002',
                authorizedBy: 'Production Manager'
            },
            {
                id: 'MOV007',
                materialId: 'MAT003',
                sku: 'LAM003',
                type: 'transfer',
                quantity: 30,
                fromLocation: 'WH01-A-05-R3-L2-B14',
                toLocation: 'WH01-A-05-R3-L3-B01',
                date: new Date(Date.now() - 2 * 86400000).toISOString(),
                reason: 'Location Optimization',
                reference: 'TRANSFER-001',
                authorizedBy: 'Warehouse Manager'
            },
            {
                id: 'MOV008',
                materialId: 'MAT014',
                sku: 'FIN001',
                type: 'inward',
                quantity: 25,
                fromLocation: 'Production Floor',
                toLocation: 'WH01-C-05-R3-L2-B10',
                date: new Date(Date.now() - 1 * 86400000).toISOString(),
                reason: 'Production Complete',
                reference: 'PROD-COMP-001',
                authorizedBy: 'Production Manager'
            },
            {
                id: 'MOV009',
                materialId: 'MAT015',
                sku: 'FIN002',
                type: 'inward',
                quantity: 15,
                fromLocation: 'Production Floor',
                toLocation: 'WH01-C-05-R3-L2-B11',
                date: new Date(Date.now() - 1 * 86400000).toISOString(),
                reason: 'Production Complete',
                reference: 'PROD-COMP-002',
                authorizedBy: 'Production Manager'
            },
            {
                id: 'MOV010',
                materialId: 'MAT004',
                sku: 'SHT001',
                type: 'outward',
                quantity: 20,
                fromLocation: 'WH01-A-06-R2-L3-B08',
                toLocation: 'Customer Dispatch',
                date: new Date().toISOString(),
                reason: 'Customer Order',
                reference: 'ORD-001',
                authorizedBy: 'Dispatch Manager'
            }
        ];

        saveMaterialData();
    }
}

// Setup Material Management Dashboard
function setupMaterialManagementDashboard() {
    const dashboardHTML = `
        <div class="material-management-dashboard">
            <div class="material-header">
                <h2><i class="fas fa-boxes"></i> Complete Material Management System</h2>
                <p class="text-muted">End-to-end material lifecycle management</p>
            </div>

            <!-- Quick Stats -->
            <div class="material-stats">
                <div class="stat-card material-stat">
                    <div class="stat-icon"><i class="fas fa-box"></i></div>
                    <div class="stat-content">
                        <div class="stat-value" id="totalMaterialsCount">0</div>
                        <div class="stat-label">Total Materials</div>
                    </div>
                </div>
                <div class="stat-card material-stat">
                    <div class="stat-icon"><i class="fas fa-rupee-sign"></i></div>
                    <div class="stat-content">
                        <div class="stat-value" id="totalStockValue">₹0</div>
                        <div class="stat-label">Total Stock Value</div>
                    </div>
                </div>
                <div class="stat-card material-stat">
                    <div class="stat-icon"><i class="fas fa-exclamation-triangle"></i></div>
                    <div class="stat-content">
                        <div class="stat-value" id="lowStockCount">0</div>
                        <div class="stat-label">Low Stock Items</div>
                    </div>
                </div>
                <div class="stat-card material-stat">
                    <div class="stat-icon"><i class="fas fa-clipboard-check"></i></div>
                    <div class="stat-content">
                        <div class="stat-value" id="pendingGRNCount">0</div>
                        <div class="stat-label">Pending GRNs</div>
                    </div>
                </div>
            </div>

            <!-- Tab Navigation -->
            <ul class="nav nav-tabs material-tabs" role="tablist">
                <li class="nav-item">
                    <a class="nav-link active" data-bs-toggle="tab" href="#materialMasterTab">
                        <i class="fas fa-database"></i> Material Master
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-bs-toggle="tab" href="#purchaseOrderTab">
                        <i class="fas fa-shopping-cart"></i> Purchase Orders
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-bs-toggle="tab" href="#grnTab">
                        <i class="fas fa-truck-loading"></i> GRN / Inward
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-bs-toggle="tab" href="#stockTab">
                        <i class="fas fa-warehouse"></i> Stock Overview
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-bs-toggle="tab" href="#movementTab">
                        <i class="fas fa-exchange-alt"></i> Material Movement
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-bs-toggle="tab" href="#barcodeTab">
                        <i class="fas fa-qrcode"></i> Barcode/QR
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-bs-toggle="tab" href="#reportsTab">
                        <i class="fas fa-chart-bar"></i> Reports
                    </a>
                </li>
            </ul>

            <!-- Tab Content -->
            <div class="tab-content material-tab-content">
                <!-- Material Master Tab -->
                <div class="tab-pane fade show active" id="materialMasterTab">
                    <div class="tab-header">
                        <h4>Material Master Data</h4>
                        <button class="btn btn-primary" onclick="showAddMaterialModal()">
                            <i class="fas fa-plus"></i> Add Material
                        </button>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead class="table-dark">
                                <tr>
                                    <th>SKU</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Size/Thickness</th>
                                    <th>Unit</th>
                                    <th>Current Stock</th>
                                    <th>Reorder Level</th>
                                    <th>Cost/Unit</th>
                                    <th>Location</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="materialMasterTable"></tbody>
                        </table>
                    </div>
                </div>

                <!-- Purchase Order Tab -->
                <div class="tab-pane fade" id="purchaseOrderTab">
                    <div class="tab-header">
                        <h4>Purchase Orders</h4>
                        <button class="btn btn-primary" onclick="showCreatePOModal()">
                            <i class="fas fa-plus"></i> Create PO
                        </button>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead class="table-dark">
                                <tr>
                                    <th>PO Number</th>
                                    <th>Supplier</th>
                                    <th>Date</th>
                                    <th>Expected Delivery</th>
                                    <th>Items</th>
                                    <th>Total Amount</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="purchaseOrderTable"></tbody>
                        </table>
                    </div>
                </div>

                <!-- GRN Tab -->
                <div class="tab-pane fade" id="grnTab">
                    <div class="tab-header">
                        <h4>Goods Receipt Notes (GRN)</h4>
                        <button class="btn btn-primary" onclick="showRecordGRNModal()">
                            <i class="fas fa-plus"></i> Record GRN
                        </button>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead class="table-dark">
                                <tr>
                                    <th>GRN Number</th>
                                    <th>PO Number</th>
                                    <th>Supplier</th>
                                    <th>Received Date</th>
                                    <th>Items</th>
                                    <th>Quality Check</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="grnTable"></tbody>
                        </table>
                    </div>
                </div>

                <!-- Stock Overview Tab -->
                <div class="tab-pane fade" id="stockTab">
                    <div class="tab-header">
                        <h4>Stock Overview</h4>
                        <div class="btn-group">
                            <button class="btn btn-info" onclick="refreshStockData()">
                                <i class="fas fa-sync"></i> Refresh
                            </button>
                            <button class="btn btn-warning" onclick="showLowStockItems()">
                                <i class="fas fa-exclamation-triangle"></i> Low Stock
                            </button>
                        </div>
                    </div>
                    <div id="stockOverviewContainer"></div>
                </div>

                <!-- Material Movement Tab -->
                <div class="tab-pane fade" id="movementTab">
                    <div class="tab-header">
                        <h4>Material Movement</h4>
                        <button class="btn btn-primary" onclick="showMoveMaterialModal()">
                            <i class="fas fa-exchange-alt"></i> Move Material
                        </button>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead class="table-dark">
                                <tr>
                                    <th>Date</th>
                                    <th>Material</th>
                                    <th>Type</th>
                                    <th>Quantity</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Reason</th>
                                    <th>Authorized By</th>
                                </tr>
                            </thead>
                            <tbody id="movementTable"></tbody>
                        </table>
                    </div>
                </div>

                <!-- Barcode/QR Tab -->
                <div class="tab-pane fade" id="barcodeTab">
                    <div class="tab-header">
                        <h4>Barcode / QR Code System</h4>
                        <div class="btn-group">
                            <button class="btn btn-primary" onclick="generateQRCodes()">
                                <i class="fas fa-qrcode"></i> Generate QR Codes
                            </button>
                            <button class="btn btn-success" onclick="showScannerInterface()">
                                <i class="fas fa-camera"></i> Scan QR Code
                            </button>
                        </div>
                    </div>
                    <div id="qrCodeContainer"></div>
                </div>

                <!-- Reports Tab -->
                <div class="tab-pane fade" id="reportsTab">
                    <div class="tab-header">
                        <h4>Reports & Analytics</h4>
                    </div>
                    <div class="reports-grid">
                        <div class="report-card" onclick="generateStockReport()">
                            <i class="fas fa-warehouse fa-3x"></i>
                            <h5>Stock Report</h5>
                            <p>Current stock levels and valuation</p>
                        </div>
                        <div class="report-card" onclick="generateMovementReport()">
                            <i class="fas fa-exchange-alt fa-3x"></i>
                            <h5>Movement Report</h5>
                            <p>Material movement history</p>
                        </div>
                        <div class="report-card" onclick="generatePurchaseReport()">
                            <i class="fas fa-shopping-cart fa-3x"></i>
                            <h5>Purchase Report</h5>
                            <p>Purchase orders and GRNs</p>
                        </div>
                        <div class="report-card" onclick="generateAgingReport()">
                            <i class="fas fa-clock fa-3x"></i>
                            <h5>Aging Analysis</h5>
                            <p>Stock aging and dead stock</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        const materialSection = document.createElement('div');
        materialSection.id = 'materialManagementSection';
        materialSection.className = 'content-section';
        materialSection.style.display = 'none';
        materialSection.innerHTML = dashboardHTML;
        mainContent.appendChild(materialSection);
    }

    updateMaterialDashboard();
}

// Update Material Dashboard
function updateMaterialDashboard() {
    // Update stats
    const totalMaterials = materialManagementSystem.materials.length;
    const totalStockValue = materialManagementSystem.materials.reduce((sum, m) => 
        sum + (m.currentStock * m.costPerUnit), 0
    );
    const lowStockItems = materialManagementSystem.materials.filter(m => 
        m.currentStock <= m.reorderLevel
    ).length;
    const pendingGRNs = materialManagementSystem.grns.filter(g => 
        g.status === 'pending'
    ).length;

    document.getElementById('totalMaterialsCount').textContent = totalMaterials;
    document.getElementById('totalStockValue').textContent = '₹' + totalStockValue.toLocaleString();
    document.getElementById('lowStockCount').textContent = lowStockItems;
    document.getElementById('pendingGRNCount').textContent = pendingGRNs;

    // Update tables
    updateMaterialMasterTable();
    updatePurchaseOrderTable();
    updateGRNTable();
    updateStockOverview();
    updateMovementTable();
}

// Update Material Master Table
function updateMaterialMasterTable() {
    const tbody = document.getElementById('materialMasterTable');
    if (!tbody) return;

    tbody.innerHTML = materialManagementSystem.materials.map(material => {
        const stockStatus = material.currentStock <= material.reorderLevel ? 'danger' : 'success';
        
        return `
            <tr>
                <td><strong>${material.sku}</strong></td>
                <td>${material.name}</td>
                <td><span class="badge bg-info">${material.category}</span></td>
                <td>${material.size} / ${material.thickness}</td>
                <td>${material.unit}</td>
                <td><span class="badge bg-${stockStatus}">${material.currentStock}</span></td>
                <td>${material.reorderLevel}</td>
                <td>₹${material.costPerUnit}</td>
                <td><code>${material.location}</code></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editMaterial('${material.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-info" onclick="viewMaterialDetails('${material.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-success" onclick="showQRCode('${material.id}')">
                        <i class="fas fa-qrcode"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Update Purchase Order Table
function updatePurchaseOrderTable() {
    const tbody = document.getElementById('purchaseOrderTable');
    if (!tbody) return;

    tbody.innerHTML = materialManagementSystem.purchaseOrders.map(po => {
        const statusColor = po.status === 'completed' ? 'success' : 
                           po.status === 'pending' ? 'warning' : 'info';
        
        return `
            <tr>
                <td><strong>${po.poNumber}</strong></td>
                <td>${po.supplier}</td>
                <td>${new Date(po.date).toLocaleDateString()}</td>
                <td>${new Date(po.expectedDelivery).toLocaleDateString()}</td>
                <td>${po.items.length} items</td>
                <td>₹${po.totalAmount.toLocaleString()}</td>
                <td><span class="badge bg-${statusColor}">${po.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewPODetails('${po.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-success" onclick="createGRNFromPO('${po.id}')">
                        <i class="fas fa-truck-loading"></i> GRN
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Update GRN Table
function updateGRNTable() {
    const tbody = document.getElementById('grnTable');
    if (!tbody) return;

    tbody.innerHTML = materialManagementSystem.grns.map(grn => {
        const statusColor = grn.status === 'completed' ? 'success' : 'warning';
        const qcColor = grn.qualityCheck === 'passed' ? 'success' : 'danger';
        
        return `
            <tr>
                <td><strong>${grn.grnNumber}</strong></td>
                <td>${grn.poNumber}</td>
                <td>${grn.supplier}</td>
                <td>${new Date(grn.receivedDate).toLocaleDateString()}</td>
                <td>${grn.items.length} items</td>
                <td><span class="badge bg-${qcColor}">${grn.qualityCheck}</span></td>
                <td><span class="badge bg-${statusColor}">${grn.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewGRNDetails('${grn.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Update Stock Overview
function updateStockOverview() {
    const container = document.getElementById('stockOverviewContainer');
    if (!container) return;

    const stockHTML = materialManagementSystem.materials.map(material => {
        const stockPercentage = (material.currentStock / (material.reorderLevel * 3)) * 100;
        const statusClass = material.currentStock <= material.reorderLevel ? 'danger' : 
                           material.currentStock <= material.reorderLevel * 2 ? 'warning' : 'success';
        
        return `
            <div class="stock-card">
                <div class="stock-header">
                    <h5>${material.name} (${material.sku})</h5>
                    <span class="badge bg-${statusClass}">${material.currentStock} ${material.unit}</span>
                </div>
                <div class="stock-details">
                    <div><strong>Location:</strong> ${material.location}</div>
                    <div><strong>Reorder Level:</strong> ${material.reorderLevel}</div>
                    <div><strong>Value:</strong> ₹${(material.currentStock * material.costPerUnit).toLocaleString()}</div>
                </div>
                <div class="stock-progress">
                    <div class="progress">
                        <div class="progress-bar bg-${statusClass}" style="width: ${Math.min(stockPercentage, 100)}%"></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `<div class="stock-grid">${stockHTML}</div>`;
}

// Update Movement Table
function updateMovementTable() {
    const tbody = document.getElementById('movementTable');
    if (!tbody) return;

    tbody.innerHTML = materialManagementSystem.stockMovements.map(movement => {
        const typeColor = movement.type === 'inward' ? 'success' : 
                         movement.type === 'outward' ? 'danger' : 'info';
        
        return `
            <tr>
                <td>${new Date(movement.date).toLocaleString()}</td>
                <td><strong>${movement.sku}</strong></td>
                <td><span class="badge bg-${typeColor}">${movement.type}</span></td>
                <td>${movement.quantity}</td>
                <td>${movement.fromLocation}</td>
                <td>${movement.toLocation}</td>
                <td>${movement.reason}</td>
                <td>${movement.authorizedBy}</td>
            </tr>
        `;
    }).join('');
}

// Modal Functions
function showAddMaterialModal() {
    showNotification('info', 'Add Material Modal - Feature to be implemented');
}

function showCreatePOModal() {
    showNotification('info', 'Create PO Modal - Feature to be implemented');
}

function showRecordGRNModal() {
    showNotification('info', 'Record GRN Modal - Feature to be implemented');
}

function showMoveMaterialModal() {
    showNotification('info', 'Move Material Modal - Feature to be implemented');
}

function editMaterial(materialId) {
    showNotification('info', 'Edit Material - Feature to be implemented');
}

function viewMaterialDetails(materialId) {
    showNotification('info', 'View Material Details - Feature to be implemented');
}

function showQRCode(materialId) {
    const material = materialManagementSystem.materials.find(m => m.id === materialId);
    if (material) {
        showNotification('info', `QR Code for ${material.name}: ${material.qrCode}`);
    }
}

function viewPODetails(poId) {
    showNotification('info', 'View PO Details - Feature to be implemented');
}

function createGRNFromPO(poId) {
    showNotification('info', 'Create GRN from PO - Feature to be implemented');
}

function viewGRNDetails(grnId) {
    showNotification('info', 'View GRN Details - Feature to be implemented');
}

function refreshStockData() {
    updateStockOverview();
    showNotification('success', 'Stock data refreshed');
}

function showLowStockItems() {
    const lowStock = materialManagementSystem.materials.filter(m => 
        m.currentStock <= m.reorderLevel
    );
    showNotification('info', `${lowStock.length} items are below reorder level`);
}

function generateQRCodes() {
    showNotification('info', 'QR Code Generation - Feature to be implemented');
}

function showScannerInterface() {
    showNotification('info', 'QR Scanner - Feature to be implemented');
}

function generateStockReport() {
    showNotification('info', 'Stock Report - Feature to be implemented');
}

function generateMovementReport() {
    showNotification('info', 'Movement Report - Feature to be implemented');
}

function generatePurchaseReport() {
    showNotification('info', 'Purchase Report - Feature to be implemented');
}

function generateAgingReport() {
    showNotification('info', 'Aging Analysis - Feature to be implemented');
}

// Export functions
window.materialManagementSystem = materialManagementSystem;
window.initializeMaterialManagementSystem = initializeMaterialManagementSystem;
window.showAddMaterialModal = showAddMaterialModal;
window.showCreatePOModal = showCreatePOModal;
window.showRecordGRNModal = showRecordGRNModal;
window.showMoveMaterialModal = showMoveMaterialModal;
window.editMaterial = editMaterial;
window.viewMaterialDetails = viewMaterialDetails;
window.showQRCode = showQRCode;
window.viewPODetails = viewPODetails;
window.createGRNFromPO = createGRNFromPO;
window.viewGRNDetails = viewGRNDetails;
window.refreshStockData = refreshStockData;
window.showLowStockItems = showLowStockItems;
window.generateQRCodes = generateQRCodes;
window.showScannerInterface = showScannerInterface;
window.generateStockReport = generateStockReport;
window.generateMovementReport = generateMovementReport;
window.generatePurchaseReport = generatePurchaseReport;
window.generateAgingReport = generateAgingReport;
