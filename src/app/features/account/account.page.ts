import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import type { Address, Order } from "../../core/models";
import { AuthService } from "../../core/services/auth.service";
import { CartService } from "../../core/services/cart.service";
import { CatalogService } from "../../core/services/catalog.service";
import { LocationService } from "../../core/services/location.service";
import { OrderService } from "../../core/services/order.service";
import { ToastService } from "../../core/services/toast.service";
import { IconComponent } from "../../shared/icon/icon.component";
import { PageBannerComponent } from "../../shared/page-banner/page-banner.component";

type AccountTab = "overview" | "orders" | "addresses" | "profile";

@Component({
  selector: "app-account-page",
  standalone: true,
  imports: [RouterLink, IconComponent, PageBannerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./account.page.html",
})
export class AccountPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  readonly auth = inject(AuthService);
  readonly orders = inject(OrderService);
  readonly cart = inject(CartService);
  readonly catalog = inject(CatalogService);
  private readonly location = inject(LocationService);

  readonly tabs: { key: AccountTab; label: string; icon: string }[] = [
    { key: "overview", label: "Overview", icon: "grid" },
    { key: "orders", label: "My orders", icon: "package" },
    { key: "addresses", label: "Addresses", icon: "pin" },
    { key: "profile", label: "Profile", icon: "user" },
  ];
  readonly quickActions = [
    { icon: "package", label: "Track order", link: "/account", tab: "orders" },
    { icon: "heart", label: "Wishlist", link: "/wishlist", tab: "" },
    { icon: "tag", label: "Offers", link: "/offers", tab: "" },
    { icon: "chat", label: "Get help", link: "/help", tab: "" },
  ];

  readonly tab = signal<AccountTab>("overview");
  readonly expandedOrder = signal<string | null>(null);
  readonly showAddressForm = signal(false);
  readonly profileName = signal(this.auth.user()?.name ?? "");
  readonly profileEmail = signal(this.auth.user()?.email ?? "");
  readonly profilePhone = signal(this.auth.user()?.phone ?? "");
  readonly notifyDeals = signal(true);
  readonly notifyOrders = signal(true);

  readonly newAddress = signal<Address>(this.blankAddress());

  readonly userInitial = computed(() => this.auth.user()?.name?.charAt(0)?.toUpperCase() ?? "G");
  readonly deliveredCount = computed(() => this.orders.orders().filter((order) => order.status === "Delivered").length);
  readonly totalSpent = computed(() => this.orders.orders().reduce((sum, order) => sum + order.total, 0));
  readonly recentOrders = computed(() => this.orders.orders().slice(0, 3));
  readonly stats = computed(() => [
    { label: "Total orders", value: String(this.orders.orders().length), detail: "Lifetime", icon: "package", tint: "bg-brand-50 text-brand-700" },
    { label: "Delivered", value: String(this.deliveredCount()), detail: "On time", icon: "check-circle", tint: "bg-sun-50 text-sun-700" },
    { label: "Total spent", value: "₹" + this.totalSpent(), detail: "Across orders", icon: "wallet", tint: "bg-brand-50 text-brand-700" },
    { label: "Addresses", value: String(this.orders.addresses().length), detail: "Saved", icon: "pin", tint: "bg-brand-100 text-brand-800" },
  ]);

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      const value = params.get("tab");
      if (value === "orders" || value === "addresses" || value === "profile" || value === "overview") {
        this.tab.set(value);
      } else {
        this.tab.set("overview");
      }
    });
  }

  setTab(tab: AccountTab): void {
    this.tab.set(tab);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: "merge",
      replaceUrl: true,
    });
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  statusTone(status: Order["status"]): string {
    if (status === "Delivered") return "badge-green";
    if (status === "On the way") return "badge-sun";
    return "badge-dark";
  }

  toggleOrder(id: string): void {
    this.expandedOrder.update((current) => (current === id ? null : id));
  }

  reorder(order: Order): void {
    let added = 0;
    for (const item of order.items) {
      const product = this.catalog.byId(item.id);
      if (product) {
        this.cart.add(product, item.qty);
        added += 1;
      }
    }
    if (added === 0) {
      this.toast.show("Those products are no longer available.", "error");
      return;
    }
    this.toast.show(`${added} items added back to your basket`);
    this.cart.openDrawer();
  }

  setDefault(id: string): void {
    this.orders.setDefaultAddress(id);
    this.toast.show("Default address updated");
  }

  removeAddress(id: string): void {
    this.orders.removeAddress(id);
    this.toast.show("Address removed", "info");
  }

  onAddressField(field: keyof Address, event: Event, numeric = false): void {
    const value = (event.target as HTMLInputElement).value;
    this.newAddress.update(
      (address) => ({ ...address, [field]: numeric ? value.replace(/[^\d]/g, "") : value }) as Address,
    );
  }

  saveAddress(): void {
    const address = this.newAddress();
    if (!address.name.trim() || !address.phone.trim() || !address.line1.trim() || !/^\d{6}$/.test(address.pin)) {
      this.toast.show("Please fill name, phone, address and a valid 6-digit pin.", "error");
      return;
    }
    this.orders.addAddress(address);
    this.newAddress.set(this.blankAddress());
    this.showAddressForm.set(false);
    this.toast.show("New address saved");
  }

  private blankAddress(): Address {
    const name = this.location.city();
    const state = this.location.cities.find((item) => item.name === name)?.state ?? "MP";
    return {
      id: "",
      label: "Home",
      name: "",
      phone: "",
      line1: "",
      line2: "",
      city: name,
      state,
      pin: "",
    };
  }

  setAddressLabel(label: string): void {
    this.newAddress.update((address) => ({ ...address, label }));
  }

  saveProfile(): void {
    if (!this.auth.isLoggedIn()) {
      this.toast.show("Please sign in to edit your profile.", "error");
      return;
    }
    if (!this.profileName().trim()) {
      this.toast.show("Name can't be empty.", "error");
      return;
    }
    this.auth.update({
      name: this.profileName().trim(),
      email: this.profileEmail().trim(),
      phone: this.profilePhone().trim(),
    });
    this.toast.show("Profile updated");
  }

  logout(): void {
    this.auth.logout();
    this.toast.show("Signed out. Phir milenge!", "info");
    void this.router.navigate(["/"]);
  }
}
