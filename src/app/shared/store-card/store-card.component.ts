import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import type { Shop } from "../../core/models";
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: "app-store-card",
  standalone: true,
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./store-card.component.html",
  host: { class: "block min-w-0" },
})
export class StoreCardComponent {
  readonly shop = input.required<Shop>();
  readonly count = input(0);
  readonly compact = input(false);
  readonly photo = computed(() => {
    const photos: Record<string, string> = {
      "sharma-kirana-store": "/assets/reference/sharma-storefront.jpg",
      "gupta-general-store": "/assets/reference/gupta-storefront.jpg",
      "agarwal-kirana": "/assets/reference/agarwal-storefront.jpg",
      "patel-kirana-general": "/assets/reference/patel-storefront.jpg",
    };
    return photos[this.shop().slug] ?? null;
  });
}
