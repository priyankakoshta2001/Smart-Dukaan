import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CartService } from "../../core/services/cart.service";
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: "app-cart-drawer",
  standalone: true,
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./cart-drawer.component.html",
})
export class CartDrawerComponent {
  readonly cart = inject(CartService);

  percent(value: number): number {
    return Math.round(value);
  }
}
