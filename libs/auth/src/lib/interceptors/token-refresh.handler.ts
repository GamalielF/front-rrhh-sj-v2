import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError, Observable } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ReauthService } from '../services/reauth.service';
import { ReauthMode } from '../models/auth.models';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

function addAuthHeader(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

export function handleTokenRefresh(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router,
  loginUrl: string,
  refreshUrl: string,
  reauthService?: ReauthService,
  reauthMode: ReauthMode = 'modal'
): Observable<HttpEvent<unknown>> {
  if (req.url.includes(refreshUrl)) {
    return throwError(() => new Error('Refresh token request failed'));
  }

  if (isRefreshing) {
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next(addAuthHeader(req, token!)))
    );
  }

  isRefreshing = true;
  refreshTokenSubject.next(null);

  const fallbackToReauthOrLogin = (errorToThrow: unknown): Observable<HttpEvent<unknown>> => {
    isRefreshing = false;
    refreshTokenSubject.next(null);

    const hasPriorSession = !!(authService.getUser() || authService.getToken());
    if (reauthMode === 'modal' && reauthService && hasPriorSession) {
      return reauthService.promptReauth().pipe(
        switchMap((success) => {
          if (success) {
            const refreshedToken = authService.getToken();
            if (refreshedToken) {
              refreshTokenSubject.next(refreshedToken);
              return next(addAuthHeader(req, refreshedToken));
            }
          }
          authService.logout(true);
          router.navigateByUrl(loginUrl);
          return throwError(() => errorToThrow);
        })
      );
    }

    authService.logout(true);
    router.navigateByUrl(loginUrl);
    return throwError(() => errorToThrow);
  };

  return authService.refreshAccessToken().pipe(
    switchMap((response) => {
      isRefreshing = false;
      const newToken = response.accessToken;
      if (!newToken) {
        return fallbackToReauthOrLogin(new Error('No access token in refresh response'));
      }
      refreshTokenSubject.next(newToken);
      return next(addAuthHeader(req, newToken));
    }),
    catchError((err) => fallbackToReauthOrLogin(err))
  );
}

export { addAuthHeader };
