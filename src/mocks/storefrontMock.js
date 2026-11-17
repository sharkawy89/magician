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
    text: "Free shipping on orders over $100.",
    link: { label: "Shop now", to: "/search?q=home" },
  },
  {
    id: "weekly-offer",
    text: "This week only: up to 30% off selected home picks.",
    link: { label: "See the offer", to: "/category/home-decoration" },
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
