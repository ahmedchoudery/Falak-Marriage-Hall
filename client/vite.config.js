import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Build into the server-served root `/dist` directory.
    // Current file is `client/vite.config.js`, so we need `../dist`.
    outDir: '../dist',
    emptyOutDir: true, // clean root public/ before build
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          three: ['three'],
          swiper: ['swiper'],
          anime: ['animejs'],
        },
      },
    },
  },
})
