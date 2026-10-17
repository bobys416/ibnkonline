export type CategorySlug =
  | "grocery"
  | "electronics"
  | "fashion"
  | "home"
  | "patio-garden"
  | "toys"
  | "beauty"
  | "sports"
  | "auto"
  | "pets"
  | "baby";

export type ProductBadge = "Rollback" | "Flash Deal" | "Best Seller" | "New";

export type ProductVariant = {
  id: string;
  name: string;
  sku: string;
  color?: string;
  size?: string;
  stockQuantity: number;
  sellingPricePaise?: number;
  mrpPaise?: number;
  imageUrl?: string;
};

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  categorySlug: CategorySlug;
  brand: string;
  mrpPaise: number;
  sellingPricePaise: number;
  rating: number;
  reviewCount: number;
  sold: number;
  images: string[];
  shortDescription: string;
  description: string;
  specs: { key: string; value: string }[];
  variants: ProductVariant[];
  badge?: ProductBadge;
  delivery: string;
  isCodEligible: boolean;
  freeShipping: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
};

export type CatalogCategory = {
  slug: CategorySlug;
  name: string;
  tagline: string;
  image: string;
};

export const CATEGORIES: CatalogCategory[] = [
  {
    slug: "grocery",
    name: "Grocery & Essentials",
    tagline: "Daily staples, snacks, and pantry restocks",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "electronics",
    name: "Electronics & Tech",
    tagline: "TVs, phones, audio, and computing",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "fashion",
    name: "Fashion",
    tagline: "Apparel, sneakers, and everyday style",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "home",
    name: "Home & Furniture",
    tagline: "Living, kitchen, and bedroom upgrades",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "patio-garden",
    name: "Patio & Garden",
    tagline: "Outdoor living and garden tools",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "toys",
    name: "Toys & Games",
    tagline: "Play, learning, and family fun",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "beauty",
    name: "Beauty",
    tagline: "Skincare, haircare, and grooming",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "sports",
    name: "Sports & Outdoors",
    tagline: "Fitness gear for home and gym",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "auto",
    name: "Auto & Tires",
    tagline: "Car care and road-trip essentials",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "pets",
    name: "Pet Supplies",
    tagline: "Food, toys, and comfort for pets",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "baby",
    name: "Baby",
    tagline: "Nursery, feeding, and first years",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
  },
];

const CORE_PRODUCTS: CatalogProduct[] = [
  {
    id: "prod_tv",
    slug: "onn-55-inch-4k-roku-smart-tv",
    name: "onn. 55” Class 4K UHD LED Roku Smart TV HDR",
    sku: "BMC-TV-55-001",
    categorySlug: "electronics",
    brand: "onn.",
    mrpPaise: 3780000,
    sellingPricePaise: 2480000,
    rating: 4.5,
    reviewCount: 14200,
    sold: 8200,
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "Crisp 4K HDR picture with Roku Smart TV built in.",
    description:
      "Stream Netflix, Disney+, YouTube, and more on a 55-inch 4K UHD panel. HDR, voice remote, and multiple HDMI ports make this a living-room staple at an everyday low price.",
    specs: [
      { key: "Screen size", value: "55 inch" },
      { key: "Resolution", value: "4K UHD (3840 x 2160)" },
      { key: "Smart OS", value: "Roku TV" },
      { key: "HDR", value: "Yes" },
    ],
    variants: [
      { id: "var_tv_55", name: "55 inch", sku: "BMC-TV-55-001", stockQuantity: 24 },
    ],
    badge: "Rollback",
    delivery: "Free shipping, arrives in 2 days",
    isCodEligible: true,
    freeShipping: true,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
  },
  {
    id: "prod_airpods",
    slug: "apple-airpods-pro-2nd-gen",
    name: "Apple AirPods Pro (2nd Generation) USB-C",
    sku: "BMC-AP-PRO2",
    categorySlug: "electronics",
    brand: "Apple",
    mrpPaise: 2490000,
    sellingPricePaise: 1890000,
    rating: 4.7,
    reviewCount: 8900,
    sold: 5400,
    images: [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "Active Noise Cancellation with MagSafe USB-C case.",
    description:
      "Adaptive Audio, Transparency mode, and Spatial Audio. USB-C MagSafe charging case with speaker for Find My.",
    specs: [
      { key: "Chip", value: "H2" },
      { key: "ANC", value: "Active Noise Cancellation" },
      { key: "Case", value: "USB-C MagSafe" },
    ],
    variants: [
      { id: "var_airpods", name: "USB-C White", sku: "BMC-AP-PRO2", color: "White", stockQuantity: 40 },
    ],
    badge: "Flash Deal",
    delivery: "Pickup today at Wadala Hub, Mumbai",
    isCodEligible: true,
    freeShipping: true,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
  },
  {
    id: "prod_ninja",
    slug: "ninja-professional-plus-blender",
    name: "Ninja Professional Plus Blender with Auto-iQ",
    sku: "BMC-KIT-NINJA",
    categorySlug: "home",
    brand: "Ninja",
    mrpPaise: 1199900,
    sellingPricePaise: 799900,
    rating: 4.8,
    reviewCount: 6400,
    sold: 3100,
    images: [
      "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "1400 peak watts with Auto-iQ blending programs.",
    description:
      "Crush ice, blend smoothies, and puree soups with Total Crushing blades and stacked pitcher.",
    specs: [
      { key: "Power", value: "1400 peak watts" },
      { key: "Capacity", value: "2.1 L" },
      { key: "Programs", value: "Auto-iQ" },
    ],
    variants: [
      { id: "var_ninja", name: "Default", sku: "BMC-KIT-NINJA", stockQuantity: 18 },
    ],
    badge: "Rollback",
    delivery: "Free shipping, arrives tomorrow",
    isCodEligible: true,
    freeShipping: true,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
  },
  {
    id: "prod_dyson",
    slug: "dyson-v8-origin-cordless-vacuum",
    name: "Dyson V8 Origin+ Cordless Vacuum",
    sku: "BMC-HOME-DYSON",
    categorySlug: "home",
    brand: "Dyson",
    mrpPaise: 4699900,
    sellingPricePaise: 3499900,
    rating: 4.6,
    reviewCount: 5100,
    sold: 1900,
    images: [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "Cordless whole-home cleaning with 4 tools.",
    description:
      "Powerful suction, hygienic bin empty, and up to 40 minutes of fade-free runtime for floors and furniture.",
    specs: [
      { key: "Runtime", value: "Up to 40 min" },
      { key: "Bin", value: "0.54 L" },
      { key: "Tools", value: "4 included" },
    ],
    variants: [
      { id: "var_dyson", name: "Purple", sku: "BMC-HOME-DYSON", color: "Purple", stockQuantity: 12 },
    ],
    badge: "Flash Deal",
    delivery: "Free shipping, arrives in 2 days",
    isCodEligible: false,
    freeShipping: true,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: false,
  },
  {
    id: "prod_laptop",
    slug: "hp-15-inch-intel-i5-laptop",
    name: "HP 15.6” Laptop, Intel Core i5, 16GB RAM, 512GB SSD",
    sku: "BMC-LAP-HP15",
    categorySlug: "electronics",
    brand: "HP",
    mrpPaise: 5990000,
    sellingPricePaise: 3990000,
    rating: 4.4,
    reviewCount: 3800,
    sold: 2100,
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "Everyday performance for work, class, and streaming.",
    description:
      "Intel Core i5, 16GB RAM, and 512GB SSD in a slim 15.6-inch chassis with full-size keyboard and numeric pad.",
    specs: [
      { key: "Processor", value: "Intel Core i5" },
      { key: "RAM", value: "16GB" },
      { key: "Storage", value: "512GB SSD" },
      { key: "Display", value: "15.6 inch FHD" },
    ],
    variants: [
      { id: "var_laptop", name: "Silver", sku: "BMC-LAP-HP15", color: "Silver", stockQuantity: 15 },
    ],
    badge: "Rollback",
    delivery: "Free shipping, arrives in 2 days",
    isCodEligible: true,
    freeShipping: true,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
  },
  {
    id: "prod_jeans",
    slug: "levis-mens-505-regular-fit-jeans",
    name: "Levi's Men's 505 Regular Fit Jeans, Dark Stonewash",
    sku: "BMC-FASH-LEV505",
    categorySlug: "fashion",
    brand: "Levi's",
    mrpPaise: 695000,
    sellingPricePaise: 399900,
    rating: 4.6,
    reviewCount: 11300,
    sold: 7600,
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "Straight-leg regular fit denim for everyday wear.",
    description:
      "Classic 505 Regular Fit with a straight leg, mid rise, and durable dark stonewash denim.",
    specs: [
      { key: "Fit", value: "Regular / Straight" },
      { key: "Rise", value: "Mid" },
      { key: "Material", value: "Cotton denim" },
    ],
    variants: [
      { id: "var_jeans_32", name: "32", sku: "BMC-FASH-LEV505-32", size: "32", stockQuantity: 30 },
      { id: "var_jeans_34", name: "34", sku: "BMC-FASH-LEV505-34", size: "34", stockQuantity: 22 },
      { id: "var_jeans_36", name: "36", sku: "BMC-FASH-LEV505-36", size: "36", stockQuantity: 16 },
    ],
    badge: "Rollback",
    delivery: "Pickup today or free shipping",
    isCodEligible: true,
    freeShipping: true,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
  },
  {
    id: "prod_sneakers",
    slug: "everyday-runner-sneakers",
    name: "IBNK Everyday Runner Sneakers",
    sku: "BMC-FASH-RUN",
    categorySlug: "fashion",
    brand: "IBNK Basics",
    mrpPaise: 399900,
    sellingPricePaise: 249900,
    rating: 4.3,
    reviewCount: 2100,
    sold: 1800,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "Cushioned everyday sneakers for city miles.",
    description:
      "Breathable mesh upper, cushioned midsole, and rubber outsole for all-day comfort.",
    specs: [
      { key: "Upper", value: "Mesh" },
      { key: "Closure", value: "Lace-up" },
    ],
    variants: [
      { id: "var_snk_8", name: "UK 8", sku: "BMC-FASH-RUN-8", size: "UK 8", stockQuantity: 20 },
      { id: "var_snk_9", name: "UK 9", sku: "BMC-FASH-RUN-9", size: "UK 9", stockQuantity: 20 },
      { id: "var_snk_10", name: "UK 10", sku: "BMC-FASH-RUN-10", size: "UK 10", stockQuantity: 14 },
    ],
    badge: "Best Seller",
    delivery: "Free shipping, arrives in 3 days",
    isCodEligible: true,
    freeShipping: true,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true,
  },
  {
    id: "prod_coffee",
    slug: "south-indian-filter-coffee-1kg",
    name: "South Indian Filter Coffee, 1 kg",
    sku: "BMC-GROC-COF",
    categorySlug: "grocery",
    brand: "Wadala Roastery",
    mrpPaise: 89900,
    sellingPricePaise: 54900,
    rating: 4.7,
    reviewCount: 980,
    sold: 4200,
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "Fresh-roasted 80:20 filter coffee blend.",
    description:
      "Aromatic plantation beans blended with chicory for a strong, café-style decoction.",
    specs: [
      { key: "Net weight", value: "1 kg" },
      { key: "Blend", value: "80% coffee / 20% chicory" },
    ],
    variants: [
      { id: "var_coffee", name: "1 kg", sku: "BMC-GROC-COF", stockQuantity: 80 },
    ],
    badge: "New",
    delivery: "Same-day delivery in Mumbai",
    isCodEligible: true,
    freeShipping: false,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
  },
  {
    id: "prod_watch",
    slug: "sport-smartwatch-gps",
    name: "Sport GPS Smartwatch with Heart Rate",
    sku: "BMC-EL-WATCH",
    categorySlug: "electronics",
    brand: "IBNK Tech",
    mrpPaise: 1299900,
    sellingPricePaise: 799900,
    rating: 4.2,
    reviewCount: 1540,
    sold: 900,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "GPS, SpO2, and 7-day battery for training days.",
    description:
      "Track runs, sleep, and heart rate with a bright AMOLED display and 100+ sports modes.",
    specs: [
      { key: "Display", value: "1.43 inch AMOLED" },
      { key: "Battery", value: "Up to 7 days" },
      { key: "Water", value: "5 ATM" },
    ],
    variants: [
      { id: "var_watch_blk", name: "Black", sku: "BMC-EL-WATCH-BLK", color: "Black", stockQuantity: 25 },
    ],
    badge: "Flash Deal",
    delivery: "Free shipping, arrives in 2 days",
    isCodEligible: true,
    freeShipping: true,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
  },
  {
    id: "prod_sofa",
    slug: "modern-3-seater-fabric-sofa",
    name: "Modern 3-Seater Fabric Sofa",
    sku: "BMC-HOME-SOFA",
    categorySlug: "home",
    brand: "Urban Nest",
    mrpPaise: 4599900,
    sellingPricePaise: 2899900,
    rating: 4.4,
    reviewCount: 640,
    sold: 320,
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "Deep-seat fabric sofa with kiln-dried frame.",
    description:
      "Soft-touch upholstery, high-density foam, and a compact 3-seater footprint for Indian living rooms.",
    specs: [
      { key: "Seating", value: "3 seater" },
      { key: "Upholstery", value: "Fabric" },
      { key: "Warranty", value: "24 months" },
    ],
    variants: [
      { id: "var_sofa_grey", name: "Grey", sku: "BMC-HOME-SOFA-G", color: "Grey", stockQuantity: 6 },
    ],
    badge: "Rollback",
    delivery: "Scheduled delivery in 5–7 days",
    isCodEligible: false,
    freeShipping: true,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
  },
  {
    id: "prod_grill",
    slug: "outdoor-charcoal-grill",
    name: "Outdoor Charcoal Grill with Side Shelf",
    sku: "BMC-PAT-GRILL",
    categorySlug: "patio-garden",
    brand: "Backyard Co",
    mrpPaise: 899900,
    sellingPricePaise: 549900,
    rating: 4.1,
    reviewCount: 420,
    sold: 210,
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "Weekend grilling with adjustable vents.",
    description: "Porcelain-coated grate, ash catcher, and folding side shelf for terrace cookouts.",
    specs: [
      { key: "Fuel", value: "Charcoal" },
      { key: "Cooking area", value: "54 cm" },
    ],
    variants: [
      { id: "var_grill", name: "Black", sku: "BMC-PAT-GRILL", color: "Black", stockQuantity: 9 },
    ],
    delivery: "Free shipping, arrives in 4 days",
    isCodEligible: true,
    freeShipping: true,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
  },
  {
    id: "prod_planter",
    slug: "ceramic-planter-set-of-3",
    name: "Handcrafted Ceramic Planters (Set of 3)",
    sku: "BMC-PAT-PLAN",
    categorySlug: "patio-garden",
    brand: "Green Room",
    mrpPaise: 129900,
    sellingPricePaise: 49900,
    rating: 4.5,
    reviewCount: 860,
    sold: 1500,
    images: [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "Drainage holes and saucers included.",
    description: "Three sizes of glazed ceramic planters for indoor herbs and balcony plants.",
    specs: [
      { key: "Set", value: "3 pots" },
      { key: "Material", value: "Ceramic" },
    ],
    variants: [
      { id: "var_planter", name: "Set of 3", sku: "BMC-PAT-PLAN", stockQuantity: 50 },
    ],
    badge: "Rollback",
    delivery: "Free shipping on ₹499+",
    isCodEligible: true,
    freeShipping: false,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
  },
  {
    id: "prod_serum",
    slug: "vitamin-c-brightening-serum",
    name: "Vitamin C Brightening Serum 30ml",
    sku: "BMC-BEA-VC",
    categorySlug: "beauty",
    brand: "Glow Lab",
    mrpPaise: 149900,
    sellingPricePaise: 79900,
    rating: 4.6,
    reviewCount: 2400,
    sold: 3300,
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "10% vitamin C with hyaluronic acid.",
    description: "Lightweight serum for dullness and uneven tone. Fragrance-free and dermatologist tested.",
    specs: [
      { key: "Volume", value: "30 ml" },
      { key: "Key actives", value: "Vitamin C, HA" },
    ],
    variants: [
      { id: "var_serum", name: "30ml", sku: "BMC-BEA-VC", stockQuantity: 70 },
    ],
    badge: "Best Seller",
    delivery: "Arrives tomorrow in metro cities",
    isCodEligible: true,
    freeShipping: false,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
  },
  {
    id: "prod_yoga",
    slug: "tpe-yoga-mat-6mm",
    name: "TPE Yoga Mat 6mm with Carry Strap",
    sku: "BMC-SP-YOGA",
    categorySlug: "sports",
    brand: "Move Daily",
    mrpPaise: 249900,
    sellingPricePaise: 99900,
    rating: 4.4,
    reviewCount: 1780,
    sold: 2600,
    images: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "Non-slip 6mm cushioning for home practice.",
    description: "Dual-color TPE mat with alignment marks and a carry strap for studio or balcony sessions.",
    specs: [
      { key: "Thickness", value: "6 mm" },
      { key: "Material", value: "TPE" },
    ],
    variants: [
      { id: "var_yoga", name: "Midnight", sku: "BMC-SP-YOGA", color: "Midnight", stockQuantity: 40 },
    ],
    badge: "Flash Deal",
    delivery: "Free shipping, arrives in 3 days",
    isCodEligible: true,
    freeShipping: true,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
  },
  {
    id: "prod_carcare",
    slug: "car-care-kit-interior-exterior",
    name: "Car Care Kit — Interior & Exterior",
    sku: "BMC-AUTO-KIT",
    categorySlug: "auto",
    brand: "RoadReady",
    mrpPaise: 199900,
    sellingPricePaise: 129900,
    rating: 4.3,
    reviewCount: 510,
    sold: 740,
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "Shampoo, dashboard polish, and microfiber pack.",
    description: "Weekend detailing kit for hatchbacks and SUVs with pH-neutral shampoo.",
    specs: [
      { key: "Includes", value: "5-piece kit" },
    ],
    variants: [
      { id: "var_car", name: "Standard", sku: "BMC-AUTO-KIT", stockQuantity: 33 },
    ],
    delivery: "Arrives in 3–4 days",
    isCodEligible: true,
    freeShipping: false,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
  },
  {
    id: "prod_dogfood",
    slug: "adult-dog-food-chicken-10kg",
    name: "Adult Dog Food Chicken & Rice 10kg",
    sku: "BMC-PET-DOG",
    categorySlug: "pets",
    brand: "Paw Pantry",
    mrpPaise: 249900,
    sellingPricePaise: 189900,
    rating: 4.5,
    reviewCount: 1320,
    sold: 980,
    images: [
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "Complete nutrition for adult dogs.",
    description: "Chicken-first recipe with rice, omega oils, and added vitamins. No artificial colours.",
    specs: [
      { key: "Weight", value: "10 kg" },
      { key: "Life stage", value: "Adult" },
    ],
    variants: [
      { id: "var_dog", name: "10 kg", sku: "BMC-PET-DOG", stockQuantity: 28 },
    ],
    badge: "Best Seller",
    delivery: "Free shipping, arrives in 2 days",
    isCodEligible: true,
    freeShipping: true,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
  },
  {
    id: "prod_stroller",
    slug: "lightweight-travel-stroller",
    name: "Lightweight Travel Stroller",
    sku: "BMC-BABY-STR",
    categorySlug: "baby",
    brand: "Little Miles",
    mrpPaise: 1299900,
    sellingPricePaise: 899900,
    rating: 4.4,
    reviewCount: 390,
    sold: 210,
    images: [
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "One-hand fold, reclining seat, and canopy.",
    description: "Cabin-friendly stroller with 5-point harness and all-terrain wheels for city parents.",
    specs: [
      { key: "Weight", value: "6.8 kg" },
      { key: "Age", value: "6 months+" },
    ],
    variants: [
      { id: "var_stroller", name: "Grey", sku: "BMC-BABY-STR", color: "Grey", stockQuantity: 11 },
    ],
    badge: "New",
    delivery: "Free shipping, arrives in 3 days",
    isCodEligible: true,
    freeShipping: true,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
  },
  {
    id: "prod_blocks",
    slug: "wooden-building-blocks-60pc",
    name: "Wooden Building Blocks 60-Piece Set",
    sku: "BMC-TOY-BLK",
    categorySlug: "toys",
    brand: "PlayForge",
    mrpPaise: 199900,
    sellingPricePaise: 99900,
    rating: 4.8,
    reviewCount: 720,
    sold: 1100,
    images: [
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "FSC wood blocks for open-ended play.",
    description: "Smooth-sanded hardwood blocks in 60 shapes. Recommended for ages 3+.",
    specs: [
      { key: "Pieces", value: "60" },
      { key: "Age", value: "3+" },
    ],
    variants: [
      { id: "var_blocks", name: "60 pc", sku: "BMC-TOY-BLK", stockQuantity: 45 },
    ],
    delivery: "Arrives in 3 days",
    isCodEligible: true,
    freeShipping: false,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
  },
];

type CatalogCollection = {
  categorySlug: CategorySlug;
  brand: string;
  image: string;
  names: string[];
};

// A broad, original catalogue makes browse, search, category, cart, and product-detail
// experiences feel like a real marketplace instead of a small demo assortment.
const CATALOG_COLLECTIONS: CatalogCollection[] = [
  { categorySlug: "grocery", brand: "Daily Basket", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80", names: ["Organic Basmati Rice 5kg", "Cold Pressed Groundnut Oil 1L", "Whole Wheat Atta 10kg", "Masala Chai Blend 500g", "Almonds Value Pack 1kg", "Breakfast Oats 1.5kg", "Multigrain Cookies Pack", "Natural Honey 500g", "Premium Toor Dal 1kg", "Peanut Butter Crunchy 1kg", "Fruit & Nut Muesli 750g", "Classic Tomato Ketchup 1kg", "Sparkling Water Pack of 12", "Everyday Cleaning Essentials Kit"] },
  { categorySlug: "electronics", brand: "NovaTech", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80", names: ["True Wireless Earbuds with ANC", "Portable Bluetooth Speaker", "108MP Camera Smartphone", "65W USB-C Fast Charger", "Mechanical Wireless Keyboard", "Ergonomic Wireless Mouse", "27-inch QHD Monitor", "10,000mAh Power Bank", "Wi-Fi 6 Dual Band Router", "4K Streaming Stick", "Smart Home Security Camera", "Over-Ear Studio Headphones", "Compact Tablet 11-inch", "USB-C Multiport Hub"] },
  { categorySlug: "fashion", brand: "Everyday Edit", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80", names: ["Cotton Oxford Shirt", "Relaxed Fit Chinos", "Classic Crewneck T-Shirt", "Oversized Hoodie", "Linen Blend Kurta", "Printed Summer Dress", "High Rise Straight Jeans", "Canvas Tote Bag", "Leather Card Holder", "Lightweight Running Jacket", "Ribbed Knit Top", "Everyday Ankle Socks 5-Pack", "Polarized Sunglasses", "Travel Weekender Bag"] },
  { categorySlug: "home", brand: "Haven & Co.", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80", names: ["1000 Thread Count Cotton Sheets", "Memory Foam Pillow Set", "Borosilicate Glass Storage Set", "Cast Iron Kadai 26cm", "Bamboo Bath Towel Set", "Minimal Table Lamp", "Waffle Weave Duvet Cover", "Stainless Steel Cookware Set", "Compact Air Fryer 4L", "Digital Kitchen Scale", "Wall Mirror with Oak Frame", "Laundry Basket with Lid", "Foldable Study Desk", "Aroma Diffuser with Oils"] },
  { categorySlug: "patio-garden", brand: "Urban Green", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=900&q=80", names: ["Indoor Herb Garden Kit", "Foldable Balcony Chair", "Solar String Lights 20m", "Garden Tool Set 8-Piece", "Weatherproof Storage Box", "Watering Can 5L", "Outdoor Floor Cushion", "Terracotta Pot Set", "Plant Stand 5-Tier", "Citronella Candle Trio", "Portable Picnic Table", "Bird Feeder with Tray", "Hose Spray Nozzle", "Outdoor Doormat"] },
  { categorySlug: "toys", brand: "Wonder Play", image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=80", names: ["Magnetic Tiles 100-Piece Set", "Family Strategy Board Game", "Remote Control Stunt Car", "DIY Science Lab Kit", "Jumbo Floor Puzzle", "Pretend Play Kitchen Set", "Watercolor Art Kit", "Plush Elephant 30cm", "Junior Cricket Set", "Building Brick Space Kit", "Wooden Train Starter Set", "Kids Instant Print Camera", "Outdoor Bubble Machine", "Musical Keyboard for Kids"] },
  { categorySlug: "beauty", brand: "Kind Ritual", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80", names: ["Hydrating Face Cleanser 250ml", "Ceramide Barrier Moisturizer", "Mineral Sunscreen SPF 50", "Nourishing Hair Mask", "Rose Water Toner", "Matte Lip Color Set", "Bath Salt Gift Box", "Precision Grooming Kit", "Reusable Makeup Remover Pads", "Body Lotion with Shea Butter", "Volumizing Shampoo 400ml", "Tinted Moisturizer SPF 30", "Overnight Repair Cream", "Natural Deodorant Duo"] },
  { categorySlug: "sports", brand: "Move Better", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80", names: ["Adjustable Dumbbell Pair", "Resistance Band Set", "Insulated Steel Bottle 1L", "Running Belt with Phone Pocket", "Foam Roller Medium Density", "Badminton Racquet Pair", "Football Training Ball", "Foldable Camping Chair", "Waterproof Daypack 25L", "Cycling Helmet with Light", "Quick Dry Gym Towel", "Pilates Ring", "Trekking Pole Pair", "Skipping Rope with Counter"] },
  { categorySlug: "auto", brand: "Road Ready", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80", names: ["Dashboard Phone Mount", "Portable Tyre Inflator", "Car Vacuum Cleaner", "Emergency Roadside Kit", "Sunshade Windshield Cover", "Microfiber Cleaning Cloths", "Dash Camera Full HD", "Seat Organizer with Tablet Holder", "Jump Starter Power Bank", "All Weather Floor Mats", "Car Air Freshener Set", "USB Car Charger 45W", "Windshield Wiper Pair", "Boot Storage Organizer"] },
  { categorySlug: "pets", brand: "Happy Tails", image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=80", names: ["Orthopedic Pet Bed", "Interactive Treat Puzzle", "Cat Litter 10L", "Adjustable Dog Harness", "Pet Grooming Brush", "Grain Free Cat Food 3kg", "Portable Pet Water Bottle", "Scratch Post with Perch", "Reflective Dog Collar", "Pet Travel Carrier", "Dental Chew Pack", "Plush Squeaky Toy Set", "Pet Shampoo Oatmeal", "Stainless Steel Bowl Set"] },
  { categorySlug: "baby", brand: "Little Days", image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80", names: ["Newborn Cotton Bodysuit Set", "Silicone Feeding Set", "Diaper Backpack", "Muslin Swaddle 3-Pack", "Baby Bath Support", "Wooden Activity Gym", "Leakproof Sippy Cup", "Soft Play Mat", "Convertible High Chair", "Baby Monitor with Night Vision", "Teething Toy Set", "Portable Changing Mat", "Toddler Step Stool", "Night Light Projector"] },
];

const generatedProducts: CatalogProduct[] = CATALOG_COLLECTIONS.flatMap((collection, collectionIndex) =>
  collection.names.map((name, index) => {
    const ordinal = collectionIndex * 14 + index + 1;
    const price = 39900 + ((ordinal * 34700) % 499000);
    return {
      id: `catalog-${ordinal}`,
      slug: `${collection.categorySlug}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
      name,
      sku: `BMC-${collection.categorySlug.slice(0, 3).toUpperCase()}-${String(ordinal).padStart(3, "0")}`,
      categorySlug: collection.categorySlug,
      brand: collection.brand,
      mrpPaise: Math.round(price * 1.35),
      sellingPricePaise: price,
      rating: Number((4 + ((ordinal * 7) % 10) / 10).toFixed(1)),
      reviewCount: 80 + ordinal * 19,
      sold: 120 + ordinal * 37,
      images: [collection.image],
      shortDescription: `A dependable ${name.toLowerCase()} selected for everyday value.`,
      description: `Thoughtfully selected by ${collection.brand} for quality, convenience, and reliable delivery across India.`,
      specs: [{ key: "Collection", value: collection.brand }, { key: "Availability", value: "In stock" }],
      variants: [{ id: `variant-${ordinal}`, name: "Standard", sku: `BMC-V-${ordinal}`, stockQuantity: 8 + (ordinal % 42) }],
      badge: ordinal % 9 === 0 ? "Flash Deal" : ordinal % 7 === 0 ? "Best Seller" : ordinal % 5 === 0 ? "New" : undefined,
      delivery: ordinal % 3 === 0 ? "Free delivery, arrives in 2–3 days" : "Delivery available across India",
      isCodEligible: true,
      freeShipping: price >= 49900,
      isFeatured: ordinal % 8 === 0,
      isNewArrival: ordinal % 5 === 0,
      isBestSeller: ordinal % 7 === 0,
    };
  })
);

export const BASE_PRODUCTS: CatalogProduct[] = [...CORE_PRODUCTS, ...generatedProducts];

import marketplaceStore from "./marketplace-store";

function convertMarketplaceProduct(mp: any): CatalogProduct {
  return {
    id: mp.id,
    slug: mp.slug,
    name: mp.name,
    sku: mp.sku,
    categorySlug: mp.categorySlug as CategorySlug,
    brand: mp.brand || "iBNK Essentials",
    mrpPaise: mp.mrpPaise,
    sellingPricePaise: mp.sellingPricePaise,
    rating: 4.8,
    reviewCount: 12,
    sold: 35,
    images: mp.images?.length > 0 ? mp.images : ["https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"],
    shortDescription: mp.shortDescription || mp.description || mp.name,
    description: mp.description || mp.name,
    specs: mp.specs || [{ key: "Brand", value: mp.brand }],
    variants: (mp.variants || []).map((v: any) => ({
      id: v.id,
      name: v.name || "Standard",
      sku: v.sku || mp.sku,
      stockQuantity: v.stockQuantity ?? 10,
      color: v.color,
      size: v.size,
      mrpPaise: v.mrpPaise || mp.mrpPaise,
      sellingPricePaise: v.sellingPricePaise || mp.sellingPricePaise,
      imageUrl: v.imageUrl,
    })),
    badge: mp.isBestSeller ? "Best Seller" : mp.isNewArrival ? "New" : undefined,
    delivery: "Arrives in 2–3 business days via iBNK Delivery Hub",
    isCodEligible: mp.isCodEligible ?? true,
    freeShipping: mp.freeShipping ?? (mp.sellingPricePaise >= 49900),
    isFeatured: Boolean(mp.isFeatured),
    isNewArrival: Boolean(mp.isNewArrival),
    isBestSeller: Boolean(mp.isBestSeller),
  };
}

export function getAllProducts(): CatalogProduct[] {
  // Only APPROVED and PUBLISHED products from authoritative store appear on storefront
  const storePublished = marketplaceStore.getPublishedStoreProducts().map(convertMarketplaceProduct);
  const unlistedSkus = new Set(
    marketplaceStore
      .getProducts()
      .filter((p) => p.status === "UNLISTED" || p.status === "ARCHIVED")
      .map((p) => p.sku.toLowerCase())
  );

  const filteredBase = BASE_PRODUCTS.filter((p) => !unlistedSkus.has(p.sku.toLowerCase()));
  
  // Deduplicate by SKU preferring live published store records
  const map = new Map<string, CatalogProduct>();
  for (const p of filteredBase) {
    map.set(p.sku.toLowerCase(), p);
  }
  for (const p of storePublished) {
    map.set(p.sku.toLowerCase(), p);
  }
  const dynamicCache = getDynamicProducts();
  for (const p of dynamicCache.values()) {
    map.set(p.sku.toLowerCase(), p);
  }

  return Array.from(map.values());
}

const dynamicProductsCache = new Map<string, CatalogProduct>();

export function registerDynamicProduct(product: CatalogProduct) {
  if (!product || !product.id) return;
  dynamicProductsCache.set(product.id, product);
  if (product.slug) dynamicProductsCache.set(product.slug, product);
  if (product.sku) dynamicProductsCache.set(product.sku.toLowerCase(), product);

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("ibnk.dynamic_products");
      const list: CatalogProduct[] = stored ? JSON.parse(stored) : [];
      if (!list.some((item) => item.id === product.id)) {
        list.push(product);
        localStorage.setItem("ibnk.dynamic_products", JSON.stringify(list));
      }
    } catch {}
  }
}

function getDynamicProducts(): Map<string, CatalogProduct> {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("ibnk.dynamic_products");
      if (stored) {
        const list: CatalogProduct[] = JSON.parse(stored);
        for (const item of list) {
          dynamicProductsCache.set(item.id, item);
          if (item.slug) dynamicProductsCache.set(item.slug, item);
          if (item.sku) dynamicProductsCache.set(item.sku.toLowerCase(), item);
        }
      }
    } catch {}
  }
  return dynamicProductsCache;
}

export const PRODUCTS: CatalogProduct[] = getAllProducts();

export function getProductBySlug(slug: string) {
  const found = getAllProducts().find((p) => p.slug === slug);
  if (found) return found;
  return getDynamicProducts().get(slug);
}

export function getProductById(id: string) {
  const found = getAllProducts().find((p) => p.id === id);
  if (found) return found;
  return getDynamicProducts().get(id);
}

export function getVariant(product: CatalogProduct, variantId?: string) {
  return product.variants.find((v) => v.id === variantId) ?? product.variants[0];
}

export function getProductsByCategory(slug: string) {
  return getAllProducts().filter((p) => p.categorySlug === slug);
}

export function searchProducts(query: string) {
  const q = query.trim().toLowerCase();
  const all = getAllProducts();
  if (!q) return all;
  return all.filter((p) =>
    [p.name, p.brand, p.shortDescription, p.categorySlug].join(" ").toLowerCase().includes(q)
  );
}

export function getFlashDeals() {
  return getAllProducts().filter((p) => p.badge === "Flash Deal" || p.badge === "Rollback");
}

export function getFeatured() {
  return getAllProducts().filter((p) => p.isFeatured);
}

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

