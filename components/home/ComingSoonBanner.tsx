import Image from "next/image";
import Link from "next/link";
import type { ISiteSettings } from "@/models/SiteSettings";
import type { HomeContent } from "@/lib/page-content";

export default function ComingSoonBanner({
  settings,
  content,
}: {
  settings: ISiteSettings;
  content: HomeContent;
}) {
  return (
    <section className="bg-charcoal">
      <div className="grid items-stretch lg:grid-cols-2">
        <div className="flex flex-col justify-center px-5 py-16 sm:py-20 lg:py-0 lg:pl-8 lg:pr-12 xl:pl-16">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-orange">
            {settings.openingStatus || "Coming Soon"}
          </span>
          <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight text-cream sm:text-5xl">
            Coming Soon
            <br />
            <span className="text-orange">In Your City</span>
          </h2>
          <p className="mt-5 max-w-sm text-lg text-cream/75">{content.comingSoonSubtext}</p>
          <Link
            href="/contact"
            className="focus-ring mt-8 inline-flex w-fit items-center justify-center rounded-full bg-orange px-8 py-4 font-semibold text-white transition-colors hover:bg-orange-deep"
          >
            Stay Updated
          </Link>
        </div>

        <div className="relative h-64 w-full sm:h-80 lg:h-auto lg:min-h-[420px]">
          <Image
            src="/weare.png"
            alt="Freshly poured coffee at Blend N Sizzle"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
