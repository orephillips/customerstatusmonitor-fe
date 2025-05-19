import axios from 'axios';
import authService from './auth.js';

// Base API URL
const API_URL = 'http://localhost:8001';

// Create a configured axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Initialize with token if it exists
const token = authService.getToken();
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Export methods for common API operations
export default {
  // GET request
  async get(url, params = {}) {
    try {
      const response = await api.get(url, { params });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // POST request
  async post(url, data = {}, config = {}) {
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // PUT request
  async put(url, data = {}) {
    try {
      const response = await api.put(url, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // PATCH request
  async patch(url, data = {}) {
    try {
      const response = await api.patch(url, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // DELETE request
  async delete(url) {
    try {
      const response = await api.delete(url);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // The underlying axios instance, in case it's needed directly
  axios: api
};

// Helper function to handle API errors
function handleApiError(error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('API Error Response:', error.response.status, error.response.data);
    
    // Handle authentication errors
    if (error.response.status === 401 || error.response.status === 403) {
      console.error('Authentication error - you may need to log in again');
      // Optional: Redirect to login page or show auth error
      // window.location.href = '/login';
    }
  } else if (error.request) {
    // The request was made but no response was received
    console.error('API Error Request:', error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('API Error:', error.message);
  }
}
