import { ChangeDetectionStrategy, Component, computed, ElementRef, HostListener, inject, signal } from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { CartService } from "../../core/services/cart.service";
import { CatalogService } from "../../core/services/catalog.service";
import { LocationService } from "../../core/services/location.service";
import { PwaService } from "../../core/services/pwa.service";
import { ToastService } from "../../core/services/toast.service";
import { WishlistService } from "../../core/services/wishlist.service";
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./header.component.html",
})
export class HeaderComponent {
  readonly cart = inject(CartService);
  readonly wishlist = inject(WishlistService);
  readonly auth = inject(AuthService);
  readonly catalog = inject(CatalogService);
  readonly location = inject(LocationService);
  readonly pwa = inject(PwaService);

  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly query = signal("");
  readonly searchOpen = signal(false);
  readonly categoriesOpen = signal(false);
  readonly locationOpen = signal(false);
  readonly accountOpen = signal(false);
  readonly mobileOpen = signal(false);
  readonly appMenuOpen = signal(false);

  readonly suggestions = computed(() => this.catalog.searchProducts(this.query(), 5));
  readonly shopSuggestions = computed(() => this.catalog.matchingShops(this.query()));
  readonly hasResults = computed(
    () => this.suggestions().length > 0 || this.shopSuggestions().length > 0,
  );
  readonly cityAvailable = computed(() => this.location.available());

  onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.searchOpen.set(true);
  }

  submitSearch(event?: Event): void {
    event?.preventDefault();
    const term = this.query().trim();
    this.searchOpen.set(false);
    void this.router.navigate(["/shop"], { queryParams: term ? { q: term } : {} });
    this.query.set("");
  }

  openProduct(slug: string): void {
    this.searchOpen.set(false);
    this.query.set("");
    void this.router.navigate(["/product", slug]);
  }

  openShop(slug: string): void {
    this.searchOpen.set(false);
    this.query.set("");
    void this.router.navigate(["/store", slug]);
  }

  chooseCategory(slug: string): void {
    this.categoriesOpen.set(false);
    this.mobileOpen.set(false);
    void this.router.navigate(["/shop"], { queryParams: { category: slug } });
  }

  selectCity(name: string): void {
    const city = this.location.cities.find((item) => item.name === name);
    this.locationOpen.set(false);
    this.mobileOpen.set(false);
    if (!city) return;
    if (!city.available) {
      this.toast.show(
        `${city.name} is coming soon — we are live in Jabalpur, Bhopal and Indore.`,
        "info",
      );
      return;
    }
    this.location.setCity(name);
    this.toast.show(`Delivering to ${name} — showing shops near you.`);
  }

  logout(): void {
    this.auth.logout();
    this.accountOpen.set(false);
    this.mobileOpen.set(false);
    this.toast.show("Signed out. Phir milenge!", "info");
    void this.router.navigate(["/"]);
  }

  closeAll(): void {
    this.searchOpen.set(false);
    this.categoriesOpen.set(false);
    this.locationOpen.set(false);
    this.accountOpen.set(false);
    this.appMenuOpen.set(false);
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest("[data-menu='categories']")) this.categoriesOpen.set(false);
    if (!target.closest("[data-menu='location']")) this.locationOpen.set(false);
    if (!target.closest("[data-menu='account']")) this.accountOpen.set(false);
    if (!target.closest("[data-menu='search']")) this.searchOpen.set(false);
    if (!target.closest("[data-menu='app']")) this.appMenuOpen.set(false);
  }

  @HostListener("document:keydown.escape")
  onEscape(): void {
    this.closeAll();
    this.mobileOpen.set(false);
  }
}
