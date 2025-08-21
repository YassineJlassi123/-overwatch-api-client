import { Hono } from 'hono';

const healthRoutes = new Hono();

healthRoutes.get('/', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'Overwatch API Client',
    version: '1.0.0'
  });
});

export { healthRoutes };