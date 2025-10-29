import React, { useState, useEffect } from 'react';
import { Search, MessageSquare, Clock, Mail, Phone, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'https://runpro9ja-pxqoa.ondigitalocean.app/api/admin';

  useEffect(() => {
    fetchDashboardData();
  }, [selectedTimeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
  const token = localStorage.getItem("token");
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      console.log('Fetching dashboard data for period:', selectedTimeRange);

      const response = await fetch(
        `${API_BASE_URL}/dashboard/overview?period=${selectedTimeRange}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access forbidden. You do not have permission to view dashboard.');
        } else if (response.status === 404) {
          throw new Error('Dashboard endpoint not found. Please check the API URL.');
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }
      
      const data = await response.json();
      console.log('Dashboard API response:', data);
      
      if (data.success && data.dashboard) {
        setDashboardData(data.dashboard);
      } else {
        throw new Error(data.message || 'Invalid response format from server');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
      // Don't set fallback data automatically, let user choose
    } finally {
      setLoading(false);
    }
  };

  const fetchQuickStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/dashboard/quick-stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch quick stats');
      }
      
      const data = await response.json();
      return data.quickStats;
    } catch (err) {
      console.error('Error fetching quick stats:', err);
      return null;
    }
  };

  // Enhanced fallback data that matches your backend structure
  const getFallbackData = () => ({
    stats: {
      openCases: 67,
      priorityQueue: 45,
      pendingFollowUp: 12,
      totalUsers: 234,
      totalAgents: 45,
      totalOrders: 189,
      totalRevenue: 1250000
    },
    periodStats: {
      newUsers: 23,
      newAgents: 5,
      orders: 45,
      revenue: 250000
    },
    monthlyData: [
      { month: 'Jan', customers: 85, service: 15, total: 100 },
      { month: 'Feb', customers: 65, service: 10, total: 75 },
      { month: 'Mar', customers: 15, service: 5, total: 20 },
      { month: 'Apr', customers: 95, service: 5, total: 100 },
      { month: 'May', customers: 45, service: 10, total: 55 },
      { month: 'Jun', customers: 55, service: 8, total: 63 },
      { month: 'July', customers: 70, service: 12, total: 82 },
      { month: 'Aug', customers: 85, service: 7, total: 92 },
      { month: 'Sept', customers: 50, service: 15, total: 65 },
      { month: 'Oct', customers: 75, service: 5, total: 80 },
      { month: 'Nov', customers: 30, service: 8, total: 38 },
      { month: 'Dec', customers: 25, service: 10, total: 35 }
    ],
    responseData: [
      { label: '<1 hour', value: 35, color: 'bg-emerald-600' },
      { label: '<2 hours', value: 25, color: 'bg-emerald-500' },
      { label: '2-4 hours', value: 15, color: 'bg-emerald-400' },
      { label: '4-8 hours', value: 5, color: 'bg-emerald-300' },
      { label: '8-16 hours', value: 15, color: 'bg-emerald-200' },
      { label: '>24 hours', value: 5, color: 'bg-gray-300' }
    ],
    channels: [
      { name: 'Laundry', count: 16, icon: '👕', color: 'text-blue-500' },
      { name: 'Cleaning', count: 13, icon: '🧹', color: 'text-pink-500' },
      { name: 'Maintenance', count: 32, icon: '🔧', color: 'text-orange-500' },
      { name: 'Delivery', count: 11, icon: '🚚', color: 'text-green-500' },
      { name: 'Beauty', count: 8, icon: '💅', color: 'text-purple-500' },
      { name: 'Other', count: 20, icon: '📝', color: 'text-gray-500' }
    ],
    recentCases: [
      { 
        id: '000221', 
        name: 'Samuel Akinloye', 
        title: 'Laundry service request', 
        channel: 'Laundry', 
        status: 'Not Responded', 
        icon: '👕' 
      },
      { 
        id: '000222', 
        name: 'Bushanmi Joshua', 
        title: 'Cleaning service request', 
        channel: 'Cleaning', 
        status: 'Responded', 
        icon: '🧹' 
      },
      { 
        id: '000223', 
        name: 'Constance Moyo', 
        title: 'Maintenance service request', 
        channel: 'Maintenance', 
        status: 'Responded', 
        icon: '🔧' 
      },
      { 
        id: '000224', 
        name: 'Oladejo Nehemiah', 
        title: 'Delivery service request', 
        channel: 'Delivery', 
        status: 'Not Responded', 
        icon: '🚚' 
      },
      { 
        id: '000225', 
        name: 'Oladejo Njoku', 
        title: 'Beauty service request', 
        channel: 'Beauty', 
        status: 'Not Responded', 
        icon: '💅' 
      },
      { 
        id: '000226', 
        name: 'Samuel Olakunle', 
        title: 'General service request', 
        channel: 'Other', 
        status: 'Not Responded', 
        icon: '📝' 
      }
    ]
  });

  const useFallbackData = () => {
    setDashboardData(getFallbackData());
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mb-4" />
          <div className="text-lg text-gray-600">Loading dashboard data...</div>
          <div className="text-sm text-gray-500 mt-2">Fetching from {API_BASE_URL}</div>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center max-w-md bg-white p-8 rounded-xl shadow-lg">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <div className="text-red-600 mb-4 text-lg font-semibold">Unable to Load Dashboard</div>
          <div className="text-gray-600 mb-6 text-sm bg-red-50 p-4 rounded-lg">
            {error}
          </div>
          <div className="text-xs text-gray-500 mb-6">
            API Endpoint: {API_BASE_URL}/dashboard/overview
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={fetchDashboardData}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Connection
            </button>
            <button 
              onClick={useFallbackData}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Use Sample Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Use actual data or fallback data
  const data = dashboardData || getFallbackData();
  const { stats, periodStats, monthlyData, responseData, channels, recentCases } = data;

  // Calculate max height for chart bars
  const maxDataValue = Math.max(...monthlyData.map(d => Math.max(d.customers, d.service)));

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Responded':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Resolved':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 lg:mb-8 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {dashboardData ? `Real-time data for ${selectedTimeRange}` : 'Using sample data - Connect to API for live data'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={fetchDashboardData}
            className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm mb-2">Open Cases</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">{stats.openCases}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Active service requests</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border-l-4 border-l-orange-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm mb-2">Priority Queue</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">{stats.priorityQueue}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Requiring immediate attention</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm mb-2">Pending Follow-up</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">{stats.pendingFollowUp}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Awaiting customer response</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg p-3 sm:p-4 text-center shadow-sm">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-600">{stats.totalUsers}</div>
          <div className="text-xs sm:text-sm text-gray-600">Total Users</div>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 text-center shadow-sm">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-600">{stats.totalAgents}</div>
          <div className="text-xs sm:text-sm text-gray-600">Service Agents</div>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 text-center shadow-sm">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-600">{stats.totalOrders}</div>
          <div className="text-xs sm:text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 text-center shadow-sm">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-600">
            {formatCurrency(stats.totalRevenue)}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Total Revenue</div>
        </div>
      </div>

      {/* Period Stats */}
      {periodStats && (
        <div className="bg-white rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">This {selectedTimeRange.charAt(0).toUpperCase() + selectedTimeRange.slice(1)}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-emerald-600">{periodStats.newUsers}</div>
              <div className="text-xs sm:text-sm text-gray-600">New Users</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-emerald-600">{periodStats.newAgents}</div>
              <div className="text-xs sm:text-sm text-gray-600">New Agents</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-emerald-600">{periodStats.orders}</div>
              <div className="text-xs sm:text-sm text-gray-600">New Orders</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-emerald-600">
                {formatCurrency(periodStats.revenue)}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Revenue</div>
            </div>
          </div>
        </div>
      )}

      {/* Charts and Service Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Service Request Rate Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">Service Request Trend</h2>
            <div className="flex gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-600 rounded-full"></div>
                <span className="text-gray-600">Customer Requests</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-200 rounded-full"></div>
                <span className="text-gray-600">Service Completions</span>
              </div>
            </div>
          </div>
          
          <div className="relative h-48 sm:h-64">
            <div className="absolute inset-0 flex items-end justify-between gap-1 sm:gap-2 px-1 sm:px-2">
              {monthlyData.map((data, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-0.5 sm:gap-1 items-end justify-center" style={{ height: '140px' }}>
                    <div 
                      className="w-3/5 bg-emerald-600 rounded-t transition-all hover:bg-emerald-700 cursor-pointer"
                      style={{ height: `${(data.customers / maxDataValue) * 100}%` }}
                      title={`Requests: ${data.customers}`}
                    ></div>
                    <div 
                      className="w-3/5 bg-emerald-200 rounded-t transition-all hover:bg-emerald-300 cursor-pointer"
                      style={{ height: `${(data.service / maxDataValue) * 100}%` }}
                      title={`Completions: ${data.service}`}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 truncate w-full text-center">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Service Categories */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">Service Categories</h2>
          
          <div className="space-y-3 sm:space-y-4">
            {channels.slice(0, 6).map((channel, idx) => (
              <div key={idx} className="flex items-center justify-between hover:bg-gray-50 p-2 sm:p-3 rounded-lg transition-colors group">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl">{channel.icon}</span>
                  <div>
                    <span className="text-sm font-medium text-gray-700">{channel.name}</span>
                    <div className="text-xs text-gray-500">
                      {channel.count} requests
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-800">{channel.count}</span>
                  {stats.openCases > 0 && (
                    <div className="text-xs text-gray-500">
                      {Math.round((channel.count / stats.openCases) * 100)}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Cases */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">Recent Service Requests</h2>
          <div className="flex gap-2">
            <button 
              onClick={fetchDashboardData}
              className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-xs sm:text-sm flex items-center gap-2"
            >
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
              Refresh Data
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs sm:text-sm font-semibold text-gray-600 pb-3 px-2 sm:px-4">Case ID</th>
                <th className="text-left text-xs sm:text-sm font-semibold text-gray-600 pb-3 px-2 sm:px-4">Customer</th>
                <th className="text-left text-xs sm:text-sm font-semibold text-gray-600 pb-3 px-2 sm:px-4">Service Type</th>
                <th className="text-left text-xs sm:text-sm font-semibold text-gray-600 pb-3 px-2 sm:px-4">Category</th>
                <th className="text-left text-xs sm:text-sm font-semibold text-gray-600 pb-3 px-2 sm:px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentCases.map((case_, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 text-xs sm:text-sm text-gray-800 font-mono px-2 sm:px-4">#{case_.id}</td>
                  <td className="py-3 text-xs sm:text-sm text-gray-800 px-2 sm:px-4">{case_.name}</td>
                  <td className="py-3 text-xs sm:text-sm text-gray-500 px-2 sm:px-4 truncate max-w-[120px] sm:max-w-xs">{case_.title}</td>
                  <td className="py-3 text-xs sm:text-sm text-gray-600 px-2 sm:px-4">
                    <div className="flex items-center gap-2">
                      <span>{case_.icon}</span>
                      <span>{case_.channel}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                      {case_.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Debug Info (only show in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <details>
            <summary className="cursor-pointer text-sm font-medium text-yellow-800">
              Debug Information
            </summary>
            <pre className="text-xs mt-2 text-yellow-700 overflow-auto">
              {JSON.stringify({ selectedTimeRange, dataLoaded: !!dashboardData, error }, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default Dashboard;