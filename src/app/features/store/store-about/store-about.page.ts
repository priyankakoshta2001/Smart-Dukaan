import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CATEGORIES, SHOP_OWNERS, reviewsForShop } from "../../../core/data/catalog";
import { CatalogService } from "../../../core/services/catalog.service";
import { IconComponent } from "../../../shared/icon/icon.component";
import { StoreHeroComponent } from "../../../shared/store-hero/store-hero.component";

@Component({
  selector: "app-store-about-page",
  standalone: true,
  imports: [RouterLink, IconComponent, StoreHeroComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./store-about.page.html",
})
export class StoreAboutPage {
  readonly catalog = inject(CatalogService);
  private readonly route = inject(ActivatedRoute);

  readonly slug = signal("");
  readonly shop = computed(() => this.catalog.shop(this.slug()));
  readonly owner = computed(() => SHOP_OWNERS[this.slug()] ?? "The shopkeeper");
  readonly productCount = computed(() => this.catalog.productsForShop(this.slug()).length);
  readonly reviewCount = computed(() => reviewsForShop(this.slug()).length);
  readonly yearsServing = computed(() => {
    const shop = this.shop();
    return shop ? new Date().getFullYear() - shop.since : 0;
  });

  readonly categoryCards = computed(() => {
    const shop = this.shop();
    if (!shop) return [];
    return shop.categories
      .map((slug) => CATEGORIES.find((category) => category.slug === slug))
      .filter((category): category is (typeof CATEGORIES)[number] => !!category);
  });

  readonly gallery = [
    { src: "https://cdn.dummyjson.com/products/images/groceries/Apple/1.png", label: "Fresh fruits" },
    { src: "https://cdn.dummyjson.com/products/images/groceries/Milk/1.png", label: "Daily dairy" },
    { src: "https://cdn.dummyjson.com/products/images/groceries/Rice/1.png", label: "Staples & grains" },
    { src: "https://cdn.dummyjson.com/products/images/groceries/Strawberry/1.png", label: "Seasonal picks" },
  ];

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.slug.set(params.get("slug") ?? "");
    });
  }
}
