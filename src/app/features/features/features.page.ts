import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { IconComponent } from "../../shared/icon/icon.component";
import { PageBannerComponent } from "../../shared/page-banner/page-banner.component";

interface FeatureGroup {
  eyebrow: string;
  title: string;
  items: { icon: string; title: string; copy: string }[];
}

@Component({
  selector: "app-features-page",
  standalone: true,
  imports: [RouterLink, IconComponent, PageBannerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./features.page.html",
})
export class FeaturesPage {
  readonly groups: FeatureGroup[] = [
    {
      eyebrow: "Shopping",
      title: "Everything you need, one cart",
      items: [
        { icon: "store", title: "Local shops", copy: "Shop from trusted stores near you, verified by our city team." },
        { icon: "cart", title: "Multi-shop cart", copy: "Add items from several nearby shops and check out just once." },
        { icon: "heart", title: "Wishlist", copy: "Save products you love and order them in a single tap later." },
        { icon: "search", title: "Smart search", copy: "Find shops and products instantly as you type." },
      ],
    },
    {
      eyebrow: "Delivery",
      title: "Flexible, on your terms",
      items: [
        { icon: "truck", title: "Flexible delivery", copy: "Express in 30–45 minutes, a scheduled slot, or self-pickup." },
        { icon: "map", title: "Live tracking", copy: "Track your order and your delivery partner in real time." },
        { icon: "percent", title: "Free delivery", copy: "Orders above ₹499 are delivered free, every time." },
        { icon: "clock", title: "Order history", copy: "Reorder your usual list from past orders in seconds." },
      ],
    },
    {
      eyebrow: "Trust & payments",
      title: "Safe & convenient",
      items: [
        { icon: "shield", title: "Verified shops", copy: "Every shop is onboarded and rated by real customers." },
        { icon: "wallet", title: "Multiple payments", copy: "UPI, cards, net banking or cash on delivery — your choice." },
        { icon: "lock", title: "Secure checkout", copy: "Payments are processed over an encrypted, secure connection." },
        { icon: "refresh", title: "Easy returns", copy: "Report an issue and get a replacement or refund, no hassle." },
      ],
    },
    {
      eyebrow: "Support",
      title: "Real help, whenever you need it",
      items: [
        { icon: "headphones", title: "Dedicated support", copy: "Chat, call or email us — real humans, 7 AM to 11 PM." },
        { icon: "chat", title: "Help centre", copy: "Answers to common questions about orders, payments and delivery." },
        { icon: "gift", title: "Offers & coupons", copy: "Regular deals and a welcome coupon on your first order." },
        { icon: "bookmark", title: "Saved addresses", copy: "Keep home, work and other addresses ready for faster checkout." },
      ],
    },
  ];
}
