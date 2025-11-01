import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages deploys to https://<username>.github.io/<repo>/
  // Set base to your repository name for GitHub Pages deployment
  base: process.env.GITHUB_PAGES === 'true' ? '/learn-bite/' : '/',
})
