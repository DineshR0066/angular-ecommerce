import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/authService';
import { SnackbarService } from '../../../shared/components/snackbar/snackbar.service';
import { I18nService } from '../../../core/services/i18n.service';
import { ForgotPasswordSchema } from '../schemas/auth.schemas';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css',
})
export class ForgetPassword implements OnInit {
  forgotForm!: FormGroup;
  isSubmitting = false;

  readonly t: I18nService['t'];
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly snackbar = inject(SnackbarService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly i18n = inject(I18nService);

  constructor() {
    this.t = this.i18n.t.bind(this.i18n);
  }

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    const parsed = ForgotPasswordSchema.safeParse(this.forgotForm.value);
    if (!parsed.success) {
      this.snackbar.error(this.t('auth.forgotPassword.error'));
      return;
    }

    this.isSubmitting = true;
    this.authService
      .forgotPassword(parsed.data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackbar.success(this.t('auth.forgotPassword.success'));
          this.isSubmitting = false;
        },
        error: () => {
          // Security: same message regardless of whether email exists
          this.snackbar.info(this.t('auth.forgotPassword.success'));
          this.isSubmitting = false;
        },
      });
  }
}
