// src/modules/docs/routes.ts
import { Hono } from 'hono';
import { openApiSpec } from '@/lib/openapi/spec.js';

const docsRoutes = new Hono();

// Serve OpenAPI JSON spec
docsRoutes.get('/openapi.json', (c) => {
  return c.json(openApiSpec);
});

// Serve Scalar documentation
docsRoutes.get('/', (c) => {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Overwatch API Documentation</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body {
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body>
  <script
    id="api-reference"
    data-url="/docs/openapi.json"
    data-configuration='{
      "theme": "purple",
      "layout": "modern",
      "defaultHttpClient": {
        "targetKey": "javascript",
        "clientKey": "fetch"
      },
      "hiddenClients": [],
      "hideModels": false,
      "hideDownloadButton": false,
      "darkMode": false,
      "customCss": "--scalar-color-1: #121212; --scalar-color-2: #2a2a2a; --scalar-color-3: #8b5cf6;",
      "searchHotKey": "k",
      "metaData": {
        "title": "Overwatch API Documentation",
        "description": "Interactive API documentation for the Overwatch Player Data API",
        "ogDescription": "Comprehensive API for retrieving Overwatch player statistics and information"
      }
    }'
  ></script>
  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body>
</html>`;

  return c.html(html);
});

export { docsRoutes };