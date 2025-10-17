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
    iconUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828843.png", // Clock icon
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25],
  }),
  'Delivered': new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190411.png", // Check icon
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25],
  })
};

const Delivery = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const center = [6.5244, 3.3792]; // Lagos center

  // Fetch active deliveries
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true);
        const response = await getActiveDeliveries();
        
        if (response.success) {
          setDeliveries(response.deliveries);
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

    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchDeliveries, 30000);

    return () => clearInterval(interval);
  }, []);

  // Sample data fallback
  const getSampleDeliveries = () => {
    return [
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
      },
    ];
  };

  // Get appropriate icon for delivery status
  const getDeliveryIcon = (status) => {
    return deliveryIcons[status] || deliveryIcons['In Transit'];
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
                center={center}
                zoom={12}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {deliveries.map((delivery) => (
                  <Marker
                    key={delivery.id}
                    position={delivery.location}
                    icon={getDeliveryIcon(delivery.status)}
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
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Delivery List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Active Deliveries ({deliveries.length})
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {deliveries.length > 0 ? (
              deliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
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
      </div>

      {/* Stats Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Delivery Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
  );
};

export default Delivery;