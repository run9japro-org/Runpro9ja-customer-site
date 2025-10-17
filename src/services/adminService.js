// src/services/adminService.js
import axios from "axios";

const API_URL = "https://runpro9ja-pxqoa.ondigitalocean.app/api";

// Get analytics summary
export const getCompanyAnalytics = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/admin/analytics/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Service Providers Services
export const getTopAgents = async (limit = 10) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/admin/top-agents`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { limit }
  });
  return response.data;
};

// Payment Services
// In adminService.js
export const getRecentPayments = async (limit = 10) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/admin/recent-payments`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { limit }
    });
    
    return response.data;
  } catch (error) {
    console.log('Recent payments endpoint error, returning sample data');
    return {
      success: true,
      payments: [
        {
          id: '1',
          name: 'Thompson Jacinta',
          service: 'Lawn nail technician',
          amount: 23000.00,
          status: 'success',
        },
        {
          id: '2',
          name: 'Musa Bello',
          service: 'Plumbing repair',
          amount: 15500.00,
          status: 'success',
        },
        {
          id: '3',
          name: 'Grace Okafor',
          service: 'Home cleaning',
          amount: 12000.00,
          status: 'pending',
        }
      ]
    };
  }
};

export const getServiceRequests = async (limit = 50, status = '') => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/admin/service-requests`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { limit, status }
    });
    
    // Ensure we always return a valid structure
    if (response.data && typeof response.data === 'object') {
      return response.data;
    } else {
      return {
        success: false,
        serviceRequests: []
      };
    }
  } catch (error) {
    console.error('getServiceRequests error:', error);
    return {
      success: false,
      serviceRequests: []
    };
  }
};
// Delivery Tracking Services
export const getActiveDeliveries = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/admin/active-deliveries`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('getActiveDeliveries error:', error);
    throw error;
  }
};

// Add these to your adminService.js

// Service Providers
// Update your adminService.js for better error handling
export const getServiceProviders = async (limit = 50, status = '') => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/admin/service-providers`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { limit, status }
    });
    
    // Ensure we always return a valid structure with arrays
    if (response.data && response.data.success) {
      return {
        success: true,
        serviceProviders: Array.isArray(response.data.serviceProviders) 
          ? response.data.serviceProviders 
          : []
      };
    } else {
      return {
        success: false,
        serviceProviders: []
      };
    }
  } catch (error) {
    console.error('getServiceProviders error:', error);
    return {
      success: false,
      serviceProviders: []
    };
  }
};

export const getPotentialProviders = async (limit = 20) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/admin/potential-providers`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { limit }
    });
    
    // Ensure we always return a valid structure with arrays
    if (response.data && response.data.success) {
      return {
        success: true,
        potentialProviders: Array.isArray(response.data.potentialProviders) 
          ? response.data.potentialProviders 
          : []
      };
    } else {
      return {
        success: false,
        potentialProviders: []
      };
    }
  } catch (error) {
    console.error('getPotentialProviders error:', error);
    return {
      success: false,
      potentialProviders: []
    };
  }
};

// Delivery Details
export const getDeliveryDetails = async (limit = 20) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/admin/delivery-details`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { limit }
    });
    
    // Ensure we always return a valid structure
    if (response.data && typeof response.data === 'object') {
      return response.data;
    } else {
      return {
        success: false,
        deliveryDetails: []
      };
    }
  } catch (error) {
    console.error('getDeliveryDetails error:', error);
    return {
      success: false,
      deliveryDetails: []
    };
  }
};

// Add these to your adminService.js

// Support Employees
export const getSupportEmployees = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/admin/support-employees`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('getSupportEmployees error:', error);
    throw error;
  }
};

// Pending Requests
export const getPendingRequests = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/admin/pending-requests`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('getPendingRequests error:', error);
    throw error;
  }
};

// Support Messages
export const getSupportMessages = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/admin/support-messages`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('getSupportMessages error:', error);
    throw error;
  }
};

// Add these to your adminService.js

// Payments Summary
export const getPaymentsSummary = async (period = 'daily') => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/admin/payments-summary`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { period }
    });
    return response.data;
  } catch (error) {
    console.error('getPaymentsSummary error:', error);
    throw error;
  }
};

// Payments Inflow
export const getPaymentsInflow = async (limit = 50, status = '') => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/admin/payments-inflow`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { limit, status }
    });
    return response.data;
  } catch (error) {
    console.error('getPaymentsInflow error:', error);
    throw error;
  }
};

// Payments Outflow
export const getPaymentsOutflow = async (limit = 50) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/admin/payments-outflow`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('getPaymentsOutflow error:', error);
    throw error;
  }
};

// Add these to your adminService.js

// Accounts Management
export const getAccounts = async (type = 'users', page = 1, limit = 13, search = '') => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/admin/accounts`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { type, page, limit, search }
    });
    return response.data;
  } catch (error) {
    console.error('getAccounts error:', error);
    throw error;
  }
};

// Delete Accounts
export const deleteAccounts = async (accountIds) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/admin/accounts`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { accountIds }
    });
    return response.data;
  } catch (error) {
    console.error('deleteAccounts error:', error);
    throw error;
  }
};

// Update Account
export const updateAccount = async (accountId, updateData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/admin/accounts/${accountId}`, 
      updateData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('updateAccount error:', error);
    throw error;
  }
};

// Admin Management — Create, List, Delete Admins
export const createAdmin = async (adminData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/admin`, adminData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("createAdmin error:", error.response?.data || error.message);
    throw error;
  }
};

export const listAdmins = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/admin`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("listAdmins error:", error.response?.data || error.message);
    throw error;
  }
};
