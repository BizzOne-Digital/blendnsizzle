import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, Phone } from "lucide-react";
import type { ISiteSettings } from "@/models/SiteSettings";
import { getSafeImageUrl } from "@/lib/image-url";

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.6 5.82c-.9-.98-1.4-2.26-1.4-3.6h-3.16v13.44c0 1.62-1.32 2.94-2.94 2.94a2.94 2.94 0 0 1 0-5.88c.28 0 .55.04.8.11V9.68a6.13 6.13 0 0 0-.8-.05A6.1 6.1 0 0 0 3 15.73a6.1 6.1 0 0 0 6.1 6.1 6.1 6.1 0 0 0 6.1-6.1V9.1a9.2 9.2 0 0 0 5.36 1.72V7.66c-1.4 0-2.7-.5-3.96-1.84z" />
    </svg>
  );
}

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14 22v-8.4h2.8l.42-3.26H14V8.2c0-.94.26-1.58 1.6-1.58H17.4V3.7C17.1 3.66 16.1 3.57 14.93 3.57c-2.44 0-4.11 1.49-4.11 4.22v2.55H8v3.26h2.82V22H14z" />
    </svg>
  );
}

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Menu", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export default function Footer({ settings }: { settings: ISiteSettings }) {
  const year = new Date().getFullYear();

  const socials = [
    { name: "Instagram", url: settings.instagramUrl, icon: InstagramIcon },
    { name: "Facebook", url: settings.facebookUrl, icon: FacebookIcon },
    { name: "TikTok", url: settings.tiktokUrl, icon: TikTokIcon },
  ].filter((s) => s.url);

  return (
    <footer className="bg-espresso text-cream">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Image
                src={settings.logoUrl ? getSafeImageUrl(settings.logoUrl) : "/logo.png"}
                alt="Blend N Sizzle"
                width={140}
                height={140}
                className="h-12 w-12 object-contain"
              />
              <Image
                src="/logo2.png"
                alt="Blend N Sizzle"
                width={1666}
                height={340}
                className="h-6 w-auto object-contain"
              />
            </div>
            <p className="mt-3 max-w-xs text-sm text-cream/70">{settings.tagline}</p>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-cream/60">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="focus-ring text-sm text-cream/85 hover:text-orange">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-cream/60">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-cream/85">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-orange" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="shrink-0 text-orange" />
                <a href={`mailto:${settings.email}`} className="focus-ring hover:text-orange">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="shrink-0 text-orange" />
                <a href={`tel:${settings.phone}`} className="focus-ring hover:text-orange">
                  {settings.phone}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-cream/60">
              Follow Us
            </h3>
            <div className="mt-4 flex gap-3">
              {socials.length === 0 && <span className="text-sm text-cream/50">Coming soon</span>}
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 transition-colors hover:bg-orange"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-cream/15 pt-8 text-center">
          <p className="font-accent text-lg italic text-orange/90">
            Keep the Sweet. Cut the Sugar. Crank the Flavor.
          </p>
          <p className="mt-4 text-xs text-cream/50">
            © {year} Blend N Sizzle. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
