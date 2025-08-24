import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
  ],
  server: {
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'https://test.klossergroup.es',
        changeOrigin: true,
        secure: false, // ponlo en true si tu SSL es válido
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
})