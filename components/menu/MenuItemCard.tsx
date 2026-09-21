import Image from "next/image";
import { getSafeImageUrl } from "@/lib/uploads";
import type { IMenuItem } from "@/models/MenuItem";

const TAG_STYLES: Record<string, string> = {
  "High Protein": "bg-green/10 text-green-deep",
  "Low Sugar": "bg-orange/10 text-orange-deep",
  "Zero Sugar": "bg-orange/10 text-orange-deep",
  Vegetarian: "bg-beige text-espresso",
  Vegan: "bg-beige text-espresso",
  "Gluten Conscious": "bg-beige text-espresso",
};

type PlainMenuItem = Omit<IMenuItem, "category"> & { category: string };

export default function MenuItemCard({ item }: { item: PlainMenuItem }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-beige bg-white shadow-sm transition-shadow hover:shadow-lg">
      {item.featured && (
        <span className="absolute left-4 top-4 z-10 rounded-full bg-orange px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
          Featured
        </span>
      )}
      {!item.available && (
        <span className="absolute right-4 top-4 z-10 rounded-full bg-charcoal/80 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
          Unavailable
        </span>
      )}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={getSafeImageUrl(item.image)}
          alt={item.name}
          fill
          sizes="(min-width: 1024px) 380px, 90vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-lg font-bold text-charcoal">{item.name}</h3>
          {typeof item.price === "number" && (
            <span className="shrink-0 font-heading text-lg font-bold text-orange-deep">
              ${item.price.toFixed(2)}
            </span>
          )}
        </div>
        {item.description && (
          <p className="mt-2 text-sm leading-relaxed text-charcoal/65">{item.description}</p>
        )}
        {item.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${TAG_STYLES[tag] ?? "bg-beige text-espresso"}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
