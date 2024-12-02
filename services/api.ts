import axios from 'axios';
import envConfig from '@/envConfig';

const { API_URL } = envConfig;

// Create Axios instance with default base URL
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add a request interceptor for error handling
apiClient.interceptors.request.use(
  (config) => config,
  (error) => {
    console.error('Request error:', error);
    throw error;
  },
);

// Add a response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('Response error:', error);
    // For other errors, throw new error with the specified error message from the server if it exist
    throw new Error(error.response?.data?.message || 'Something went wrong');
  },
);

export default apiClient;
