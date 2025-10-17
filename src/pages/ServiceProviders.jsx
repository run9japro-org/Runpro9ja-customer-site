import React, { useState, useEffect } from "react";
import { getServiceProviders, getPotentialProviders } from "../services/adminService";

const ServiceProviders = () => {
  const [serviceProviders, setServiceProviders] = useState([]);
  const [potentialProviders, setPotentialProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [loadingPotential, setLoadingPotential] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch service providers
        const providersResponse = await getServiceProviders(50, filterStatus);
        console.log("Service providers response:", providersResponse);
        
        if (providersResponse && providersResponse.success) {
          setServiceProviders(providersResponse.serviceProviders || []);
        } else {
          setServiceProviders(getSampleServiceProviders());
        }

        // Fetch potential providers
        const potentialResponse = await getPotentialProviders(20);
        console.log("Potential providers response:", potentialResponse);
        
        if (potentialResponse && potentialResponse.success) {
          setPotentialProviders(potentialResponse.potentialProviders || []);
        } else {
          setPotentialProviders(getSamplePotentialProviders());
        }

      } catch (err) {
        console.error("Error fetching providers data:", err);
        setError("Failed to load providers data");
        setServiceProviders(getSampleServiceProviders());
        setPotentialProviders(getSamplePotentialProviders());
      } finally {
        setLoadingProviders(false);
        setLoadingPotential(false);
      }
    };

    fetchData();
  }, [filterStatus]);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
      const statusStr = String(status || '').toLowerCase();
      switch (statusStr) {
        case "active":
        case "verified":
          return "text-green-700";
        case "waitlisted":
        case "pending":
          return "text-yellow-600";
        case "reviewing":
          return "text-blue-600";
        case "cancelled":
        case "rejected":
        case "inactive":
          return "text-red-600";
        default:
          return "text-gray-600";
      }
    };

    const getStatusDotColor = (status) => {
      const statusStr = String(status || '').toLowerCase();
      switch (statusStr) {
        case "active":
        case "verified":
          return "bg-green-700";
        case "waitlisted":
        case "pending":
          return "bg-yellow-600";
        case "reviewing":
          return "bg-blue-600";
        case "cancelled":
        case "rejected":
        case "inactive":
          return "bg-red-600";
        default:
          return "bg-gray-600";
      }
    };

    const formatStatus = (status) => {
      const statusStr = String(status || '');
      const statusMap = {
        'verified': 'Active',
        'pending': 'Pending',
        'reviewing': 'Reviewing',
        'waitlisted': 'Waitlisted',
        'rejected': 'Rejected',
        'inactive': 'Inactive'
      };
      
      return statusMap[statusStr.toLowerCase()] || statusStr || 'Unknown';
    };

    return (
      <span
        className={`flex items-center font-semibold text-sm ${getStatusColor(status)}`}
      >
        <span
          className={`w-2 h-2 rounded-full mr-2 ${getStatusDotColor(status)}`}
        ></span>
        {formatStatus(status)}
      </span>
    );
  };

  // Safe data access helper functions
  const safeString = (value, fallback = 'N/A') => {
    if (value === null || value === undefined || value === '') return fallback;
    if (typeof value === 'object') return fallback;
    return String(value);
  };

  const safeNumber = (value, fallback = 0) => {
    if (value === null || value === undefined) return fallback;
    const num = Number(value);
    return isNaN(num) ? fallback : num;
  };

  // Sample data fallback
  const getSampleServiceProviders = () => {
    return [
      {
        id: "890221",
        agentId: "SP890221",
        name: "Oladejo Nehemiah",
        service: "Plumber",
        status: "Active",
        workRate: 89,
        location: "No 16, Complex 2, Tejuosho Market, Yaba, Lagos",
      },
      {
        id: "890222",
        agentId: "SP890222",
        name: "Adebola Johnson",
        service: "Electrician",
        status: "Active",
        workRate: 92,
        location: "25, Allen Avenue, Ikeja, Lagos",
      },
      {
        id: "890223",
        agentId: "SP890223",
        name: "Chinedu Okoro",
        service: "Cleaner",
        status: "Active",
        workRate: 78,
        location: "14, Awolowo Road, Ikoyi, Lagos",
      },
    ];
  };

  const getSamplePotentialProviders = () => {
    return [
      {
        name: "Ajayi Suleiman",
        appliedFor: "Mechanic",
        experience: "6 years",
        location: "Idi-araba Arepo",
        phone: "+234-569800345",
        email: "suleyi890@gmail.com",
        status: "Waitlisted",
      },
      {
        name: "Fatima Bello",
        appliedFor: "Beautician",
        experience: "4 years",
        location: "Victoria Island, Lagos",
        phone: "+234-701234567",
        email: "fatima.bello@email.com",
        status: "Reviewing",
      },
      {
        name: "Musa Abdullahi",
        appliedFor: "Driver",
        experience: "8 years",
        location: "Agege, Lagos",
        phone: "+234-812345678",
        email: "musa.abdullahi@email.com",
        status: "Pending",
      },
    ];
  };

  // Loading skeleton for table rows
  const TableRowSkeleton = ({ columns }) => {
    return (
      <tr>
        {Array.from({ length: columns }).map((_, index) => (
          <td key={index} className="py-3 px-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </td>
        ))}
      </tr>
    );
  };

  // Safe length access
  const serviceProvidersLength = Array.isArray(serviceProviders) ? serviceProviders.length : 0;
  const potentialProvidersLength = Array.isArray(potentialProviders) ? potentialProviders.length : 0;

  return (
    <div className="w-full mx-auto p-4 md:p-6 space-y-8">
      {error && (
        <div className="bg-orange-100 border border-orange-300 rounded-lg p-4 text-orange-700">
          {error} - Showing sample data
        </div>
      )}

      {/* SERVICE PROVIDERS TABLE */}
      <div className="overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800">
            Service Providers ({serviceProvidersLength})
          </h3>
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-800 whitespace-nowrap">
                  ID
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-800 whitespace-nowrap">
                  Name
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-800 whitespace-nowrap">
                  Service
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-800 whitespace-nowrap">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-800 whitespace-nowrap">
                  Work Rate
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-800 whitespace-nowrap">
                  Location
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loadingProviders ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRowSkeleton key={index} columns={6} />
                ))
              ) : serviceProvidersLength > 0 ? (
                serviceProviders.map((provider, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="py-3 px-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                      {safeString(provider.agentId || provider.id, 'N/A')}
                    </td>
                    <td className="py-3 px-4 flex items-center gap-2 whitespace-nowrap">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
                        {safeString(provider.name?.charAt(0), 'U')}
                      </div>
                      <span className="font-medium text-gray-800 text-sm">
                        {safeString(provider.name, 'Unknown Provider')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800 whitespace-nowrap">
                      {safeString(provider.service, 'General Service')}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={provider.status} />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 min-w-24">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${safeNumber(provider.workRate, 0)}%`,
                              backgroundColor: "#0D7957CC",
                            }}
                          ></div>
                        </div>
                        <span className="text-gray-700 font-semibold text-sm">
                          {safeNumber(provider.workRate, 0)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-700 max-w-xs truncate">
                      {safeString(provider.location, 'Location not specified')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    No service providers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    
    </div>
  );
};

export default ServiceProviders;