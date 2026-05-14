import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button';

@Component({
  selector: 'app-profile-template',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './profile-template.html',
  styleUrl: './profile-template.scss',
})
export class ProfileTemplateComponent {
  readonly user = input.required<any>();
  readonly stats = input<any>();
  readonly editProfile = output<void>();

  onEditProfile() {
    this.editProfile.emit();
  }

  getInitials(name: string): string {
    return name ? name.charAt(0).toUpperCase() : 'U';
  }
}
