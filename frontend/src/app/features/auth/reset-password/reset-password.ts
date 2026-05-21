import { Component, OnInit, inject, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../services/authService';
import { SnackbarService } from '../../../shared/components/snackbar/snackbar.service';
import { I18nService } from '../../../core/services/i18n.service';
import { ResetPasswordSchema } from '../schemas/auth.schemas';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword implements OnInit {
  resetForm!: FormGroup;
  showPassword = signal<Boolean>(false);
  showConfirmPassword = signal<Boolean>(false);
  isSubmitting = signal<Boolean>(false);

  private email = signal<String>('');
  private token = signal<String>('');

  readonly t: I18nService['t'];
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackbar = inject(SnackbarService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly i18n = inject(I18nService);

  constructor() {
    this.t = this.i18n.t.bind(this.i18n);
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.email.set((params['email'] as string) || '');
      this.token.set((params['token'] as string) || '');

      if (!this.email() || !this.token()) {
        this.snackbar.error(this.t('auth.resetPassword.invalidLink'));
      }
    });

    this.resetForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      const confirmCtrl = control.get('confirmPassword');
      if (confirmCtrl?.hasError('passwordMismatch')) {
        delete confirmCtrl.errors?.['passwordMismatch'];
        if (Object.keys(confirmCtrl.errors || {}).length === 0) {
          confirmCtrl.setErrors(null);
        }
      }
      return null;
    }
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword.update((value)=>!value);
    } else {
      this.showConfirmPassword.update((value)=>!value);
    }
  }

  onSubmit(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    if (!this.email || !this.token) {
      this.snackbar.error(this.t('auth.resetPassword.invalidLink'));
      return;
    }

    const parsed = ResetPasswordSchema.safeParse(this.resetForm.value);
    if (!parsed.success) {
      this.snackbar.error(this.t('auth.resetPassword.error'));
      return;
    }

    this.isSubmitting.set(true);
    this.authService
      .resetPassword({ email: this.email, token: this.token, newPassword: parsed.data.password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackbar.success(this.t('auth.resetPassword.success'));
          setTimeout(() => this.router.navigate(['/auth/login']), 3000);
        },
        error: () => {
          this.snackbar.error(this.t('auth.resetPassword.error'));
          this.isSubmitting.set(false);
        },
      });
  }
}
