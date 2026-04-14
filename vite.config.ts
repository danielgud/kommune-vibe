import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'

/**
 * In dev, Vite serves api/leaderboard.js as a module and chokes on @vercel/kv.
 * This middleware intercepts /api/leaderboard requests before Vite touches them
 * and returns stub responses so the game works locally.
 * The real serverless function handles these requests on Vercel.
 */
const devApiMock: Plugin = {
  name: 'dev-api-mock',
  configureServer(server) {
    server.middlewares.use('/api/leaderboard', (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      if ((req as { method?: string }).method === 'POST') {
        res.statusCode = 200
        res.end(JSON.stringify({ success: true }))
      } else {
        res.statusCode = 200
        res.end(JSON.stringify([]))
      }
    })
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), devApiMock],
})
