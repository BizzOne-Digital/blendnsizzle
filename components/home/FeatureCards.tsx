import { Coffee, Salad, Droplet, Trophy } from "lucide-react";

const CARDS = [
  {
    icon: Coffee,
    title: "Specialty Drinks",
    description: "Premium coffee, protein shakes and refreshing beverages.",
  },
  {
    icon: Salad,
    title: "Healthy Eats",
    description: "Flavorful meals made with smarter ingredients.",
  },
  {
    icon: Droplet,
    title: "Low & No Sugar",
    description: "Enjoy your favourites with better choices.",
  },
  {
    icon: Trophy,
    title: "Fuel Your Goals",
    description: "Perfect for coffee lovers, gym enthusiasts and healthy living.",
  },
];

export default function FeatureCards() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card) => (
          <div
            key={card.title}
            className="group rounded-3xl border border-beige bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange/10 text-orange-deep transition-colors group-hover:bg-orange group-hover:text-white">
              <card.icon size={24} strokeWidth={2} aria-hidden="true" />
            </span>
            <h3 className="mt-5 font-heading text-lg font-bold text-charcoal">{card.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/65">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
