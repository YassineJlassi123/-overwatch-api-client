import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { readFileSync } from 'fs';
import { join } from 'path';
import { createSearchRoutes } from '@/modules/search/routes';
import { createUserRoutes } from '@/modules/user/routes';
import { healthRoutes } from '@/modules/health/routes';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));
app.use('*', logger());

// Global error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({
    success: false,
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  }, 500);
});

app.get('/', (c) => {
  try {
    const htmlPath = join(process.cwd(), 'public', 'index.html');
    const html = readFileSync(htmlPath, 'utf8');
    return c.html(html);
  } catch (error) {
    console.error('Error serving index.html:', error);
    return c.json({
      success: false,
      error: 'Could not load homepage',
      timestamp: new Date().toISOString()
    }, 500);
  }
});

app.route('/api/search', createSearchRoutes());
app.route('/api/user', createUserRoutes());
app.route('/health', healthRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
    timestamp: new Date().toISOString()
  }, 404);
});

export default app;