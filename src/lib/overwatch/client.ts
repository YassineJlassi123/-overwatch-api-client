// src/lib/overwatch/client.ts
import got, { Got, HTTPError } from 'got';
import { OverwatchApiError } from '@/lib/utils/errors.js';

export interface OverwatchClientConfig {
  baseUrl: string;
  timeout?: number;
}

export interface OverwatchClient {
  get: (endpoint: string) => Promise<any>;
}

export const createOverwatchClient = (config: OverwatchClientConfig): OverwatchClient => {
  const client: Got = got.extend({
    prefixUrl: config.baseUrl,
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

  const makeRequest = async (endpoint: string): Promise<any> => {
    try {
      const response = await client.get(endpoint).json();
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
  };

  return {
    get: makeRequest
  };
};