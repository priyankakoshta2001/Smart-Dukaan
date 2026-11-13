export interface Category {
  slug: string;
  name: string;
  short: string;
  emoji: string;
  copy: string;
  tint: string;
  image: string;
}

export interface Shop {
  slug: string;
  name: string;
  initials: string;
  tagline: string;
  rating: number;
  reviews: number;
  distance: number;
  etaMin: number;
  etaMax: number;
  open: boolean;
  timing: string;
  area: string;
  city: string;
  since: number;
  verified: boolean;
  offers: string[];
  categories: string[];
  accent: string;
  featured: boolean;
}

export interface ShopReview {
  name: string;
  initials: string;
  rating: number;
  date: string;
  title: string;
  text: string;
  tint: string;
  helpful: number;
  verified: boolean;
}

export interface Product {
  id: number;
  slug: string;
  title: string;
  brand: string;
  category: string;
  sourceCategory: string;
  shopSlug: string;
  price: number;
  mrp: number;
  unit: string;
  rating: number;
  reviewCount: number;
  stock: number;
  image: string;
  images: string[];
  description: string;
  tags: string[];
  badge: string;
  highlights: string[];
  deliveryMin: number;
}

export interface CartLine {
  product: Product;
  qty: number;
}

export interface CartGroup {
  shop: Shop;
  lines: CartLine[];
  subtotal: number;
  mrp: number;
  count: number;
}

export interface Coupon {
  code: string;
  title: string;
  detail: string;
  min: number;
  percent?: number;
  flat?: number;
  max?: number;
  tone: string;
}

export interface Testimonial {
  name: string;
  city: string;
  quote: string;
  rating: number;
  initials: string;
  tint: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface BankOffer {
  name: string;
  offer: string;
  detail: string;
  tone: string;
}

export interface User {
  name: string;
  email: string;
  phone?: string;
  joined?: string;
}

export interface OrderItem {
  id: number;
  title: string;
  image: string;
  price: number;
  qty: number;
  unit: string;
  shopSlug: string;
  shopName: string;
}

export interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pin: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  createdAt: string;
  items: OrderItem[];
  shops: string[];
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  payment: string;
  slot: string;
  address: Address;
  status: "Packed" | "On the way" | "Delivered";
  eta: string;
}

export interface ToastMessage {
  id: number;
  text: string;
  tone: "success" | "error" | "info";
}

export interface Step {
  title: string;
  copy: string;
  icon: string;
}

export interface PolicySection {
  heading: string;
  body: string;
}

export interface Policy {
  slug: string;
  title: string;
  updated: string;
  intro: string;
  sections: PolicySection[];
}
