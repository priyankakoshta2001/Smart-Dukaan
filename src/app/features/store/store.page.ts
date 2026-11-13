import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CartService } from "../../core/services/cart.service";
import { CatalogService } from "../../core/services/catalog.service";
import { IconComponent } from "../../shared/icon/icon.component";
import { ProductCardComponent } from "../../shared/product-card/product-card.component";
import { StoreHeroComponent } from "../../shared/store-hero/store-hero.component";

@Component({
  selector: "app-store-page",
  standalone: true,
  imports: [RouterLink, IconComponent, ProductCardComponent, StoreHeroComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./store.page.html",
})
export class StorePage {
  readonly catalog = inject(CatalogService);
  readonly cart = inject(CartService);
  private readonly route = inject(ActivatedRoute);

  readonly slug = signal("");
  readonly category = signal("all");
  readonly query = signal("");
  readonly sort = signal<"popular" | "price-low" | "price-high">("popular");

  readonly shop = computed(() => this.catalog.shop(this.slug()));

  readonly shopProducts = computed(() => this.catalog.productsForShop(this.slug()));

  readonly shopCategories = computed(() =>
    this.catalog.categories
      .map((category) => ({
        ...category,
        count: this.shopProducts().filter((product) => product.category === category.slug).length,
      }))
      .filter((category) => category.count > 0),
  );

  readonly results = computed(() => {
    const term = this.query().trim().toLowerCase();
    let list = this.shopProducts();
    if (this.category() !== "all") {
      list = list.filter((product) => product.category === this.category());
    }
    if (term) {
      list = list.filter(
        (product) =>
          product.title.toLowerCase().includes(term) ||
          product.brand.toLowerCase().includes(term) ||
          product.tags.some((tag) => tag.toLowerCase().includes(term)),
      );
    }
    return [...list].sort((a, b) => {
      if (this.sort() === "price-low") return a.price - b.price;
      if (this.sort() === "price-high") return b.price - a.price;
      return b.rating - a.rating;
    });
  });

  readonly otherShops = computed(() =>
    this.catalog.shopViews().filter((shop) => shop.slug !== this.slug()).slice(0, 4),
  );

  readonly highlights = [
    { icon: "shield", label: "Verified shop", copy: "Quality checked by our city team" },
    { icon: "clock", label: "30–45 min", copy: "Average delivery time" },
    { icon: "refresh", label: "Easy returns", copy: "Replacement within 24 hours" },
  ];

  readonly storeOffers = computed(() => {
    const shop = this.shop();
    if (!shop) return [];
    return [...shop.offers, "Extra 10% OFF on selected groceries"];
  });

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.slug.set(params.get("slug") ?? "");
      this.category.set("all");
      this.query.set("");
    });
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const category = params.get("category");
      if (category) this.category.set(category);
    });
  }

  onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  onSort(event: Event): void {
    this.sort.set((event.target as HTMLSelectElement).value as "popular" | "price-low" | "price-high");
  }
}
