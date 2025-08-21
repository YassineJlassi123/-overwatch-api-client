// src/modules/search/routes.ts
import { Hono } from 'hono';
import { createOverwatchClient, OverwatchClient } from '@/lib/overwatch/client';
import { createSearchHandlers } from './handlers';
import { config } from '@/lib/config/api';

const createSearchRoutes = () => {
  const searchRoutes = new Hono();
  
  const client: OverwatchClient = createOverwatchClient(config.overwatch);
  
  const handlers = createSearchHandlers(client);

  searchRoutes.get('/', handlers.searchUser);

  return searchRoutes;
};

export { createSearchRoutes };