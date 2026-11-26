import { ApplicationConfig, provideBrowserGlobalErrorListeners, LOCALE_ID } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withNoHttpTransferCache } from '@angular/platform-browser';
import { authInterceptor, provideAuth, provideUserProfileLoader } from '@lumen/auth';
import { provideLumenBase } from '@lumen/base';
import { provideHttp } from '@lumen/http';
import { provideCore } from '@lumen/core';
import { routes } from './app.routes';
import { env } from '@env';
import { UserProfileService } from './core/services/user-profile.service';
import { registerLocaleData } from '@angular/common';
import localeEsCO from '@angular/common/locales/es-CO';

registerLocaleData(localeEsCO);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules)
    ),
    provideClientHydration(withNoHttpTransferCache()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideHttp({
      baseUrl: env.api.baseUrl,
    }),
    provideAuth({
      loginUrl: env.auth.loginUrl,             // Primer paso de autenticación {username, password}
      mfaVerifyUrl: env.auth.mfaVerifyUrl,     // Segundo paso de autenticación { accessToken, totpCode }
      refreshUrl: env.auth.refreshUrl,         // Solicitud de nuevo accessToken
      defaultRedirectUrl: '/home',             // ruta por defecto cuando el usuario está autenticado
      forbiddenRedirectUrl: '/forbidden',      // ruta por defecto cuando el usuario no tiene permisos
      loginRedirectUrl: '/login',              // ruta por defecto cuando el usuario no está autenticado
      enableRefreshToken: true,                // Habilitar refresh token
      refreshMode: 'cookie',                   // modo de refresh token, cookie o body
      withCredentials: false,                  // NO: el backend rechaza credenciales (CORS). La cookie de refresh ya viaja sola (refreshMode cookie)
      tokenStorage: 'sessionStorage',          // almacenamiento del token, localStorage o sessionStorage
      enableDebugMode: env.enableDebugLogin,
    }),
    provideLumenBase({
      systemTitle: env.ui.systemTitle,
      systemDescription: env.ui.systemDescription,
    }),
    provideCore({
      localeId: 'es-CO',
    }),
    provideUserProfileLoader(UserProfileService),
  ],
};
