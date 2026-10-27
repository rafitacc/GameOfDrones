import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { I18n } from './i18n';

/** Lets the API answer validation errors in the language chosen in the app. */
export const languageInterceptor: HttpInterceptorFn = (request, next) =>
  next(request.clone({ setHeaders: { 'Accept-Language': inject(I18n).language() } }));
