import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Button, 
  FlatList, 
  TextInput, 
  StyleSheet, 
  Alert, 
  ScrollView,
  TouchableOpacity,
  Image,
  Modal
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

export default function FleetManagementApp() {
  const [screen, setScreen] = useState('login');
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([
    { 
      id: 'ORD001', 
      customer: 'ABC Corporation',
      location: 'Electronic City, Bangalore', 
      lat: 12.8456, 
      lng: 77.6603,
      priority: 'urgent',
      status: 'pending',
      material: 'Steel Rods',
      quantity: '100 tons',
      phone: '+91 98765 43210',
      address: 'Electronic City Phase 1, Bangalore'
    },
    { 
      id: 'ORD002', 
      customer: 'XYZ Industries',
      location: 'Koramangala, Bangalore', 
      lat: 12.9279, 
      lng: 77.6271,
      priority: 'high',
      status: 'in-transit',
      material: 'Cement Bags',
      quantity: '500 bags',
      phone: '+91 87654 32109',
      address: 'Koramangala 5th Block, Bangalore'
    }
  ]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [deliveryPhoto, setDeliveryPhoto] = useState(null);
  const [signature, setSignature] = useState(null);

  // Warehouse location (start point)
  const warehouseLocation = {
    name: 'Chennai Main Warehouse',
    lat: 13.0827,
    lng: 80.2707
  };
  // 🔐 Login Screen
  if (screen === 'login') {
    return (
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <Text style={styles.title}>🚛 Fleet Management</Text>
          <Text style={styles.subtitle}>Driver Mobile App</Text>
          
          <TextInput 
            placeholder="Driver ID (e.g., D001)" 
            style={styles.input}
            onChangeText={(text) => setUser({...user, id: text})}
          />
          <TextInput 
            placeholder="Password" 
            secureTextEntry 
            style={styles.input}
            onChangeText={(text) => setUser({...user, password: text})}
          />
          
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={() => {
              if (user?.id) {
                setUser({...user, name: 'John Doe', vehicle: 'TN01AB1234'});
                setScreen('dashboard');
              } else {
                Alert.alert('Error', 'Please enter Driver ID');
              }
            }}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 📊 Enhanced Dashboard
  if (screen === 'dashboard') {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome, {user?.name}</Text>
          <Text style={styles.vehicleText}>Vehicle: {user?.vehicle}</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{orders.filter(o => o.status === 'pending').length}</Text>
            <Text style={styles.statLabel}>Pending Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{orders.filter(o => o.status === 'in-transit').length}</Text>
            <Text style={styles.statLabel}>In Transit</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{orders.filter(o => o.status === 'delivered').length}</Text>
            <Text style={styles.statLabel}>Delivered</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => setScreen('orders')}>
            <Text style={styles.actionButtonText}>📦 View Orders</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => setScreen('route')}>
            <Text style={styles.actionButtonText}>🗺️ Route Planning</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => setScreen('documents')}>
            <Text style={styles.actionButtonText}>📄 Documents</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => setScreen('profile')}>
            <Text style={styles.actionButtonText}>👤 Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Text style={styles.activityItem}>• Order ORD001 assigned to your vehicle</Text>
          <Text style={styles.activityItem}>• Route optimized for 2 deliveries</Text>
          <Text style={styles.activityItem}>• Insurance document expires in 15 days</Text>
        </View>
      </ScrollView>
    );
  }
  // 📦 Enhanced Order List
  if (screen === 'orders') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>📦 Delivery Orders</Text>
          <TouchableOpacity onPress={() => setScreen('dashboard')}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.orderCard, { borderLeftColor: getPriorityColor(item.priority) }]}
              onPress={() => {
                setSelectedOrder(item);
                setScreen('details');
              }}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>{item.id}</Text>
                <Text style={[styles.priority, { backgroundColor: getPriorityColor(item.priority) }]}>
                  {item.priority.toUpperCase()}
                </Text>
              </View>
              
              <Text style={styles.customer}>{item.customer}</Text>
              <Text style={styles.location}>📍 {item.location}</Text>
              <Text style={styles.material}>📦 {item.material} ({item.quantity})</Text>
              
              <View style={styles.orderFooter}>
                <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
                  {item.status.toUpperCase()}
                </Text>
                <Text style={styles.phone}>📞 {item.phone}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  // 📦 Enhanced Order Details
  if (screen === 'details') {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Order Details</Text>
          <TouchableOpacity onPress={() => setScreen('orders')}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.orderId}>{selectedOrder.id}</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Customer:</Text>
            <Text style={styles.detailValue}>{selectedOrder.customer}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Material:</Text>
            <Text style={styles.detailValue}>{selectedOrder.material}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Quantity:</Text>
            <Text style={styles.detailValue}>{selectedOrder.quantity}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Delivery Address:</Text>
            <Text style={styles.detailValue}>{selectedOrder.address}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Contact:</Text>
            <Text style={styles.detailValue}>{selectedOrder.phone}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Priority:</Text>
            <Text style={[styles.priority, { backgroundColor: getPriorityColor(selectedOrder.priority) }]}>
              {selectedOrder.priority.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => setScreen('map')}>
            <Text style={styles.actionButtonText}>🗺️ View on Map</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => setScreen('navigation')}>
            <Text style={styles.actionButtonText}>🧭 Start Navigation</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => setScreen('delivery')}>
            <Text style={styles.actionButtonText}>📋 Mark Delivered</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
  // 🗺️ Enhanced Map with Route Planning
  if (screen === 'map') {
    return (
      <View style={styles.container}>
        <View style={styles.mapHeader}>
          <TouchableOpacity onPress={() => setScreen('details')}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.mapTitle}>Delivery Location</Text>
        </View>

        <MapView
          style={styles.map}
          initialRegion={{
            latitude: selectedOrder.lat,
            longitude: selectedOrder.lng,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {/* Warehouse Marker */}
          <Marker
            coordinate={{
              latitude: warehouseLocation.lat,
              longitude: warehouseLocation.lng,
            }}
            title="Warehouse (Start)"
            description={warehouseLocation.name}
            pinColor="green"
          />

          {/* Delivery Location Marker */}
          <Marker
            coordinate={{
              latitude: selectedOrder.lat,
              longitude: selectedOrder.lng,
            }}
            title="Delivery Location"
            description={selectedOrder.customer}
            pinColor={getPriorityColor(selectedOrder.priority)}
          />

          {/* Route Line */}
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#007bff"
              strokeWidth={4}
            />
          )}
        </MapView>

        <View style={styles.mapFooter}>
          <TouchableOpacity 
            style={styles.routeButton} 
            onPress={() => {
              // Simulate route calculation
              setRouteCoordinates([
                warehouseLocation,
                { latitude: selectedOrder.lat, longitude: selectedOrder.lng }
              ]);
              Alert.alert('Route Calculated', 'Optimal route displayed on map');
            }}
          >
            <Text style={styles.buttonText}>📍 Show Route</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 🧭 Navigation Screen
  if (screen === 'navigation') {
    return (
      <View style={styles.container}>
        <View style={styles.navigationHeader}>
          <TouchableOpacity onPress={() => setScreen('details')}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Navigation</Text>
        </View>

        <View style={styles.navigationInfo}>
          <Text style={styles.navigationText}>🎯 Destination: {selectedOrder.customer}</Text>
          <Text style={styles.navigationText}>📍 {selectedOrder.address}</Text>
          <Text style={styles.navigationText}>📞 {selectedOrder.phone}</Text>
          <Text style={styles.navigationText}>⏱️ ETA: 25 minutes</Text>
          <Text style={styles.navigationText}>🛣️ Distance: 12.5 km</Text>
        </View>

        <View style={styles.navigationActions}>
          <TouchableOpacity style={styles.navigationButton}>
            <Text style={styles.buttonText}>📞 Call Customer</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navigationButton}>
            <Text style={styles.buttonText}>📧 Send WhatsApp</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navigationButton}
            onPress={() => setScreen('delivery')}
          >
            <Text style={styles.buttonText}>✅ Arrived at Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  // 🧾 Enhanced Delivery Confirmation with POD
  if (screen === 'delivery') {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>📋 Proof of Delivery</Text>
          <TouchableOpacity onPress={() => setScreen('details')}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.deliveryCard}>
          <Text style={styles.orderId}>{selectedOrder.id}</Text>
          <Text style={styles.customer}>{selectedOrder.customer}</Text>
          
          {/* Delivery Photo */}
          <View style={styles.podSection}>
            <Text style={styles.podLabel}>📸 Delivery Photo:</Text>
            {deliveryPhoto ? (
              <Image source={{ uri: deliveryPhoto }} style={styles.deliveryImage} />
            ) : (
              <TouchableOpacity 
                style={styles.photoButton}
                onPress={async () => {
                  const result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 1,
                  });
                  if (!result.canceled) {
                    setDeliveryPhoto(result.assets[0].uri);
                  }
                }}
              >
                <Text style={styles.photoButtonText}>📷 Take Photo</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Customer Signature */}
          <View style={styles.podSection}>
            <Text style={styles.podLabel}>✍️ Customer Signature:</Text>
            {signature ? (
              <View style={styles.signaturePreview}>
                <Text style={styles.signatureText}>✓ Signature Captured</Text>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.signatureButton}
                onPress={() => {
                  setSignature('customer_signature.png');
                  Alert.alert('Signature', 'Customer signature captured');
                }}
              >
                <Text style={styles.signatureButtonText}>✍️ Capture Signature</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Delivery Notes */}
          <View style={styles.podSection}>
            <Text style={styles.podLabel}>📝 Delivery Notes:</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Enter delivery notes (optional)"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Delivery Status */}
          <View style={styles.podSection}>
            <Text style={styles.podLabel}>📦 Delivery Status:</Text>
            <View style={styles.statusOptions}>
              <TouchableOpacity style={styles.statusOption}>
                <Text style={styles.statusText}>✅ Delivered Successfully</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statusOption}>
                <Text style={styles.statusText}>⚠️ Partial Delivery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statusOption}>
                <Text style={styles.statusText}>❌ Delivery Failed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={() => {
            if (deliveryPhoto && signature) {
              // Update order status
              const updatedOrders = orders.map(order => 
                order.id === selectedOrder.id 
                  ? { ...order, status: 'delivered' }
                  : order
              );
              setOrders(updatedOrders);
              
              Alert.alert(
                'Delivery Confirmed', 
                'Order marked as delivered successfully!',
                [{ text: 'OK', onPress: () => setScreen('dashboard') }]
              );
            } else {
              Alert.alert('Missing Information', 'Please capture photo and signature');
            }
          }}
        >
          <Text style={styles.confirmButtonText}>✅ Confirm Delivery</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
  // 🗺️ Route Planning Screen
  if (screen === 'route') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🗺️ Route Planning</Text>
          <TouchableOpacity onPress={() => setScreen('dashboard')}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
        </View>

        <MapView
          style={styles.routeMap}
          initialRegion={{
            latitude: warehouseLocation.lat,
            longitude: warehouseLocation.lng,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
        >
          {/* Warehouse Marker */}
          <Marker
            coordinate={warehouseLocation}
            title="Start: Warehouse"
            pinColor="green"
          />

          {/* All Delivery Locations */}
          {orders.map((order, index) => (
            <Marker
              key={order.id}
              coordinate={{ latitude: order.lat, longitude: order.lng }}
              title={`Stop ${index + 1}: ${order.customer}`}
              description={order.location}
              pinColor={getPriorityColor(order.priority)}
            />
          ))}
        </MapView>

        <View style={styles.routeInfo}>
          <Text style={styles.routeTitle}>📍 Today's Route</Text>
          <Text style={styles.routeStats}>🚛 Total Stops: {orders.length}</Text>
          <Text style={styles.routeStats}>📏 Estimated Distance: 45.2 km</Text>
          <Text style={styles.routeStats}>⏱️ Estimated Time: 2h 30m</Text>
          <Text style={styles.routeStats}>⛽ Fuel Cost: ₹380</Text>
        </View>
      </View>
    );
  }

  // 📄 Document Management Screen
  if (screen === 'documents') {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>📄 Documents</Text>
          <TouchableOpacity onPress={() => setScreen('dashboard')}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
        </View>

        {/* Document Categories */}
        <View style={styles.documentCategories}>
          <TouchableOpacity style={styles.docCategory}>
            <Text style={styles.docCategoryTitle}>🛡️ Insurance</Text>
            <Text style={styles.docCategoryStatus}>Valid until Dec 2024</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.docCategory}>
            <Text style={styles.docCategoryTitle}>🆔 Driving License</Text>
            <Text style={styles.docCategoryStatus}>Valid until Jun 2025</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.docCategory}>
            <Text style={styles.docCategoryTitle}>📋 Vehicle RC</Text>
            <Text style={styles.docCategoryStatus}>Valid until Jan 2035</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.docCategory, styles.docExpiring]}>
            <Text style={styles.docCategoryTitle}>⚠️ Fitness Certificate</Text>
            <Text style={styles.docExpiringText}>Expires in 15 days!</Text>
          </TouchableOpacity>
        </View>

        {/* Upload Document */}
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={async () => {
            const result = await DocumentPicker.getDocumentAsync({
              type: ['application/pdf', 'image/*'],
            });
            if (result.type === 'success') {
              Alert.alert('Document Uploaded', `${result.name} uploaded successfully`);
            }
          }}
        >
          <Text style={styles.uploadButtonText}>📤 Upload Document</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // 👤 Profile Screen
  if (screen === 'profile') {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>👤 Driver Profile</Text>
          <TouchableOpacity onPress={() => setScreen('dashboard')}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <Text style={styles.profileName}>{user?.name}</Text>
          <Text style={styles.profileDetail}>Driver ID: {user?.id}</Text>
          <Text style={styles.profileDetail}>Vehicle: {user?.vehicle}</Text>
          <Text style={styles.profileDetail}>License: HMV - Valid</Text>
          <Text style={styles.profileDetail}>Experience: 5 years</Text>
          <Text style={styles.profileDetail}>Phone: +91 98765 43210</Text>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => {
            setUser(null);
            setScreen('login');
          }}
        >
          <Text style={styles.logoutButtonText}>🚪 Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return null;
}

// Helper Functions
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'urgent': return '#dc3545';
    case 'high': return '#ffc107';
    case 'normal': return '#007bff';
    default: return '#6c757d';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return '#ffc107';
    case 'in-transit': return '#007bff';
    case 'delivered': return '#28a745';
    default: return '#6c757d';
  }
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  backButton: {
    color: '#007bff',
    fontSize: 16,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  vehicleText: {
    fontSize: 14,
    color: '#6c757d',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
  actionContainer: {
    padding: 20,
  },
  actionButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  recentActivity: {
    padding: 20,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  activityItem: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 5,
  },
  orderCard: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  priority: {
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  customer: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#2c3e50',
  },
  location: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 5,
  },
  material: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 10,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  phone: {
    fontSize: 12,
    color: '#007bff',
  },
  detailsCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6c757d',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#2c3e50',
    flex: 2,
    textAlign: 'right',
  },
  map: {
    flex: 1,
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    color: '#2c3e50',
  },
  mapFooter: {
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  routeButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  routeMap: {
    height: 300,
  },
  routeInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  routeStats: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 5,
  },
  navigationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#007bff',
  },
  navigationInfo: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navigationText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#2c3e50',
  },
  navigationActions: {
    padding: 20,
  },
  navigationButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  deliveryCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  podSection: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  podLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  photoButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  photoButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deliveryImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  signatureButton: {
    backgroundColor: '#ffc107',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  signatureButtonText: {
    color: '#2c3e50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signaturePreview: {
    backgroundColor: '#d1e7dd',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  signatureText: {
    color: '#0f5132',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#f8f9fa',
    textAlignVertical: 'top',
  },
  statusOptions: {
    flexDirection: 'column',
  },
  statusOption: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  statusText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  confirmButton: {
    backgroundColor: '#28a745',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    margin: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  documentCategories: {
    padding: 20,
  },
  docCategory: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  docCategoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  docCategoryStatus: {
    fontSize: 14,
    color: '#28a745',
  },
  docExpiring: {
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  docExpiringText: {
    fontSize: 14,
    color: '#856404',
    fontWeight: 'bold',
  },
  uploadButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    margin: 20,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  profileDetail: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    margin: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// Package.json dependencies needed:
/*
{
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.72.6",
    "react-native-maps": "^1.8.0",
    "expo-document-picker": "~11.5.4",
    "expo-image-picker": "~14.3.2",
    "expo-camera": "~13.4.4"
  }
}
*/