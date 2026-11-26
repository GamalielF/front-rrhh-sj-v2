import { APP_INITIALIZER, InjectionToken, Provider } from '@angular/core';
import { ThemeConfig, ThemeDefinition } from '../models/theme.model';
import { ThemeService } from '../services/theme.service';

export const DEFAULT_LUMEN_THEMES: readonly ThemeDefinition[] = [
  {
    id: 'default',
    name: 'Legacy',
    description: 'Initial theme',
  },
  {
    id: 'refined',
    name: 'Refined',
    description: 'Refined modern theme',
  },
];

export const DEFAULT_LUMEN_THEME_CONFIG: Required<ThemeConfig> = {
  theme: 'default',
  storageKey: 'lumen-theme',
  themes: [...DEFAULT_LUMEN_THEMES],
};

export const LUMEN_THEME_CONFIG = new InjectionToken<ThemeConfig>('LUMEN_THEME_CONFIG', {
  providedIn: 'root',
  factory: () => ({ ...DEFAULT_LUMEN_THEME_CONFIG }),
});

export function provideTheme(config?: Partial<ThemeConfig>): Provider[] {
  return [
    {
      provide: LUMEN_THEME_CONFIG,
      useValue: { ...DEFAULT_LUMEN_THEME_CONFIG, ...(config || {}) },
    },
    ThemeService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (themeService: ThemeService) => () => themeService.init(),
      deps: [ThemeService],
    },
  ];
}
