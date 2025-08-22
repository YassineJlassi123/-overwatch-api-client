import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { readFileSync } from 'fs';
import { join } from 'path';
import { createUserRoutes } from '@/modules/user/routes.js';
import { healthRoutes } from '@/modules/health/routes.js';
import { docsRoutes } from '@/modules/docs/routes.js';

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

// Root route with navigation
app.get('/', (c) => {
  try {
    const htmlPath = join(process.cwd(), 'public', 'index.html');
    let html: string;
    
    try {
      html = readFileSync(htmlPath, 'utf8');
    } catch {
      html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Overwatch API Client</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px; 
            margin: 2rem auto; 
            padding: 0 1rem;
            line-height: 1.6;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 3rem;
            padding: 2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 12px;
        }
        .nav-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }
        .nav-card {
            padding: 1.5rem;
            border: 1px solid #e1e5e9;
            border-radius: 8px;
            text-decoration: none;
            color: inherit;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .nav-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .nav-card h3 {
            margin: 0 0 0.5rem 0;
            color: #764ba2;
        }
        .nav-card p {
            margin: 0;
            color: #666;
            font-size: 0.9rem;
        }
        .example {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 6px;
            border-left: 4px solid #764ba2;
            margin: 1rem 0;
        }
        .example code {
            background: #e9ecef;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-family: 'Monaco', 'Consolas', monospace;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎮 Overwatch API Client</h1>
        <p>TypeScript API client for Overwatch player data</p>
    </div>

    <div class="nav-grid">
        <a href="/docs" class="nav-card">
            <h3>📚 API Documentation</h3>
            <p>Interactive documentation powered by Scalar with live examples and testing capabilities</p>
        </a>
        
        <a href="/docs/openapi.json" class="nav-card">
            <h3>📄 OpenAPI Spec</h3>
            <p>Raw OpenAPI 3.0 specification in JSON format for API integration</p>
        </a>
        
        <a href="/health" class="nav-card">
            <h3>❤️ Health Check</h3>
            <p>Service health status and uptime information</p>
        </a>
    </div>

    <div class="example">
        <h3>Quick Examples</h3>
        <p><strong>Search for players:</strong></p>
        <code>GET /api/search?name=Player-1234</code>
        
        <p style="margin-top: 1rem;"><strong>Get player data:</strong></p>
        <code>GET /api/user/Player-1234?platform=pc</code>
        
        <p style="margin-top: 1rem;"><strong>Get player summary:</strong></p>
        <code>GET /api/user/Player-1234/summary</code>
    </div>

    <footer style="text-align: center; margin-top: 3rem; padding: 2rem; color: #666; border-top: 1px solid #eee;">
        <p>Powered by <strong>OverFast API</strong> • Built with <strong>Hono</strong> and <strong>TypeScript</strong></p>
    </footer>
</body>
</html>`;
    }
    
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

// API routes
app.route('/api/user', createUserRoutes());
app.route('/health', healthRoutes);

// Documentation routes
app.route('/docs', docsRoutes);

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