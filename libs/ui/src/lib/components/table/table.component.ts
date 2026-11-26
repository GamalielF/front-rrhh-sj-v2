import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { TableColumn, TableAction, TableActionsLayout } from './table.model';
import { BadgeComponent } from '../badge/badge.component';
import { IconComponent } from '../icon/icon.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { DropdownItem, DropdownTriggerVariant } from '../dropdown/dropdown.model';

const ACTION_BASE = 'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-150 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

const ACTION_VARIANT: Record<string, string> = {
  primary:   'bg-primary-soft text-primary-active border-primary-soft-border hover:bg-primary-soft-hover active:bg-primary-soft-border',
  secondary: 'bg-surface-2 text-ink-2 border-line hover:bg-surface-3 active:bg-surface-4',
  brand:     'bg-success-soft text-success-hover border-success-soft-border hover:bg-success-soft-hover active:bg-success-soft-border',
  danger:    'bg-danger-soft text-danger-hover border-danger-soft-border hover:bg-danger-soft-hover active:bg-danger-soft-border',
  ghost:     'bg-transparent text-ink-4 border-transparent hover:bg-surface-2 hover:text-ink',
  warning:   'bg-warning-soft text-warning-hover border-warning-soft-border hover:bg-warning-soft-hover active:bg-warning-soft-border',
  info:      'bg-info-soft text-info-hover border-info-soft-border hover:bg-info-soft-hover active:bg-info-soft-border',
  default:   'bg-surface text-ink-3 border-line hover:bg-canvas active:bg-surface-2 shadow-xs',
};

@Component({
  selector: 'ui-table',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, BadgeComponent, IconComponent, DropdownComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent<T extends Record<string, any> = Record<string, any>> {
  @Input() columns: TableColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() loading = false;
  @Input() selectable = false;
  @Input() selectedRows: T[] = [];
  @Input() actions: TableAction<T>[] = [];
  @Input() actionsLayout: TableActionsLayout = 'dropdown';
  @Input() actionsTriggerIcon = '@tui.ellipsis-vertical';
  @Input() actionsTriggerVariant: DropdownTriggerVariant = 'ghost';
  @Input() actionsMenuTitle = '';
  @Input() actionsColumnTitle = 'Acciones';
  @Input() emptyMessage = 'No se encontraron registros';
  @Input() trackByKey = '';
  @Input() skeletonCount = 5;
  @Input() fullHeight = false;

  @HostBinding('class.h-full')
  @HostBinding('class.flex-1')
  get isFullHeight(): boolean {
    return this.fullHeight;
  }

  @Output() selectionChange = new EventEmitter<T[]>();
  @Output() actionClick = new EventEmitter<{ row: T; action: TableAction<T>; index: number }>();

  readonly skeletonWidths = ['w-16', 'w-24', 'w-32', 'w-40', 'w-28'];

  get skeletonRows(): number[] {
    return Array.from({ length: this.skeletonCount }, (_, i) => i);
  }

  get isAllSelected(): boolean {
    return this.data.length > 0 && this.selectedRows.length === this.data.length;
  }

  get isSomeSelected(): boolean {
    return this.selectedRows.length > 0 && !this.isAllSelected;
  }

  get useDropdownLayout(): boolean {
    if (this.actionsLayout === 'buttons') return false;
    if (this.actionsLayout === 'dropdown') return true;
    return this.actions.length > 1;
  }

  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectionChange.emit(checked ? [...this.data] : []);
  }

  toggleRow(row: T): void {
    const idx = this.findIndex(row);
    const updated = idx > -1
      ? this.selectedRows.filter((_, i) => i !== idx)
      : [...this.selectedRows, row];
    this.selectionChange.emit(updated);
  }

  isSelected(row: T): boolean {
    return this.findIndex(row) > -1;
  }

  getValue(row: T, col: TableColumn<T>): any {
    return row[col.key];
  }

  isPrimaryColumn(col: TableColumn<T>): boolean {
    return col.key === this.columns[0]?.key;
  }

  getActionClass(action: TableAction<T>): string {
    return [ACTION_BASE, ACTION_VARIANT[action.variant ?? 'primary'] || ACTION_VARIANT['primary']].join(' ');
  }

  isActionDisabled(action: TableAction<T>, row: T): boolean {
    return typeof action.disabled === 'function' ? action.disabled(row) : !!action.disabled;
  }

  getRowDropdownItems(row: T): DropdownItem<T>[] {
    return this.actions.map((action, index) => {
      const badge = typeof action.badge === 'function' ? action.badge(row) : action.badge;
      const badgeVariant = typeof action.badgeVariant === 'function' ? action.badgeVariant(row) : action.badgeVariant;
      const disabled = typeof action.disabled === 'function' ? action.disabled(row) : !!action.disabled;
      const hidden = action.hidden ? action.hidden(row) : false;

      return {
        id: String(index),
        label: action.label,
        icon: action.icon,
        description: action.description,
        variant: (action.variant as any) || 'default',
        badge,
        badgeVariant,
        disabled,
        hidden,
        divider: action.divider,
        data: row,
      };
    });
  }

  onDropdownItemClick(row: T, item: DropdownItem<T>): void {
    const index = item.id ? parseInt(item.id, 10) : -1;
    const action = index >= 0 && index < this.actions.length ? this.actions[index] : null;

    if (action) {
      if (action.onClick) {
        action.onClick(row);
      }
      this.actionClick.emit({ row, action, index });
    }
  }

  trackRow(_index: number, row: T): any {
    return this.trackByKey ? row[this.trackByKey] : row;
  }

  randomSkeletonWidth(): string {
    return this.skeletonWidths[Math.floor(Math.random() * this.skeletonWidths.length)];
  }

  private findIndex(row: T): number {
    if (this.trackByKey) {
      return this.selectedRows.findIndex(r => r[this.trackByKey] === row[this.trackByKey]);
    }
    return this.selectedRows.indexOf(row);
  }
}
