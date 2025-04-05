import axios from 'axios';

const API_URL = '/api/auth/';

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

// Update user profile
const updateProfile = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.put(API_URL + 'profile', userData, config);

  // Update the stored user data with new profile info
  if (response.data) {
    // Get current user data first
    const currentUser = JSON.parse(localStorage.getItem('user'));
    
    // Update only the user info but keep the token
    const updatedUser = {
      ...currentUser,
      ...response.data,
      token: currentUser.token  // Ensure token is preserved
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }

  return response.data;
};

// Update password
const updatePassword = async (passwordData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.put(API_URL + 'update-password', passwordData, config);
  return response.data;
};

// Update user settings
const updateSettings = async (settingsData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.put(API_URL + 'settings', settingsData, config);
  
  // Update settings in local storage
  if (response.data) {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const updatedUser = {
      ...currentUser,
      settings: response.data.settings
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }

  return response.data;
};

const authService = {
  register,
  login,
  logout,
  updateProfile,
  updatePassword,
  updateSettings
};

export default authService;