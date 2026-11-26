import { ButtonSize, ButtonVariant } from "./button.model";

export const BASE = [
  'flex w-full items-center justify-center',
  'font-medium font-sans',
  'border rounded-lg',
  'cursor-pointer select-none whitespace-nowrap',
  'transition-all duration-150 ease-in-out',
  'outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  'relative',
].join(' ');

export const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:    'bg-primary text-on-primary border-primary shadow-xs hover:bg-primary-hover hover:border-primary-hover active:bg-primary-active',
  brand:        'bg-brand text-on-primary border-brand shadow-xs hover:bg-brand-hover hover:border-brand-hover active:bg-brand-active',
  secondary:    'bg-surface text-ink-2 border-line-strong shadow-xs hover:bg-canvas hover:border-line-stronger hover:text-ink active:bg-surface-2',
  outline:    'bg-transparent text-primary border-primary/60 hover:bg-primary/10 active:bg-primary/20',
  ghost:      'bg-transparent text-ink-3 border-transparent hover:bg-surface-2 hover:text-ink active:bg-surface-3',
  light:      'bg-surface-2 text-ink-2 border-transparent hover:bg-surface-3 active:bg-surface-4',
  danger:     'bg-danger text-on-primary border-danger shadow-xs hover:bg-danger-hover hover:border-danger-hover active:bg-danger-active',
  success:    'bg-success text-on-primary border-success shadow-xs hover:bg-success-hover hover:border-success-hover active:bg-success-active',
};

export const SIZE_CLASSES: Record<ButtonSize, string> = {
  xs:   'px-2.5 py-1.5  text-xs    min-h-[32px] gap-1.5',
  sm:   'px-3   py-2    text-xs    min-h-[36px] gap-1.5',
  md:   'px-4   py-2.5  text-sm    min-h-[44px] gap-2',
  lg:   'px-6   py-3    text-base  min-h-[48px] gap-2.5',
  icon: 'p-2.5          text-sm    min-h-[44px] min-w-[44px]',
};
