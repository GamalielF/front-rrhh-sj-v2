export type BuiltinThemeId = 'default' | 'refined';

export type ThemeId = BuiltinThemeId | (string & {});

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  description?: string;
}

export interface ThemeConfig {
  theme?: ThemeId;
  storageKey?: string;
  themes?: ThemeDefinition[];
}
