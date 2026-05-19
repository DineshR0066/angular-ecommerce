import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { AuthService } from '../../auth/services/authService';
import { Cart } from '../schema/customer.schema';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class CartComponent implements OnInit {
  isLoading = signal<boolean>(false);
  cartItems = signal<Cart[]>([]);
  errorMessage = signal<string | null>(null);

  private readonly authService = inject(AuthService);
  private readonly prodService = inject(ProductService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    const user = this.authService.currentUser();

    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.prodService.getCart(user.user_id).subscribe({
      next: (data) => {
        const mappedCart: Cart[] = data.map((item: any) => ({
          id: item.product_id,
          category: item.product_category_name,
          image: item.product_image_url,
          price: item.product_price,
          productQuantity: item.product_qty,
          quantity: item.quantity,
        }));
        console.log(data);
        // console.log('Mapped Cart:', mappedCart);
        this.cartItems.set(mappedCart);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Failed to load cart');
        this.isLoading.set(false);
      },
    });
  }

  getItemTotal(item: Cart): number {
    return item.price * item.quantity;
  }
}
