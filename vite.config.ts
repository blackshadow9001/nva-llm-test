import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Locally, the companion chat goes to the Worker (cd worker && npm run dev).
  server: {
    proxy: {
      '/api': { target: 'http://localhost:8787', rewrite: (p) => p.replace(/^\/api/, '') },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
