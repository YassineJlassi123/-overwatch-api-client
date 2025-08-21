import { serve } from '@hono/node-server';
import app from './app.js';
import { config } from './lib/config/api.js';

console.log(`🚀 Overwatch API Client starting...`);
console.log(`🎮 Using OverFast API: ${config.overwatch.baseUrl}`);

const port = config.server.port;

serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`📡 Server running on http://localhost:${info.port}`);
  console.log(`📚 API Documentation: http://localhost:${info.port}/`);
  console.log(`❤️  Health check: http://localhost:${info.port}/health`);
});

export default app;