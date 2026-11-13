import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { COUPONS, shopsForCity } from "../data/catalog";
import type { CartGroup, CartLine, Coupon, Product } from "../models";
import { LocationService } from "./location.service";

const CART_KEY = "smartdukaan.cart.v2";
const COUPON_KEY = "smartdukaan.coupon.v2";

@Injectable({ providedIn: "root" })
export class CartService {
  private readonly location = inject(LocationService);
  private readonly lines = signal<CartLine[]>(this.restore());

  readonly items = this.lines.asReadonly();
  readonly drawerOpen = signal(false);
  readonly couponCode = signal<string>(localStorage.getItem(COUPON_KEY) ?? "");
  readonly couponMessage = signal("");

  readonly rows = computed<CartLine[]>(() =>
    this.lines().filter((line) => line.qty > 0 && line.product.stock > 0),
  );

  readonly groups = computed<CartGroup[]>(() => {
    const map = new Map<string, CartLine[]>();
    for (const line of this.rows()) {
      const list = map.get(line.product.shopSlug) ?? [];
      list.push(line);
      map.set(line.product.shopSlug, list);
    }
    return [...map.entries()]
      .map(([shopSlug, lines]) => {
        const shop = shopsForCity(this.location.city()).find((item) => item.slug === shopSlug);
        if (!shop) return null;
        const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);
        const mrp = lines.reduce((sum, line) => sum + line.product.mrp * line.qty, 0);
        return {
          shop,
          lines,
          subtotal,
          mrp,
          count: lines.reduce((sum, line) => sum + line.qty, 0),
        };
      })
      .filter((group): group is CartGroup => group !== null);
  });

  readonly count = computed(() => this.rows().reduce((sum, line) => sum + line.qty, 0));
  readonly shopCount = computed(() => this.groups().length);
  readonly subtotal = computed(() => this.rows().reduce((sum, line) => sum + line.product.price * line.qty, 0));
  readonly mrpTotal = computed(() => this.rows().reduce((sum, line) => sum + line.product.mrp * line.qty, 0));
  readonly savings = computed(() => this.mrpTotal() - this.subtotal());
  readonly coupon = computed<Coupon | undefined>(() =>
    COUPONS.find((item) => item.code === this.couponCode()),
  );

  readonly discount = computed(() => {
    const coupon = this.coupon();
    const subtotal = this.subtotal();
    if (!coupon || subtotal < coupon.min) return 0;
    let value = coupon.flat ?? 0;
    if (coupon.percent) value = Math.round((subtotal * coupon.percent) / 100);
    if (coupon.max) value = Math.min(value, coupon.max);
    return Math.min(value, subtotal);
  });

  readonly deliveryFee = computed(() => (this.subtotal() === 0 ? 0 : this.subtotal() >= 499 ? 0 : 29));
  readonly total = computed(() => Math.max(0, this.subtotal() - this.discount() + this.deliveryFee()));
  readonly freeDeliveryGap = computed(() => Math.max(0, 499 - this.subtotal()));
  readonly freeDeliveryProgress = computed(() => Math.min(100, (this.subtotal() / 499) * 100));
  readonly savingsTotal = computed(() => this.savings() + this.discount());

  constructor() {
    effect(() => localStorage.setItem(CART_KEY, JSON.stringify(this.lines())));
    effect(() => {
      const code = this.couponCode();
      if (code) localStorage.setItem(COUPON_KEY, code);
      else localStorage.removeItem(COUPON_KEY);
    });
  }

  qty(id: number): number {
    return this.lines().find((line) => line.product.id === id)?.qty ?? 0;
  }

  has(id: number): boolean {
    return this.qty(id) > 0;
  }

  add(product: Product, qty = 1): void {
    this.couponMessage.set("");
    this.lines.update((lines) => {
      const existing = lines.find((line) => line.product.id === product.id);
      const max = Math.max(1, Math.min(product.stock || 99, 20));
      if (existing) {
        return lines.map((line) =>
          line.product.id === product.id
            ? { ...line, qty: Math.min(line.qty + qty, max), product }
            : line,
        );
      }
      return [...lines, { product, qty: Math.min(Math.max(1, qty), max) }];
    });
  }

  increment(id: number): void {
    const product = this.lines().find((line) => line.product.id === id)?.product;
    const max = Math.max(1, Math.min(product?.stock ?? 99, 20));
    this.lines.update((lines) =>
      lines.map((line) =>
        line.product.id === id ? { ...line, qty: Math.min(line.qty + 1, max) } : line,
      ),
    );
  }

  decrement(id: number): void {
    this.lines.update((lines) =>
      lines
        .map((line) => (line.product.id === id ? { ...line, qty: line.qty - 1 } : line))
        .filter((line) => line.qty > 0),
    );
  }

  remove(id: number): void {
    this.lines.update((lines) => lines.filter((line) => line.product.id !== id));
  }

  clear(): void {
    this.lines.set([]);
    this.couponCode.set("");
    this.couponMessage.set("");
  }

  applyCoupon(raw: string): boolean {
    const code = raw.trim().toUpperCase();
    const coupon = COUPONS.find((item) => item.code === code);
    if (!coupon) {
      this.couponMessage.set("Yeh coupon valid nahi hai. Try SMART50 or FRESH20.");
      return false;
    }
    if (this.subtotal() < coupon.min) {
      this.couponMessage.set(`Add ₹${coupon.min - this.subtotal()} more to unlock ${code}.`);
      return false;
    }
    this.couponCode.set(code);
    this.couponMessage.set(`${code} applied — you saved ₹${this.discount()}!`);
    return true;
  }

  removeCoupon(): void {
    this.couponCode.set("");
    this.couponMessage.set("");
  }

  openDrawer(): void {
    this.drawerOpen.set(true);
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
  }

  private restore(): CartLine[] {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const parsed = raw ? (JSON.parse(raw) as CartLine[]) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(
        (line) =>
          line &&
          typeof line.qty === "number" &&
          line.qty > 0 &&
          line.product &&
          typeof line.product.id === "number",
      );
    } catch {
      return [];
    }
  }
}
