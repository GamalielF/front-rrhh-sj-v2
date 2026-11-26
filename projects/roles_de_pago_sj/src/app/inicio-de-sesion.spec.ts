import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { Observable, firstValueFrom, isObservable, of, throwError } from 'rxjs';
import { AUTH_CONFIG, AuthConfig, AuthService, authGuard } from '@lumen/auth';
import { appConfig } from './app.config';

/**
 * Al abrir SIRPA sin sesión SIEMPRE se debe ver el login, nunca el menú.
 * Estas pruebas existen porque la corrección se perdió una vez al copiar la librería @lumen/auth desde otro proyecto:
 * si alguien vuelve a reemplazar libs/auth o quita refreshOnStartup de app.config.ts, fallan aquí antes de desplegar.
 */
describe('inicio de sesión: sin sesión se va al login', () => {
  /** Simula el servicio de autenticación: si hay token guardado, si está vigente y qué responde la renovación */
  const entrar = async (opciones: {
    tokenGuardado?: string | null;
    vigente?: boolean;
    renovacion?: 'ok-con-token' | 'ok-sin-token' | 'error';
    config?: Partial<AuthConfig>;
  }) => {
    let vigente = opciones.vigente ?? false;
    let renovaciones = 0;
    const servicio = {
      isAuthenticated: () => vigente,
      getToken: () => opciones.tokenGuardado ?? null,
      canRefresh: () => true,
      logout: () => of(void 0),
      refreshAccessToken: () => {
        renovaciones++;
        if (opciones.renovacion === 'error') return throwError(() => new Error('401'));
        if (opciones.renovacion === 'ok-con-token') vigente = true;
        // 'ok-sin-token': el autenticador responde 200 pero sin token (así responde a veces con {"status":"401"})
        return of({});
      },
    };
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: servicio },
        { provide: AUTH_CONFIG, useValue: { loginRedirectUrl: '/login', refreshMode: 'cookie', ...opciones.config } },
      ],
    });
    const r = TestBed.runInInjectionContext(() => authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));
    const valor = isObservable(r) ? await firstValueFrom(r as Observable<boolean | UrlTree>) : (r as boolean | UrlTree);
    return { destino: valor === true ? 'entra' : TestBed.inject(Router).serializeUrl(valor as UrlTree), renovaciones };
  };

  it('SIRPA está configurado para pedir login en una pestaña nueva (refreshOnStartup: false)', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [...appConfig.providers] });
    expect(TestBed.inject(AUTH_CONFIG).refreshOnStartup).toBe(false);
  });

  it('pestaña nueva sin token: va al login sin intentar entrar con una sesión anterior', async () => {
    const r = await entrar({ tokenGuardado: null, renovacion: 'ok-con-token', config: { refreshOnStartup: false } });
    expect(r.destino).toBe('/login');
    expect(r.renovaciones).toBe(0);
  });

  it('si el autenticador responde 200 SIN token, no entra: va al login', async () => {
    const r = await entrar({ tokenGuardado: 'vencido', renovacion: 'ok-sin-token', config: { refreshOnStartup: false } });
    expect(r.destino).toBe('/login');
  });

  it('también va al login con refreshOnStartup: true si la renovación no trae token', async () => {
    const r = await entrar({ tokenGuardado: null, renovacion: 'ok-sin-token', config: { refreshOnStartup: true } });
    expect(r.destino).toBe('/login');
  });

  it('si la renovación falla, va al login', async () => {
    const r = await entrar({ tokenGuardado: 'vencido', renovacion: 'error', config: { refreshOnStartup: false } });
    expect(r.destino).toBe('/login');
  });

  it('con un token vigente entra (recargar con F5 no saca al usuario)', async () => {
    const r = await entrar({ tokenGuardado: 'vigente', vigente: true, config: { refreshOnStartup: false } });
    expect(r.destino).toBe('entra');
  });

  it('con un token vencido en la pestaña, renueva la sesión y entra', async () => {
    const r = await entrar({ tokenGuardado: 'vencido', renovacion: 'ok-con-token', config: { refreshOnStartup: false } });
    expect(r.destino).toBe('entra');
    expect(r.renovaciones).toBe(1);
  });
});
