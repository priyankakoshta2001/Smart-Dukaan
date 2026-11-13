import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of } from "rxjs";
import { environment } from "../../../environments/environment";

export interface ApiProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  minimumOrderQuantity?: number;
  availabilityStatus?: string;
  images: string[];
  thumbnail: string;
}

export interface ApiCategory {
  slug: string;
  name: string;
  url: string;
}

/**
 * Live catalogue feed. DummyJSON is a free, key-less ecommerce API with
 * products, categories, carts, users and auth — we use the product feed and
 * layer Smart Dukaan's local-shop experience on top of it.
 */
@Injectable({ providedIn: "root" })
export class CatalogApi {
  private readonly http = inject(HttpClient);

  all(): Observable<ApiProduct[]> {
    return this.http
      .get<{ products: ApiProduct[] }>(`${environment.apiUrl}/products?limit=200`)
      .pipe(
        map((response) => response.products),
        catchError(() => of([])),
      );
  }

  byId(id: number): Observable<ApiProduct | null> {
    return this.http
      .get<ApiProduct>(`${environment.apiUrl}/products/${id}`)
      .pipe(catchError(() => of(null)));
  }

  search(query: string, limit = 12): Observable<ApiProduct[]> {
    return this.http
      .get<{ products: ApiProduct[] }>(
        `${environment.apiUrl}/products/search?q=${encodeURIComponent(query)}&limit=${limit}`,
      )
      .pipe(
        map((response) => response.products),
        catchError(() => of([])),
      );
  }

  categories(): Observable<ApiCategory[]> {
    return this.http
      .get<ApiCategory[]>(`${environment.apiUrl}/products/categories`)
      .pipe(catchError(() => of([])));
  }
}
