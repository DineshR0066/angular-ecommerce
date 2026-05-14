import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../features/auth/services/authService';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to login if not authenticated
  router.navigate(['/auth/login']);
  return false;
};

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  // Redirect to home if already authenticated
  router.navigate(['/home']);
  return false;
};

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRole = route.data['role'];
  const user = authService.currentUser();

  if (authService.isAuthenticated() && user?.role === expectedRole) {
    return true;
  }

  if (user?.role === 'admin') {
    router.navigate(['/admin/dashboard']);
  } else if (user?.role === 'seller') {
    router.navigate(['/seller/dashboard']);
  } else {
    router.navigate(['/home']);
  }
  return false;
};

export const customerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUser();

  if (user?.role === 'admin') {
    router.navigate(['/admin/dashboard']);
    return false;
  }

  if (user?.role === 'seller') {
    router.navigate(['/seller/dashboard']);
    return false;
  }

  return true;
};
