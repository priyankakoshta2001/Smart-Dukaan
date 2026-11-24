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
  selector: "app-for-delivery-partners-page",
  standalone: true,
  imports: [RouterLink, IconComponent, PageBannerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./for-delivery-partners.page.html",
})
export class ForDeliveryPartnersPage {
  readonly benefits = PARTNER_BENEFITS.delivery;

  readonly stats = [
    { value: "1,200+", label: "Active delivery partners" },
    { value: "₹25K+", label: "Avg. monthly earning" },
    { value: "24 hrs", label: "To start after approval" },
  ];

  readonly steps: OnboardStep[] = [
    { icon: "edit", title: "Apply online", copy: "Share your details, city and vehicle type — takes two minutes." },
    { icon: "shield", title: "Document check", copy: "Upload your ID, licence and vehicle papers for quick verification." },
    { icon: "zap", title: "Quick training", copy: "A short orientation on pickups, handovers and the partner app." },
    { icon: "wallet", title: "Start earning", copy: "Go online whenever you want and get paid every week." },
  ];

  readonly payout = [
    { label: "96 deliveries × ₹40", value: "₹3,840" },
    { label: "Fuel bonus", value: "₹450" },
    { label: "Customer tips", value: "₹320" },
  ];

  readonly payoutTotal = "₹4,610";

  readonly payPoints = [
    "Delivery fee + distance pay on every order",
    "Fuel bonus added for long routes",
    "100% of customer tips go to you",
    "No hidden deductions, slip on every payout",
  ];

  readonly requirements = [
    { icon: "user", title: "Age 18+", copy: "Valid government ID proof." },
    { icon: "truck", title: "Own vehicle", copy: "Bicycle, two-wheeler or on foot, based on your city." },
    { icon: "phone", title: "Smartphone", copy: "Android phone with an active data plan." },
    { icon: "card", title: "Bank account", copy: "For weekly payouts straight to your account." },
  ];

  readonly faqs = [
    { q: "Can I choose my own hours?", a: "Yes. Go online and offline anytime from the partner app — morning, evening or both." },
    { q: "How much can I earn?", a: "Earnings depend on hours and deliveries, with most partners earning ₹25,000+ a month working full-time." },
    { q: "When do I get paid?", a: "Payouts, including fuel bonus, are settled to your bank account every week." },
    { q: "Am I insured while delivering?", a: "Yes, every active delivery partner is covered by an accident insurance policy during trips." },
  ];
}
