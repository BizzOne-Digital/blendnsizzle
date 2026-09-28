import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import MenuCategory, { IMenuCategory } from "@/models/MenuCategory";
import MenuItem, { IMenuItem } from "@/models/MenuItem";
import MenuItemCard from "@/components/menu/MenuItemCard";

export const metadata: Metadata = {
  title: "Menu & Pricing",
  description:
    "Browse the Blend N Sizzle menu: coffee, protein shakes, smoothies, healthy bowls, wraps and snacks — with high-protein, low-sugar and zero-sugar options.",
};

type LeanCategory = IMenuCategory;
type LeanItem = Omit<IMenuItem, "category"> & { category: string };

async function getMenuData() {
  await connectDB();

  const categories = await MenuCategory.find({ active: true })
    .sort({ sortOrder: 1 })
    .lean<LeanCategory[]>();

  const items = await MenuItem.find({})
    .sort({ sortOrder: 1 })
    .lean<LeanItem[]>();

  const serialized = JSON.parse(
    JSON.stringify({ categories, items })
  ) as { categories: LeanCategory[]; items: LeanItem[] };

  return serialized;
}

export default async function PricingPage() {
  const { categories, items } = await getMenuData();

  const groupedByCategory = categories.map((category) => ({
    category,
    items: items.filter((item) => item.category === category._id.toString()),
  }));

  const hasAnyItems = items.length > 0;

  return (
    <>
      <section className="bg-cream/60 pb-16 pt-32 sm:pb-24 sm:pt-40">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-deep">Menu</span>
          <h1 className="mt-4 font-heading text-4xl font-extrabold leading-tight text-charcoal sm:text-5xl">
            Our Menu
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-charcoal/70">
            Fuel your cravings without losing sight of your goals.
          </p>

          {hasAnyItems && (
            <div className="mx-auto mt-8 inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-full border border-beige bg-white px-6 py-3 text-xs font-semibold text-charcoal/70">
              <span>
                <span className="text-orange-deep">Sip</span> = 12oz
              </span>
              <span className="text-beige">·</span>
              <span>
                <span className="text-orange-deep">Pour</span> = 16oz
              </span>
              <span className="text-beige">·</span>
              <span>
                <span className="text-orange-deep">House</span> = 20oz
              </span>
              <span className="text-beige">·</span>
              <span>
                <span className="text-orange-deep">Big House</span> = 24oz
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        {hasAnyItems && (
          <p className="mx-auto mb-10 max-w-2xl text-center text-xs text-charcoal/45">
            Images are for illustration purposes only — actual product may differ.
          </p>
        )}
        {!hasAnyItems ? (
          <div className="mx-auto max-w-lg rounded-3xl border border-dashed border-beige bg-cream/40 p-12 text-center">
            <p className="font-heading text-xl font-bold text-charcoal">
              Our full menu is coming soon.
            </p>
            <p className="mt-2 text-sm text-charcoal/60">
              Check back soon as we prepare to open in Belleville, Ontario.
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {groupedByCategory
              .filter((group) => group.items.length > 0)
              .map((group) => (
                <div key={group.category._id.toString()}>
                  <h2 className="font-heading text-2xl font-extrabold text-charcoal sm:text-3xl">
                    {group.category.name}
                  </h2>
                  {group.category.description && (
                    <p className="mt-2 max-w-2xl text-charcoal/65">{group.category.description}</p>
                  )}
                  <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {group.items.map((item) => (
                      <MenuItemCard key={item._id.toString()} item={item} />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>
    </>
  );
}
