import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Request interceptor
api.interceptors.request.use((config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    // Add request start time for performance monitoring
    config.metadata = { startTime: new Date() };
    // Log request
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
}, (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
});
// Response interceptor
api.interceptors.response.use((response) => {
    // Calculate request duration
    const extendedConfig = response.config;
    if (extendedConfig.metadata?.startTime) {
        const duration = Date.now() - extendedConfig.metadata.startTime.getTime();
        console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`);
    }
    return response;
}, (error) => {
    // Log error details
    if (error.response) {
        console.error(`❌ API Error: ${error.response.status} ${error.response.statusText}`, error.response.data);
    }
    else if (error.request) {
        console.error('❌ Network Error: No response received', error.request);
    }
    else {
        console.error('❌ Request Error:', error.message);
    }
    // Handle common HTTP errors
    if (error.response?.status === 401) {
        // Unauthorized - redirect to login or clear auth
        localStorage.removeItem('authToken');
        window.location.href = '/login';
    }
    else if (error.response?.status === 403) {
        // Forbidden
        console.error('Access forbidden');
    }
    else if (error.response?.status === 404) {
        // Not found
        console.error('Resource not found');
    }
    else if (error.response?.status === 429) {
        // Rate limited
        console.error('Rate limit exceeded');
    }
    else if (error.response?.status && error.response.status >= 500) {
        // Server error
        console.error('Server error occurred');
    }
    return Promise.reject(error);
});
// API methods
export const apiService = {
    // Health check
    health: async () => {
        const response = await api.get('/api/health');
        return response.data;
    },
    // Search RV repair
    search: async (data) => {
        const response = await api.post('/api/query', data);
        return response.data;
    },
    // Ingest documents
    ingest: async (formData) => {
        const response = await api.post('/api/ingest/pdf', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
// Legacy export for backward compatibility
export const searchRVRepair = apiService.search;
// Utility functions
export const retry = async (fn, retries = 3, delay = 1000) => {
    try {
        return await fn();
    }
    catch (error) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
            return retry(fn, retries - 1, delay * 2);
        }
        throw error;
    }
};
export const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};
export const formatError = (error) => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.message) {
        return error.message;
    }
    return 'An unexpected error occurred';
};
export default api;
