import type {
  BankOffer,
  Category,
  Coupon,
  Faq,
  Policy,
  Shop,
  ShopReview,
  Step,
  Testimonial,
} from "../models";

/* ------------------------------------------------------------------ cities */
export interface City {
  name: string;
  state: string;
  available: boolean;
}

export const CITIES: City[] = [
  { name: "Jabalpur", state: "MP", available: true },
  { name: "Bhopal", state: "MP", available: true },
  { name: "Indore", state: "MP", available: true },
  { name: "Nagpur", state: "MH", available: false },
  { name: "Raipur", state: "CG", available: false },
];

/* -------------------------------------------------------------- categories */
export const CATEGORIES: Category[] = [
  {
    slug: "grocery",
    name: "Grocery",
    short: "Grocery",
    emoji: "🛒",
    copy: "Everyday kitchen staples",
    tint: "from-brand-50 to-brand-100",
    image: "https://cdn.dummyjson.com/product-images/groceries/honey-jar/thumbnail.webp",
  },
  {
    slug: "dairy",
    name: "Dairy & Breakfast",
    short: "Dairy",
    emoji: "🥛",
    copy: "Milk, curd, paneer & more",
    tint: "from-brand-50 to-brand-100",
    image: "https://cdn.dummyjson.com/product-images/groceries/milk/thumbnail.webp",
  },
  {
    slug: "snacks",
    name: "Snacks & Munchies",
    short: "Snacks",
    emoji: "🍿",
    copy: "Cravings, sorted",
    tint: "from-brand-50 to-brand-100",
    image: "https://cdn.dummyjson.com/product-images/groceries/ice-cream/thumbnail.webp",
  },
  {
    slug: "fruits-vegetables",
    name: "Fruits & Vegetables",
    short: "Fruits & Vegetables",
    emoji: "🥬",
    copy: "Farm fresh, delivered local",
    tint: "from-brand-50 to-brand-100",
    image: "https://cdn.dummyjson.com/product-images/groceries/apple/thumbnail.webp",
  },
  {
    slug: "personal-care",
    name: "Personal Care",
    short: "Personal Care",
    emoji: "🧴",
    copy: "Daily care & beauty",
    tint: "from-brand-50 to-brand-100",
    image: "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
  },
  {
    slug: "baby-care",
    name: "Baby & Mom Care",
    short: "Baby Care",
    emoji: "🍼",
    copy: "Gentle care for little ones",
    tint: "from-brand-50 to-brand-100",
    image: "https://cdn.dummyjson.com/product-images/skin-care/vaseline-men-body-and-face-lotion/thumbnail.webp",
  },
  {
    slug: "atta-rice-pulses",
    name: "Atta, Rice & Pulses",
    short: "Atta, Rice & Pulses",
    emoji: "🌾",
    copy: "Kitchen staples, stock up",
    tint: "from-brand-50 to-brand-100",
    image: "https://cdn.dummyjson.com/product-images/groceries/rice/thumbnail.webp",
  },
  {
    slug: "ayurveda",
    name: "Ayurveda & Wellness",
    short: "Ayurveda",
    emoji: "🌿",
    copy: "Natural, everyday wellness",
    tint: "from-brand-50 to-brand-100",
    image: "https://cdn.dummyjson.com/product-images/groceries/protein-powder/thumbnail.webp",
  },
  {
    slug: "home-care",
    name: "Home & Kitchen",
    short: "Home Care",
    emoji: "🏠",
    copy: "Make everyday special",
    tint: "from-brand-50 to-brand-100",
    image: "https://cdn.dummyjson.com/product-images/kitchen-accessories/black-whisk/thumbnail.webp",
  },
  {
    slug: "beverages",
    name: "Beverages",
    short: "Beverages",
    emoji: "🧃",
    copy: "Chai, juice & cold drinks",
    tint: "from-brand-50 to-brand-100",
    image: "https://cdn.dummyjson.com/product-images/groceries/juice/thumbnail.webp",
  },
  {
    slug: "household",
    name: "Household Essentials",
    short: "Household",
    emoji: "🧻",
    copy: "Clean home, happy home",
    tint: "from-brand-50 to-brand-100",
    image: "https://cdn.dummyjson.com/product-images/groceries/tissue-paper-box/thumbnail.webp",
  },
];

/* ------------------------------------------------------------------- shops */
export const SHOPS: Shop[] = [
  {
    slug: "sharma-kirana-store",
    name: "Sharma Kirana Store",
    initials: "SK",
    tagline: "Your neighbourhood kirana since 1998",
    rating: 4.6,
    reviews: 3620,
    distance: 0.5,
    etaMin: 30,
    etaMax: 45,
    open: true,
    timing: "7:00 AM – 10:00 PM",
    area: "Napier Town",
    city: "Jabalpur",
    since: 1998,
    verified: true,
    offers: ["Flat 5% OFF on orders above ₹199", "Free delivery on orders above ₹799"],
    categories: ["grocery", "dairy", "beverages", "household", "atta-rice-pulses", "snacks"],
    accent: "from-brand-500 via-brand-600 to-brand-800",
    featured: true,
  },
  {
    slug: "gupta-general-store",
    name: "Gupta General Store",
    initials: "GG",
    tagline: "Everyday essentials, right around the corner",
    rating: 4.4,
    reviews: 2140,
    distance: 0.8,
    etaMin: 30,
    etaMax: 40,
    open: true,
    timing: "8:00 AM – 9:30 PM",
    area: "Wright Town",
    city: "Jabalpur",
    since: 2004,
    verified: true,
    offers: ["₹40 OFF on orders above ₹399", "Buy 2 get 1 on selected snacks"],
    categories: ["grocery", "snacks", "beverages", "personal-care", "baby-care", "household"],
    accent: "from-brand-600 via-brand-700 to-brand-900",
    featured: true,
  },
  {
    slug: "agarwal-kirana",
    name: "Agarwal Kirana",
    initials: "AK",
    tagline: "Fresh stock, honest prices",
    rating: 4.3,
    reviews: 1280,
    distance: 1.2,
    etaMin: 40,
    etaMax: 50,
    open: true,
    timing: "7:30 AM – 9:00 PM",
    area: "Gwarighat",
    city: "Jabalpur",
    since: 2010,
    verified: true,
    offers: ["Flat 10% OFF on dairy", "Free delivery on orders above ₹499"],
    categories: ["grocery", "dairy", "fruits-vegetables", "atta-rice-pulses", "household"],
    accent: "from-brand-500 via-brand-700 to-brand-950",
    featured: true,
  },
  {
    slug: "patel-kirana-general",
    name: "Patel Kirana & General",
    initials: "PK",
    tagline: "A little shop with a big heart",
    rating: 4.2,
    reviews: 980,
    distance: 1.8,
    etaMin: 40,
    etaMax: 60,
    open: true,
    timing: "8:00 AM – 10:00 PM",
    area: "Vijay Nagar",
    city: "Jabalpur",
    since: 2012,
    verified: true,
    offers: ["₹25 OFF on orders above ₹249", "5% off on all staples"],
    categories: ["grocery", "snacks", "beverages", "personal-care", "home-care"],
    accent: "from-brand-400 via-brand-600 to-brand-800",
    featured: true,
  },
  {
    slug: "mishra-supermart",
    name: "Mishra Supermart",
    initials: "MS",
    tagline: "Your weekly stock-up destination",
    rating: 4.5,
    reviews: 5400,
    distance: 1.4,
    etaMin: 35,
    etaMax: 50,
    open: true,
    timing: "7:00 AM – 11:00 PM",
    area: "Adhartal",
    city: "Jabalpur",
    since: 2016,
    verified: true,
    offers: ["Flat ₹75 OFF on orders above ₹699", "Free delivery on orders above ₹599"],
    categories: ["grocery", "dairy", "fruits-vegetables", "home-care", "beverages", "household"],
    accent: "from-brand-600 via-brand-700 to-brand-900",
    featured: false,
  },
  {
    slug: "jain-fresh-mart",
    name: "Jain Fresh Mart",
    initials: "JF",
    tagline: "Farm-fresh produce, every morning",
    rating: 4.7,
    reviews: 2860,
    distance: 0.9,
    etaMin: 25,
    etaMax: 40,
    open: true,
    timing: "6:30 AM – 9:00 PM",
    area: "Sadar",
    city: "Jabalpur",
    since: 2018,
    verified: true,
    offers: ["Fresh fruits at 10% off", "Free delivery on orders above ₹399"],
    categories: ["fruits-vegetables", "dairy", "grocery", "atta-rice-pulses", "ayurveda"],
    accent: "from-brand-500 via-brand-600 to-brand-800",
    featured: false,
  },
];

/* ----------------------------------------------------------- city shop map */
const CITY_AREAS: Record<string, string[]> = {
  Jabalpur: ["Napier Town", "Wright Town", "Gwarighat", "Vijay Nagar", "Adhartal", "Sadar"],
  Bhopal: ["Arera Colony", "New Market", "MP Nagar", "Kolar Road", "Bairagarh", "Shahpura"],
  Indore: ["Vijay Nagar", "Palasia", "Sudama Nagar", "Bhawarkuan", "Rau", "Vishranti Nagar"],
  Nagpur: ["Dharampeth", "Sadar", "Manish Nagar", "Wardha Road", "Hingna", "Sitabuldi"],
  Raipur: ["Pandri", "Shankar Nagar", "Telibandha", "Devendra Nagar", "Kabir Nagar", "Amanaka"],
};

/** The same trusted shop network, mapped to the neighbourhoods of the selected city. */
export function shopsForCity(city: string): Shop[] {
  const areas = CITY_AREAS[city] ?? CITY_AREAS["Jabalpur"];
  return SHOPS.map((shop, index) => ({
    ...shop,
    city,
    area: areas[index % areas.length],
  }));
}

/* ---------------------------------------------------------------- shop owners */
export const SHOP_OWNERS: Record<string, string> = {
  "sharma-kirana-store": "Ramesh Sharma",
  "gupta-general-store": "Suresh Gupta",
  "agarwal-kirana": "Vikas Agarwal",
  "patel-kirana-general": "Kiran Patel",
  "mishra-supermart": "Anand Mishra",
  "jain-fresh-mart": "Meera Jain",
};

/* -------------------------------------------------------------- shop reviews */
export const SHOP_REVIEWS: Record<string, ShopReview[]> = {
  "sharma-kirana-store": [
    {
      name: "Priya Verma",
      initials: "PV",
      rating: 5,
      date: "2 days ago",
      title: "Fresh milk, super fast delivery",
      text: "Milk and vegetables were delivered in 32 minutes. Everything was fresh and the packaging was neat. Sharma ji ne khud call karke batcha ki full cream aa gayi hai.",
      tint: "from-brand-400 to-brand-600",
      helpful: 48,
      verified: true,
    },
    {
      name: "Rahul Jain",
      initials: "RJ",
      rating: 4,
      date: "1 week ago",
      title: "Fair prices, honest shopkeeper",
      text: "Great local shop. Prices are fair and the shopkeeper calls if something is out of stock instead of silently replacing items.",
      tint: "from-brand-500 to-brand-700",
      helpful: 31,
      verified: true,
    },
    {
      name: "Ananya Singh",
      initials: "AS",
      rating: 5,
      date: "2 weeks ago",
      title: "One cart, multiple shops — genius",
      text: "Ordered from three shops in one cart and paid one delivery fee. This is how local shopping should work. Restock of atta and dal was needed urgently — got it in 40 mins.",
      tint: "from-brand-600 to-brand-800",
      helpful: 67,
      verified: true,
    },
    {
      name: "Mohammed Faiz",
      initials: "MF",
      rating: 4,
      date: "3 weeks ago",
      title: "Good for monthly staples",
      text: "Monthly ration order of ₹2,400 delivered the same evening. MRP se thoda sasta mila with the store discount. Packing could use less plastic though.",
      tint: "from-brand-400 to-brand-700",
      helpful: 22,
      verified: false,
    },
    {
      name: "Kavita Deshmukh",
      initials: "KD",
      rating: 5,
      date: "1 month ago",
      title: "My go-to kirana now",
      text: "27 saal se Sharma ji ka dukaan hamara hai — ab app se bhi wahi bharosa. Delivery boy polite, items fresh, bill proper.",
      tint: "from-brand-500 to-brand-800",
      helpful: 55,
      verified: true,
    },
  ],
  "gupta-general-store": [
    {
      name: "Sneha Khandelwal",
      initials: "SK",
      rating: 5,
      date: "4 days ago",
      title: "Snacks heaven!",
      text: "Buy 2 get 1 on snacks ne mera bachhon ka tiffin problem solve kar diya. Delivery bhi time pe aayi, sab sealed tha.",
      tint: "from-brand-600 to-brand-900",
      helpful: 39,
      verified: true,
    },
    {
      name: "Deepak Ahuja",
      initials: "DA",
      rating: 4,
      date: "1 week ago",
      title: "Reliable for daily needs",
      text: "Order dairy + biscuits + soap together — one basket, one trip. Only wish they stocked more baby-care brands.",
      tint: "from-brand-500 to-brand-700",
      helpful: 18,
      verified: true,
    },
    {
      name: "Farah Khan",
      initials: "FK",
      rating: 5,
      date: "2 weeks ago",
      title: "₹40 off coupon worked instantly",
      text: "Coupon apply hote hi discount dikh gaya. Rider ne saman doorstep pe hi rakha aur photo bhi bheja. Very professional.",
      tint: "from-brand-300 to-brand-600",
      helpful: 27,
      verified: true,
    },
    {
      name: "Vivek Tiwari",
      initials: "VT",
      rating: 3,
      date: "3 weeks ago",
      title: "Good shop, one late delivery",
      text: "Ek baar order 20 min late tha kyunki raat ko rush tha. Shopkeeper ne personally maafi maangi aur extra chips bheje. Fair enough.",
      tint: "from-brand-500 to-brand-700",
      helpful: 12,
      verified: false,
    },
    {
      name: "Ritu Malviya",
      initials: "RM",
      rating: 5,
      date: "1 month ago",
      title: "Personal care section is genuine",
      text: "Fake products ka darr tha, par sab original mila with proper batch numbers. Price bhi market se kam.",
      tint: "from-brand-400 to-brand-600",
      helpful: 44,
      verified: true,
    },
  ],
  "agarwal-kirana": [
    {
      name: "Neha Agrawal",
      initials: "NA",
      rating: 5,
      date: "3 days ago",
      title: "Dairy at 10% off, always fresh",
      text: "Amul Taaza har subah fresh aata hai aur 10% dairy discount regular hai. Paneer bhi lete hain — kabhi stale nahi mila.",
      tint: "from-brand-500 to-brand-800",
      helpful: 52,
      verified: true,
    },
    {
      name: "Amit Bhargava",
      initials: "AB",
      rating: 4,
      date: "1 week ago",
      title: "Honest prices as promised",
      text: "Tagline sach hai — 'fresh stock, honest prices'. Local rate list se compare kiya, koi hidden charge nahi tha bill me.",
      tint: "from-brand-500 to-brand-700",
      helpful: 24,
      verified: true,
    },
    {
      name: "Shalini Rao",
      initials: "SR",
      rating: 5,
      date: "2 weeks ago",
      title: "Free delivery above ₹499 saves us",
      text: "Hamara weekly order ₹600+ ka hota hai to delivery free ho jaati hai. Gwarighat se aane jaane ka time bhi bach gaya.",
      tint: "from-brand-600 to-brand-800",
      helpful: 36,
      verified: true,
    },
    {
      name: "Prakash Sahu",
      initials: "PS",
      rating: 4,
      date: "1 month ago",
      title: "Good shop, wants more variety",
      text: "Sabzi achhi hai par exotic items nahi milte. Baaki service, packing aur delivery timing sab perfect hai.",
      tint: "from-brand-400 to-brand-700",
      helpful: 15,
      verified: false,
    },
    {
      name: "Ishita Dwivedi",
      initials: "ID",
      rating: 5,
      date: "1 month ago",
      title: "My mother's favourite",
      text: "Mummy kehta hain Agarwal ji ka bharosa sabse zyada hai. App pe unka store dekh ke hi order karti hain ab.",
      tint: "from-brand-500 to-brand-800",
      helpful: 41,
      verified: true,
    },
  ],
  "patel-kirana-general": [
    {
      name: "Jayesh Patel",
      initials: "JP",
      rating: 4,
      date: "5 days ago",
      title: "₹25 off on small orders is nice",
      text: "₹250 ka order karke ₹25 off mila. Chhota sa ghar hai, bade orders ki zaroorat nahi — ye shop perfect hai hamare liye.",
      tint: "from-brand-400 to-brand-700",
      helpful: 19,
      verified: true,
    },
    {
      name: "Pooja Nair",
      initials: "PN",
      rating: 5,
      date: "1 week ago",
      title: "5% staples discount adds up",
      text: "Atta, rice, dal sab pe 5% — monthly bill me ₹150–200 bach jaata hai. Quality bhi achhi rakhte hain.",
      tint: "from-brand-400 to-brand-600",
      helpful: 33,
      verified: true,
    },
    {
      name: "Ravi Chandrakar",
      initials: "RC",
      rating: 4,
      date: "2 weeks ago",
      title: "Big heart, small shop",
      text: "Ek item galat aaya tha, next delivery me replace kar diye bina argue kiye. Isi liye yahan se order karta hoon.",
      tint: "from-brand-600 to-brand-800",
      helpful: 28,
      verified: true,
    },
    {
      name: "Tanvi Shukla",
      initials: "TS",
      rating: 3,
      date: "3 weeks ago",
      title: "Late evening orders work",
      text: "10 PM tak open hona plus point hai. Ek baar rider ne wrong address pe jaake wapas aana pada — thoda late ho gaya.",
      tint: "from-brand-500 to-brand-700",
      helpful: 9,
      verified: false,
    },
    {
      name: "Harsh Baghel",
      initials: "HB",
      rating: 5,
      date: "1 month ago",
      title: "Vijay Nagar's most convenient",
      text: "Petrol bach gaya, time bach gaya, aur home-care items market rate pe hi mile. Ab bi-weekly order fix hai.",
      tint: "from-brand-400 to-brand-700",
      helpful: 23,
      verified: true,
    },
  ],
  "mishra-supermart": [
    {
      name: "Abhishek Sinha",
      initials: "AS",
      rating: 5,
      date: "1 day ago",
      title: "Weekly stock-up sorted",
      text: "₹2,800 ka weekly order — ₹75 off laga, free delivery mili, aur 40 min me ghar pohancha. Supermart ka naam justified hai.",
      tint: "from-brand-600 to-brand-800",
      helpful: 61,
      verified: true,
    },
    {
      name: "Meenakshi Iyer",
      initials: "MI",
      rating: 5,
      date: "4 days ago",
      title: "Best variety in Adhartal",
      text: "Household se lekar beverages tak — sab ek jagah. Replacement policy bhi smooth hai, 24 ghante me ho jaata hai.",
      tint: "from-brand-400 to-brand-700",
      helpful: 47,
      verified: true,
    },
    {
      name: "Rohan Kachhi",
      initials: "RK",
      rating: 4,
      date: "1 week ago",
      title: "Great shop, wants earlier slots",
      text: "7 AM se open hai par delivery slots subah 8 baje se shuru hote hain. Office jaane se pehle order karna mushkil hai.",
      tint: "from-brand-500 to-brand-700",
      helpful: 26,
      verified: true,
    },
    {
      name: "Divya Bhatt",
      initials: "DB",
      rating: 5,
      date: "2 weeks ago",
      title: "Fruits were genuinely fresh",
      text: "Photo me jo dikhta hai wahi aata hai — kya kehna. Kela aur seb dono perfect ripeness pe the.",
      tint: "from-brand-600 to-brand-800",
      helpful: 38,
      verified: true,
    },
    {
      name: "Sameer Qureshi",
      initials: "SQ",
      rating: 4,
      date: "3 weeks ago",
      title: "5,400 reviews make sense",
      text: "Bulk pricing + monthly deals. Ek chhota complaint: weekends pe customer support thoda slow respond karta hai.",
      tint: "from-brand-300 to-brand-600",
      helpful: 17,
      verified: false,
    },
  ],
  "jain-fresh-mart": [
    {
      name: "Aparna Soni",
      initials: "AS",
      rating: 5,
      date: "2 days ago",
      title: "Sabzi mandi se better",
      text: "Subah 6:30 baje takad ke fresh stock — meetha mazaa aur palak itne fresh the mano abhi khet se aaye honain. 25 min delivery!",
      tint: "from-brand-400 to-brand-700",
      helpful: 73,
      verified: true,
    },
    {
      name: "Kunal Bansal",
      initials: "KB",
      rating: 5,
      date: "5 days ago",
      title: "10% off fruits, every time",
      text: "Fruits pe regular 10% discount — quality maintain karte hain isliye har hafte order karta hoon. Photo aur actual bilkul same.",
      tint: "from-brand-400 to-brand-700",
      helpful: 59,
      verified: true,
    },
    {
      name: "Swati Pandey",
      initials: "SP",
      rating: 4,
      date: "1 week ago",
      title: "Farm fresh promise kept",
      text: "Sirf ek baar tamatar thoda kaccha tha, baaki sab items top quality. Sadar me best fresh store hai ye.",
      tint: "from-brand-500 to-brand-700",
      helpful: 29,
      verified: true,
    },
    {
      name: "Nishant Verma",
      initials: "NV",
      rating: 5,
      date: "2 weeks ago",
      title: "Ayurveda section surprise",
      text: "Fresh market me ayurveda section dekh kar surprise hua — honey aur churne genuine mile. Meera ji ne recommend bhi kiya.",
      tint: "from-brand-500 to-brand-800",
      helpful: 35,
      verified: true,
    },
    {
      name: "Geeta Asati",
      initials: "GA",
      rating: 5,
      date: "3 weeks ago",
      title: "4.7 stars well earned",
      text: "Sabse clean aur organized store app pe bhi. Sirf 399 pe free delivery — jitna order karo utna fayda.",
      tint: "from-brand-600 to-brand-800",
      helpful: 42,
      verified: true,
    },
  ],
};

/** Customer reviews for a shop (falls back to an empty list). */
export function reviewsForShop(slug: string): ShopReview[] {
  return SHOP_REVIEWS[slug] ?? [];
}

export const STORE_HIGHLIGHTS = [
  "Verified local shop",
  "Quality checked",
  "Same-day delivery",
  "Easy returns",
];

/* ----------------------------------------------------------------- coupons */
export const COUPONS: Coupon[] = [
  {
    code: "SMART50",
    title: "50% OFF your order",
    detail: "Up to ₹150 off on orders above ₹499",
    min: 499,
    percent: 50,
    max: 150,
    tone: "green",
  },
  {
    code: "FRESH20",
    title: "20% OFF on fresh picks",
    detail: "Up to ₹100 off on orders above ₹299",
    min: 299,
    percent: 20,
    max: 100,
    tone: "lime",
  },
  {
    code: "NEW100",
    title: "Flat ₹100 OFF",
    detail: "On your first order above ₹399",
    min: 399,
    flat: 100,
    tone: "sun",
  },
  {
    code: "PARTY10",
    title: "10% OFF on snacks & drinks",
    detail: "Up to ₹60 off on orders above ₹199",
    min: 199,
    percent: 10,
    max: 60,
    tone: "rose",
  },
];

/* --------------------------------------------------------------- bank offers */
export const BANK_OFFERS: BankOffer[] = [
  {
    name: "HDFC Bank",
    offer: "10% instant discount",
    detail: "On credit cards, min order ₹899. Max ₹150 off.",
    tone: "from-brand-50 to-white",
  },
  {
    name: "ICICI Bank",
    offer: "₹75 cashback",
    detail: "On UPI payments above ₹599, once per user.",
    tone: "from-sun-50 to-white",
  },
  {
    name: "SBI Card",
    offer: "5% back as reward points",
    detail: "On all grocery orders above ₹499.",
    tone: "from-brand-50 to-white",
  },
  {
    name: "Axis Bank",
    offer: "Flat ₹50 OFF",
    detail: "On debit cards, min order ₹399.",
    tone: "from-brand-50 to-brand-100",
  },
];

/* -------------------------------------------------------------- testimonials */
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Aarav Sharma",
    city: "Napier Town, Jabalpur",
    quote:
      "Sharma Kirana se milk aur Gupta se snacks — dono ek hi cart me. 35 minute me delivery ho gayi. Bahut convenient hai!",
    rating: 5,
    initials: "AS",
    tint: "from-brand-400 to-brand-700",
  },
  {
    name: "Ritika Mehra",
    city: "Wright Town, Jabalpur",
    quote:
      "I love that I can support my neighbourhood shops without stepping out. Fresh sabzi, dairy and monthly staples — sab yahin se.",
    rating: 5,
    initials: "RM",
    tint: "from-brand-500 to-brand-800",
  },
  {
    name: "Sandeep Jain",
    city: "Sadar, Jabalpur",
    quote:
      "Prices are honest and the shops are verified. Delivery partner called before arriving — that small touch makes a difference.",
    rating: 4,
    initials: "SJ",
    tint: "from-brand-400 to-brand-700",
  },
  {
    name: "Ananya Nair",
    city: "Vijay Nagar, Jabalpur",
    quote:
      "Multi-shop cart is genius. Ek hi checkout, ek hi delivery fee. Mere monthly grocery budget bhi save hota hai.",
    rating: 5,
    initials: "AN",
    tint: "from-brand-500 to-brand-700",
  },
];

/* --------------------------------------------------------------------- faqs */
export const FAQS: Faq[] = [
  {
    q: "How does Smart Dukaan work?",
    a: "Set your location, browse verified shops near you, add products from one or more shops to a single cart, and checkout. We coordinate with the shops and a delivery partner so your order reaches you in 30–45 minutes.",
  },
  {
    q: "Can I order from multiple shops at once?",
    a: "Yes! That is the heart of Smart Dukaan. Add staples from your kirana, fresh produce from the sabzi shop and snacks from another store — then pay once at checkout.",
  },
  {
    q: "What are the delivery charges?",
    a: "Delivery is ₹29 on orders below ₹499. Orders above ₹499 get free delivery. You will always see the exact fee before placing the order.",
  },
  {
    q: "Are the shops verified?",
    a: "Every shop is onboarded by our city team, verified for quality and hygiene, and rated by real customers after delivery.",
  },
  {
    q: "What if an item is missing or damaged?",
    a: "Report it from My Orders within 24 hours. We arrange a replacement or a refund to your original payment method — no questions asked.",
  },
  {
    q: "Which payment methods are supported?",
    a: "UPI, credit and debit cards, net banking, and cash on delivery. All online payments are processed over a secure connection.",
  },
  {
    q: "Can I schedule a delivery?",
    a: "Yes. Choose 'Express' for the fastest slot or pick a convenient time window at checkout.",
  },
  {
    q: "How do I become a shop partner?",
    a: "Tap 'Sell on Smart Dukaan' in the header or the 'Become a Shop Partner' card on the home page. Our city team will visit your shop, verify details and help you go live within 48 hours.",
  },
];

/* ---------------------------------------------------------------- how it works */
export const STEPS: Step[] = [
  {
    title: "Set your location",
    copy: "Choose your delivery address so we can show shops around you.",
    icon: "pin",
  },
  {
    title: "Browse nearby shops",
    copy: "Explore verified local stores and their daily stock.",
    icon: "store",
  },
  {
    title: "Add to cart",
    copy: "Shop from one or multiple stores in a single cart.",
    icon: "cart",
  },
  {
    title: "Choose delivery",
    copy: "Home delivery or self-pickup — whatever works for you.",
    icon: "truck",
  },
  {
    title: "Place order",
    copy: "Pay securely and track your order in real time.",
    icon: "check-circle",
  },
];

/* ------------------------------------------------------------------- policies */
export const POLICIES: Policy[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    updated: "2 November 2026",
    intro:
      "Your trust matters more than any order. This policy explains what we collect, why we collect it, and the controls you have over your information.",
    sections: [
      {
        heading: "Information we collect",
        body: "We collect your name, phone number, email, delivery addresses, order history and payment preferences. Location is used only to show shops and delivery estimates near you.",
      },
      {
        heading: "How we use it",
        body: "To fulfil orders, coordinate with shops and delivery partners, provide support, personalise recommendations and prevent fraud. We never sell your personal data.",
      },
      {
        heading: "Sharing with shops",
        body: "The shop fulfilling your order sees only the items, your first name and delivery instructions needed to pack it. Delivery partners see your address and phone number for the active delivery.",
      },
      {
        heading: "Data retention & security",
        body: "Order records are retained for legal and accounting purposes. Payment card details are never stored on our servers. Access to personal data is restricted and logged.",
      },
      {
        heading: "Your controls",
        body: "You can update profile details, delete saved addresses and request account deletion by writing to privacy@smartdukaan.in.",
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Service",
    updated: "2 November 2026",
    intro:
      "These terms govern your use of Smart Dukaan. By placing an order or creating an account, you agree to the points below.",
    sections: [
      {
        heading: "Using Smart Dukaan",
        body: "You must be at least 18 years old to create an account. Provide accurate contact and address details so shops and delivery partners can reach you.",
      },
      {
        heading: "Products and pricing",
        body: "Products are listed by independent local shops. Prices, offers and stock are set by the shop and may change. The price shown at checkout is the price you pay.",
      },
      {
        heading: "Order acceptance",
        body: "An order is confirmed once the shop accepts it. If an item is unavailable, the shop may substitute it with your approval or refund the amount.",
      },
      {
        heading: "Delivery",
        body: "Delivery estimates are indicative and depend on weather, traffic and shop preparation time. Someone above 18 must receive age-restricted items.",
      },
      {
        heading: "Fair use",
        body: "Do not misuse offers, create fake orders or harass shops and delivery partners. We may suspend accounts that violate these terms.",
      },
    ],
  },
  {
    slug: "returns",
    title: "Returns & Refunds",
    updated: "2 November 2026",
    intro:
      "Freshness is a promise. If something is not right, we will make it right quickly and simply.",
    sections: [
      {
        heading: "Fresh produce",
        body: "Report damaged or poor-quality fruits and vegetables within 24 hours with a photo. We offer a replacement or a full refund.",
      },
      {
        heading: "Packaged goods",
        body: "Unopened packaged items can be returned within 7 days. Opened items are accepted only if the product is defective or past its expiry date.",
      },
      {
        heading: "How to raise a request",
        body: "Go to My Account → Orders → select the item → Report an issue. Our support team responds within 4 working hours.",
      },
      {
        heading: "Refund timelines",
        body: "UPI and card refunds are processed within 3–5 working days. Cash-on-delivery refunds are transferred to your bank account or wallet within 48 hours of approval.",
      },
    ],
  },
  {
    slug: "shipping",
    title: "Delivery Policy",
    updated: "2 November 2026",
    intro:
      "Deliveries are handled by local partners who know your neighbourhood. Here is what to expect.",
    sections: [
      {
        heading: "Delivery windows",
        body: "Express orders are delivered in 30–45 minutes. Scheduled slots can be chosen at checkout. Shops prepare orders fresh, so timings may vary slightly during peak hours.",
      },
      {
        heading: "Delivery fee",
        body: "A flat ₹29 fee applies to orders below ₹499. Orders above ₹499 are delivered free. Any fee is shown before you pay.",
      },
      {
        heading: "Self-pickup",
        body: "Some shops offer self-pickup with no delivery fee. Choose pickup at checkout and collect your order from the shop counter.",
      },
      {
        heading: "Unable to deliver",
        body: "If our partner cannot reach you within 10 minutes of arrival, the order may be returned to the shop. Repeated failed deliveries may lead to prepaid-only ordering.",
      },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie Policy",
    updated: "2 November 2026",
    intro:
      "We use a small number of cookies and local storage keys to keep the experience fast, reliable and personal.",
    sections: [
      {
        heading: "Essential storage",
        body: "We store your cart, wishlist, login session and delivery location in your browser so you do not lose them on refresh.",
      },
      {
        heading: "Analytics",
        body: "Aggregated, anonymised page-view data helps us improve search, navigation and page performance. You can opt out from the footer.",
      },
      {
        heading: "Third parties",
        body: "Payment providers may set their own cookies during checkout. Their policies apply to those cookies.",
      },
    ],
  },
];

/* ------------------------------------------------------------ partner content */
export const PARTNER_BENEFITS = {
  shop: [
    "Reach thousands of nearby customers",
    "Zero listing fee for the first 3 months",
    "Free packaging and cataloging support",
    "Weekly payouts, straight to your bank",
  ],
  delivery: [
    "Earn ₹25,000+ per month",
    "Flexible shifts, morning or evening",
    "Weekly payouts and fuel bonus",
    "Insurance cover for every trip",
  ],
};

export const CITY_HERO_IMAGES = [
  "https://cdn.dummyjson.com/product-images/groceries/apple/thumbnail.webp",
  "https://cdn.dummyjson.com/product-images/groceries/milk/thumbnail.webp",
  "https://cdn.dummyjson.com/product-images/groceries/rice/thumbnail.webp",
  "https://cdn.dummyjson.com/product-images/groceries/lemon/thumbnail.webp",
];
