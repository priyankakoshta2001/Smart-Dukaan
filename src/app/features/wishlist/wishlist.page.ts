import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CartService } from "../../core/services/cart.service";
import { CatalogService } from "../../core/services/catalog.service";
import { ToastService } from "../../core/services/toast.service";
import { WishlistService } from "../../core/services/wishlist.service";
import { IconComponent } from "../../shared/icon/icon.component";
import { ProductCardComponent } from "../../shared/product-card/product-card.component";

@Component({
  selector: "app-wishlist-page",
  standalone: true,
  imports: [RouterLink, IconComponent, ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./wishlist.page.html",
})
export class WishlistPage {
  readonly wishlist = inject(WishlistService);
  private readonly catalog = inject(CatalogService);
  private readonly cart = inject(CartService);
  private readonly toast = inject(ToastService);

  readonly products = this.wishlist.items;
  readonly count = this.wishlist.count;

  readonly basketValue = computed(() =>
    this.products().reduce((sum, product) => sum + product.price, 0),
  );
  readonly savings = computed(() =>
    this.products().reduce((sum, product) => sum + (product.mrp - product.price), 0),
  );
  readonly inBasket = computed(() =>
    this.products().filter((product) => this.cart.has(product.id)).length,
  );

  readonly recommended = computed(() =>
    this.catalog
      .products()
      .filter((product) => !this.wishlist.has(product.id))
      .sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)
      .slice(0, 5),
  );

  readonly perks = [
    { icon: "heart", title: "Saved for later", copy: "Your wishlist stays on this device, even after you close the tab." },
    { icon: "zap", title: "Price drop watch", copy: "We'll flag it when a saved item gets cheaper. No spam." },
    { icon: "bag", title: "One-tap basket", copy: "Move everything to your basket the moment you're ready." },
  ];

  moveAll(): void {
    const items = this.products();
    if (items.length === 0) return;
    for (const product of items) {
      this.cart.add(product);
    }
    this.wishlist.clear();
    this.toast.show(`${items.length} ${items.length === 1 ? "item" : "items"} moved to your basket`);
    this.cart.openDrawer();
  }

  clearAll(): void {
    if (this.products().length === 0) return;
    this.wishlist.clear();
    this.toast.show("Wishlist cleared", "info");
  }
}
