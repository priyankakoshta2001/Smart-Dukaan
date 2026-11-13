import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { COUPONS } from "../../../core/data/catalog";
import type { Product } from "../../../core/models";
import { CatalogService } from "../../../core/services/catalog.service";
import { ToastService } from "../../../core/services/toast.service";
import { IconComponent } from "../../../shared/icon/icon.component";
import { ProductCardComponent } from "../../../shared/product-card/product-card.component";
import { StoreHeroComponent } from "../../../shared/store-hero/store-hero.component";

interface StoreDeal {
  icon: string;
  kicker: string;
  offer: string;
  detail: string;
}

@Component({
  selector: "app-store-offers-page",
  standalone: true,
  imports: [RouterLink, IconComponent, ProductCardComponent, StoreHeroComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./store-offers.page.html",
})
export class StoreOffersPage {
  readonly catalog = inject(CatalogService);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);

  readonly slug = signal("");
  readonly shop = computed(() => this.catalog.shop(this.slug()));

  readonly coupons = COUPONS;

  readonly deals = computed<StoreDeal[]>(() => {
    const shop = this.shop();
    if (!shop) return [];
    const mapped = shop.offers.map((offer, index): StoreDeal => ({
      icon: index % 2 === 0 ? "tag" : "truck",
      kicker: index === 0 ? "Opening offer" : "Running now",
      offer,
      detail: index === 0 ? `Valid on all orders from ${shop.name}` : "Auto-applies at checkout when eligible",
    }));
    mapped.push({
      icon: "zap",
      kicker: "App exclusive",
      offer: "Extra 10% OFF on selected groceries",
      detail: "For orders placed in the Smart Dukaan app",
    });
    return mapped;
  });

  readonly dealProducts = computed<Product[]>(() =>
    [...this.catalog.productsForShop(this.slug())]
      .sort((a, b) => b.mrp - b.price - (a.mrp - a.price))
      .slice(0, 8),
  );

  readonly productCount = computed(() => this.catalog.productsForShop(this.slug()).length);

  readonly totalSaved = computed(() =>
    this.dealProducts().reduce((sum, product) => sum + (product.mrp - product.price), 0),
  );

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.slug.set(params.get("slug") ?? "");
    });
  }

  copy(code: string): void {
    const done = () => this.toast.show(`Coupon ${code} copied — apply it at checkout.`);
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(code).then(done).catch(done);
    } else {
      done();
    }
  }
}
