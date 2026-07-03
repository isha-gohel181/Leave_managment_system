// API Client for the Leave Management System

const API_BASE = '/api';

// Helper to get request headers
const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Generic request wrapper
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error.message);
    throw error;
  }
};

// Helper to choose profile picture based on name & role
const getUserAvatar = (name, role) => {
  const isHR = role === 'Admin' || role === 'admin';
  if (name && name.toLowerCase().includes('yash')) {
    return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200";
  }
  if (name && name.toLowerCase().includes('isha')) {
    return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200";
  }
  return isHR
    ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
    : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200";
};

// Helper to get initials or placeholder details for user UI
const formatUser = (userData) => {
  if (!userData) return null;
  const isHR = userData.role === 'Admin';
  return {
    id: userData._id,
    name: userData.name,
    email: userData.email,
    role: userData.role ? userData.role.toLowerCase() : 'employee',
    avatar: getUserAvatar(userData.name, userData.role),
    department: isHR ? "Engineering Management" : "Engineering (Product)",
    manager: isHR ? "Board of Directors" : "Sarah Jenkins (Engineering Director)",
    joinDate: "Jan 12, 2024",
    office: "San Francisco, CA",
    rawBalances: userData.leaveBalances || { Annual: 15, Sick: 10, Casual: 10 }
  };
};

// Helper to format backend request list to frontend mock format
export const formatLeaveRequest = (req) => {
  if (!req) return null;
  const typeMap = {
    'Annual': 'Annual Leave',
    'Sick': 'Sick Leave',
    'Casual': 'Casual Leave'
  };

  // Extract dates
  const start = req.startDate ? req.startDate.split('T')[0] : '';
  const end = req.endDate ? req.endDate.split('T')[0] : '';
  const applied = req.createdAt ? req.createdAt.split('T')[0] : '';

  // Get employee info
  const empName = req.employee && typeof req.employee === 'object' 
    ? req.employee.name 
    : 'Employee';
  const empEmail = req.employee && typeof req.employee === 'object'
    ? req.employee.email
    : '';

  return {
    id: req._id,
    employeeId: req.employee && typeof req.employee === 'object' ? req.employee._id : req.employee,
    employeeName: empName,
    employeeEmail: empEmail,
    avatar: getUserAvatar(empName, req.employee && typeof req.employee === 'object' ? req.employee.role : 'Employee'),
    type: typeMap[req.leaveType] || req.leaveType,
    startDate: start,
    endDate: end,
    days: req.daysRequested,
    reason: req.reason,
    status: req.status ? req.status.toLowerCase() : 'pending',
    appliedDate: applied,
    reviewedBy: req.status !== 'PENDING' ? 'Sarah Jenkins' : undefined,
    reviewedDate: req.updatedAt ? req.updatedAt.split('T')[0] : undefined,
    rejectionReason: req.adminComments || ''
  };
};

// Helper to calculate leave balances dynamically based on real requests list
export const calculateLeaveBalances = (rawBalances, requests) => {
  const typeMapping = {
    'Annual Leave': { backendKey: 'Annual', color: '#ea2804', total: 15 },
    'Sick Leave': { backendKey: 'Sick', color: '#2b9a66', total: 10 },
    'Casual Leave': { backendKey: 'Casual', color: '#f59e0b', total: 10 }
  };

  return Object.keys(typeMapping).map(uiType => {
    const config = typeMapping[uiType];
    const available = rawBalances[config.backendKey] || 0;
    
    // Filter requests for this specific type
    const typeRequests = requests.filter(r => r.type === uiType);
    
    // Count pending days
    const pending = typeRequests
      .filter(r => r.status === 'pending')
      .reduce((sum, r) => sum + r.days, 0);

    // Count used days
    const used = typeRequests
      .filter(r => r.status === 'approved')
      .reduce((sum, r) => sum + r.days, 0);

    return {
      type: uiType,
      total: config.total,
      used,
      pending,
      available,
      color: config.color
    };
  });
};

export const api = {
  // Auth API
  auth: {
    login: async (email, password) => {
      const response = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (response.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return {
        ...response,
        data: {
          ...response.data,
          user: formatUser(response.data)
        }
      };
    },

    register: async (name, email, password, role) => {
      const response = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
      });
      if (response.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return {
        ...response,
        data: {
          ...response.data,
          user: formatUser(response.data)
        }
      };
    },

    getMe: async () => {
      const response = await request('/auth/me', {
        method: 'GET',
      });
      return {
        ...response,
        data: formatUser(response.data)
      };
    },

    logout: () => {
      localStorage.removeItem('token');
    }
  },

  // Leaves API
  leaves: {
    apply: async (leaveRequest) => {
      const uiToBackendType = {
        'Annual Leave': 'Annual',
        'Sick Leave': 'Sick',
        'Casual Leave': 'Casual'
      };

      const payload = {
        leaveType: uiToBackendType[leaveRequest.type] || leaveRequest.type,
        startDate: leaveRequest.startDate,
        endDate: leaveRequest.endDate,
        reason: leaveRequest.reason
      };

      const response = await request('/leaves/apply', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      return {
        ...response,
        data: formatLeaveRequest(response.data)
      };
    },

    getMyRequests: async () => {
      const response = await request('/leaves/my-requests', {
        method: 'GET',
      });
      return {
        ...response,
        data: (response.data || []).map(formatLeaveRequest)
      };
    },

    getAllRequests: async () => {
      const response = await request('/leaves/all', {
        method: 'GET',
      });
      return {
        ...response,
        data: (response.data || []).map(formatLeaveRequest)
      };
    },

    updateStatus: async (id, status, comments = '') => {
      const response = await request(`/leaves/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: status.toUpperCase(),
          adminComments: comments
        }),
      });
      return {
        ...response,
        data: formatLeaveRequest(response.data)
      };
    }
  },

  // Dashboard API
  dashboard: {
    getSummary: async () => {
      const response = await request('/dashboard/summary', {
        method: 'GET',
      });
      return response;
    }
  }
};
