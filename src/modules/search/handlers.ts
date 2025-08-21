import { Context } from 'hono';
import { z } from 'zod';
import { OverwatchClient } from '@/lib/overwatch/client';
import { createResponse, createErrorResponse } from '@/lib/utils/response';
import { OverwatchApiError, ValidationError } from '@/lib/utils/errors';

const SearchQuerySchema = z.object({
  name: z.string()
    .min(3, 'Search term must be at least 3 characters long')
    .max(50, 'Search term must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\-_]+$/, 'Search term can only contain letters, numbers, hyphens, and underscores')
});

const validateSearchQuery = (queryName: string | undefined) => {
  if (!queryName) {
    throw new ValidationError('Name or BattleTag parameter is required');
  }
  return SearchQuerySchema.parse({ name: queryName });
};

const searchPlayersInApi = async (client: OverwatchClient, name: string) => {
  try {
    const endpoint = `players?name=${encodeURIComponent(name)}`;
    const results = await client.get(endpoint);
    return Array.isArray(results) ? results : [];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

export const createSearchHandlers = (client: OverwatchClient) => {
  const searchUser = async (c: Context) => {
    try {
      const queryName = c.req.query('name') || c.req.query('battletag');

      const { name } = validateSearchQuery(queryName);

      const results = await searchPlayersInApi(client, name);

      return createResponse(
        c,
        results,
        `Found ${results.length} players matching "${name}"`
      );
    } catch (error) {
      if (error instanceof ValidationError) {
        return createErrorResponse(c, `Validation error: ${error.message}`, 400);
      }
      if (error instanceof OverwatchApiError) {
        return createErrorResponse(c, error.message, error.statusCode || 500);
      }
      console.error('Search error:', error);
      return createErrorResponse(c, 'Internal server error', 500);
    }
  };

  return {
    searchUser
  };
};