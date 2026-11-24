import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CatalogService } from "../../core/services/catalog.service";
import { LocationService } from "../../core/services/location.service";
import { IconComponent } from "../../shared/icon/icon.component";
import { PageBannerComponent } from "../../shared/page-banner/page-banner.component";
import { ProductCardComponent } from "../../shared/product-card/product-card.component";

type SortKey = "popular" | "price-low" | "price-high" | "discount" | "rating";

@Component({
  selector: "app-shop-page",
  standalone: true,
  imports: [RouterLink, IconComponent, PageBannerComponent, ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./shop.page.html",
})
export class ShopPage {
  readonly catalog = inject(CatalogService);
  readonly location = inject(LocationService);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly search = signal("");
  readonly category = signal("all");
  readonly shopFilter = signal("all");
  readonly sort = signal<SortKey>("popular");
  readonly maxPrice = signal(600);
  readonly minRating = signal(0);
  readonly inStockOnly = signal(false);
  readonly filtersOpen = signal(false);

  readonly categories = this.catalog.categoryViews;
  readonly shops = this.catalog.shopViews;

  readonly sortOptions: Array<{ value: SortKey; label: string }> = [
    { value: "popular", label: "Most popular" },
    { value: "price-low", label: "Price: low to high" },
    { value: "price-high", label: "Price: high to low" },
    { value: "discount", label: "Biggest savings" },
    { value: "rating", label: "Top rated" },
  ];

  readonly results = computed(() => {
    const term = this.search().trim().toLowerCase();
    let list =
      this.category() === "all"
        ? [...this.catalog.products()]
        : this.catalog.productsForCategory(this.category());

    if (this.shopFilter() !== "all") {
      list = list.filter((product) => product.shopSlug === this.shopFilter());
    }
    if (term) {
      list = list.filter(
        (product) =>
          product.title.toLowerCase().includes(term) ||
          product.brand.toLowerCase().includes(term) ||
          product.tags.some((tag) => tag.toLowerCase().includes(term)),
      );
    }
    list = list.filter((product) => product.price <= this.maxPrice());
    if (this.minRating() > 0) {
      list = list.filter((product) => product.rating >= this.minRating());
    }
    if (this.inStockOnly()) {
      list = list.filter((product) => product.stock > 0);
    }

    const key = this.sort();
    return list.sort((a, b) => {
      if (key === "price-low") return a.price - b.price;
      if (key === "price-high") return b.price - a.price;
      if (key === "discount") {
        const discountA = (a.mrp - a.price) / a.mrp;
        const discountB = (b.mrp - b.price) / b.mrp;
        return discountB - discountA;
      }
      if (key === "rating") return b.rating - a.rating;
      return b.rating * 100 + b.reviewCount / 100 - (a.rating * 100 + a.reviewCount / 100);
    });
  });

  readonly categoryLabel = computed(() =>
    this.category() === "all"
      ? "All products"
      : (this.catalog.categories.find((item) => item.slug === this.category())?.name ?? "All products"),
  );

  private readonly artwork: Record<string, string> = {
    grocery: "/assets/reference/home-category-grocery.jpg",
    dairy: "/assets/reference/home-category-dairy.jpg",
    "fruits-vegetables": "/assets/reference/home-category-fruits.jpg",
    snacks: "/assets/reference/home-category-snacks.jpg",
    beverages: "/assets/reference/home-category-beverages.jpg",
    "home-care": "/assets/reference/home-category-home-care.jpg",
    "personal-care": "/assets/reference/home-category-personal-care.jpg",
    "baby-care": "/assets/reference/home-category-baby-care.jpg",
    "atta-rice-pulses": "/assets/reference/home-category-grains.jpg",
    ayurveda: "/assets/reference/home-category-ayurveda.jpg",
    household: "/assets/reference/browse-category-household.jpg",
  };

  artFor(slug: string): string {
    return this.artwork[slug] ?? "/assets/reference/nearby-basket-art.jpg";
  }

  readonly crumbs = computed(() => [
    { label: "Home", link: "/" },
    { label: "Browse by Category", link: "/shop" },
    ...(this.category() === "all" ? [] : [{ label: this.categoryLabel() }]),
  ]);

  /** Banner artwork follows the selected category. */
  readonly categoryImage = computed(() =>
    this.category() === "all" ? "/assets/reference/nearby-basket-art.jpg" : this.artFor(this.category()),
  );

  readonly hasFilters = computed(
    () =>
      this.search().trim().length > 0 ||
      this.category() !== "all" ||
      this.shopFilter() !== "all" ||
      this.minRating() > 0 ||
      this.inStockOnly() ||
      this.maxPrice() < 600,
  );

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const q = params.get("q");
      const category = params.get("category");
      const shop = params.get("shop");
      this.search.set(q ?? "");
      this.category.set(category ?? "all");
      this.shopFilter.set(shop ?? "all");
    });
  }

  onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  onPrice(event: Event): void {
    this.maxPrice.set(Number((event.target as HTMLInputElement).value));
  }

  onRating(event: Event): void {
    this.minRating.set(Number((event.target as HTMLInputElement).value));
  }

  onSort(event: Event): void {
    this.sort.set((event.target as HTMLSelectElement).value as SortKey);
  }

  selectCategory(slug: string): void {
    this.category.set(slug);
    this.syncUrl();
  }

  submitSearch(event?: Event): void {
    event?.preventDefault();
    this.syncUrl();
  }

  clearFilters(): void {
    this.search.set("");
    this.category.set("all");
    this.shopFilter.set("all");
    this.minRating.set(0);
    this.inStockOnly.set(false);
    this.maxPrice.set(600);
    this.filtersOpen.set(false);
    void this.router.navigate(["/shop"]);
  }

  private syncUrl(): void {
    const queryParams: Record<string, string> = {};
    if (this.search().trim()) queryParams["q"] = this.search().trim();
    if (this.category() !== "all") queryParams["category"] = this.category();
    void this.router.navigate(["/shop"], { queryParams });
  }
}
