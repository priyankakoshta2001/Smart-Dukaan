import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { STEPS } from "../../core/data/catalog";
import { CatalogService } from "../../core/services/catalog.service";
import { LocationService } from "../../core/services/location.service";
import { IconComponent } from "../../shared/icon/icon.component";

@Component({
  selector: "app-how-it-works-page",
  standalone: true,
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./how-it-works.page.html",
})
export class HowItWorksPage {
  readonly catalog = inject(CatalogService);
  readonly location = inject(LocationService);
  readonly steps = STEPS;
  readonly categories = this.catalog.categoryViews;
  readonly browseCategories = computed(() => {
    const order = ["grocery", "fruits-vegetables", "dairy", "snacks", "beverages", "personal-care", "household"];
    return order
      .map((slug) => this.categories().find((category) => category.slug === slug))
      .filter((category) => category !== undefined);
  });
  readonly shops = this.catalog.featuredShops;
  readonly categoryArtwork: Record<string, string> = {
    grocery: "/assets/reference/browse-category-grocery.jpg",
    "fruits-vegetables": "/assets/reference/browse-category-fruits.jpg",
    dairy: "/assets/reference/browse-category-dairy.jpg",
    snacks: "/assets/reference/browse-category-snacks.jpg",
    beverages: "/assets/reference/browse-category-beverages.jpg",
    household: "/assets/reference/browse-category-household.jpg",
    "personal-care": "/assets/reference/browse-category-personal-care.jpg",
  };

  readonly benefits = [
    { icon: "store", title: "Local shops, one place", copy: "Find verified kirana, dairy and fresh produce stores around your delivery address." },
    { icon: "cart", title: "One convenient cart", copy: "Add everyday items from nearby shops and place them together in one checkout." },
    { icon: "truck", title: "Delivery that fits", copy: "Choose a quick delivery, a scheduled time or pickup when the store offers it." },
    { icon: "shield", title: "Track with confidence", copy: "Pay securely and follow your order while the local shop prepares it." },
  ];
}
