import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Leaf, Target, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";
import LocationSection from "@/components/LocationSection";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn how Blend N Sizzle blends smarter ingredients, lower-sugar options and bold flavor for coffee lovers, gym enthusiasts and health-conscious customers in Belleville, Ontario.",
};

const WHY_POINTS = [
  {
    icon: Leaf,
    title: "Better Ingredients",
    description:
      "We choose smarter ingredients that let you enjoy bold flavor without the usual trade-offs.",
  },
  {
    icon: Sparkles,
    title: "Lower & Zero Sugar",
    description:
      "Many of our drinks and treats come in lower-sugar options, so cravings and goals can coexist.",
  },
  {
    icon: Target,
    title: "Macro-Conscious Choices",
    description:
      "Menu items are built with goal-friendly choices in mind for gym-goers and health-conscious guests.",
  },
  {
    icon: ShieldCheck,
    title: "Taste Without Compromise",
    description: "We never sacrifice flavor — every item is crafted to satisfy real cravings.",
  },
];

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <section className="relative overflow-hidden bg-cream/60 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-deep">
            About Blend N Sizzle
          </span>
          <h1 className="mt-4 font-heading text-4xl font-extrabold leading-tight text-charcoal sm:text-5xl">
            More Than a Café.
            <br />
            It&apos;s a <span className="font-accent italic text-green-deep">Lifestyle.</span>
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] shadow-md">
          <Image
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80"
            alt="Fresh, healthy ingredients prepared at a café"
            fill
            sizes="(min-width: 1024px) 540px, 90vw"
            className="object-cover"
          />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-green-deep">Our Story</span>
          <h2 className="mt-3 font-heading text-3xl font-extrabold text-charcoal sm:text-4xl">
            Our Mission
          </h2>
          <p className="mt-6 text-base leading-relaxed text-charcoal/70">
            Our mission is to make eating out easier for people who care about their health,
            macros, and goals—without sacrificing taste. We create flavorful food and drinks
            with smarter ingredients, lower-sugar and zero-sugar options, and balanced choices
            so you can enjoy your cravings while staying on track.
          </p>
          <p className="mt-4 text-base leading-relaxed text-charcoal/70">
            Blend N Sizzle is being built for coffee lovers, gym enthusiasts, health-conscious
            customers, and anyone looking for better-tasting, goal-friendly options — right here
            in Belleville, Ontario.
          </p>
        </div>
      </section>

      <section className="bg-cream/60 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-deep">
              Why Blend N Sizzle
            </span>
            <h2 className="mt-3 font-heading text-3xl font-extrabold text-charcoal sm:text-4xl">
              Flavor First, Goals Always
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {WHY_POINTS.map((point) => (
              <div key={point.title} className="rounded-3xl border border-beige bg-white p-7 shadow-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange/10 text-orange-deep">
                  <point.icon size={24} aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-heading text-lg font-bold text-charcoal">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/65">{point.description}</p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-charcoal/45">
            Blend N Sizzle offers lower-sugar and goal-friendly choices as part of a balanced
            lifestyle. Individual nutritional needs vary — please consult a qualified
            professional for personalized dietary guidance.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16 text-center lg:px-8 lg:py-20">
        <h2 className="font-heading text-3xl font-extrabold text-charcoal sm:text-4xl">
          Ready to Craft Your Cravings?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-charcoal/70">
          We&apos;re opening soon in Belleville. Stay connected for updates on our launch.
        </p>
        <Link
          href="/contact"
          className="focus-ring mt-8 inline-flex items-center gap-2 rounded-full bg-orange px-7 py-3.5 font-semibold text-white transition-colors hover:bg-orange-deep"
        >
          Get In Touch
          <ArrowRight size={18} />
        </Link>
      </section>

      <LocationSection settings={settings} />
    </>
  );
}
