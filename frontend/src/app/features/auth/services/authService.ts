import { Injectable, inject, WritableSignal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../core/services/storage.service';
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
  private readonly storage = inject(StorageService);

  readonly currentUser = signal<LoginResponse['user'] | null>(this.storage.getItem('user'));

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

  saveSession(response: LoginResponse): void {
    this.storage.setItem('accessToken', response.accessToken);
    if (response.refresh_token) {
      this.storage.setItem('refreshToken', response.refresh_token);
    }
    if (response.user) {
      this.storage.setItem('user', response.user);
      this.currentUser.set(response.user);
      // Also store user detail in cookie as requested
      this.storage.setCookie('user_role', response.user.role);
      this.storage.setCookie('user_id', response.user.user_id);
    }
  }

  logout(): void {
    this.storage.removeItem('accessToken');
    this.storage.removeItem('refreshToken');
    this.storage.removeItem('user');
    this.storage.deleteCookie('user_role');
    this.storage.deleteCookie('user_id');
    this.currentUser.set(null);
  }

  isAuthenticated(): boolean {
    return !!this.storage.getItem('accessToken');
  }

  getProfile(): Observable<any> {
    return this.http.get<any>('users');
  }

  getDashboard(): Observable<any> {
    return this.http.get<any>('users/dashboard');
  }

  updateProfile(uid: string, data: any): Observable<any> {
    return this.http.patch<any>(`users/${uid}/edit`, { data });
  }

  addAddress(uid: string, data: any): Observable<any> {
    return this.http.patch<any>(`users/address/add/${uid}`, { data });
  }
}