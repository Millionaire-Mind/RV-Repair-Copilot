import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './main.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

// Root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Render the app
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--surface-color)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
            },
            success: {
              iconTheme: {
                primary: 'var(--success-color)',
                secondary: 'var(--surface-color)',
              },
            },
            error: {
              iconTheme: {
                primary: 'var(--error-color)',
                secondary: 'var(--surface-color)',
              },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);