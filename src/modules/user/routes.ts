// src/modules/user/routes.ts
import { Hono } from 'hono';
import { createOverwatchClient, OverwatchClient } from '@/lib/overwatch/client.js';
import { createUserHandlers } from '@/modules/user/handlers.js';
import { config } from '@/lib/config/api.js';

const createUserRoutes = () => {
  const userRoutes = new Hono();
  
  const client: OverwatchClient = createOverwatchClient(config.overwatch);
  
  const handlers = createUserHandlers(client);


  userRoutes.get('/:battletag', handlers.getUserData);

  // Get user summary only
  userRoutes.get('/:battletag/summary', handlers.getUserSummary);

  // Get user statistics only
  userRoutes.get('/:battletag/stats', handlers.getUserStats);

  // Get full user data (raw OverFast API response)
  userRoutes.get('/:battletag/full', handlers.getFullUserData);

  return userRoutes;
};

export { createUserRoutes };