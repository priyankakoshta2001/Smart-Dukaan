import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import type { Address, OrderItem } from "../../core/models";
import { CartService } from "../../core/services/cart.service";
import { LocationService } from "../../core/services/location.service";
import { OrderService } from "../../core/services/order.service";
import { ToastService } from "../../core/services/toast.service";
import { IconComponent } from "../../shared/icon/icon.component";

interface SlotOption {
  id: string;
  label: string;
  copy: string;
  icon: string;
  tag: string;
}

interface PaymentOption {
  id: string;
  label: string;
  copy: string;
  icon: string;
}

@Component({
  selector: "app-checkout-page",
  standalone: true,
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./checkout.page.html",
})
export class CheckoutPage {
  readonly cart = inject(CartService);
  readonly order = inject(OrderService);
  readonly location = inject(LocationService);

  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly addresses = this.order.addresses;
  readonly selectedAddressId = signal(this.order.defaultAddress()?.id ?? "");
  readonly showAddressForm = signal(this.addresses().length === 0);
  readonly placing = signal(false);
  readonly formError = signal("");

  readonly slot = signal("express");
  readonly payment = signal("upi");
  readonly upiId = signal("aarav@okhdfcbank");
  readonly cardNumber = signal("");
  readonly cardExpiry = signal("");
  readonly cardCvv = signal("");

  readonly form = signal({
    label: "Home",
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: this.location.city(),
    pin: "",
  });

  readonly selectedAddress = computed(
    () =>
      this.addresses().find((address) => address.id === this.selectedAddressId()) ??
      this.order.defaultAddress(),
  );

  readonly slots: SlotOption[] = [
    { id: "express", label: "Express delivery", copy: "In 30–45 minutes", icon: "zap", tag: "Fastest" },
    { id: "one-hour", label: "Within 1 hour", copy: "Priority packing", icon: "clock", tag: "" },
    { id: "evening", label: "Today evening", copy: "6:00 PM – 9:00 PM", icon: "sunset", tag: "" },
    { id: "morning", label: "Tomorrow morning", copy: "8:00 AM – 11:00 AM", icon: "calendar", tag: "" },
  ];

  readonly payments: PaymentOption[] = [
    { id: "upi", label: "UPI", copy: "GPay, PhonePe, Paytm & more", icon: "qr" },
    { id: "card", label: "Credit / Debit card", copy: "Visa, Mastercard, RuPay", icon: "card" },
    { id: "netbanking", label: "Net banking", copy: "All major banks supported", icon: "wallet" },
    { id: "cod", label: "Cash on delivery", copy: "Pay when your order arrives", icon: "cash" },
  ];

  readonly paymentLabel = computed(() => {
    if (this.payment() === "upi") return `UPI · ${this.upiId() || "your UPI ID"}`;
    if (this.payment() === "card") return "Card · •••• 4242";
    if (this.payment() === "netbanking") return "Net banking · HDFC Bank";
    return "Cash on Delivery";
  });

  readonly deliveryDate = computed(() => {
    const date = new Date();
    if (this.slot() === "morning") date.setDate(date.getDate() + 1);
    return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  });

  readonly itemCount = computed(() => this.cart.count());
  readonly shopCount = computed(() => this.cart.shopCount());
  readonly totalSavings = computed(() => this.cart.savingsTotal());

  setField(key: "label" | "name" | "phone" | "line1" | "line2" | "city" | "pin", event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.form.update((form) => ({ ...form, [key]: value }));
  }

  saveAddress(): void {
    const form = this.form();
    if (!form.name.trim() || !form.phone.trim() || !form.line1.trim() || !form.pin.trim()) {
      this.formError.set("Please fill name, phone, address and PIN code.");
      return;
    }
    if (form.phone.replace(/\D/g, "").length < 10) {
      this.formError.set("Enter a valid 10-digit phone number.");
      return;
    }
    if (form.pin.replace(/\D/g, "").length !== 6) {
      this.formError.set("Enter a valid 6-digit PIN code.");
      return;
    }
    this.formError.set("");
    const address = this.order.addAddress({
      label: form.label || "Home",
      name: form.name,
      phone: form.phone,
      line1: form.line1,
      line2: form.line2,
      city: form.city || this.location.city(),
      state: "Madhya Pradesh",
      pin: form.pin,
      isDefault: true,
    });
    this.selectedAddressId.set(address.id);
    this.showAddressForm.set(false);
    this.toast.show("New address saved");
  }

  selectAddress(id: string): void {
    this.selectedAddressId.set(id);
  }

  placeOrder(): void {
    if (!this.cart.count()) {
      this.toast.show("Your cart is empty — add something first.", "error");
      return;
    }
    const address: Address | undefined = this.selectedAddress();
    if (!address) {
      this.toast.show("Add a delivery address to continue.", "error");
      this.showAddressForm.set(true);
      return;
    }
    if (this.payment() === "upi" && !this.upiId().includes("@")) {
      this.toast.show("Enter a valid UPI ID (example: name@bank).", "error");
      return;
    }

    this.placing.set(true);

    const items: OrderItem[] = this.cart.rows().map((line) => ({
      id: line.product.id,
      title: line.product.title,
      image: line.product.image,
      price: line.product.price,
      qty: line.qty,
      unit: line.product.unit,
      shopSlug: line.product.shopSlug,
      shopName: this.cart.groups().find((group) => group.shop.slug === line.product.shopSlug)?.shop.name ?? "Nearby shop",
    }));

    const shops = this.cart.groups().map((group) => group.shop.name);

    const record = this.order.place({
      items,
      shops,
      subtotal: this.cart.subtotal(),
      discount: this.cart.discount(),
      delivery: this.cart.deliveryFee(),
      total: this.cart.total(),
      payment: this.paymentLabel(),
      slot: this.slot(),
      address,
    });

    this.cart.clear();
    this.toast.show("Order placed successfully 🎉");
    void this.router.navigate(["/order-success", record.id]);
  }
}
