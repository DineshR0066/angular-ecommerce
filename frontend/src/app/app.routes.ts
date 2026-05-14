import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { ForgetPassword } from './features/auth/forget-password/forget-password';
import { ResetPassword } from './features/auth/reset-password/reset-password';
import { Dashboard } from './features/customer/dashboard/dashboard';
import { Home } from './features/customer/home/home';

export const routes: Routes = [{
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: Home
  }, 
  {
    path: 'auth',
    children: [{
      path: 'login',
      component: Login,
    },
    {
      path: 'register',
      component: Register,
    },
    {
      path: 'forget-password',
      component: ForgetPassword
    },
    {
      path: 'reset-password',
      component: ResetPassword
    }],
  }, 
  {
    path: '**',
    redirectTo: 'home'
  }
];
