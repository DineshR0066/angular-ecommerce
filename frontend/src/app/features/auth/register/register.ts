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
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/authService';
import { SnackbarService } from '../../../shared/components/snackbar/snackbar.service';
import { I18nService } from '../../../core/services/i18n.service';
import { RegisterSchema } from '../schemas/auth.schemas';

import { ButtonComponent } from '../../../shared/components/button/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  showPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

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
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        zip_code: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
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
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const raw = { ...this.registerForm.value, zip_code: Number(this.registerForm.value.zip_code) };
    const parsed = RegisterSchema.safeParse(raw);

    if (!parsed.success) {
      this.snackbar.error(this.t('auth.register.error'));
      return;
    }

    const { confirmPassword: _, ...payload } = parsed.data;
    this.isSubmitting.set(true);

    this.authService
      .register(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackbar.success(this.t('auth.register.success'));
          this.router.navigate(['/auth/login']);
        },
        error: () => {
          this.snackbar.error(this.t('auth.register.error'));
          this.isSubmitting.set(false);
        },
      });
  }
}
