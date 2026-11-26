import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AUTH_CONFIG, DEFAULT_AUTH_CONFIG } from '../tokens/auth.token';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReauthService {
  private router = inject(Router);
  private authService = inject(AuthService);
  private config = inject(AUTH_CONFIG, { optional: true });

  private readonly isOpenSubject = new BehaviorSubject<boolean>(false);
  readonly isOpen$ = this.isOpenSubject.asObservable();

  private reauthResultSubject: Subject<boolean> | null = null;

  get isOpen(): boolean {
    return this.isOpenSubject.getValue();
  }

  promptReauth(): Observable<boolean> {
    if (this.reauthResultSubject) {
      return this.reauthResultSubject.asObservable();
    }

    this.reauthResultSubject = new Subject<boolean>();
    this.isOpenSubject.next(true);

    return this.reauthResultSubject.asObservable();
  }

  confirmReauthSuccess(): void {
    if (this.reauthResultSubject) {
      this.reauthResultSubject.next(true);
      this.reauthResultSubject.complete();
      this.reauthResultSubject = null;
    }
    this.isOpenSubject.next(false);
  }

  cancelReauth(): void {
    if (this.reauthResultSubject) {
      this.reauthResultSubject.next(false);
      this.reauthResultSubject.complete();
      this.reauthResultSubject = null;
    }
    this.isOpenSubject.next(false);

    const loginUrl = this.config?.loginRedirectUrl ?? DEFAULT_AUTH_CONFIG.loginRedirectUrl;
    this.authService.logout(true).subscribe({
      next: () => {
        this.router.navigateByUrl(loginUrl);
      },
      error: () => {
        this.router.navigateByUrl(loginUrl);
      },
    });
  }
}
