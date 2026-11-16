import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Variables publiques lues par le site : celles en VITE_…, et aussi celles
  // que Supabase propose de copier telles quelles (NEXT_PUBLIC_…).
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
})
