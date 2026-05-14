import { Component, OnInit, inject, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/authService';
import { SnackbarService } from '../../../shared/components/snackbar/snackbar.service';
import { I18nService } from '../../../core/services/i18n.service';
import { LoginSchema } from '../schemas/auth.schemas';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  // ── Public state (template-bound) ────────────────────────────────────────
  loginForm!: FormGroup;
  showPassword = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  // ── Services ──────────────────────────────────────────────────────────────
  readonly t: I18nService['t'];
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackbar = inject(SnackbarService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly i18n = inject(I18nService);

  constructor() {
    this.t = this.i18n.t.bind(this.i18n);
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
        next: () => {
          this.snackbar.success(this.t('auth.login.success'));
          setTimeout(() => {
            this.router.navigate(['dashboard']);
          }, 1500);
        },
        error: () => {
          this.snackbar.error(this.t('auth.login.error'));
          this.isSubmitting.set(false);
        },
      });
  }
}
