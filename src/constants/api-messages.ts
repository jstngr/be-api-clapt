export const API_MESSAGES = {
  AUTH: {
    EMAIL_NOT_VERIFIED: 'Please verify your email address',
    INVALID_CREDENTIALS: 'Invalid credentials',
    ACCOUNT_LOCKED: 'Account is locked',
    PASSWORD_INCORRECT: 'Current password is incorrect',
    INVALID_RESET_TOKEN: 'Invalid or expired reset token',
    EMAIL_ALREADY_REGISTERED: 'Email already registered',
    INVALID_VERIFICATION_TOKEN: 'Invalid verification token',
    EMAIL_VERIFIED: 'Email verified successfully',
    PASSWORD_RESET: 'Password reset successfully',
    PASSWORD_CHANGED: 'Password changed successfully',
    ACCOUNT_DELETED: 'Account deleted successfully',
  },
  GENERIC: {
    SERVER_ERROR: 'An unexpected error occurred',
    CONNECTION_ERROR: 'Unable to connect to the server',
    UNAUTHORIZED: 'Unauthorized access',
    NOT_FOUND: 'Resource not found',
  },
} as const;
