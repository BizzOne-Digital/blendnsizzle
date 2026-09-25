import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import MenuCategory from "@/models/MenuCategory";
import MenuItem from "@/models/MenuItem";
import { getSafeImageUrl } from "@/lib/uploads";

const FALLBACK_IMAGES = ["/pro1.png", "/pro2.png", "/pro3.png", "/pro4.png", "/pro5.png"];

const DEMO_CATEGORIES = [
  { _id: "demo-1", name: "Coffee & Espresso Drinks", slug: "coffee-espresso", image: "" },
  { _id: "demo-2", name: "Protein Shakes & Smoothies", slug: "protein-shakes-smoothies", image: "" },
  { _id: "demo-3", name: "Healthy Meals & Bowls", slug: "healthy-meals-bowls", image: "" },
  { _id: "demo-4", name: "Wraps & Sandwiches", slug: "wraps-sandwiches", image: "" },
  { _id: "demo-5", name: "Snacks & Treats", slug: "snacks-treats", image: "" },
];

async function getCategories() {
  try {
    await connectDB();
    const categories = await MenuCategory.find({ active: true })
      .sort({ sortOrder: 1 })
      .limit(6)
      .lean();

    if (categories.length > 0) {
      // Pull each category's thumbnail from one of its own real menu items
      // (rather than a generic index-based stock photo) so, e.g., "Sandwiches"
      // never ends up showing a bowl or a bakery item's photo.
      const categoryIds = categories.map((c) => c._id);
      const itemsWithImages = await MenuItem.find({
        category: { $in: categoryIds },
        image: { $nin: ["", null] },
      })
        .sort({ sortOrder: 1 })
        .select("category image")
        .lean();

      const imageByCategory = new Map<string, string>();
      for (const item of itemsWithImages) {
        const key = item.category.toString();
        if (!imageByCategory.has(key)) imageByCategory.set(key, item.image as string);
      }

      const enriched = categories.map((category) => ({
        ...category,
        image: category.image || imageByCategory.get(category._id.toString()) || "",
      }));

      return { items: enriched, isDemo: false };
    }
  } catch {
    // fall through to demo content
  }
  return { items: DEMO_CATEGORIES, isDemo: true };
}

export default async function MenuPreview() {
  const { items, isDemo } = await getCategories();

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-green-deep">Our Menu</span>
        <h2 className="mt-3 font-heading text-3xl font-extrabold text-charcoal sm:text-4xl">
          Something for Every Craving
        </h2>
        {isDemo && (
          <p className="mt-3 text-sm text-charcoal/50">
            Sample categories shown below — the full menu will be added soon.
          </p>
        )}
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((category, i) => (
          <Link
            key={category._id.toString()}
            href="/pricing"
            className="focus-ring group relative overflow-hidden rounded-3xl shadow-sm"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={
                  category.image
                    ? getSafeImageUrl(category.image)
                    : FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]
                }
                alt={category.name}
                fill
                sizes="(min-width: 1024px) 380px, 90vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5">
              <h3 className="font-heading text-lg font-bold text-white">{category.name}</h3>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-charcoal transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight size={18} />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/pricing"
          className="focus-ring inline-flex items-center justify-center rounded-full bg-orange px-7 py-3.5 font-semibold text-white transition-colors hover:bg-orange-deep"
        >
          View Full Menu &amp; Pricing
        </Link>
      </div>
    </section>
  );
}
