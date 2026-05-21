/**
 * Minimal i18n service — reads from a flat key map.
 * Swap internals for angular-i18next or @ngx-translate without touching consumers.
 */
import { Injectable, signal } from '@angular/core';

export type TranslationKey = string;

const EN: Readonly<Record<string, string>> = {
  // ─── Auth ─────────────────────────────────────────────────────────────────
  'auth.login.title': 'Login',
  'auth.login.subtitle': 'Enter your details below to continue.',
  'auth.login.submitBtn': 'Login',
  'auth.login.forgotPassword': 'Forgot password?',
  'auth.login.noAccount': "Don't have an account?",
  'auth.login.getStarted': 'Get started',
  'auth.login.success': 'Login successful! Redirecting…',
  'auth.login.error': 'Invalid email or password. Please try again.',

  'auth.register.title': 'Sign Up',
  'auth.register.subtitle': 'Create your account to start shopping.',
  'auth.register.submitBtn': 'Sign Up',
  'auth.register.haveAccount': 'Already have an account?',
  'auth.register.login': 'Login',
  'auth.register.success': 'Account created successfully! Please login.',
  'auth.register.error': 'Registration failed. Please try again.',

  'auth.forgotPassword.title': 'Forgot Password',
  'auth.forgotPassword.subtitle':
    'Please enter the email address associated with your account and we will email you a password reset link.',
  'auth.forgotPassword.submitBtn': 'Send Reset Link',
  'auth.forgotPassword.sending': 'Sending…',
  'auth.forgotPassword.returnLogin': 'Return to login',
  'auth.forgotPassword.success':
    'If an account exists for this email, a reset link will be sent.',
  'auth.forgotPassword.error': 'Something went wrong. Please try again.',

  'auth.resetPassword.title': 'Reset Password',
  'auth.resetPassword.subtitle': 'Please enter your new password below.',
  'auth.resetPassword.submitBtn': 'Reset Password',
  'auth.resetPassword.resetting': 'Resetting…',
  'auth.resetPassword.returnLogin': 'Return to login',
  'auth.resetPassword.success':
    'Your password has been successfully reset. Redirecting to login…',
  'auth.resetPassword.error':
    'Failed to reset password. The link might be expired.',
  'auth.resetPassword.invalidLink':
    'Invalid password reset link. Please request a new one.',

  // ─── Form Fields ───────────────────────────────────────────────────────────
  'auth.fields.email': 'Email address',
  'auth.fields.username': 'Username',
  'auth.fields.password': 'Password',
  'auth.fields.confirmPassword': 'Confirm Password',
  'auth.fields.newPassword': 'New Password',
  'auth.fields.confirmNewPassword': 'Confirm New Password',
  'auth.fields.zipCode': 'Zip Code',
  'auth.fields.city': 'City',
  'auth.fields.state': 'State',

  // ─── Validation errors ────────────────────────────────────────────────────
  'auth.errors.emailRequired': 'Email is required.',
  'auth.errors.emailInvalid': 'Please enter a valid email.',
  'auth.errors.passwordRequired': 'Password is required.',
  'auth.errors.passwordMinLength': 'Minimum length is 6 characters.',
  'auth.errors.confirmPasswordRequired': 'Please confirm your password.',
  'auth.errors.passwordMismatch': 'Passwords must match.',
  'auth.errors.usernameRequired': 'Username is required.',
  'auth.errors.zipRequired': 'Zip Code is required.',
  'auth.errors.cityRequired': 'City is required.',
  'auth.errors.stateRequired': 'State is required.',

  // ─── Brand ────────────────────────────────────────────────────────────────
  'brand.name': 'Ecom',
  'brand.nameLine2': 'website',
  'brand.tagline': 'Click. Shop. Enjoy. Your curated marketplace for everything you need.',
  'brand.logoLetter': 'E',
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly locale = signal<'en'>('en');
  private readonly dict: Readonly<Record<string, string>> = EN;

  t(key: TranslationKey, params?: Record<string, string>): string {
    let value = this.dict[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replace(`{{${k}}}`, v);
      }
    }
    return value;
  }

  get currentLocale(): 'en' {
    return this.locale();
  }
}
