import type { Routes } from "@angular/router";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";
import { MainLayoutComponent } from "./layouts/main-layout/main-layout.component";

export const routes: Routes = [
  {
    path: "login",
    component: AuthLayoutComponent,
    children: [
      {
        path: "",
        loadComponent: () => import("./features/auth/auth/auth.page").then((m) => m.AuthPage),
        title: "Sign in · Smart Dukaan",
        data: { mode: "login" },
      },
    ],
  },
  {
    path: "register",
    component: AuthLayoutComponent,
    children: [
      {
        path: "",
        loadComponent: () => import("./features/auth/auth/auth.page").then((m) => m.AuthPage),
        title: "Create account · Smart Dukaan",
        data: { mode: "register" },
      },
    ],
  },
  {
    path: "",
    component: MainLayoutComponent,
    children: [
      {
        path: "",
        loadComponent: () => import("./features/home/home.page").then((m) => m.HomePage),
        title: "Smart Dukaan — Your Local Shops, Now Online",
      },
      {
        path: "shop",
        loadComponent: () => import("./features/shop/shop.page").then((m) => m.ShopPage),
        title: "Shop everything · Smart Dukaan",
      },
      {
        path: "shops",
        loadComponent: () => import("./features/shops/shops.page").then((m) => m.ShopsPage),
        title: "Nearby shops · Smart Dukaan",
      },
      {
        path: "how-it-works",
        loadComponent: () => import("./features/how-it-works/how-it-works.page").then((m) => m.HowItWorksPage),
        title: "How it works · Smart Dukaan",
      },
      {
        path: "for-shopkeepers",
        loadComponent: () =>
          import("./features/for-shopkeepers/for-shopkeepers.page").then((m) => m.ForShopkeepersPage),
        title: "For Shopkeepers · Smart Dukaan",
      },
      {
        path: "for-delivery-partners",
        loadComponent: () =>
          import("./features/for-delivery-partners/for-delivery-partners.page").then(
            (m) => m.ForDeliveryPartnersPage,
          ),
        title: "For Delivery Partners · Smart Dukaan",
      },
      {
        path: "features",
        loadComponent: () => import("./features/features/features.page").then((m) => m.FeaturesPage),
        title: "Features · Smart Dukaan",
      },
      {
        path: "store/:slug/offers",
        loadComponent: () =>
          import("./features/store/store-offers/store-offers.page").then((m) => m.StoreOffersPage),
        title: "Store offers · Smart Dukaan",
      },
      {
        path: "store/:slug/about",
        loadComponent: () =>
          import("./features/store/store-about/store-about.page").then((m) => m.StoreAboutPage),
        title: "About the store · Smart Dukaan",
      },
      {
        path: "store/:slug/reviews",
        loadComponent: () =>
          import("./features/store/store-reviews/store-reviews.page").then((m) => m.StoreReviewsPage),
        title: "Store reviews · Smart Dukaan",
      },
      {
        path: "store/:slug",
        loadComponent: () => import("./features/store/store.page").then((m) => m.StorePage),
        title: "Store · Smart Dukaan",
      },
      {
        path: "product/:slug",
        loadComponent: () => import("./features/product/product.page").then((m) => m.ProductPage),
        title: "Product · Smart Dukaan",
      },
      {
        path: "cart",
        loadComponent: () => import("./features/cart/cart.page").then((m) => m.CartPage),
        title: "Your basket · Smart Dukaan",
      },
      {
        path: "checkout",
        loadComponent: () => import("./features/checkout/checkout.page").then((m) => m.CheckoutPage),
        title: "Secure checkout · Smart Dukaan",
      },
      {
        path: "order-success/:id",
        loadComponent: () =>
          import("./features/order-success/order-success.page").then((m) => m.OrderSuccessPage),
        title: "Order confirmed · Smart Dukaan",
      },
      {
        path: "offers",
        loadComponent: () => import("./features/offers/offers.page").then((m) => m.OffersPage),
        title: "Offers & coupons · Smart Dukaan",
      },
      {
        path: "wishlist",
        loadComponent: () => import("./features/wishlist/wishlist.page").then((m) => m.WishlistPage),
        title: "Your wishlist · Smart Dukaan",
      },
      {
        path: "account",
        loadComponent: () => import("./features/account/account.page").then((m) => m.AccountPage),
        title: "My account · Smart Dukaan",
      },
      {
        path: "about",
        loadComponent: () => import("./features/about/about.page").then((m) => m.AboutPage),
        title: "Our story · Smart Dukaan",
      },
      {
        path: "contact",
        loadComponent: () => import("./features/contact/contact.page").then((m) => m.ContactPage),
        title: "Contact us · Smart Dukaan",
      },
      {
        path: "help",
        loadComponent: () => import("./features/help/help.page").then((m) => m.HelpPage),
        title: "Help centre · Smart Dukaan",
      },
      {
        path: "policy/:slug",
        loadComponent: () => import("./features/policy/policy.page").then((m) => m.PolicyPage),
        title: "Policies · Smart Dukaan",
      },
    ],
  },
  {
    path: "**",
    component: MainLayoutComponent,
    children: [
      {
        path: "**",
        loadComponent: () => import("./features/not-found/not-found.page").then((m) => m.NotFoundPage),
        title: "Page not found · Smart Dukaan",
      },
    ],
  },
];
