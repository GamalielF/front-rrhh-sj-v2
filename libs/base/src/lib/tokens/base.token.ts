import { InjectionToken, Provider } from '@angular/core';

export interface LumenBaseConfig {
  systemTitle?: string;
  systemDescription?: string;
  logoSrc?: string;
  backgroundImage?: string;
}

export const DEFAULT_LUMEN_BASE_CONFIG: Required<LumenBaseConfig> = {
  systemTitle: 'DEFAULT_TITLE',
  systemDescription: 'DEFAULT_DESCRIPTION',
  logoSrc: 'assets/lumen/img/logo-blue.png',
  backgroundImage: '/assets/lumen/img/sanjose-bg.jpg',
};

export const LUMEN_BASE_CONFIG = new InjectionToken<LumenBaseConfig>('LUMEN_BASE_CONFIG');

export function provideLumenBase(config?: Partial<LumenBaseConfig>): Provider {
  return {
    provide: LUMEN_BASE_CONFIG,
    useValue: { ...DEFAULT_LUMEN_BASE_CONFIG, ...(config || {}) },
  };
}
