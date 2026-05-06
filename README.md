# Fleet Management System - Dispatch Management Application

A comprehensive web-based Fleet Management System with real-time GPS tracking, dispatch management, and Power BI analytics integration.

## 🚚 Features

### 📊 Dashboard
- Real-time KPI monitoring
- Fleet overview metrics
- Recent activities tracking
- Alert management system

### 🚛 Dispatch Management
- **Complete Workflow Implementation:**
  1. Order Creation → Assignment → Trip Creation → Dispatch → Tracking → Delivery → Reporting
- Order management with priority levels
- Automatic and manual vehicle/driver assignment
- Real-time trip tracking and status updates
- Proof of delivery system

### 🗺️ GPS Tracking
- **Real-time vehicle tracking** with Leaflet maps
- Live location updates every 5 seconds
- Vehicle status monitoring (Active, Idle, Maintenance)
- Speed and route deviation alerts
- Traffic layer integration
- Vehicle filtering by type and status

### 📈 Power BI Analytics
- **Embedded Power BI reports** for comprehensive analytics
- Real-time metrics dashboard
- Multiple report categories:
  - Fleet Overview Dashboard
  - Dispatch Performance Analytics
  - Fuel Consumption Analysis
  - Driver Performance Metrics
- Interactive charts and visualizations
- Export and fullscreen capabilities

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **UI Framework:** Bootstrap 5.3.0
- **Maps:** Leaflet.js for GPS tracking
- **Charts:** Chart.js for data visualization
- **Analytics:** Power BI JavaScript SDK
- **Icons:** Font Awesome 6.0.0

## 🚀 Quick Start

1. **Clone or download** the project files
2. **Open `index.html`** in a modern web browser
3. **Navigate** through different sections using the top navigation

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## 🔧 Core Modules

### 1. Vehicle Management
- Vehicle registration and details
- Status tracking (Active/Idle/Maintenance)
- Driver assignment
- Real-time location monitoring

### 2. Driver Management
- Driver profiles and licensing
- Availability status
- Performance tracking
- Contact management

### 3. Order Management
- Customer order creation
- Priority-based processing
- Material details tracking
- Status workflow management

### 4. Trip Management
- Trip creation and assignment
- Route planning
- Progress monitoring
- Completion tracking

### 5. Real-time Tracking
- GPS location updates
- Speed monitoring
- Route deviation alerts
- Geofencing capabilities

### 6. Analytics & Reporting
- Power BI integration
- Real-time dashboards
- Performance metrics
- Fuel analysis
- Driver performance reports

## 🎯 Dispatch Workflow

```
Order Created
    ↓
Assign Vehicle & Driver
    ↓
Create Trip
    ↓
Dispatch (Start Delivery)
    ↓
Track Vehicle (Real-time GPS)
    ↓
Delivered (Proof of Delivery)
    ↓
Close Order & Generate Report
```

## 📊 Sample Data

The application includes comprehensive sample data:
- **5 Vehicles** with different types (Truck, Van, Car)
- **4 Sample Orders** with various priorities
- **3 Active Trips** in different stages
- **Real-time GPS coordinates** for Chennai area

## 🔄 Real-time Features

### GPS Tracking
- Vehicle positions update every 5 seconds
- Speed and status monitoring
- Route deviation detection
- Automatic alerts for various conditions

### Dashboard Updates
- KPI metrics refresh every 10 seconds
- Live activity feed
- Real-time alert system
- Trip progress updates

### Power BI Integration
- Live data connections
- Automatic report refresh
- Real-time metric updates
- Interactive filtering

## 🎨 User Interface

### Modern Design
- Clean, professional interface
- Intuitive navigation
- Responsive layout
- Smooth animations and transitions

### Color Coding
- **Blue:** Primary actions and information
- **Green:** Success states and completed items
- **Yellow:** Warnings and pending items
- **Red:** Alerts and critical issues

## 📋 Usage Instructions

### Creating Orders
1. Navigate to **Dispatch Management**
2. Fill in the **Create New Order** form
3. Set priority level (Normal/High/Urgent)
4. Click **Create Order**

### Assigning Resources
1. View **Pending Orders** list
2. Check **Available Vehicles** and **Drivers**
3. Use **Auto Assign** for automatic assignment
4. Or select resources and use **Manual Assign**

### Tracking Vehicles
1. Go to **GPS Tracking** section
2. View all vehicles on the interactive map
3. Click on vehicle markers for details
4. Use filters to show specific vehicle types
5. Start **Real-time Tracking** for live updates

### Viewing Reports
1. Navigate to **Power BI Reports**
2. Select report category
3. View interactive dashboards
4. Use **Refresh** for latest data
5. **Export** reports as needed

## 🔧 Customization

### Adding New Vehicles
Update the `sampleData.vehicles` array in `script.js`:

```javascript
{
    id: 'V006',
    number: 'TN06KL1234',
    type: 'truck',
    status: 'active',
    driver: 'Driver Name',
    lat: 13.0827,
    lng: 80.2707,
    speed: 0
}
```

### Configuring Power BI
Replace the mock reports with actual Power BI embed codes in the `generateMockReport()` function.

### Map Customization
Modify the Leaflet map configuration in `initializeGPSTracking()` function to change:
- Default center location
- Zoom levels
- Map tile providers
- Marker styles

## 🚀 Deployment

### Local Development
Simply open `index.html` in a web browser.

### Web Server Deployment
1. Upload all files to your web server
2. Ensure proper MIME types for CSS and JS files
3. Configure HTTPS for GPS location access
4. Set up Power BI embedding credentials

### Production Considerations
- Replace sample data with real database connections
- Implement proper authentication and authorization
- Set up real GPS tracking APIs
- Configure actual Power BI workspace and reports
- Add error handling and logging
- Implement data validation and security measures

## 🔒 Security Features

- Input validation on all forms
- XSS protection through proper data handling
- Secure GPS data transmission
- Role-based access control ready
- Audit trail capabilities

## 📞 Support

For technical support or feature requests, please refer to the documentation or contact the development team.

## 🎉 Demo Features

The application includes several demo features to showcase functionality:
- Simulated real-time vehicle movement
- Mock Power BI reports with sample data
- Interactive workflow demonstrations
- Sample alerts and notifications

---

**Built with ❤️ for efficient fleet management and dispatch operations**