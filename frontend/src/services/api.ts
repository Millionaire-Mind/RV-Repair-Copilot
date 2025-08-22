import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// TypeScript declarations for Vite environment variables
declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_API_URL?: string;
      readonly VITE_APP_ENV?: string;
      [key: string]: string | undefined;
    };
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Extend AxiosRequestConfig to include metadata
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  metadata?: {
    startTime: Date;
  };
}

// Extend AxiosResponse to include the extended config
interface ExtendedAxiosResponse<T = any> extends AxiosResponse<T> {
  config: ExtendedAxiosRequestConfig;
}

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: ExtendedAxiosRequestConfig) => {
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
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: ExtendedAxiosResponse) => {
    // Calculate request duration
    if (response.config.metadata?.startTime) {
      const duration = Date.now() - response.config.metadata.startTime.getTime();
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`);
    }

    return response;
  },
  (error: AxiosError) => {
    // Log error details
    if (error.response) {
      console.error(`❌ API Error: ${error.response.status} ${error.response.statusText}`, error.response.data);
    } else if (error.request) {
      console.error('❌ Network Error: No response received', error.request);
    } else {
      console.error('❌ Request Error:', error.message);
    }

    // Handle common HTTP errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login or clear auth
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Forbidden
      console.error('Access forbidden');
    } else if (error.response?.status === 404) {
      // Not found
      console.error('Resource not found');
    } else if (error.response?.status === 429) {
      // Rate limited
      console.error('Rate limit exceeded');
    } else if (error.response?.status >= 500) {
      // Server error
      console.error('Server error occurred');
    }

    return Promise.reject(error);
  }
);

// API request/response types
export interface SearchRequest {
  query: string;
  rvInfo?: {
    brand: string;
    model: string;
    year: string;
    type: string;
  };
}

export interface SearchResponse {
  answer: string;
  sources: string[];
  metadata: {
    question: string;
    searchResults: number;
    processingTime: number;
    modelUsed: string;
    confidence: number;
  };
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
  uptime: number;
}

export interface IngestResponse {
  success: boolean;
  message: string;
  filesProcessed: number;
  vectorsCreated: number;
}

// API methods
export const apiService = {
  // Health check
  health: async (): Promise<HealthResponse> => {
    const response = await api.get('/api/health');
    return response.data;
  },

  // Search RV repair
  search: async (data: SearchRequest): Promise<SearchResponse> => {
    const response = await api.post('/api/query', data);
    return response.data;
  },

  // Ingest documents
  ingest: async (formData: FormData): Promise<IngestResponse> => {
    const response = await api.post('/api/ingest/pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Utility functions
export const retry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const formatError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export default api;