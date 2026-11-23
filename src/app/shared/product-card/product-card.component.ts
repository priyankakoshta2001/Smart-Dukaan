import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import type { Product } from "../../core/models";
import { CartService } from "../../core/services/cart.service";
import { CatalogService } from "../../core/services/catalog.service";
import { ToastService } from "../../core/services/toast.service";
import { WishlistService } from "../../core/services/wishlist.service";
import { IconComponent } from "../icon/icon.component";
import { RatingStarsComponent } from "../rating-stars/rating-stars.component";

@Component({
  selector: "app-product-card",
  standalone: true,
  imports: [RouterLink, IconComponent, RatingStarsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./product-card.component.html",
  host: { class: "block min-w-0" },
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly compact = input(false);

  readonly cart = inject(CartService);
  readonly wishlist = inject(WishlistService);
  private readonly catalog = inject(CatalogService);
  private readonly toast = inject(ToastService);

  readonly discount = computed(() =>
    Math.max(0, Math.round(((this.product().mrp - this.product().price) / this.product().mrp) * 100)),
  );

  readonly shopName = computed(
    () => this.catalog.shop(this.product().shopSlug)?.name ?? "Nearby shop",
  );

  add(): void {
    this.cart.add(this.product());
    this.toast.show(`${this.product().title} added to cart`);
  }

  increment(): void {
    this.cart.increment(this.product().id);
  }

  decrement(): void {
    this.cart.decrement(this.product().id);
  }

  toggleWishlist(): void {
    const added = this.wishlist.toggle(this.product());
    this.toast.show(
      added ? `${this.product().title} saved to wishlist` : "Removed from wishlist",
      added ? "success" : "info",
    );
  }
}
