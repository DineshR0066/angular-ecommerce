import { Component, OnInit, inject, signal } from '@angular/core';
import { Navbar } from '../../../layout/navbar/navbar';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { ProductModal } from '../../../shared/components/product-modal/product-modal';
import { ButtonComponent } from '../../../shared/components/button/button';
import { ProductService } from '../services/product.service';
import { Product } from '../../../shared/models/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, finalize, of } from 'rxjs';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Navbar, ProductCard, ProductModal, ButtonComponent, CommonModule, FormsModule],
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

  private fetchProducts(category: string = 'All Categories') {
    this.isLoading.set(true);
    const obs$ = category === 'All Categories' 
      ? this.productService.getProducts()
      : this.productService.getProductsByCategory(category);

    obs$.pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((data) => this.products.set(data));
  }
}
