import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { STEPS } from "../../core/data/catalog";
import { CatalogService } from "../../core/services/catalog.service";
import { LocationService } from "../../core/services/location.service";
import { PwaService } from "../../core/services/pwa.service";
import { ToastService } from "../../core/services/toast.service";
import { IconComponent } from "../../shared/icon/icon.component";
import { PageBannerComponent } from "../../shared/page-banner/page-banner.component";

interface LandingFeature {
  icon: string;
  title: string;
  copy: string;
  tint: string;
}

interface PartnerCard {
  icon: string;
  title: string;
  copy: string;
  action: string;
  link: string;
  queryParams?: { topic: string };
  tone: string;
}

@Component({
  selector: "app-about-page",
  standalone: true,
  imports: [RouterLink, IconComponent, PageBannerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./about.page.html",
})
export class AboutPage {
  readonly catalog = inject(CatalogService);
  readonly location = inject(LocationService);
  readonly pwa = inject(PwaService);
  private readonly toast = inject(ToastService);

  readonly steps = STEPS;
  readonly shopCount = computed(() => this.catalog.shopViews().length);
  readonly productCount = computed(() => this.catalog.products().length);

  readonly landingCategories = computed(() => {
    const views = this.catalog.categoryViews();
    const order = [
      "grocery",
      "fruits-vegetables",
      "dairy",
      "snacks",
      "beverages",
      "personal-care",
      "household",
      "atta-rice-pulses",
    ];
    return order
      .map((slug) => views.find((category) => category.slug === slug))
      .filter((category): category is (typeof views)[number] => !!category);
  });

  readonly previewShops = computed(() => this.catalog.shopViews().slice(0, 2));

  readonly features: LandingFeature[] = [
    {
      icon: "store",
      title: "Local Shops",
      copy: "Shop from trusted stores near you",
      tint: "bg-brand-50 text-brand-700",
    },
    {
      icon: "cart",
      title: "Multi-Shop Cart",
      copy: "Add items from multiple shops",
      tint: "bg-sun-50 text-sun-600",
    },
    {
      icon: "truck",
      title: "Flexible Delivery",
      copy: "Express, scheduled or self-pickup",
      tint: "bg-brand-50 text-brand-700",
    },
    {
      icon: "shield",
      title: "Safe & Convenient",
      copy: "Secure payments and easy tracking",
      tint: "bg-brand-100 text-brand-800",
    },
  ];

  readonly partners: PartnerCard[] = [
    {
      icon: "leaf",
      title: "Support Your Local Shops",
      copy: "Shop locally, get fresh products, faster delivery and help your neighbourhood businesses grow.",
      action: "Explore nearby shops",
      link: "/shops",
      tone: "from-brand-50 via-white to-white",
    },
    {
      icon: "store",
      title: "Become a Shop Partner",
      copy: "List your shop on Smart Dukaan, manage products, and reach more local customers.",
      action: "Register Your Shop",
      link: "/for-shopkeepers",
      tone: "from-sun-50 via-white to-white",
    },
    {
      icon: "truck",
      title: "Join as a Delivery Partner",
      copy: "Earn flexible income by delivering orders in your area. Choose your own hours.",
      action: "Apply Now",
      link: "/for-delivery-partners",
      tone: "from-brand-50 via-white to-white",
    },
  ];

  onCityChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const name = select.value;
    const city = this.location.cities.find((item) => item.name === name);
    if (!city) return;
    if (!city.available) {
      select.value = this.location.city();
      this.toast.show(
        `${city.name} is coming soon — we are live in Jabalpur, Bhopal and Indore.`,
        "info",
      );
      return;
    }
    this.location.setCity(name);
    this.toast.show(`Delivering to ${name} — showing shops near you.`);
  }
}
