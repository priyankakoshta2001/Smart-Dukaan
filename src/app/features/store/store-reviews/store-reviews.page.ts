import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { SHOP_OWNERS, reviewsForShop } from "../../../core/data/catalog";
import type { ShopReview } from "../../../core/models";
import { AuthService } from "../../../core/services/auth.service";
import { CatalogService } from "../../../core/services/catalog.service";
import { ToastService } from "../../../core/services/toast.service";
import { IconComponent } from "../../../shared/icon/icon.component";
import { StoreHeroComponent } from "../../../shared/store-hero/store-hero.component";

@Component({
  selector: "app-store-reviews-page",
  standalone: true,
  imports: [RouterLink, IconComponent, StoreHeroComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./store-reviews.page.html",
})
export class StoreReviewsPage {
  readonly catalog = inject(CatalogService);
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  readonly slug = signal("");
  readonly shop = computed(() => this.catalog.shop(this.slug()));

  readonly submittedReviews = signal<ShopReview[]>([]);
  readonly reviews = computed(() => reviewsForShop(this.slug()));
  readonly allReviews = computed(() => [...this.submittedReviews(), ...this.reviews()]);
  readonly productCount = computed(() => this.catalog.productsForShop(this.slug()).length);

  readonly average = computed(() => {
    const reviews = this.allReviews();
    if (!reviews.length) return this.shop()?.rating ?? 0;
    return Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10) / 10;
  });

  readonly roundedAverage = computed(() => Math.round(this.average()));

  readonly distribution = computed(() => {
    const reviews = this.allReviews();
    const total = reviews.length || 1;
    return [5, 4, 3, 2, 1].map((stars) => {
      const count = reviews.filter((review) => review.rating === stars).length;
      return { stars, count, pct: Math.round((count / total) * 100) };
    });
  });

  readonly ownerReply = computed(() => {
    const reviews = this.reviews();
    if (!reviews.length) return null;
    const owner = SHOP_OWNERS[this.slug()] ?? "The shopkeeper";
    return {
      forName: reviews[0].name,
      owner,
      text: `Dhanyavaad ${reviews[0].name.split(" ")[0]} ji! Aise customers ke bharosa hi is dukaan ki asli taakat hai. Aapki agli order me special care rahegi.`,
    };
  });

  readonly formName = signal(this.auth.user()?.name ?? "");
  readonly formRating = signal(5);
  readonly formTitle = signal("");
  readonly formText = signal("");
  readonly formError = signal("");

  readonly liked = signal<Set<string>>(new Set<string>());

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.slug.set(params.get("slug") ?? "");
    });
  }

  setRating(stars: number): void {
    this.formRating.set(stars);
  }

  onField(field: "formName" | "formTitle" | "formText", event: Event): void {
    this[field].set((event.target as HTMLInputElement | HTMLTextAreaElement).value);
  }

  markHelpful(name: string): void {
    const next = new Set(this.liked());
    if (next.has(name)) {
      next.delete(name);
    } else {
      next.add(name);
    }
    this.liked.set(next);
  }

  submitReview(event: Event): void {
    event.preventDefault();
    if (this.formName().trim().length < 2) {
      this.formError.set("Please add your name.");
      return;
    }
    if (this.formText().trim().length < 10) {
      this.formError.set("Please write at least a sentence about your experience.");
      return;
    }
    this.formError.set("");
    const name = this.formName().trim();
    const parts = name.split(/\s+/);
    const initials = parts
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
    const review: ShopReview = {
      name,
      initials: initials || "SD",
      rating: this.formRating(),
      date: "Just now",
      title: this.formTitle().trim() || "My experience",
      text: this.formText().trim(),
      tint: "from-brand-500 to-brand-700",
      helpful: 0,
      verified: this.auth.user() !== null,
    };
    this.submittedReviews.update((list) => [review, ...list]);
    this.formTitle.set("");
    this.formText.set("");
    this.toast.show("Thanks! Your review is live on this page.");
  }
}
