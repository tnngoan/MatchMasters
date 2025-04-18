import axios from 'axios';

// Configure axios with default headers
const configureAxios = () => {
  const token = localStorage.getItem('user') 
    ? JSON.parse(localStorage.getItem('user')).token 
    : null;
  
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Profiles API service
export const profileService = {
  getProfiles: async () => {
    configureAxios();
    const response = await axios.get('/api/profiles');
    return response.data;
  },
  
  getProfile: async (id) => {
    configureAxios();
    const response = await axios.get(`/api/profiles/${id}`);
    return response.data;
  },
  
  createProfile: async (profileData) => {
    configureAxios();
    const response = await axios.post('/api/profiles', profileData);
    return response.data;
  },
  
  updateProfile: async (id, profileData) => {
    configureAxios();
    const response = await axios.put(`/api/profiles/${id}`, profileData);
    return response.data;
  },
  
  deleteProfile: async (id) => {
    configureAxios();
    const response = await axios.delete(`/api/profiles/${id}`);
    return response.data;
  }
};

export default {
  profileService
};