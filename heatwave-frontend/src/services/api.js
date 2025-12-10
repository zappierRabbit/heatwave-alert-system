import axios from 'axios';

// Create an Axios instance with default configuration
const api = axios.create({
    baseURL: 'http://localhost:4000/api', // Replace with your actual API base URL
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // You can add auth tokens here if needed
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle global errors here (e.g., 401 Unauthorized)
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access (e.g., redirect to login)
            console.error('Unauthorized access');
        }
        return Promise.reject(error);
    }
);

// API methods
export const getRecentEvents = async () => {
    try {
        const response = await api.get('/events/recent?limit=500');

        // Ensure we have an array
        if (!response.data || !Array.isArray(response.data)) {
            console.warn('API returned non-array data for recent events');
            return [];
        }

        // Filter out null/undefined items and items missing critical data (lat/lng or lat/lon)
        const validData = response.data.filter(
            (item) => item && typeof item === 'object' && item.lat != null && (item.lng != null || item.lon != null)
        );

        return validData;
    } catch (error) {
        console.error('Error fetching recent events:', error);
        // Return empty array instead of throwing to avoid crashing the UI
        return [];
    }
};

export default api;
