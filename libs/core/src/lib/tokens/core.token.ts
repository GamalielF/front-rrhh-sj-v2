import { LOCALE_ID, Provider } from '@angular/core';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { CoreConfig } from '../models/core.models';

const DEFAULT_CORE_CONFIG: Required<CoreConfig> = {
  localeId: 'es-CO',
  baseHref: '/',
};

export function provideBaseHref(baseHref?: string): Provider {
  return {
    provide: APP_BASE_HREF,
    useFactory: (platformLocation: PlatformLocation) => {
      if (baseHref) {
        return baseHref;
      }
      return platformLocation.getBaseHrefFromDOM();
    },
    deps: [PlatformLocation],
  };
}

export function provideLocale(localeId?: string): Provider {
  return {
    provide: LOCALE_ID,
    useValue: localeId || DEFAULT_CORE_CONFIG.localeId,
  };
}

export function provideCore(config?: CoreConfig): Provider[] {
  const providers: Provider[] = [
    provideBaseHref(config?.baseHref),
  ];

  if (config?.localeId !== undefined) {
    providers.push(provideLocale(config.localeId));
  }

  return providers;
}

