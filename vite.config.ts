import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('@supabase/supabase-js')) return 'supabase';
          if (id.includes('@tanstack/react-query')) return 'query';
          if (id.includes('react-router') || id.includes('react-dom') || id.includes('/react/')) {
            return 'vendor';
          }
          if (id.includes('lucide-react')) return 'icons';
        },
      },
    },
  },
})
