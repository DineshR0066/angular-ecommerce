import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { ForgetPassword } from './features/auth/forget-password/forget-password';
import { ResetPassword } from './features/auth/reset-password/reset-password';
import { Dashboard } from './features/dashboard/dashboard';

export const routes: Routes = [{
    path: '',
    component: Dashboard
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
    redirectTo: 'auth/login'
  }
];
