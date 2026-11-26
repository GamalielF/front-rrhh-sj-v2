import { Component, Input, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService, ReauthService } from '@lumen/auth';
import {
  InputComponent,
  ButtonComponent,
  FormComponent,
  IconComponent,
  PinInputComponent,
  QrCodeComponent,
} from '@lumen/ui';
import { ReauthStep, ActiveUserInfo } from './reauth-modal.model';
import { formatCountdownTime, CountdownTimer } from './reauth-modal.util';
import { LUMEN_BASE_CONFIG, DEFAULT_LUMEN_BASE_CONFIG } from '../../tokens';

@Component({
  selector: 'lumen-reauth-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    FormComponent,
    IconComponent,
    PinInputComponent,
    QrCodeComponent,
  ],
  templateUrl: './reauth-modal.component.html',
  styleUrls: ['./reauth-modal.component.css'],
})
export class LumenReauthModalComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private reauthService = inject(ReauthService);
  private changeDetector = inject(ChangeDetectorRef);
  private baseConfig = inject(LUMEN_BASE_CONFIG, { optional: true });
  private timer = new CountdownTimer();
  private statusSubscription?: Subscription;

  @Input() systemTitle?: string;
  @Input() systemDescription?: string;
  @Input() logoSrc?: string;
  @Input() totpTimeoutSeconds = 300;

  isOpen = false;
  step: ReauthStep = 'password';
  isLoading = false;
  errorMessage = '';
  tempAccessToken: string | null = null;
  otpauthUrl: string | null = null;
  remainingSeconds = 300;

  loginForm: FormGroup = this.formBuilder.group({
    username: [{ value: '', disabled: true }, [Validators.required]],
    password: ['', [Validators.required]],
  });

  totpForm: FormGroup = this.formBuilder.group({
    totpCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  get displaySystemTitle(): string {
    return this.systemTitle || this.baseConfig?.systemTitle || DEFAULT_LUMEN_BASE_CONFIG.systemTitle;
  }

  get displaySystemDescription(): string {
    return (
      this.systemDescription ||
      this.baseConfig?.systemDescription ||
      DEFAULT_LUMEN_BASE_CONFIG.systemDescription
    );
  }

  get displayLogoSrc(): string {
    return this.logoSrc || this.baseConfig?.logoSrc || DEFAULT_LUMEN_BASE_CONFIG.logoSrc;
  }

  get activeUser(): ActiveUserInfo {
    const user = this.authService.getUser();
    const username = user?.username || this.authService.getUsernameFromToken() || 'Usuario';
    return { username, name: (user?.['name'] as string) || '' };
  }

  get formattedRemainingTime(): string {
    return formatCountdownTime(this.remainingSeconds);
  }

  ngOnInit(): void {
    this.statusSubscription = this.reauthService.isOpen$.subscribe((isOpen) => {
      this.isOpen = isOpen;
      if (isOpen) {
        this.resetState();
      } else {
        this.timer.stop();
      }
      this.changeDetector.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.statusSubscription?.unsubscribe();
    this.timer.stop();
  }

  onSubmitPassword(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    const { username, password } = this.loginForm.getRawValue();

    this.authService.login(username, password).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.accessToken && response.tokenType) {
          this.reauthService.confirmReauthSuccess();
          this.resetState();
          return;
        }

        this.tempAccessToken = response.accessToken || null;
        this.loginForm.get('password')?.reset();
        this.step = response.otpauthUrl ? 'totp-setup' : 'totp';
        this.otpauthUrl = response.otpauthUrl || null;
        this.startTotpCountdown();
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || 'Contraseña inválida o error de conexión';
        this.changeDetector.detectChanges();
      },
    });
  }

  onSubmitTotp(): void {
    if (this.totpForm.invalid || !this.tempAccessToken) return;

    this.isLoading = true;
    this.errorMessage = '';
    const { totpCode } = this.totpForm.value;

    this.authService.verifyMfa(this.tempAccessToken, totpCode).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.accessToken) {
          this.timer.stop();
          this.reauthService.confirmReauthSuccess();
          this.resetState();
        }
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || 'Código de autenticación inválido';
        this.changeDetector.detectChanges();
      },
    });
  }

  onCancel(): void {
    this.timer.stop();
    this.reauthService.cancelReauth();
    this.resetState();
  }

  backToCredentials(): void {
    this.timer.stop();
    this.step = 'password';
    this.tempAccessToken = null;
    this.otpauthUrl = null;
    this.totpForm.reset();
    this.errorMessage = '';
    this.changeDetector.detectChanges();
  }

  private startTotpCountdown(): void {
    this.remainingSeconds = this.totpTimeoutSeconds;
    this.timer.start(
      this.totpTimeoutSeconds,
      (secs) => {
        this.remainingSeconds = secs;
        this.changeDetector.detectChanges();
      },
      () => {
        this.backToCredentials();
        this.errorMessage = 'El tiempo para ingresar el código expiró. Ingrese su contraseña nuevamente.';
        this.changeDetector.detectChanges();
      }
    );
  }

  private resetState(): void {
    this.step = 'password';
    this.tempAccessToken = null;
    this.otpauthUrl = null;
    this.errorMessage = '';
    this.isLoading = false;
    this.loginForm.patchValue({
      username: this.activeUser.username,
      password: '',
    });
    this.loginForm.get('username')?.disable();
    this.totpForm.reset();
    this.timer.stop();
  }
}
