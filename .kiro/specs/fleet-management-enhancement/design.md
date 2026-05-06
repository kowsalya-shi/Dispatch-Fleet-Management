# Design Document: Fleet Management Enhancement

## Overview

This design document outlines the technical approach for enhancing the existing Fleet Management System with warehouse management integration, improved dispatch workflows, order management with priority filters, communication integrations, and real-time data synchronization. The enhancement preserves the existing Bootstrap 5 + JavaScript architecture while adding new capabilities that integrate seamlessly with current functionality.

### System Context

The Fleet Management System is a web-based application that manages:
- Vehicle fleet operations and tracking
- Driver management and assignments
- Route planning and optimization
- Trip monitoring and completion
- GPS tracking and real-time location
- Document management
- User management and authentication

### Enhancement Goals

1. Add warehouse management module for multi-location inventory tracking
2. Implement visual 7-step dispatch workflow with progress tracking
3. Restore and enhance order management with priority-based filtering
4. Integrate WhatsApp and email communication capabilities
5. Ensure real-time data synchronization across all modules
6. Standardize vehicle status terminology (active → available)
7. Enhance forms with automatic timestamps and validation
8. Maintain existing architecture and mobile responsiveness

## Architecture

### High-Level Architecture

The system follows a client-side architecture with the following components:

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface Layer                     │
│  (Bootstrap 5 + Custom CSS + Font Awesome Icons)            │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                  Application Logic Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   script.js  │  │ automation-  │  │  inventory-  │     │
│  │  (Core App)  │  │  engine.js   │  │reconciliation│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   guided-    │  │  warehouse-  │  │ communication│     │
│  │  workflow.js │  │  management  │  │ -integration │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  dispatch-   │  │    route-    │  │    fuel-     │     │
│  │  tracking.js │  │ monitoring.js│  │ management.js│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │collaborative-│  │    trip-     │  │   vehicle-   │     │
│  │ dispatch.js  │  │ lifecycle.js │  │ ownership.js │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    fuel-     │  │  material-   │  │  thin-sheet- │     │
│  │ analysis.js  │  │  master.js   │  │  handling.js │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │  material-   │  │  location-   │                        │
│  │ tracking.js  │  │  storage.js  │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  sampleData  │  │ localStorage │  │  Session     │     │
│  │  (In-Memory) │  │   Storage    │  │  Storage     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                  External Integrations                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   WhatsApp   │  │    Email     │  │  Google Maps │     │
│  │     API      │  │   Service    │  │     API      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │     ERP      │  │     GPS      │                        │
│  │  Integration │  │   Tracking   │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### Module Integration

The enhancement adds new modules that integrate with existing functionality:

1. **Warehouse Management Module** - Integrates with Order Management and Material tracking
2. **Enhanced Dispatch Workflow** - Coordinates between Orders, Vehicles, Drivers, and Routes
3. **Communication Integration** - Provides notifications across all modules
4. **Real-Time Sync Engine** - Ensures data consistency across all modules
5. **Dispatch Tracking Visibility** - Real-time monitoring of dispatch operations with GPS integration
6. **Route Assignment Monitoring** - Tracks route assignments and detects deviations
7. **Fuel Management System** - Monitors fuel consumption and detects potential theft
8. **Collaborative Dispatch** - Optimizes order consolidation for same routes
9. **Trip Lifecycle Management** - Manages complete trip workflow from ERP order to reporting
10. **Vehicle Ownership Management** - Unified tracking of owned and third-party vehicles with cost analysis
11. **Advanced Fuel Analysis** - Comprehensive fuel monitoring with anomaly detection and predictive analytics
12. **Material Master Data Management** - Large-scale material database with advanced search and bulk operations
13. **Real-Time Material Tracking** - Track materials through 6 lifecycle stages from warehouse pickup to customer confirmation
14. **Specialized Thin Sheet Material Handling** - Special handling procedures for thin sheet materials with damage prevention and storage optimization
15. **Centralized Location-Based Storage Management** - Hierarchical location tracking with precise bin-level storage management and warehouse navigation

### Technology Stack

- **Frontend Framework**: Bootstrap 5.3.0
- **JavaScript**: Vanilla ES6+ (no frameworks)
- **CSS**: Custom styles.css + Bootstrap utilities
- **Icons**: Font Awesome 6.0.0
- **Maps**: Leaflet.js 1.9.4 + Google Maps API
- **Charts**: Chart.js (for dashboard visualizations)
- **Storage**: localStorage for persistence, sessionStorage for temporary data

## Components and Interfaces

### 1. Warehouse Management Module

#### Component Structure

```javascript
// warehouse-management.js

const warehouseModule = {
    warehouses: [],
    materials: [],
    stockLevels: {},
    transfers: []
};
```

#### Key Functions

- `initializeWarehouseModule()` - Initialize warehouse data and UI
- `addWarehouse(warehouseData)` - Add new warehouse location
- `updateMaterialStock(materialCode, warehouseId, quantity)` - Update stock levels
- `checkMaterialAvailability(materialCode, requiredQuantity)` - Check stock across warehouses
- `findAlternativeSource(materialCode, currentWarehouse)` - Find material in other warehouses
- `initiateStockTransfer(materialCode, fromWarehouse, toWarehouse, quantity)` - Transfer stock
- `updateWarehouseDashboard()` - Refresh warehouse statistics

#### UI Components

- Warehouse list table with location details
- Material inventory table with multi-warehouse view
- Stock transfer form (modal-based)
- Warehouse dashboard with statistics
- Low stock alerts and notifications

### 2. Enhanced Dispatch Workflow

#### Workflow Steps

```javascript
const dispatchWorkflow = {
    steps: [
        { id: 1, name: 'Sales Order', status: 'pending' },
        { id: 2, name: 'Warehouse', status: 'pending' },
        { id: 3, name: 'Invoice', status: 'pending' },
        { id: 4, name: 'Vehicle & Driver Assignment', status: 'pending' },
        { id: 5, name: 'Dispatch', status: 'pending' },
        { id: 6, name: 'Tracker', status: 'pending' },
        { id: 7, name: 'Delivered', status: 'pending' }
    ]
};
```

#### Key Functions

- `initializeDispatchWorkflow(orderId)` - Create workflow instance for order
- `completeWorkflowStep(orderId, stepId)` - Mark step as complete
- `getWorkflowProgress(orderId)` - Calculate completion percentage
- `validateStepCompletion(orderId, stepId)` - Ensure prerequisites are met
- `updateWorkflowUI(orderId)` - Refresh visual progress indicator
- `sendWorkflowNotification(orderId, stepId)` - Notify stakeholders of progress

#### UI Components

- Visual workflow progress bar with 7 steps
- Step-by-step completion buttons
- Workflow status indicators (pending, in-progress, completed)
- Workflow history and audit trail
- Color-coded step highlighting (gray → yellow → green)

### 3. Order Management with Priority Filters

#### Data Structure

```javascript
const orderManagement = {
    orders: [],
    priorities: ['urgent', 'high', 'normal'],
    statuses: ['pending', 'processing', 'assigned', 'dispatched', 'in-transit', 'delivered', 'completed']
};
```

#### Key Functions

- `createOrder(orderData)` - Create new order with validation
- `filterOrdersByPriority(priority)` - Filter pending orders
- `assignOrderResources(orderId, vehicleId, driverId)` - Assign vehicle and driver
- `updateOrderStatus(orderId, newStatus)` - Change order status
- `getOrdersByStatus(status)` - Retrieve orders by status
- `calculateOrderMetrics()` - Generate order statistics
- `syncOrderWithFleet()` - Synchronize with fleet management data

#### UI Components

- Order creation form (modal-based) with all required fields
- Priority filter dropdown (All, Urgent, High, Normal)
- Order list table with sortable columns
- Order detail view with full information
- Quick action buttons (Assign, View, Contact, Edit)

### 4. Communication Integration

#### Integration Points

```javascript
const communicationIntegration = {
    whatsapp: {
        enabled: true,
        phoneNumber: '7676654118',
        apiEndpoint: 'https://api.whatsapp.com/send'
    },
    email: {
        enabled: true,
        address: 'shinydora753152@gmail.com',
        smtpConfig: {}
    }
};
```

#### Key Functions

- `sendWhatsAppNotification(phoneNumber, message)` - Send WhatsApp message
- `sendEmailNotification(recipient, subject, body)` - Send email
- `notifyOrderCreated(orderId)` - Notify stakeholders of new order
- `notifyWorkflowProgress(orderId, stepName)` - Update on workflow progress
- `notifyDeliveryComplete(orderId)` - Confirm delivery completion
- `sendBulkNotifications(recipients, message)` - Send to multiple recipients

#### UI Components

- WhatsApp integration button in header
- Email integration button in header
- Notification settings panel
- Communication history log
- Template management for common messages

### 5. Real-Time Data Synchronization

#### Sync Engine

```javascript
const syncEngine = {
    syncInterval: 5000, // 5 seconds
    modules: ['dashboard', 'vehicles', 'drivers', 'orders', 'warehouse'],
    lastSync: {},
    pendingUpdates: []
};
```

#### Key Functions

- `initializeSyncEngine()` - Start real-time synchronization
- `syncModule(moduleName)` - Sync specific module
- `detectDataChanges(moduleName)` - Identify changed data
- `propagateChanges(changes)` - Update all affected modules
- `updateDashboardStats()` - Refresh dashboard in real-time
- `handleConflicts(conflicts)` - Resolve data conflicts

#### Sync Triggers

- Vehicle status changes → Update dashboard, dispatch workflow
- Driver availability changes → Update dashboard, resource availability
- Order creation/update → Update dashboard, warehouse, dispatch
- Material stock changes → Update warehouse dashboard, order validation
- Trip status changes → Update dashboard, workflow progress

### 6. Enhanced Forms with Validation

#### Form Enhancement Pattern

```javascript
const formEnhancement = {
    autoTimestamp: true,
    validation: true,
    autoSave: false,
    modalBased: true
};
```

#### Key Functions

- `enhanceForm(formId)` - Add timestamp and validation
- `validateFormField(field, rules)` - Validate individual field
- `addTimestamp(formData)` - Add creation/modification timestamps
- `showValidationErrors(errors)` - Display validation messages
- `resetFormModal(modalId)` - Clear form for new entry
- `populateFormForEdit(formId, data)` - Load data for editing

#### Validation Rules

- Required fields marked with red asterisk
- Phone number format validation (10 digits)
- Email format validation (RFC 5322)
- Quantity minimum value validation (> 0)
- Date/time automatic population
- Dropdown selection validation

### 7. Enhanced Dispatch Tracking Visibility

#### Component Structure

```javascript
// dispatch-tracking.js

const dispatchTracking = {
    activeDispatches: [],
    trackingInterval: 10000, // 10 seconds
    mapInstance: null,
    markers: {},
    alerts: []
};
```

#### Key Functions

- `initializeDispatchTracking()` - Initialize tracking dashboard and map
- `loadActiveDispatches()` - Fetch all active dispatches
- `updateDispatchLocation(dispatchId, coordinates)` - Update GPS position on map
- `calculateETA(dispatchId)` - Calculate estimated time of arrival
- `checkDelayStatus(dispatchId)` - Detect and alert on delays
- `updateWorkflowStatus(dispatchId, step)` - Update workflow step indicators
- `filterDispatches(criteria)` - Filter by date, route, vehicle, driver, status
- `logDispatchActivity(dispatchId, activity)` - Record activity with timestamp
- `refreshTrackingDashboard()` - Update all tracking information

#### UI Components

- Real-time dispatch dashboard with active dispatch cards
- Interactive map (Leaflet.js) with live GPS markers
- Workflow step indicators (7-step progress bar)
- ETA display with countdown timer
- Delay alert notifications (toast/modal)
- Filter panel (date range, route, vehicle, driver, status)
- Activity log table with timestamps
- Status badges (On Time, Delayed, Completed)

### 8. Route Assignment Monitoring System

#### Component Structure

```javascript
// route-monitoring.js

const routeMonitoring = {
    assignments: [],
    routeDeviations: [],
    utilizationMetrics: {},
    auditTrail: []
};
```

#### Key Functions

- `trackRouteAssignment(routeId, vehicleId, driverId)` - Record route assignment
- `displayRouteAssignments()` - Show current assignments on dashboard
- `detectRouteDeviation(vehicleId, expectedRoute, actualPath)` - Compare routes
- `alertRouteDeviation(vehicleId, deviation)` - Send deviation alert
- `calculateRouteUtilization(routeId)` - Calculate distance, time, stops metrics
- `suggestOptimalVehicle(routeId, loadRequirements)` - Recommend vehicle
- `verifyRouteCompliance(vehicleId)` - Check GPS path against assigned route
- `logAssignmentChange(routeId, change)` - Record audit trail
- `generateRouteMetrics()` - Create utilization reports

#### UI Components

- Route assignment dashboard with vehicle/driver cards
- Interactive map showing assigned routes and vehicle positions
- Route deviation alerts (real-time notifications)
- Utilization metrics panel (distance, time, stops, capacity)
- Audit trail table with change history
- Route capacity calculator
- Vehicle suggestion panel based on load requirements
- Compliance status indicators (On Route, Deviated, Completed)

### 9. Fuel Management and Theft Prevention

#### Component Structure

```javascript
// fuel-management.js

const fuelManagement = {
    fuelRecords: [],
    vehicleEfficiency: {},
    theftAlerts: [],
    costAnalysis: {},
    thresholdVariance: 15 // 15% variance threshold
};
```

#### Key Functions

- `recordFuelTransaction(vehicleId, quantity, cost, odometer, location)` - Log fuel fill-up
- `calculateExpectedConsumption(vehicleId, distance)` - Calculate based on efficiency
- `compareActualVsExpected(vehicleId)` - Detect consumption discrepancies
- `detectFuelTheft(vehicleId, variance)` - Flag abnormal patterns (>15% variance)
- `sendTheftAlert(vehicleId, details)` - Notify managers of potential theft
- `generateEfficiencyReport(vehicleId, period)` - Create efficiency reports
- `calculateFuelCost(tripId)` - Calculate cost per trip
- `calculateCostPerKm(vehicleId)` - Calculate cost per kilometer
- `correlateFuelWithGPS(vehicleId, period)` - Match distance with consumption
- `logFuelTransaction(transaction)` - Maintain transaction log

#### UI Components

- Fuel transaction form (modal) with odometer, quantity, cost, location
- Fuel consumption dashboard with actual vs expected comparison
- Theft alert panel with flagged vehicles and variance details
- Efficiency reports table (by vehicle, driver, route)
- Cost analysis charts (per trip, per km, trends)
- Fuel transaction log with date, time, location, quantity, cost
- GPS correlation view showing distance vs fuel consumed
- Alert notifications for potential theft (toast/modal)

### 10. Collaborative Dispatch and Route Optimization

#### Component Structure

```javascript
// collaborative-dispatch.js

const collaborativeDispatch = {
    pendingOrders: [],
    routeSuggestions: [],
    consolidatedDispatches: [],
    savingsCalculator: {}
};
```

#### Key Functions

- `analyzePendingOrders()` - Identify orders with same/nearby routes
- `suggestOrderConsolidation()` - Group orders for same route
- `calculateSavings(consolidation)` - Estimate cost savings and efficiency gains
- `checkVehicleCapacity(vehicleId, orders)` - Verify load limits
- `prioritizeConsolidations(suggestions)` - Rank by deadline and priority
- `createCollaborativeDispatch(orderIds)` - Create consolidated dispatch
- `trackIndividualOrders(dispatchId)` - Maintain separate tracking per order
- `allowManualOverride(suggestion)` - Enable customization
- `displaySuggestions()` - Show consolidation recommendations

#### UI Components

- Pending orders panel with route information
- Consolidation suggestion cards with order details
- Savings calculator display (fuel, time, vehicle usage)
- Vehicle capacity checker with load visualization
- Priority indicator (deadline, priority level)
- One-click consolidation button
- Individual order tracking within consolidated dispatch
- Manual override controls for customization
- Cost savings summary (estimated vs actual)

### 11. Comprehensive Trip Lifecycle Management Workflow

#### Component Structure

```javascript
// trip-lifecycle.js

const tripLifecycle = {
    workflows: [],
    steps: [
        { id: 1, name: 'Order Creation (ERP)', status: 'pending' },
        { id: 2, name: 'Planning', status: 'pending' },
        { id: 3, name: 'Trip Creation', status: 'pending' },
        { id: 4, name: 'Dispatch Execution', status: 'pending' },
        { id: 5, name: 'Live Tracking & Delivery', status: 'pending' },
        { id: 6, name: 'Trip Closure', status: 'pending' },
        { id: 7, name: 'Reporting', status: 'pending' }
    ],
    erpIntegration: {},
    rolePermissions: {}
};
```

#### Key Functions

- `syncERPOrders()` - Automatically receive and sync sales orders from ERP
- `initiatePlanning(orderId)` - Start planning stage with route optimization
- `createTrip(tripData)` - Create trip with vehicle, driver, route, load details
- `executeDispatch(tripId)` - Confirm departure, verify documents, authorize dispatch
- `startLiveTracking(tripId)` - Enable real-time GPS tracking and ETA calculation
- `recordDelivery(tripId, proofOfDelivery)` - Capture delivery confirmation
- `closeTrip(tripId, closureData)` - Record odometer, fuel, completion details
- `generateTripReport(tripId)` - Create comprehensive trip summary
- `validateWorkflowStep(tripId, stepId)` - Enforce sequential progression
- `logWorkflowTransition(tripId, fromStep, toStep)` - Maintain audit trail
- `checkRolePermission(userId, stepId)` - Verify role-based access
- `sendWorkflowNotification(tripId, milestone)` - Notify stakeholders

#### UI Components

- 7-step workflow progress indicator with visual status
- ERP order sync panel with automatic order import
- Planning dashboard with route optimization and resource allocation
- Trip creation form with vehicle, driver, route, load planning
- Dispatch execution checklist (departure, documents, authorization)
- Live tracking map with GPS updates and ETA display
- Trip closure form with proof of delivery, odometer, fuel consumption
- Reporting dashboard with trip summaries, metrics, cost analysis
- Workflow audit trail table with timestamps
- Role-based access controls for each step
- Automated notification system for milestones
- Step validation to prevent skipping

### 12. Vehicle Ownership Management (Owned and Third-Party)

#### Component Structure

```javascript
// vehicle-ownership.js

const vehicleOwnership = {
    vehicles: [],
    ownershipTypes: ['owned', 'third-party'],
    vendors: [],
    contracts: [],
    performanceMetrics: {}
};
```

#### Key Functions

- `addVehicle(vehicleData, ownershipType)` - Add vehicle with ownership classification
- `updateOwnershipDetails(vehicleId, details)` - Update ownership-specific information
- `trackOwnedVehicle(vehicleId, maintenanceData)` - Track owned vehicle details (purchase date, depreciation, maintenance)
- `trackThirdPartyVehicle(vehicleId, contractData)` - Track third-party contract details (vendor, rates, terms)
- `calculateCostStructure(vehicleId)` - Calculate ownership-specific costs
- `generateOwnershipReport(ownershipType)` - Create performance reports by ownership type
- `trackVendorPerformance(vendorId)` - Monitor third-party vendor metrics
- `alertContractRenewal(contractId)` - Send contract expiration alerts
- `filterByOwnership(ownershipType)` - Filter vehicles by ownership type
- `manageMaintenanceSchedule(vehicleId)` - Handle maintenance based on ownership type

#### UI Components

- Vehicle list with ownership type badges (Owned/Third-Party)
- Ownership details panel with type-specific fields
- Owned vehicle form (purchase date, depreciation, insurance, maintenance schedule)
- Third-party vehicle form (vendor, contract dates, rental rates, payment terms)
- Cost structure calculator by ownership type
- Vendor performance dashboard (on-time delivery, vehicle condition, compliance)
- Contract renewal alerts and notifications
- Ownership filter dropdown in vehicle lists
- Maintenance schedule manager with ownership-based responsibilities
- Comparative reporting (owned vs third-party performance)

### 13. Advanced Fuel Analysis and Misuse Prevention

#### Component Structure

```javascript
// fuel-analysis.js

const fuelAnalysis = {
    fuelRecords: [],
    baselineEfficiency: {},
    anomalyDetection: {},
    predictiveAnalytics: {},
    driverRankings: [],
    alerts: []
};
```

#### Key Functions

- `trackFuelConsumption(vehicleId, driverId, routeId, data)` - Record detailed fuel patterns
- `establishBaseline(vehicleId)` - Calculate baseline efficiency from historical data
- `detectAnomalies(vehicleId, transaction)` - Identify unusual patterns (spikes, timing, location)
- `compareVehicles(vehicleIds)` - Compare fuel consumption across similar vehicles
- `predictConsumption(routeId, loadWeight)` - Predict expected fuel usage
- `generateMisuseAlert(vehicleId, severity)` - Create alerts with severity levels
- `trackRefuelingLocation(transaction)` - Monitor and flag unauthorized locations
- `rankDriverEfficiency()` - Generate driver fuel efficiency rankings
- `calculateTotalCostOfOwnership(vehicleId)` - Include fuel costs by ownership type
- `analyzeTrends(period)` - Generate trend analysis with charts
- `integrateOwnershipData(vehicleId)` - Provide ownership-specific fuel analysis
- `bulkImportFuelData(file)` - Import fuel data from CSV/Excel
- `exportFuelData(filters)` - Export fuel data for external analysis

#### UI Components

- Detailed fuel consumption dashboard with patterns by vehicle, driver, route, time
- Baseline efficiency display for each vehicle
- Anomaly detection panel with alerts (spikes, unusual timing, off-route refueling)
- Vehicle comparison charts for similar vehicles and routes
- Predictive analytics calculator for route and load
- Fuel misuse alert panel with severity indicators (low, medium, high, critical)
- Refueling location map with authorized/unauthorized flags
- Driver efficiency leaderboard with rankings
- Total cost of ownership calculator (owned vs third-party)
- Trend analysis charts showing consumption over time
- Ownership-specific fuel analysis reports
- Bulk import/export functionality for fuel data

### 14. Large-Scale Material Master Data Management (7,000+ Materials)

#### Component Structure

```javascript
// material-master.js

const materialMaster = {
    materials: [],
    categories: [],
    suppliers: [],
    variants: {},
    lifecycle: {},
    usageAnalytics: {},
    pagination: { page: 1, pageSize: 50, totalPages: 0 },
    filters: {},
    favorites: []
};
```

#### Key Functions

- `loadMaterials(page, pageSize)` - Load materials with pagination (50-100 per page)
- `advancedSearch(criteria)` - Search by code, name, category, supplier, specifications
- `manageCategorization(materialId, hierarchy)` - Handle hierarchical categories (category, sub-category, type)
- `bulkImport(file)` - Import materials from CSV/Excel
- `bulkExport(filters)` - Export materials for external analysis
- `bulkUpdate(materialIds, updates)` - Update multiple materials (pricing, categories, suppliers, status)
- `filterMaterials(criteria)` - Filter by category, status, supplier, warehouse, stock level
- `manageVariants(materialId, variants)` - Handle material variants (size, color, grade, finish)
- `trackLifecycle(materialId, status)` - Track lifecycle (active, discontinued, obsolete, pending)
- `analyzeUsage(materialId)` - Provide usage analytics (most ordered, slow-moving, out-of-stock frequency)
- `validateData(materialData)` - Enforce data quality rules (unique codes, required fields, format validation)
- `manageRelationships(materialId, relationships)` - Handle substitutes, alternatives, bundles, kits
- `manageFavorites(userId, materialId)` - Quick access to frequently used materials
- `trackChangeHistory(materialId)` - Maintain audit trail of changes

#### UI Components

- Material list table with pagination (50-100 records per page)
- Advanced search panel (code, name, category, supplier, specifications)
- Hierarchical category tree (category → sub-category → type)
- Bulk import/export interface with CSV/Excel support
- Bulk update form for multiple materials
- Multi-criteria filter panel (category, status, supplier, warehouse, stock level)
- Variant management form (size, color, grade, finish)
- Lifecycle status indicator (active, discontinued, obsolete, pending)
- Usage analytics dashboard (most ordered, slow-moving, out-of-stock frequency)
- Data validation feedback with error highlighting
- Material relationships manager (substitutes, alternatives, bundles, kits)
- Favorites/bookmarks panel for quick access
- Change history log with audit trail
- Performance-optimized list rendering for 7,000+ materials

### 15. Real-Time Material Tracking Throughout Delivery Lifecycle

#### Component Structure

```javascript
// material-tracking.js

const materialTracking = {
    trackingRecords: [],
    lifecycleStages: [
        { id: 1, name: 'Warehouse Pickup', status: 'pending' },
        { id: 2, name: 'In Transit', status: 'pending' },
        { id: 3, name: 'Checkpoint Scan', status: 'pending' },
        { id: 4, name: 'Near Delivery', status: 'pending' },
        { id: 5, name: 'Delivered', status: 'pending' },
        { id: 6, name: 'Confirmed', status: 'pending' }
    ],
    activeTracking: {},
    trackingHistory: [],
    alerts: [],
    customerPortal: {}
};
```

### 16. Specialized Thin Sheet Material Handling

#### Component Structure

```javascript
// thin-sheet-handling.js

const thinSheetHandling = {
    thinSheetCategories: ['laminates', 'sheets', 'panels', 'boards'],
    handlingRules: {},
    stackingLimits: {},
    storageRequirements: {},
    damageTracking: [],
    complianceScores: {},
    climateMonitoring: {}
};
```

#### Key Functions

- `identifyThinSheetMaterial(materialCategory)` - Identify if material is thin sheet type
- `enforceHandlingInstructions(materialId)` - Display and enforce special handling rules
- `calculateOptimalStackHeight(materialThickness, materialWeight)` - Calculate safe stacking limit
- `requireEdgeProtection(materialId)` - Mandate edge protection and corner guards
- `enforceFlatStorage(materialId)` - Ensure flat horizontal storage position
- `setStackHeightLimit(materialType)` - Set maximum stack height (e.g., 50 sheets for laminates)
- `requireProtectivePackaging(materialId)` - Mandate bubble wrap, cardboard separators, plastic covering
- `enforceClimateControl(warehouseId, temperature, humidity)` - Monitor temperature (15-25°C) and humidity (40-60%)
- `displayHandlingChecklist(materialId)` - Show handling instructions for warehouse staff
- `trackDamageIncident(materialId, stage, damageType)` - Record damage by material type and handling stage
- `generateDamagePreventionReport(period)` - Create damage analysis and recommendations
- `validateVehicleForThinSheets(vehicleId, materialId)` - Ensure vehicle has flat bed, no tilting capability
- `alertUnsuitableVehicle(vehicleId, materialId)` - Alert when thin sheets assigned to unsuitable vehicle
- `displayThinSheetIndicator(materialId)` - Show visual indicator in all interfaces
- `calculateComplianceScore(warehouseId, handlerId)` - Track handling compliance by warehouse and handler

#### UI Components

- Thin sheet material badge/indicator (icon or label) in material lists
- Handling instructions panel with checklist for warehouse staff
- Stacking calculator showing optimal and maximum stack height
- Edge protection requirement indicator with visual guide
- Flat storage position indicator (horizontal icon)
- Protective packaging checklist (bubble wrap, separators, covering)
- Climate control monitor with temperature and humidity gauges
- Damage tracking form with incident type, stage, and photos
- Damage prevention dashboard with statistics by material type
- Vehicle suitability checker for thin sheet materials
- Vehicle loading instructions panel (flat bed, secure strapping, no tilting)
- Compliance score dashboard by warehouse and handler
- Visual alerts for unsuitable vehicle assignments
- Handling compliance report with scores and recommendations

### 17. Centralized Location-Based Storage Management

#### Component Structure

```javascript
// location-storage.js

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
    heatMaps: {},
    navigationPaths: {}
};
```

#### Key Functions

- `createLocationHierarchy(warehouse, zone, aisle, rack, level, bin)` - Create hierarchical location structure
- `generateLocationCode(warehouse, zone, aisle, rack, level, bin)` - Generate unique code (e.g., WH01-A-05-R3-L2-B12)
- `trackMaterialLocation(materialId, locationCode)` - Track material location in real-time
- `updateMaterialLocation(materialId, newLocationCode)` - Update location on material movement
- `displayWarehouseMap(warehouseId)` - Show visual warehouse map with material locations
- `searchByLocation(locationCode)` - Find all materials in specific location
- `calculateOptimalLocation(materialCharacteristics)` - Suggest storage location based on size, weight, access frequency
- `suggestStorageLocation(materialId, incomingQuantity)` - Recommend location for incoming materials
- `trackCapacityUtilization(zone, aisle, rack)` - Calculate storage capacity utilization
- `findMaterial(materialId)` - Provide turn-by-turn navigation to material location
- `scanLocationBarcode(locationCode)` - Verify location during put-away and picking
- `maintainLocationHistory(materialId)` - Track where material was stored previously
- `generateHeatMap(warehouseId, period)` - Show frequently accessed locations
- `optimizeStorageLayout(warehouseId)` - Suggest layout optimization based on movement patterns
- `alertIncorrectLocation(materialId, expectedLocation, actualLocation)` - Alert when material in wrong location
- `getMobileInterface()` - Provide mobile-friendly interface for handheld devices

#### UI Components

- Hierarchical location tree view (Warehouse → Zone → Aisle → Rack → Level → Bin)
- Location code generator and validator
- Interactive warehouse map with clickable locations and material highlights
- Material location search with autocomplete
- Optimal location calculator with material characteristics input
- Storage location suggestion panel for incoming materials
- Capacity utilization dashboard by zone, aisle, and rack with progress bars
- "Find Material" navigation interface with turn-by-turn directions
- Barcode scanner interface for location verification
- Location history timeline for each material
- Heat map visualization showing frequently accessed locations
- Storage layout optimizer with recommendations
- Incorrect location alert panel with correction options
- Mobile-optimized interface for warehouse staff with handheld devices
- Location-based filter in material search
- Capacity status indicators (Available, Partial, Full)
- Location assignment form for put-away operations
- Location verification checklist for picking operations

#### Key Functions

- `initiateMaterialTracking(shipmentId, materials)` - Start tracking for shipment with multiple materials
- `recordTrackingEvent(materialId, stage, data)` - Record tracking event with timestamp, GPS, condition
- `updateMaterialLocation(materialId, coordinates, address)` - Update real-time GPS location
- `scanBarcode(materialId, stage, scannerData)` - Process barcode/QR code scan at checkpoint
- `captureConditionPhoto(materialId, stage, photo)` - Capture and store condition photos
- `recordHandlerInfo(materialId, stage, handlerData)` - Track who handled material at each stage
- `checkMaterialCondition(materialId, conditionData)` - Monitor condition (good, damaged, temperature alerts)
- `calculateEstimatedDelivery(materialId)` - Calculate and display ETA for material
- `sendTrackingNotification(materialId, stage, recipients)` - Send automated notifications at milestones
- `trackMultipleMaterials(shipmentId)` - Track multiple materials within single shipment separately
- `generateTrackingNumber(materialId)` - Generate unique tracking number for customer lookup
- `getTrackingHistory(materialId)` - Retrieve complete tracking history with audit trail
- `detectDelayOrDeviation(materialId)` - Monitor for delays, route deviations, condition issues
- `updateTrackingDashboard()` - Refresh real-time tracking dashboard
- `linkMaterialToOrder(materialId, orderId)` - Integrate with order management system
- `getCustomerTrackingInfo(trackingNumber)` - Provide customer-facing tracking information

#### UI Components

- Material tracking dashboard with real-time status updates for all active shipments
- Interactive map showing material locations with GPS markers
- 6-stage lifecycle progress indicator (Warehouse Pickup → In Transit → Checkpoint Scan → Near Delivery → Delivered → Confirmed)
- Barcode/QR code scanner interface for checkpoint verification
- Photo capture interface for condition documentation (pickup and delivery)
- Condition monitoring panel with status indicators (good, damaged, temperature-sensitive alerts)
- Handler information display (who picked up, who delivered) at each stage
- ETA calculator and display for each material
- Tracking history timeline with complete audit trail
- Automated notification panel showing sent alerts
- Multi-material shipment view with individual tracking per material
- Customer-facing tracking portal with tracking number lookup
- Alert panel for delays, route deviations, and condition issues
- Material-to-order linkage display
- Timestamp and GPS location display for each tracking event
- Condition status badges (Good, Damaged, Temperature Alert, Delayed)

### 18. System-Generated Material Picking List

#### Component Structure

```javascript
// picking-list.js

const pickingListSystem = {
    pickingLists: [],
    pickingQueue: [],
    assignedPickers: {},
    pickingPerformance: {},
    batchPicking: {},
    routeOptimization: {}
};
```

#### Key Functions

- `generatePickingList(orderId)` - Automatically generate picking list when order confirmed
- `optimizePickingSequence(pickingList)` - Optimize picking route based on warehouse layout
- `batchPickingLists(orderIds)` - Group multiple orders for batch picking
- `prioritizePickingLists(pickingLists)` - Sort by order priority and delivery deadlines
- `displayPickingRoute(pickingListId)` - Show visual map with highlighted locations and route
- `scanPickedItem(pickingListId, materialId, quantity)` - Confirm material picked via barcode
- `updatePickStatus(pickingListId, status)` - Update picking progress (pending, in-progress, completed)
- `alertQuantityMismatch(pickingListId, materialId, expected, actual)` - Alert on quantity discrepancies
- `handlePartialPicking(pickingListId, materialId, pickedQuantity)` - Create backorder for out-of-stock
- `updateStockOnCompletion(pickingListId)` - Update warehouse stock after picking completed
- `calculatePickingMetrics(pickerId, period)` - Generate performance metrics (time, accuracy, items/hour)
- `assignPickingList(pickingListId, pickerId)` - Assign to warehouse staff with workload balancing
- `notifyPickerAssignment(pickerId, pickingListId)` - Send notification to assigned staff
- `provideMobileGuidance(pickingListId)` - Mobile-optimized step-by-step picking interface
- `enableVoiceGuidedPicking(pickingListId)` - Voice commands for hands-free operation
- `capturePickerSignature(pickingListId, signature)` - Record completion signature and timestamp
- `displayHandlingInstructions(materialId)` - Show thin sheet handling rules during picking
- `printPickingListWithQR(pickingListId)` - Generate printable list with QR code
- `maintainPickingHistory(pickingListId)` - Store audit trail of completed picks

#### UI Components

- Picking list dashboard showing all active, pending, and completed lists
- Picking list generation form with order selection and batch options
- Optimized route visualization on warehouse map with numbered sequence
- Mobile picking interface with large buttons and barcode scanner
- Real-time picking progress tracker with item-by-item status
- Quantity verification form with mismatch alerts
- Partial picking form with backorder creation
- Picker assignment panel with workload distribution
- Performance metrics dashboard (time per pick, accuracy rate, productivity)
- Voice-guided picking interface with audio prompts
- Signature capture pad for completion confirmation
- Special handling instructions overlay for thin sheet materials
- Printable picking list template with QR code
- Picking history log with filtering and search
- Batch picking consolidation view showing multiple orders
- Priority indicator badges (Urgent, High, Normal)
- Stock availability checker during list generation
- Turn-by-turn navigation with distance and time estimates

## Data Models

### Warehouse Model

```javascript
{
    id: 'WH001',
    code: 'CHN-MAIN',
    name: 'Chennai Main Warehouse',
    location: {
        address: 'No. 123, Industrial Estate, Chennai',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600001',
        coordinates: { lat: 13.0827, lng: 80.2707 }
    },
    capacity: {
        total: 10000,
        used: 6500,
        available: 3500,
        unit: 'sq ft'
    },
    manager: {
        name: 'Warehouse Manager',
        phone: '+91 98765 43210',
        email: 'manager@warehouse.com'
    },
    operatingHours: {
        weekdays: '08:00 - 20:00',
        weekends: '09:00 - 18:00'
    },
    status: 'active',
    createdDate: '2024-01-01',
    lastUpdated: '2024-03-15T10:30:00Z'
}
```

### Material Model (Enhanced)

```javascript
{
    id: 'MAT001',
    code: 'LAM001',
    name: 'Satin Laminate',
    category: 'laminate',
    description: 'Premium quality satin finish laminate',
    specifications: {
        dimensions: '8ft x 4ft',
        thickness: '1mm',
        weight: '5kg per sheet'
    },
    stockByWarehouse: {
        'WH001': { quantity: 500, minLevel: 50, maxLevel: 1000 },
        'WH002': { quantity: 300, minLevel: 50, maxLevel: 800 },
        'WH003': { quantity: 150, minLevel: 50, maxLevel: 500 }
    },
    totalStock: 950,
    unit: 'sheets',
    unitPrice: 1500.00,
    supplier: {
        name: 'Laminate Suppliers Ltd',
        contact: '+91 98765 00000'
    },
    status: 'available',
    lastRestocked: '2024-03-10',
    createdDate: '2024-01-10',
    lastUpdated: '2024-03-15T10:30:00Z'
}
```

### Order Model (Enhanced)

```javascript
{
    id: 'ORD001',
    orderNumber: 'SO-2024-001',
    customer: {
        name: 'ABC Corporation',
        phone: '+91 98765 43210',
        email: 'abc@corporation.com',
        address: 'No. 456, Business Park, Bangalore'
    },
    material: {
        code: 'LAM001',
        name: 'Satin Laminate',
        quantity: 100,
        unit: 'sheets'
    },
    locations: {
        pickup: {
            warehouse: 'WH001',
            name: 'Chennai Main Warehouse',
            address: 'Chennai Port'
        },
        delivery: {
            address: 'Bangalore Hub',
            city: 'Bangalore',
            pincode: '560001',
            coordinates: { lat: 12.9716, lng: 77.5946 }
        }
    },
    priority: 'urgent', // urgent, high, normal
    status: 'pending', // pending, processing, assigned, dispatched, in-transit, delivered, completed
    workflow: {
        currentStep: 1,
        completedSteps: [],
        progress: 0
    },
    assignment: {
        vehicle: null,
        driver: null,
        assignedAt: null,
        assignedBy: null
    },
    timeline: {
        createdDate: '2024-03-15',
        createdAt: '2024-03-15T09:00:00Z',
        requiredDate: '2024-03-20',
        estimatedDelivery: null,
        actualDelivery: null
    },
    specialInstructions: 'Handle with care, fragile material',
    documents: [],
    notifications: [],
    createdBy: 'user@system.com',
    lastUpdated: '2024-03-15T10:30:00Z'
}
```

### Dispatch Workflow Model

```javascript
{
    id: 'WF001',
    orderId: 'ORD001',
    steps: [
        {
            stepNumber: 1,
            name: 'Sales Order',
            status: 'completed',
            completedAt: '2024-03-15T09:00:00Z',
            completedBy: 'sales@system.com',
            notes: 'Order received from customer'
        },
        {
            stepNumber: 2,
            name: 'Warehouse',
            status: 'completed',
            completedAt: '2024-03-15T09:30:00Z',
            completedBy: 'warehouse@system.com',
            notes: 'Material allocated and ready'
        },
        {
            stepNumber: 3,
            name: 'Invoice',
            status: 'in-progress',
            startedAt: '2024-03-15T10:00:00Z',
            notes: 'Invoice generation in progress'
        },
        {
            stepNumber: 4,
            name: 'Vehicle & Driver Assignment',
            status: 'pending'
        },
        {
            stepNumber: 5,
            name: 'Dispatch',
            status: 'pending'
        },
        {
            stepNumber: 6,
            name: 'Tracker',
            status: 'pending'
        },
        {
            stepNumber: 7,
            name: 'Delivered',
            status: 'pending'
        }
    ],
    currentStep: 3,
    progress: 42.86, // (3/7) * 100
    createdAt: '2024-03-15T09:00:00Z',
    lastUpdated: '2024-03-15T10:30:00Z'
}
```

### Communication Log Model

```javascript
{
    id: 'COMM001',
    type: 'whatsapp', // whatsapp, email, sms
    recipient: {
        name: 'ABC Corporation',
        contact: '+91 98765 43210'
    },
    subject: 'Order ORD001 - Dispatch Update',
    message: 'Your order ORD001 has been dispatched and is on the way.',
    relatedEntity: {
        type: 'order',
        id: 'ORD001'
    },
    status: 'sent', // pending, sent, delivered, failed
    sentAt: '2024-03-15T10:30:00Z',
    deliveredAt: '2024-03-15T10:31:00Z',
    error: null,
    createdBy: 'system'
}
```

### Dispatch Tracking Model

```javascript
{
    id: 'DT001',
    dispatchId: 'DISP001',
    orderId: 'ORD001',
    vehicle: {
        id: 'VEH001',
        registrationNumber: 'TN01AB1234',
        type: 'Truck'
    },
    driver: {
        id: 'DRV001',
        name: 'John Doe',
        phone: '+91 98765 43210'
    },
    route: {
        id: 'RT001',
        name: 'Chennai to Bangalore',
        distance: 350,
        estimatedDuration: 420 // minutes
    },
    tracking: {
        currentLocation: {
            lat: 12.9716,
            lng: 77.5946,
            address: 'Near Bangalore City',
            timestamp: '2024-03-15T14:30:00Z'
        },
        startLocation: {
            lat: 13.0827,
            lng: 80.2707,
            address: 'Chennai Main Warehouse'
        },
        destination: {
            lat: 12.9716,
            lng: 77.5946,
            address: 'Bangalore Hub'
        },
        distanceCovered: 320,
        distanceRemaining: 30,
        eta: '2024-03-15T15:30:00Z',
        speed: 60 // km/h
    },
    workflowStatus: {
        currentStep: 6,
        steps: [
            { id: 1, name: 'Sales Order', completed: true, timestamp: '2024-03-15T09:00:00Z' },
            { id: 2, name: 'Warehouse', completed: true, timestamp: '2024-03-15T09:30:00Z' },
            { id: 3, name: 'Invoice', completed: true, timestamp: '2024-03-15T10:00:00Z' },
            { id: 4, name: 'Assignment', completed: true, timestamp: '2024-03-15T10:30:00Z' },
            { id: 5, name: 'Dispatch', completed: true, timestamp: '2024-03-15T11:00:00Z' },
            { id: 6, name: 'Tracker', completed: false, inProgress: true },
            { id: 7, name: 'Delivered', completed: false }
        ]
    },
    status: 'in-transit', // scheduled, in-transit, delayed, delivered, cancelled
    delayStatus: {
        isDelayed: false,
        delayMinutes: 0,
        reason: null
    },
    activityLog: [
        { timestamp: '2024-03-15T11:00:00Z', activity: 'Dispatch started', user: 'dispatcher@system.com' },
        { timestamp: '2024-03-15T14:30:00Z', activity: 'Location updated', coordinates: { lat: 12.9716, lng: 77.5946 } }
    ],
    createdAt: '2024-03-15T09:00:00Z',
    lastUpdated: '2024-03-15T14:30:00Z'
}
```

### Route Assignment Model

```javascript
{
    id: 'RA001',
    routeId: 'RT001',
    route: {
        name: 'Chennai to Bangalore',
        distance: 350,
        estimatedDuration: 420,
        waypoints: [
            { lat: 13.0827, lng: 80.2707, name: 'Chennai Main Warehouse' },
            { lat: 12.9716, lng: 77.5946, name: 'Bangalore Hub' }
        ]
    },
    vehicle: {
        id: 'VEH001',
        registrationNumber: 'TN01AB1234',
        type: 'Truck',
        capacity: 5000 // kg
    },
    driver: {
        id: 'DRV001',
        name: 'John Doe',
        phone: '+91 98765 43210',
        licenseNumber: 'TN0120240001'
    },
    assignment: {
        assignedAt: '2024-03-15T10:30:00Z',
        assignedBy: 'coordinator@system.com',
        startTime: '2024-03-15T11:00:00Z',
        expectedEndTime: '2024-03-15T18:00:00Z'
    },
    utilization: {
        distanceCovered: 320,
        timeTaken: 210, // minutes
        stopsCompleted: 0,
        stopsTotal: 1,
        loadWeight: 3500, // kg
        capacityUtilization: 70 // percentage
    },
    compliance: {
        status: 'on-route', // on-route, deviated, completed
        deviations: [],
        lastChecked: '2024-03-15T14:30:00Z'
    },
    auditTrail: [
        { timestamp: '2024-03-15T10:30:00Z', action: 'Route assigned', user: 'coordinator@system.com', details: 'Initial assignment' }
    ],
    status: 'active', // scheduled, active, completed, cancelled
    createdAt: '2024-03-15T10:30:00Z',
    lastUpdated: '2024-03-15T14:30:00Z'
}
```

### Fuel Management Model

```javascript
{
    id: 'FM001',
    vehicleId: 'VEH001',
    vehicle: {
        registrationNumber: 'TN01AB1234',
        type: 'Truck',
        fuelEfficiency: 8 // km per liter
    },
    transaction: {
        date: '2024-03-15',
        time: '08:00:00',
        location: 'Chennai Fuel Station',
        coordinates: { lat: 13.0827, lng: 80.2707 },
        quantity: 50, // liters
        cost: 5000, // INR
        pricePerLiter: 100,
        odometer: 45000, // km
        attendant: 'Fuel Station Operator',
        receiptNumber: 'FS-2024-001'
    },
    consumption: {
        previousOdometer: 44600,
        distanceTraveled: 400, // km
        expectedConsumption: 50, // liters (400 km / 8 km/l)
        actualConsumption: 58, // liters
        variance: 16, // percentage
        varianceStatus: 'alert' // normal, warning, alert
    },
    analysis: {
        costPerTrip: 5800,
        costPerKm: 14.5,
        efficiencyRating: 'below-average', // excellent, good, average, below-average, poor
        theftSuspicion: true,
        theftIndicators: ['High variance (16%)', 'Abnormal consumption pattern']
    },
    alerts: [
        {
            type: 'potential-theft',
            severity: 'high',
            message: 'Fuel consumption 16% higher than expected',
            timestamp: '2024-03-15T20:00:00Z',
            notified: ['fleet-manager@system.com']
        }
    ],
    gpsCorrelation: {
        distanceByGPS: 400,
        distanceByOdometer: 400,
        discrepancy: 0,
        correlationStatus: 'matched'
    },
    createdAt: '2024-03-15T08:00:00Z',
    lastUpdated: '2024-03-15T20:00:00Z'
}
```

### Collaborative Dispatch Model

```javascript
{
    id: 'CD001',
    name: 'Chennai to Bangalore - Multi-Order Dispatch',
    route: {
        id: 'RT001',
        name: 'Chennai to Bangalore',
        distance: 350,
        estimatedDuration: 420
    },
    orders: [
        {
            orderId: 'ORD001',
            customer: 'ABC Corporation',
            material: 'Satin Laminate',
            quantity: 100,
            weight: 500, // kg
            priority: 'urgent',
            deliveryAddress: 'Bangalore Hub - Location A'
        },
        {
            orderId: 'ORD002',
            customer: 'XYZ Industries',
            material: 'Glossy Laminate',
            quantity: 80,
            weight: 400, // kg
            priority: 'high',
            deliveryAddress: 'Bangalore Hub - Location B'
        }
    ],
    vehicle: {
        id: 'VEH001',
        registrationNumber: 'TN01AB1234',
        capacity: 5000, // kg
        loadWeight: 900, // kg (total of all orders)
        capacityUtilization: 18 // percentage
    },
    savings: {
        estimatedFuelSavings: 1500, // INR
        estimatedTimeSavings: 240, // minutes
        vehicleUsageSavings: 1, // number of vehicles saved
        totalCostSavings: 3500 // INR
    },
    suggestion: {
        suggestedAt: '2024-03-15T09:00:00Z',
        suggestedBy: 'system',
        acceptedAt: '2024-03-15T09:30:00Z',
        acceptedBy: 'operations@system.com',
        manualOverride: false
    },
    tracking: {
        individualOrderTracking: true,
        orders: [
            { orderId: 'ORD001', status: 'in-transit', eta: '2024-03-15T15:30:00Z' },
            { orderId: 'ORD002', status: 'in-transit', eta: '2024-03-15T16:00:00Z' }
        ]
    },
    status: 'active', // suggested, accepted, active, completed, cancelled
    createdAt: '2024-03-15T09:00:00Z',
    lastUpdated: '2024-03-15T14:30:00Z'
}
```

### Trip Lifecycle Model

```javascript
{
    id: 'TL001',
    tripId: 'TRIP001',
    orderId: 'ORD001',
    workflow: {
        currentStep: 5,
        steps: [
            {
                stepNumber: 1,
                name: 'Order Creation (ERP)',
                status: 'completed',
                data: {
                    erpOrderId: 'ERP-SO-2024-001',
                    syncedAt: '2024-03-15T08:00:00Z',
                    orderDetails: { customer: 'ABC Corporation', material: 'Satin Laminate', quantity: 100 }
                },
                completedAt: '2024-03-15T08:00:00Z',
                completedBy: 'erp-system'
            },
            {
                stepNumber: 2,
                name: 'Planning',
                status: 'completed',
                data: {
                    routeOptimized: true,
                    resourcesAllocated: true,
                    estimatedCost: 5000,
                    estimatedDuration: 420
                },
                completedAt: '2024-03-15T09:00:00Z',
                completedBy: 'planner@system.com'
            },
            {
                stepNumber: 3,
                name: 'Trip Creation',
                status: 'completed',
                data: {
                    vehicleId: 'VEH001',
                    driverId: 'DRV001',
                    routeId: 'RT001',
                    loadWeight: 500,
                    loadPlan: 'Single pallet, secured with straps'
                },
                completedAt: '2024-03-15T10:00:00Z',
                completedBy: 'coordinator@system.com'
            },
            {
                stepNumber: 4,
                name: 'Dispatch Execution',
                status: 'completed',
                data: {
                    departureConfirmed: true,
                    documentsVerified: true,
                    dispatchAuthorized: true,
                    departureTime: '2024-03-15T11:00:00Z'
                },
                completedAt: '2024-03-15T11:00:00Z',
                completedBy: 'dispatcher@system.com'
            },
            {
                stepNumber: 5,
                name: 'Live Tracking & Delivery',
                status: 'in-progress',
                data: {
                    trackingEnabled: true,
                    currentLocation: { lat: 12.9716, lng: 77.5946 },
                    eta: '2024-03-15T15:30:00Z',
                    deliveryStatus: 'in-transit'
                },
                startedAt: '2024-03-15T11:00:00Z'
            },
            {
                stepNumber: 6,
                name: 'Trip Closure',
                status: 'pending'
            },
            {
                stepNumber: 7,
                name: 'Reporting',
                status: 'pending'
            }
        ],
        progress: 71.43 // (5/7) * 100
    },
    rolePermissions: {
        'Order Creation (ERP)': ['erp-system', 'admin'],
        'Planning': ['planner', 'operations-manager', 'admin'],
        'Trip Creation': ['coordinator', 'operations-manager', 'admin'],
        'Dispatch Execution': ['dispatcher', 'operations-manager', 'admin'],
        'Live Tracking & Delivery': ['driver', 'dispatcher', 'operations-manager', 'admin'],
        'Trip Closure': ['driver', 'dispatcher', 'operations-manager', 'admin'],
        'Reporting': ['operations-manager', 'admin']
    },
    auditTrail: [
        { timestamp: '2024-03-15T08:00:00Z', step: 1, action: 'Step completed', user: 'erp-system' },
        { timestamp: '2024-03-15T09:00:00Z', step: 2, action: 'Step completed', user: 'planner@system.com' },
        { timestamp: '2024-03-15T10:00:00Z', step: 3, action: 'Step completed', user: 'coordinator@system.com' },
        { timestamp: '2024-03-15T11:00:00Z', step: 4, action: 'Step completed', user: 'dispatcher@system.com' },
        { timestamp: '2024-03-15T11:00:00Z', step: 5, action: 'Step started', user: 'system' }
    ],
    notifications: [
        { milestone: 'Order Created', sentAt: '2024-03-15T08:00:00Z', recipients: ['operations@system.com'] },
        { milestone: 'Planning Completed', sentAt: '2024-03-15T09:00:00Z', recipients: ['coordinator@system.com'] },
        { milestone: 'Trip Created', sentAt: '2024-03-15T10:00:00Z', recipients: ['dispatcher@system.com', 'driver@system.com'] },
        { milestone: 'Dispatch Executed', sentAt: '2024-03-15T11:00:00Z', recipients: ['customer@abc.com', 'operations@system.com'] }
    ],
    createdAt: '2024-03-15T08:00:00Z',
    lastUpdated: '2024-03-15T14:30:00Z'
}
```

### Vehicle Ownership Model

```javascript
{
    id: 'VO001',
    vehicleId: 'VEH001',
    vehicle: {
        registrationNumber: 'TN01AB1234',
        type: 'Truck',
        make: 'Tata',
        model: 'LPT 1613',
        year: 2022
    },
    ownershipType: 'owned', // owned, third-party
    ownedDetails: {
        purchaseDate: '2022-01-15',
        purchasePrice: 2500000, // INR
        currentValue: 2000000, // INR
        depreciation: {
            method: 'straight-line',
            rate: 10, // percentage per year
            accumulatedDepreciation: 500000
        },
        insurance: {
            provider: 'ABC Insurance',
            policyNumber: 'INS-2024-001',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            premium: 50000,
            coverage: 2000000
        },
        maintenanceSchedule: {
            lastService: '2024-02-15',
            nextService: '2024-05-15',
            serviceInterval: 90, // days
            responsibleParty: 'company'
        }
    },
    thirdPartyDetails: {
        vendor: {
            id: 'VND001',
            name: 'XYZ Transport Services',
            contact: '+91 98765 00000',
            email: 'xyz@transport.com',
            address: 'Transport Hub, Chennai'
        },
        contract: {
            contractId: 'CNT-2024-001',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            renewalDate: '2024-11-01',
            autoRenewal: true
        },
        rates: {
            dailyRate: 5000, // INR per day
            perKmRate: 25, // INR per km
            minimumKm: 100, // minimum km per day
            overtimeRate: 500 // INR per hour
        },
        paymentTerms: {
            billingCycle: 'monthly',
            paymentDue: 30, // days
            advancePayment: 0
        },
        performance: {
            onTimeDelivery: 95, // percentage
            vehicleCondition: 'excellent', // excellent, good, average, poor
            complianceScore: 98, // percentage
            incidentCount: 2,
            lastIncidentDate: '2024-02-10'
        },
        maintenanceSchedule: {
            responsibleParty: 'vendor',
            vendorCommitment: 'Full maintenance included',
            lastInspection: '2024-03-01',
            nextInspection: '2024-06-01'
        }
    },
    costStructure: {
        fixedCosts: {
            depreciation: 20833, // monthly (500000/24 months)
            insurance: 4167, // monthly (50000/12 months)
            registration: 500 // monthly
        },
        variableCosts: {
            fuel: 15000, // monthly average
            maintenance: 3000, // monthly average
            repairs: 1000 // monthly average
        },
        totalMonthlyCost: 44500
    },
    status: 'active', // active, inactive, maintenance, retired
    alerts: [
        {
            type: 'contract-renewal',
            message: 'Contract renewal due in 60 days',
            dueDate: '2024-11-01',
            priority: 'medium'
        }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    lastUpdated: '2024-03-15T10:00:00Z'
}
```

### Advanced Fuel Analysis Model

```javascript
{
    id: 'FA001',
    vehicleId: 'VEH001',
    vehicle: {
        registrationNumber: 'TN01AB1234',
        type: 'Truck',
        ownershipType: 'owned'
    },
    driverId: 'DRV001',
    driver: {
        name: 'John Doe',
        licenseNumber: 'TN0120240001'
    },
    routeId: 'RT001',
    route: {
        name: 'Chennai to Bangalore',
        distance: 350
    },
    period: {
        startDate: '2024-03-01',
        endDate: '2024-03-31'
    },
    baselineEfficiency: {
        averageKmPerLiter: 8,
        calculatedFrom: 'historical-data',
        dataPoints: 50,
        confidence: 95 // percentage
    },
    consumptionPatterns: {
        totalDistance: 3500, // km
        totalFuelConsumed: 450, // liters
        actualEfficiency: 7.78, // km per liter
        expectedConsumption: 437.5, // liters (3500/8)
        actualConsumption: 450, // liters
        variance: 2.86, // percentage
        varianceStatus: 'normal' // normal, warning, alert, critical
    },
    anomalies: [
        {
            id: 'ANO001',
            type: 'unusual-timing',
            date: '2024-03-15',
            time: '02:30:00',
            description: 'Refueling at unusual time (2:30 AM)',
            severity: 'medium',
            location: { lat: 13.0827, lng: 80.2707, address: 'Unknown location' },
            quantity: 50,
            flagged: true
        },
        {
            id: 'ANO002',
            type: 'consumption-spike',
            date: '2024-03-20',
            description: 'Sudden spike in consumption (25% above baseline)',
            severity: 'high',
            actualConsumption: 62.5,
            expectedConsumption: 50,
            variance: 25
        }
    ],
    vehicleComparison: {
        similarVehicles: ['VEH002', 'VEH003', 'VEH004'],
        averageEfficiency: 8.2, // km per liter
        ranking: 4, // out of 5 similar vehicles
        percentile: 20 // bottom 20%
    },
    predictiveAnalytics: {
        nextTripRoute: 'RT001',
        loadWeight: 3500, // kg
        predictedConsumption: 45, // liters
        confidenceInterval: { min: 42, max: 48 },
        factors: ['route distance', 'load weight', 'historical efficiency', 'weather conditions']
    },
    misuseAlerts: [
        {
            id: 'MA001',
            severity: 'high', // low, medium, high, critical
            type: 'unauthorized-location',
            date: '2024-03-15',
            message: 'Refueling at unauthorized location',
            details: {
                location: { lat: 13.0827, lng: 80.2707, address: 'Unknown fuel station' },
                authorizedLocations: ['Chennai Main Station', 'Bangalore Hub Station'],
                quantity: 50,
                cost: 5000
            },
            actionTaken: 'Investigation initiated',
            status: 'open'
        }
    ],
    refuelingLocations: {
        authorized: [
            { name: 'Chennai Main Station', coordinates: { lat: 13.0827, lng: 80.2707 }, transactionCount: 15 },
            { name: 'Bangalore Hub Station', coordinates: { lat: 12.9716, lng: 77.5946 }, transactionCount: 12 }
        ],
        unauthorized: [
            { name: 'Unknown location', coordinates: { lat: 13.0827, lng: 80.2707 }, transactionCount: 1, flagged: true }
        ]
    },
    driverEfficiency: {
        driverId: 'DRV001',
        driverName: 'John Doe',
        efficiency: 7.78, // km per liter
        ranking: 8, // out of 15 drivers
        percentile: 47, // middle 50%
        totalDistance: 3500,
        totalFuelConsumed: 450,
        trips: 10
    },
    totalCostOfOwnership: {
        ownershipType: 'owned',
        fuelCosts: {
            monthly: 45000,
            perKm: 12.86,
            perTrip: 4500
        },
        maintenanceCosts: {
            monthly: 3000,
            perKm: 0.86
        },
        totalMonthlyCost: 48000,
        costPerKm: 13.72
    },
    trendAnalysis: {
        period: 'last-6-months',
        trend: 'increasing', // increasing, decreasing, stable
        changePercentage: 5, // 5% increase in consumption
        chartData: [
            { month: 'Oct 2023', efficiency: 8.2 },
            { month: 'Nov 2023', efficiency: 8.1 },
            { month: 'Dec 2023', efficiency: 8.0 },
            { month: 'Jan 2024', efficiency: 7.9 },
            { month: 'Feb 2024', efficiency: 7.85 },
            { month: 'Mar 2024', efficiency: 7.78 }
        ]
    },
    ownershipIntegration: {
        ownershipType: 'owned',
        comparisonWithThirdParty: {
            ownedAverageEfficiency: 7.8,
            thirdPartyAverageEfficiency: 8.5,
            costDifference: 2000 // INR per month
        }
    },
    createdAt: '2024-03-01T00:00:00Z',
    lastUpdated: '2024-03-31T23:59:59Z'
}
```

### Material Master Data Model

```javascript
{
    id: 'MM001',
    code: 'LAM-SAT-001',
    name: 'Satin Laminate - Premium Grade',
    category: {
        level1: 'Laminates',
        level2: 'Decorative Laminates',
        level3: 'Satin Finish',
        fullPath: 'Laminates > Decorative Laminates > Satin Finish'
    },
    description: 'Premium quality satin finish decorative laminate for furniture and interior applications',
    specifications: {
        dimensions: {
            length: 2440, // mm
            width: 1220, // mm
            thickness: 1, // mm
        },
        weight: 5, // kg per sheet
        finish: 'Satin',
        grade: 'Premium',
        color: 'Natural Wood',
        pattern: 'Wood Grain',
        surfaceTexture: 'Smooth Satin',
        fireRating: 'Class 1',
        wearResistance: 'High'
    },
    variants: [
        {
            variantId: 'VAR001',
            code: 'LAM-SAT-001-BLK',
            name: 'Satin Laminate - Premium Grade - Black',
            color: 'Black',
            stockLevel: 200
        },
        {
            variantId: 'VAR002',
            code: 'LAM-SAT-001-WHT',
            name: 'Satin Laminate - Premium Grade - White',
            color: 'White',
            stockLevel: 150
        }
    ],
    stockByWarehouse: {
        'WH001': {
            warehouseName: 'Chennai Main Warehouse',
            quantity: 500,
            minLevel: 50,
            maxLevel: 1000,
            reorderPoint: 100,
            lastRestocked: '2024-03-10',
            location: 'Aisle A, Rack 5, Level 2'
        },
        'WH002': {
            warehouseName: 'Bangalore Hub',
            quantity: 300,
            minLevel: 50,
            maxLevel: 800,
            reorderPoint: 80,
            lastRestocked: '2024-03-05',
            location: 'Aisle B, Rack 3, Level 1'
        },
        'WH003': {
            warehouseName: 'Mumbai Depot',
            quantity: 150,
            minLevel: 50,
            maxLevel: 500,
            reorderPoint: 75,
            lastRestocked: '2024-03-01',
            location: 'Aisle C, Rack 7, Level 3'
        }
    },
    totalStock: 950,
    unit: 'sheets',
    pricing: {
        unitPrice: 1500.00, // INR
        currency: 'INR',
        bulkDiscounts: [
            { minQuantity: 100, discount: 5 }, // 5% discount
            { minQuantity: 500, discount: 10 }, // 10% discount
            { minQuantity: 1000, discount: 15 } // 15% discount
        ],
        lastPriceUpdate: '2024-03-01'
    },
    supplier: {
        supplierId: 'SUP001',
        name: 'Laminate Suppliers Ltd',
        contact: '+91 98765 00000',
        email: 'supplier@laminates.com',
        leadTime: 7, // days
        minimumOrderQuantity: 50,
        paymentTerms: 'Net 30'
    },
    lifecycle: {
        status: 'active', // active, discontinued, obsolete, pending
        introducedDate: '2023-01-01',
        lastOrderDate: '2024-03-15',
        discontinuedDate: null,
        replacementMaterial: null
    },
    usageAnalytics: {
        totalOrdered: 5000, // lifetime
        averageMonthlyOrders: 150,
        lastOrderDate: '2024-03-15',
        orderFrequency: 'high', // high, medium, low
        stockoutFrequency: 2, // times per year
        turnoverRate: 6, // times per year
        classification: 'fast-moving' // fast-moving, slow-moving, non-moving
    },
    relationships: {
        substitutes: ['LAM-SAT-002', 'LAM-SAT-003'],
        alternatives: ['LAM-GLO-001'],
        bundles: ['BUN-001'],
        kits: ['KIT-LAM-001'],
        relatedMaterials: ['ADH-001', 'EDG-001']
    },
    dataValidation: {
        codeUnique: true,
        requiredFieldsComplete: true,
        formatValid: true,
        lastValidated: '2024-03-15T10:00:00Z'
    },
    changeHistory: [
        {
            changeId: 'CHG001',
            date: '2024-03-01',
            changedBy: 'admin@system.com',
            field: 'pricing.unitPrice',
            oldValue: 1400,
            newValue: 1500,
            reason: 'Supplier price increase'
        },
        {
            changeId: 'CHG002',
            date: '2024-03-10',
            changedBy: 'warehouse@system.com',
            field: 'stockByWarehouse.WH001.quantity',
            oldValue: 400,
            newValue: 500,
            reason: 'Stock replenishment'
        }
    ],
    tags: ['premium', 'decorative', 'furniture', 'interior'],
    isFavorite: false,
    favoriteCount: 25,
    createdDate: '2023-01-01',
    createdBy: 'admin@system.com',
    lastUpdated: '2024-03-15T10:30:00Z',
    lastUpdatedBy: 'warehouse@system.com'
}
```

### Real-Time Material Tracking Model

```javascript
{
    id: 'MT001',
    trackingNumber: 'TRK-2024-001',
    shipmentId: 'SHIP001',
    orderId: 'ORD001',
    material: {
        materialId: 'MAT001',
        code: 'LAM001',
        name: 'Satin Laminate',
        quantity: 100,
        unit: 'sheets',
        weight: 500, // kg
        dimensions: '8ft x 4ft x 1mm'
    },
    lifecycle: {
        currentStage: 3,
        stages: [
            {
                stageNumber: 1,
                name: 'Warehouse Pickup',
                status: 'completed',
                timestamp: '2024-03-15T08:00:00Z',
                location: {
                    coordinates: { lat: 13.0827, lng: 80.2707 },
                    address: 'Chennai Main Warehouse, Aisle A, Rack 5'
                },
                handler: {
                    id: 'HND001',
                    name: 'Warehouse Staff - Rajesh Kumar',
                    phone: '+91 98765 11111',
                    signature: 'data:image/png;base64,...'
                },
                condition: {
                    status: 'good',
                    notes: 'All materials in excellent condition',
                    temperature: 25, // celsius
                    humidity: 60 // percentage
                },
                barcodeScan: {
                    scanned: true,
                    scanTime: '2024-03-15T08:00:00Z',
                    barcodeData: 'LAM001-BATCH-2024-001',
                    scanner: 'Scanner-WH001'
                },
                photos: [
                    {
                        photoId: 'PHT001',
                        url: '/uploads/tracking/MT001/pickup-1.jpg',
                        caption: 'Material condition at pickup',
                        timestamp: '2024-03-15T08:00:00Z'
                    }
                ],
                notes: 'Material picked up and loaded onto vehicle TN01AB1234'
            },
            {
                stageNumber: 2,
                name: 'In Transit',
                status: 'completed',
                timestamp: '2024-03-15T09:00:00Z',
                location: {
                    coordinates: { lat: 13.1234, lng: 80.3456 },
                    address: 'En route to Bangalore, NH48'
                },
                handler: {
                    id: 'DRV001',
                    name: 'Driver - John Doe',
                    phone: '+91 98765 43210',
                    vehicleNumber: 'TN01AB1234'
                },
                condition: {
                    status: 'good',
                    notes: 'Materials secure and in transit',
                    temperature: 28,
                    humidity: 65
                },
                gpsTracking: {
                    enabled: true,
                    updateInterval: 300, // seconds (5 minutes)
                    lastUpdate: '2024-03-15T14:30:00Z'
                },
                notes: 'Transit started, ETA 6 hours'
            },
            {
                stageNumber: 3,
                name: 'Checkpoint Scan',
                status: 'in-progress',
                timestamp: '2024-03-15T12:00:00Z',
                location: {
                    coordinates: { lat: 12.9716, lng: 77.5946 },
                    address: 'Bangalore Checkpoint, Toll Plaza'
                },
                handler: {
                    id: 'CHK001',
                    name: 'Checkpoint Officer - Suresh Patel',
                    phone: '+91 98765 22222'
                },
                condition: {
                    status: 'good',
                    notes: 'Checkpoint verification completed',
                    temperature: 27,
                    humidity: 62
                },
                barcodeScan: {
                    scanned: true,
                    scanTime: '2024-03-15T12:00:00Z',
                    barcodeData: 'LAM001-BATCH-2024-001',
                    scanner: 'Scanner-CHK001'
                },
                photos: [
                    {
                        photoId: 'PHT002',
                        url: '/uploads/tracking/MT001/checkpoint-1.jpg',
                        caption: 'Material condition at checkpoint',
                        timestamp: '2024-03-15T12:00:00Z'
                    }
                ],
                notes: 'Checkpoint scan completed, continuing to destination'
            },
            {
                stageNumber: 4,
                name: 'Near Delivery',
                status: 'pending',
                estimatedTimestamp: '2024-03-15T14:30:00Z'
            },
            {
                stageNumber: 5,
                name: 'Delivered',
                status: 'pending',
                estimatedTimestamp: '2024-03-15T15:00:00Z'
            },
            {
                stageNumber: 6,
                name: 'Confirmed',
                status: 'pending'
            }
        ],
        progress: 50 // (3/6) * 100
    },
    estimatedDelivery: {
        eta: '2024-03-15T15:00:00Z',
        confidence: 'high', // high, medium, low
        factors: ['current location', 'traffic conditions', 'historical data'],
        lastUpdated: '2024-03-15T12:00:00Z'
    },
    notifications: [
        {
            notificationId: 'NOT001',
            stage: 'Warehouse Pickup',
            type: 'email',
            recipients: ['customer@abc.com', 'operations@system.com'],
            message: 'Material LAM001 picked up from warehouse',
            sentAt: '2024-03-15T08:05:00Z',
            status: 'delivered'
        },
        {
            notificationId: 'NOT002',
            stage: 'In Transit',
            type: 'whatsapp',
            recipients: ['+91 98765 43210'],
            message: 'Material LAM001 is in transit, ETA 6 hours',
            sentAt: '2024-03-15T09:05:00Z',
            status: 'delivered'
        },
        {
            notificationId: 'NOT003',
            stage: 'Checkpoint Scan',
            type: 'email',
            recipients: ['customer@abc.com'],
            message: 'Material LAM001 passed checkpoint, on schedule',
            sentAt: '2024-03-15T12:05:00Z',
            status: 'delivered'
        }
    ],
    alerts: [
        {
            alertId: 'ALT001',
            type: 'delay',
            severity: 'low',
            message: 'Minor delay due to traffic, ETA updated',
            timestamp: '2024-03-15T11:00:00Z',
            resolved: true,
            resolvedAt: '2024-03-15T11:30:00Z'
        }
    ],
    customerPortal: {
        trackingUrl: 'https://tracking.system.com/track/TRK-2024-001',
        publicAccess: true,
        lastAccessed: '2024-03-15T12:30:00Z',
        accessCount: 5
    },
    multiMaterialShipment: {
        isMultiMaterial: true,
        shipmentId: 'SHIP001',
        totalMaterials: 3,
        otherMaterials: ['MT002', 'MT003']
    },
    integrations: {
        orderId: 'ORD001',
        tripId: 'TRIP001',
        vehicleId: 'VEH001',
        driverId: 'DRV001',
        routeId: 'RT001'
    },
    auditTrail: [
        { timestamp: '2024-03-15T08:00:00Z', event: 'Tracking initiated', user: 'system' },
        { timestamp: '2024-03-15T08:00:00Z', event: 'Stage 1 completed: Warehouse Pickup', user: 'HND001' },
        { timestamp: '2024-03-15T09:00:00Z', event: 'Stage 2 completed: In Transit', user: 'DRV001' },
        { timestamp: '2024-03-15T12:00:00Z', event: 'Stage 3 in progress: Checkpoint Scan', user: 'CHK001' }
    ],
    metadata: {
        createdAt: '2024-03-15T08:00:00Z',
        createdBy: 'system',
        lastUpdated: '2024-03-15T12:00:00Z',
        lastUpdatedBy: 'CHK001'
    }
}
```

### Thin Sheet Material Handling Model

```javascript
{
    id: 'TSH001',
    materialId: 'MAT001',
    material: {
        code: 'LAM001',
        name: 'Satin Laminate',
        category: 'laminates',
        isThinSheet: true
    },
    handlingRules: {
        storagePosition: 'flat-horizontal', // flat-horizontal, no vertical or angled
        maxStackHeight: 50, // sheets per stack
        edgeProtection: {
            required: true,
            type: 'corner-guards-and-edge-protectors',
            material: 'foam-or-cardboard'
        },
        protectivePackaging: {
            bubbleWrap: true,
            cardboardSeparators: true,
            plasticCovering: true,
            strapping: 'soft-straps-no-metal'
        },
        climateControl: {
            temperatureMin: 15, // celsius
            temperatureMax: 25, // celsius
            humidityMin: 40, // percentage
            humidityMax: 60, // percentage
            monitoring: 'continuous'
        }
    },
    stackingCalculation: {
        materialThickness: 1, // mm
        materialWeight: 5, // kg per sheet
        currentStackHeight: 30, // sheets
        optimalStackHeight: 40, // sheets
        maxStackHeight: 50, // sheets
        stackWeight: 150, // kg (30 sheets × 5 kg)
        maxStackWeight: 250 // kg (50 sheets × 5 kg)
    },
    handlingChecklist: [
        { step: 1, instruction: 'Verify material is laminate/thin sheet', completed: true },
        { step: 2, instruction: 'Ensure flat horizontal storage surface', completed: true },
        { step: 3, instruction: 'Apply edge protection and corner guards', completed: true },
        { step: 4, instruction: 'Place cardboard separators between sheets', completed: false },
        { step: 5, instruction: 'Cover with protective plastic', completed: false },
        { step: 6, instruction: 'Verify stack height does not exceed 50 sheets', completed: false },
        { step: 7, instruction: 'Check climate control (15-25°C, 40-60% humidity)', completed: false },
        { step: 8, instruction: 'Use soft straps for securing (no metal)', completed: false }
    ],
    damageTracking: {
        totalIncidents: 2,
        incidents: [
            {
                incidentId: 'INC001',
                date: '2024-03-10',
                stage: 'warehouse-storage',
                damageType: 'edge-damage',
                severity: 'minor',
                cause: 'improper-stacking',
                affectedQuantity: 5,
                cost: 7500, // INR
                preventionAction: 'Retrained staff on edge protection',
                photos: ['/uploads/damage/INC001-1.jpg', '/uploads/damage/INC001-2.jpg']
            },
            {
                incidentId: 'INC002',
                date: '2024-03-05',
                stage: 'vehicle-loading',
                damageType: 'surface-scratch',
                severity: 'minor',
                cause: 'tilted-loading',
                affectedQuantity: 3,
                cost: 4500, // INR
                preventionAction: 'Enforced flat loading procedure',
                photos: ['/uploads/damage/INC002-1.jpg']
            }
        ],
        damageByStage: {
            'warehouse-storage': 1,
            'vehicle-loading': 1,
            'in-transit': 0,
            'unloading': 0
        },
        damageByType: {
            'edge-damage': 1,
            'surface-scratch': 1,
            'corner-damage': 0,
            'warping': 0,
            'delamination': 0
        }
    },
    vehicleRequirements: {
        vehicleType: 'flat-bed-truck',
        loadingMethod: 'flat-horizontal',
        tiltingAllowed: false,
        securingMethod: 'soft-straps-and-padding',
        suitableVehicles: ['VEH001', 'VEH003', 'VEH005'],
        unsuitableVehicles: ['VEH002', 'VEH004']
    },
    vehicleLoadingProcedure: [
        { step: 1, instruction: 'Verify vehicle has flat bed surface' },
        { step: 2, instruction: 'Place protective padding on vehicle bed' },
        { step: 3, instruction: 'Load materials flat (horizontal position only)' },
        { step: 4, instruction: 'Maintain stack height limit during loading' },
        { step: 5, instruction: 'Secure with soft straps (no metal contact)' },
        { step: 6, instruction: 'Verify no tilting or angling of materials' },
        { step: 7, instruction: 'Cover with protective tarp if outdoor transport' },
        { step: 8, instruction: 'Document loading with photos' }
    ],
    complianceScore: {
        warehouseId: 'WH001',
        warehouseName: 'Chennai Main Warehouse',
        overallScore: 92, // percentage
        scoreByCategory: {
            'storage-position': 95,
            'edge-protection': 90,
            'stacking-limits': 88,
            'climate-control': 94,
            'protective-packaging': 91
        },
        handlers: [
            { handlerId: 'HND001', handlerName: 'Rajesh Kumar', score: 95 },
            { handlerId: 'HND002', handlerName: 'Suresh Patel', score: 89 }
        ],
        lastAudit: '2024-03-01',
        nextAudit: '2024-04-01'
    },
    alerts: [
        {
            alertId: 'ALT001',
            type: 'unsuitable-vehicle',
            severity: 'high',
            message: 'Material LAM001 assigned to vehicle VEH002 which lacks flat bed',
            timestamp: '2024-03-15T10:00:00Z',
            resolved: false,
            recommendedAction: 'Reassign to VEH001 or VEH003'
        }
    ],
    metadata: {
        createdAt: '2024-03-01T00:00:00Z',
        createdBy: 'system',
        lastUpdated: '2024-03-15T10:00:00Z',
        lastUpdatedBy: 'warehouse-manager@system.com'
    }
}
```

### Location-Based Storage Model

```javascript
{
    id: 'LBS001',
    materialId: 'MAT001',
    material: {
        code: 'LAM001',
        name: 'Satin Laminate',
        quantity: 500,
        unit: 'sheets'
    },
    locationHierarchy: {
        warehouse: {
            id: 'WH001',
            code: 'WH01',
            name: 'Chennai Main Warehouse'
        },
        zone: {
            id: 'ZN001',
            code: 'A',
            name: 'Zone A - Laminates',
            description: 'Primary storage for laminate materials'
        },
        aisle: {
            id: 'AS001',
            code: '05',
            name: 'Aisle 05',
            width: 3, // meters
            length: 50 // meters
        },
        rack: {
            id: 'RK001',
            code: 'R3',
            name: 'Rack 3',
            height: 6, // meters
            depth: 1.5, // meters
            width: 2.5 // meters
        },
        level: {
            id: 'LV001',
            code: 'L2',
            name: 'Level 2',
            heightFromGround: 2, // meters
            loadCapacity: 1000 // kg
        },
        bin: {
            id: 'BN001',
            code: 'B12',
            name: 'Bin 12',
            dimensions: {
                width: 1.2, // meters
                depth: 1.0, // meters
                height: 1.5 // meters
            },
            capacity: 500, // units
            currentOccupancy: 500 // units
        }
    },
    locationCode: 'WH01-A-05-R3-L2-B12',
    locationAddress: 'Chennai Main Warehouse, Zone A, Aisle 05, Rack 3, Level 2, Bin 12',
    locationStatus: {
        status: 'full', // available, partial, full, reserved
        capacityUtilization: 100, // percentage
        lastUpdated: '2024-03-15T10:00:00Z'
    },
    materialCharacteristics: {
        size: 'large', // small, medium, large, extra-large
        weight: 2500, // kg (500 sheets × 5 kg)
        accessFrequency: 'high', // high, medium, low
        turnoverRate: 6, // times per year
        specialHandling: 'thin-sheet',
        temperatureSensitive: false,
        hazardous: false
    },
    optimalLocationCalculation: {
        recommendedZone: 'A',
        recommendedAisle: '05',
        reason: 'High access frequency - near warehouse entrance',
        factors: [
            'Material size: large',
            'Access frequency: high',
            'Special handling: thin-sheet',
            'Proximity to loading dock',
            'Climate control availability'
        ],
        alternativeLocations: [
            'WH01-A-06-R2-L2-B10',
            'WH01-A-04-R3-L2-B15'
        ]
    },
    capacityTracking: {
        zone: {
            code: 'A',
            totalCapacity: 50000, // units
            currentOccupancy: 35000, // units
            utilization: 70, // percentage
            availableSpace: 15000 // units
        },
        aisle: {
            code: '05',
            totalCapacity: 5000, // units
            currentOccupancy: 4200, // units
            utilization: 84, // percentage
            availableSpace: 800 // units
        },
        rack: {
            code: 'R3',
            totalCapacity: 2000, // units
            currentOccupancy: 1800, // units
            utilization: 90, // percentage
            availableSpace: 200 // units
        },
        level: {
            code: 'L2',
            totalCapacity: 500, // units
            currentOccupancy: 500, // units
            utilization: 100, // percentage
            availableSpace: 0 // units
        },
        bin: {
            code: 'B12',
            totalCapacity: 500, // units
            currentOccupancy: 500, // units
            utilization: 100, // percentage
            availableSpace: 0 // units
        }
    },
    warehouseMap: {
        mapId: 'MAP-WH001',
        mapUrl: '/maps/warehouse-wh001.svg',
        interactiveMap: true,
        materialHighlight: {
            materialId: 'MAT001',
            locationCode: 'WH01-A-05-R3-L2-B12',
            highlightColor: '#FF5733',
            blinking: true
        },
        navigationPath: {
            from: 'entrance',
            to: 'WH01-A-05-R3-L2-B12',
            distance: 45, // meters
            estimatedTime: 3, // minutes
            turnByTurn: [
                'Enter warehouse through main entrance',
                'Turn right into Zone A',
                'Walk straight to Aisle 05',
                'Locate Rack 3 on the left',
                'Access Level 2 (2 meters height)',
                'Find Bin 12'
            ]
        }
    },
    locationHistory: [
        {
            historyId: 'HIST001',
            previousLocation: 'WH01-A-04-R2-L1-B08',
            currentLocation: 'WH01-A-05-R3-L2-B12',
            movedDate: '2024-03-10',
            movedBy: 'warehouse-staff@system.com',
            reason: 'Optimization - moved to higher access frequency zone',
            quantity: 500
        },
        {
            historyId: 'HIST002',
            previousLocation: 'WH01-B-10-R5-L3-B20',
            currentLocation: 'WH01-A-04-R2-L1-B08',
            movedDate: '2024-02-15',
            movedBy: 'warehouse-staff@system.com',
            reason: 'Restocking - moved from overflow to primary zone',
            quantity: 500
        }
    ],
    heatMap: {
        warehouseId: 'WH001',
        period: 'last-30-days',
        locationCode: 'WH01-A-05-R3-L2-B12',
        accessCount: 45,
        accessFrequency: 'high', // high, medium, low
        heatLevel: 9, // scale 1-10
        color: '#FF0000', // red for high frequency
        recommendations: [
            'Keep high-frequency materials near entrance',
            'Consider expanding Zone A capacity',
            'Optimize picking routes for Aisle 05'
        ]
    },
    barcodeScanning: {
        locationBarcode: 'BC-WH01-A-05-R3-L2-B12',
        barcodeFormat: 'QR-Code',
        lastScanned: '2024-03-15T09:30:00Z',
        scannedBy: 'warehouse-staff@system.com',
        scanPurpose: 'put-away-verification',
        scanResult: 'success',
        materialVerified: true
    },
    mobileInterface: {
        optimizedForHandheld: true,
        supportedDevices: ['Android', 'iOS'],
        features: [
            'Barcode scanning',
            'Location search',
            'Turn-by-turn navigation',
            'Capacity check',
            'Put-away guidance',
            'Picking instructions',
            'Photo capture',
            'Voice commands'
        ],
        lastAccessed: '2024-03-15T09:30:00Z',
        activeUsers: 12
    },
    alerts: [
        {
            alertId: 'ALT001',
            type: 'incorrect-location',
            severity: 'medium',
            message: 'Material LAM001 found in location WH01-A-06-R2-L2-B10, expected WH01-A-05-R3-L2-B12',
            timestamp: '2024-03-14T14:00:00Z',
            resolved: true,
            resolvedAt: '2024-03-14T15:00:00Z',
            correctionAction: 'Material moved to correct location'
        }
    ],
    metadata: {
        createdAt: '2024-03-10T00:00:00Z',
        createdBy: 'system',
        lastUpdated: '2024-03-15T10:00:00Z',
        lastUpdatedBy: 'warehouse-staff@system.com'
    }
}
```

## Error Handling

### Error Categories

1. **Validation Errors** - Invalid user input
2. **Data Consistency Errors** - Conflicts in data synchronization
3. **Resource Availability Errors** - No available vehicles/drivers
4. **Communication Errors** - Failed notifications
5. **System Errors** - Unexpected failures

### Error Handling Strategy

```javascript
function handleError(error, context) {
    // Log error
    console.error(`Error in ${context}:`, error);
    
    // Categorize error
    const category = categorizeError(error);
    
    // User notification
    switch(category) {
        case 'validation':
            showNotification(error.message, 'warning');
            highlightInvalidFields(error.fields);
            break;
        case 'resource':
            showNotification('No resources available. Please try again later.', 'warning');
            suggestAlternatives(error.context);
            break;
        case 'communication':
            showNotification('Notification failed. Will retry automatically.', 'info');
            queueForRetry(error.operation);
            break;
        case 'system':
            showNotification('System error occurred. Please contact support.', 'danger');
            logToErrorTracking(error);
            break;
    }
    
    // Recovery action
    attemptRecovery(error, context);
}
```

### Validation Error Handling

- Display inline error messages below form fields
- Highlight invalid fields with red border
- Prevent form submission until all errors resolved
- Provide helpful error messages with correction guidance

### Data Sync Error Handling

- Detect conflicts between modules
- Implement last-write-wins strategy for simple conflicts
- Queue updates for retry on temporary failures
- Alert user for manual resolution of complex conflicts

### Communication Error Handling

- Retry failed notifications up to 3 times
- Queue notifications for later delivery
- Log all communication attempts
- Provide manual resend option

## Testing Strategy

### Unit Testing Approach

Given the nature of this enhancement (UI/UX improvements, data synchronization, workflow automation), the testing strategy focuses on:

1. **Example-Based Unit Tests** - Test specific scenarios with concrete examples
2. **Integration Tests** - Verify module interactions and data flow
3. **UI/UX Tests** - Validate user interface behavior and responsiveness
4. **Manual Testing** - User acceptance testing for workflow completeness

### Test Categories

#### 1. Form Validation Tests

Test specific validation scenarios:
- Valid input acceptance
- Required field validation
- Format validation (phone, email)
- Boundary value testing (min/max quantities)
- Error message display

#### 2. Data Synchronization Tests

Test synchronization between modules:
- Vehicle status change propagation
- Order creation updates dashboard
- Material stock updates across warehouses
- Driver availability updates
- Workflow progress updates

#### 3. Workflow Progression Tests

Test dispatch workflow:
- Step-by-step completion
- Step validation (prerequisites)
- Progress calculation
- Visual indicator updates
- Notification triggers

#### 4. Communication Integration Tests

Test notification delivery:
- WhatsApp message formatting
- Email composition and sending
- Notification triggers for events
- Error handling for failed delivery
- Retry mechanism

#### 5. UI Responsiveness Tests

Test across devices:
- Desktop layout (1920x1080, 1366x768)
- Tablet layout (768x1024)
- Mobile layout (375x667, 414x896)
- Modal behavior on small screens
- Table responsiveness

#### 6. Browser Compatibility Tests

Test across browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Testing Tools

- **Manual Testing**: User walkthroughs and acceptance testing
- **Browser DevTools**: Console logging, network monitoring, responsive design testing
- **Validation Testing**: Form submission with various input combinations
- **Integration Testing**: Module interaction verification
- **Performance Testing**: Load time monitoring, sync delay measurement

### Test Scenarios

#### Scenario 1: Create Order and Complete Workflow

1. Create new order with all required fields
2. Verify order appears in pending orders list
3. Verify dashboard updates with new order count
4. Filter orders by priority
5. Assign vehicle and driver
6. Complete workflow steps one by one
7. Verify visual progress updates
8. Verify notifications sent at each step
9. Verify final delivery completion

#### Scenario 2: Warehouse Stock Management

1. Add new warehouse location
2. Add material with stock levels
3. Create order requiring material
4. Verify stock availability check
5. Test alternative warehouse sourcing
6. Initiate stock transfer
7. Verify stock updates across warehouses
8. Verify low stock alerts

#### Scenario 3: Real-Time Synchronization

1. Update vehicle status in Vehicle Master
2. Verify dashboard reflects change within 5 seconds
3. Update driver availability
4. Verify resource availability updates
5. Create new order
6. Verify all modules show updated data
7. Test concurrent updates from multiple sources

#### Scenario 4: Communication Integration

1. Create order and trigger notification
2. Verify WhatsApp message sent
3. Verify email notification sent
4. Test manual notification sending
5. Test notification for workflow progress
6. Test delivery confirmation notification
7. Verify communication log

#### Scenario 5: Enhanced Dispatch Tracking

1. Create and dispatch an order
2. Verify dispatch appears on tracking dashboard
3. Verify GPS location updates on map
4. Check ETA calculation accuracy
5. Simulate delay and verify alert
6. Verify workflow status indicators
7. Test filter functionality (date, route, vehicle, driver, status)
8. Verify activity log records all events

#### Scenario 6: Route Assignment Monitoring

1. Assign route to vehicle and driver
2. Verify assignment appears on dashboard
3. Simulate route deviation
4. Verify deviation alert triggered
5. Check utilization metrics calculation
6. Test vehicle capacity suggestion
7. Verify GPS-based route compliance
8. Check audit trail for assignment changes

#### Scenario 7: Fuel Management and Theft Detection

1. Record fuel transaction with odometer reading
2. Calculate expected consumption based on distance
3. Enter actual consumption data
4. Verify variance calculation (actual vs expected)
5. Simulate high variance (>15%)
6. Verify theft alert triggered
7. Check efficiency report generation
8. Verify GPS-fuel correlation
9. Test cost per trip and cost per km calculations

#### Scenario 8: Collaborative Dispatch

1. Create multiple orders with same route
2. Verify system suggests order consolidation
3. Check savings calculation (fuel, time, vehicle usage)
4. Verify vehicle capacity check
5. Test priority-based consolidation ranking
6. Create collaborative dispatch with one click
7. Verify individual order tracking within consolidated dispatch
8. Test manual override functionality

#### Scenario 9: Trip Lifecycle Management

1. Sync order from ERP system
2. Complete Planning stage with route optimization
3. Create trip with vehicle, driver, route assignment
4. Execute dispatch with document verification
5. Start live tracking and monitor GPS updates
6. Record delivery with proof of delivery
7. Close trip with odometer and fuel readings
8. Generate comprehensive trip report
9. Verify workflow validation prevents step skipping
10. Check role-based access control for each step
11. Verify automated notifications at milestones
12. Review audit trail for complete workflow

#### Scenario 10: Vehicle Ownership Management

1. Add owned vehicle with purchase details
2. Add third-party vehicle with contract details
3. Verify ownership type badges display correctly
4. Update owned vehicle maintenance schedule
5. Update third-party contract details
6. Calculate cost structure for both ownership types
7. Track vendor performance for third-party vehicles
8. Test contract renewal alerts
9. Filter vehicles by ownership type
10. Generate comparative reports (owned vs third-party)
11. Verify maintenance responsibility assignment

#### Scenario 11: Advanced Fuel Analysis

1. Record fuel transactions with detailed data
2. Establish baseline efficiency from historical data
3. Detect anomalies (spikes, unusual timing, off-route)
4. Compare fuel consumption across similar vehicles
5. Generate predictive analytics for upcoming trip
6. Trigger fuel misuse alert for high variance
7. Track and flag unauthorized refueling locations
8. Generate driver efficiency rankings
9. Calculate total cost of ownership with fuel costs
10. Analyze trends over time with charts
11. Integrate with vehicle ownership data
12. Test bulk import/export functionality

#### Scenario 12: Large-Scale Material Master Data Management

1. Load materials with pagination (50 per page)
2. Test advanced search (code, name, category, supplier)
3. Navigate hierarchical categories
4. Bulk import materials from CSV file
5. Bulk export materials with filters
6. Perform bulk update on multiple materials
7. Apply multi-criteria filters
8. Manage material variants (size, color, grade)
9. Update lifecycle status
10. View usage analytics
11. Validate data quality rules
12. Manage material relationships
13. Add materials to favorites
14. Review change history
15. Test performance with 7,000+ materials

#### Scenario 13: Real-Time Material Tracking Throughout Delivery Lifecycle

1. Initiate material tracking for new shipment with multiple materials
2. Record Warehouse Pickup event with timestamp, GPS location, handler info
3. Scan barcode/QR code at pickup and verify material
4. Capture condition photos at pickup
5. Update material status to In Transit with GPS tracking enabled
6. Monitor real-time location updates on interactive map
7. Record Checkpoint Scan with barcode verification
8. Capture condition photos at checkpoint
9. Verify condition monitoring (good, damaged, temperature alerts)
10. Calculate and display ETA for material delivery
11. Send automated notifications at each lifecycle stage
12. Track multiple materials within single shipment separately
13. Update status to Near Delivery when approaching destination
14. Record Delivered status with proof of delivery and photos
15. Capture final handler information and customer signature
16. Update status to Confirmed after customer confirmation
17. Test customer-facing tracking portal with tracking number lookup
18. Verify complete tracking history with audit trail
19. Test alerts for delays, route deviations, and condition issues
20. Verify integration with order management system
21. Test barcode scanning at all checkpoints
22. Verify photo capture functionality at pickup and delivery
23. Test handler tracking at each stage
24. Verify GPS location recording for all tracking events
25. Test notification delivery to stakeholders at milestones

#### Scenario 14: Specialized Thin Sheet Material Handling

1. Identify thin sheet material by category (laminate, sheet, panel, board)
2. Verify thin sheet indicator displays in material list
3. Display special handling instructions panel with checklist
4. Calculate optimal stack height based on material thickness and weight
5. Verify maximum stack height limit enforcement (50 sheets for laminates)
6. Test edge protection requirement indicator
7. Verify flat horizontal storage position enforcement (no vertical/angled)
8. Check protective packaging checklist (bubble wrap, separators, covering)
9. Monitor climate control (temperature 15-25°C, humidity 40-60%)
10. Test handling checklist completion by warehouse staff
11. Record damage incident with type, stage, and photos
12. Verify damage tracking by material type and handling stage
13. Generate damage prevention report with recommendations
14. Test vehicle suitability checker for thin sheet materials
15. Verify alert when thin sheets assigned to unsuitable vehicle
16. Display vehicle loading procedure with step-by-step instructions
17. Test flat bed vehicle requirement enforcement
18. Verify no tilting/angling allowed during loading
19. Test soft strap securing method (no metal contact)
20. Calculate compliance score by warehouse and handler
21. Generate handling compliance report
22. Test stacking calculator showing optimal vs maximum height
23. Verify visual indicators for thin sheet materials in all interfaces
24. Test climate control monitoring with temperature and humidity gauges
25. Verify protective packaging requirement enforcement

#### Scenario 15: Centralized Location-Based Storage Management

1. Create hierarchical location structure (Warehouse → Zone → Aisle → Rack → Level → Bin)
2. Generate unique location code (e.g., WH01-A-05-R3-L2-B12)
3. Assign material to specific location with real-time tracking
4. Display visual warehouse map with material location highlighted
5. Test location-based search (find all materials in specific aisle/rack/level)
6. Calculate optimal storage location based on material characteristics
7. Suggest storage location for incoming materials
8. Track capacity utilization by zone, aisle, and rack
9. Test "find material" functionality with turn-by-turn navigation
10. Scan location barcode for verification during put-away
11. Scan location barcode for verification during picking
12. Maintain location history for each material
13. Generate heat map showing frequently accessed locations
14. Optimize storage layout based on material movement patterns
15. Alert when material stored in incorrect location
16. Test mobile interface for warehouse staff with handheld devices
17. Verify hierarchical location tree view navigation
18. Test interactive warehouse map with clickable locations
19. Calculate and display capacity utilization with progress bars
20. Test turn-by-turn navigation from entrance to material location
21. Verify location history timeline for material movements
22. Test heat map visualization with color-coded frequency
23. Generate storage layout optimization recommendations
24. Test barcode scanning for location verification
25. Verify mobile-optimized interface features (scanning, navigation, voice commands)

### Why Property-Based Testing Is Not Applicable

This enhancement involves:

1. **UI/UX Improvements** - Visual workflow indicators, modal forms, responsive layouts
   - Better tested with snapshot tests and manual UI testing

2. **Data Synchronization** - Real-time updates across modules
   - Better tested with integration tests and timing verification

3. **Workflow Automation** - Step-by-step process with visual feedback
   - Better tested with example-based scenarios

4. **Configuration and Setup** - Warehouse setup, communication integration
   - Better tested with smoke tests and configuration validation

5. **External Service Integration** - WhatsApp, Email APIs
   - Better tested with mock-based tests and integration tests

The system does not have pure functions with universal properties that would benefit from property-based testing. Instead, it requires verification of specific user interactions, visual feedback, and integration between components.

## Implementation Plan

### Phase 1: Warehouse Management Module (Week 1)

1. Create warehouse-management.js file
2. Implement warehouse data structures
3. Add warehouse navigation menu item
4. Create warehouse dashboard UI
5. Implement material inventory table with multi-warehouse view
6. Add stock transfer functionality
7. Integrate with existing material management
8. Test warehouse operations

### Phase 2: Enhanced Dispatch Workflow (Week 2)

1. Design 7-step workflow UI component
2. Implement workflow state management
3. Create visual progress indicators
4. Add step completion functions
5. Implement workflow validation
6. Add workflow notifications
7. Integrate with order management
8. Test workflow progression

### Phase 3: Order Management Enhancement (Week 2)

1. Restore Order Management to navigation
2. Enhance order creation form
3. Implement priority filter dropdown
4. Add order assignment functionality
5. Integrate with warehouse module
6. Implement order-fleet synchronization
7. Test order lifecycle

### Phase 4: Communication Integration (Week 3)

1. Implement WhatsApp integration
2. Implement email integration
3. Create notification templates
4. Add communication buttons to header
5. Implement notification triggers
6. Create communication log
7. Test notification delivery

### Phase 5: Real-Time Synchronization (Week 3)

1. Implement sync engine
2. Add sync triggers to all modules
3. Implement dashboard auto-update
4. Add conflict resolution
5. Test synchronization timing
6. Optimize performance

### Phase 6: Form Enhancement & Standardization (Week 4)

1. Add automatic timestamps to all forms
2. Standardize vehicle status terminology
3. Enhance form validation
4. Improve error messages
5. Test all forms
6. Update documentation

### Phase 7: Enhanced Dispatch Tracking Visibility (Week 5)

1. Create dispatch-tracking.js file
2. Implement real-time tracking dashboard
3. Integrate Leaflet.js map with GPS markers
4. Add ETA calculation functionality
5. Implement delay detection and alerts
6. Create workflow status indicators
7. Add filter panel (date, route, vehicle, driver, status)
8. Implement activity log with timestamps
9. Test tracking accuracy and performance

### Phase 8: Route Assignment Monitoring System (Week 5)

1. Create route-monitoring.js file
2. Implement route assignment tracking
3. Create route assignment dashboard
4. Add route deviation detection
5. Implement GPS-based route compliance verification
6. Create utilization metrics calculator
7. Add vehicle suggestion algorithm
8. Implement audit trail logging
9. Test route monitoring and alerts

### Phase 9: Fuel Management and Theft Prevention (Week 6)

1. Create fuel-management.js file
2. Implement fuel transaction recording
3. Create expected consumption calculator
4. Add actual vs expected comparison
5. Implement theft detection algorithm (15% threshold)
6. Create theft alert system
7. Add efficiency reporting
8. Implement GPS-fuel correlation
9. Create fuel transaction log
10. Test theft detection accuracy

### Phase 10: Collaborative Dispatch and Route Optimization (Week 6)

1. Create collaborative-dispatch.js file
2. Implement pending order analysis
3. Create order consolidation algorithm
4. Add savings calculator
5. Implement vehicle capacity checker
6. Create prioritization logic
7. Add one-click consolidation
8. Implement individual order tracking within consolidated dispatch
9. Add manual override functionality
10. Test consolidation suggestions and savings

### Phase 11: Comprehensive Trip Lifecycle Management (Week 7)

1. Create trip-lifecycle.js file
2. Implement 7-step workflow structure
3. Add ERP integration for order sync
4. Create planning stage with route optimization
5. Implement trip creation with resource allocation
6. Add dispatch execution with verification
7. Implement live tracking with GPS and ETA
8. Create trip closure with proof of delivery
9. Add reporting with metrics and analysis
10. Implement role-based access control
11. Add workflow validation and audit trail
12. Implement automated notifications
13. Test complete lifecycle workflow

### Phase 12: Vehicle Ownership Management (Week 8)

1. Create vehicle-ownership.js file
2. Implement ownership type classification (owned/third-party)
3. Add ownership-specific data structures
4. Create owned vehicle tracking (purchase, depreciation, insurance, maintenance)
5. Create third-party vehicle tracking (vendor, contract, rates, terms)
6. Implement cost structure calculator by ownership type
7. Add vendor performance tracking
8. Implement contract renewal alerts
9. Create ownership filter functionality
10. Add maintenance schedule manager with ownership-based responsibilities
11. Create comparative reporting (owned vs third-party)
12. Test ownership management features

### Phase 13: Advanced Fuel Analysis and Misuse Prevention (Week 9)

1. Create fuel-analysis.js file
2. Implement detailed fuel consumption tracking
3. Create baseline efficiency calculator from historical data
4. Implement anomaly detection (spikes, unusual timing, off-route refueling)
5. Add vehicle comparison functionality
6. Create predictive analytics for fuel consumption
7. Implement fuel misuse alert system with severity levels
8. Add refueling location tracking and authorization
9. Create driver efficiency ranking system
10. Implement total cost of ownership calculator
11. Add trend analysis with charts
12. Integrate with vehicle ownership data
13. Implement bulk import/export for fuel data
14. Test fuel analysis and alert accuracy

### Phase 14: Large-Scale Material Master Data Management (Week 10)

1. Create material-master.js file
2. Implement pagination system (50-100 records per page)
3. Create advanced search functionality (code, name, category, supplier, specifications)
4. Implement hierarchical categorization (category → sub-category → type)
5. Add bulk import from CSV/Excel
6. Add bulk export functionality
7. Implement bulk update operations
8. Create multi-criteria filtering
9. Add variant management (size, color, grade, finish)
10. Implement lifecycle tracking (active, discontinued, obsolete, pending)
11. Create usage analytics dashboard
12. Add data validation rules
13. Implement material relationships (substitutes, alternatives, bundles, kits)
14. Add favorites/bookmarks functionality
15. Implement change history and audit trail
16. Optimize performance for 7,000+ materials
17. Test with large dataset

### Phase 15: Real-Time Material Tracking Throughout Delivery Lifecycle (Week 11)

1. Create material-tracking.js file
2. Implement 6-stage lifecycle structure (Warehouse Pickup → In Transit → Checkpoint Scan → Near Delivery → Delivered → Confirmed)
3. Create material tracking dashboard with real-time status updates
4. Integrate Leaflet.js map for GPS location tracking
5. Implement tracking event recording with timestamp and GPS
6. Add barcode/QR code scanning functionality for checkpoint verification
7. Implement photo capture interface for condition documentation
8. Create condition monitoring system (good, damaged, temperature alerts)
9. Add handler information tracking at each stage
10. Implement ETA calculation and display
11. Create automated notification system for milestone alerts
12. Add multi-material shipment tracking with individual material tracking
13. Implement tracking number generation for customer lookup
14. Create customer-facing tracking portal
15. Add tracking history timeline with complete audit trail
16. Implement delay and deviation detection with alerts
17. Integrate with order management system
18. Add material-to-order linkage functionality
19. Create alert panel for delays, route deviations, and condition issues
20. Test complete tracking lifecycle from pickup to confirmation
21. Test barcode scanning at all checkpoints
22. Test photo capture and storage
23. Test GPS location accuracy and updates
24. Test notification delivery to stakeholders
25. Test customer portal tracking number lookup

### Phase 16: Specialized Thin Sheet Material Handling (Week 12)

1. Create thin-sheet-handling.js file
2. Implement thin sheet category identification (laminates, sheets, panels, boards)
3. Create handling rules enforcement system
4. Implement stacking calculator (optimal and maximum stack height)
5. Add edge protection requirement system with visual indicators
6. Enforce flat horizontal storage position (no vertical/angled)
7. Create protective packaging checklist (bubble wrap, separators, covering)
8. Implement climate control monitoring (temperature 15-25°C, humidity 40-60%)
9. Create handling instructions checklist for warehouse staff
10. Implement damage tracking system by material type and stage
11. Add damage incident recording with photos
12. Create damage prevention report generator
13. Implement vehicle suitability checker for thin sheet materials
14. Add unsuitable vehicle alert system
15. Create vehicle loading procedure with step-by-step instructions
16. Enforce flat bed vehicle requirement
17. Implement soft strap securing method (no metal contact)
18. Create compliance score calculator by warehouse and handler
19. Generate handling compliance reports
20. Add thin sheet visual indicators in all interfaces
21. Test stacking calculator accuracy
22. Test climate control monitoring
23. Test damage tracking and reporting
24. Test vehicle suitability checking
25. Test compliance scoring system

### Phase 17: Centralized Location-Based Storage Management (Week 13)

1. Create location-storage.js file
2. Implement hierarchical location structure (Warehouse → Zone → Aisle → Rack → Level → Bin)
3. Create location code generator (e.g., WH01-A-05-R3-L2-B12)
4. Implement real-time material location tracking
5. Create visual warehouse map with material location highlighting
6. Add location-based search functionality
7. Implement optimal location calculator based on material characteristics
8. Create storage location suggestion system for incoming materials
9. Implement capacity utilization tracking by zone, aisle, and rack
10. Add "find material" functionality with turn-by-turn navigation
11. Implement barcode scanning for location verification (put-away and picking)
12. Create location history tracking for each material
13. Implement heat map generation for frequently accessed locations
14. Add storage layout optimization based on movement patterns
15. Create incorrect location alert system
16. Implement mobile interface for warehouse staff with handheld devices
17. Add hierarchical location tree view navigation
18. Create interactive warehouse map with clickable locations
19. Implement capacity utilization display with progress bars
20. Add turn-by-turn navigation from entrance to material location
21. Create location history timeline for material movements
22. Implement heat map visualization with color-coded frequency
23. Generate storage layout optimization recommendations
24. Test barcode scanning for location verification
25. Test mobile interface features (scanning, navigation, voice commands)

### Phase 18: Testing & Deployment (Week 14)

1. Comprehensive integration testing
2. Browser compatibility testing
3. Mobile responsiveness testing
4. User acceptance testing
5. Performance optimization
6. Documentation updates
7. Deployment to production

## Deployment Considerations

### Pre-Deployment Checklist

- [ ] All existing functionality preserved
- [ ] New modules integrated seamlessly
- [ ] Forms validated and tested
- [ ] Real-time sync working correctly
- [ ] Communication integrations configured
- [ ] Mobile responsiveness verified
- [ ] Browser compatibility confirmed
- [ ] Error handling implemented
- [ ] User documentation updated
- [ ] Backup of current system created

### Deployment Steps

1. Create backup of current system
2. Deploy new JavaScript files
3. Update index.html with new navigation items
4. Deploy updated CSS styles
5. Configure communication integration credentials
6. Test all functionality in production
7. Monitor for errors
8. Gather user feedback

### Rollback Plan

If issues occur:
1. Restore previous version from backup
2. Identify and fix issues in development
3. Re-test thoroughly
4. Deploy fixed version

## Maintenance and Support

### Monitoring

- Monitor dashboard update timing
- Track notification delivery success rate
- Monitor workflow completion rates
- Track error logs
- Monitor performance metrics

### Regular Maintenance

- Weekly review of error logs
- Monthly performance optimization
- Quarterly feature enhancements
- Regular backup verification
- Security updates as needed

### User Support

- User training on new features
- Documentation and help guides
- Support contact information
- Feedback collection mechanism
- Feature request tracking

## Conclusion

This design provides a comprehensive approach to enhancing the Fleet Management System with warehouse management, improved dispatch workflows, order management, communication integrations, real-time synchronization, enhanced dispatch tracking visibility, route assignment monitoring, fuel management and theft prevention, collaborative dispatch optimization, comprehensive trip lifecycle management, vehicle ownership management, advanced fuel analysis, large-scale material master data management, and real-time material tracking throughout the delivery lifecycle. The design preserves the existing Bootstrap 5 + JavaScript architecture while adding powerful new capabilities that improve operational efficiency and user experience.

The modular approach ensures that each enhancement can be developed, tested, and deployed independently while maintaining integration with the overall system. The focus on real-time synchronization ensures data consistency across all modules, while the communication integration keeps all stakeholders informed of order progress. The new real-time material tracking system provides end-to-end visibility from warehouse pickup to customer confirmation, enhancing transparency and accountability.

### Key Enhancements Summary

1. **Warehouse Management** - Multi-location inventory tracking with stock transfer capabilities
2. **Enhanced Dispatch Workflow** - Visual 7-step process from sales order to delivery
3. **Order Management** - Priority-based filtering and resource assignment
4. **Communication Integration** - WhatsApp and email notifications
5. **Real-Time Synchronization** - Automatic data updates across all modules
6. **Dispatch Tracking Visibility** - Real-time GPS tracking with ETA and delay alerts
7. **Route Assignment Monitoring** - Route compliance verification and deviation detection
8. **Fuel Management** - Consumption tracking and theft prevention (15% variance threshold)
9. **Collaborative Dispatch** - Order consolidation for cost savings and efficiency
10. **Trip Lifecycle Management** - Complete 7-step workflow from ERP integration to reporting
11. **Vehicle Ownership Management** - Unified management of owned and third-party vehicles with cost tracking
12. **Advanced Fuel Analysis** - Comprehensive fuel monitoring with anomaly detection and predictive analytics
13. **Material Master Data Management** - Efficient management of 7,000+ materials with advanced search and bulk operations
14. **Real-Time Material Tracking** - Track materials through 6 lifecycle stages with GPS, barcode scanning, photo capture, and customer portal

The testing strategy emphasizes practical, scenario-based testing appropriate for UI/UX enhancements and system integration, rather than property-based testing which is not applicable to this type of enhancement.

### Business Value

- **Improved Visibility**: Real-time tracking of dispatches, routes, fuel consumption, vehicle ownership, and material delivery lifecycle
- **Cost Reduction**: Fuel theft prevention, collaborative dispatch savings, route optimization, ownership cost analysis
- **Enhanced Efficiency**: Automated workflows, order consolidation, resource optimization, bulk material operations
- **Better Control**: Route compliance monitoring, workflow validation, audit trails, ownership tracking, material condition monitoring
- **Informed Decision Making**: Comprehensive reporting, metrics, analytics, and predictive insights
- **Scalability**: Efficient handling of 7,000+ materials with optimized performance
- **Data Quality**: Validation rules, change tracking, and audit trails for material master data
- **Customer Satisfaction**: Real-time material tracking with customer-facing portal for transparency and trust
- **Accountability**: Complete handler tracking and photo documentation at each delivery stage
- **Risk Mitigation**: Condition monitoring, temperature alerts, and proof of delivery with photos


### Picking List Model

```javascript
{
    id: 'PL001',
    pickingListNumber: 'PICK-2024-001',
    type: 'single-order', // single-order, batch-picking
    status: 'in-progress', // pending, assigned, in-progress, completed, verified
    priority: 'urgent', // urgent, high, normal
    orders: [
        {
            orderId: 'ORD001',
            orderNumber: 'SO-2024-001',
            customer: {
                name: 'ABC Corporation',
                deliveryAddress: 'Bangalore Hub'
            },
            deliveryDeadline: '2024-03-20T18:00:00Z'
        }
    ],
    items: [
        {
            itemNumber: 1,
            materialId: 'MAT001',
            materialCode: 'LAM001',
            materialName: 'Satin Laminate',
            requiredQuantity: 100,
            pickedQuantity: 100,
            unit: 'sheets',
            storageLocation: {
                locationCode: 'WH01-A-05-R3-L2-B12',
                locationAddress: 'Chennai Main Warehouse, Zone A, Aisle 05, Rack 3, Level 2, Bin 12',
                warehouse: 'WH001',
                zone: 'A',
                aisle: '05',
                rack: 'R3',
                level: 'L2',
                bin: 'B12'
            },
            pickingSequence: 1,
            pickStatus: 'completed', // pending, in-progress, completed, verified
            pickedAt: '2024-03-15T10:15:00Z',
            pickedBy: 'picker-001',
            barcodeScan: {
                scanned: true,
                scanTime: '2024-03-15T10:15:00Z',
                barcodeData: 'LAM001-BATCH-2024-001'
            },
            quantityMatch: true,
            specialHandling: {
                isThinSheet: true,
                instructions: [
                    'Handle flat horizontally',
                    'Use edge protection',
                    'Maximum stack height: 50 sheets',
                    'Avoid tilting or bending'
                ]
            }
        },
        {
            itemNumber: 2,
            materialId: 'MAT002',
            materialCode: 'LAM002',
            materialName: 'Gloss Laminate',
            requiredQuantity: 50,
            pickedQuantity: 0,
            unit: 'sheets',
            storageLocation: {
                locationCode: 'WH01-A-06-R2-L1-B08',
                locationAddress: 'Chennai Main Warehouse, Zone A, Aisle 06, Rack 2, Level 1, Bin 08',
                warehouse: 'WH001',
                zone: 'A',
                aisle: '06',
                rack: 'R2',
                level: 'L1',
                bin: 'B08'
            },
            pickingSequence: 2,
            pickStatus: 'pending',
            specialHandling: {
                isThinSheet: true,
                instructions: [
                    'Handle flat horizontally',
                    'Use edge protection',
                    'Maximum stack height: 50 sheets'
                ]
            }
        }
    ],
    pickingRoute: {
        optimized: true,
        totalDistance: 85, // meters
        estimatedTime: 12, // minutes
        routeSequence: [
            {
                step: 1,
                action: 'Start at warehouse entrance',
                location: 'Entrance',
                distance: 0
            },
            {
                step: 2,
                action: 'Go to Zone A',
                location: 'Zone A Entrance',
                distance: 15
            },
            {
                step: 3,
                action: 'Walk to Aisle 05',
                location: 'Aisle 05',
                distance: 25
            },
            {
                step: 4,
                action: 'Pick from Rack 3, Level 2, Bin 12',
                location: 'WH01-A-05-R3-L2-B12',
                distance: 5,
                itemNumber: 1
            },
            {
                step: 5,
                action: 'Walk to Aisle 06',
                location: 'Aisle 06',
                distance: 20
            },
            {
                step: 6,
                action: 'Pick from Rack 2, Level 1, Bin 08',
                location: 'WH01-A-06-R2-L1-B08',
                distance: 5,
                itemNumber: 2
            },
            {
                step: 7,
                action: 'Return to packing area',
                location: 'Packing Area',
                distance: 15
            }
        ],
        warehouseMap: {
            mapUrl: '/maps/picking-route-PL001.svg',
            highlightedLocations: ['WH01-A-05-R3-L2-B12', 'WH01-A-06-R2-L1-B08'],
            routePath: 'M0,0 L15,0 L40,0 L45,5 L65,5 L70,10 L85,10'
        }
    },
    assignment: {
        assignedTo: {
            pickerId: 'picker-001',
            pickerName: 'Rajesh Kumar',
            phone: '+91 98765 11111',
            email: 'rajesh@warehouse.com'
        },
        assignedAt: '2024-03-15T10:00:00Z',
        assignedBy: 'warehouse-manager@system.com',
        workloadScore: 75, // percentage of capacity
        notificationSent: true,
        notificationDelivered: true
    },
    progress: {
        totalItems: 2,
        completedItems: 1,
        pendingItems: 1,
        percentComplete: 50,
        startedAt: '2024-03-15T10:05:00Z',
        estimatedCompletion: '2024-03-15T10:17:00Z'
    },
    performance: {
        timePerPick: 10, // minutes
        accuracyRate: 100, // percentage
        itemsPerHour: 6
    },
    partialPicking: {
        hasPartialPicks: false,
        backorders: []
    },
    completion: {
        completed: false,
        completedAt: null,
        pickerSignature: null,
        verifiedBy: null,
        verifiedAt: null,
        stockUpdated: false
    },
    voiceGuidance: {
        enabled: true,
        language: 'en-US',
        lastPrompt: 'Proceed to Aisle 06, Rack 2, Level 1, Bin 08'
    },
    qrCode: {
        qrCodeUrl: '/qrcodes/picking-list-PL001.png',
        qrCodeData: 'https://system.com/picking/PL001',
        generated: true
    },
    printDetails: {
        printed: true,
        printedAt: '2024-03-15T10:00:00Z',
        printedBy: 'warehouse-manager@system.com',
        copies: 1
    },
    auditTrail: [
        { timestamp: '2024-03-15T09:55:00Z', event: 'Picking list generated', user: 'system' },
        { timestamp: '2024-03-15T10:00:00Z', event: 'Assigned to picker-001', user: 'warehouse-manager@system.com' },
        { timestamp: '2024-03-15T10:00:00Z', event: 'Notification sent to picker', user: 'system' },
        { timestamp: '2024-03-15T10:05:00Z', event: 'Picking started', user: 'picker-001' },
        { timestamp: '2024-03-15T10:15:00Z', event: 'Item 1 picked and verified', user: 'picker-001' }
    ],
    metadata: {
        createdAt: '2024-03-15T09:55:00Z',
        createdBy: 'system',
        lastUpdated: '2024-03-15T10:15:00Z',
        lastUpdatedBy: 'picker-001'
    }
}
```
