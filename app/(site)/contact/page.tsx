import type { Metadata } from "next";
import { MapPin, Mail, Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Blend N Sizzle in Belleville, Ontario. Send us a message about our upcoming café opening, menu or partnership inquiries.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <section className="bg-cream/60 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-deep">
            Get In Touch
          </span>
          <h1 className="mt-4 font-heading text-4xl font-extrabold leading-tight text-charcoal sm:text-5xl">
            Contact Us
          </h1>
          <p className="mt-5 text-charcoal/70">
            Questions about our opening, menu, or want to partner with us? Send a message below.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="space-y-6">
            <div className="rounded-3xl border border-beige bg-white p-7 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange/10 text-orange-deep">
                <MapPin size={22} />
              </span>
              <h3 className="mt-4 font-heading text-base font-bold text-charcoal">Address</h3>
              <p className="mt-1 text-sm text-charcoal/65">{settings.address}</p>
            </div>
            <div className="rounded-3xl border border-beige bg-white p-7 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange/10 text-orange-deep">
                <Mail size={22} />
              </span>
              <h3 className="mt-4 font-heading text-base font-bold text-charcoal">Email</h3>
              <a href={`mailto:${settings.email}`} className="focus-ring mt-1 block text-sm text-charcoal/65 hover:text-orange-deep">
                {settings.email}
              </a>
            </div>
            <div className="rounded-3xl border border-beige bg-white p-7 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange/10 text-orange-deep">
                <Phone size={22} />
              </span>
              <h3 className="mt-4 font-heading text-base font-bold text-charcoal">Phone</h3>
              <a href={`tel:${settings.phone}`} className="focus-ring mt-1 block text-sm text-charcoal/65 hover:text-orange-deep">
                {settings.phone}
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-beige bg-white p-7 shadow-sm sm:p-10">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
