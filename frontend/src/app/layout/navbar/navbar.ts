import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  isDarkMode = signal(true);

  toggleTheme() {
    this.isDarkMode.update(v => !v);
    document.body.classList.toggle('light-theme');
  }
}
