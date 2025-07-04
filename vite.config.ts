import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const base = isProduction ? '/' : '/brewcoffee/'; // Default to / for production (Capacitor), /brewcoffee/ for dev (GitHub Pages)

  return {
    base,
    plugins: [
        react(),
        tailwindcss(),
    ],
  };
});
