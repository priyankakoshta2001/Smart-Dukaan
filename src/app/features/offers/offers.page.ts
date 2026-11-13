import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { BANK_OFFERS, COUPONS } from "../../core/data/catalog";
import type { Coupon } from "../../core/models";
import { CartService } from "../../core/services/cart.service";
import { CatalogService } from "../../core/services/catalog.service";
import { ToastService } from "../../core/services/toast.service";
import { CountdownComponent } from "../../shared/countdown/countdown.component";
import { IconComponent } from "../../shared/icon/icon.component";
import { ProductCardComponent } from "../../shared/product-card/product-card.component";

@Component({
  selector: "app-offers-page",
  standalone: true,
  imports: [RouterLink, IconComponent, CountdownComponent, ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./offers.page.html",
})
export class OffersPage {
  readonly catalog = inject(CatalogService);
  readonly cart = inject(CartService);
  private readonly toast = inject(ToastService);

  readonly coupons = COUPONS;
  readonly bankOffers = BANK_OFFERS;
  readonly copied = signal("");

  readonly deals = computed(() =>
    [...this.catalog.products()]
      .filter((product) => product.mrp > product.price)
      .sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp)
      .slice(0, 10),
  );

  readonly steps = [
    { title: "Pick a coupon", copy: "Copy any code below or tap it to apply.", icon: "tag" },
    { title: "Add items to cart", copy: "Meet the minimum order value for that coupon.", icon: "cart" },
    { title: "Apply at checkout", copy: "Enter the code in the cart summary and save instantly.", icon: "percent" },
  ];

  /** Sabse zyada bachat dene wala coupon — us par "Best value" badge lagta hai. */
  readonly bestCode = computed(() => {
    let best = this.coupons[0];
    for (const coupon of this.coupons) {
      if (this.maxSaving(coupon) > this.maxSaving(best)) best = coupon;
    }
    return best?.code ?? "";
  });

  readonly maxSavingValue = computed(() =>
    Math.max(...this.coupons.map((coupon) => this.maxSaving(coupon))),
  );

  maxSaving(coupon: Coupon): number {
    return coupon.max ?? coupon.flat ?? 0;
  }

  copy(code: string): void {
    void navigator.clipboard?.writeText(code);
    this.copied.set(code);
    this.toast.show(`${code} copied — apply it in your cart!`);
  }

  couponTone(tone: string): string {
    if (tone === "green") return "from-brand-600 to-brand-900";
    if (tone === "lime") return "from-brand-400 to-brand-700";
    if (tone === "sun") return "from-sun-400 to-sun-600";
    return "from-brand-500 to-brand-800";
  }

  couponText(tone: string): string {
    return tone === "sun" ? "text-ink" : "text-white";
  }
}
