/**
 * PLACEHOLDER CONTENT
 * ---------------------------------------------------------------------------
 * Everything in this file is storefront copy and link data that does NOT come
 * from the DummyJSON API. It is intentionally kept in one place so real
 * merchandising, legal and contact content can replace it later.
 *
 * The category grouping below only maps the slugs returned by
 * `https://dummyjson.com/products/categories`. Any slug that is not listed in
 * a department automatically falls into the "More" group.
 */

export const announcements = [
  {
    id: "free-shipping",
    text: "Free shipping over $100.",
    link: { label: "Shop now", to: "/search?q=home" },
  },
  {
    id: "weekly-offer",
    text: "Up to 30% off home picks.",
    link: { label: "See offer", to: "/category/home-decoration" },
  },
  {
    id: "returns",
    text: "Easy 30-day returns on every order.",
  },
];

export const popularSearches = [
  "smartphone",
  "perfume",
  "laptop",
  "furniture",
  "watch",
  "shoes",
];

export const featuredCategorySlugs = [
  "beauty",
  "smartphones",
  "furniture",
  "mens-shirts",
  "home-decoration",
  "groceries",
];

export const categoryDepartments = [
  {
    id: "beauty",
    title: "Beauty & Personal Care",
    slugs: ["beauty", "fragrances", "skin-care"],
  },
  {
    id: "fashion",
    title: "Fashion",
    slugs: [
      "mens-shirts",
      "mens-shoes",
      "mens-watches",
      "womens-bags",
      "womens-dresses",
      "womens-jewellery",
      "womens-shoes",
      "womens-watches",
      "tops",
      "sunglasses",
    ],
  },
  {
    id: "home",
    title: "Home & Living",
    slugs: ["furniture", "home-decoration", "kitchen-accessories"],
  },
  {
    id: "tech",
    title: "Tech & Mobile",
    slugs: ["laptops", "smartphones", "tablets", "mobile-accessories"],
  },
  {
    id: "everyday",
    title: "Everyday Essentials",
    slugs: ["groceries"],
  },
];

export const megaMenuPromo = {
  eyebrow: "Weekly drop",
  title: "A brighter home, for less.",
  description:
    "Fresh furniture, decor and kitchen picks with up to 30% off while the week lasts.",
  ctaLabel: "Shop home picks",
  ctaTo: "/category/home-decoration",
};

export const pageLinks = [
  { title: "Accessories", to: "/accessories" },
  { title: "Blog", to: "/blog" },
  { title: "About", to: "/about" },
  { title: "Contact", to: "/contact" },
];

export const mobileMenuLinks = [
  { title: "Home", to: "/" },
  { title: "About", to: "/about" },
  { title: "Blog", to: "/blog" },
  { title: "Contact", to: "/contact" },
  { title: "Accessories", to: "/accessories" },
];

export const accountLinks = [
  { title: "Sign in", to: "/login" },
  { title: "Create account", to: "/register" },
];

export const freeShippingThreshold = 100;
export const flatShippingRate = 7.95;
export const promoCode = "MAGIC10";
export const promoDiscountPercent = 10;
export const promoStorageKey = "magician:promo";

export const cartContent = {
  title: "Your cart",
  itemsLabel: "Items",
  unitPriceLabel: "Unit price",
  lineTotalLabel: "Line total",
  removeLabel: "Remove {title} from cart",
  saveForLater: "Save for later",
  savedForLater: "Saved for later",
  moveToFavoritesLabel: "Move {title} to favorites",
  lowStock: "Only {count} left",
  outOfStock: "Out of stock — remove or save it for later.",
  summaryTitle: "Order summary",
  shippingLabel: "Estimated shipping",
  freeShipping: "Free",
  taxLabel: "Estimated tax",
  taxValue: "Calculated at checkout",
  totalLabel: "Estimated total",
  taxNote: "Tax is calculated at checkout.",
  promo: {
    heading: "Have a promo code?",
    label: "Promo code",
    demoLabel: "Demo",
    placeholder: "Enter demo code",
    helper: "Demo code: {code}",
    empty: "Enter a promo code.",
    apply: "Apply",
    applied: "{code} applied",
    remove: "Remove promo code",
    invalid: "That code isn't valid. Try {code}.",
    success: "Promo code applied.",
    removed: "Promo code removed.",
  },
  checkout: "Proceed to checkout",
  checkoutShort: "Checkout",
  continueShopping: "Continue shopping",
  empty: {
    title: "Your cart is empty",
    description: "Add something you love and it will show up here.",
    cta: "Continue shopping",
  },
  suggestions: {
    title: "You may also like",
    subtitle: "Popular picks to get you started.",
    subtitleCategory: "More from {category}",
  },
  trust: [
    {
      id: "secure",
      title: "Secure checkout",
      description: "Encrypted payment flow. No card data is stored.",
    },
    {
      id: "returns",
      title: "30-day returns",
      description: "Changed your mind? Send it back within 30 days.",
    },
  ],
};

export const miniCartEmpty = {
  title: "Your cart is empty",
  description: "Add something you love and it will show up here.",
  cta: "Continue shopping",
};

export const miniCartCopy = {
  title: "Your cart",
  freeShippingProgressLabel: "Free shipping progress",
  freeShippingRemaining: "Add {amount} more for free shipping",
  freeShippingUnlocked: "Free shipping unlocked.",
  subtotalLabel: "Subtotal",
  taxNote: "Shipping and taxes are calculated at checkout.",
  viewCart: "View cart",
  checkout: "Checkout",
  removeLabel: "Remove {title} from cart",
};

export const footerContent = {
  newsletter: {
    title: "Get the good stuff first",
    description:
      "New drops, practical buying guides and member-only offers, once a week.",
    placeholder: "Email address",
    inputLabel: "Email address for the newsletter",
    cta: "Subscribe",
    invalidMessage: "Enter a valid email address.",
    successMessage: "Thanks for subscribing. Watch your inbox.",
  },
  brandDescription:
    "Everyday tech, style and home essentials, chosen to make ordinary days feel a little more magical.",
  columns: [
    {
      id: "shop",
      title: "Shop",
      links: [
        { title: "Beauty", to: "/category/beauty" },
        { title: "Smartphones", to: "/category/smartphones" },
        { title: "Furniture", to: "/category/furniture" },
        { title: "Home decor", to: "/category/home-decoration" },
        { title: "Groceries", to: "/category/groceries" },
      ],
    },
    {
      id: "company",
      title: "Company",
      links: [
        { title: "About", to: "/about" },
        { title: "Blog", to: "/blog" },
        { title: "Contact", to: "/contact" },
      ],
    },
    {
      id: "help",
      title: "Help",
      // TODO: point these at dedicated pages when they exist. /contact is the
      // only support page in the current route table.
      links: [
        { title: "Shipping", to: "/contact" },
        { title: "Returns", to: "/contact" },
        { title: "FAQ", to: "/contact" },
      ],
    },
  ],
  socialLabel: "Follow MAGICIAN",
  socialLinks: [
    { id: "facebook", label: "MAGICIAN on Facebook", href: "#" },
    { id: "instagram", label: "MAGICIAN on Instagram", href: "#" },
    { id: "linkedin", label: "MAGICIAN on LinkedIn", href: "#" },
    { id: "youtube", label: "MAGICIAN on YouTube", href: "#" },
  ],
  paymentsLabel: "We accept",
  paymentMethods: [
    { id: "card", label: "Cards" },
    { id: "cash", label: "Cash" },
    { id: "mobile", label: "Mobile pay" },
    { id: "bank", label: "Bank transfer" },
    { id: "wallet", label: "Wallet" },
  ],
  legalLinks: [
    // TODO: replace with real policy pages.
    { title: "Privacy", href: "#" },
    { title: "Terms", href: "#" },
  ],
  copyright: "MAGICIAN Online Store. All rights reserved.",
};

/**
 * Home page placeholder content. Everything visual on the home page is driven
 * from here so merchandising can be swapped without touching layout code.
 */
export const homeHeroSlides = [
  {
    id: "console",
    eyebrow: "Fresh drop",
    title: "Play more. Pay less.",
    description:
      "Controllers, consoles and the accessories that make game night better.",
    ctaLabel: "Shop tech",
    ctaTo: "/category/smartphones",
    image: "console",
  },
  {
    id: "purifier",
    eyebrow: "Breathe easy",
    title: "A cleaner kind of calm.",
    description:
      "Quiet home tech that works in the background so you don't have to.",
    ctaLabel: "Shop home",
    ctaTo: "/category/home-decoration",
    image: "purifier",
  },
  {
    id: "audio",
    eyebrow: "Sound on",
    title: "Small player. Big soundtrack.",
    description:
      "Pocket-sized audio and everyday carry that goes the distance.",
    ctaLabel: "Shop audio",
    ctaTo: "/category/mobile-accessories",
    image: "audio",
  },
];

export const homeCategoryTiles = [
  { label: "Beauty", slug: "beauty", icon: "beauty" },
  { label: "Smartphones", slug: "smartphones", icon: "phone" },
  { label: "Furniture", slug: "furniture", icon: "chair" },
  { label: "Home decor", slug: "home-decoration", icon: "home" },
  { label: "Groceries", slug: "groceries", icon: "basket" },
  { label: "Sports", slug: "sports-accessories", icon: "sports" },
];

export const homeRails = {
  newArrivals: {
    id: "new-arrivals",
    title: "New arrivals",
    subtitle: "The latest additions to the shelves, straight from the warehouse.",
    endpoint:
      "https://dummyjson.com/products?limit=10&skip=0&sortBy=id&order=desc",
  },
  bestSellers: {
    id: "best-sellers",
    title: "Best sellers",
    subtitle: "Shopper favorites with the sharpest prices this week.",
    endpoint:
      "https://dummyjson.com/products?limit=10&skip=0&sortBy=discountPercentage&order=desc",
  },
  topRated: {
    id: "top-rated",
    title: "Top rated",
    subtitle: "The products customers keep coming back to review.",
    endpoint:
      "https://dummyjson.com/products?limit=10&skip=0&sortBy=rating&order=desc",
  },
};

export const homeDeal = {
  eyebrow: "Deal of the week",
  title: "Up to 30% off home & tech",
  description:
    "A rotating edit of markdowns across furniture, decor and the tech you use every day.",
  codeLabel: "Use code",
  code: "MAGIC30",
  ctaLabel: "Shop the deals",
  ctaTo: "/category/furniture",
  endsLabel: "Ends Sunday at 11:59 PM",
};

export const homePromos = [
  {
    id: "home-refresh",
    eyebrow: "Home refresh",
    title: "Softer light, sharper prices.",
    description:
      "Furniture, decor and kitchen picks for the rooms you actually live in.",
    ctaLabel: "Shop home",
    ctaTo: "/category/home-decoration",
    icon: "home",
    tone: "brand",
  },
  {
    id: "tech-upgrade",
    eyebrow: "Tech upgrade",
    title: "The everyday carry, upgraded.",
    description:
      "Phones, audio and accessories that make the daily commute easier.",
    ctaLabel: "Shop tech",
    ctaTo: "/category/smartphones",
    icon: "phone",
    tone: "ink",
  },
];

export const homeTrustItems = [
  {
    id: "shipping",
    title: "Free shipping over $100",
    description: "On every order, no membership needed.",
    icon: "truck",
  },
  {
    id: "returns",
    title: "30-day easy returns",
    description: "Changed your mind? Send it back, no drama.",
    icon: "returns",
  },
  {
    id: "secure",
    title: "Secure checkout",
    description: "Encrypted payment flow, no card data stored.",
    icon: "shield",
  },
  {
    id: "support",
    title: "Real people, real help",
    description: "Questions answered by the team, not a bot.",
    icon: "support",
  },
];

