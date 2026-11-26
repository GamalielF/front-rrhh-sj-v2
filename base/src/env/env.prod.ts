import { AppEnvironment } from './env.model';

export const env: AppEnvironment = {
  production: true,
  enableDebugLogin: false,
  auth: {
    loginUrl: 'https://api.coopsanjose.fin.ec/authenticator/api/v1/auth/login',
    logoutUrl: 'https://api.coopsanjose.fin.ec/authenticator/api/v1/auth/logout',
    mfaVerifyUrl: 'https://api.coopsanjose.fin.ec/authenticator/api/v1/auth/mfa/verify',
    refreshUrl: 'https://api.coopsanjose.fin.ec/authenticator/api/v1/auth/refresh',
  },
  api: {
    baseUrl: 'https://serviciossj.coopsanjose.fin.ec:443/api/v1/analitics/',
    userProfileUrl: 'https://serviciossj.coopsanjose.fin.ec:443/api/v1/analitics/Usuarios/busca-usuario',
  },
  ui: {
    systemTitle: 'Sistema en perfil Producción',
    systemDescription: 'Descripción corta del sistema'
  },
};
