# Implementation Plan: Fleet Management Enhancement

## Overview

This implementation plan breaks down the Fleet Management System enhancement into actionable coding tasks. The enhancement adds warehouse management integration, a visual 7-step dispatch workflow, order management with priority filters, communication integrations (WhatsApp and email), and real-time data synchronization across all modules while preserving the existing Bootstrap 5 + JavaScript architecture.

## Tasks

- [ ] 1. Set up warehouse management module foundation
  - [ ] 1.1 Create warehouse-management.js file with core data structures
    - Implement warehouseModule object with warehouses, materials, stockLevels, and transfers arrays
    - Define warehouse data model with location, capacity, manager, and operating hours
    - Define material data model with stockByWarehouse tracking
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ] 1.2 Add warehouse navigation menu item to index.html
    - Insert "Warehouse" menu item in main navigation
    - Add Font Awesome warehouse icon
    - Link to warehouse section
    - _Requirements: 2.1_

  - [ ]* 1.3 Write unit tests for warehouse data structures
    - Test warehouse creation and validation
    - Test material stock tracking across warehouses
    - Test data model integrity
    - _Requirements: 2.2, 2.3_

- [ ] 2. Implement warehouse dashboard and inventory management UI
  - [ ] 2.1 Create warehouse dashboard section in index.html
    - Add warehouse statistics cards (total warehouses, total materials, low stock alerts)
    - Create warehouse list table with location details
    - Add action buttons for add/edit/delete operations
    - _Requirements: 2.1, 2.2_

  - [ ] 2.2 Implement material inventory table with multi-warehouse view
    - Create table showing materials with stock levels per warehouse
    - Add total stock column
    - Implement low stock highlighting
    - Add filter and search capabilities
    - _Requirements: 2.2, 2.3_

  - [ ] 2.3 Create warehouse modal forms
    - Build add/edit warehouse modal with all fields (name, location, capacity, manager, hours)
    - Build add/edit material modal with stockByWarehouse fields
    - Implement form validation for all required fields
    - Add automatic timestamp fields
    - _Requirements: 2.2, 2.6, 7.1, 7.2_

  - [ ]* 2.4 Write integration tests for warehouse UI
    - Test warehouse creation flow
    - Test material inventory display
    - Test modal form submission
    - _Requirements: 2.1, 2.2_

- [ ] 3. Implement warehouse stock management functionality
  - [ ] 3.1 Implement stock availability checking functions
    - Write checkMaterialAvailability(materialCode, requiredQuantity) function
    - Write findAlternativeSource(materialCode, currentWarehouse) function
    - Implement stock level validation
    - _Requirements: 2.4, 2.5_

  - [ ] 3.2 Implement stock transfer functionality
    - Write initiateStockTransfer(materialCode, fromWarehouse, toWarehouse, quantity) function
    - Create stock transfer modal form
    - Implement transfer validation (sufficient stock, valid warehouses)
    - Update stock levels after transfer
    - _Requirements: 2.5_

  - [ ] 3.3 Implement warehouse dashboard update functions
    - Write updateWarehouseDashboard() function
    - Calculate and display warehouse statistics
    - Update low stock alerts
    - _Requirements: 2.2, 2.3_

  - [ ]* 3.4 Write unit tests for stock management functions
    - Test checkMaterialAvailability with various scenarios
    - Test findAlternativeSource logic
    - Test stock transfer validation and execution
    - _Requirements: 2.4, 2.5_

- [ ] 4. Checkpoint - Verify warehouse module integration
  - Ensure all warehouse tests pass, verify UI displays correctly, ask the user if questions arise.

- [ ] 5. Implement enhanced dispatch workflow foundation
  - [ ] 5.1 Create dispatch workflow data structures in script.js
    - Define dispatchWorkflow object with 7 steps array
    - Define workflow step model (id, name, status, completedAt, completedBy, notes)
    - Create workflow state management functions
    - _Requirements: 3.1, 3.2_

  - [ ] 5.2 Design and implement 7-step workflow UI component
    - Create visual workflow progress bar in dispatch section
    - Implement 7 step indicators: Sales Order → Warehouse → Invoice → Vehicle & Driver Assignment → Dispatch → Tracker → Delivered
    - Add color-coded status (gray=pending, yellow=in-progress, green=completed)
    - Style with Bootstrap and custom CSS
    - _Requirements: 3.1, 3.2, 3.6_

  - [ ] 5.3 Implement workflow initialization and state management
    - Write initializeDispatchWorkflow(orderId) function
    - Write getWorkflowProgress(orderId) function to calculate percentage
    - Implement workflow state persistence in localStorage
    - _Requirements: 3.1, 3.4_

  - [ ]* 5.4 Write unit tests for workflow state management
    - Test workflow initialization
    - Test progress calculation
    - Test state persistence
    - _Requirements: 3.1, 3.4_

- [ ] 6. Implement workflow progression and validation
  - [ ] 6.1 Implement step completion functionality
    - Write completeWorkflowStep(orderId, stepId) function
    - Write validateStepCompletion(orderId, stepId) function for prerequisites
    - Implement automatic progression to next step
    - Add completion timestamp and user tracking
    - _Requirements: 3.2, 3.5, 9.1, 9.3, 9.4_

  - [ ] 6.2 Implement workflow UI update functions
    - Write updateWorkflowUI(orderId) function
    - Update step visual indicators based on status
    - Highlight completed steps with green color
    - Show current step with yellow color
    - _Requirements: 3.2, 3.3, 3.6_

  - [ ] 6.3 Add workflow action buttons and controls
    - Add "Complete Step" buttons for each workflow step
    - Implement button state management (enabled/disabled based on prerequisites)
    - Add workflow history display
    - _Requirements: 3.2, 3.5, 9.1_

  - [ ]* 6.4 Write integration tests for workflow progression
    - Test step-by-step completion flow
    - Test prerequisite validation
    - Test UI updates after step completion
    - _Requirements: 3.2, 3.5, 9.3, 9.4_

- [ ] 7. Restore and enhance order management module
  - [ ] 7.1 Restore Order Management to main navigation menu
    - Add "Order Management" menu item to index.html
    - Add Font Awesome clipboard-list icon
    - Link to order management section
    - _Requirements: 4.1_

  - [ ] 7.2 Create enhanced order management UI section
    - Create order statistics cards (total orders, pending, in-transit, delivered)
    - Build order list table with all columns (order number, customer, material, priority, status, actions)
    - Add priority filter dropdown (All, Urgent, High, Normal)
    - Implement sortable columns
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ] 7.3 Implement order creation form with all required fields
    - Create modal form with customer details (name, phone, email, address)
    - Add material selection with quantity and unit
    - Add pickup location (warehouse selection)
    - Add delivery location fields
    - Add priority dropdown (Urgent, High, Normal)
    - Add special instructions textarea
    - Implement form validation for all fields
    - Add automatic timestamp fields
    - _Requirements: 4.1, 4.2, 7.1, 7.2, 7.3_

  - [ ]* 7.4 Write unit tests for order form validation
    - Test required field validation
    - Test phone and email format validation
    - Test quantity validation (> 0)
    - Test form submission with valid data
    - _Requirements: 4.1, 7.3_

- [ ] 8. Implement order management functionality
  - [ ] 8.1 Implement order creation and management functions
    - Write createOrder(orderData) function with validation
    - Write updateOrderStatus(orderId, newStatus) function
    - Write getOrdersByStatus(status) function
    - Implement order data persistence in localStorage
    - _Requirements: 4.1, 4.4_

  - [ ] 8.2 Implement priority-based filtering
    - Write filterOrdersByPriority(priority) function
    - Connect filter dropdown to filtering logic
    - Update order table display based on filter
    - _Requirements: 4.2, 4.3_

  - [ ] 8.3 Implement order resource assignment
    - Write assignOrderResources(orderId, vehicleId, driverId) function
    - Create assignment modal with vehicle and driver dropdowns
    - Validate resource availability before assignment
    - Update order status to "assigned" after successful assignment
    - _Requirements: 4.4_

  - [ ] 8.4 Integrate order management with warehouse module
    - Check material availability when creating order
    - Suggest alternative warehouses if stock insufficient
    - Update warehouse stock when order is dispatched
    - _Requirements: 2.4, 2.5, 4.4_

  - [ ]* 8.5 Write integration tests for order management
    - Test order creation with warehouse integration
    - Test priority filtering
    - Test resource assignment
    - Test order status updates
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 9. Checkpoint - Verify order management and workflow integration
  - Ensure all order and workflow tests pass, verify end-to-end order lifecycle, ask the user if questions arise.

- [ ] 10. Implement communication integration module
  - [ ] 10.1 Create communication-integration.js file with core structures
    - Define communicationIntegration object with WhatsApp and email config
    - Implement WhatsApp integration with phone number 7676654118
    - Implement email integration with address shinydora753152@gmail.com
    - Define notification templates for common messages
    - _Requirements: 5.1, 5.2_

  - [ ] 10.2 Implement notification sending functions
    - Write sendWhatsAppNotification(phoneNumber, message) function
    - Write sendEmailNotification(recipient, subject, body) function
    - Implement notification queue for retry on failure
    - Add communication log tracking
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ] 10.3 Add communication buttons to header
    - Add WhatsApp integration button with icon
    - Add email integration button with icon
    - Implement click handlers to open communication modals
    - Style buttons consistently with existing header
    - _Requirements: 5.1, 5.2_

  - [ ] 10.4 Implement automated notification triggers
    - Write notifyOrderCreated(orderId) function
    - Write notifyWorkflowProgress(orderId, stepName) function
    - Write notifyDeliveryComplete(orderId) function
    - Integrate notification triggers with order and workflow functions
    - _Requirements: 5.3, 5.4, 5.5_

  - [ ]* 10.5 Write integration tests for communication module
    - Test WhatsApp message formatting and sending
    - Test email composition and sending
    - Test notification triggers for order events
    - Test retry mechanism for failed notifications
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 11. Implement real-time data synchronization engine
  - [ ] 11.1 Create sync engine core functionality
    - Define syncEngine object with 5-second interval
    - Write initializeSyncEngine() function to start synchronization
    - Write syncModule(moduleName) function for specific module sync
    - Implement sync triggers for all modules (dashboard, vehicles, drivers, orders, warehouse)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ] 11.2 Implement change detection and propagation
    - Write detectDataChanges(moduleName) function
    - Write propagateChanges(changes) function to update affected modules
    - Implement conflict detection and resolution
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ] 11.3 Implement dashboard auto-update functionality
    - Write updateDashboardStats() function
    - Connect to sync engine for automatic updates every 5 seconds
    - Update vehicle count, driver count, order count, trip count
    - Fix active trips count display (currently showing incorrect count)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 6.1, 6.2_

  - [ ] 11.4 Integrate sync triggers across all modules
    - Add sync trigger when vehicle status changes
    - Add sync trigger when driver availability changes
    - Add sync trigger when order is created/updated
    - Add sync trigger when material stock changes
    - Add sync trigger when trip status changes
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 11.5 Write integration tests for real-time synchronization
    - Test sync timing (updates within 5 seconds)
    - Test change propagation across modules
    - Test dashboard auto-update
    - Test conflict resolution
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 12. Implement form enhancements and standardization
  - [ ] 12.1 Add automatic timestamps to all forms
    - Enhance all modal forms with createdDate and lastUpdated fields
    - Write addTimestamp(formData) function
    - Auto-populate timestamp fields on form submission
    - Display timestamps in read-only format
    - _Requirements: 7.1, 7.2_

  - [ ] 12.2 Standardize vehicle status terminology
    - Update all references from "active" to "available" in Vehicle Master
    - Update vehicle status display in tables and reports
    - Update vehicle status in dropdown selections
    - Update vehicle status in API responses
    - Ensure backward compatibility with existing data
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ] 12.3 Enhance form validation across all modules
    - Implement validateFormField(field, rules) function
    - Add red asterisk for required fields
    - Implement phone number format validation (10 digits)
    - Implement email format validation
    - Implement quantity minimum value validation (> 0)
    - _Requirements: 7.3, 7.4_

  - [ ] 12.4 Improve error handling and user feedback
    - Write showValidationErrors(errors) function
    - Display inline error messages below form fields
    - Highlight invalid fields with red border
    - Implement user-friendly error messages
    - _Requirements: 7.4_

  - [ ]* 12.5 Write unit tests for form validation
    - Test timestamp auto-population
    - Test required field validation
    - Test format validation (phone, email)
    - Test error message display
    - _Requirements: 7.1, 7.3, 7.4_

- [ ] 13. Implement workflow automation enhancements
  - [ ] 13.1 Add workflow audit trail functionality
    - Create workflow history table showing all step completions
    - Display completion timestamps, user, and notes for each step
    - Implement workflow history modal
    - _Requirements: 9.5_

  - [ ] 13.2 Implement workflow step validation and prevention
    - Enhance validateStepCompletion() to check all prerequisites
    - Prevent skipping of mandatory workflow steps
    - Display validation messages when prerequisites not met
    - _Requirements: 9.4_

  - [ ] 13.3 Add workflow notification integration
    - Write sendWorkflowNotification(orderId, stepId) function
    - Trigger notifications when each workflow step is completed
    - Include order details and next steps in notifications
    - _Requirements: 3.5, 5.3, 5.4_

  - [ ]* 13.4 Write integration tests for workflow automation
    - Test audit trail recording
    - Test step validation and prevention
    - Test notification triggers
    - _Requirements: 9.4, 9.5_

- [ ] 14. Integrate all modules and wire components together
  - [ ] 14.1 Connect warehouse module with order management
    - Integrate material availability check in order creation
    - Update warehouse stock when orders are dispatched
    - Display warehouse information in order details
    - _Requirements: 2.4, 2.5, 4.4_

  - [ ] 14.2 Connect order management with dispatch workflow
    - Initialize workflow when order is created
    - Update order status when workflow steps are completed
    - Display workflow progress in order list
    - _Requirements: 3.4, 4.4_

  - [ ] 14.3 Connect dispatch workflow with communication integration
    - Trigger notifications at each workflow step
    - Send order assignment notifications
    - Send delivery confirmation notifications
    - _Requirements: 3.5, 5.3, 5.4_

  - [ ] 14.4 Connect all modules with real-time sync engine
    - Register all modules with sync engine
    - Implement sync triggers for all data changes
    - Verify dashboard updates reflect all module changes
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ] 14.5 Update main script.js to initialize all new modules
    - Add initialization calls for warehouse module
    - Add initialization calls for communication integration
    - Add initialization calls for sync engine
    - Ensure proper initialization order
    - _Requirements: 10.1, 10.2_

  - [ ]* 14.6 Write end-to-end integration tests
    - Test complete order lifecycle from creation to delivery
    - Test warehouse integration throughout order process
    - Test notifications at each stage
    - Test real-time synchronization across all modules
    - _Requirements: 4.4, 6.3, 6.4_

- [ ] 15. Implement enhanced dispatch tracking visibility
  - [ ] 15.1 Create dispatch-tracking.js file with core structures
    - Define dispatchTracking object with activeDispatches, trackingInterval, mapInstance, markers, alerts
    - Implement tracking data structures for dispatch monitoring
    - Set up 10-second tracking interval for GPS updates
    - _Requirements: 11.1, 11.2, 11.6_

  - [ ] 15.2 Implement real-time dispatch tracking dashboard
    - Create dispatch tracking section in index.html
    - Build active dispatch cards showing current status
    - Display dispatch information (order, vehicle, driver, route)
    - Add status indicators for each workflow step
    - Implement auto-refresh every 10 seconds
    - _Requirements: 11.1, 11.4_

  - [ ] 15.3 Integrate interactive map with live GPS tracking
    - Initialize Leaflet.js map instance
    - Write updateDispatchLocation(dispatchId, coordinates) function
    - Add GPS markers for each active dispatch
    - Implement marker updates with vehicle position
    - Display route path on map
    - Add map controls (zoom, pan, layer selection)
    - _Requirements: 11.2_

  - [ ] 15.4 Implement ETA calculation and delay detection
    - Write calculateETA(dispatchId) function based on distance and speed
    - Write checkDelayStatus(dispatchId) function to detect delays
    - Display ETA with countdown timer
    - Implement delay alert system (toast/modal notifications)
    - Send alerts when dispatches exceed expected timeframes
    - _Requirements: 11.3, 11.5_

  - [ ] 15.5 Add dispatch activity logging and filtering
    - Write logDispatchActivity(dispatchId, activity) function
    - Create activity log table with timestamps
    - Implement filter panel (date, route, vehicle, driver, status)
    - Write filterDispatches(criteria) function
    - Display historical dispatch activities
    - _Requirements: 11.6, 11.7_

  - [ ]* 15.6 Write integration tests for dispatch tracking
    - Test GPS location updates on map
    - Test ETA calculation accuracy
    - Test delay detection and alerts
    - Test filter functionality
    - Test activity log recording
    - _Requirements: 11.1, 11.2, 11.3, 11.5_

- [ ] 16. Implement route assignment monitoring system
  - [ ] 16.1 Create route-monitoring.js file with core structures
    - Define routeMonitoring object with assignments, routeDeviations, utilizationMetrics, auditTrail
    - Implement route assignment data structures
    - Set up monitoring infrastructure
    - _Requirements: 12.1, 12.5_

  - [ ] 16.2 Implement route assignment tracking and dashboard
    - Write trackRouteAssignment(routeId, vehicleId, driverId) function
    - Write displayRouteAssignments() function
    - Create route assignment dashboard section
    - Display vehicle/driver assignment cards
    - Show current route assignments on map
    - _Requirements: 12.1, 12.2_

  - [ ] 16.3 Implement route deviation detection and alerts
    - Write detectRouteDeviation(vehicleId, expectedRoute, actualPath) function
    - Write alertRouteDeviation(vehicleId, deviation) function
    - Integrate with GPS tracking for route compliance
    - Display deviation alerts (real-time notifications)
    - Highlight deviated routes on map
    - _Requirements: 12.3, 12.7_

  - [ ] 16.4 Implement route utilization metrics and vehicle suggestions
    - Write calculateRouteUtilization(routeId) function for distance, time, stops
    - Write suggestOptimalVehicle(routeId, loadRequirements) function
    - Create utilization metrics panel
    - Display route capacity and load information
    - Show vehicle suggestion recommendations
    - _Requirements: 12.4, 12.6_

  - [ ] 16.5 Add route assignment audit trail
    - Write logAssignmentChange(routeId, change) function
    - Create audit trail table with change history
    - Display timestamps, user, and change details
    - Implement audit trail filtering and search
    - _Requirements: 12.5_

  - [ ]* 16.6 Write integration tests for route monitoring
    - Test route assignment tracking
    - Test deviation detection accuracy
    - Test utilization metrics calculation
    - Test vehicle suggestion algorithm
    - Test audit trail logging
    - _Requirements: 12.1, 12.3, 12.4, 12.7_

- [ ] 17. Implement fuel management and theft prevention system
  - [ ] 17.1 Create fuel-management.js file with core structures
    - Define fuelManagement object with fuelRecords, vehicleEfficiency, theftAlerts, costAnalysis
    - Set threshold variance to 15% for theft detection
    - Implement fuel tracking data structures
    - _Requirements: 13.1, 13.3_

  - [ ] 17.2 Implement fuel transaction recording
    - Write recordFuelTransaction(vehicleId, quantity, cost, odometer, location) function
    - Create fuel transaction form (modal) with all fields
    - Implement form validation for fuel data
    - Store transaction log with date, time, location, quantity, cost
    - _Requirements: 13.1, 13.8_

  - [ ] 17.3 Implement fuel consumption analysis and theft detection
    - Write calculateExpectedConsumption(vehicleId, distance) function
    - Write compareActualVsExpected(vehicleId) function
    - Write detectFuelTheft(vehicleId, variance) function
    - Flag discrepancies exceeding 15% variance threshold
    - Calculate variance percentage (actual vs expected)
    - _Requirements: 13.2, 13.3, 13.4_

  - [ ] 17.4 Implement theft alert system and notifications
    - Write sendTheftAlert(vehicleId, details) function
    - Create theft alert panel with flagged vehicles
    - Display variance details and theft indicators
    - Send alerts to fleet managers when theft detected
    - Implement alert notifications (toast/modal)
    - _Requirements: 13.4_

  - [ ] 17.5 Implement fuel efficiency reporting and cost analysis
    - Write generateEfficiencyReport(vehicleId, period) function
    - Write calculateFuelCost(tripId) function
    - Write calculateCostPerKm(vehicleId) function
    - Create efficiency reports table (by vehicle, driver, route)
    - Display cost analysis charts (per trip, per km, trends)
    - _Requirements: 13.5, 13.6_

  - [ ] 17.6 Integrate GPS tracking with fuel consumption
    - Write correlateFuelWithGPS(vehicleId, period) function
    - Match distance traveled (GPS) with fuel consumed
    - Display GPS-fuel correlation view
    - Detect discrepancies between GPS distance and odometer
    - _Requirements: 13.7_

  - [ ]* 17.7 Write integration tests for fuel management
    - Test fuel transaction recording
    - Test expected consumption calculation
    - Test theft detection algorithm (15% threshold)
    - Test alert system
    - Test GPS-fuel correlation
    - _Requirements: 13.2, 13.3, 13.4, 13.7_

- [ ] 18. Checkpoint - Verify tracking, monitoring, and fuel management integration
  - Ensure all tracking and monitoring tests pass, verify GPS integration, test theft detection, ask the user if questions arise.

- [ ] 19. Implement collaborative dispatch and route optimization
  - [ ] 19.1 Create collaborative-dispatch.js file with core structures
    - Define collaborativeDispatch object with pendingOrders, routeSuggestions, consolidatedDispatches, savingsCalculator
    - Implement order consolidation data structures
    - Set up optimization algorithms
    - _Requirements: 14.1, 14.2_

  - [ ] 19.2 Implement order analysis and consolidation suggestions
    - Write analyzePendingOrders() function to identify same/nearby routes
    - Write suggestOrderConsolidation() function to group orders
    - Write prioritizeConsolidations(suggestions) function based on deadlines and priority
    - Display consolidation suggestion cards with order details
    - _Requirements: 14.1, 14.2, 14.5_

  - [ ] 19.3 Implement savings calculator and capacity checker
    - Write calculateSavings(consolidation) function for fuel, time, vehicle usage
    - Write checkVehicleCapacity(vehicleId, orders) function
    - Display estimated cost savings and efficiency gains
    - Verify load limits not exceeded
    - Show capacity utilization visualization
    - _Requirements: 14.3, 14.4, 14.7_

  - [ ] 19.4 Implement collaborative dispatch creation
    - Write createCollaborativeDispatch(orderIds) function
    - Add one-click consolidation button
    - Implement manual override and customization controls
    - Create consolidated dispatch with multiple orders
    - _Requirements: 14.6, 14.9_

  - [ ] 19.5 Implement individual order tracking within consolidated dispatch
    - Write trackIndividualOrders(dispatchId) function
    - Maintain separate tracking for each order
    - Display individual order status within consolidated dispatch
    - Update individual order ETAs
    - _Requirements: 14.8_

  - [ ]* 19.6 Write integration tests for collaborative dispatch
    - Test order analysis and route matching
    - Test consolidation suggestions
    - Test savings calculation accuracy
    - Test capacity checking
    - Test individual order tracking
    - _Requirements: 14.1, 14.3, 14.4, 14.8_

- [ ] 20. Implement comprehensive trip lifecycle management workflow
  - [ ] 20.1 Create trip-lifecycle.js file with core structures
    - Define tripLifecycle object with workflows, steps, erpIntegration, rolePermissions
    - Implement 7-step workflow structure (Order Creation → Planning → Trip Creation → Dispatch Execution → Live Tracking → Trip Closure → Reporting)
    - Set up role-based access control
    - _Requirements: 15.1, 15.12_

  - [ ] 20.2 Implement ERP integration for order synchronization
    - Write syncERPOrders() function to receive sales orders
    - Implement automatic order import from ERP system
    - Create ERP order sync panel
    - Display synced orders with ERP order IDs
    - Handle ERP connection errors gracefully
    - _Requirements: 15.2_

  - [ ] 20.3 Implement Planning stage functionality
    - Write initiatePlanning(orderId) function
    - Implement route optimization algorithms
    - Create planning dashboard with resource allocation
    - Add cost estimation and duration calculation
    - Display planning stage UI with review and approval
    - _Requirements: 15.3_

  - [ ] 20.4 Implement Trip Creation stage
    - Write createTrip(tripData) function
    - Create trip creation form with vehicle, driver, route, load planning
    - Implement resource assignment validation
    - Add load planning with weight and capacity checks
    - _Requirements: 15.4_

  - [ ] 20.5 Implement Dispatch Execution stage
    - Write executeDispatch(tripId) function
    - Create dispatch execution checklist (departure, documents, authorization)
    - Implement document verification
    - Add dispatch authorization controls
    - Record departure time and confirmation
    - _Requirements: 15.5_

  - [ ] 20.6 Implement Live Tracking & Delivery stage
    - Write startLiveTracking(tripId) function
    - Write recordDelivery(tripId, proofOfDelivery) function
    - Enable real-time GPS tracking with map display
    - Calculate and display ETA
    - Monitor delivery status
    - Capture proof of delivery (signature, photo, notes)
    - _Requirements: 15.6_

  - [ ] 20.7 Implement Trip Closure stage
    - Write closeTrip(tripId, closureData) function
    - Create trip closure form with odometer, fuel consumption, completion confirmation
    - Implement proof of delivery capture
    - Record final trip details
    - Validate all required closure data
    - _Requirements: 15.7_

  - [ ] 20.8 Implement Reporting stage
    - Write generateTripReport(tripId) function
    - Create comprehensive trip summary with all stages
    - Display performance metrics (time, distance, cost, efficiency)
    - Generate cost analysis reports
    - Create exception reports for delays, deviations, issues
    - _Requirements: 15.8_

  - [ ] 20.9 Implement workflow validation and audit trail
    - Write validateWorkflowStep(tripId, stepId) function
    - Prevent workflow step skipping
    - Enforce sequential progression
    - Write logWorkflowTransition(tripId, fromStep, toStep) function
    - Maintain audit trail with timestamps for each stage
    - Display workflow progress visually with step indicators
    - _Requirements: 15.9, 15.10, 15.11_

  - [ ] 20.10 Implement role-based access control and notifications
    - Write checkRolePermission(userId, stepId) function
    - Implement role permissions for each workflow stage
    - Write sendWorkflowNotification(tripId, milestone) function
    - Send automated notifications at key milestones
    - Notify stakeholders of workflow progress
    - _Requirements: 15.12, 15.13_

  - [ ]* 20.11 Write integration tests for trip lifecycle management
    - Test complete 7-step workflow from ERP to reporting
    - Test ERP order synchronization
    - Test workflow validation and step prevention
    - Test role-based access control
    - Test automated notifications
    - Test audit trail recording
    - _Requirements: 15.1, 15.2, 15.9, 15.10, 15.11, 15.12, 15.13_

- [ ] 21. Integrate new modules with existing system
  - [ ] 21.1 Connect dispatch tracking with existing dispatch workflow
    - Integrate dispatch tracking with 7-step workflow
    - Update tracking dashboard when workflow steps complete
    - Sync dispatch status with order status
    - _Requirements: 11.4_

  - [ ] 21.2 Connect route monitoring with GPS tracking module
    - Integrate route monitoring with existing GPS tracking
    - Share GPS data between modules
    - Update route compliance based on GPS coordinates
    - _Requirements: 12.7_

  - [ ] 21.3 Connect fuel management with trip and vehicle modules
    - Integrate fuel records with trip data
    - Link fuel consumption to vehicle efficiency profiles
    - Update fuel costs in trip reports
    - _Requirements: 13.6, 13.7_

  - [ ] 21.4 Connect collaborative dispatch with order management
    - Integrate order consolidation with existing order module
    - Update order status when added to collaborative dispatch
    - Sync individual order tracking with main order tracking
    - _Requirements: 14.8_

  - [ ] 21.5 Connect trip lifecycle with all existing modules
    - Integrate ERP sync with order management
    - Connect planning stage with route and resource modules
    - Link dispatch execution with existing dispatch module
    - Integrate live tracking with GPS tracking module
    - Connect trip closure with reporting module
    - _Requirements: 15.2, 15.3, 15.5, 15.6, 15.7, 15.8_

  - [ ] 21.6 Update main script.js to initialize all new modules
    - Add initialization calls for dispatch-tracking.js
    - Add initialization calls for route-monitoring.js
    - Add initialization calls for fuel-management.js
    - Add initialization calls for collaborative-dispatch.js
    - Add initialization calls for trip-lifecycle.js
    - Ensure proper initialization order and dependencies
    - _Requirements: 10.1, 10.2_

  - [ ]* 21.7 Write end-to-end integration tests for new modules
    - Test complete order flow with dispatch tracking
    - Test route monitoring throughout trip lifecycle
    - Test fuel management integration with trips
    - Test collaborative dispatch with multiple orders
    - Test complete trip lifecycle from ERP to reporting
    - _Requirements: 11.1, 12.1, 13.1, 14.1, 15.1_

- [ ] 22. Implement vehicle ownership management (owned and third-party)
  - [ ] 22.1 Create vehicle-ownership.js file with core structures
    - Define vehicleOwnership object with vehicles, ownershipTypes, vendors, contracts, performanceMetrics
    - Implement ownership type classification (owned, third-party)
    - Set up vendor and contract management data structures
    - _Requirements: 16.1, 16.2, 16.3_

  - [ ] 22.2 Extend vehicle data model with ownership details
    - Add ownershipType field to vehicle model
    - Add ownedDetails structure (purchase date, depreciation, insurance, maintenance)
    - Add thirdPartyDetails structure (vendor, contract, rates, payment terms, performance)
    - Update existing vehicle forms to include ownership type selection
    - _Requirements: 16.1, 16.2, 16.3_

  - [ ] 22.3 Implement owned vehicle management functionality
    - Write trackOwnedVehicle(vehicleId, maintenanceData) function
    - Create owned vehicle form with purchase date, depreciation, insurance fields
    - Implement depreciation calculation (straight-line method)
    - Add insurance tracking with policy details and renewal alerts
    - Implement company-managed maintenance schedule
    - _Requirements: 16.2, 16.10_

  - [ ] 22.4 Implement third-party vehicle management functionality
    - Write trackThirdPartyVehicle(vehicleId, contractData) function
    - Create third-party vehicle form with vendor, contract, rates fields
    - Implement contract management (start/end dates, renewal tracking)
    - Add vendor performance tracking (on-time delivery, vehicle condition, compliance)
    - Implement vendor-managed maintenance schedule
    - _Requirements: 16.3, 16.7, 16.10_

  - [ ] 22.5 Implement cost structure calculation by ownership type
    - Write calculateCostStructure(vehicleId) function
    - Calculate fixed costs for owned vehicles (depreciation, insurance, registration)
    - Calculate variable costs (fuel, maintenance, repairs)
    - Calculate rental costs for third-party vehicles (daily rate, per km rate, overtime)
    - Display cost comparison dashboard (owned vs third-party)
    - _Requirements: 16.5_

  - [ ] 22.6 Implement ownership-based reporting and filtering
    - Write generateOwnershipReport(ownershipType) function
    - Add ownership type filter to vehicle lists
    - Create separate performance reports for owned and third-party vehicles
    - Display ownership type badges in vehicle tables
    - Implement vendor performance dashboard
    - _Requirements: 16.4, 16.6, 16.7, 16.9_

  - [ ] 22.7 Implement contract renewal alerts and notifications
    - Write alertContractRenewal(contractId) function
    - Send alerts 60 days before contract expiration
    - Display contract renewal notifications in dashboard
    - Track contract auto-renewal settings
    - _Requirements: 16.8_

  - [ ]* 22.8 Write integration tests for vehicle ownership management
    - Test owned vehicle tracking and cost calculation
    - Test third-party vehicle contract management
    - Test vendor performance tracking
    - Test cost structure comparison
    - Test contract renewal alerts
    - _Requirements: 16.1, 16.2, 16.3, 16.5, 16.7, 16.8_

- [ ] 23. Implement advanced fuel analysis and misuse prevention
  - [ ] 23.1 Create fuel-analysis.js file with advanced structures
    - Define fuelAnalysis object with fuelRecords, baselineEfficiency, anomalyDetection, predictiveAnalytics, driverRankings, alerts
    - Implement baseline efficiency calculation from historical data
    - Set up anomaly detection algorithms
    - _Requirements: 17.1, 17.2_

  - [ ] 23.2 Implement baseline efficiency and consumption pattern tracking
    - Write establishBaseline(vehicleId) function to calculate from historical data
    - Write trackFuelConsumption(vehicleId, driverId, routeId, data) function
    - Track detailed consumption patterns by vehicle, driver, route, time period
    - Calculate average km per liter for each vehicle
    - Store baseline with confidence level
    - _Requirements: 17.1, 17.2_

  - [ ] 23.3 Implement anomaly detection system
    - Write detectAnomalies(vehicleId, transaction) function
    - Detect consumption spikes (sudden increases above baseline)
    - Detect unusual refueling times (late night, off-hours)
    - Detect off-route refueling locations
    - Flag suspicious patterns with severity levels
    - _Requirements: 17.3_

  - [ ] 23.4 Implement vehicle comparison and ranking
    - Write compareVehicles(vehicleIds) function
    - Compare fuel consumption across similar vehicles and routes
    - Identify outliers with poor efficiency
    - Generate vehicle efficiency rankings
    - Display percentile rankings
    - _Requirements: 17.4_

  - [ ] 23.5 Implement predictive analytics for fuel consumption
    - Write predictConsumption(routeId, loadWeight) function
    - Predict expected fuel usage based on route, load, historical data
    - Calculate confidence intervals for predictions
    - Consider factors (distance, load, weather, traffic)
    - Display predicted vs actual comparison
    - _Requirements: 17.5_

  - [ ] 23.6 Implement comprehensive fuel misuse alert system
    - Write generateMisuseAlert(vehicleId, severity) function
    - Create alerts with severity levels (low, medium, high, critical)
    - Track refueling locations and flag unauthorized stations
    - Send alerts to fleet managers when anomalies detected
    - Display alert panel with flagged vehicles and details
    - _Requirements: 17.6, 17.7_

  - [ ] 23.7 Implement driver efficiency tracking and rankings
    - Write rankDriverEfficiency() function
    - Track fuel efficiency by driver
    - Generate driver efficiency leaderboard
    - Calculate driver-specific consumption patterns
    - Display driver rankings with percentiles
    - _Requirements: 17.8_

  - [ ] 23.8 Implement total cost of ownership with fuel analysis
    - Write calculateTotalCostOfOwnership(vehicleId) function
    - Include fuel costs in ownership cost calculation
    - Provide ownership-specific fuel analysis (owned vs third-party)
    - Compare fuel efficiency by ownership type
    - Display cost difference analysis
    - _Requirements: 17.9, 17.10_

  - [ ] 23.9 Implement trend analysis and reporting
    - Write analyzeTrends(period) function
    - Generate trend analysis charts showing consumption over time
    - Display efficiency trends (increasing, decreasing, stable)
    - Calculate change percentages over time periods
    - Create visual charts with historical data
    - _Requirements: 17.10_

  - [ ] 23.10 Implement bulk data import/export functionality
    - Write bulkImportFuelData(file) function for CSV/Excel import
    - Write exportFuelData(filters) function for data export
    - Support bulk fuel transaction import
    - Validate imported data for consistency
    - Provide export with filtering options
    - _Requirements: 17.11, 17.12_

  - [ ] 23.11 Integrate fuel analysis with vehicle ownership data
    - Connect fuel analysis with vehicle ownership module
    - Provide ownership-specific fuel reports
    - Compare fuel efficiency between owned and third-party vehicles
    - Display integrated cost analysis
    - _Requirements: 17.11_

  - [ ]* 23.12 Write integration tests for advanced fuel analysis
    - Test baseline efficiency calculation
    - Test anomaly detection algorithms
    - Test vehicle comparison and ranking
    - Test predictive analytics accuracy
    - Test driver efficiency tracking
    - Test ownership integration
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.8, 17.11_

- [ ] 24. Implement large-scale material master data management (7,000+ materials)
  - [ ] 24.1 Create material-master.js file with scalable structures
    - Define materialMaster object with materials, categories, suppliers, variants, lifecycle, usageAnalytics
    - Implement pagination structure (page, pageSize, totalPages)
    - Set up filter and search data structures
    - Optimize for 7,000+ material records
    - _Requirements: 18.1, 18.7_

  - [ ] 24.2 Implement advanced search functionality
    - Write advancedSearch(criteria) function
    - Support search by code, name, category, supplier, specifications
    - Implement fuzzy search for partial matches
    - Add search result highlighting
    - Optimize search performance for large datasets
    - _Requirements: 18.2_

  - [ ] 24.3 Implement hierarchical categorization system
    - Write manageCategorization(materialId, hierarchy) function
    - Implement 3-level hierarchy (category → sub-category → type)
    - Create category tree navigation UI
    - Support category-based filtering
    - Display full category path for each material
    - _Requirements: 18.3_

  - [ ] 24.4 Implement pagination for material lists
    - Write loadMaterials(page, pageSize) function
    - Set default page size to 50-100 records
    - Implement page navigation controls (first, previous, next, last)
    - Display current page and total pages
    - Optimize rendering for performance
    - _Requirements: 18.7_

  - [ ] 24.5 Implement bulk import/export functionality
    - Write bulkImport(file) function for CSV/Excel import
    - Write bulkExport(filters) function for data export
    - Support bulk material data import with validation
    - Provide export with filtering and selection
    - Display import progress and error reporting
    - _Requirements: 18.4, 18.5_

  - [ ] 24.6 Implement bulk update operations
    - Write bulkUpdate(materialIds, updates) function
    - Support bulk updates for pricing, categories, suppliers, status
    - Implement multi-select functionality in material list
    - Create bulk update form with field selection
    - Validate bulk updates before applying
    - _Requirements: 18.6_

  - [ ] 24.7 Implement multi-criteria filtering system
    - Write filterMaterials(criteria) function
    - Support filtering by category, status, supplier, warehouse, stock level
    - Implement filter combination (AND/OR logic)
    - Create filter panel UI with multiple filter options
    - Display active filters with clear/reset options
    - _Requirements: 18.8_

  - [ ] 24.8 Implement material variants and specifications management
    - Write manageVariants(materialId, variants) function
    - Support variant attributes (size, color, grade, finish)
    - Create variant management UI
    - Track stock levels per variant
    - Display variant options in material details
    - _Requirements: 18.9_

  - [ ] 24.9 Implement material lifecycle tracking
    - Write trackLifecycle(materialId, status) function
    - Support lifecycle statuses (active, discontinued, obsolete, pending)
    - Display lifecycle status indicators
    - Track introduction and discontinuation dates
    - Support replacement material linking
    - _Requirements: 18.10_

  - [ ] 24.10 Implement usage analytics and reporting
    - Write analyzeUsage(materialId) function
    - Track most ordered, slow-moving, out-of-stock frequency
    - Calculate turnover rates and order frequency
    - Classify materials (fast-moving, slow-moving, non-moving)
    - Display usage analytics dashboard
    - _Requirements: 18.11_

  - [ ] 24.11 Implement data validation and quality rules
    - Enforce unique material codes
    - Validate required fields (code, name, category, unit)
    - Implement format validation for codes and specifications
    - Display validation errors with field highlighting
    - Prevent duplicate material codes
    - _Requirements: 18.12_

  - [ ] 24.12 Implement material relationships management
    - Write manageRelationships(materialId, relationships) function
    - Support relationship types (substitutes, alternatives, bundles, kits)
    - Create relationship management UI
    - Display related materials in material details
    - Support bi-directional relationship linking
    - _Requirements: 18.13_

  - [ ] 24.13 Implement favorites/bookmarks functionality
    - Write manageFavorites(userId, materialId) function
    - Add favorite/bookmark toggle for materials
    - Create favorites panel for quick access
    - Track favorite count per material
    - Display frequently used materials
    - _Requirements: 18.14_

  - [ ] 24.14 Implement change history and audit trail
    - Write trackChangeHistory(materialId) function
    - Record all material changes with timestamps
    - Track changed fields, old/new values, user, reason
    - Display change history table
    - Support change history filtering and search
    - _Requirements: 18.15_

  - [ ] 24.15 Optimize performance for 7,000+ materials
    - Implement virtual scrolling for large lists
    - Add lazy loading for material details
    - Optimize search and filter queries
    - Implement caching for frequently accessed data
    - Add loading indicators for async operations
    - _Requirements: 18.1, 18.7_

  - [ ]* 24.16 Write integration tests for material master data management
    - Test advanced search with various criteria
    - Test pagination and navigation
    - Test bulk import/export functionality
    - Test bulk update operations
    - Test filtering with multiple criteria
    - Test variant management
    - Test lifecycle tracking
    - Test usage analytics
    - Test data validation rules
    - Test performance with 7,000+ records
    - _Requirements: 18.1, 18.2, 18.4, 18.5, 18.6, 18.7, 18.8, 18.9, 18.10, 18.11, 18.12_

- [ ] 25. Integrate new modules with existing system
  - [ ] 25.1 Connect vehicle ownership with vehicle master module
    - Integrate ownership details into vehicle management
    - Update vehicle forms to include ownership fields
    - Display ownership information in vehicle lists
    - _Requirements: 16.4_

  - [ ] 25.2 Connect fuel analysis with vehicle ownership and fuel management
    - Integrate advanced fuel analysis with basic fuel management
    - Connect fuel analysis with ownership data for cost comparison
    - Update fuel reports to include ownership-specific analysis
    - _Requirements: 17.9, 17.11_

  - [ ] 25.3 Connect material master with warehouse module
    - Integrate large-scale material management with warehouse inventory
    - Update warehouse stock tracking to use material master data
    - Sync material changes between modules
    - _Requirements: 18.1, 2.2_

  - [ ] 25.4 Update main script.js to initialize new modules
    - Add initialization calls for vehicle-ownership.js
    - Add initialization calls for fuel-analysis.js
    - Add initialization calls for material-master.js
    - Ensure proper initialization order and dependencies
    - _Requirements: 10.1, 10.2_

  - [ ]* 25.5 Write end-to-end integration tests for new modules
    - Test vehicle ownership integration with fleet management
    - Test fuel analysis integration with ownership and trips
    - Test material master integration with warehouse and orders
    - Test complete workflows with new features
    - _Requirements: 16.1, 17.1, 18.1_

- [ ] 26. Implement real-time material tracking throughout delivery lifecycle
  - [ ] 26.1 Create material-tracking.js file with core structures
    - Define materialTracking object with trackingRecords, lifecycleStages, activeTracking, trackingHistory, alerts, customerPortal
    - Implement 6-stage lifecycle structure (Warehouse Pickup → In Transit → Checkpoint Scan → Near Delivery → Delivered → Confirmed)
    - Set up tracking data structures for shipments and materials
    - _Requirements: 19.1, 19.11_

  - [ ] 26.2 Implement material tracking dashboard with real-time status updates
    - Create material tracking section in index.html
    - Build tracking dashboard showing all active shipments
    - Display material cards with current lifecycle stage
    - Add real-time status indicators for each stage
    - Implement auto-refresh for tracking updates
    - _Requirements: 19.11_

  - [ ] 26.3 Integrate interactive map with GPS location tracking
    - Initialize Leaflet.js map instance for material tracking
    - Write updateMaterialLocation(materialId, coordinates, address) function
    - Add GPS markers for each tracked material
    - Display material location updates on map in real-time
    - Show route path from pickup to delivery
    - Add map controls and layer selection
    - _Requirements: 19.4_

  - [ ] 26.4 Implement tracking event recording system
    - Write initiateMaterialTracking(shipmentId, materials) function
    - Write recordTrackingEvent(materialId, stage, data) function
    - Record timestamp and GPS location for each event
    - Capture handler information at each stage
    - Store tracking events in trackingHistory
    - Update lifecycle stage status automatically
    - _Requirements: 19.1, 19.2, 19.8, 19.10_

  - [ ] 26.5 Implement barcode/QR code scanning functionality
    - Write scanBarcode(materialId, stage, scannerData) function
    - Create barcode scanner interface for checkpoint verification
    - Support barcode and QR code formats
    - Validate scanned material against shipment
    - Record scan timestamp and location
    - Display scan confirmation feedback
    - _Requirements: 19.6_

  - [ ] 26.6 Implement photo capture for condition documentation
    - Write captureConditionPhoto(materialId, stage, photo) function
    - Create photo capture interface (camera or file upload)
    - Support photo capture at pickup and delivery stages
    - Store photos with timestamp and stage information
    - Display photo gallery in tracking history
    - Implement photo compression for storage optimization
    - _Requirements: 19.12_

  - [ ] 26.7 Implement condition monitoring system
    - Write checkMaterialCondition(materialId, conditionData) function
    - Track condition status (good, damaged, temperature-sensitive)
    - Monitor temperature and humidity at each checkpoint
    - Generate condition alerts for damaged or temperature issues
    - Display condition status badges in tracking dashboard
    - Record condition notes at each stage
    - _Requirements: 19.3_

  - [ ] 26.8 Implement ETA calculation and display
    - Write calculateEstimatedDelivery(materialId) function
    - Calculate ETA based on current location, distance, traffic
    - Display ETA with confidence level (high, medium, low)
    - Update ETA dynamically as material moves
    - Show countdown timer to estimated delivery
    - _Requirements: 19.9_

  - [ ] 26.9 Implement automated notification system for milestones
    - Write sendTrackingNotification(materialId, stage, recipients) function
    - Send notifications at each lifecycle stage completion
    - Support email and WhatsApp notifications
    - Include tracking details and ETA in notifications
    - Track notification delivery status
    - _Requirements: 19.5_

  - [ ] 26.10 Implement multi-material shipment tracking
    - Write trackMultipleMaterials(shipmentId) function
    - Track multiple materials within single shipment separately
    - Display individual material status within shipment
    - Support different lifecycle stages for different materials
    - Show shipment summary with all materials
    - _Requirements: 19.7_

  - [ ] 26.11 Implement tracking number generation and lookup
    - Write generateTrackingNumber(materialId) function
    - Generate unique tracking numbers for customer lookup
    - Create tracking number format (e.g., TRK-YYYY-NNNN)
    - Write getCustomerTrackingInfo(trackingNumber) function
    - Support tracking number search and validation
    - _Requirements: 19.14_

  - [ ] 26.12 Implement customer-facing tracking portal
    - Create customer tracking portal page (customer-tracking.html)
    - Add tracking number input and search functionality
    - Display public tracking information (no sensitive data)
    - Show lifecycle progress with visual indicators
    - Display current location on map
    - Show ETA and delivery status
    - Track portal access count and last accessed time
    - _Requirements: 19.14_

  - [ ] 26.13 Implement tracking history and audit trail
    - Write getTrackingHistory(materialId) function
    - Display complete tracking history timeline
    - Show all events with timestamps, locations, handlers
    - Include photos and condition reports in history
    - Support filtering and searching history
    - Export tracking history as PDF report
    - _Requirements: 19.10_

  - [ ] 26.14 Implement delay and deviation detection with alerts
    - Write detectDelayOrDeviation(materialId) function
    - Monitor for delivery delays beyond ETA
    - Detect route deviations from expected path
    - Detect condition issues (damage, temperature)
    - Generate alerts with severity levels
    - Send alerts to stakeholders automatically
    - Display alert panel in tracking dashboard
    - _Requirements: 19.15_

  - [ ] 26.15 Integrate material tracking with order management
    - Write linkMaterialToOrder(materialId, orderId) function
    - Connect tracked materials to orders
    - Display material tracking status in order details
    - Update order status based on material delivery
    - Sync material tracking with order workflow
    - _Requirements: 19.13_

  - [ ] 26.16 Implement 6-stage lifecycle workflow UI
    - Create 6-stage progress indicator component
    - Display stages: Warehouse Pickup → In Transit → Checkpoint Scan → Near Delivery → Delivered → Confirmed
    - Use color-coded status (gray=pending, yellow=in-progress, green=completed)
    - Show completion timestamps for each stage
    - Display handler information at each stage
    - Add stage-specific action buttons
    - _Requirements: 19.1_

  - [ ] 26.17 Implement handler tracking at each stage
    - Record handler ID, name, phone at each stage
    - Capture handler signature at pickup and delivery
    - Display handler information in tracking history
    - Track vehicle number for in-transit stage
    - Support multiple handlers for different stages
    - _Requirements: 19.8_

  - [ ]* 26.18 Write integration tests for material tracking
    - Test complete 6-stage lifecycle from pickup to confirmation
    - Test GPS location tracking and map updates
    - Test barcode scanning at all checkpoints
    - Test photo capture and storage
    - Test condition monitoring and alerts
    - Test ETA calculation accuracy
    - Test automated notifications at milestones
    - Test multi-material shipment tracking
    - Test customer portal tracking lookup
    - Test delay and deviation detection
    - Test integration with order management
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.7, 19.8, 19.9, 19.10, 19.11, 19.12, 19.13, 19.14, 19.15_

- [ ] 27. Integrate material tracking with existing system
  - [ ] 27.1 Connect material tracking with warehouse module
    - Integrate tracking initiation with warehouse pickup process
    - Update warehouse stock when material tracking starts
    - Link warehouse location to pickup stage
    - _Requirements: 19.1, 2.2_

  - [ ] 27.2 Connect material tracking with dispatch workflow
    - Integrate material tracking with 7-step dispatch workflow
    - Update tracking status when dispatch workflow progresses
    - Link dispatch execution with "In Transit" stage
    - _Requirements: 19.1, 3.1_

  - [ ] 27.3 Connect material tracking with GPS tracking module
    - Share GPS data between material tracking and vehicle tracking
    - Update material location based on vehicle GPS
    - Sync location updates across modules
    - _Requirements: 19.4_

  - [ ] 27.4 Connect material tracking with order management
    - Display material tracking status in order details
    - Update order status based on material delivery confirmation
    - Link order materials to tracking records
    - _Requirements: 19.13_

  - [ ] 27.5 Connect material tracking with communication integration
    - Send tracking notifications via WhatsApp and email
    - Use existing communication templates
    - Track notification delivery status
    - _Requirements: 19.5, 5.1, 5.2_

  - [ ] 27.6 Update main script.js to initialize material tracking module
    - Add initialization call for material-tracking.js
    - Ensure proper initialization order with dependencies
    - Register material tracking with sync engine
    - _Requirements: 10.1, 10.2_

  - [ ]* 27.7 Write end-to-end integration tests for material tracking
    - Test complete material flow from warehouse to customer
    - Test integration with all related modules
    - Test real-time synchronization of tracking data
    - Test customer portal access and tracking lookup
    - _Requirements: 19.1, 19.11, 19.13, 19.14_

- [ ] 28. Implement specialized thin sheet material handling
  - [ ] 28.1 Create thin-sheet-handling.js file with core structures
    - Define thinSheetHandling object with thinSheetCategories, handlingRules, stackingLimits, storageRequirements, damageTracking, complianceScores, climateMonitoring
    - Implement thin sheet category identification (laminates, sheets, panels, boards)
    - Set up handling rules and storage requirements data structures
    - _Requirements: 20.1, 20.2_

  - [ ] 28.2 Implement thin sheet material identification and classification
    - Write identifyThinSheetMaterial(materialCategory) function
    - Classify materials by thin sheet category
    - Add thin sheet indicator to material data model
    - Display visual indicators (badges/icons) in material lists
    - _Requirements: 20.1, 20.14_

  - [ ] 28.3 Implement handling rules enforcement system
    - Write enforceHandlingInstructions(materialId) function
    - Write enforceFlatStorage(materialId) function for horizontal storage
    - Write requireEdgeProtection(materialId) function for edge guards
    - Create handling instructions panel with checklist
    - Display flat storage position indicator
    - Show edge protection requirement with visual guide
    - _Requirements: 20.2, 20.4, 20.5, 20.9_

  - [ ] 28.4 Implement stacking height calculator
    - Write calculateOptimalStackHeight(materialThickness, materialWeight) function
    - Write setStackHeightLimit(materialType) function (e.g., 50 sheets for laminates)
    - Create stacking calculator UI showing optimal and maximum heights
    - Display stack height warnings when limits approached
    - _Requirements: 20.3, 20.6_

  - [ ] 28.5 Implement protective packaging requirements
    - Write requireProtectivePackaging(materialId) function
    - Create protective packaging checklist (bubble wrap, cardboard separators, plastic covering)
    - Display packaging requirements in handling instructions
    - Track packaging compliance
    - _Requirements: 20.7_

  - [ ] 28.6 Implement climate control monitoring
    - Write enforceClimateControl(warehouseId, temperature, humidity) function
    - Monitor temperature range (15-25°C) and humidity (40-60%)
    - Create climate control monitor with temperature and humidity gauges
    - Generate alerts when climate conditions out of range
    - Display climate status in warehouse dashboard
    - _Requirements: 20.8_

  - [ ] 28.7 Implement handling checklist for warehouse staff
    - Write displayHandlingChecklist(materialId) function
    - Create comprehensive handling instructions checklist
    - Include all handling rules (flat storage, edge protection, stacking limits, packaging, climate)
    - Display checklist in warehouse operations interface
    - Support checklist completion tracking
    - _Requirements: 20.9_

  - [ ] 28.8 Implement damage tracking system
    - Write trackDamageIncident(materialId, stage, damageType) function
    - Write generateDamagePreventionReport(period) function
    - Create damage tracking form with incident type, stage, and photo upload
    - Track damage incidents by material type and handling stage
    - Display damage prevention dashboard with statistics
    - Generate damage analysis and recommendations
    - _Requirements: 20.10, 20.11_

  - [ ] 28.9 Implement vehicle suitability checker for thin sheets
    - Write validateVehicleForThinSheets(vehicleId, materialId) function
    - Write alertUnsuitableVehicle(vehicleId, materialId) function
    - Check vehicle requirements (flat bed, no tilting capability)
    - Display vehicle loading instructions (flat bed, secure strapping, no tilting)
    - Generate alerts when thin sheets assigned to unsuitable vehicles
    - _Requirements: 20.12, 20.13_

  - [ ] 28.10 Implement vehicle loading procedures for thin sheets
    - Create vehicle loading instructions panel
    - Display special loading requirements (flat bed, secure strapping, no tilting)
    - Provide loading checklist for drivers
    - Track loading compliance
    - _Requirements: 20.12_

  - [ ] 28.11 Implement handling compliance scoring
    - Write calculateComplianceScore(warehouseId, handlerId) function
    - Track compliance by warehouse and handler
    - Calculate compliance scores based on rule adherence
    - Display compliance score dashboard
    - Generate compliance reports with recommendations
    - _Requirements: 20.15_

  - [ ]* 28.12 Write integration tests for thin sheet material handling
    - Test material identification and classification
    - Test handling rules enforcement
    - Test stacking height calculations
    - Test climate control monitoring
    - Test damage tracking
    - Test vehicle suitability checking
    - Test compliance scoring
    - _Requirements: 20.1, 20.2, 20.3, 20.8, 20.10, 20.13, 20.15_

- [ ] 29. Implement centralized location-based storage management
  - [ ] 29.1 Create location-storage.js file with core structures
    - Define locationStorage object with locationHierarchy, locationCodes, materialLocations, capacityTracking, warehouseMaps, locationHistory, heatMaps, navigationPaths
    - Implement 6-level hierarchical structure (Warehouse → Zone → Aisle → Rack → Level → Bin)
    - Set up location tracking data structures
    - _Requirements: 21.1, 21.2_

  - [ ] 29.2 Implement hierarchical location structure and code generation
    - Write createLocationHierarchy(warehouse, zone, aisle, rack, level, bin) function
    - Write generateLocationCode(warehouse, zone, aisle, rack, level, bin) function
    - Generate unique location codes (e.g., WH01-A-05-R3-L2-B12)
    - Create hierarchical location tree view UI
    - Display location code generator and validator
    - _Requirements: 21.1, 21.2_

  - [ ] 29.3 Implement real-time material location tracking
    - Write trackMaterialLocation(materialId, locationCode) function
    - Write updateMaterialLocation(materialId, newLocationCode) function
    - Track material location in real-time with automatic updates
    - Update location on material movement
    - Display current location in material details
    - _Requirements: 21.3_

  - [ ] 29.4 Implement visual warehouse map with material locations
    - Write displayWarehouseMap(warehouseId) function
    - Create interactive warehouse map with clickable locations
    - Highlight material locations on map
    - Display material information on location hover/click
    - Add map controls (zoom, pan, layer selection)
    - _Requirements: 21.4_

  - [ ] 29.5 Implement location-based search functionality
    - Write searchByLocation(locationCode) function
    - Support search by warehouse, zone, aisle, rack, level, bin
    - Find all materials in specific location
    - Display search results with material details
    - Add location-based filter in material search
    - _Requirements: 21.5_

  - [ ] 29.6 Implement optimal location calculator
    - Write calculateOptimalLocation(materialCharacteristics) function
    - Calculate optimal storage location based on size, weight, access frequency
    - Consider material characteristics (dimensions, weight, turnover rate)
    - Display location recommendation with reasoning
    - _Requirements: 21.6_

  - [ ] 29.7 Implement storage location suggestions for incoming materials
    - Write suggestStorageLocation(materialId, incomingQuantity) function
    - Suggest storage locations for incoming materials
    - Consider available space and material type
    - Display storage location suggestion panel
    - Support manual override of suggestions
    - _Requirements: 21.7_

  - [ ] 29.8 Implement capacity utilization tracking
    - Write trackCapacityUtilization(zone, aisle, rack) function
    - Calculate storage capacity utilization by zone, aisle, and rack
    - Display capacity utilization dashboard with progress bars
    - Show capacity status indicators (Available, Partial, Full)
    - Generate capacity reports
    - _Requirements: 21.8_

  - [ ] 29.9 Implement "find material" navigation functionality
    - Write findMaterial(materialId) function
    - Provide turn-by-turn navigation to material location
    - Display navigation path on warehouse map
    - Show step-by-step directions (go to zone A, aisle 5, rack 3, level 2, bin 12)
    - Create mobile-friendly navigation interface
    - _Requirements: 21.9_

  - [ ] 29.10 Implement barcode scanning for location verification
    - Write scanLocationBarcode(locationCode) function
    - Support barcode scanning for location verification during put-away and picking
    - Create barcode scanner interface
    - Validate scanned location against expected location
    - Display scan confirmation feedback
    - _Requirements: 21.10_

  - [ ] 29.11 Implement location history tracking
    - Write maintainLocationHistory(materialId) function
    - Track where material was stored previously
    - Display location history timeline for each material
    - Show movement dates and reasons
    - Support location history filtering and search
    - _Requirements: 21.11_

  - [ ] 29.12 Implement heat map generation for frequently accessed locations
    - Write generateHeatMap(warehouseId, period) function
    - Show frequently accessed locations with color intensity
    - Display heat map visualization on warehouse map
    - Support time period selection (day, week, month)
    - Identify hot spots and cold spots
    - _Requirements: 21.12_

  - [ ] 29.13 Implement storage layout optimization
    - Write optimizeStorageLayout(warehouseId) function
    - Analyze material movement patterns
    - Suggest layout optimization (fast-moving materials near entrance)
    - Display optimization recommendations
    - Calculate potential efficiency gains
    - _Requirements: 21.13_

  - [ ] 29.14 Implement incorrect location alerts
    - Write alertIncorrectLocation(materialId, expectedLocation, actualLocation) function
    - Detect when materials stored in incorrect locations
    - Generate alerts with correction options
    - Display incorrect location alert panel
    - Track location accuracy metrics
    - _Requirements: 21.14_

  - [ ] 29.15 Implement mobile-friendly interface for warehouse staff
    - Write getMobileInterface() function
    - Create mobile-optimized interface for handheld devices
    - Support touch-friendly controls
    - Optimize for small screens
    - Enable offline mode for warehouse operations
    - _Requirements: 21.15_

  - [ ]* 29.16 Write integration tests for location-based storage management
    - Test hierarchical location structure and code generation
    - Test real-time material location tracking
    - Test warehouse map display and interaction
    - Test location-based search
    - Test optimal location calculator
    - Test capacity utilization tracking
    - Test navigation functionality
    - Test barcode scanning
    - Test heat map generation
    - Test storage layout optimization
    - Test incorrect location alerts
    - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5, 21.6, 21.8, 21.9, 21.10, 21.12, 21.13, 21.14_

- [ ] 30. Integrate thin sheet handling and location-based storage with existing system
  - [ ] 30.1 Connect thin sheet handling with material master module
    - Integrate thin sheet identification with material master data
    - Add thin sheet indicators to material lists
    - Display handling requirements in material details
    - _Requirements: 20.1, 20.14, 18.1_

  - [ ] 30.2 Connect thin sheet handling with warehouse module
    - Integrate handling rules with warehouse operations
    - Display handling instructions in warehouse interface
    - Track compliance in warehouse dashboard
    - _Requirements: 20.2, 20.9, 2.1_

  - [ ] 30.3 Connect thin sheet handling with vehicle assignment
    - Integrate vehicle suitability checker with vehicle assignment process
    - Alert when thin sheets assigned to unsuitable vehicles
    - Display vehicle loading instructions in dispatch
    - _Requirements: 20.12, 20.13_

  - [ ] 30.4 Connect location-based storage with warehouse module
    - Integrate location tracking with warehouse inventory
    - Display material locations in warehouse dashboard
    - Update locations on stock movements
    - _Requirements: 21.3, 21.4, 2.2_

  - [ ] 30.5 Connect location-based storage with material master module
    - Link material records with location data
    - Display current location in material details
    - Support location-based material search
    - _Requirements: 21.3, 21.5, 18.1_

  - [ ] 30.6 Connect location-based storage with material tracking
    - Integrate warehouse pickup location with material tracking
    - Update tracking when material moves from storage location
    - Display storage location in tracking history
    - _Requirements: 21.3, 19.1_

  - [ ] 30.7 Update main script.js to initialize new modules
    - Add initialization call for thin-sheet-handling.js
    - Add initialization call for location-storage.js
    - Ensure proper initialization order with dependencies
    - Register modules with sync engine
    - _Requirements: 10.1, 10.2_

  - [ ]* 30.8 Write end-to-end integration tests for new modules
    - Test thin sheet handling throughout order lifecycle
    - Test location-based storage from receiving to picking
    - Test integration with material master and warehouse modules
    - Test vehicle assignment with thin sheet materials
    - Test material tracking with storage locations
    - _Requirements: 20.1, 20.12, 21.1, 21.3, 21.5_

- [ ] 31. Implement system-generated material picking list
  - [ ] 31.1 Create picking-list.js file with core structures
    - Define pickingListSystem object with pickingLists, pickingQueue, assignedPickers, pickingPerformance, batchPicking, routeOptimization
    - Implement picking list data structures
    - Set up route optimization algorithms
    - _Requirements: 22.1, 22.3_

  - [ ] 31.2 Implement automatic picking list generation
    - Write generatePickingList(orderId) function to auto-generate when order confirmed
    - Include all required information (order number, customer, material details, location, sequence)
    - Create picking list generation form with order selection
    - Display generated picking lists in dashboard
    - _Requirements: 22.1, 22.2_

  - [ ] 31.3 Implement picking sequence optimization
    - Write optimizePickingSequence(pickingList) function
    - Optimize route based on warehouse layout (zone-by-zone, aisle-by-aisle)
    - Calculate total distance and estimated time
    - Generate turn-by-turn navigation instructions
    - _Requirements: 22.3_

  - [ ] 31.4 Implement batch picking functionality
    - Write batchPickingLists(orderIds) function
    - Group multiple orders with materials in same locations
    - Create batch picking consolidation view
    - Display multiple orders within single picking list
    - _Requirements: 22.4_

  - [ ] 31.5 Implement picking list prioritization
    - Write prioritizePickingLists(pickingLists) function
    - Sort by order priority (urgent, high, normal) and delivery deadlines
    - Display priority indicator badges
    - Auto-assign high priority lists first
    - _Requirements: 22.5_

  - [ ] 31.6 Implement visual warehouse map with picking route
    - Write displayPickingRoute(pickingListId) function
    - Show warehouse map with highlighted picking locations
    - Display suggested route with numbered sequence
    - Add distance and time estimates for each step
    - _Requirements: 22.6_

  - [ ] 31.7 Implement barcode scanning for pick confirmation
    - Write scanPickedItem(pickingListId, materialId, quantity) function
    - Create barcode scanner interface for mobile devices
    - Confirm material picked and update status in real-time
    - Display scan confirmation feedback
    - _Requirements: 22.7_

  - [ ] 31.8 Implement picking progress tracking
    - Write updatePickStatus(pickingListId, status) function
    - Track status (pending, in-progress, completed, verified)
    - Display real-time progress tracker with item-by-item status
    - Calculate percent complete
    - _Requirements: 22.8_

  - [ ] 31.9 Implement quantity verification and mismatch alerts
    - Write alertQuantityMismatch(pickingListId, materialId, expected, actual) function
    - Create quantity verification form
    - Alert when picked quantity doesn't match required quantity
    - Display mismatch details and correction options
    - _Requirements: 22.9_

  - [ ] 31.10 Implement partial picking and backorder creation
    - Write handlePartialPicking(pickingListId, materialId, pickedQuantity) function
    - Support partial picking for out-of-stock items
    - Automatically create backorders for remaining quantity
    - Display partial pick status and backorder details
    - _Requirements: 22.10_

  - [ ] 31.11 Implement automatic stock level updates
    - Write updateStockOnCompletion(pickingListId) function
    - Update warehouse stock levels when picking completed
    - Sync stock changes with warehouse module
    - Display stock update confirmation
    - _Requirements: 22.11_

  - [ ] 31.12 Implement picking performance metrics
    - Write calculatePickingMetrics(pickerId, period) function
    - Track time per pick, accuracy rate, items per hour
    - Generate performance metrics dashboard
    - Display picker rankings and efficiency scores
    - _Requirements: 22.12_

  - [ ] 31.13 Implement picker assignment with workload balancing
    - Write assignPickingList(pickingListId, pickerId) function
    - Assign picking lists to warehouse staff
    - Balance workload across available pickers
    - Display picker assignment panel with workload distribution
    - _Requirements: 22.13_

  - [ ] 31.14 Implement picker notifications
    - Write notifyPickerAssignment(pickerId, pickingListId) function
    - Send notifications when new picking lists assigned
    - Support email and mobile push notifications
    - Track notification delivery status
    - _Requirements: 22.14_

  - [ ] 31.15 Implement mobile-optimized picking interface
    - Write provideMobileGuidance(pickingListId) function
    - Create mobile-friendly picking interface with large buttons
    - Provide step-by-step guidance with turn-by-turn navigation
    - Optimize for handheld devices and touch screens
    - _Requirements: 22.15_

  - [ ] 31.16 Implement voice-guided picking
    - Write enableVoiceGuidedPicking(pickingListId) function
    - Support voice commands for hands-free operation
    - Provide audio prompts for each picking step
    - Enable voice confirmation of picks
    - _Requirements: 22.16_

  - [ ] 31.17 Implement picker signature capture
    - Write capturePickerSignature(pickingListId, signature) function
    - Create signature capture pad interface
    - Record completion signature and timestamp
    - Display signature in picking history
    - _Requirements: 22.17_

  - [ ] 31.18 Integrate with thin sheet material handling
    - Write displayHandlingInstructions(materialId) function
    - Show special handling instructions during picking
    - Display thin sheet handling rules (flat storage, edge protection)
    - Alert picker when handling thin sheet materials
    - _Requirements: 22.18_

  - [ ] 31.19 Implement printable picking lists with QR codes
    - Write printPickingListWithQR(pickingListId) function
    - Generate printable picking list template
    - Include QR code for easy mobile access
    - Support multiple print copies
    - _Requirements: 22.19_

  - [ ] 31.20 Implement picking history and audit trail
    - Write maintainPickingHistory(pickingListId) function
    - Store complete audit trail of all picks
    - Display picking history log with filtering and search
    - Track all events with timestamps and users
    - _Requirements: 22.20_

  - [ ]* 31.21 Write integration tests for picking list system
    - Test automatic picking list generation
    - Test route optimization algorithms
    - Test batch picking consolidation
    - Test barcode scanning and verification
    - Test quantity mismatch detection
    - Test partial picking and backorders
    - Test stock level updates
    - Test performance metrics calculation
    - Test picker assignment and notifications
    - Test mobile interface and voice guidance
    - Test integration with thin sheet handling
    - _Requirements: 22.1, 22.3, 22.4, 22.7, 22.9, 22.10, 22.11, 22.12, 22.13, 22.14, 22.15, 22.16, 22.18_

- [ ] 32. Integrate picking list system with existing modules
  - [ ] 32.1 Connect picking list with order management
    - Integrate picking list generation with order confirmation
    - Update order status when picking completed
    - Display picking status in order details
    - _Requirements: 22.1, 4.1_

  - [ ] 32.2 Connect picking list with warehouse module
    - Integrate with warehouse stock tracking
    - Update stock levels on pick completion
    - Display picking activity in warehouse dashboard
    - _Requirements: 22.11, 2.2_

  - [ ] 32.3 Connect picking list with location-based storage
    - Use location codes for picking routes
    - Display turn-by-turn navigation to storage locations
    - Integrate with warehouse map visualization
    - _Requirements: 22.6, 21.4, 21.9_

  - [ ] 32.4 Connect picking list with material master
    - Link materials to picking list items
    - Display material details and specifications
    - Show material variants and handling requirements
    - _Requirements: 22.2, 18.1_

  - [ ] 32.5 Connect picking list with thin sheet handling
    - Display handling instructions for thin sheet materials
    - Show special handling alerts during picking
    - Track handling compliance in picking process
    - _Requirements: 22.18, 20.2, 20.9_

  - [ ] 32.6 Connect picking list with dispatch workflow
    - Trigger picking list generation at warehouse workflow step
    - Update dispatch workflow when picking completed
    - Link picking lists to dispatch records
    - _Requirements: 22.1, 3.1_

  - [ ] 32.7 Update main script.js to initialize picking list module
    - Add initialization call for picking-list.js
    - Ensure proper initialization order with dependencies
    - Register picking list module with sync engine
    - _Requirements: 10.1, 10.2_

  - [ ]* 32.8 Write end-to-end integration tests for picking list
    - Test complete picking flow from order to stock update
    - Test integration with all related modules
    - Test batch picking with multiple orders
    - Test mobile picking with barcode scanning
    - Test voice-guided picking workflow
    - _Requirements: 22.1, 22.4, 22.7, 22.11, 22.15, 22.16_

- [ ] 33. Final checkpoint and comprehensive system verification
  - Ensure all tests pass, verify all requirements (1-22) are met, test complete user workflows including thin sheet handling, location-based storage, and picking list features, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability (format: X.Y from requirements.md)
- The implementation preserves the existing Bootstrap 5 + JavaScript architecture
- All new features integrate seamlessly with existing functionality
- Real-time synchronization ensures data consistency across all modules with 5-second update intervals
- Communication integration uses WhatsApp (7676654118) and email (shinydora753152@gmail.com)
- The 7-step dispatch workflow provides visual progress tracking: Sales Order → Warehouse → Invoice → Vehicle & Driver Assignment → Dispatch → Tracker → Delivered
- Checkpoints ensure incremental validation and provide opportunities for user feedback
- All forms follow the existing modal-based pattern with automatic timestamps and validation
- Vehicle status terminology is standardized from "active" to "available" throughout the system
- Enhanced dispatch tracking provides real-time GPS monitoring with ETA calculations and delay alerts
- Route assignment monitoring detects deviations and provides utilization metrics
- Fuel management system detects potential theft with 15% variance threshold
- Collaborative dispatch optimizes order consolidation for cost savings and efficiency
- Trip lifecycle management implements complete 7-step workflow from ERP integration to reporting with role-based access control
- Vehicle ownership management supports both company-owned and third-party contracted vehicles with separate cost structures and maintenance schedules
- Advanced fuel analysis provides baseline efficiency tracking, anomaly detection, predictive analytics, and driver efficiency rankings
- Material master data management supports 7,000+ materials with advanced search, bulk operations, and hierarchical categorization
- Real-time material tracking provides 6-stage lifecycle monitoring from warehouse pickup to customer confirmation
- Specialized thin sheet material handling ensures damage prevention with flat storage, edge protection, stacking limits, and climate control
- Centralized location-based storage management provides precise bin-level tracking with hierarchical location structure and warehouse navigationer efficiency rankings
- Material master data management handles 7,000+ materials with advanced search, hierarchical categorization, bulk operations, pagination, and usage analytics
- Real-time material tracking provides 6-stage lifecycle monitoring from warehouse pickup to customer confirmation with GPS tracking, barcode scanning, photo capture, condition monitoring, and customer-facing tracking portal
- System-generated material picking lists automate warehouse operations with route optimization, batch picking, barcode scanning, voice guidance, and real-time stock updates
