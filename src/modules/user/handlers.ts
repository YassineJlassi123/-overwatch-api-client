import { Context } from 'hono';
import { z } from 'zod';
import { OverwatchClient } from '@/lib/overwatch/client';
import { createResponse, createErrorResponse } from '@/lib/utils/response';
import { OverwatchApiError, ValidationError } from '@/lib/utils/errors';
import { Platform, FullPlayerData } from '@/lib/overwatch/types';

const BattleTagSchema = z.string()
  .regex(/^[a-zA-Z0-9]{3,12}-[0-9]{4,5}$/, 'Invalid BattleTag format (should be: Name-1234)')
  .min(1, 'BattleTag is required');

const PlatformSchema = z.enum(['pc', 'console']).default('pc');

const GameModeSchema = z.enum(['competitive', 'quickplay']).optional();

const validateUserInput = (battletag: string, platform?: string, gamemode?: string) => {
  const validatedBattletag = BattleTagSchema.parse(battletag);
  const validatedPlatform = PlatformSchema.parse(platform || 'pc');
  const validatedGamemode = gamemode ? GameModeSchema.parse(gamemode) : undefined;

  return {
    battletag: validatedBattletag,
    platform: validatedPlatform,
    gamemode: validatedGamemode
  };
};

const fetchPlayerData = async (
  client: OverwatchClient,
  battletag: string,
  platform: Platform,
  gamemode?: 'competitive' | 'quickplay'
): Promise<FullPlayerData> => {
  let endpoint = `players/${encodeURIComponent(battletag)}`;
  const params = new URLSearchParams();

  if (platform) {
    params.append('platform', platform);
  }
  if (gamemode) {
    params.append('gamemode', gamemode);
  }
  if (params.toString()) {
    endpoint += `?${params.toString()}`;
  }

  return await client.get(endpoint);
};


export const createUserHandlers = (client: OverwatchClient) => {
  const getUserData = async (c: Context) => {
    try {
      const battletag = c.req.param('battletag');
      const platform = c.req.query('platform');
      const gamemode = c.req.query('gamemode');

      if (!battletag) {
        return createErrorResponse(c, 'BattleTag parameter is required', 400);
      }

      const validated = validateUserInput(battletag, platform, gamemode);

      const playerData = await fetchPlayerData(
        client,
        validated.battletag,
        validated.platform,
        validated.gamemode
      );

      const responseData = {
        summary: playerData.summary,
        stats: playerData.stats,
      };

      return createResponse(c, responseData, 'User data retrieved successfully');
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

  const getUserSummary = async (c: Context) => {
    try {
      const battletag = c.req.param('battletag');
      const platform = c.req.query('platform');

      if (!battletag) {
        return createErrorResponse(c, 'BattleTag parameter is required', 400);
      }

      // Validate inputs
      const validated = validateUserInput(battletag, platform);

      // Fetch player data
      const playerData = await fetchPlayerData(
        client,
        validated.battletag,
        validated.platform
      );

      return createResponse(c, playerData.summary, 'User summary retrieved successfully');
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

  const getUserStats = async (c: Context) => {
    try {
      const battletag = c.req.param('battletag');
      const platform = c.req.query('platform');
      const gamemode = c.req.query('gamemode');

      if (!battletag) {
        return createErrorResponse(c, 'BattleTag parameter is required', 400);
      }

      // Validate inputs
      const validated = validateUserInput(battletag, platform, gamemode);

      // Fetch player data
      const playerData = await fetchPlayerData(
        client,
        validated.battletag,
        validated.platform,
        validated.gamemode
      );

      const modeText = validated.gamemode ? `${validated.gamemode} ` : '';
      return createResponse(c, playerData.stats, `User ${modeText}stats retrieved successfully`);
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

  const getFullUserData = async (c: Context) => {
    try {
      const battletag = c.req.param('battletag');
      const platform = c.req.query('platform');
      const gamemode = c.req.query('gamemode');

      if (!battletag) {
        return createErrorResponse(c, 'BattleTag parameter is required', 400);
      }

      // Validate inputs
      const validated = validateUserInput(battletag, platform, gamemode);

      // Fetch player data
      const playerData = await fetchPlayerData(
        client,
        validated.battletag,
        validated.platform,
        validated.gamemode
      );

      return createResponse(c, playerData, 'Full user data retrieved successfully');
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

  return {
    getUserData,
    getUserSummary,
    getUserStats,
    getFullUserData
  };
};