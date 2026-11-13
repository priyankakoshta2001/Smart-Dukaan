import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { CatalogService } from "../../core/services/catalog.service";
import { IconComponent } from "../../shared/icon/icon.component";
import { ProductCardComponent } from "../../shared/product-card/product-card.component";

@Component({
  selector: "app-not-found-page",
  standalone: true,
  imports: [RouterLink, IconComponent, ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./not-found.page.html",
})
export class NotFoundPage {
  private readonly router = inject(Router);
  private readonly catalog = inject(CatalogService);

  readonly query = signal("");
  readonly popular = computed(() =>
    [...this.catalog.products()].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4),
  );

  readonly links = [
    { icon: "home", label: "Home", copy: "Back to Smart Dukaan", link: "/" },
    { icon: "store", label: "Nearby shops", copy: "Verified shops around you", link: "/shops" },
    { icon: "tag", label: "Today's offers", copy: "Coupons and bank deals", link: "/offers" },
    { icon: "headphones", label: "Help centre", copy: "Answers in seconds", link: "/help" },
  ];

  onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  search(event: Event): void {
    event.preventDefault();
    const term = this.query().trim();
    void this.router.navigate(["/shop"], { queryParams: term ? { q: term } : {} });
  }
}
