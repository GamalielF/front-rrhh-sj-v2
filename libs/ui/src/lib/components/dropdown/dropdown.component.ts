import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ElementRef,
  HostListener,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { BadgeComponent } from '../badge/badge.component';
import {
  DropdownItem,
  DropdownPlacement,
  DropdownTriggerSize,
  DropdownTriggerVariant,
} from './dropdown.model';
import {
  TRIGGER_BASE,
  TRIGGER_VARIANTS,
  TRIGGER_SIZES,
  TRIGGER_ICON_SIZES,
} from './dropdown.variant';

@Component({
  selector: 'ui-dropdown',
  standalone: true,
  imports: [CommonModule, IconComponent, BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
})
export class DropdownComponent {
  private elementRef = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);

  @Input() items: DropdownItem[] = [];
  @Input() triggerIcon = '@tui.ellipsis-vertical';
  @Input() triggerLabel = '';
  @Input() triggerVariant: DropdownTriggerVariant = 'ghost';
  @Input() triggerSize: DropdownTriggerSize = 'sm';
  @Input() triggerClass = '';
  @Input() menuClass = '';
  @Input() menuTitle = '';
  @Input() placement: DropdownPlacement = 'bottom-end';
  @Input() disabled = false;
  @Input() closeOnClick = true;
  @Input() ariaLabel = 'Opciones';

  @Output() itemClick = new EventEmitter<DropdownItem>();
  @Output() openChange = new EventEmitter<boolean>();

  isOpen = false;

  get triggerButtonClass(): string {
    const isIconOnly = !this.triggerLabel;
    return [
      TRIGGER_BASE,
      TRIGGER_VARIANTS[this.triggerVariant] || TRIGGER_VARIANTS.ghost,
      isIconOnly
        ? (TRIGGER_ICON_SIZES[this.triggerSize] || TRIGGER_ICON_SIZES.sm)
        : (TRIGGER_SIZES[this.triggerSize] || TRIGGER_SIZES.sm),
      this.isOpen ? 'ring-2 ring-primary/30 bg-surface-2 text-ink' : '',
      this.triggerClass,
    ]
      .filter(Boolean)
      .join(' ');
  }

  get placementClass(): string {
    switch (this.placement) {
      case 'bottom-start':
        return 'left-0 top-full mt-1.5 origin-top-left';
      case 'bottom-center':
        return 'left-1/2 -translate-x-1/2 top-full mt-1.5 origin-top';
      case 'top-end':
        return 'right-0 bottom-full mb-1.5 origin-bottom-right';
      case 'top-start':
        return 'left-0 bottom-full mb-1.5 origin-bottom-left';
      case 'top-center':
        return 'left-1/2 -translate-x-1/2 bottom-full mb-1.5 origin-bottom';
      case 'bottom-end':
      default:
        return 'right-0 top-full mt-1.5 origin-top-right';
    }
  }

  get visibleItems(): DropdownItem[] {
    return this.items.filter((item) => !item.hidden);
  }

  getItemVariantClass(item: DropdownItem): string {
    if (item.disabled) {
      return 'text-subtle cursor-not-allowed opacity-60';
    }

    switch (item.variant) {
      case 'danger':
        return 'text-danger hover:bg-danger-soft hover:text-danger-hover active:bg-danger-soft-hover';
      case 'brand':
        return 'text-navy-200 hover:bg-primary-soft hover:text-navy-400 active:bg-primary-soft-hover';
      case 'primary':
        return 'text-primary hover:bg-primary-soft hover:text-primary-hover active:bg-primary-soft-hover';
      case 'warning':
        return 'text-warning hover:bg-warning-soft hover:text-warning-hover active:bg-warning-soft-hover';
      case 'info':
        return 'text-info hover:bg-info-soft hover:text-info-hover active:bg-info-soft-hover';
      case 'default':
      default:
        return 'text-ink-3 hover:bg-canvas hover:text-ink active:bg-surface-2';
    }
  }

  getItemIconClass(item: DropdownItem): string {
    if (item.disabled) return 'text-subtle';
    switch (item.variant) {
      case 'danger':
        return 'text-danger-strong';
      case 'brand':
        return 'text-navy-200';
      case 'primary':
        return 'text-primary';
      case 'warning':
        return 'text-warning-strong';
      case 'info':
        return 'text-info-strong';
      default:
        return 'text-subtle group-hover:text-ink-4';
    }
  }

  toggle(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    this.openChange.emit(this.isOpen);
    this.cdr.markForCheck();
  }

  open(): void {
    if (this.disabled || this.isOpen) return;
    this.isOpen = true;
    this.openChange.emit(true);
    this.cdr.markForCheck();
  }

  close(): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.openChange.emit(false);
    this.cdr.markForCheck();
  }

  handleItemClick(item: DropdownItem, event: MouseEvent): void {
    event.stopPropagation();
    if (item.disabled) return;

    if (this.closeOnClick) {
      this.close();
    }

    if (item.onClick) {
      item.onClick(item);
    }
    this.itemClick.emit(item);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen) return;
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) {
      this.close();
    }
  }
}
