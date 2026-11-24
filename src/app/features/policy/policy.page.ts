import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { IconComponent } from "../../shared/icon/icon.component";
import { PageBannerComponent } from "../../shared/page-banner/page-banner.component";

interface PolicySection {
  heading: string;
  body: string;
  bullets?: string[];
}

interface PolicyDoc {
  slug: string;
  title: string;
  kicker: string;
  icon: string;
  updated: string;
  summary: string;
  sections: PolicySection[];
}

@Component({
  selector: "app-policy-page",
  standalone: true,
  imports: [RouterLink, IconComponent, PageBannerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./policy.page.html",
})
export class PolicyPage {
  private readonly route = inject(ActivatedRoute);

  readonly slug = signal("privacy");

  readonly policies: PolicyDoc[] = [
    {
      slug: "privacy",
      title: "Privacy policy",
      kicker: "Your data, handled with care",
      icon: "shield",
      updated: "1 October 2026",
      summary:
        "We collect only what we need to get your groceries to your door, and we never sell your personal data. Here is exactly what we store and why.",
      sections: [
        {
          heading: "What we collect",
          body: "When you create an account or place an order, we collect the details needed to fulfil it. Nothing more, nothing sneaky.",
          bullets: [
            "Contact details: name, phone number and email address.",
            "Delivery details: saved addresses, pin codes and delivery instructions.",
            "Order history: items, amounts, payment method type (never full card numbers).",
            "Device data: browser type and approximate location used to find your nearest partner shop.",
          ],
        },
        {
          heading: "How we use it",
          body: "Your information is used to pack, dispatch and deliver your order, to provide support when something goes wrong, and to keep your account secure. With your consent, we may also send order updates and occasional offers.",
        },
        {
          heading: "Payments",
          body: "Card and UPI details are processed by PCI-DSS compliant payment partners. Smart Dukaan never stores your full card number or CVV on our servers. Cash-on-delivery orders store only the amount due.",
        },
        {
          heading: "Sharing with partners",
          body: "We share the minimum required information with delivery riders, payment processors and cloud infrastructure providers. All partners are contractually bound to protect your data and use it only for the service they provide.",
        },
        {
          heading: "Your rights",
          body: "You can request a copy of your data, correct it, or ask us to delete your account at any time.",
          bullets: [
            "Download or correct your details from My Account → Profile.",
            "Request deletion by writing to privacy@smartdukaan.in.",
            "Opt out of marketing messages from the notification settings in your account.",
            "We respond to verified requests within 30 days.",
          ],
        },
        {
          heading: "Cookies & local storage",
          body: "We use essential storage to keep your basket, wishlist and sign-in state on your device. Analytics cookies are optional and can be disabled in your browser without affecting checkout.",
        },
        {
          heading: "Security & retention",
          body: "Data is encrypted in transit with TLS 1.3 and at rest on our servers. Order records are retained for seven years to meet tax requirements; marketing preferences are deleted as soon as you opt out.",
        },
      ],
    },
    {
      slug: "terms",
      title: "Terms of service",
      kicker: "The ground rules",
      icon: "receipt",
      updated: "1 October 2026",
      summary:
        "These terms govern your use of Smart Dukaan. Plain language, no hidden clauses — please read them before you shop.",
      sections: [
        {
          heading: "Using Smart Dukaan",
          body: "You must be at least 18 years old, or supervised by a parent or guardian, to place an order. You agree to provide accurate delivery details and to keep your account credentials private.",
        },
        {
          heading: "Products & pricing",
          body: "We work hard to keep product descriptions, images and prices accurate. Minor variations in packaging or appearance may occur. If a pricing error is discovered before dispatch, we will contact you to confirm or cancel the order with a full refund.",
        },
        {
          heading: "Orders & acceptance",
          body: "Placing an order is an offer to purchase. The contract is formed when we confirm dispatch. We may decline an order in cases of suspected fraud, serviceability issues, or stock unavailability — any amount already paid is refunded in full.",
        },
        {
          heading: "Delivery",
          body: "Delivery timelines are estimates, not guarantees. Someone aged 18 or above must be available to receive the order, or you may authorise a contactless drop-off at your own risk. Delivery fees and free-delivery thresholds are shown at checkout.",
        },
        {
          heading: "Returns & refunds",
          body: "Returns are governed by our Returns policy. Fresh produce may be returned at the doorstep; packaged goods follow the window described in that policy. Refunds are issued to the original payment method.",
        },
        {
          heading: "Acceptable use",
          body: "Do not misuse the platform, attempt to scrape it, or place fraudulent orders. We may suspend accounts that repeatedly refuse deliveries, abuse support staff, or breach these terms.",
        },
        {
          heading: "Liability & governing law",
          body: "To the extent permitted by law, our liability is limited to the value of the affected order. These terms are governed by the laws of India, with courts in Jabalpur having exclusive jurisdiction.",
        },
      ],
    },
    {
      slug: "returns",
      title: "Returns & refunds",
      kicker: "Not happy? We'll fix it",
      icon: "refresh",
      updated: "1 October 2026",
      summary:
        "Freshness is a promise. If something isn't right, you can return it at the doorstep or raise a request within the window below — no arguments.",
      sections: [
        {
          heading: "Doorstep returns",
          body: "Fresh produce, dairy, meat and other perishables can be returned to the rider at the time of delivery if you are not satisfied with the quality. Show the item to the rider and the amount is refunded instantly to your original payment method or as store credit.",
        },
        {
          heading: "7-day window",
          body: "Packaged groceries, home goods, beauty products and electronics can be returned within 7 days of delivery, provided they are unused and in their original packaging. Items with broken seals cannot be returned for hygiene reasons unless they arrived damaged.",
        },
        {
          heading: "How to raise a return",
          body: "Go to My Account → My orders, select the order and tap Help with this order. Alternatively, contact support with your order ID.",
          bullets: [
            "Keep the item and packaging ready for pickup.",
            "A rider will collect it within 24–48 hours in serviceable pin codes.",
            "For low-value items, we may issue an instant refund without pickup.",
          ],
        },
        {
          heading: "Refund timelines",
          body: "UPI and wallet refunds usually arrive within 2–4 hours. Card refunds take 3–5 business days depending on your bank. Cash-on-delivery orders are refunded to a bank account or as Smart Dukaan credit.",
        },
        {
          heading: "Non-returnable items",
          body: "For safety and hygiene, opened personal-care items, cut fruits, and gift cards cannot be returned. Damaged or incorrect items are always eligible — send us a photo and we will prioritise the resolution.",
        },
      ],
    },
    {
      slug: "shipping",
      title: "Delivery information",
      kicker: "How your order reaches you",
      icon: "truck",
      updated: "1 October 2026",
      summary:
        "Most orders arrive in 30–45 minutes. Here is how slots, fees and serviceability work, so there are no surprises at checkout.",
      sections: [
        {
          heading: "Delivery slots",
          body: "Choose what suits your day at checkout.",
          bullets: [
            "Express: typically 30–45 minutes from your nearest partner shop.",
            "One hour: the fastest available slot during peak hours.",
            "Evening: a 6 PM – 9 PM window for planned dinners and restocks.",
          ],
        },
        {
          heading: "Charges",
          body: "Delivery is free on orders above ₹499. Orders below that carry a flat ₹29 fee. There are no surge charges, rain fees or handling fees — the amount shown at checkout is final.",
        },
        {
          heading: "Serviceable areas",
          body: "We currently deliver across Jabalpur, Bhopal and Indore, and add new neighbourhoods every month. Pick your city from the header to see the shops and delivery windows available around you.",
        },
        {
          heading: "Tracking & updates",
          body: "Once your basket is packed, you will receive an SMS and WhatsApp message with a live rider link. The same tracking is available under My Account → My orders.",
        },
        {
          heading: "If you miss a delivery",
          body: "The delivery partner waits up to 5 minutes and will call you. If nobody is available, the order returns to the partner shop and we will contact you to reschedule. Repeated missed deliveries may attract a small re-delivery fee.",
        },
      ],
    },
    {
      slug: "cookies",
      title: "Cookie policy",
      kicker: "The small files that help",
      icon: "eye",
      updated: "1 October 2026",
      summary:
        "Cookies and local storage keep you signed in and your basket intact. This page explains the few we use and how to control them.",
      sections: [
        {
          heading: "Essential storage",
          body: "These are required for the store to work. They remember your basket, wishlist, coupon and sign-in state on this device. Disabling them will break checkout.",
        },
        {
          heading: "Performance & analytics",
          body: "We use aggregated, anonymised analytics to understand which pages are slow or confusing. These cookies never identify you personally and can be blocked without affecting your order.",
        },
        {
          heading: "Marketing",
          body: "With your consent, we may use cookies to measure whether an offer was useful. You can withdraw consent at any time from the notification settings in your account, and no marketing cookies are set before you agree.",
        },
        {
          heading: "Managing cookies",
          body: "Every major browser lets you view, block or delete cookies from its settings. Blocking essential storage will sign you out and empty your basket, but you can always rebuild it in a couple of taps.",
        },
      ],
    },
  ];

  readonly doc = computed(() => this.policies.find((policy) => policy.slug === this.slug()));

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get("slug") ?? "privacy";
      this.slug.set(this.policies.some((policy) => policy.slug === slug) ? slug : "privacy");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  readonly otherPolicies = computed(() => this.policies.filter((policy) => policy.slug !== this.slug()));

  print(): void {
    if (typeof window !== "undefined") window.print();
  }
}
