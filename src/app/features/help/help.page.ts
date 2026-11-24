import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { FAQS } from "../../core/data/catalog";
import { OrderService } from "../../core/services/order.service";
import { ToastService } from "../../core/services/toast.service";
import { IconComponent } from "../../shared/icon/icon.component";
import { PageBannerComponent } from "../../shared/page-banner/page-banner.component";

interface HelpTopic {
  icon: string;
  title: string;
  copy: string;
  term: string;
  tone: string;
}

@Component({
  selector: "app-help-page",
  standalone: true,
  imports: [RouterLink, IconComponent, PageBannerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./help.page.html",
})
export class HelpPage {
  private readonly orders = inject(OrderService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  readonly faqs = FAQS;
  readonly query = signal("");
  readonly openFaq = signal<number | null>(0);
  readonly orderId = signal("");
  readonly tracking = signal(false);

  readonly topics: HelpTopic[] = [
    { icon: "truck", title: "Delivery & slots", copy: "Timings, fees and serviceable areas", term: "delivery", tone: "from-brand-500 to-brand-800" },
    { icon: "refresh", title: "Returns & refunds", copy: "Doorstep returns and refund timelines", term: "return", tone: "from-sun-400 to-sun-600" },
    { icon: "wallet", title: "Payments & offers", copy: "UPI, cards, COD and coupon codes", term: "payment", tone: "from-brand-400 to-brand-700" },
    { icon: "package", title: "Order tracking", copy: "Rider location and live updates", term: "track", tone: "from-brand-600 to-brand-900" },
    { icon: "user", title: "Account & addresses", copy: "Profile, saved addresses and login", term: "account", tone: "from-brand-500 to-brand-700" },
    { icon: "shield", title: "Trust & safety", copy: "Quality checks and data privacy", term: "privacy", tone: "from-brand-700 to-brand-950" },
  ];

  readonly filteredFaqs = computed(() => {
    const term = this.query().trim().toLowerCase();
    if (!term) return this.faqs;
    return this.faqs.filter(
      (faq) => faq.q.toLowerCase().includes(term) || faq.a.toLowerCase().includes(term),
    );
  });

  readonly popular = [
    { label: "Where is my order?", term: "track" },
    { label: "How do I return an item?", term: "return" },
    { label: "What are the delivery charges?", term: "delivery charges" },
    { label: "How do I apply a coupon?", term: "coupon" },
    { label: "Which payments do you accept?", term: "payment" },
  ];

  setQuery(term: string): void {
    this.query.set(term);
    this.openFaq.set(null);
  }

  onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  clearQuery(): void {
    this.query.set("");
    this.openFaq.set(0);
  }

  toggleFaq(index: number): void {
    this.openFaq.update((current) => (current === index ? null : index));
  }

  onOrderId(event: Event): void {
    this.orderId.set((event.target as HTMLInputElement).value);
  }

  trackOrder(): void {
    const id = this.orderId().trim().toUpperCase();
    if (!id) {
      this.toast.show("Enter your order ID to track it.", "error");
      return;
    }
    const order = this.orders.byId(id);
    if (!order) {
      this.toast.show(`We couldn't find order ${id}. Try SD482913 for a demo.`, "error");
      return;
    }
    this.tracking.set(true);
    void this.router.navigate(["/order-success", order.id]);
  }

  useDemo(): void {
    this.orderId.set("SD482913");
    this.trackOrder();
  }
}
