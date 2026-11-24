import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { CATEGORIES, FAQS, PARTNER_BENEFITS, STEPS, TESTIMONIALS } from "../../core/data/catalog";
import type { Product } from "../../core/models";
import { CartService } from "../../core/services/cart.service";
import { CatalogService } from "../../core/services/catalog.service";
import { LocationService } from "../../core/services/location.service";
import { PwaService } from "../../core/services/pwa.service";
import { ToastService } from "../../core/services/toast.service";
import { IconComponent } from "../../shared/icon/icon.component";
import { StoreCardComponent } from "../../shared/store-card/store-card.component";

@Component({
  selector: "app-home-page",
  standalone: true,
  imports: [
    RouterLink,
    IconComponent,
    StoreCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./home.page.html",
})
export class HomePage {
  readonly catalog = inject(CatalogService);
  readonly cart = inject(CartService);
  readonly location = inject(LocationService);
  readonly pwa = inject(PwaService);

  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly categories = this.catalog.categoryViews;
  readonly homeCategories = computed(() => {
    const order = [
      "grocery",
      "dairy",
      "fruits-vegetables",
      "snacks",
      "beverages",
      "home-care",
      "personal-care",
      "baby-care",
      "atta-rice-pulses",
      "ayurveda",
    ];
    return order
      .map((slug) => this.categories().find((category) => category.slug === slug))
      .filter((category) => category !== undefined);
  });
  readonly categoryArtwork: Record<string, string> = {
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
  };
  /** Two identical sets make the category strip loop seamlessly. The second
      set is hidden from assistive tech and keyboard navigation. */
  readonly marqueeSets = computed(() => {
    const base = [
      ...this.homeCategories().map((category) => ({
        key: category.slug,
        slug: category.slug,
        short: category.short,
        image: this.categoryArtwork[category.slug] ?? "",
      })),
      { key: "all", slug: "", short: "More Categories", image: "" },
    ];
    const build = (clone: boolean) =>
      base.map((item) => ({
        ...item,
        id: clone ? `${item.key}-clone` : item.key,
        clone,
      }));
    return [build(false), build(true)];
  });

  readonly promoArtwork: Record<string, { desktop: string; mobile: string }> = {
    grocery: {
      desktop: "/assets/reference/home-promo-grocery-user.png",
      mobile: "/assets/reference/home-promo-grocery-mobile.jpg",
    },
    "fruits-vegetables": {
      desktop: "/assets/reference/home-promo-fruits-user.png",
      mobile: "/assets/reference/home-promo-fruits-mobile.jpg",
    },
    dairy: {
      desktop: "/assets/reference/home-promo-dairy-user.png",
      mobile: "/assets/reference/home-promo-dairy-mobile.jpg",
    },
  };
  readonly featuredShops = this.catalog.featuredShops;
  readonly bestsellers = this.catalog.bestsellers;
  readonly freshPicks = this.catalog.freshPicks;
  readonly steps = STEPS;
  readonly testimonials = TESTIMONIALS;
  readonly faqs = FAQS.slice(0, 5);
  readonly shopBenefits = PARTNER_BENEFITS.shop;
  readonly deliveryBenefits = PARTNER_BENEFITS.delivery;

  readonly query = signal("");
  readonly openFaq = signal<number | null>(0);

  readonly popularSearches = ["Milk", "Atta", "Rice", "Snacks", "Ice cream", "Honey"];

  readonly heroProducts = computed<Product[]>(() => {
    const products = this.catalog.products();
    const preferred = [16, 32, 27, 38]
      .map((id) => products.find((product) => product.id === id))
      .filter((product): product is Product => !!product);
    return preferred.length === 4 ? preferred : products.slice(0, 4);
  });

  readonly heroMain = computed<Product | undefined>(() => this.heroProducts()[0]);
  readonly heroSide = computed<Product | undefined>(() => this.heroProducts()[1]);
  readonly heroThird = computed<Product | undefined>(() => this.heroProducts()[2]);
  readonly heroCategories = computed(() => this.categories().slice(0, 4));

  readonly appCard = {
    desktop: "/assets/reference/home-app-card-static.png",
    mobile: "/assets/banners/home-app-stack.webp",
    alt: "Get the Smart Dukaan App — order from nearby shops with live tracking and exclusive deals",
  };

  readonly heroSlides = [
    {
      id: "daily",
      desktop: "/assets/reference/home-hero-daily-desktop.jpg",
      mobile: "/assets/banners/home-daily-stack.webp",
      alt: "All your daily needs from nearby shops — Smart Dukaan banner",
    },
    {
      id: "fresh",
      desktop: "/assets/reference/home-hero-fresh-desktop.jpg",
      mobile: "/assets/banners/home-fresh-stack.webp",
      alt: "Fresh fruits and vegetables from nearby shops — Smart Dukaan banner",
    },
    {
      id: "dairy",
      desktop: "/assets/reference/home-hero-dairy-desktop.jpg",
      mobile: "/assets/banners/home-dairy-stack.webp",
      alt: "Dairy and breakfast essentials from nearby shops — Smart Dukaan banner",
    },
  ];
  readonly activeSlide = signal(0);
  private heroTimer?: ReturnType<typeof setInterval>;

  constructor() {
    this.startHeroCarousel();
    this.destroyRef.onDestroy(() => this.stopHeroCarousel());
  }

  readonly dealProducts = computed(() =>
    [...this.catalog.products()]
      .filter((product) => product.mrp > product.price)
      .sort((a, b) => b.mrp - b.price - (a.mrp - a.price))
      .slice(0, 4),
  );

  readonly trustPoints = [
    { icon: "truck", title: "Local & Fast Delivery", copy: "From shops near you" },
    { icon: "shield", title: "Trusted Local Shops", copy: "Verified & reliable stores" },
    { icon: "wallet", title: "Multiple Payment Options", copy: "UPI, Cards, Net Banking & COD" },
    { icon: "headphones", title: "Dedicated Support", copy: "We're here to help you" },
  ];

  readonly promoCards = computed(() => {
    const categories = this.categories();
    const pick = (slug: string) => categories.find((category) => category.slug === slug);
    const grocery = pick("grocery");
    const fresh = pick("fruits-vegetables");
    const dairy = pick("dairy");
    return [
      {
        slug: "grocery",
        badge: "Daily essentials",
        title: "Daily Essentials at Your Nearby Shops",
        copy: "Atta, rice, oil, salt & more from stores around you.",
        tint: "from-[#e8f6e6] via-[#f1fbef] to-white",
        image: grocery?.image ?? categories[0]?.image ?? "",
      },
      {
        slug: "fruits-vegetables",
        badge: "Farm fresh",
        title: "Fresh Fruits & Vegetables",
        copy: "Farm Fresh • Delivered Local, every morning.",
        tint: "from-[#f1fbef] via-white to-[#e8f6e6]",
        image: fresh?.image ?? categories[0]?.image ?? "",
      },
      {
        slug: "dairy",
        badge: "Breakfast",
        title: "Dairy & Breakfast Essentials",
        copy: "Milk, Curd, Paneer & More from nearby dairies.",
        tint: "from-[#fff9eb] via-white to-[#f1fbef]",
        image: dairy?.image ?? categories[0]?.image ?? "",
      },
    ];
  });

  selectHeroSlide(index: number): void {
    this.activeSlide.set(index);
    this.restartHeroCarousel();
  }

  private startHeroCarousel(): void {
    this.heroTimer = setInterval(() => this.nextHeroSlide(), 4200);
  }

  private nextHeroSlide(): void {
    this.activeSlide.update((current) => (current + 1) % this.heroSlides.length);
  }

  private restartHeroCarousel(): void {
    this.stopHeroCarousel();
    this.startHeroCarousel();
  }

  private stopHeroCarousel(): void {
    if (this.heroTimer !== undefined) {
      clearInterval(this.heroTimer);
      this.heroTimer = undefined;
    }
  }

  onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  search(event?: Event): void {
    event?.preventDefault();
    const term = this.query().trim();
    void this.router.navigate(["/shop"], { queryParams: term ? { q: term } : {} });
  }

  usePopular(term: string): void {
    this.query.set(term);
    this.search();
  }

  addDeal(product: Product): void {
    this.cart.add(product);
    this.toast.show(`${product.title} added to cart`);
  }

  toggleFaq(index: number): void {
    this.openFaq.update((current) => (current === index ? null : index));
  }

  copyCoupon(code: string): void {
    void navigator.clipboard?.writeText(code);
    this.toast.show(`${code} copied — apply it at checkout!`);
  }

  categoryLink(slug: string): string {
    return `/shop?category=${slug}`;
  }

  readonly categoryCount = computed(() => this.categories().length);
  readonly productCount = computed(() => this.catalog.products().length);
  readonly liveCategories = CATEGORIES;
}
