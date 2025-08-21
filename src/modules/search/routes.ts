// src/modules/search/routes.ts
import { Hono } from 'hono';
import { createOverwatchClient, OverwatchClient } from '@/lib/overwatch/client.js';

import { createSearchHandlers } from './handlers.js';
import { config } from '@/lib/config/api.js';

const createSearchRoutes = () => {
  const searchRoutes = new Hono();
  
  const client: OverwatchClient = createOverwatchClient(config.overwatch);
  
  const handlers = createSearchHandlers(client);

  searchRoutes.get('/', handlers.searchUser);

  return searchRoutes;
};

export { createSearchRoutes };