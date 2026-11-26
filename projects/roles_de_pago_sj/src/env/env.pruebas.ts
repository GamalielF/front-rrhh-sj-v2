import { AppEnvironment } from './env.model';

/**
 * Servidor de TEST (pre-prod.coopsanjose.fin.ec). La imagen de Docker usa este archivo (ARG ENTORNO=pruebas en el Dockerfile).
 * Se llama «pruebas» y no «test» porque el ejecutor de pruebas toma cualquier *.test.ts por una prueba.
 * El front, el backend y el autenticador están en el mismo dominio: para el navegador es un solo origen.
 */
export const env: AppEnvironment = {
    production: false,
    enableDebugLogin: false,
    mesesFuturosPermitidos: 12,
    auth: {
        loginUrl: 'https://pre-prod.coopsanjose.fin.ec/authenticator/api/v1/auth/login',
        logoutUrl: 'https://pre-prod.coopsanjose.fin.ec/authenticator/api/v1/auth/logout',
        mfaVerifyUrl: 'https://pre-prod.coopsanjose.fin.ec/authenticator/api/v1/auth/mfa/verify',
        refreshUrl: 'https://pre-prod.coopsanjose.fin.ec/authenticator/api/v1/auth/refresh',
    },
    api: {
        baseUrl: 'https://proxy.coopsanjose.fin.ec:8443/api/v1/analitics/',
        userProfileUrl: 'https://proxy.coopsanjose.fin.ec:8443/api/v1/analitics/Usuarios/busca-usuario',
        rolesPagoApiUrl: 'https://pre-prod.coopsanjose.fin.ec/rrhh-roll-administration/',
    },
    ui: {
        systemTitle: 'S.I.R.P.A - Cooperativa de Ahorro y Crédito San José Ltda.',
        systemDescription: 'Sistema de Rol de Pagos Administrado',
        logoSrc: 'img/logo-blue.png',
        backgroundImage: '/img/sanjose-bg.jpg',
    },
};
