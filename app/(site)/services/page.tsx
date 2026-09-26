import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Coffee,
  Zap,
  Droplet,
  Salad,
  Sandwich,
  ShoppingBag,
  Globe,
  Truck,
  Bike,
  ChefHat,
} from "lucide-react";
import { getSiteSettings } from "@/lib/settings";
import OrderNowMenu from "@/components/OrderNowMenu";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Blend N Sizzle's services: specialty coffee, protein shakes, low and zero-sugar drinks, healthy meals, wraps, grab-and-go options and online ordering in Belleville.",
};

const SERVICES = [
  {
    icon: Coffee,
    title: "Specialty Coffee & Espresso",
    description: "Rich, coffeehouse-quality espresso drinks crafted for coffee lovers.",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: Zap,
    title: "Protein Shakes & Smoothies",
    description: "High-protein blends made to fuel workouts and busy days.",
    image:
      "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: Droplet,
    title: "Low / Zero-Sugar Drinks",
    description: "Better-tasting drinks with lower-sugar and zero-sugar options.",
    image:
      "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: Salad,
    title: "Healthy Meals & Bowls",
    description: "Balanced, flavorful bowls built with smarter ingredients.",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: Sandwich,
    title: "Wraps & Sandwiches",
    description: "Craveable wraps and sandwiches made with goal-friendly choices.",
    image:
      "https://images.unsplash.com/photo-1540713434306-58505cf1b6fc?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: ShoppingBag,
    title: "Grab-and-Go Options",
    description: "Quick, healthy options ready for life on the move.",
    image:
      "https://images.unsplash.com/photo-1600335895229-6e75511892c8?auto=format&fit=crop&w=800&q=80",
  },
];

const DELIVERY_SERVICES = [
  {
    icon: Globe,
    title: "Online Ordering",
    description: "Order ahead and skip the line once our ordering platform goes live.",
  },
  {
    icon: Truck,
    title: "Uber Eats Integration",
    description: "Get Blend N Sizzle delivered straight to your door via Uber Eats.",
  },
  {
    icon: Bike,
    title: "DoorDash Integration",
    description: "Craving something sweet and goal-friendly? Order through DoorDash.",
  },
];

export default async function ServicesPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <section className="bg-cream/60 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <h1 className="font-heading text-4xl font-extrabold leading-tight text-charcoal sm:text-5xl">
            Services Built for Cravings and Goals
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-charcoal/70">
            From premium coffee to macro-conscious meals, everything we make is designed to
            satisfy cravings without compromising your goals.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="overflow-hidden rounded-3xl border border-beige bg-white shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(min-width: 1024px) 380px, 90vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange/10 text-orange-deep">
                  <service.icon size={22} aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-charcoal">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/65">{service.description}</p>
                <Link
                  href="/pricing"
                  className="focus-ring mt-4 inline-block text-sm font-semibold text-orange-deep hover:underline"
                >
                  View Menu
                </Link>
              </div>
            </div>
          ))}

          {settings.cateringEnabled && (
            <div className="overflow-hidden rounded-3xl border border-beige bg-white shadow-sm transition-shadow hover:shadow-lg">
              <div className="p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green/10 text-green-deep">
                  <ChefHat size={22} aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-charcoal">
                  Catering / Meal Options
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/65">
                  Goal-friendly catering and meal prep options for your next event.
                </p>
                <Link
                  href="/contact"
                  className="focus-ring mt-4 inline-block text-sm font-semibold text-orange-deep hover:underline"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="bg-espresso py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-orange">
              Delivery &amp; Ordering
            </span>
            <h2 className="mt-3 font-heading text-3xl font-extrabold text-cream sm:text-4xl">
              Order Your Way
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {DELIVERY_SERVICES.map((service) => (
              <div key={service.title} className="rounded-3xl bg-cream/5 p-7 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange/15 text-orange">
                  <service.icon size={24} aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-heading text-lg font-bold text-cream">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/65">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <OrderNowMenu settings={settings} />
          </div>
        </div>
      </section>
    </>
  );
}
