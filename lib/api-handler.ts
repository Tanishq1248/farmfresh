import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * Global API Error Handler
 * Handles all API errors and returns standardized responses
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Handle API errors and return standardized response
 */
export function handleApiError(error: unknown, endpoint: string) {
  const timestamp = new Date().toISOString();
  
  if (error instanceof ApiError) {
    logger.error(`API Error in ${endpoint}`, new Error(error.message), {
      statusCode: error.statusCode,
      context: error.context,
    });

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp,
      } as ApiResponse,
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    logger.error(`Unexpected error in ${endpoint}`, error, { timestamp });

    // Don't expose internal errors in production
    const message = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'An unexpected error occurred';

    return NextResponse.json(
      {
        success: false,
        error: message,
        timestamp,
      } as ApiResponse,
      { status: 500 }
    );
  }

  logger.error(`Unknown error in ${endpoint}`, new Error('Unknown error'), { timestamp });

  return NextResponse.json(
    {
      success: false,
      error: 'An unexpected error occurred',
      timestamp,
    } as ApiResponse,
    { status: 500 }
  );
}

/**
 * Success response helper
 */
export function successResponse<T>(
  data: T,
  statusCode: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    } as ApiResponse<T>,
    { status: statusCode }
  );
}

/**
 * Error response helper
 */
export function errorResponse(
  message: string,
  statusCode: number = 400,
  context?: Record<string, any>
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    } as ApiResponse,
    { status: statusCode }
  );
}
