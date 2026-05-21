import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/services/authService';
import { ProfileTemplateComponent } from '../../../shared/components/profile-template/profile-template';
import { EditProfileModalComponent } from '../../../shared/components/edit-profile-modal/edit-profile-modal';
import { SnackbarService } from '../../../shared/components/snackbar/snackbar.service';
import { ButtonComponent } from '../../../shared/components/button/button';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ProfileTemplateComponent, EditProfileModalComponent, ButtonComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly snackbar = inject(SnackbarService);

  userProfile = signal<any>(null);
  stats = signal<any>(null);
  isEditModalOpen = signal(false);

  ngOnInit() {
    this.loadProfile();
    this.loadStats();
  }

  loadProfile() {
    this.authService.getProfile().subscribe({
      next: (profile) => this.userProfile.set(profile),
      error: (err) => {
        console.error('Failed to load profile', err);
        this.userProfile.set({ error: true });
      }
    });
  }

  loadStats() {
    this.authService.getDashboard().subscribe({
      next: (stats) => this.stats.set(stats),
      error: (err) => {
        console.error('Failed to load stats', err);
        this.stats.set({ error: true });
      }
    });
  }

  openEditModal() {
    this.isEditModalOpen.set(true);
  }

  closeEditModal() {
    this.isEditModalOpen.set(false);
  }

  logout() {
    this.authService.logout();
    window.location.href = '/auth/login';
  }

  onSaveProfile(data: any) {
    const userId = this.userProfile()?.user_id;
    if (!userId) return;

    let updateCount = 0;
    let expectedUpdates = 0;

    if (data.currentPassword && data.newPassword) expectedUpdates++;
    if (data.address) expectedUpdates++;

    const checkDone = () => {
      updateCount++;
      if (updateCount === expectedUpdates) {
        this.loadProfile();
        this.closeEditModal();
      }
    };

    if (data.currentPassword && data.newPassword) {
      this.authService.updateProfile(userId, { 
        currentPassword: data.currentPassword, 
        newPassword: data.newPassword 
      }).subscribe({
        next: () => {
          this.snackbar.show('Password updated successfully');
          checkDone();
        },
        error: (err) => {
          this.snackbar.show(err.error?.message || 'Failed to update password');
          checkDone();
        }
      });
    }

    if (data.address) {
      this.authService.addAddress(userId, data.address).subscribe({
        next: () => {
          this.snackbar.show('Address added successfully');
          checkDone();
        },
        error: (err) => {
          this.snackbar.show('Failed to add address');
          checkDone();
        }
      });
    }

    if (expectedUpdates === 0) {
      this.closeEditModal();
    }
  }
}
