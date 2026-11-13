import { computed, effect, Injectable, signal } from "@angular/core";
import type { Address, Order, OrderItem } from "../models";

const ORDERS_KEY = "smartdukaan.orders.v2";
const ADDRESS_KEY = "smartdukaan.addresses.v2";

const SEED_ADDRESSES: Address[] = [
  {
    id: "addr-home",
    label: "Home",
    name: "Aarav Sharma",
    phone: "98765 43210",
    line1: "Flat 402, Sunrise Residency",
    line2: "12th Main, Napier Town",
    city: "Jabalpur",
    state: "Madhya Pradesh",
    pin: "482002",
    isDefault: true,
  },
  {
    id: "addr-work",
    label: "Work",
    name: "Aarav Sharma",
    phone: "98765 43210",
    line1: "WeWork, Vijay Nagar",
    line2: "Near D-Mart, Scheme 54",
    city: "Jabalpur",
    state: "Madhya Pradesh",
    pin: "482002",
  },
];

const SEED_ITEMS: OrderItem[] = [
  {
    id: 32,
    title: "Amul Taaza Toned Milk",
    image: "https://cdn.dummyjson.com/product-images/groceries/milk/thumbnail.webp",
    price: 69,
    qty: 2,
    unit: "500 ml",
    shopSlug: "sharma-kirana-store",
    shopName: "Sharma Kirana Store",
  },
  {
    id: 38,
    title: "India Gate Basmati Rice",
    image: "https://cdn.dummyjson.com/product-images/groceries/rice/thumbnail.webp",
    price: 449,
    qty: 1,
    unit: "5 kg",
    shopSlug: "sharma-kirana-store",
    shopName: "Sharma Kirana Store",
  },
  {
    id: 27,
    title: "Dabur Honey",
    image: "https://cdn.dummyjson.com/product-images/groceries/honey-jar/thumbnail.webp",
    price: 169,
    qty: 1,
    unit: "500 g jar",
    shopSlug: "sharma-kirana-store",
    shopName: "Sharma Kirana Store",
  },
];

@Injectable({ providedIn: "root" })
export class OrderService {
  readonly orders = signal<Order[]>(this.restoreOrders());
  readonly addresses = signal<Address[]>(this.restoreAddresses());
  readonly latest = computed(() => this.orders()[0]);
  readonly defaultAddress = computed(
    () => this.addresses().find((address) => address.isDefault) ?? this.addresses()[0],
  );

  constructor() {
    effect(() => localStorage.setItem(ORDERS_KEY, JSON.stringify(this.orders())));
    effect(() => localStorage.setItem(ADDRESS_KEY, JSON.stringify(this.addresses())));
  }

  place(order: Omit<Order, "id" | "createdAt" | "status" | "eta">): Order {
    const id = `SD${Math.floor(100000 + Math.random() * 900000)}`;
    const eta =
      order.slot === "express"
        ? "30–45 minutes"
        : order.slot === "one-hour"
          ? "Within 1 hour"
          : order.slot === "evening"
            ? "Today, 6–9 PM"
            : "Tomorrow, 8–11 AM";
    const record: Order = {
      ...order,
      id,
      createdAt: new Date().toISOString(),
      status: "Packed",
      eta,
    };
    this.orders.update((orders) => [record, ...orders]);
    return record;
  }

  byId(id: string): Order | undefined {
    return this.orders().find((order) => order.id === id);
  }

  addAddress(address: Omit<Address, "id">): Address {
    const record: Address = { ...address, id: `addr-${Date.now()}` };
    if (record.isDefault) {
      this.addresses.update((list) => list.map((item) => ({ ...item, isDefault: false })));
    }
    this.addresses.update((list) => [...list, record]);
    return record;
  }

  updateAddress(id: string, patch: Partial<Address>): void {
    this.addresses.update((list) =>
      list.map((address) => (address.id === id ? { ...address, ...patch } : address)),
    );
  }

  removeAddress(id: string): void {
    this.addresses.update((list) => list.filter((address) => address.id !== id));
  }

  setDefaultAddress(id: string): void {
    this.addresses.update((list) =>
      list.map((address) => ({ ...address, isDefault: address.id === id })),
    );
  }

  private restoreOrders(): Order[] {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Order[];
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch {
      return [];
    }
    return [this.seedOrder()];
  }

  private restoreAddresses(): Address[] {
    try {
      const raw = localStorage.getItem(ADDRESS_KEY);
      const parsed = raw ? (JSON.parse(raw) as Address[]) : null;
      return Array.isArray(parsed) && parsed.length ? parsed : SEED_ADDRESSES;
    } catch {
      return SEED_ADDRESSES;
    }
  }

  private seedOrder(): Order {
    const subtotal = SEED_ITEMS.reduce((sum, item) => sum + item.price * item.qty, 0);
    return {
      id: "SD482913",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
      items: SEED_ITEMS,
      shops: ["Sharma Kirana Store"],
      subtotal,
      discount: 100,
      delivery: 0,
      total: subtotal - 100,
      payment: "UPI · aarav@okhdfcbank",
      slot: "express",
      address: SEED_ADDRESSES[0],
      status: "Delivered",
      eta: "Delivered in 38 minutes",
    };
  }
}
