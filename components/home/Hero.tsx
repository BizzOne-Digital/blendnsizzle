import Image from "next/image";
import Link from "next/link";
import { Leaf, Dumbbell, Sparkles, Droplet } from "lucide-react";
import type { ISiteSettings } from "@/models/SiteSettings";
import type { HomeContent } from "@/lib/page-content";

const BENEFITS = [
  { label: "Better Ingredients", icon: Leaf },
  { label: "5–50g Protein", icon: Dumbbell },
  { label: "Great Taste", icon: Sparkles },
  { label: "Lower Sugar Options", icon: Droplet },
];

export default function Hero({ settings, content }: { settings: ISiteSettings; content: HomeContent }) {
  return (
    <section className="relative isolate overflow-hidden bg-charcoal">
      <Image
        src="/hero-mobile.png"
        alt="Blend N Sizzle protein shake and specialty coffee"
        fill
        priority
        sizes="100vw"
        className="object-cover sm:hidden"
      />
      <Image
        src="/hero.png"
        alt="Blend N Sizzle protein shake and specialty coffee"
        fill
        priority
        sizes="100vw"
        className="hidden object-cover sm:block"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/85 via-charcoal/55 to-charcoal/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-32 sm:pb-28 sm:pt-40 lg:px-8 lg:pb-36 lg:pt-44">
        <div className="max-w-xl animate-fade-up">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-green/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-green">
              {content.heroEyebrow}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white shadow-sm">
              <Dumbbell size={14} strokeWidth={2.5} aria-hidden="true" />
              5–50g Protein in Every Drink
            </span>
          </div>

          <h1 className="mt-6 font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-cream sm:text-5xl lg:text-6xl">
            Made for Cravings.
            <br />
            <span className="text-orange">Built</span> for{" "}
            <span className="text-green">Goals.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-cream/80">{content.heroSubtitle}</p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <span className="focus-ring inline-flex items-center justify-center rounded-full bg-orange px-7 py-4 text-center font-semibold text-white shadow-sm">
              {settings.openingStatus || "Coming Soon in Your City"}
            </span>
            <Link
              href="/pricing"
              className="focus-ring inline-flex items-center justify-center rounded-full border-2 border-cream/40 bg-white/10 px-7 py-4 text-center font-semibold text-cream backdrop-blur-sm transition-colors hover:border-cream hover:bg-white/20"
            >
              Explore Menu
            </Link>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {BENEFITS.map((b) => (
              <div key={b.label} className="flex flex-col items-start gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 text-orange backdrop-blur-sm">
                  <b.icon size={20} strokeWidth={2} aria-hidden="true" />
                </span>
                <dt className="text-sm font-semibold leading-tight text-cream/90">{b.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
