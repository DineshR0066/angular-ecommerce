import { z } from 'zod';

// ─── Login Schema ────────────────────────────────────────────────────────────
export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, 'auth.errors.emailRequired')
    .email('auth.errors.emailInvalid'),
  password: z
    .string()
    .min(1, 'auth.errors.passwordRequired')
    .min(6, 'auth.errors.passwordMinLength'),
});

export type LoginPayload = z.infer<typeof LoginSchema>;

// ─── Register Schema ─────────────────────────────────────────────────────────
export const RegisterSchema = z
  .object({
    username: z.string().min(1, 'auth.errors.usernameRequired'),
    email: z
      .string()
      .min(1, 'auth.errors.emailRequired')
      .email('auth.errors.emailInvalid'),
    password: z
      .string()
      .min(1, 'auth.errors.passwordRequired')
      .min(6, 'auth.errors.passwordMinLength'),
    confirmPassword: z.string().min(1, 'auth.errors.confirmPasswordRequired'),
    zip_code: z.coerce
      .number()
      .min(1, 'auth.errors.zipRequired'),
    city: z.string().min(1, 'auth.errors.cityRequired'),
    state: z.string().min(1, 'auth.errors.stateRequired'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'auth.errors.passwordMismatch',
    path: ['confirmPassword'],
  });

export type RegisterPayload = z.infer<typeof RegisterSchema>;

// ─── Forgot Password Schema ───────────────────────────────────────────────────
export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'auth.errors.emailRequired')
    .email('auth.errors.emailInvalid'),
});

export type ForgotPasswordPayload = z.infer<typeof ForgotPasswordSchema>;

// ─── Reset Password Schema ────────────────────────────────────────────────────
export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'auth.errors.passwordRequired')
      .min(6, 'auth.errors.passwordMinLength'),
    confirmPassword: z.string().min(1, 'auth.errors.confirmPasswordRequired'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'auth.errors.passwordMismatch',
    path: ['confirmPassword'],
  });

export type ResetPasswordPayload = z.infer<typeof ResetPasswordSchema>;

// ─── API Response Types ───────────────────────────────────────────────────────
export interface LoginResponse {
  readonly message: string;
  readonly refresh_token?: string;
  readonly user?: {
    readonly email: string;
    readonly role: string;
    readonly user_id: string;
  };
}

export interface RegisterResponse {
  readonly message: string;
  readonly user_id: string;
  readonly email: string;
}

export interface ForgotPasswordResponse {
  readonly message: string;
}

export interface ResetPasswordResponse {
  readonly message: string;
}
