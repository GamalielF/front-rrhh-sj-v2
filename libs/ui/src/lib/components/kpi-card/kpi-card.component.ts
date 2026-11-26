import {
  Component,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { KpiColor, KpiTrend } from './kpi-card.model';

const ICON_BG_CLASSES: Record<KpiColor, string> = {
  primary:   'bg-primary-soft text-primary border border-primary-soft-hover',
  brand:     'bg-primary-soft text-navy-200 border border-primary-soft-border',
  success:   'bg-success-soft text-success border border-success-soft-hover',
  warning:   'bg-warning-soft text-warning border border-warning-soft-hover',
  danger:    'bg-danger-soft text-danger border border-danger-soft-hover',
  info:      'bg-info-soft text-info border border-info-soft-hover',
  secondary: 'bg-secondary-soft text-secondary border border-secondary-soft-hover',
  neutral:   'bg-surface-2 text-ink-3 border border-line',
};

@Component({
  selector: 'ui-kpi-card',
  standalone: true,
  imports: [CommonModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.css'],
})
export class KpiCardComponent {
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() icon = '';
  @Input() trend?: KpiTrend;
  @Input() description = '';
  @Input() accentColor: KpiColor = 'primary';

  get iconContainerClass(): string {
    return ICON_BG_CLASSES[this.accentColor] || ICON_BG_CLASSES['primary'];
  }
}
