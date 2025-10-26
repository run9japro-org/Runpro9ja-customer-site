import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getActiveDeliveries } from "../services/adminService";
import { Play, Pause, RotateCcw, Navigation, Clock, MapPin } from "lucide-react";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom delivery icons for different statuses
const deliveryIcons = {
  'In Transit': new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  }),
  'Pending': new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828843.png",
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25],
  }),
  'Delivered': new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25],
  }),
  'Selected': new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
    className: 'selected-marker'
  })
};

const Delivery = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const center = [6.5244, 3.3792]; // Lagos center

  // Generate sample tracking route
  const generateTrackingRoute = (startLocation) => {
    const routes = [
      [
        startLocation,
        [startLocation[0] + 0.01, startLocation[1] + 0.01],
        [startLocation[0] + 0.02, startLocation[1] + 0.005],
        [startLocation[0] + 0.03, startLocation[1] + 0.002],
        [startLocation[0] + 0.035, startLocation[1] - 0.001],
      ],
      [
        startLocation,
        [startLocation[0] - 0.005, startLocation[1] + 0.015],
        [startLocation[0] - 0.01, startLocation[1] + 0.025],
        [startLocation[0] - 0.008, startLocation[1] + 0.035],
        [startLocation[0] - 0.005, startLocation[1] + 0.045],
      ]
    ];
    return routes[Math.floor(Math.random() * routes.length)];
  };

  // Fetch active deliveries
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true);
        const response = await getActiveDeliveries();
        
        if (response.success) {
          const deliveriesWithRoutes = response.deliveries.map(delivery => ({
            ...delivery,
            route: generateTrackingRoute(delivery.location),
            estimatedArrival: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
          }));
          setDeliveries(deliveriesWithRoutes);
        } else {
          setDeliveries(getSampleDeliveries());
        }
      } catch (err) {
        console.error("Error fetching deliveries:", err);
        setError("Failed to load delivery data");
        setDeliveries(getSampleDeliveries());
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
    const interval = setInterval(fetchDeliveries, 30000);
    return () => clearInterval(interval);
  }, []);

  // Simulate real-time tracking
  useEffect(() => {
    if (!isTracking || !selectedDelivery) return;

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = prev + 1;
        if (nextStep >= selectedDelivery.route.length) {
          setIsTracking(false);
          return prev;
        }
        return nextStep;
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [isTracking, selectedDelivery]);

  // Handle delivery selection
  const handleDeliverySelect = (delivery) => {
    setSelectedDelivery(delivery);
    setTrackingHistory([]);
    setCurrentStep(0);
    setIsTracking(false);
  };

  // Start/stop tracking
  const toggleTracking = () => {
    setIsTracking(!isTracking);
  };

  // Reset tracking
  const resetTracking = () => {
    setCurrentStep(0);
    setTrackingHistory([]);
    setIsTracking(false);
  };

  // Sample data fallback
  const getSampleDeliveries = () => {
    const sampleDeliveries = [
      {
        id: 1,
        orderId: "DL-001",
        location: [6.5244, 3.3792],
        name: "Victoria Island Delivery",
        address: "Victoria Island, Lagos",
        status: "In Transit",
        rider: "Samuel Biyomi",
        serviceType: "Errand Service",
        lastUpdated: new Date(),
        customerPhone: "+234 801 234 5678",
        items: ["Documents", "Package"],
        specialInstructions: "Handle with care"
      },
      {
        id: 2,
        orderId: "DL-002", 
        location: [6.5355, 3.3954],
        name: "Ikoyi Package",
        address: "Ikoyi, Lagos",
        status: "Pending",
        rider: "Adeola Johnson",
        serviceType: "Delivery",
        lastUpdated: new Date(),
        customerPhone: "+234 802 345 6789",
        items: ["Electronics"],
        specialInstructions: "Require signature"
      },
      {
        id: 3,
        orderId: "DL-003",
        location: [6.528, 3.385],
        name: "UNILAG Errand",
        address: "University of Lagos",
        status: "Delivered", 
        rider: "Chinedu Okoro",
        serviceType: "Errand Service",
        lastUpdated: new Date(),
        customerPhone: "+234 803 456 7890",
        items: ["Books", "Supplies"],
        specialInstructions: "Deliver to reception"
      },
    ];

    return sampleDeliveries.map(delivery => ({
      ...delivery,
      route: generateTrackingRoute(delivery.location),
      estimatedArrival: new Date(Date.now() + 30 * 60 * 1000)
    }));
  };

  // Get appropriate icon for delivery status
  const getDeliveryIcon = (delivery) => {
    if (selectedDelivery && delivery.id === selectedDelivery.id) {
      return deliveryIcons['Selected'];
    }
    return deliveryIcons[delivery.status] || deliveryIcons['In Transit'];
  };

  // Format last updated time
  const formatLastUpdated = (date) => {
    if (!date) return 'Unknown';
    const updatedDate = new Date(date);
    const now = new Date();
    const diffMinutes = Math.floor((now - updatedDate) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return updatedDate.toLocaleDateString();
  };

  // Format ETA
  const formatETA = (date) => {
    if (!date) return 'Calculating...';
    const now = new Date();
    const diffMinutes = Math.floor((date - now) / (1000 * 60));
    
    if (diffMinutes <= 0) return 'Arrived';
    if (diffMinutes < 60) return `${diffMinutes} min`;
    return `${Math.floor(diffMinutes / 60)}h ${diffMinutes % 60}m`;
  };

  // Get current position for tracking
  const getCurrentPosition = () => {
    if (!selectedDelivery || currentStep >= selectedDelivery.route.length) {
      return selectedDelivery?.location;
    }
    return selectedDelivery.route[currentStep];
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Delivery Realtime Map
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="h-96 rounded-lg bg-gray-200 animate-pulse"></div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded mb-4"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Delivery Realtime Map
        </h1>
        <div className="text-sm text-gray-600">
          {deliveries.length} active deliveries
        </div>
      </div>

      {error && (
        <div className="bg-orange-100 border border-orange-300 rounded-lg p-4 text-orange-700">
          {error} - Showing sample data
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="h-96 rounded-lg overflow-hidden">
              <MapContainer
                center={selectedDelivery ? getCurrentPosition() : center}
                zoom={selectedDelivery ? 14 : 12}
                style={{ height: "100%", width: "100%" }}
                key={selectedDelivery?.id} // Force re-render when delivery changes
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Show route for selected delivery */}
                {selectedDelivery && selectedDelivery.route && (
                  <Polyline
                    positions={selectedDelivery.route}
                    color="blue"
                    weight={4}
                    opacity={0.7}
                  />
                )}

                {/* Current position marker for tracking */}
                {selectedDelivery && isTracking && getCurrentPosition() && (
                  <Marker
                    position={getCurrentPosition()}
                    icon={new L.Icon({
                      iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                      iconSize: [25, 25],
                      iconAnchor: [12, 25],
                      popupAnchor: [0, -25],
                      className: 'pulsing-marker'
                    })}
                  >
                    <Popup>
                      <div className="text-sm">
                        <strong>Current Location</strong>
                        <br />
                        Order: {selectedDelivery.orderId}
                        <br />
                        Progress: {Math.round((currentStep / (selectedDelivery.route.length - 1)) * 100)}%
                      </div>
                    </Popup>
                  </Marker>
                )}

                {deliveries.map((delivery) => (
                  <Marker
                    key={delivery.id}
                    position={delivery.location}
                    icon={getDeliveryIcon(delivery)}
                    eventHandlers={{
                      click: () => handleDeliverySelect(delivery),
                    }}
                  >
                    <Popup>
                      <div className="text-sm min-w-[200px]">
                        <strong className="text-lg">{delivery.orderId}</strong>
                        <br />
                        <strong>Customer:</strong> {delivery.name}
                        <br />
                        <strong>Service:</strong> {delivery.serviceType}
                        <br />
                        <strong>Status:</strong> {delivery.status}
                        <br />
                        <strong>Rider:</strong> {delivery.rider}
                        <br />
                        <strong>Address:</strong> {delivery.address}
                        <br />
                        <strong>Last Update:</strong> {formatLastUpdated(delivery.lastUpdated)}
                        <br />
                        <button
                          onClick={() => handleDeliverySelect(delivery)}
                          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                        >
                          Track Delivery
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Delivery Details & Tracking Panel */}
        <div className="space-y-6">
          {/* Selected Delivery Details */}
          {selectedDelivery ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Tracking: {selectedDelivery.orderId}
                </h3>
                <button
                  onClick={() => setSelectedDelivery(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Tracking Controls */}
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={toggleTracking}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium ${
                    isTracking 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {isTracking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isTracking ? 'Pause' : 'Start'} Tracking</span>
                </button>
                <button
                  onClick={resetTracking}
                  className="flex items-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Delivery Progress</span>
                  <span>{Math.round((currentStep / (selectedDelivery.route.length - 1)) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / (selectedDelivery.route.length - 1)) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Navigation className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Rider</p>
                    <p className="text-sm text-gray-600">{selectedDelivery.rider}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Estimated Arrival</p>
                    <p className="text-sm text-gray-600">{formatETA(selectedDelivery.estimatedArrival)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Destination</p>
                    <p className="text-sm text-gray-600">{selectedDelivery.address}</p>
                  </div>
                </div>
              </div>

              {/* Items & Instructions */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-1">Items:</p>
                <p className="text-sm text-gray-600">{selectedDelivery.items?.join(', ') || 'No items listed'}</p>
                <p className="text-sm font-medium text-gray-900 mt-2 mb-1">Instructions:</p>
                <p className="text-sm text-gray-600">{selectedDelivery.specialInstructions || 'No special instructions'}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Active Deliveries ({deliveries.length})
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {deliveries.length > 0 ? (
                  deliveries.map((delivery) => (
                    <div
                      key={delivery.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleDeliverySelect(delivery)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {delivery.orderId}
                          </h4>
                          <p className="text-sm text-gray-600">{delivery.serviceType}</p>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            delivery.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : delivery.status === "In Transit"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {delivery.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 mb-1">
                        <strong>Customer:</strong> {delivery.name}
                      </div>
                      <div className="text-sm text-gray-700 mb-1">
                        <strong>Rider:</strong> {delivery.rider}
                      </div>
                      <div className="text-xs text-gray-500">
                        Updated: {formatLastUpdated(delivery.lastUpdated)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No active deliveries found
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stats Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delivery Overview
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {deliveries.filter(d => d.status === 'In Transit').length}
                </div>
                <span className="text-sm font-medium text-gray-700">In Transit</span>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {deliveries.filter(d => d.status === 'Pending').length}
                </div>
                <span className="text-sm font-medium text-gray-700">Pending</span>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {deliveries.filter(d => d.status === 'Delivered').length}
                </div>
                <span className="text-sm font-medium text-gray-700">Delivered</span>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="text-2xl font-bold text-gray-600 mb-1">
                  {deliveries.length}
                </div>
                <span className="text-sm font-medium text-gray-700">Total Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add some custom styles for the pulsing marker */}
      <style jsx>{`
        .pulsing-marker {
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .selected-marker {
          filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5));
        }
      `}</style>
    </div>
  );
};

export default Delivery;