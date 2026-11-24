import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CatalogService } from "../../core/services/catalog.service";
import { LocationService } from "../../core/services/location.service";
import { IconComponent } from "../../shared/icon/icon.component";
import { PageBannerComponent } from "../../shared/page-banner/page-banner.component";
import { StoreCardComponent } from "../../shared/store-card/store-card.component";

@Component({
  selector: "app-shops-page",
  standalone: true,
  imports: [RouterLink, IconComponent, PageBannerComponent, StoreCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./shops.page.html",
})
export class ShopsPage {
  readonly catalog = inject(CatalogService);
  readonly location = inject(LocationService);

  readonly query = signal("");
  readonly maxDistance = signal(5);
  readonly sort = signal<"nearby" | "rating" | "fast">("nearby");
  readonly activeCategory = signal("all");

  readonly shops = computed(() => {
    const term = this.query().trim().toLowerCase();
    const category = this.activeCategory();
    let list = this.catalog.shopViews().filter((shop) => shop.distance <= this.maxDistance());

    if (category !== "all") {
      list = list.filter((shop) => shop.categories.includes(category));
    }

    if (term) {
      list = list.filter(
        (shop) =>
          shop.name.toLowerCase().includes(term) ||
          shop.area.toLowerCase().includes(term) ||
          shop.tagline.toLowerCase().includes(term) ||
          shop.categories.some((category) => category.includes(term)),
      );
    }

    return [...list].sort((a, b) => {
      if (this.sort() === "rating") return b.rating - a.rating;
      if (this.sort() === "fast") return a.etaMin - b.etaMin;
      return a.distance - b.distance;
    });
  });

  /** Category filter active hone par poori matching list, warna top 8. */
  readonly visibleShops = computed(() =>
    this.activeCategory() === "all" ? this.shops().slice(0, 8) : this.shops(),
  );

  readonly totalProducts = computed(() => this.catalog.products().length);
  readonly browseCategories = computed(() => {
    const order = ["grocery", "fruits-vegetables", "dairy", "snacks", "beverages", "household", "personal-care"];
    return order
      .map((slug) => this.catalog.categoryViews().find((category) => category.slug === slug))
      .filter((category) => category !== undefined);
  });
  readonly categoryShopCounts = computed(() => {
    const pool = this.catalog.shopViews().filter((shop) => shop.distance <= this.maxDistance());
    const counts: Record<string, number> = {};
    for (const category of this.browseCategories()) {
      counts[category.slug] = pool.filter((shop) => shop.categories.includes(category.slug)).length;
    }
    return counts;
  });
  readonly activeCategoryName = computed(() => {
    const slug = this.activeCategory();
    return this.browseCategories().find((category) => category.slug === slug)?.name ?? "";
  });
  readonly categoryArtwork: Record<string, string> = {
    grocery: "/assets/reference/browse-category-grocery.jpg",
    "fruits-vegetables": "/assets/reference/browse-category-fruits.jpg",
    dairy: "/assets/reference/browse-category-dairy.jpg",
    snacks: "/assets/reference/browse-category-snacks.jpg",
    beverages: "/assets/reference/browse-category-beverages.jpg",
    household: "/assets/reference/browse-category-household.jpg",
    "personal-care": "/assets/reference/browse-category-personal-care.jpg",
  };

  onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  onDistance(event: Event): void {
    this.maxDistance.set(Number((event.target as HTMLInputElement).value));
  }

  /** Category card click — same category dobara click karo toh filter hata do. */
  setCategory(slug: string): void {
    this.activeCategory.set(this.activeCategory() === slug ? "all" : slug);
  }

  clearCategory(): void {
    this.activeCategory.set("all");
  }
}
