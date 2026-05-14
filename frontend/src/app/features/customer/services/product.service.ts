import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product, ProductSchema } from '../../../shared/models/product.model';
import { z } from 'zod';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);

  getProducts(limit: number = 100, page: number = 0): Observable<Product[]> {
    return this.http.get<Product[]>('users/products', {
      params: { limit: limit.toString(), page: page.toString() },
    }).pipe(map(data => z.array(ProductSchema).parse(data)));
  }

  searchProducts(query: string, limit: number = 100, page: number = 0): Observable<Product[]> {
    return this.http.get<Product[]>(`users/catalog/${query}`, {
      params: { limit: limit.toString(), page: page.toString() },
    }).pipe(map(data => z.array(ProductSchema).parse(data)));
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>('users/all-category').pipe(
      map(data => z.array(z.string()).parse(data))
    );
  }

  getProductsByCategory(category: string, limit: number = 100, page: number = 1): Observable<Product[]> {
    return this.http.get<Product[]>(`users/category/${category}`, {
      params: { limit: limit.toString(), page: page.toString() },
    }).pipe(map(data => z.array(ProductSchema).parse(data)));
  }
}
