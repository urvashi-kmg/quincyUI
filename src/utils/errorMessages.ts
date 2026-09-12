export interface FriendlyError {
  message: string;
}

interface NormalizedApiError extends Error {
  status?: number;
  errors?: Record<string, string[]>;
  errorMessage?: string;
}

/**
 * Turns the error axiosClient.ts's response interceptor normalizes every failed
 * request into into a message safe to show a user — prefers a field-validation
 * message or an envelope's errorMessage over the raw server text, and never
 * surfaces a stack trace.
 */
export function getErrorMessage(error: NormalizedApiError): FriendlyError {
  if (error.status === 401 || error.status === 403) {
    return { message: 'You are not authorized to perform this action.' };
  }

  const firstFieldMessage = error.errors && Object.values(error.errors)[0]?.[0];
  if (firstFieldMessage) {
    return { message: firstFieldMessage };
  }

  if (error.errorMessage) {
    return { message: error.errorMessage };
  }

  if (error.status && error.status >= 500) {
    return { message: 'Something went wrong on our end. Please try again later.' };
  }

  return { message: error.message || 'An unexpected error occurred' };
}
