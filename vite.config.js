import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
  },
  build: {
    // Keep fonts as files: the CSP (font-src 'self') blocks fonts inlined as data: URLs
    assetsInlineLimit: (file) => (/\.woff2?$/.test(file) ? false : undefined),
  },
})
