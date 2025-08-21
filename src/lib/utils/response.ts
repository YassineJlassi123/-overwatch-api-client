import { Context } from 'hono';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export const createResponse = <T>(c: Context, data: T, message?: string): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  };
  return c.json(response);
};

export const createErrorResponse = (c: Context, error: string, statusCode: number = 400): Response => {
  const response: ApiResponse = {
    success: false,
    error,
    timestamp: new Date().toISOString()
  };
  
  switch (statusCode) {
    case 400:
      return c.json(response, 400);
    case 401:
      return c.json(response, 401);
    case 403:
      return c.json(response, 403);
    case 404:
      return c.json(response, 404);
    case 500:
      return c.json(response, 500);
    default:
      return c.json(response, 400);
  }
};

export const createBadRequestResponse = (c: Context, error: string) => createErrorResponse(c, error, 400);
export const createNotFoundResponse = (c: Context, error: string) => createErrorResponse(c, error, 404);
export const createInternalErrorResponse = (c: Context, error: string) => createErrorResponse(c, error, 500);