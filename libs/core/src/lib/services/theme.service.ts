import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { ThemeDefinition, ThemeId } from '../models/theme.model';
import {
  DEFAULT_LUMEN_THEME_CONFIG,
  DEFAULT_LUMEN_THEMES,
  LUMEN_THEME_CONFIG,
} from '../tokens/theme.token';

@Injectable()
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly config = inject(LUMEN_THEME_CONFIG);

  readonly theme = signal<ThemeId>(DEFAULT_LUMEN_THEME_CONFIG.theme);
  readonly themes = signal<readonly ThemeDefinition[]>(
    this.config.themes?.length ? this.config.themes : DEFAULT_LUMEN_THEMES
  );
  readonly isRefined = computed(() => this.theme() === 'refined');

  private transitionTimer: ReturnType<typeof setTimeout> | null = null;

  init(): void {
    const storedTheme = this.readStoredTheme();
    this.applyTheme(storedTheme ?? this.config.theme ?? DEFAULT_LUMEN_THEME_CONFIG.theme);

    if (isPlatformBrowser(this.platformId)) {
      const storageKey = this.getStorageKey();
      this.document.defaultView?.addEventListener('storage', (event) => {
        if (event.key === storageKey) {
          this.applyTheme(event.newValue ?? this.config.theme ?? DEFAULT_LUMEN_THEME_CONFIG.theme);
        }
      });
    }
  }

  setTheme(theme: ThemeId): void {
    this.triggerThemeTransition();
    this.applyTheme(theme);
    this.writeStoredTheme(theme);
  }

  isTheme(theme: ThemeId): boolean {
    return this.theme() === theme;
  }

  toggleTheme(targetTheme: ThemeId = 'refined'): ThemeId {
    const next = this.theme() === targetTheme ? DEFAULT_LUMEN_THEME_CONFIG.theme : targetTheme;
    this.setTheme(next);
    return next;
  }

  private applyTheme(theme: ThemeId): void {
    this.theme.set(theme);
    if (theme === DEFAULT_LUMEN_THEME_CONFIG.theme) {
      this.document.documentElement.removeAttribute('data-theme');
    } else {
      this.document.documentElement.setAttribute('data-theme', theme);
    }
  }

  private triggerThemeTransition(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const root = this.document.documentElement;
    root.classList.add('lumen-theme-transition');
    if (this.transitionTimer) {
      clearTimeout(this.transitionTimer);
    }
    this.transitionTimer = setTimeout(() => {
      root.classList.remove('lumen-theme-transition');
      this.transitionTimer = null;
    }, 260);
  }

  private getStorageKey(): string {
    return this.config.storageKey ?? DEFAULT_LUMEN_THEME_CONFIG.storageKey;
  }

  private readStoredTheme(): ThemeId | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(this.getStorageKey());
  }

  private writeStoredTheme(theme: ThemeId): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(this.getStorageKey(), theme);
  }
}
