import { Component, signal, inject } from '@angular/core';
import { RouterLink, Router, RouterLinkActive } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button';
import { AuthService } from '../../features/auth/services/authService';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ButtonComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isDarkMode = signal(true);
  currentUser = this.authService.currentUser;

  toggleTheme() {
    this.isDarkMode.update(v => !v);
    document.body.classList.toggle('light-theme');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
