import { AppEnvironment } from './env.model';

export const env: AppEnvironment = {
  production: false,
  enableDebugLogin: false,
  auth: {
    loginUrl: 'http://localhost:8085/api/v1/auth/login',
    logoutUrl: 'http://localhost:8085/api/v1/auth/logout',
    mfaVerifyUrl: 'http://localhost:8085/api/v1/auth/mfa/verify',
    refreshUrl: 'http://localhost:8085/api/v1/auth/refresh',
  },
  api: {
    baseUrl: 'https://proxy.coopsanjose.fin.ec:8443/api/v1/analitics/',
    userProfileUrl: 'https://proxy.coopsanjose.fin.ec:8443/api/v1/analitics/Usuarios/busca-usuario',
  },
  ui: {
    systemTitle: 'Sistema en perfil Dev',
    systemDescription: 'Descripción corta del sistema'
  },
};
