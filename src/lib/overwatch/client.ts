// src/lib/overwatch/client.ts
import got, { Got, HTTPError } from 'got';
import { Platform } from './types.js';
import { OverwatchApiError } from '../utils/errors.js';

export class OverwatchClient {
  private client: Got;
  private baseUrl: string;

  constructor(config: { baseUrl: string; timeout?: number }) {
    this.baseUrl = config.baseUrl;
    
    this.client = got.extend({
      prefixUrl: this.baseUrl,
      timeout: {
        request: config.timeout || 15000,
      },
      headers: {
        'User-Agent': 'OverwatchAPI-Client/1.0',
        'Accept': 'application/json',
      },
      retry: {
        limit: 3,
        methods: ['GET'],
        statusCodes: [408, 413, 429, 500, 502, 503, 504, 521, 522, 524],
      },
      hooks: {
        beforeError: [
          (error) => {
            if (error instanceof HTTPError) {
              const { response } = error;
              error.name = 'OverwatchApiError';
              
              try {
                const errorData = JSON.parse(response.body as string);
                error.message = errorData.message || errorData.detail || `HTTP ${response.statusCode}: ${response.statusMessage}`;
              } catch {
                error.message = `HTTP ${response.statusCode}: ${response.statusMessage}`;
              }
            }
            return error;
          }
        ]
      }
    });
  }

  private async makeRawRequest(endpoint: string): Promise<any> {
    try {
      const response = await this.client.get(endpoint).json();
      return response;
    } catch (error) {
      if (error instanceof HTTPError) {
        const statusCode = error.response.statusCode;
        if (statusCode === 404) {
          throw new OverwatchApiError('Player not found', 404);
        }
        if (statusCode === 500) {
          throw new OverwatchApiError('Internal server error from Overwatch API', 500);
        }
        if (statusCode === 504) {
          throw new OverwatchApiError('Blizzard servers are temporarily unavailable', 504);
        }
        throw new OverwatchApiError(`API Error: ${error.message}`, statusCode);
      }
      throw error;
    }
  }

  async searchPlayers(name: string): Promise<any> {
    try {
      const endpoint = `players?name=${encodeURIComponent(name)}`;
      return await this.makeRawRequest(endpoint);
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  async getPlayerData(
    battletag: string, 
    platform?: Platform,
    gamemode?: 'competitive' | 'quickplay'
  ): Promise<any> {
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

    return this.makeRawRequest(endpoint);
  }
}