import { DropdownItemVariant, DropdownPlacement } from '../dropdown/dropdown.model';

export const USER_PROFILE_TRIGGER_BASE = [
  'group inline-flex items-center gap-2.5',
  'rounded-full sm:rounded-xl',
  'p-1 sm:px-3 sm:py-1.5',
  'text-sm font-medium',
  'transition-all duration-200 outline-none cursor-pointer',
  'border border-white/20 bg-white/10 text-on-chrome',
  'hover:bg-white/20 hover:border-white/30',
  'focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-1 focus-visible:ring-offset-chrome',
].join(' ');

export const USER_PROFILE_TRIGGER_OPEN_CLASS = 'bg-white/25 border-white/40 ring-2 ring-white/30';

export const USER_PROFILE_PANEL_BASE = [
  'absolute z-50 w-72 sm:w-80 max-w-[calc(100vw-2rem)] origin-top-right rounded-2xl bg-surface p-2',
  'shadow-2xl ring-1 ring-black/5 border border-line-subtle',
  'animate-in fade-in-0 zoom-in-95 duration-150 ease-out',
].join(' ');

export const USER_PROFILE_PLACEMENT_CLASSES: Record<DropdownPlacement, string> = {
  'bottom-end': 'right-0 top-full mt-2 origin-top-right',
  'bottom-start': 'left-0 top-full mt-2 origin-top-left',
  'bottom-center': 'left-1/2 -translate-x-1/2 top-full mt-2 origin-top',
  'top-end': 'right-0 bottom-full mb-2 origin-bottom-right',
  'top-start': 'left-0 bottom-full mb-2 origin-bottom-left',
  'top-center': 'left-1/2 -translate-x-1/2 bottom-full mb-2 origin-bottom',
};

export const USER_PROFILE_ITEM_BASE = [
  'w-full flex items-center gap-3 px-3 py-2 text-xs font-medium',
  'rounded-lg transition-colors text-left outline-none',
].join(' ');

export const USER_PROFILE_ITEM_DISABLED_CLASS = 'text-subtle cursor-not-allowed opacity-60';

export const USER_PROFILE_ITEM_VARIANTS: Record<DropdownItemVariant, string> = {
  danger: 'text-danger hover:bg-danger-soft hover:text-danger-hover active:bg-danger-soft-hover',
  brand: 'text-navy-200 hover:bg-primary-soft hover:text-navy-400 active:bg-primary-soft-hover',
  primary: 'text-primary hover:bg-primary-soft hover:text-primary-hover active:bg-primary-soft-hover',
  warning: 'text-warning hover:bg-warning-soft hover:text-warning-hover active:bg-warning-soft-hover',
  info: 'text-info hover:bg-info-soft hover:text-info-hover active:bg-info-soft-hover',
  default: 'text-ink-3 hover:bg-surface-2 hover:text-ink active:bg-surface-3/60',
};

export const USER_PROFILE_ITEM_ICON_VARIANTS: Record<DropdownItemVariant, string> = {
  danger: 'text-danger-strong',
  brand: 'text-navy-200',
  primary: 'text-primary',
  warning: 'text-warning-strong',
  info: 'text-info-strong',
  default: 'text-subtle group-hover:text-ink-4',
};
