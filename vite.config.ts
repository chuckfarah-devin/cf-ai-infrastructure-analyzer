import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages deployment:
  // https://chuckfarah-devin.github.io/cf-ai-infrastructure-analyzer/
  base: '/cf-ai-infrastructure-analyzer/',
})
