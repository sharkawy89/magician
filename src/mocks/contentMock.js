/**
 * Editorial content for /blog, /about and /contact. It lives apart from
 * storefrontMock so the long-form copy is only pulled in by its route chunk.
 */
export const blogContent = {
  eyebrow: "The MAGICIAN journal",
  title: "Stories, guides & ideas",
  description:
    "Practical buying guides, small-space ideas and everyday upgrades — written by the people who pick what goes on the shelves.",
  gridHeading: "Latest articles",
  featuredLabel: "Featured",
  readMoreLabel: "Read article",
  backLabel: "All articles",
  emptyMessage: "No articles in this topic yet.",
  cta: {
    eyebrow: "Pitch us",
    heading: "Have a story idea or a tip?",
    description:
      "We're always looking for good questions to answer. Send yours and it might become the next guide.",
    label: "Get in touch",
    to: "/contact",
  },
  posts: [
    {
      slug: "how-to-choose-a-smartphone-in-2026",
      title: "How to choose a smartphone in 2026",
      excerpt:
        "Screen, battery, camera, price — the short list of things that actually matter when you're upgrading this year.",
      category: "Buying guides",
      author: "Marcus Lee",
      date: "2026-11-12T09:00:00",
      dateLabel: "Nov 12, 2026",
      readTime: "7 min read",
      tone: "brand",
      icon: "phone",
      featured: true,
      body: [
        "The smartphone market has never been broader, which is good news if you know what you're looking for and exhausting if you don't. Most of the headline features are genuinely useful; a few are marketing. The trick is to decide which ones matter to you before you start comparing spec sheets.",
        "Start with the screen you actually use. A phone that feels too wide in one hand will annoy you every day, no matter how good the camera is. Hold a few in person if you can, and pay attention to how the edges sit against your palm rather than the size printed in the specs.",
        "Battery life is the spec that ages fastest. A 5,000 mAh cell paired with efficient charging will usually outlast a bigger number on paper, and fast charging matters more on the days you forget to plug in overnight. Look for a phone that reaches a useful charge in about half an hour.",
        "Then set a firm budget and let the camera be the tie-breaker. For most people, a mid-range phone with a good main sensor and dependable software support will feel better day to day than a flagship you're afraid to drop. Buy for the next three years, not the next three weeks.",
      ],
      takeaways: [
        "Pick a screen size you can comfortably use one-handed.",
        "Efficient charging beats a bigger battery number on paper.",
        "Set your budget first; most flagship extras are nice-to-have.",
      ],
    },
    {
      slug: "small-space-home-refresh",
      title: "A small-space refresh that actually lasts",
      excerpt:
        "Five low-effort swaps that make a rented room feel calmer, brighter and more like yours.",
      category: "Home & living",
      author: "Ada Whitfield",
      date: "2026-11-06T09:00:00",
      dateLabel: "Nov 06, 2026",
      readTime: "5 min read",
      tone: "ink",
      icon: "home",
      body: [
        "Big renovations get the attention, but most of us live with small rooms and short leases. The good news is that a handful of deliberate swaps can change how a space feels without a single drill hole.",
        "Begin with light. Swap a heavy curtain for something lighter, move a lamp off the ceiling and onto a side table, and let one corner stay deliberately empty. Fewer light sources, placed lower, make a room feel warmer than a single bright overhead bulb.",
        "Then edit the surfaces. A tray corrals the clutter that collects on a coffee table, a shallow basket does the same for a shelf, and a single well-chosen textile — a throw, a runner, a cushion — adds colour without committing to a repaint.",
        "Finally, buy one thing you genuinely love instead of three things that will do. A small room magnifies everything in it, so the objects you keep should earn their space. The result is less a makeover than a slow, steady upgrade you can carry to the next place.",
      ],
      takeaways: [
        "Lower, layered lighting changes a room more than new furniture.",
        "Use trays and baskets to give clutter a home.",
        "One loved piece beats three compromises in a small space.",
      ],
    },
    {
      slug: "desk-setup-that-works-with-you",
      title: "The desk setup that works with you",
      excerpt:
        "A calmer, more useful workspace comes down to three things: light, height and fewer cables.",
      category: "Tech",
      author: "Marcus Lee",
      date: "2026-10-30T09:00:00",
      dateLabel: "Oct 30, 2026",
      readTime: "6 min read",
      tone: "sky",
      icon: "box",
      body: [
        "A good desk setup isn't about buying more gear. It's about removing the small frictions that pull your attention away from the work — the glare on the screen, the cable you keep nudging, the chair that's never quite the right height.",
        "Start with the screen at eye level and an arm's length away. A cheap riser or a stack of books does the job; the point is to stop looking down all day. Put the keyboard close enough that your elbows stay near your sides, and keep the mouse on the same plane so your wrist isn't climbing.",
        "Lighting is the upgrade people skip. A desk lamp that lights the wall behind the monitor reduces contrast and eye strain far more than a brighter bulb pointed at your face. If you take calls, a soft front light makes you look better on camera too.",
        "Then deal with cables once, properly. Route them along the back edge, bundle what you can, and leave slack where things move. A five-minute tidy at the end of the day keeps the setup from slowly turning back into a nest.",
      ],
      takeaways: [
        "Raise the screen to eye level and keep it an arm's length away.",
        "Light the wall behind the monitor to cut glare and eye strain.",
        "Route cables once with slack, then tidy for five minutes a day.",
      ],
    },
    {
      slug: "capsule-wardrobe-for-real-life",
      title: "Building a capsule wardrobe that fits real life",
      excerpt:
        "Fewer pieces, more outfits — a practical starting point for anyone tired of staring into a full closet.",
      category: "Style",
      author: "Priya Nair",
      date: "2026-10-24T09:00:00",
      dateLabel: "Oct 24, 2026",
      readTime: "6 min read",
      tone: "rose",
      icon: "bag",
      body: [
        "A capsule wardrobe isn't a uniform, and it isn't a rulebook. It's a small set of pieces that work together, so getting dressed takes minutes instead of a committee meeting. The goal is fewer decisions, not fewer clothes for their own sake.",
        "Start by noticing what you actually reach for. Pull out the ten things you wore most in the last month and look for the pattern: a colour, a shape, a fabric. That pattern is your taste, and it's a better guide than any list of essentials.",
        "Build around a neutral base — two pairs of trousers, a couple of good tees, one layer you trust — then add a few pieces with personality. Everything should pair with at least three other things. If a new item only works with one outfit, it's a costume, not a staple.",
        "Finally, give yourself permission to repeat. The people who look consistently good are usually wearing the same shapes in different colours, not reinventing themselves daily. A capsule just makes that habit intentional.",
      ],
      takeaways: [
        "Use the ten things you wear most as your real style guide.",
        "Every new piece should work with at least three others.",
        "Repeat the shapes that work; that's a feature, not a flaw.",
      ],
    },
    {
      slug: "care-guide-for-daily-tech",
      title: "A simple care guide for the tech you use daily",
      excerpt:
        "Small habits that keep phones, laptops and headphones running longer — and out of the repair shop.",
      category: "How-to",
      author: "Tomás Rivera",
      date: "2026-10-15T09:00:00",
      dateLabel: "Oct 15, 2026",
      readTime: "4 min read",
      tone: "mint",
      icon: "shield",
      body: [
        "Most tech doesn't fail dramatically. It wears out through a thousand small indignities: a battery kept at 100% and 35°C, a laptop vent buried under a blanket, a charging cable bent at the same sharp angle every night.",
        "For phones, the two biggest wins are heat and charge range. Avoid leaving a phone on a hot dashboard or under a pillow while charging, and don't stress about keeping it pinned at 100%. Modern batteries are happiest living between roughly 20% and 85%.",
        "For laptops, keep the vents clear and the fans honest. A hard flat surface and a quick dust-out every few months do more than any cooling pad. And for headphones, wipe the pads, store them somewhere dry, and don't yank the cable — the connector is usually the first thing to go.",
        "None of this is glamorous, but it's the difference between replacing gear every two years and getting four or five good ones out of it.",
      ],
      takeaways: [
        "Keep devices cool; heat ages batteries faster than use.",
        "Aim to live between roughly 20% and 85% charge.",
        "Clear laptop vents and handle cable connectors gently.",
      ],
    },
    {
      slug: "five-minute-morning-reset",
      title: "The five-minute morning reset",
      excerpt:
        "A tiny routine for starting the day with a clear surface, a clear inbox and a clear head.",
      category: "Home & living",
      author: "Ada Whitfield",
      date: "2026-10-02T09:00:00",
      dateLabel: "Oct 02, 2026",
      readTime: "3 min read",
      tone: "amber",
      icon: "sun",
      body: [
        "Most productivity advice assumes you have an hour to spare. This is the opposite: a five-minute reset you can do before your first coffee, designed to make the rest of the day feel less like catching up.",
        "Clear one surface completely — the kitchen counter, the desk, the chair you dump things on. Not the whole room; just the one surface you'll see first. Wipe it down, put everything that doesn't belong there into a single basket, and leave it.",
        "Then open your inbox and archive or delete anything that needs no reply. You're not answering messages yet, just shrinking the pile. Finally, write down the one thing that would make today feel finished, and put it where you'll see it.",
        "That's it. Five minutes, three small moves, and a day that starts on your terms instead of the inbox's.",
      ],
      takeaways: [
        "Clear one surface, not the whole room.",
        "Shrink the inbox before you start answering it.",
        "Name the one thing that would make the day feel finished.",
      ],
    },
  ],
};

/**
 * Content for /about.
 */
export const aboutContent = {
  eyebrow: "Our story",
  title: "Everyday magic, thoughtfully picked",
  description:
    "MAGICIAN is a small team with a simple idea: the things you use every day should feel a little special — and be priced like they belong in real life.",
  stats: [
    { id: "founded", value: "2018", label: "Founded" },
    { id: "orders", value: "50k+", label: "Orders shipped" },
    { id: "countries", value: "24", label: "Countries served" },
    { id: "rating", value: "4.8/5", label: "Average rating" },
  ],
  story: {
    heading: "Built for the everyday, not the extraordinary",
    paragraphs: [
      "We started in a spare room with a spreadsheet and a stubborn belief: shopping for the basics shouldn't feel like a gamble. Too much of the internet was optimised for the sale, not for the thing you'd still be happy with a year later.",
      "So we built the opposite. A small catalogue, picked by hand, with plain descriptions and prices that don't need a countdown timer to make sense. If a product doesn't earn its place, it comes off the shelf — even if it sells.",
      "Today we work with a small group of makers and suppliers across tech, home and style. We still read every review, still answer the awkward questions, and still keep the spare room's worth of curiosity about what people actually need.",
    ],
    quote:
      "If we wouldn't keep it in our own homes, it doesn't make the shelf.",
    quoteAttribution: "Ada Whitfield, founder",
  },
  values: [
    {
      id: "curation",
      icon: "star",
      title: "Considered curation",
      description:
        "A short list, chosen on purpose. We'd rather stock ten things we believe in than a thousand we don't.",
    },
    {
      id: "pricing",
      icon: "bag",
      title: "Honest pricing",
      description:
        "Clear prices, real discounts, no fake urgency. What you see is what you pay at checkout.",
    },
    {
      id: "delivery",
      icon: "truck",
      title: "Careful delivery",
      description:
        "Packed to survive the trip and shipped fast, with tracking you don't have to hunt for.",
    },
    {
      id: "support",
      icon: "support",
      title: "Real human support",
      description:
        "Questions answered by the team that picks the products — not a script or a bot.",
    },
  ],
  milestones: [
    {
      id: "2018",
      year: "2018",
      title: "A spare room and a spreadsheet",
      description:
        "Two people, one very organised spreadsheet, and a first batch of products we actually used.",
    },
    {
      id: "2020",
      year: "2020",
      title: "Our first warehouse",
      description:
        "We outgrew the spare room and moved fulfilment in-house so we could pack every order ourselves.",
    },
    {
      id: "2023",
      year: "2023",
      title: "24 countries and counting",
      description:
        "International shipping opened up, and the catalogue grew into home, tech and style.",
    },
    {
      id: "2026",
      year: "2026",
      title: "A storefront built for speed",
      description:
        "A faster, more accessible shop — same small team, same short list, better experience.",
    },
  ],
  team: [
    {
      id: "ada",
      name: "Ada Whitfield",
      role: "Founder & buyer",
      initials: "AW",
      tone: "brand",
      bio: "Sets the catalogue and the standard. Will absolutely reject a product for the wrong shade of white.",
    },
    {
      id: "marcus",
      name: "Marcus Lee",
      role: "Head of product",
      initials: "ML",
      tone: "ink",
      bio: "Turns hand-picked finds into pages that are easy to browse — and easier to trust.",
    },
    {
      id: "priya",
      name: "Priya Nair",
      role: "Customer experience",
      initials: "PN",
      tone: "soft",
      bio: "Reads every review and answers the tricky messages. The reason support feels human.",
    },
    {
      id: "tomas",
      name: "Tomás Rivera",
      role: "Operations",
      initials: "TR",
      tone: "brand",
      bio: "Keeps orders moving and boxes intact. Believes good packing is a form of respect.",
    },
  ],
  cta: {
    heading: "Curious what we're stocking next?",
    description:
      "Browse the latest arrivals or send us a note — we answer every message.",
    primaryLabel: "Shop new arrivals",
    primaryTo: "/",
    secondaryLabel: "Contact the team",
    secondaryTo: "/contact",
  },
};

/**
 * Content for /contact, including the demo form copy and FAQ entries that the
 * footer help links deep-link into.
 */
export const contactContent = {
  eyebrow: "Contact",
  title: "We'd love to hear from you",
  description:
    "Questions about an order, a product or a partnership? Send a note and a real person will get back to you.",
  form: {
    heading: "Send us a message",
    note: "We usually reply within one business day.",
    nameLabel: "Full name",
    namePlaceholder: "Jane Doe",
    emailLabel: "Email address",
    emailPlaceholder: "you@example.com",
    subjectLabel: "Topic",
    messageLabel: "Message",
    messagePlaceholder: "Tell us what you need help with…",
    submit: "Send message",
    demoNote: "Demo form — nothing is actually sent.",
    successMessage: "Thanks! Your message has been noted. We'll be in touch.",
    errors: {
      name: "Enter your name.",
      email: "Enter a valid email address.",
      message: "Tell us a little more (at least 10 characters).",
    },
  },
  subjects: [
    "Order support",
    "Returns & refunds",
    "Product question",
    "Partnerships",
    "Press & media",
    "Something else",
  ],
  channels: [
    {
      id: "email",
      icon: "mail",
      label: "Email",
      value: "hello@magician.store",
      href: "mailto:hello@magician.store",
    },
    {
      id: "phone",
      icon: "phone",
      label: "Phone",
      value: "+1 (555) 012-3456",
      href: "tel:+15550123456",
    },
    {
      id: "support",
      icon: "chat",
      label: "Order support",
      value: "Mon–Fri, 9am–6pm",
      href: null,
    },
  ],
  responseNote:
    "We reply to every message — usually within one business day, sometimes faster.",
  studio: {
    heading: "Visit the studio",
    name: "MAGICIAN Studio",
    lines: ["128 Market Street", "Suite 400", "San Francisco, CA 94103"],
    hours: "Weekdays, 10am–5pm. Visits by appointment.",
  },
  socialHeading: "Follow along",
  social: [
    { id: "facebook", label: "MAGICIAN on Facebook", href: "#" },
    { id: "instagram", label: "MAGICIAN on Instagram", href: "#" },
    { id: "linkedin", label: "MAGICIAN on LinkedIn", href: "#" },
    { id: "youtube", label: "MAGICIAN on YouTube", href: "#" },
  ],
  faq: {
    heading: "Quick answers",
    description: "The questions we get most often. Still stuck? Send us a note.",
    items: [
      {
        id: "shipping",
        question: "How long does shipping take?",
        answer:
          "Standard delivery arrives in 5–7 business days, express in 2–3, and next-day where available. Orders over $100 ship free, and you'll get tracking as soon as the parcel leaves us.",
      },
      {
        id: "returns",
        question: "What is your return policy?",
        answer:
          "You have 30 days from delivery to send most items back, unused and in their original packaging. Start a return from your order email or contact us and we'll walk you through it.",
      },
      {
        id: "international",
        question: "Do you ship internationally?",
        answer:
          "Yes — we currently ship to 24 countries. Duties and taxes are calculated at checkout so there are no surprises on delivery.",
      },
      {
        id: "payments",
        question: "Which payment methods do you accept?",
        answer:
          "Cards, mobile pay, bank transfer and cash on delivery in supported regions. This demo storefront does not process real payments or store card data.",
      },
    ],
  },
};
