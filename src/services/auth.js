import axios from 'axios';
import { auth } from '@/firebase';

const API_URL = 'http://localhost:8001';

class AuthService {
  constructor() {
    this.initializeAxiosInterceptors();
    this.initializeFromLocalStorage();
    
    // Listen for Firebase auth state changes
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Get the Firebase ID token
          const idToken = await user.getIdToken();
          this.setToken(idToken);
        } catch (error) {
          console.error('Error getting Firebase ID token:', error);
        }
      }
    });
  }

  initializeFromLocalStorage() {
    // Initialize axios with the token from localStorage if it exists
    const token = this.getToken();
    if (token) {
      this.setTokenInAxios(token);
    }
  }

  initializeAxiosInterceptors() {
    // Request interceptor - add auth token to all requests
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle auth errors
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response) {
          // Handle authentication errors
          if (error.response.status === 401 || error.response.status === 403) {
            console.error('Authentication error:', error.response.data);
            // Optionally redirect to login or show an auth error message
            // this.logout();
            // window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async login() {
    window.location.href = `${API_URL}/auth/login`;
  }

  async handleCallback(code) {
    try {
      const response = await axios.get(`${API_URL}/auth/callback?code=${code}`);
      if (response.data && response.data.access_token) {
        this.setToken(response.data.access_token);
        this.setUserInfo(response.data.user_info);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  setToken(token) {
    localStorage.setItem('auth_token', token);
    this.setTokenInAxios(token);
  }

  setTokenInAxios(token) {
    // Set the default Authorization header for all axios requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  setUserInfo(userInfo) {
    localStorage.setItem('user_info', JSON.stringify(userInfo));
  }

  getToken() {
    return localStorage.getItem('auth_token');
  }

  getUserInfo() {
    const userInfo = localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  isAuthenticated() {
    // Check if we have a token
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    delete axios.defaults.headers.common['Authorization'];
    
    // Sign out from Firebase if needed
    auth.signOut().catch(error => {
      console.error('Firebase sign out error:', error);
    });
  }

  isAllowedDomain() {
    const userInfo = this.getUserInfo();
    if (!userInfo || !userInfo.email) return false;
    return userInfo.email.endsWith('@bitwave.io');
  }
}

export default new AuthService();
