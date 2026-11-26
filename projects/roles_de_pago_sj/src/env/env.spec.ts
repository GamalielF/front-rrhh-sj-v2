import { env as desarrollo } from './env.dev';
import { env as produccion } from './env.prod';
import { env as pruebas } from './env.pruebas';

describe('entornos', () => {
  it('producción solo deja abrir un período hasta el mes siguiente', () => {
    expect(produccion.mesesFuturosPermitidos).toBe(12);
  });

  it('desarrollo deja abrir meses por delante para poder ensayar, pero con un tope', () => {
    expect(desarrollo.mesesFuturosPermitidos).toBeGreaterThan(1);
    expect(desarrollo.mesesFuturosPermitidos).toBeLessThanOrEqual(24);
  });

  it('los dos entornos apuntan al mismo contrato de claves', () => {
    expect(Object.keys(produccion).sort()).toEqual(Object.keys(desarrollo).sort());
  });

  // Recorre también los grupos anidados (auth, api, ui) para devolver cada texto con su ruta: "api.baseUrl"
  const textos = (obj: object, prefijo = ''): [string, string][] =>
    Object.entries(obj).flatMap(([clave, valor]) =>
      typeof valor === 'string' ? [[prefijo + clave, valor] as [string, string]]
        : valor && typeof valor === 'object' ? textos(valor, `${prefijo}${clave}.`) : []);

  it('el entorno de test tiene las mismas claves que desarrollo y no apunta a localhost', () => {
    expect(textos(pruebas).map(([c]) => c).sort()).toEqual(textos(desarrollo).map(([c]) => c).sort());
    for (const [clave, valor] of textos(pruebas)) {
      expect(valor, clave).not.toMatch(/localhost|127\.0\.0\.1/);
      if (/url$/i.test(clave)) expect(valor, clave).toMatch(/^https:\/\//);
    }
  });

  it('el backend de roles de pago de test termina en "/" porque el código le agrega la ruta sin separador', () => {
    expect(pruebas.api.rolesPagoApiUrl.endsWith('/')).toBe(true);
    expect(pruebas.api.rolesPagoApiUrl).toBe('https://pre-prod.coopsanjose.fin.ec/rrhh-roll-administration/');
  });

  it('test nunca deja entrar sin credenciales', () => {
    expect(pruebas.enableDebugLogin).toBe(false);
  });
});
