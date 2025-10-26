import React, { useState, useEffect } from "react";
import { getServiceRequests, getDeliveryDetails } from "../services/adminService";
import { MoreVertical, Eye, Edit, Truck } from "lucide-react";
import { useNavigate } from 'react-router-dom';
const Services = () => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [deliveryDetails, setDeliveryDetails] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingDeliveries, setLoadingDeliveries] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();

  const handleDeliveryClick = () => {
    navigate('/delivery');
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch service requests
        const requestsResponse = await getServiceRequests(50, filterStatus);
        console.log("Service requests response:", requestsResponse); // Debug log

        if (requestsResponse && requestsResponse.success) {
          setServiceRequests(requestsResponse.serviceRequests || []);
        } else {
          setServiceRequests(getSampleServiceRequests());
        }

        // Fetch delivery details
        const deliveriesResponse = await getDeliveryDetails(20);
        console.log("Delivery details response:", deliveriesResponse); // Debug log

        if (deliveriesResponse && deliveriesResponse.success) {
          setDeliveryDetails(deliveriesResponse.deliveryDetails || []);
        } else {
          setDeliveryDetails(getSampleDeliveryDetails());
        }

      } catch (err) {
        console.error("Error fetching services data:", err);
        setError("Failed to load services data");
        setServiceRequests(getSampleServiceRequests());
        setDeliveryDetails(getSampleDeliveryDetails());
      } finally {
        setLoadingRequests(false);
        setLoadingDeliveries(false);
      }
    };

    fetchData();
  }, [filterStatus]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenu(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
      switch (status?.toLowerCase()) {
        case "completed":
        case "success":
          return "text-green-600 bg-green-50 border border-green-200";
        case "in progress":
        case "active":
        case "accepted":
          return "text-yellow-600 bg-yellow-50 border border-yellow-200";
        case "pending":
          return "text-orange-600 bg-orange-50 border border-orange-200";
        case "cancelled":
        case "failed":
        case "rejected":
          return "text-red-600 bg-red-50 border border-red-200";
        default:
          return "text-gray-600 bg-gray-50 border border-gray-200";
      }
    };

    const formatStatus = (status) => {
      switch (status?.toLowerCase()) {
        case "success":
          return "Completed";
        case "active":
        case "accepted":
          return "In Progress";
        case "pending":
          return "Pending";
        case "cancelled":
          return "Cancelled";
        case "failed":
          return "Failed";
        default:
          return status;
      }
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
          status
        )}`}
      >
        {formatStatus(status)}
      </span>
    );
  };

  // Menu component for actions
  const ActionMenu = ({ order, type, onViewDetails }) => {
    const handleMenuClick = (e) => {
      e.stopPropagation();
      setActiveMenu(activeMenu === order.orderId ? null : order.orderId);
    };

    const handleViewDetails = (e) => {
      e.stopPropagation();
      onViewDetails(order);
      setActiveMenu(null);
    };

    return (
      <div className="relative">
        <button
          onClick={handleMenuClick}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <MoreVertical className="w-4 h-4 text-gray-500" />
        </button>

        {activeMenu === order.orderId && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            <div className="py-1">
              <button
                onClick={handleViewDetails}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </button>


            </div>
          </div>
        )}
      </div>
    );
  };

  // Order Details Modal
  const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Order Details - {order.orderId}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order ID
                  </label>
                  <p className="text-sm text-gray-900 font-semibold">{order.orderId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Type
                  </label>
                  <p className="text-sm text-gray-900">{order.deliveryType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <p className="text-sm text-gray-900">{order.date}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Time
                  </label>
                  <p className="text-sm text-gray-900">{order.estimatedTime}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rider in Charge
                  </label>
                  <p className="text-sm text-gray-900">{order.riderInCharge}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ordered By
                  </label>
                  <p className="text-sm text-gray-900">{order.orderBy}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivered To
                  </label>
                  <p className="text-sm text-gray-900">{order.deliveredTo}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup & Destination
              </label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">{order.pickupDestination}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                onClick={handleDeliveryClick}
              >
                Track Delivery
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  // Sample data fallback
  const getSampleServiceRequests = () => {
    return [
      {
        requestId: "IP-001",
        customerName: "Adejabola Ayomide",
        serviceType: "Babysitting",
        status: "In progress",
        dueDate: "15/06/2025",
      },
      {
        requestId: "IP-002",
        customerName: "Chinedu Okoro",
        serviceType: "Plumbing",
        status: "Completed",
        dueDate: "10/06/2025",
      },
      {
        requestId: "IP-003",
        customerName: "Funke Adebayo",
        serviceType: "Cleaning",
        status: "Pending",
        dueDate: "20/06/2025",
      },
    ];
  };

  const getSampleDeliveryDetails = () => {
    return [
      {
        orderId: "RP-267",
        deliveryType: "Errand service",
        pickupDestination: "From: Jeobel, Atakuko To: Quanna Micaline, Lekki Teligate",
        date: "09/10/25",
        estimatedTime: "2 Hours",
        riderInCharge: "Samuel Biyomi",
        orderBy: "Mariam Hassan",
        deliveredTo: "Mariam Hassan",
      },
      {
        orderId: "RP-268",
        deliveryType: "Dispatch delivery",
        pickupDestination: "From: 23. Sukenu Qie Road Casso To: Quanna Micaline, Lekki Teligate",
        date: "09/10/25",
        estimatedTime: "2 Hours",
        riderInCharge: "Samuel Biyomi",
        orderBy: "Mariam Hassan",
        deliveredTo: "Chakouma Berry",
      },
    ];
  };

  // Loading skeleton for table rows
  const TableRowSkeleton = ({ columns }) => {
    return (
      <tr>
        {Array.from({ length: columns }).map((_, index) => (
          <td key={index} className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </td>
        ))}
      </tr>
    );
  };

  // Safe length access
  const serviceRequestsLength = Array.isArray(serviceRequests) ? serviceRequests.length : 0;
  const deliveryDetailsLength = Array.isArray(deliveryDetails) ? deliveryDetails.length : 0;

  if (loadingRequests && loadingDeliveries) {
    return (
      <div className="space-y-6 md:px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:px-4">
      {error && (
        <div className="mb-4 p-3 bg-orange-100 border border-orange-300 rounded-lg text-orange-700">
          {error} - Showing sample data
        </div>
      )}

      {/* Service Request List Section */}
      <div className="overflow-hidden bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Service Request List
          </h2>
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="active">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <span className="text-sm text-gray-500">
              {serviceRequestsLength} requests
            </span>
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-green-600 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider rounded-tl-lg">
                      Request ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Customer Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Service Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider rounded-tr-lg">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loadingRequests ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRowSkeleton key={index} columns={6} />
                    ))
                  ) : serviceRequestsLength > 0 ? (
                    serviceRequests.map((request, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {request.requestId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {request.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.serviceType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <StatusBadge status={request.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.dueDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <ActionMenu
                            order={{ ...request, orderId: request.requestId }}
                            type="service"
                            onViewDetails={handleViewOrderDetails}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        No service requests found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Details List Section */}
      <div className="overflow-hidden bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Delivery Details List
          </h2>
          <span className="text-sm text-gray-500">
            {deliveryDetailsLength} deliveries
          </span>
        </div>

        <div className="overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-600">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider rounded-tl-lg">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    Delivery Type
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    Pick up & Destination
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    Estimated Time
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    Rider in charge
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    Order by
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    Delivered to
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider rounded-tr-lg">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loadingDeliveries ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <TableRowSkeleton key={index} columns={9} />
                  ))
                ) : deliveryDetailsLength > 0 ? (
                  deliveryDetails.map((delivery, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {delivery.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {delivery.deliveryType}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="break-words">
                          {delivery.pickupDestination}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {delivery.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {delivery.estimatedTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {delivery.riderInCharge}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {delivery.orderBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {delivery.deliveredTo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <ActionMenu
                          order={delivery}
                          type="delivery"
                          onViewDetails={handleViewOrderDetails}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                      No delivery details found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setShowOrderDetails(false)}
        />
      )}
    </div>
  );
};

export default Services;