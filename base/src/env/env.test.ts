import { AppEnvironment } from './env.model';

export const env: AppEnvironment = {
  production: false,
  enableDebugLogin: false,
  auth: {
    loginUrl: 'https://pre-prod.coopsanjose.fin.ec/authenticator/api/v1/auth/login',
    logoutUrl: 'https://pre-prod.coopsanjose.fin.ec/authenticator/api/v1/auth/logout',
    mfaVerifyUrl: 'https://pre-prod.coopsanjose.fin.ec/authenticator/api/v1/auth/mfa/verify',
    refreshUrl: 'https://pre-prod.coopsanjose.fin.ec/authenticator/api/v1/auth/refresh',
  },
  api: {
    baseUrl: 'https://proxy.coopsanjose.fin.ec:8443/api/v1/analitics/',
    userProfileUrl: 'https://proxy.coopsanjose.fin.ec:8443/api/v1/analitics/Usuarios/busca-usuario',
  },
  ui: {
    systemTitle: 'Sistema en perfil Test',
    systemDescription: 'Descripción corta del sistema'
  },
};
