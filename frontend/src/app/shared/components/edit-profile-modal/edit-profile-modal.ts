import { Component, input, output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ButtonComponent } from '../button/button';

@Component({
  selector: 'app-edit-profile-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './edit-profile-modal.html',
  styleUrl: './edit-profile-modal.scss',
})
export class EditProfileModalComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  
  readonly user = input.required<any>();
  close = output<void>();
  save = output<any>();

  editForm!: FormGroup;
  showCurrentPassword = false;
  showNewPassword = false;

  ngOnInit() {
    this.editForm = this.fb.group({
      currentPassword: [''],
      newPassword: [''],
      address: [''],
      city: [''],
      state: [''],
      zip_code: [''],
    });
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    const formValue = this.editForm.value;
    const data: any = {};

    if (formValue.currentPassword && formValue.newPassword) {
      data.currentPassword = formValue.currentPassword;
      data.newPassword = formValue.newPassword;
    }

    if (formValue.address && formValue.city && formValue.state && formValue.zip_code) {
      data.address = {
        address_line: formValue.address,
        city: formValue.city,
        state: formValue.state,
        zip_code: formValue.zip_code,
      };
    }

    if (Object.keys(data).length > 0) {
      this.save.emit(data);
    } else {
      this.onClose();
    }
  }

  toggleCurrentPassword() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }
}
