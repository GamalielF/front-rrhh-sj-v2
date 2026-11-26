export interface AuthEnvironment {
  loginUrl: string;
  logoutUrl: string;
  mfaVerifyUrl: string;
  refreshUrl: string;
}

export interface ApiEnvironment {
  baseUrl: string;
  userProfileUrl: string;
  rolesPagoApiUrl: string;
}

export interface UiEnvironment {
  systemTitle: string;
  systemDescription: string;
  logoSrc: string;
  backgroundImage: string;
}

export interface AppEnvironment {
  production: boolean;
  enableDebugLogin: boolean;
  mesesFuturosPermitidos: number;
  auth: AuthEnvironment;
  api: ApiEnvironment;
  ui: UiEnvironment;
}
