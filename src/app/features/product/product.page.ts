import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import type { Product } from "../../core/models";
import { CartService } from "../../core/services/cart.service";
import { CatalogService } from "../../core/services/catalog.service";
import { ToastService } from "../../core/services/toast.service";
import { WishlistService } from "../../core/services/wishlist.service";
import { IconComponent } from "../../shared/icon/icon.component";
import { ProductCardComponent } from "../../shared/product-card/product-card.component";
import { RatingStarsComponent } from "../../shared/rating-stars/rating-stars.component";

interface Review {
  name: string;
  initials: string;
  rating: number;
  date: string;
  text: string;
  tint: string;
}

@Component({
  selector: "app-product-page",
  standalone: true,
  imports: [RouterLink, IconComponent, ProductCardComponent, RatingStarsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./product.page.html",
})
export class ProductPage {
  readonly catalog = inject(CatalogService);
  readonly cart = inject(CartService);
  readonly wishlist = inject(WishlistService);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly slug = signal("");
  readonly qty = signal(1);
  readonly activeImage = signal(0);
  readonly tab = signal<"details" | "highlights" | "reviews">("details");

  readonly product = computed(() => this.catalog.bySlug(this.slug()));
  readonly shop = computed(() => {
    const product = this.product();
    return product ? this.catalog.shop(product.shopSlug) : undefined;
  });
  readonly related = computed(() => {
    const product = this.product();
    return product ? this.catalog.related(product, 5) : [];
  });
  readonly discount = computed(() => {
    const product = this.product();
    if (!product || product.mrp <= 0) return 0;
    return Math.max(0, Math.round(((product.mrp - product.price) / product.mrp) * 100));
  });
  readonly saved = computed(() => {
    const product = this.product();
    return product ? Math.max(0, product.mrp - product.price) : 0;
  });
  readonly activeSrc = computed(() => {
    const product = this.product();
    if (!product) return "";
    return product.images[this.activeImage()] ?? product.image;
  });

  readonly reviewSamples: Review[] = [
    {
      name: "Ritika M.",
      initials: "RM",
      rating: 5,
      date: "2 days ago",
      text: "Packed really well and delivered before the promised time. Quality was exactly like my local shop — will reorder.",
      tint: "from-brand-500 to-brand-800",
    },
    {
      name: "Sandeep J.",
      initials: "SJ",
      rating: 4,
      date: "1 week ago",
      text: "Good price and fresh stock. Delivery partner called before arriving, which was a nice touch.",
      tint: "from-brand-400 to-brand-700",
    },
    {
      name: "Ananya N.",
      initials: "AN",
      rating: 5,
      date: "2 weeks ago",
      text: "Ordered along with items from another shop and paid one delivery fee. Super convenient for monthly stock-up.",
      tint: "from-brand-600 to-brand-900",
    },
  ];

  readonly promises = [
    { icon: "shield", text: "Verified local shop" },
    { icon: "refresh", text: "24-hour replacement" },
    { icon: "truck", text: "Contactless delivery" },
  ];

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.slug.set(params.get("slug") ?? "");
      this.qty.set(1);
      this.activeImage.set(0);
      this.tab.set("details");
    });
  }

  setImage(index: number): void {
    this.activeImage.set(index);
  }

  increment(): void {
    const product = this.product();
    if (!product) return;
    this.qty.update((value) => Math.min(value + 1, Math.max(1, Math.min(product.stock || 20, 20))));
  }

  decrement(): void {
    this.qty.update((value) => Math.max(1, value - 1));
  }

  addToCart(): void {
    const product = this.product();
    if (!product) return;
    this.cart.add(product, this.qty());
    this.toast.show(`${this.qty()} × ${product.title} added to cart`);
  }

  buyNow(): void {
    const product = this.product();
    if (!product) return;
    this.cart.add(product, this.qty());
    void this.router.navigate(["/checkout"]);
  }

  toggleWishlist(): void {
    const product = this.product();
    if (!product) return;
    const added = this.wishlist.toggle(product);
    this.toast.show(added ? "Saved to wishlist" : "Removed from wishlist", added ? "success" : "info");
  }

  share(): void {
    const product = this.product();
    if (!product) return;
    void navigator.clipboard?.writeText(window.location.href);
    this.toast.show("Product link copied — share it with your neighbours!", "info");
  }

  reviewCount(product: Product): number {
    return product.reviewCount;
  }
}
