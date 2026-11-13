import { computed, effect, Injectable, signal } from "@angular/core";
import { CITIES } from "../data/catalog";

const KEY = "smartdukaan.city.v2";

@Injectable({ providedIn: "root" })
export class LocationService {
  readonly cities = CITIES;
  readonly city = signal<string>(this.restore());

  readonly label = computed(() => {
    const match = CITIES.find((item) => item.name === this.city());
    return match ? `${match.name}, ${match.state}` : `${this.city()}, MP`;
  });

  readonly available = computed(
    () => CITIES.find((item) => item.name === this.city())?.available ?? false,
  );

  constructor() {
    effect(() => localStorage.setItem(KEY, this.city()));
  }

  setCity(name: string): void {
    if (CITIES.some((item) => item.name === name)) this.city.set(name);
  }

  private restore(): string {
    try {
      return localStorage.getItem(KEY) || "Jabalpur";
    } catch {
      return "Jabalpur";
    }
  }
}
