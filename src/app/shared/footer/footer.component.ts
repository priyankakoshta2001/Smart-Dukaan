import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CATEGORIES } from "../../core/data/catalog";
import { PwaService } from "../../core/services/pwa.service";
import { ToastService } from "../../core/services/toast.service";
import { IconComponent } from "../icon/icon.component";

interface FooterLink {
  label: string;
  link: string;
  queryParams?: Record<string, string>;
}

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./footer.component.html",
})
export class FooterComponent {
  private readonly toast = inject(ToastService);
  readonly pwa = inject(PwaService);

  readonly categories = CATEGORIES.slice(0, 6);
  readonly year = new Date().getFullYear();
  readonly email = signal("");
  readonly subscribed = signal(false);

  readonly shopLinks: FooterLink[] = [
    { label: "All products", link: "/shop" },
    { label: "Nearby shops", link: "/shops" },
    { label: "Today's deals", link: "/offers" },
    { label: "Fruits & vegetables", link: "/shop", queryParams: { category: "fruits-vegetables" } },
    { label: "Dairy & breakfast", link: "/shop", queryParams: { category: "dairy" } },
    { label: "Atta, rice & pulses", link: "/shop", queryParams: { category: "atta-rice-pulses" } },
  ];

  readonly companyLinks: FooterLink[] = [
    { label: "About us", link: "/about" },
    { label: "Become a shop partner", link: "/for-shopkeepers" },
    { label: "Delivery partner", link: "/for-delivery-partners" },
    { label: "Contact us", link: "/contact" },
    { label: "Help centre", link: "/help" },
  ];

  readonly helpLinks: FooterLink[] = [
    { label: "Help centre", link: "/help" },
    { label: "Track your order", link: "/account", queryParams: { tab: "orders" } },
    { label: "Returns & refunds", link: "/policy/returns" },
    { label: "Delivery info", link: "/policy/shipping" },
    { label: "FAQs", link: "/help" },
  ];

  readonly legalLinks: FooterLink[] = [
    { label: "Privacy policy", link: "/policy/privacy" },
    { label: "Terms of service", link: "/policy/terms" },
    { label: "Refund policy", link: "/policy/returns" },
    { label: "Cookie policy", link: "/policy/cookies" },
  ];

  readonly socials = ["instagram", "facebook", "twitter", "youtube"];
  readonly payments = ["UPI", "VISA", "Mastercard", "RuPay", "COD"];

  subscribe(event: Event): void {
    event.preventDefault();
    const email = this.email().trim();
    if (!email || !email.includes("@")) {
      this.toast.show("Please enter a valid email address.", "error");
      return;
    }
    this.subscribed.set(true);
    this.toast.show("You're in! ₹100 coupon is on its way.");
    this.email.set("");
  }

  onEmail(event: Event): void {
    this.email.set((event.target as HTMLInputElement).value);
  }
}
