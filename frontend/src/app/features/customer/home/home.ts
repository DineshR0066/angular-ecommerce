import { Component, OnInit, inject, signal } from '@angular/core';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { ProductModal } from '../../../shared/components/product-modal/product-modal';
import { ButtonComponent } from '../../../shared/components/button/button';
import { ProductService } from '../services/product.service';
import { Product } from '../../../shared/models/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, finalize, of } from 'rxjs';
import { Subject } from 'rxjs';
import { BuyNowModal } from '../../../shared/components/buy-now-modal/buy-now-modal';
import { SnackbarService } from '../../../shared/components/snackbar/snackbar.service';
import { AuthService } from '../../auth/services/authService';

import { FormatCategoryPipe } from '../../../shared/pipes/format-category.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductCard, ProductModal, BuyNowModal, ButtonComponent, CommonModule, FormsModule, FormatCategoryPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private readonly productService = inject(ProductService);

  readonly products = signal<Product[]>([]);
  readonly categories = signal<string[]>([]);
  readonly selectedCategory = signal<string>('All Categories');
  readonly isLoading = signal<boolean>(true);
  readonly selectedProduct = signal<Product | null>(null);
  readonly buyNowProduct = signal<Product | null>(null);

  private readonly snackbar = inject(SnackbarService);
  private readonly authService = inject(AuthService);

  private readonly searchSubject = new Subject<string>();

  ngOnInit() {
    this.loadCategories();
    this.setupSearch();
    this.loadInitialProducts();
  }

  loadCategories() {
    this.productService.getCategories().subscribe((data) => {
      this.categories.set(data);
    });
  }

  loadInitialProducts() {
    this.fetchProducts();
  }

  setupSearch() {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query) => {
        this.isLoading.set(true);
        if (!query) return this.productService.getProducts();
        return this.productService.searchProducts(query);
      })
    ).subscribe({
      next: (data) => {
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  selectCategory(category: string) {
    this.selectedCategory.set(category);
    this.fetchProducts(category);
  }

  openProductModal(product: Product) {
    this.selectedProduct.set(product);
    document.body.style.overflow = 'hidden';
  }

  closeProductModal() {
    this.selectedProduct.set(null);
    document.body.style.overflow = 'auto';
  }

  openBuyNowModal(product: Product) {
    this.selectedProduct.set(null);
    this.buyNowProduct.set(product);
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

    this.productService.buyProduct(payload).subscribe({
      next: () => {
        this.snackbar.show('Order placed successfully!');
        this.closeBuyNowModal();
        // Update local stock if needed or refresh
        this.fetchProducts(this.selectedCategory());
      },
      error: (err) => {
        this.snackbar.show(err.error?.message || 'Failed to place order');
      }
    });
  }

  private fetchProducts(category: string = 'All Categories') {
    this.isLoading.set(true);
    const obs$ = category === 'All Categories' 
      ? this.productService.getProducts()
      : this.productService.getProductsByCategory(category);

    obs$.pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((data) => this.products.set(data));
  }
}
