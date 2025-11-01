import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages deploys to https://<username>.github.io/<repo>/
  base: '/learn-bite/',
})
