import { Component, input,output } from '@angular/core';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './product-modal.html',
  styleUrl: './product-modal.scss',
})
export class ProductModal {
  readonly product = input.required<Product>();
  close = output<void>();
  addToCart = output<Product>();
  buyNow = output<Product>();

  onClose() {
    this.close.emit();
  }

  onAddToCart() {
    this.addToCart.emit(this.product());
  }

  onBuyNow() {
    this.buyNow.emit(this.product());
  }
}
