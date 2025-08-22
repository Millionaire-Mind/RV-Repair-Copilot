import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3000,
        host: true,
        open: true,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                secure: false,
            },
        },
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                    ui: ['framer-motion', 'lucide-react'],
                    utils: ['axios', 'clsx', 'tailwind-merge'],
                },
            },
        },
        target: 'esnext',
        minify: 'terser',
    },
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'react-router-dom',
            'axios',
            'framer-motion',
            'lucide-react',
        ],
    },
    define: {
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
        __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
});
