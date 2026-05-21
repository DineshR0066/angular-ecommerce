import { Component, inject, input, output, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../models/product.model';
import { ButtonComponent } from '../button/button';
import { AuthService } from '../../../features/auth/services/authService';

@Component({
  selector: 'app-buy-now-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './buy-now-modal.html',
  styleUrl: './buy-now-modal.scss',
})
export class BuyNowModal implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly product = input.required<Product>();
  readonly close = output<void>();
  readonly confirm = output<any>();

  readonly buyForm: FormGroup;
  readonly addresses = signal<any[]>([]);
  readonly isLoadingAddresses = signal(true);

  constructor() {
    this.buyForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      payment_type: ['Credit Card', Validators.required],
      payment_installments: [1, [Validators.required, Validators.min(1)]],
      address: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.loadUserAddresses();
    
    // Update quantity validator based on stock
    this.buyForm.get('quantity')?.setValidators([
      Validators.required, 
      Validators.min(1), 
      Validators.max(this.product().product_qty)
    ]);
  }

  loadUserAddresses() {
    this.authService.getProfile().subscribe({
      next: (profile) => {
        if (profile && profile.addresses) {
          this.addresses.set(profile.addresses);
          if (profile.addresses.length > 0) {
            this.buyForm.patchValue({ address: profile.addresses[0] });
          }
        }
        this.isLoadingAddresses.set(false);
      },
      error: () => this.isLoadingAddresses.set(false)
    });
  }

  onCancel() {
    this.close.emit();
  }

  onConfirm() {
    if (this.buyForm.valid) {
      const formValue = this.buyForm.value;
      const orderData = {
        product_id: this.product().product_id,
        quantity: formValue.quantity,
        payment_type: formValue.payment_type,
        payment_installments: formValue.payment_installments,
        address: formValue.address,
      };
      this.confirm.emit(orderData);
    }
  }
}
