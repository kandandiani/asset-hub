import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this project site under /asset-hub/; keep in sync with the repo name
  base: '/asset-hub/',
  plugins: [react()],
})
