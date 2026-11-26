import { DropdownTriggerVariant, DropdownTriggerSize } from './dropdown.model';

export const TRIGGER_BASE =
  'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

export const TRIGGER_VARIANTS: Record<DropdownTriggerVariant, string> = {
  ghost: 'bg-transparent text-muted hover:text-ink-2 hover:bg-surface-2 active:bg-surface-3',
  secondary: 'bg-surface text-ink-3 border border-line hover:bg-canvas active:bg-surface-2 shadow-xs',
  primary: 'bg-primary text-white hover:bg-primary-hover active:bg-primary-active shadow-xs',
  brand: 'bg-sanjose-blue text-white hover:bg-navy-400 active:bg-navy-800 shadow-xs',
  outline: 'bg-transparent text-ink-3 border border-line-strong hover:bg-canvas active:bg-surface-2',
};

export const TRIGGER_SIZES: Record<DropdownTriggerSize, string> = {
  xs: 'h-7 px-2 text-xs gap-1',
  sm: 'h-8 px-2.5 text-xs gap-1.5',
  md: 'h-9 px-3.5 text-sm gap-2',
  lg: 'h-10 px-4 text-base gap-2',
};

export const TRIGGER_ICON_SIZES: Record<DropdownTriggerSize, string> = {
  xs: 'h-7 w-7 p-0',
  sm: 'h-8 w-8 p-0',
  md: 'h-9 w-9 p-0',
  lg: 'h-10 w-10 p-0',
};
