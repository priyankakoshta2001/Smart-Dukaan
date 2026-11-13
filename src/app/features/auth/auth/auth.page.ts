import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { ToastService } from "../../../core/services/toast.service";
import { IconComponent } from "../../../shared/icon/icon.component";

type AuthMode = "login" | "register";

@Component({
  selector: "app-auth-page",
  standalone: true,
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./auth.page.html",
})
export class AuthPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);

  /** One form, two modes — /login opens sign-in, /register opens create-account. */
  readonly mode = signal<AuthMode>(this.route.snapshot.data["mode"] === "register" ? "register" : "login");
  readonly isRegister = computed(() => this.mode() === "register");

  readonly name = signal("");
  readonly email = signal("");
  readonly phone = signal("");
  readonly password = signal("");
  readonly confirm = signal("");
  readonly remember = signal(true);
  readonly agree = signal(true);
  readonly showPassword = signal(false);
  readonly submitting = signal(false);
  readonly error = signal("");
  readonly year = new Date().getFullYear();

  private readonly returnUrl = this.route.snapshot.queryParamMap.get("returnUrl") ?? "/account";

  readonly perks = [
    "Live rider tracking on every order",
    "Saved addresses & one-tap reorder",
    "Member-only deals and early drops",
  ];

  onField(field: "name" | "email" | "phone" | "password" | "confirm", event: Event): void {
    this[field].set((event.target as HTMLInputElement).value);
  }

  switchMode(mode: AuthMode): void {
    if (this.mode() === mode) return;
    void this.router.navigate([mode === "login" ? "/login" : "/register"], {
      queryParamsHandling: "merge",
    });
  }

  fillDemo(): void {
    this.email.set("aarav@smartdukaan.in");
    this.password.set("dukaan123");
    this.error.set("");
  }

  social(provider: string): void {
    this.toast.show(`${provider} sign-in is a demo in this build. Use the form instead.`, "info");
  }

  submit(event: Event): void {
    event.preventDefault();
    if (this.isRegister()) {
      this.register();
    } else {
      this.login();
    }
  }

  private login(): void {
    const email = this.email().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      this.error.set("Please enter a valid email address.");
      return;
    }
    if (this.password().length < 6) {
      this.error.set("Password should be at least 6 characters.");
      return;
    }
    this.error.set("");
    this.submitting.set(true);
    this.auth.login(email);
    const user = this.auth.user();
    this.toast.show(`Welcome back${user ? ", " + user.name.split(" ")[0] : ""}!`);
    this.submitting.set(false);
    void this.router.navigateByUrl(this.returnUrl);
  }

  private register(): void {
    if (this.name().trim().length < 2) {
      this.error.set("Please tell us your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(this.email().trim())) {
      this.error.set("That email doesn't look right.");
      return;
    }
    if (!/^\d{10}$/.test(this.phone().replace(/\s/g, ""))) {
      this.error.set("Please enter a valid 10-digit phone number.");
      return;
    }
    if (this.password().length < 6) {
      this.error.set("Password should be at least 6 characters.");
      return;
    }
    if (this.password() !== this.confirm()) {
      this.error.set("Both passwords need to match.");
      return;
    }
    if (!this.agree()) {
      this.error.set("Please accept the terms to continue.");
      return;
    }
    this.error.set("");
    this.submitting.set(true);
    this.auth.register(this.name().trim(), this.email().trim(), this.phone().trim());
    this.toast.show("Account created! Your ₹100 coupon is ready.");
    this.submitting.set(false);
    void this.router.navigate(["/account"]);
  }
}
