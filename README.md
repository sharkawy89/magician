# MAGICIAN Online Store

A responsive React storefront demo backed by the public [DummyJSON](https://dummyjson.com/) products API. It covers browsing, search, filters, product details, a cart with promo codes, a multi-step demo checkout, favorites, and recently viewed/searched items.

> This is a front-end demo. Checkout does **not** process real payments or store card data, and there is no backend account system.

## Tech stack

- React 19 + React Router 7
- Vite 6, Tailwind CSS 4, ESLint 9
- Framer Motion (`LazyMotion` + `m` only), Swiper, React Icons, react-hot-toast

## Getting started

```bash
npm install
npm run dev
```

Open the URL Vite prints (by default <http://localhost:5173>). No environment variables or API keys are required.

### Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Produce an optimized production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across the project |

## Data and persistence

- **Products** come from `https://dummyjson.com/products` (list, search, category, and detail endpoints). Product images are loaded from the API's `images`/`thumbnail` fields.
- **Categories** are fetched once from `https://dummyjson.com/products/categories` and shared by the nav, mega menu, search scope, and mobile drawer. If that request fails or the browser is offline, the app falls back to the department slugs defined in `src/mocks/storefrontMock.js` and shows a notice. A valid but empty response is treated as an explicit empty state with a retry action.
- **Storefront copy** (announcements, promo banners, footer/legal text, shipping rates, demo promo code) lives in `src/mocks/storefrontMock.js` and is intentionally separated from API data.
- **Cart, favorites, the demo promo code, and recent searches/purchases** are stored in the browser `localStorage`; there is no server-side persistence.

Demo promo code: `MAGIC10` (10% off).

## Project structure

```
src/
  main.jsx                 App entry; mounts cart, mini-cart and category providers
  App.jsx                  Routes, layout shell, lazy route chunks, toaster
  index.css                Tailwind theme tokens and small custom utilities
  components/
    category/              Shared category fetch + context
    layout/                Header, nav, mega menu, drawers, footer, tab bar
    home/                  Home hero, rails, promos, deal/trust strips
    listing/               Listing page, filters, toolbar, product cards
    product/               PDP sections, lightbox, bundles, lazy mount
    cart/  checkout/       Cart summary, checkout steps, order review/success
    context/               Cart and mini-cart contexts
    ui/                    Buttons, skeletons, drawer, empty/error states, etc.
    motion/                Deferred Framer Motion feature bundle
  page/                    Route components (home, listing, PDP, cart, checkout, …)
  utils/                   Category/money/listing/checkout/total helpers
  mocks/storefrontMock.js  Placeholder copy and category grouping
  img/                     Bundled home hero artwork
public/                    Favicon, app icons, web manifest, OG image
```

## Performance notes

- Home and the layout shell stay in the main chunk; every other route is code-split with `React.lazy`.
- Below-the-fold Home rails mount lazily behind a skeleton, and the hero stays eager.
- Framer Motion features load in a separate deferred chunk after first paint (`LazyMotion` + `m`).
- Icons are imported per icon and Swiper imports are limited to the core plus the A11y and Autoplay modules.

## Accessibility and resilience

- Keyboard-reachable controls, labeled ratings, skip link, one `h1` per page, and landmark regions.
- Verified with axe-core: no serious, critical, moderate, or minor violations across the main pages and all checkout steps.
- Layout stays within the viewport at 320 px, at 200% zoom, and with text-spacing overrides.
- Category data degrades gracefully: one shared request, local fallback on failure/offline, explicit empty state with retry, and automatic refresh when connectivity returns.

## Known limitations

- Checkout, account, blog, and policy pages are demo/stub content; `contact`, `about`, `accessories`, `blog`, `login`, and `register` render a generic static page.
- Product data is read-only and depends on the public DummyJSON service being available.
- Visual polish (pixel-level appearance, real-device rendering) is not covered by the automated checks; a manual visual pass is still recommended before shipping.
