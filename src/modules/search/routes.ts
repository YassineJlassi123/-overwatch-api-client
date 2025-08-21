import { Hono } from 'hono';
import { searchUser } from './handlers.js';

const searchRoutes = new Hono();

searchRoutes.get('/', searchUser);

export { searchRoutes };