import { Injectable, inject,WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  LoginResponse,
  RegisterResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
} from '../schemas/auth.schemas';

export interface ResetPasswordApiPayload {
  readonly email: WritableSignal<String>;
  readonly token: WritableSignal<String>;
  readonly newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('auth/login', payload);
  }

  register(payload: Omit<RegisterPayload, 'confirmPassword'>): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>('auth/signup', payload);
  }

  forgotPassword(payload: ForgotPasswordPayload): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>('auth/forgot-password', payload);
  }

  resetPassword(payload: ResetPasswordApiPayload): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>('auth/reset-password', payload);
  }
}