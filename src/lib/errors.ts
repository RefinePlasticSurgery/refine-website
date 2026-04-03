/**
 * Application Error Handling
 * Centralizes error creation and handling for type safety
 */

/**
 * Authentication-specific error
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public code:
      | 'INVALID_CREDENTIALS'
      | 'USER_NOT_FOUND'
      | 'NETWORK_ERROR'
      | 'SESSION_EXPIRED'
      | 'PERMISSION_DENIED'
      | 'ADMIN_NOT_CONFIGURED'
      | 'SIGN_IN_FAILED'
      | 'UNKNOWN'
  ) {
    super(message);
    this.name = 'AuthError';
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

/**
 * Database operation error
 */
export class DatabaseError extends Error {
  constructor(
    message: string,
    public code: 'QUERY_FAILED' | 'CONSTRAINT_VIOLATION' | 'NOT_FOUND' | 'PERMISSION_DENIED' | 'UNKNOWN'
  ) {
    super(message);
    this.name = 'DatabaseError';
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

/**
 * Validation error
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public details?: Record<string, string>
  ) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Convert unknown errors to AuthError with proper typing
 */
export const handleSupabaseAuthError = (error: unknown): AuthError => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (
      message.includes('invalid login credentials') ||
      message.includes('invalid grant') ||
      message.includes('invalid_grant') ||
      message.includes('wrong email or password') ||
      message.includes('incorrect email or password')
    ) {
      return new AuthError('Invalid email or password', 'INVALID_CREDENTIALS');
    }
    if (message.includes('user not found')) {
      return new AuthError('User not found', 'USER_NOT_FOUND');
    }
    if (
      message.includes('email not confirmed') ||
      message.includes('email not verified') ||
      message.includes('confirm your email') ||
      message.includes('unconfirmed')
    ) {
      return new AuthError(
        'Please confirm your email address before signing in.',
        'INVALID_CREDENTIALS'
      );
    }
    if (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('failed to fetch') ||
      message.includes('name not resolved') ||
      message.includes('err_name_not_resolved')
    ) {
      return new AuthError(
        'Cannot reach the authentication server. Check your internet connection and that VITE_SUPABASE_URL in your environment is correct.',
        'NETWORK_ERROR'
      );
    }
    if (message.includes('session') || message.includes('expired')) {
      return new AuthError('Your session has expired. Please sign in again.', 'SESSION_EXPIRED');
    }
    if (message.includes('permission') || message.includes('not authorized')) {
      return new AuthError('You do not have permission to perform this action', 'PERMISSION_DENIED');
    }

    return new AuthError(error.message, 'UNKNOWN');
  }

  return new AuthError('An unexpected error occurred', 'UNKNOWN');
};

/**
 * Convert unknown errors to DatabaseError with proper typing
 */
export const handleSupabaseDatabaseError = (error: unknown): DatabaseError => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('not found')) {
      return new DatabaseError('Resource not found', 'NOT_FOUND');
    }
    if (message.includes('constraint') || message.includes('duplicate')) {
      return new DatabaseError('Database constraint violation', 'CONSTRAINT_VIOLATION');
    }
    if (message.includes('permission') || message.includes('not authorized')) {
      return new DatabaseError('You do not have permission to access this resource', 'PERMISSION_DENIED');
    }

    return new DatabaseError(error.message, 'QUERY_FAILED');
  }

  return new DatabaseError('An unexpected database error occurred', 'UNKNOWN');
};

/**
 * Safe error message extraction
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};
