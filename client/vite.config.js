import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:300 https://real-estate-market-tggk.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [tailwindcss()],
})
