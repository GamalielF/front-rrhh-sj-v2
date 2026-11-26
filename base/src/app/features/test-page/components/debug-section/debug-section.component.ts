import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReauthService } from '@lumen/auth';
import { CardComponent, ButtonComponent } from '@lumen/ui';

@Component({
  selector: 'app-debug-section',
  standalone: true,
  imports: [CardComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './debug-section.component.html',
  styleUrls: ['./debug-section.component.css'],
})
export class DebugSectionComponent {
  private reauthService = inject(ReauthService);

  openReauthModal(): void {
    this.reauthService.promptReauth();
  }
}
