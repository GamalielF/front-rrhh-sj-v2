export interface AuthEnvironment {
  loginUrl: string;
  logoutUrl: string;
  mfaVerifyUrl: string;
  refreshUrl: string;
}

export interface ApiEnvironment {
  baseUrl: string;
  userProfileUrl: string;
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
  auth: AuthEnvironment;
  api: ApiEnvironment;
  ui: UiEnvironment;
}
