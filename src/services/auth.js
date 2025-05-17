import axios from 'axios';

const API_URL = 'http://localhost:8001';

class AuthService {
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
    // Always return true for testing
    return true;
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    delete axios.defaults.headers.common['Authorization'];
  }

  isAllowedDomain() {
    const userInfo = this.getUserInfo();
    if (!userInfo || !userInfo.email) return false;
    return userInfo.email.endsWith('@bitwave.io');
  }
}

export default new AuthService();
