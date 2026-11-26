import {
  Component,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeVariant, BadgeSize, BadgeShape } from './badge.model';

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  primary:   'bg-primary-soft text-primary-active border border-primary-soft-border font-medium',
  secondary: 'bg-secondary-soft text-secondary-ink border border-secondary-soft-border font-medium',
  info:      'bg-info-soft text-info-active border border-info-soft-border font-medium',
  warning:   'bg-warning-soft text-warning-active border border-warning-soft-border font-medium',
  danger:    'bg-danger-soft text-danger-active border border-danger-soft-border font-medium',
  success:   'bg-success-soft text-success-deep border border-success-soft-border font-medium',
  neutral:   'bg-surface-2 text-ink-2 border border-line font-medium',
  brand:     'bg-success-soft text-success-active border border-success-soft-border font-medium',
};

const DOT_CLASSES: Record<BadgeVariant, string> = {
  primary:   'bg-primary',
  secondary: 'bg-secondary',
  info:      'bg-info-strong',
  warning:   'bg-warning',
  danger:    'bg-danger',
  success:   'bg-success',
  neutral:   'bg-surface-5',
  brand:     'bg-brand',
};

const SIZE_CLASSES: Record<BadgeSize, string> = {
  xs: 'px-2 py-0.5 text-[11px] leading-tight',
  sm: 'px-2.5 py-0.5 text-xs leading-none',
  md: 'px-3 py-1 text-xs leading-normal',
  lg: 'px-3.5 py-1.5 text-sm leading-normal',
};

@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.css'],
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'info';
  @Input() size: BadgeSize = 'md';
  @Input() shape: BadgeShape = 'pill';
  @Input() showDot = false;
  @Input() value?: string | number;

  get badgeClass(): string {
    const radiusClass = this.shape === 'pill' ? 'rounded-full' : 'rounded-md';
    return [
      'inline-flex items-center justify-center whitespace-nowrap tracking-tight transition-colors',
      radiusClass,
      VARIANT_CLASSES[this.variant] || VARIANT_CLASSES['info'],
      SIZE_CLASSES[this.size] || SIZE_CLASSES['md'],
    ].join(' ');
  }

  get dotClass(): string {
    return DOT_CLASSES[this.variant] || DOT_CLASSES['info'];
  }
}
