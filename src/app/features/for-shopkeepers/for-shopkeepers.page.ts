import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { PARTNER_BENEFITS } from "../../core/data/catalog";
import { IconComponent } from "../../shared/icon/icon.component";
import { PageBannerComponent } from "../../shared/page-banner/page-banner.component";

interface OnboardStep {
  icon: string;
  title: string;
  copy: string;
}

@Component({
  selector: "app-for-shopkeepers-page",
  standalone: true,
  imports: [RouterLink, IconComponent, PageBannerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./for-shopkeepers.page.html",
})
export class ForShopkeepersPage {
  readonly benefits = PARTNER_BENEFITS.shop;

  readonly stats = [
    { value: "850+", label: "Shops already live" },
    { value: "48 hrs", label: "To go live after approval" },
    { value: "0%", label: "Listing fee, first 3 months" },
  ];

  readonly wins = [
    "2.4x daily orders in 6 weeks",
    "Customers from 40+ societies",
    "Cataloguing done by our team",
    "Weekly payouts, every Monday",
  ];

  readonly steps: OnboardStep[] = [
    { icon: "edit", title: "Tell us about your shop", copy: "Share your shop name, category and address — takes two minutes." },
    { icon: "shield", title: "Verification visit", copy: "Our city team visits your shop to verify details and quality." },
    { icon: "box", title: "List your products", copy: "We help you catalogue and price your everyday stock." },
    { icon: "zap", title: "Go live & start selling", copy: "Your shop appears to nearby customers and orders start coming in." },
  ];

  readonly faqs = [
    { q: "Is there any cost to list my shop?", a: "Listing is free for your first 3 months. After that, a small commission applies only on orders you receive." },
    { q: "How do I get paid?", a: "Payouts are settled to your bank account every week, with a clear breakdown of each order." },
    { q: "Who packs the orders?", a: "You and your staff pack the order; our delivery partner picks it up and delivers it to the customer." },
    { q: "Can I pause orders during busy hours?", a: "Yes, you can mark your shop as busy or closed anytime from the partner app." },
  ];
}
