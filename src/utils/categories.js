import {
  categoryDepartments,
  featuredCategorySlugs,
} from "../mocks/storefrontMock";

export function formatCategoryName(value) {
  if (typeof value !== "string" || !value.trim()) return "";

  return value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * DummyJSON returns `{ slug, name, url }` objects today, but the old header
 * also tolerated a plain string array. Keep that tolerance in one shared place.
 */
export function normalizeCategories(data) {
  if (!Array.isArray(data)) return [];

  const seen = new Set();
  const categories = [];

  for (const category of data) {
    const slug =
      typeof category === "string" ? category : category?.slug?.trim?.();

    if (!slug || seen.has(slug)) continue;

    seen.add(slug);
    categories.push({
      slug,
      name:
        typeof category === "string"
          ? formatCategoryName(category)
          : category.name || formatCategoryName(slug),
    });
  }

  return categories;
}

/**
 * Offline/failure fallback built from the same department slugs the API is
 * expected to return. Keeping it in the shared utility means the drawer, mega
 * menu and search scope all degrade to one consistent list.
 */
export function getFallbackCategories() {
  const seen = new Set();
  const categories = [];

  for (const department of categoryDepartments) {
    for (const slug of department.slugs) {
      if (seen.has(slug)) continue;
      seen.add(slug);
      categories.push({ slug, name: formatCategoryName(slug) });
    }
  }

  return categories;
}

export function getFeaturedCategories(categories) {
  const bySlug = new Map(categories.map((category) => [category.slug, category]));

  return featuredCategorySlugs
    .map((slug) => bySlug.get(slug))
    .filter(Boolean);
}

/**
 * Groups every API category into the departments from the mock file. Slugs
 * that are not mapped (for example, categories added by the API later) are
 * collected in a final "More" group instead of disappearing.
 */
export function groupCategories(categories) {
  const bySlug = new Map(categories.map((category) => [category.slug, category]));
  const used = new Set();

  const groups = categoryDepartments
    .map((department) => {
      const items = department.slugs
        .map((slug) => bySlug.get(slug))
        .filter(Boolean);

      items.forEach((item) => used.add(item.slug));

      return {
        id: department.id,
        title: department.title,
        items,
      };
    })
    .filter((group) => group.items.length > 0);

  const more = categories.filter((category) => !used.has(category.slug));

  if (more.length > 0) {
    groups.push({ id: "more", title: "More", items: more });
  }

  return groups;
}
