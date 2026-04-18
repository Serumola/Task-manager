const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Generic API request function
async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Auth API
export const authAPI = {
  register: (name, email, password) => 
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  
  login: (email, password) => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  getProfile: () => apiRequest('/auth/profile'),
  
  updateProfile: (name) => 
    apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ name }),
    }),
  
  changePassword: (currentPassword, newPassword) => 
    apiRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

// Tasks API
export const tasksAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.project_id) params.append('project_id', filters.project_id);
    return apiRequest(`/tasks${params.toString() ? `?${params.toString()}` : ''}`);
  },
  
  getOne: (id) => apiRequest(`/tasks/${id}`),
  
  create: (task) => 
    apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    }),
  
  update: (id, task) => 
    apiRequest(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    }),
  
  delete: (id) => 
    apiRequest(`/tasks/${id}`, {
      method: 'DELETE',
    }),
  
  getHistory: (id) => apiRequest(`/tasks/${id}/history`),
  
  getStats: () => apiRequest('/tasks/stats/summary'),
};

// Projects API
export const projectsAPI = {
  getAll: () => apiRequest('/projects'),
  
  getOne: (id) => apiRequest(`/projects/${id}`),
  
  create: (project) => 
    apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    }),
  
  update: (id, project) => 
    apiRequest(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    }),
  
  delete: (id) => 
    apiRequest(`/projects/${id}`, {
      method: 'DELETE',
    }),
};

// Notifications API
export const notificationsAPI = {
  getAll: (unread = false) => 
    apiRequest(`/notifications${unread ? '?unread=true' : ''}`),
  
  markAsRead: (id) => 
    apiRequest(`/notifications/${id}/read`, {
      method: 'PUT',
    }),
  
  markAllAsRead: () => 
    apiRequest('/notifications/read-all', {
      method: 'PUT',
    }),
  
  delete: (id) => 
    apiRequest(`/notifications/${id}`, {
      method: 'DELETE',
    }),
  
  getUnreadCount: () => apiRequest('/notifications/unread/count'),
};

// Reports API
export const reportsAPI = {
  getDashboard: () => apiRequest('/reports/dashboard'),
  
  getActivity: (limit = 20) => apiRequest(`/reports/activity?limit=${limit}`),
  
  getCalendar: (month, year) => 
    apiRequest(`/reports/calendar?month=${month}&year=${year}`),
};

// Token management
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    // Decode JWT to check expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};
