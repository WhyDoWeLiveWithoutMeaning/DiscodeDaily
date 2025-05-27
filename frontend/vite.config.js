import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server:{
    allowedHosts: ['mon-numerous-intended-propecia.trycloudflare.com'],
    host: 'localhost',
    port: 5173
  }
})
