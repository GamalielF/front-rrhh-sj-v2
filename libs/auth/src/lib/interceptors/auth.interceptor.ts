import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ReauthService } from '../services/reauth.service';
import { AUTH_CONFIG, DEFAULT_AUTH_CONFIG } from '../tokens/auth.token';
import { addAuthHeader, handleTokenRefresh } from './token-refresh.handler';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const reauthService = inject(ReauthService);
  const router = inject(Router);
  const config = inject(AUTH_CONFIG, { optional: true });

  const loginRedirectUrl = config?.loginRedirectUrl ?? DEFAULT_AUTH_CONFIG.loginRedirectUrl;
  const loginUrl = config?.loginUrl ?? DEFAULT_AUTH_CONFIG.loginUrl;
  const refreshUrl = config?.refreshUrl ?? DEFAULT_AUTH_CONFIG.refreshUrl;
  const mfaVerifyUrl = config?.mfaVerifyUrl ?? DEFAULT_AUTH_CONFIG.mfaVerifyUrl;
  const reauthMode = config?.reauthMode ?? DEFAULT_AUTH_CONFIG.reauthMode;

  const token = authService.getToken();
  let authReq = token ? addAuthHeader(req, token) : req;

  if (config?.withCredentials) {
    authReq = authReq.clone({ withCredentials: true });
  }

  return next(authReq).pipe(
    catchError((error: unknown) => {
      const isAuthEndpoint =
        req.url.includes(loginUrl) ||
        req.url.includes(loginRedirectUrl) ||
        req.url.includes(refreshUrl) ||
        req.url.includes(mfaVerifyUrl);

      const canRefresh = !isAuthEndpoint && authService.canRefresh();

      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        canRefresh
      ) {
        return handleTokenRefresh(
          req,
          next,
          authService,
          router,
          loginRedirectUrl,
          refreshUrl,
          reauthService,
          reauthMode
        );
      }

      if (error instanceof HttpErrorResponse && error.status === 401) {
        if (!isAuthEndpoint) {
          const hasPriorSession = !!(authService.getUser() || authService.getToken());
          if (reauthMode === 'modal' && hasPriorSession) {
            return reauthService.promptReauth().pipe(
              switchMap((success) => {
                if (success) {
                  const refreshedToken = authService.getToken();
                  if (refreshedToken) {
                    return next(addAuthHeader(req, refreshedToken));
                  }
                }
                authService.logout(true);
                router.navigateByUrl(loginRedirectUrl);
                return throwError(() => error);
              })
            );
          }

          authService.logout(true);
          router.navigateByUrl(loginRedirectUrl);
        }
      }

      return throwError(() => error);
    })
  );
};
