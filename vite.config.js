import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// FIXED: Is proxy layer se Windows network blocking hamesha k liye bypass ho jaye gi
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
