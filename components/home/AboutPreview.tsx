import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HomeContent } from "@/lib/page-content";

function CoffeeBeanIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 56" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20 0C9 0 0 12 0 28s9 28 20 28 20-12 20-28S31 0 20 0Zm0 4c1.8 4.6-1 9-4.4 13.4C12.2 21.9 8 27.2 8 34.5 8 44 13.6 52 20 52s12-8 12-17.5c0-7.3-4.2-12.6-7.6-17.1C21 13 18.2 8.6 20 4Z" />
    </svg>
  );
}

export default function AboutPreview({ content }: { content: HomeContent }) {
  return (
    <section className="bg-ivory py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-beige shadow-md">
          <CoffeeBeanIcon className="pointer-events-none absolute -right-3 top-6 h-16 w-16 rotate-12 text-espresso/20 lg:h-20 lg:w-20" />
          <CoffeeBeanIcon className="pointer-events-none absolute right-14 top-20 h-10 w-10 -rotate-12 text-orange/25 lg:right-24" />

          <div className="grid lg:grid-cols-2">
            <div className="relative aspect-[6/5] w-full lg:aspect-auto">
              <Image
                src="/aboutus.png"
                alt="Healthy bowl and coffee at Blend N Sizzle"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/5 to-transparent" />
              <p className="absolute bottom-6 left-6 font-heading text-2xl font-extrabold leading-tight text-cream drop-shadow-sm sm:text-3xl">
                Good Food
                <br />
                Better Goals
              </p>
            </div>

            <div className="relative flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
              <span className="text-xs font-bold uppercase tracking-widest text-orange-deep">About Us</span>
              <h2 className="mt-3 font-heading text-3xl font-extrabold leading-tight text-charcoal sm:text-4xl">
                More Than a Café
                <br />
                It&apos;s a <span className="text-orange">Lifestyle</span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-charcoal/70">{content.aboutText}</p>

              <div className="mt-8 flex items-center gap-6">
                <Link
                  href="/about"
                  className="focus-ring inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3.5 font-semibold text-cream transition-transform hover:translate-x-0.5"
                >
                  Our Story
                  <ArrowRight size={18} />
                </Link>
                <span className="hidden font-accent text-xl italic text-orange-deep/70 sm:inline-block">
                  Find Your Best Self
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
