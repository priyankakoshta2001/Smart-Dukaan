import { computed, effect, Injectable, signal } from "@angular/core";
import type { User } from "../models";

const KEY = "smartdukaan.user.v2";

@Injectable({ providedIn: "root" })
export class AuthService {
  readonly user = signal<User | null>(this.restore());
  readonly isLoggedIn = computed(() => this.user() !== null);
  readonly firstName = computed(() => this.user()?.name?.split(" ")[0] ?? "there");
  readonly initial = computed(() => this.user()?.name?.charAt(0)?.toUpperCase() ?? "U");

  constructor() {
    effect(() => {
      const user = this.user();
      if (user) localStorage.setItem(KEY, JSON.stringify(user));
      else localStorage.removeItem(KEY);
    });
  }

  login(email: string, name?: string): User {
    const handle = email.split("@")[0].replace(/[._-]/g, " ");
    const pretty = handle.replace(/\b\w/g, (letter) => letter.toUpperCase());
    const user: User = {
      name: name?.trim() || pretty || "Smart Shopper",
      email,
      phone: "98765 43210",
      joined: new Date().toISOString(),
    };
    this.user.set(user);
    return user;
  }

  register(name: string, email: string, phone?: string): User {
    const user: User = { name, email, phone, joined: new Date().toISOString() };
    this.user.set(user);
    return user;
  }

  update(patch: Partial<User>): void {
    this.user.update((user) => (user ? { ...user, ...patch } : user));
  }

  logout(): void {
    this.user.set(null);
  }

  private restore(): User | null {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
}
