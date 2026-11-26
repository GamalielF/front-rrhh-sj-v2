import { AppEnvironment } from './env.model';

export const env: AppEnvironment = {
  production: false,
  enableDebugLogin: false,
  mesesFuturosPermitidos: 12,
  auth: {
    loginUrl: 'http://localhost:4200/authenticator/api/v1/auth/login',
    logoutUrl: 'http://localhost:4200/authenticator/api/v1/auth/logout',
    mfaVerifyUrl: 'http://localhost:4200/authenticator/api/v1/auth/mfa/verify',
    refreshUrl: 'http://localhost:4200/authenticator/api/v1/auth/refresh',
  },
  api: {
    baseUrl: 'http://localhost:4200/api-ad/',
    userProfileUrl: 'http://localhost:4200/api-ad/Usuarios/busca-usuario',
    rolesPagoApiUrl: 'http://localhost:8080/api/v1/roles-pago/',
  },
  ui: {
    systemTitle: 'S.I.R.P.A - Cooperativa de Ahorro y Crédito San José Ltda.',
    systemDescription: 'Sistema de Rol de Pagos Administrado',
    logoSrc: 'img/logo-blue.png',
    backgroundImage: '/img/sanjose-bg.jpg',
  },
};
