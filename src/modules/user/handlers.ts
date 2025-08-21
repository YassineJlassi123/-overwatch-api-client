// src/modules/user/handlers.ts
import { Context } from 'hono';
import { OverwatchClient } from '../../lib/overwatch/client.js';
import { BattleTagSchema, PlatformSchema } from '../../lib/overwatch/validators.js';
import { createResponse, createErrorResponse } from '../../lib/utils/response.js';
import { OverwatchApiError, ValidationError } from '../../lib/utils/errors.js';
import { config } from '../../lib/config/api.js';

const overwatchClient = new OverwatchClient(config.overwatch);

export const getUserData = async (c: Context) => {
  try {
    const battletag = c.req.param('battletag');
    const platform = c.req.query('platform') || 'pc';
    const gamemode = c.req.query('gamemode') || null;

    if (!battletag) {
      return createErrorResponse(c, 'BattleTag parameter is required', 400);
    }

    // Validate inputs
    const validatedBattletag = BattleTagSchema.parse(battletag);
    const validatedPlatform = PlatformSchema.parse(platform);

    let validatedGamemode: 'competitive' | 'quickplay' | undefined = undefined;
    if (gamemode && ['competitive', 'quickplay'].includes(gamemode)) {
      validatedGamemode = gamemode as 'competitive' | 'quickplay';
    }

    // Use the single getPlayerData method
    const userData = await overwatchClient.getPlayerData(
      validatedBattletag,
      validatedPlatform,
      validatedGamemode
    );

    return createResponse(c, userData, 'User data retrieved successfully');
  } catch (error) {
    if (error instanceof ValidationError) {
      return createErrorResponse(c, `Validation error: ${error.message}`, 400);
    }
    if (error instanceof OverwatchApiError) {
      return createErrorResponse(c, error.message, error.statusCode || 500);
    }
    console.error('Get user data error:', error);
    return createErrorResponse(c, 'Internal server error', 500);
  }
};

export const getUserSummary = async (c: Context) => {
  try {
    const battletag = c.req.param('battletag');
    const platform = c.req.query('platform') || 'pc';

    if (!battletag) {
      return createErrorResponse(c, 'BattleTag parameter is required', 400);
    }

    // Validate inputs
    const validatedBattletag = BattleTagSchema.parse(battletag);
    const validatedPlatform = PlatformSchema.parse(platform);

    // Get full data and extract summary
    const fullData = await overwatchClient.getPlayerData(
      validatedBattletag,
      validatedPlatform
    );

    return createResponse(c, fullData.summary, 'User summary retrieved successfully');
  } catch (error) {
    if (error instanceof ValidationError) {
      return createErrorResponse(c, `Validation error: ${error.message}`, 400);
    }
    if (error instanceof OverwatchApiError) {
      return createErrorResponse(c, error.message, error.statusCode || 500);
    }
    console.error('Get user summary error:', error);
    return createErrorResponse(c, 'Internal server error', 500);
  }
};

export const getUserStats = async (c: Context) => {
  try {
    const battletag = c.req.param('battletag');
    const platform = c.req.query('platform') || 'pc';
    const gamemode = c.req.query('gamemode');

    if (!battletag) {
      return createErrorResponse(c, 'BattleTag parameter is required', 400);
    }

    let validatedGamemode: 'competitive' | 'quickplay' | undefined = undefined;
    if (gamemode) {
      if (!['competitive', 'quickplay'].includes(gamemode)) {
        return createErrorResponse(c, 'Gamemode must be either "competitive" or "quickplay"', 400);
      }
      validatedGamemode = gamemode as 'competitive' | 'quickplay';
    }

    // Validate inputs
    const validatedBattletag = BattleTagSchema.parse(battletag);
    const validatedPlatform = PlatformSchema.parse(platform);

    // Get full data and extract stats
    const fullData = await overwatchClient.getPlayerData(
      validatedBattletag,
      validatedPlatform,
      validatedGamemode
    );

    const modeText = validatedGamemode ? `${validatedGamemode} ` : '';
    return createResponse(c, fullData.stats, `User ${modeText}stats retrieved successfully`);
  } catch (error) {
    if (error instanceof ValidationError) {
      return createErrorResponse(c, `Validation error: ${error.message}`, 400);
    }
    if (error instanceof OverwatchApiError) {
      return createErrorResponse(c, error.message, error.statusCode || 500);
    }
    console.error('Get user stats error:', error);
    return createErrorResponse(c, 'Internal server error', 500);
  }
};

export const getFullUserData = async (c: Context) => {
  try {
    const battletag = c.req.param('battletag');
    const platform = c.req.query('platform') || 'pc';
    const gamemode = c.req.query('gamemode');

    if (!battletag) {
      return createErrorResponse(c, 'BattleTag parameter is required', 400);
    }

    let validatedGamemode: 'competitive' | 'quickplay' | undefined = undefined;
    if (gamemode) {
      if (!['competitive', 'quickplay'].includes(gamemode)) {
        return createErrorResponse(c, 'Gamemode must be either "competitive" or "quickplay"', 400);
      }
      validatedGamemode = gamemode as 'competitive' | 'quickplay';
    }

    // Validate inputs
    const validatedBattletag = BattleTagSchema.parse(battletag);
    const validatedPlatform = PlatformSchema.parse(platform);

    // Use the single getPlayerData method - this IS the full data
    const fullData = await overwatchClient.getPlayerData(
      validatedBattletag,
      validatedPlatform,
      validatedGamemode
    );

    return createResponse(c, fullData, 'Full user data retrieved successfully');
  } catch (error) {
    if (error instanceof ValidationError) {
      return createErrorResponse(c, `Validation error: ${error.message}`, 400);
    }
    if (error instanceof OverwatchApiError) {
      return createErrorResponse(c, error.message, error.statusCode || 500);
    }
    console.error('Get full user data error:', error);
    return createErrorResponse(c, 'Internal server error', 500);
  }
};