import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { I18n } from '../i18n/i18n';

interface ProblemDetails {
  detail?: string;
  errors?: string[] | Record<string, string[]>;
}

/**
 * Turns an HTTP error into messages for the user. The API returns ProblemDetails with
 * either a list of errors (game rules) or a dictionary of errors (request model binding).
 */
export function errorMessages(error: unknown, i18n: I18n): string[] {
  if (!(error instanceof HttpErrorResponse)) {
    return [i18n.t('error.unexpected')];
  }

  if (error.status === 0) {
    return [i18n.t('error.unreachable')];
  }

  const problem = error.error as ProblemDetails | null;
  const errors = problem?.errors;
  if (Array.isArray(errors)) {
    return errors;
  }
  if (errors) {
    return Object.values(errors).flat();
  }

  return [problem?.detail ?? i18n.t('error.status', { status: error.status })];
}

export function hasStatus(error: unknown, status: HttpStatusCode): boolean {
  return error instanceof HttpErrorResponse && error.status === status;
}
