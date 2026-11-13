import { computed, effect, Injectable, signal } from "@angular/core";
import type { Product } from "../models";

const KEY = "smartdukaan.wishlist.v2";

@Injectable({ providedIn: "root" })
export class WishlistService {
  readonly items = signal<Product[]>(this.restore());
  readonly count = computed(() => this.items().length);

  constructor() {
    effect(() => localStorage.setItem(KEY, JSON.stringify(this.items())));
  }

  has(id: number): boolean {
    return this.items().some((product) => product.id === id);
  }

  toggle(product: Product): boolean {
    if (this.has(product.id)) {
      this.items.update((items) => items.filter((item) => item.id !== product.id));
      return false;
    }
    this.items.update((items) => [product, ...items]);
    return true;
  }

  remove(id: number): void {
    this.items.update((items) => items.filter((product) => product.id !== id));
  }

  clear(): void {
    this.items.set([]);
  }

  private restore(): Product[] {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? (JSON.parse(raw) as Product[]) : [];
      return Array.isArray(parsed) ? parsed.filter((product) => !!product && !!product.slug) : [];
    } catch {
      return [];
    }
  }
}
