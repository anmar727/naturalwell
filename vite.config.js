import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Stable file names so the server page renderer (api/render.js) can point at
// the app bundle without reading the built index.html.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
})
