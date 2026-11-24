import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ToastService } from "../../core/services/toast.service";
import { IconComponent } from "../../shared/icon/icon.component";
import { PageBannerComponent } from "../../shared/page-banner/page-banner.component";

const TOPIC_PRESETS: Record<string, { topic: string; message: string }> = {
  "shop-partner": {
    topic: "Partnership",
    message: "I'd like to list my shop on Smart Dukaan. Please share the onboarding steps and documents I need.",
  },
  "delivery-partner": {
    topic: "Partnership",
    message: "I'm interested in joining Smart Dukaan as a delivery partner. Please share how to apply and the areas you're hiring in.",
  },
};

interface Channel {
  icon: string;
  title: string;
  detail: string;
  action: string;
  href: string;
  tone: string;
}

@Component({
  selector: "app-contact-page",
  standalone: true,
  imports: [RouterLink, IconComponent, PageBannerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./contact.page.html",
})
export class ContactPage {
  private readonly toast = inject(ToastService);
  private readonly route = inject(ActivatedRoute);

  readonly name = signal("");
  readonly email = signal("");
  readonly phone = signal("");
  readonly orderId = signal("");
  readonly message = signal("");
  readonly topic = signal("Order help");
  readonly sent = signal(false);
  readonly error = signal("");

  readonly topics = ["Order help", "Returns & refunds", "Payment issue", "Partnership", "Something else"];

  constructor() {
    const preset = TOPIC_PRESETS[this.route.snapshot.queryParamMap.get("topic") ?? ""];
    if (preset) {
      this.topic.set(preset.topic);
      this.message.set(preset.message);
    }
  }

  readonly channels: Channel[] = [
    {
      icon: "chat",
      title: "Chat with us",
      detail: "Average reply in 48 seconds. 7 AM – 11 PM, all days.",
      action: "Start a chat",
      href: "https://wa.me/917614002200",
      tone: "from-brand-500 to-brand-800",
    },
    {
      icon: "phone",
      title: "Call support",
      detail: "+91 761 400 2200 — our local helpline, 7 AM – 11 PM.",
      action: "Call now",
      href: "tel:+917614002200",
      tone: "from-sun-400 to-sun-600",
    },
    {
      icon: "mail",
      title: "Write to us",
      detail: "care@smartdukaan.in — we reply within 4 working hours.",
      action: "Send an email",
      href: "mailto:care@smartdukaan.in",
      tone: "from-brand-400 to-brand-700",
    },
    {
      icon: "whatsapp",
      title: "WhatsApp",
      detail: "Order updates, rider tracking and quick fixes on chat.",
      action: "Message us",
      href: "https://wa.me/917614002200",
      tone: "from-brand-600 to-brand-900",
    },
  ];

  readonly hours = [
    { day: "Monday – Friday", time: "7:00 AM – 11:00 PM" },
    { day: "Saturday", time: "7:00 AM – 11:00 PM" },
    { day: "Sunday", time: "8:00 AM – 10:00 PM" },
    { day: "Public holidays", time: "9:00 AM – 9:00 PM" },
  ];

  readonly offices = [
    {
      city: "Jabalpur (HQ)",
      address: "2nd Floor, Vijay Nagar Square, Napier Town, Jabalpur 482002",
      meta: "Partner hub · Open 7 AM – 10 PM",
    },
    {
      city: "Bhopal",
      address: "Plot 12, MP Nagar Zone II, near New Market, Bhopal 462011",
      meta: "Partner hub · Open 7 AM – 10 PM",
    },
    {
      city: "Indore",
      address: "Unit 4, Vijay Nagar Main Road, Scheme 54, Indore 452010",
      meta: "Partner hub · Open 7 AM – 10 PM",
    },
  ];

  readonly quickLinks = [
    { label: "Track my order", link: "/account", tab: "orders" },
    { label: "Returns & refunds", link: "/policy/returns", tab: "" },
    { label: "Delivery information", link: "/policy/shipping", tab: "" },
    { label: "Help centre & FAQs", link: "/help", tab: "" },
  ];

  setTopic(topic: string): void {
    this.topic.set(topic);
  }

  onField(field: "name" | "email" | "phone" | "orderId" | "message", event: Event): void {
    this[field].set((event.target as HTMLInputElement | HTMLTextAreaElement).value);
  }

  submit(event: Event): void {
    event.preventDefault();
    if (this.name().trim().length < 2) {
      this.error.set("Please tell us your name so we know who to reply to.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(this.email().trim())) {
      this.error.set("That email doesn't look right. Mind checking it?");
      return;
    }
    if (this.message().trim().length < 12) {
      this.error.set("A little more detail will help us fix things faster.");
      return;
    }
    this.error.set("");
    this.sent.set(true);
    this.toast.show("Message received! Our team will reply within 4 hours.");
  }

  sendAnother(): void {
    this.name.set("");
    this.email.set("");
    this.phone.set("");
    this.orderId.set("");
    this.message.set("");
    this.topic.set("Order help");
    this.sent.set(false);
    this.error.set("");
  }
}
