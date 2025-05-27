import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server:{
    allowedHosts: ['discode.ca', 'localhost', '127.0.0.1'],
    host: '0.0.0.0',
    port: 5173
  },
  build: {
    target: 'esnext',  // This enables support for top-level await
    // You can add additional build options here
    sourcemap: process.env.NODE_ENV !== 'production'
  }
})
