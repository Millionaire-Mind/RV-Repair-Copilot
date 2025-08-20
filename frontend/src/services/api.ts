import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response time
    if (response.config.metadata?.startTime) {
      const duration = Date.now() - response.config.metadata.startTime.getTime();
      console.debug(`API request completed in ${duration}ms:`, response.config.url);
    }
    
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden:', data);
          break;
        case 404:
          // Not found
          console.error('Resource not found:', data);
          break;
        case 429:
          // Rate limited
          console.error('Rate limited:', data);
          break;
        case 500:
          // Server error
          console.error('Server error:', data);
          break;
        default:
          console.error(`HTTP ${status} error:`, data);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error - no response received');
    } else {
      // Something else happened
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Types
export interface SearchRequest {
  question: string;
  brand?: string;
  component?: string;
  manualType?: 'service' | 'owner' | 'parts' | 'wiring';
}

export interface SearchResponse {
  success: boolean;
  data: {
    answer: string;
    sources: string[];
    metadata: {
      question: string;
      searchResults: number;
      processingTime: number;
      modelUsed: string;
    };
  };
  timestamp: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  checks: {
    database: { status: string; responseTime: number };
    openai: { status: string; responseTime: number };
    system: { status: string; memory: number; cpu: any };
  };
}

export interface IngestResponse {
  success: boolean;
  message: string;
  data: {
    filename: string;
    brand: string;
    component: string;
    manualType: string;
    chunksProcessed: number;
    fileSize: number;
  };
  timestamp: string;
}

// API methods
export const api = {
  // Health check
  health: {
    check: (): Promise<HealthResponse> =>
      apiClient.get('/health').then(res => res.data),
    
    ready: (): Promise<{ status: string }> =>
      apiClient.get('/health/ready').then(res => res.data),
    
    live: (): Promise<{ status: string }> =>
      apiClient.get('/health/live').then(res => res.data),
    
    info: (): Promise<any> =>
      apiClient.get('/health/info').then(res => res.data),
  },

  // Search/Query
  search: {
    query: (data: SearchRequest): Promise<SearchResponse> =>
      apiClient.post('/api/query', data).then(res => res.data),
    
    stats: (): Promise<any> =>
      apiClient.get('/api/query/stats').then(res => res.data),
    
    health: (): Promise<any> =>
      apiClient.get('/api/query/health').then(res => res.data),
  },

  // Content ingestion
  ingest: {
    pdf: (formData: FormData): Promise<IngestResponse> =>
      apiClient.post('/api/ingest/pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(res => res.data),
    
    status: (): Promise<any> =>
      apiClient.get('/api/ingest/status').then(res => res.data),
    
    clear: (filters: any): Promise<any> =>
      apiClient.delete('/api/ingest/clear', { data: filters }).then(res => res.data),
    
    health: (): Promise<any> =>
      apiClient.get('/api/ingest/health').then(res => res.data),
  },

  // Utility methods
  utils: {
    // Retry wrapper for failed requests
    retry: async <T>(
      fn: () => Promise<T>,
      maxRetries: number = 3,
      delay: number = 1000
    ): Promise<T> => {
      let lastError: Error;
      
      for (let i = 0; i < maxRetries; i++) {
        try {
          return await fn();
        } catch (error) {
          lastError = error as Error;
          
          if (i < maxRetries - 1) {
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
          }
        }
      }
      
      throw lastError!;
    },

    // Debounce function for search inputs
    debounce: <T extends (...args: any[]) => any>(
      func: T,
      wait: number
    ): ((...args: Parameters<T>) => void) => {
      let timeout: NodeJS.Timeout;
      return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
      };
    },

    // Format API error messages
    formatError: (error: any): string => {
      if (error.response?.data?.message) {
        return error.response.data.message;
      }
      if (error.response?.data?.error) {
        return error.response.data.error;
      }
      if (error.message) {
        return error.message;
      }
      return 'An unexpected error occurred';
    },
  },
};

// Convenience functions for common operations
export const searchRVRepair = (data: SearchRequest): Promise<SearchResponse> =>
  api.search.query(data);

export const checkHealth = (): Promise<HealthResponse> =>
  api.health.check();

export const uploadPDF = (formData: FormData): Promise<IngestResponse> =>
  api.ingest.pdf(formData);

// Export the axios instance for custom requests
export { apiClient };

export default api;