import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { AuthService } from '../../auth/services/authService';
// import { Cart } from '../schema/customer.schema';
import { Product } from '../../../shared/models/product.model';
import { SnackbarService } from '../../../shared/components/snackbar/snackbar.service';
import { BuyNowModal } from '../../../shared/components/buy-now-modal/buy-now-modal';
import { ButtonComponent } from '../../../shared/components/button/button';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, BuyNowModal, ButtonComponent],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class CartComponent implements OnInit {
  isLoading = signal<boolean>(false);
  cartItems = signal<Product[]>([]);
  errorMessage = signal<string | null>(null);
  buyNowProduct = signal<Product | null>(null);

  private readonly authService = inject(AuthService);
  private readonly prodService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly snackbar = inject(SnackbarService);


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
        const mappedCart: Product[] = data.map((item) => ({
          _id: item._id,
          product_id: item.product_id,
          seller_id: item.seller_id,
          product_category_name: item.product_category_name,
          product_name: item.product_name,
          product_image_url: item.product_image_url,
          price: item.price,
          product_qty: item.product_qty,
          quantity: item.quantity,
          is_deleted: item.is_deleted,
        }));
        // console.log(data);
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
    closeBuyNowModal() {
    this.buyNowProduct.set(null);
    document.body.style.overflow = 'auto';
  }

  onConfirmPurchase(orderData: any) {
    const user = this.authService.currentUser();
    if (!user) {
      this.snackbar.show('Please login to place an order');
      return;
    }

    const payload = {
      ...orderData,
      customer_id: user.user_id
    };

    this.prodService.buyProduct(payload).subscribe({
      next: () => {
        this.snackbar.show('Order placed successfully!');
        this.closeBuyNowModal();
        // Update local stock if needed or refresh
      },
      error: (err) => {
        this.snackbar.show(err.error?.message || 'Failed to place order');
      }
    });
  }


  getItemTotal(item: Product): number {
    return item.price * item.quantity!;
  }

  buyNow(item: Product) {
    this.buyNowProduct.set(item);
  }

  remove(product_id: string) {
    const user = this.authService.currentUser();
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.prodService.removeFromCart(user.user_id, product_id).subscribe({
      next: () => {
        this.snackbar.show('Item removed from cart');
        this.loadCart();
      },
      error: (err) => {
        this.snackbar.show(err.error?.message || 'Failed to remove item');
      }
    });
  }

}
