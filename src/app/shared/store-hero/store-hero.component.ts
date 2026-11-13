import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CATEGORIES } from "../../core/data/catalog";
import type { Shop } from "../../core/models";
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: "app-store-hero",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./store-hero.component.html",
})
export class StoreHeroComponent {
  readonly shop = input.required<Shop>();
  readonly productCount = input(0);

  readonly photo = computed(() => {
    const photos: Record<string, string> = {
      "sharma-kirana-store": "/assets/reference/sharma-storefront.jpg",
      "gupta-general-store": "/assets/reference/gupta-storefront.jpg",
      "agarwal-kirana": "/assets/reference/agarwal-storefront.jpg",
      "patel-kirana-general": "/assets/reference/patel-storefront.jpg",
    };
    return photos[this.shop().slug] ?? null;
  });

  readonly chips = computed(() => {
    const slugs = this.shop().categories.slice(0, 4);
    return slugs
      .map((slug) => CATEGORIES.find((category) => category.slug === slug))
      .filter((category): category is (typeof CATEGORIES)[number] => !!category);
  });

  readonly yearsServing = computed(() => new Date().getFullYear() - this.shop().since);
}
