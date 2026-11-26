export interface KpiTrend {
  value: number;
  direction: 'up' | 'down';
  label?: string;
}

export type KpiColor =
  | 'primary'
  | 'brand'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'secondary'
  | 'neutral'
  | 'blue'
  | 'green'
  | 'purple';
