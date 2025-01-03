import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // Use the service name from docker-compose
  headers: {
    'Content-Type': 'application/json',
  },
});

// Example API call
export const getBackendApplicationHealth = async () => {
    try {
      const response = await apiClient.get('/');
      return response.data;
    } catch (error) {
      console.error('Error fetching backend application health:', error);
      throw error;
    }
  };

  export const getWeatherForecast = async () => {
    try {
      const response = await apiClient.get('/weatherforecast');
      return response.data;
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      throw error;
    }
  };

  export const login = async (username, password) => {
    try {
      const response = await apiClient.post('/login', { username, password });
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };
  
  export const checkUsername = async (username) => {
    try {
      const response = await apiClient.get(`/check-username?username=${username}`);
      return response.data;
    } catch (error) {
      throw new Error('Username already exists');
    }
  };
  
  export const checkEmail = async (email) => {
    try {
      const response = await apiClient.get(`/check-email?email=${email}`);
      return response.data;
    } catch (error) {
      throw new Error('Email already exists');
    }
  };

export default apiClient;