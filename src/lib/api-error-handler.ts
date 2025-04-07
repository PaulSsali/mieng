import { NextRequest, NextResponse } from 'next/server';
import { logError } from './error-service';

// API error types
export enum ApiErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  CONFLICT_ERROR = 'CONFLICT_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST_ERROR = 'BAD_REQUEST_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

// Error status codes mapping
export const ErrorStatusCodes = {
  [ApiErrorType.VALIDATION_ERROR]: 400,
  [ApiErrorType.AUTHENTICATION_ERROR]: 401,
  [ApiErrorType.AUTHORIZATION_ERROR]: 403,
  [ApiErrorType.NOT_FOUND_ERROR]: 404,
  [ApiErrorType.CONFLICT_ERROR]: 409,
  [ApiErrorType.BAD_REQUEST_ERROR]: 400,
  [ApiErrorType.SERVICE_UNAVAILABLE]: 503,
  [ApiErrorType.INTERNAL_SERVER_ERROR]: 500,
};

// Custom API error class
export class ApiError extends Error {
  public readonly type: ApiErrorType;
  public readonly statusCode: number;
  public readonly details?: any;

  constructor(
    message: string,
    type: ApiErrorType = ApiErrorType.INTERNAL_SERVER_ERROR,
    details?: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.statusCode = ErrorStatusCodes[type];
    this.details = details;
  }
}

// Handle API errors and return standardized responses
export function handleApiError(
  error: unknown,
  req: NextRequest,
  {
    logErrors = true,
    publicErrorMessages = process.env.NODE_ENV !== 'production',
  } = {}
) {
  // Get request info for logging
  const requestInfo = {
    url: req.url,
    method: req.method,
    headers: Object.fromEntries(req.headers.entries()),
  };

  // Default error setup
  let statusCode = 500;
  let responseBody: any = {
    success: false,
    error: {
      type: ApiErrorType.INTERNAL_SERVER_ERROR,
      message: 'An unexpected error occurred',
    },
  };

  // Handle different error types
  if (error instanceof ApiError) {
    // Known API error
    statusCode = error.statusCode;
    responseBody.error = {
      type: error.type,
      message: error.message,
    };

    // Include error details in non-production environments or if they're safe to expose
    if (publicErrorMessages && error.details) {
      responseBody.error.details = error.details;
    }

    // Log the error if needed
    if (logErrors) {
      logError(error, 'error', {
        ...requestInfo,
        apiErrorType: error.type,
      });
    }
  } else {
    // Unknown error
    const errorObject = error instanceof Error ? error : new Error(String(error));
    
    // Always log unknown errors
    logError(errorObject, 'error', {
      ...requestInfo,
      unhandledError: true,
    });
    
    // In development, include the actual error message and stack trace
    if (publicErrorMessages) {
      responseBody.error.message = errorObject.message;
      responseBody.error.stack = errorObject.stack;
    }
  }

  // Return standardized error response
  return NextResponse.json(responseBody, { status: statusCode });
}

// Helper for validation errors
export function createValidationError(message: string, details?: any) {
  return new ApiError(message, ApiErrorType.VALIDATION_ERROR, details);
}

// Helper for authentication errors
export function createAuthenticationError(message = 'Authentication required') {
  return new ApiError(message, ApiErrorType.AUTHENTICATION_ERROR);
}

// Helper for authorization errors
export function createAuthorizationError(message = 'Access denied') {
  return new ApiError(message, ApiErrorType.AUTHORIZATION_ERROR);
}

// Helper for not found errors
export function createNotFoundError(resource = 'Resource', id?: string) {
  const message = id ? `${resource} with id ${id} not found` : `${resource} not found`;
  return new ApiError(message, ApiErrorType.NOT_FOUND_ERROR);
}

// Wrapper for API route handlers with automatic error handling
export function withErrorHandling(
  handler: (req: NextRequest, params: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, params: any) => {
    try {
      return await handler(req, params);
    } catch (error) {
      return handleApiError(error, req);
    }
  };
} 