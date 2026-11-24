import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { OrderService } from "../../core/services/order.service";
import { ToastService } from "../../core/services/toast.service";
import { IconComponent } from "../../shared/icon/icon.component";
import { PageBannerComponent } from "../../shared/page-banner/page-banner.component";

@Component({
  selector: "app-order-success-page",
  standalone: true,
  imports: [RouterLink, IconComponent, PageBannerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./order-success.page.html",
})
export class OrderSuccessPage {
  readonly orders = inject(OrderService);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);

  readonly orderId = signal("");
  readonly order = computed(() => this.orders.byId(this.orderId()) ?? this.orders.latest());

  readonly stages = [
    { label: "Order confirmed", copy: "We received your order", icon: "check-circle" },
    { label: "Packed by shop", copy: "Your items are being packed", icon: "package" },
    { label: "On the way", copy: "Partner is heading to you", icon: "truck" },
    { label: "Delivered", copy: "Enjoy your order!", icon: "home" },
  ];

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.orderId.set(params.get("id") ?? "");
    });
  }

  copyOrderId(): void {
    const order = this.order();
    if (!order) return;
    void navigator.clipboard?.writeText(order.id);
    this.toast.show(`Order ID ${order.id} copied`);
  }

  itemTotal(qty: number, price: number): number {
    return qty * price;
  }
}
