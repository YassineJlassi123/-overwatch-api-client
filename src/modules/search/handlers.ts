// src/modules/search/handlers.ts
import { Context } from 'hono';
import { OverwatchClient } from '../../lib/overwatch/client.js';
import { createResponse, createErrorResponse } from '../../lib/utils/response.js';
import { OverwatchApiError, ValidationError } from '../../lib/utils/errors.js';
import { config } from '../../lib/config/api.js';

const overwatchClient = new OverwatchClient(config.overwatch);

export const searchUser = async (c: Context) => {
  try {
    const queryName = c.req.query('name') || c.req.query('battletag');

    if (!queryName) {
      return createErrorResponse(c, 'Name or BattleTag parameter is required', 400);
    }
    if (queryName.length < 3) {
      return createErrorResponse(c, 'Search term must be at least 3 characters long', 400);
    }

    const results = await overwatchClient.searchPlayers(queryName);

    return createResponse(
      c, 
      results, 
      `Found ${results.length} players matching "${queryName}"`
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