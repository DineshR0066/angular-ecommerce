import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ProductService } from '../services/product.service';
import { AuthService } from '../../auth/services/authService';
import { Router} from '@angular/router';
import { Order } from '../schema/customer.schema';

interface User {

  user_id: string,
  email: string,
  role: string,
  accessToken?: string,
  refreshToken?: string,
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  orders = signal<Order[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    const user:User|null|undefined = this.authService.currentUser();
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    };

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.productService.getOrders(user!.user_id).subscribe({
      next: (data) => {
        const mappedOrders: Order[] = data.map((item: any) => ({
          id: item.order_id,
          image: item.product_img,
          productName: item.product_name,
          orderedAt: item.order_at,
          productPrice: item.product_price,
          freight: item.freight_value,
          totalPrice: item.total_price,
          status: item.status,
          payment: item.payment_type,
          installments: item.Installation,
          estimatedDelivery: item.estimated_delivery,
        }));
        this.orders.set(mappedOrders);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.errorMessage.set('Failed to fetch your orders. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  getStatusIcon(status: string): string {
    const s = status?.toLowerCase();
    if (s === 'delivered') return '✓';
    if (s === 'pending') return '⏳';
    if (s === 'cancelled') return '✕';
    return '📦';
  }
}
