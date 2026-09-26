import Image from "next/image";
import { MapPin, Mail, Phone, ArrowUpRight } from "lucide-react";
import type { ISiteSettings } from "@/models/SiteSettings";

export default function LocationSection({ settings }: { settings: ISiteSettings }) {
  return (
    <section className="bg-ivory py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-beige shadow-md">
          <div className="grid lg:grid-cols-2">
            <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
              <span className="text-xs font-bold uppercase tracking-widest text-orange-deep">Visit Us</span>
              <h2 className="mt-3 font-heading text-3xl font-extrabold leading-tight text-charcoal sm:text-4xl">
                Find Us in <span className="text-orange">Belleville</span>
              </h2>

              <ul className="mt-7 space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-orange-deep shadow-sm">
                    <MapPin size={18} />
                  </span>
                  <span className="pt-2 text-sm text-charcoal/75">{settings.address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-orange-deep shadow-sm">
                    <Mail size={18} />
                  </span>
                  <a href={`mailto:${settings.email}`} className="focus-ring text-sm text-charcoal/75 hover:text-orange-deep">
                    {settings.email}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-orange-deep shadow-sm">
                    <Phone size={18} />
                  </span>
                  <a href={`tel:${settings.phone}`} className="focus-ring text-sm text-charcoal/75 hover:text-orange-deep">
                    {settings.phone}
                  </a>
                </li>
              </ul>

              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-espresso px-6 py-3.5 font-semibold text-cream transition-transform hover:translate-x-0.5"
              >
                Get Directions
                <ArrowUpRight size={18} />
              </a>
            </div>

            <div className="relative aspect-[4/3] w-full lg:aspect-auto">
              <Image
                src="/findus.png"
                alt="Blend N Sizzle food truck in Belleville"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
