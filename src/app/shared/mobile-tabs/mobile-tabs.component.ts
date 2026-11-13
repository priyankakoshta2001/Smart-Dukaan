import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { CartService } from "../../core/services/cart.service";
import { WishlistService } from "../../core/services/wishlist.service";
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: "app-mobile-tabs",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./mobile-tabs.component.html",
})
export class MobileTabsComponent {
  readonly cart = inject(CartService);
  readonly wishlist = inject(WishlistService);
  readonly auth = inject(AuthService);
}
