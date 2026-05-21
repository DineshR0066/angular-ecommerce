import { Component, OnInit, inject, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/authService';
import { SnackbarService } from '../../../shared/components/snackbar/snackbar.service';
import { I18nService } from '../../../core/services/i18n.service';
import { LoginSchema } from '../schemas/auth.schemas';
import { ButtonComponent } from '../../../shared/components/button/button';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, TranslatePipe],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  // ── Public state (template-bound) ────────────────────────────────────────
  loginForm!: FormGroup;
  showPassword = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  // ── Services ──────────────────────────────────────────────────────────────
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackbar = inject(SnackbarService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly i18n = inject(I18nService);

  t(key: string, params?: Record<string, string>): string {
    return this.i18n.t(key, params);
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  /** Validates via Zod before hitting the API. */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const parsed = LoginSchema.safeParse(this.loginForm.value);
    if (!parsed.success) {
      this.snackbar.error(this.t('auth.login.error'));
      return;
    }

    this.isSubmitting.set(true);
    this.authService
      .login(parsed.data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.snackbar.success(this.t('auth.login.success'));
          this.authService.saveSession(response);
          
          const user = response.user;
          if (user?.role === 'admin') {
            this.router.navigate(['admin/dashboard']);
          } else if (user?.role === 'seller') {
            this.router.navigate(['seller/dashboard']);
          } else {
            this.router.navigate(['home']);
          }
        },
        error: () => {
          this.snackbar.error(this.t('auth.login.error'));
          this.isSubmitting.set(false);
        },
      });
  }
}
