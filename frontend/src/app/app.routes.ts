import { Routes } from '@angular/router';
import { authGuard, guestGuard, roleGuard, customerGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Customer Routes (with Navbar Layout)
  {
    path: '',
    loadComponent: () => 
      import('./layout/customer-layout/customer-layout').then(m => m.CustomerLayout),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => 
          import('./features/customer/home/home').then(m => m.Home)
      },
      {
        path: 'customer',
        canActivate: [authGuard, customerGuard],
        children: [
          {
            path: 'orders',
            loadComponent: () => 
              import('./features/customer/orders/orders').then(m => m.Orders)
          },
          {
            path: 'profile',
            loadComponent: () => 
              import('./features/customer/profile/profile').then(m => m.Profile)
          },
          {
            path: 'cart',
            loadComponent: () => 
              import('./features/customer/cart/cart').then(m => m.CartComponent)
          }
        ]
      }
    ]
  },

  // Admin Routes
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => 
          import('./features/admin/dashboard/dashboard').then(m => m.Dashboard)
      }
    ]
  },

  // Seller Routes
  {
    path: 'seller',
    canActivate: [authGuard, roleGuard],
    data: { role: 'seller' },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => 
          import('./features/seller/dashboard/dashboard').then(m => m.Dashboard)
      }
    ]
  },

  // Auth Routes
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => 
          import('./features/auth/login/login').then(m => m.Login)
      },
      {
        path: 'register',
        loadComponent: () => 
          import('./features/auth/register/register').then(m => m.Register)
      },
      {
        path: 'forget-password',
        loadComponent: () => 
          import('./features/auth/forget-password/forget-password').then(m => m.ForgetPassword)
      },
      {
        path: 'reset-password',
        loadComponent: () => 
          import('./features/auth/reset-password/reset-password').then(m => m.ResetPassword)
      }
    ]
  },

  // Wildcard Fallback
  {
    path: '**',
    redirectTo: 'home'
  }
];
