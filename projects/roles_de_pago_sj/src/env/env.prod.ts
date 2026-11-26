import { AppEnvironment } from './env.model';

export const env: AppEnvironment = {
  production: false,
  enableDebugLogin: false,
  mesesFuturosPermitidos: 12,
  auth: {
    loginUrl: 'https://api.coopsanjose.fin.ec/authenticator/api/v1/auth/login',
    logoutUrl: 'https://api.coopsanjose.fin.ec/authenticator/api/v1/auth/logout',
    mfaVerifyUrl: 'https://api.coopsanjose.fin.ec/authenticator/api/v1/auth/mfa/verify',
    refreshUrl: 'https://api.coopsanjose.fin.ec/authenticator/api/v1/auth/refresh',
  },
  api: {
    baseUrl: 'https://proxy.coopsanjose.fin.ec:8443/api/v1/analitics/',
    userProfileUrl: 'https://proxy.coopsanjose.fin.ec:8443/api/v1/analitics/Usuarios/busca-usuario',
    rolesPagoApiUrl: 'https://pre-prod.coopsanjose.fin.ec/rrhh-roll-administration/',
  },
  ui: {
    systemTitle: 'Sistema en perfil Producción',
    systemDescription: 'Descripción corta del sistema',
    logoSrc: 'img/logo-blue.png',
    backgroundImage: '/img/sanjose-bg.jpg',
  },
};
