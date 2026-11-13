import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { COUPONS } from "../../core/data/catalog";
import { CartService } from "../../core/services/cart.service";
import { CatalogService } from "../../core/services/catalog.service";
import { ToastService } from "../../core/services/toast.service";
import { IconComponent } from "../../shared/icon/icon.component";
import { ProductCardComponent } from "../../shared/product-card/product-card.component";

@Component({
  selector: "app-cart-page",
  standalone: true,
  imports: [RouterLink, IconComponent, ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./cart.page.html",
})
export class CartPage {
  readonly cart = inject(CartService);
  readonly catalog = inject(CatalogService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly couponInput = signal("");
  readonly coupons = COUPONS;
  readonly freeDeliveryTarget = 499;

  readonly suggested = computed(() => {
    const inCart = new Set(this.cart.items().map((line) => line.product.id));
    return this.catalog
      .products()
      .filter((product) => !inCart.has(product.id))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  });

  readonly totalItems = computed(() => this.cart.count());
  readonly savingsPercent = computed(() => {
    const mrp = this.cart.mrpTotal();
    if (!mrp) return 0;
    return Math.round((this.cart.savingsTotal() / mrp) * 100);
  });

  applyCoupon(code?: string): void {
    if (code) this.couponInput.set(code);
    const applied = this.cart.applyCoupon(this.couponInput());
    this.toast.show(
      applied ? `${this.cart.couponCode()} applied successfully` : this.cart.couponMessage(),
      applied ? "success" : "error",
    );
    if (applied) this.couponInput.set("");
  }

  removeCoupon(): void {
    this.cart.removeCoupon();
    this.toast.show("Coupon removed", "info");
  }

  removeLine(id: number, title: string): void {
    this.cart.remove(id);
    this.toast.show(`${title} removed from cart`, "info");
  }

  clearCart(): void {
    this.cart.clear();
    this.toast.show("Cart cleared", "info");
  }

  onCouponInput(event: Event): void {
    this.couponInput.set((event.target as HTMLInputElement).value);
  }

  onCouponSubmit(event: Event): void {
    event.preventDefault();
    this.applyCoupon();
  }

  checkout(): void {
    void this.router.navigate(["/checkout"]);
  }

  percent(value: number): number {
    return Math.round(value);
  }
}
