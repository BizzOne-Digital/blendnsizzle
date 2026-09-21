"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import type { ISiteSettings } from "@/models/SiteSettings";
import OrderNowMenu from "@/components/OrderNowMenu";
import { getSafeImageUrl } from "@/lib/image-url";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export default function Header({ settings }: { settings: ISiteSettings }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-beige/80 bg-ivory/95 backdrop-blur supports-[backdrop-filter]:bg-ivory/80">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between overflow-visible px-5 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Blend N Sizzle home">
          <Image
            src={settings.logoUrl ? getSafeImageUrl(settings.logoUrl) : "/logo.png"}
            alt="Blend N Sizzle"
            width={200}
            height={67}
            priority
            className="h-16 w-auto object-contain sm:h-[4.75rem]"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring rounded font-medium text-charcoal/80 transition-colors hover:text-orange-deep"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <OrderNowMenu settings={settings} />
        </div>

        <button
          type="button"
          className="focus-ring flex h-11 w-11 items-center justify-center rounded-full text-charcoal lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav-drawer"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-nav-drawer"
          className="fixed inset-0 top-20 z-40 bg-ivory lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <nav className="flex flex-col gap-1 px-5 py-8" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="focus-ring rounded-lg px-3 py-4 text-lg font-semibold text-charcoal border-b border-beige"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-6">
              <OrderNowMenu settings={settings} fullWidth />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
