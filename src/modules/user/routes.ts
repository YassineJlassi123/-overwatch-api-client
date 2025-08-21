// src/modules/user/routes.ts
import { Hono } from 'hono';
import { getUserData, getUserSummary, getUserStats, getFullUserData } from './handlers.js';

const userRoutes = new Hono();

// Get aggregated user data (summary + stats + calculated metrics)
userRoutes.get('/:battletag', getUserData);

// Get user summary only
userRoutes.get('/:battletag/summary', getUserSummary);

// Get user statistics only
userRoutes.get('/:battletag/stats', getUserStats);

// Get full user data (raw OverFast API response)
userRoutes.get('/:battletag/full', getFullUserData);

export { userRoutes };