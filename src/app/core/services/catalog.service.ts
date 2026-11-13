import { computed, inject, Injectable, signal } from "@angular/core";
import { ApiProduct, CatalogApi } from "../api/catalog.api";
import { CATEGORIES, SHOPS, shopsForCity } from "../data/catalog";
import type { Category, Product, Shop } from "../models";
import { LocationService } from "./location.service";

export type CategoryView = Category & { count: number };
export type ShopView = Shop & { count: number };

const CACHE_KEY = "smartdukaan.catalog.v2";

interface ProductOverride {
  title: string;
  brand: string;
  unit: string;
}

const OVERRIDES: Record<number, ProductOverride> = {
  16: { title: "Kashmiri Apple", brand: "Farm Fresh", unit: "4 pcs (approx. 1 kg)" },
  20: { title: "Fortune Sunflower Oil", brand: "Fortune", unit: "1 L pouch" },
  21: { title: "Fresh Cucumber", brand: "Farm Fresh", unit: "500 g" },
  23: { title: "Farm Fresh Eggs", brand: "Eggoz", unit: "6 pcs" },
  25: { title: "Green Bell Pepper", brand: "Farm Fresh", unit: "500 g" },
  26: { title: "Green Chilli", brand: "Farm Fresh", unit: "250 g" },
  27: { title: "Dabur Honey", brand: "Dabur", unit: "500 g jar" },
  28: { title: "Amul Vanilla Ice Cream", brand: "Amul", unit: "700 ml tub" },
  29: { title: "Real Mixed Fruit Juice", brand: "Real", unit: "1 L tetra pack" },
  30: { title: "Fresh Kiwi", brand: "Farm Fresh", unit: "3 pcs" },
  31: { title: "Fresh Lemon", brand: "Farm Fresh", unit: "250 g" },
  32: { title: "Amul Taaza Toned Milk", brand: "Amul", unit: "500 ml" },
  33: { title: "Fresh Mulberry", brand: "Farm Fresh", unit: "250 g" },
  34: { title: "Nescafé Classic Coffee", brand: "Nescafé", unit: "100 g jar" },
  35: { title: "Fresh Potatoes", brand: "Farm Fresh", unit: "1 kg" },
  36: { title: "Oziva Protein Powder", brand: "Oziva", unit: "400 g" },
  37: { title: "Fresh Red Onions", brand: "Farm Fresh", unit: "1 kg" },
  38: { title: "India Gate Basmati Rice", brand: "India Gate", unit: "5 kg" },
  39: { title: "Coca-Cola Soft Drink", brand: "Coca-Cola", unit: "750 ml" },
  40: { title: "Fresh Strawberry", brand: "Farm Fresh", unit: "250 g" },
  41: { title: "Origami Tissue Box", brand: "Origami", unit: "100 pulls" },
  42: { title: "Bisleri Mineral Water", brand: "Bisleri", unit: "1 L" },
  44: { title: "Family Tree Photo Frame", brand: "Home Centre", unit: "1 frame" },
  45: { title: "House Showpiece Plant", brand: "Home Centre", unit: "1 pc" },
  46: { title: "Ceramic Plant Pot", brand: "Home Centre", unit: "1 pc" },
  47: { title: "Warm Table Lamp", brand: "Home Centre", unit: "1 pc" },
  118: { title: "Super Leaves Hand Soap", brand: "Attitude", unit: "473 ml" },
  119: { title: "Olay Ultra Moisture Body Wash", brand: "Olay", unit: "400 ml" },
  120: { title: "Vaseline Body & Face Lotion", brand: "Vaseline", unit: "400 ml" },
};

const PRODUCE_TITLES = [
  "apple",
  "cucumber",
  "bell pepper",
  "chili",
  "kiwi",
  "lemon",
  "mulberry",
  "potato",
  "onion",
  "strawberry",
];
const DAIRY_TITLES = ["milk", "eggs"];
const BEVERAGE_TITLES = ["juice", "coffee", "soft drink", "water"];
const STAPLE_TITLES = ["cooking oil", "rice", "protein"];
const WELLNESS_TITLES = ["honey", "protein", "hand soap"];
const HOUSEHOLD_TITLES = ["tissue"];

const EXCLUDED_IDS = new Set([17, 18, 19, 22, 24]); // beef, pet food, chicken, fish

const SEED_RAW: ApiProduct[] = [
  seed(16, "Apple", "groceries", 1.99, 4.19, "Fresh and crisp apples, perfect for snacking.", ["fruits"], "https://cdn.dummyjson.com/product-images/groceries/apple/thumbnail.webp"),
  seed(32, "Milk", "groceries", 3.49, 2.61, "Fresh and nutritious milk, a daily staple.", ["dairy"], "https://cdn.dummyjson.com/product-images/groceries/milk/thumbnail.webp"),
  seed(38, "Rice", "groceries", 5.99, 3.18, "High-quality rice, a versatile kitchen base.", ["grains"], "https://cdn.dummyjson.com/product-images/groceries/rice/thumbnail.webp"),
  seed(27, "Honey Jar", "groceries", 6.99, 3.97, "Pure and natural honey in a handy jar.", ["condiments"], "https://cdn.dummyjson.com/product-images/groceries/honey-jar/thumbnail.webp"),
  seed(20, "Cooking Oil", "groceries", 4.99, 4.8, "Versatile cooking oil for everyday meals.", ["cooking essentials"], "https://cdn.dummyjson.com/product-images/groceries/cooking-oil/thumbnail.webp"),
  seed(23, "Eggs", "groceries", 2.99, 2.53, "Fresh eggs for breakfast and baking.", ["dairy"], "https://cdn.dummyjson.com/product-images/groceries/eggs/thumbnail.webp"),
  seed(29, "Juice", "groceries", 3.99, 3.94, "Refreshing fruit juice packed with vitamins.", ["beverages"], "https://cdn.dummyjson.com/product-images/groceries/juice/thumbnail.webp"),
  seed(41, "Tissue Paper Box", "groceries", 2.49, 2.69, "Soft, absorbent tissues for everyday use.", ["household essentials"], "https://cdn.dummyjson.com/product-images/groceries/tissue-paper-box/thumbnail.webp"),
  seed(50, "Black Whisk", "kitchen-accessories", 6.99, 4.12, "Sturdy whisk for quick, smooth mixing.", [], "https://cdn.dummyjson.com/product-images/kitchen-accessories/black-whisk/thumbnail.webp"),
  seed(1, "Essence Mascara", "beauty", 9.99, 4.94, "Lash princess mascara for dramatic volume.", ["beauty"], "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp"),
  seed(120, "Vaseline Lotion", "skin-care", 8.99, 4.4, "Gentle body and face lotion for daily care.", ["skin care"], "https://cdn.dummyjson.com/product-images/skin-care/vaseline-men-body-and-face-lotion/thumbnail.webp"),
  seed(39, "Soft Drinks", "groceries", 1.99, 4.75, "Assorted soft drinks, chilled and refreshing.", ["beverages"], "https://cdn.dummyjson.com/product-images/groceries/soft-drinks/thumbnail.webp"),
];

function seed(
  id: number,
  title: string,
  category: string,
  price: number,
  rating: number,
  description: string,
  tags: string[],
  thumbnail: string,
): ApiProduct {
  return {
    id,
    title,
    description,
    category,
    price,
    discountPercentage: 10,
    rating,
    stock: 30,
    tags,
    images: [thumbnail],
    thumbnail,
  };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function resolveCategory(product: ApiProduct): string {
  const title = product.title.toLowerCase();
  if (product.category === "groceries") {
    if (PRODUCE_TITLES.some((word) => title.includes(word))) return "fruits-vegetables";
    if (DAIRY_TITLES.some((word) => title.includes(word))) return "dairy";
    if (BEVERAGE_TITLES.some((word) => title.includes(word))) return "beverages";
    if (STAPLE_TITLES.some((word) => title.includes(word))) return "atta-rice-pulses";
    if (WELLNESS_TITLES.some((word) => title.includes(word))) return "ayurveda";
    if (HOUSEHOLD_TITLES.some((word) => title.includes(word))) return "household";
    if (title.includes("ice cream")) return "snacks";
    return "grocery";
  }
  if (product.category === "kitchen-accessories") return "home-care";
  if (product.category === "home-decoration") return "household";
  if (product.category === "beauty" || product.category === "fragrances") return "personal-care";
  if (product.category === "skin-care") return "baby-care";
  return "grocery";
}

function unitFor(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("milk")) return "500 ml";
  if (lower.includes("rice")) return "5 kg";
  if (lower.includes("oil")) return "1 L pouch";
  if (lower.includes("water")) return "1 L";
  if (lower.includes("juice")) return "1 L";
  if (lower.includes("soft drink")) return "750 ml";
  if (lower.includes("eggs")) return "6 pcs";
  if (lower.includes("honey")) return "500 g jar";
  if (lower.includes("ice cream")) return "700 ml tub";
  if (lower.includes("coffee")) return "100 g jar";
  if (lower.includes("tissue")) return "100 pulls";
  if (lower.includes("apple") || lower.includes("potato") || lower.includes("onion")) return "1 kg";
  if (lower.includes("strawberry") || lower.includes("mulberry") || lower.includes("chilli")) return "250 g";
  if (lower.includes("cucumber") || lower.includes("pepper")) return "500 g";
  if (lower.includes("kiwi")) return "3 pcs";
  if (lower.includes("lemon")) return "250 g";
  if (lower.includes("protein")) return "400 g";
  return "1 pack";
}

function badgeFor(product: ApiProduct, category: string): string {
  if (category === "fruits-vegetables") return "Farm fresh";
  if (product.rating >= 4.7) return "Bestseller";
  if (product.discountPercentage >= 15) return `${Math.round(product.discountPercentage)}% OFF`;
  if (product.id % 7 === 0) return "Popular";
  return "";
}

@Injectable({ providedIn: "root" })
export class CatalogService {
  private readonly api = inject(CatalogApi);
  private readonly location = inject(LocationService);

  readonly products = signal<Product[]>(this.restoreCache());
  readonly loading = signal(this.products().length === 0);
  readonly error = signal(false);

  readonly shops = computed<Shop[]>(() => shopsForCity(this.location.city()));
  readonly categories = CATEGORIES;

  readonly categoryViews = computed<CategoryView[]>(() =>
    CATEGORIES.map((category) => ({
      ...category,
      count: this.productsForCategory(category.slug).length,
    })),
  );

  readonly shopViews = computed<ShopView[]>(() =>
    this.shops().map((shop) => ({
      ...shop,
      count: this.products().filter((product) => product.shopSlug === shop.slug).length,
    })),
  );

  readonly featuredShops = computed<ShopView[]>(() =>
    this.shopViews().filter((shop) => shop.featured),
  );

  readonly bestsellers = computed<Product[]>(() =>
    [...this.products()].sort((a, b) => b.rating - a.rating).slice(0, 12),
  );

  readonly freshPicks = computed<Product[]>(() =>
    this.productsForCategory("fruits-vegetables").slice(0, 12),
  );

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.api.all().subscribe({
      next: (raw) => {
        const clean = raw.filter(
          (product) =>
            !EXCLUDED_IDS.has(product.id) &&
            ["groceries", "kitchen-accessories", "home-decoration", "beauty", "skin-care", "fragrances"].includes(
              product.category,
            ),
        );
        const mapped = this.mapAll(clean.length ? clean : SEED_RAW);
        this.products.set(mapped);
        this.loading.set(false);
        this.saveCache(mapped);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
        if (!this.products().length) this.products.set(this.mapAll(SEED_RAW));
      },
    });
  }

  byId(id: number): Product | undefined {
    return this.products().find((product) => product.id === id);
  }

  bySlug(slug: string): Product | undefined {
    return this.products().find((product) => product.slug === slug);
  }

  shop(slug: string): Shop | undefined {
    return this.shops().find((shop) => shop.slug === slug);
  }

  shopFor(product: Product): Shop | undefined {
    return this.shop(product.shopSlug);
  }

  productsForShop(slug: string): Product[] {
    return this.products().filter((product) => product.shopSlug === slug);
  }

  productsForCategory(slug: string): Product[] {
    if (slug === "grocery") {
      return this.products().filter(
        (product) => product.sourceCategory === "groceries" || product.category === "grocery",
      );
    }
    return this.products().filter((product) => product.category === slug);
  }

  related(product: Product, limit = 4): Product[] {
    const ranked = this.products().filter(
      (item) =>
        item.id !== product.id &&
        (item.category === product.category || item.shopSlug === product.shopSlug),
    );
    return ranked.sort((a, b) => b.rating - a.rating).slice(0, limit);
  }

  searchProducts(term: string, limit = 8): Product[] {
    const query = term.trim().toLowerCase();
    if (!query) return [];
    return this.products()
      .filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          product.category.includes(query),
      )
      .slice(0, limit);
  }

  matchingShops(term: string): Shop[] {
    const query = term.trim().toLowerCase();
    if (!query) return [];
    return this.shops().filter(
      (shop) =>
        shop.name.toLowerCase().includes(query) ||
        shop.area.toLowerCase().includes(query) ||
        shop.tagline.toLowerCase().includes(query),
    ).slice(0, 4);
  }

  categoryName(slug: string): string {
    return CATEGORIES.find((category) => category.slug === slug)?.short ?? slug;
  }

  categoryLabel(slug: string): string {
    return CATEGORIES.find((category) => category.slug === slug)?.name ?? slug;
  }

  private mapAll(raw: ApiProduct[]): Product[] {
    return raw.map((item) => this.mapProduct(item));
  }

  private mapProduct(item: ApiProduct): Product {
    const override = OVERRIDES[item.id];
    const title = override?.title ?? item.title;
    const brand = override?.brand ?? item.brand ?? "Smart Dukaan";
    const unit = override?.unit ?? unitFor(title);
    const category = resolveCategory(item);
    const shop = SHOPS[item.id % SHOPS.length];
    const price = Math.max(9, Math.round((item.price * 28) / 5) * 5 - 1);
    const discount = Math.max(8, Math.min(32, Math.round(item.discountPercentage)));
    const mrp = Math.max(price + 5, Math.round(price / (1 - discount / 100)));
    const image = item.thumbnail || item.images[0] || "";
    const images = item.images.length ? item.images : [image];

    return {
      id: item.id,
      slug: `${slugify(title)}-${item.id}`,
      title,
      brand,
      category,
      sourceCategory: item.category,
      shopSlug: shop.slug,
      price,
      mrp,
      unit,
      rating: Math.round(item.rating * 10) / 10,
      reviewCount: 40 + ((item.id * 53) % 900),
      stock: item.stock,
      image,
      images,
      description: `${item.description} Handpicked from ${shop.name} — packed fresh and delivered with care.`,
      tags: [...item.tags, category],
      badge: badgeFor(item, category),
      highlights: [
        `Freshly packed at ${shop.name}`,
        `Delivery in ${shop.etaMin}–${shop.etaMax} minutes`,
        "Replacement within 24 hours, no questions asked",
      ],
      deliveryMin: shop.etaMin,
    };
  }

  private saveCache(products: Product[]): void {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(products));
    } catch {
      /* storage full or unavailable — the live feed still works */
    }
  }

  private restoreCache(): Product[] {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      const parsed = raw ? (JSON.parse(raw) as Product[]) : [];
      return Array.isArray(parsed) ? parsed.filter((product) => !!product.slug) : [];
    } catch {
      return [];
    }
  }
}
