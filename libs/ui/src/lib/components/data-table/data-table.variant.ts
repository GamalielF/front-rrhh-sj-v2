export const PRESET_COLORS = [
  { label: 'Azul', value: '#3B82F6', bgClass: 'bg-primary-soft', textClass: 'text-primary-active', borderClass: 'border-primary-soft-border' },
  { label: 'Esmeralda', value: '#10B981', bgClass: 'bg-success-soft', textClass: 'text-success-ink', borderClass: 'border-success-soft-border' },
  { label: 'Ámbar', value: '#F59E0B', bgClass: 'bg-warning-soft', textClass: 'text-warning-hover', borderClass: 'border-warning-soft-border' },
  { label: 'Rojo', value: '#EF4444', bgClass: 'bg-danger-soft', textClass: 'text-danger-hover', borderClass: 'border-danger-soft-border' },
  { label: 'Púrpura', value: '#8B5CF6', bgClass: 'bg-secondary-soft', textClass: 'text-secondary-ink', borderClass: 'border-secondary-soft-border' },
  { label: 'Rosa', value: '#EC4899', bgClass: 'bg-pink-50', textClass: 'text-pink-700', borderClass: 'border-pink-200' },
  { label: 'Cian', value: '#06B6D4', bgClass: 'bg-cyan-50', textClass: 'text-cyan-700', borderClass: 'border-cyan-200' },
  { label: 'Gris', value: '#64748B', bgClass: 'bg-slate-100', textClass: 'text-slate-700', borderClass: 'border-slate-300' },
];

export const FILTER_CHIP_BASE =
  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shadow-xs transition-all duration-150';

export const OPERATOR_LABELS: Record<string, string> = {
  contains: 'contiene',
  equals: 'es igual a',
  startsWith: 'empieza con',
  endsWith: 'termina con',
  gt: 'mayor que (>)',
  gte: 'mayor o igual (≥)',
  lt: 'menor que (<)',
  lte: 'menor o igual (≤)',
  between: 'entre',
  before: 'antes de',
  after: 'después de',
  in: 'en lista',
  asc: 'Ascendente',
  desc: 'Descendente',
  none: 'Sin orden',
};

export const ACTION_BASE =
  'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-150 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

export const ACTION_VARIANT: Record<string, string> = {
  primary: 'bg-primary-soft text-primary-active border-primary-soft-border hover:bg-primary-soft-hover active:bg-primary-soft-border',
  secondary: 'bg-surface-2 text-ink-2 border-line hover:bg-surface-3 active:bg-surface-4',
  brand: 'bg-success-soft text-success-hover border-success-soft-border hover:bg-success-soft-hover active:bg-success-soft-border',
  danger: 'bg-danger-soft text-danger-hover border-danger-soft-border hover:bg-danger-soft-hover active:bg-danger-soft-border',
  ghost: 'bg-transparent text-ink-4 border-transparent hover:bg-surface-2 hover:text-ink',
  warning: 'bg-warning-soft text-warning-hover border-warning-soft-border hover:bg-warning-soft-hover active:bg-warning-soft-border',
  info: 'bg-info-soft text-info-hover border-info-soft-border hover:bg-info-soft-hover active:bg-info-soft-border',
  default: 'bg-surface text-ink-3 border-line hover:bg-canvas active:bg-surface-2 shadow-xs',
};