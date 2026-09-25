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
    <>
      <header className="sticky top-0 z-50 border-b border-beige/80 bg-ivory/95 backdrop-blur supports-[backdrop-filter]:bg-ivory/80">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between overflow-visible px-5 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Blend N Sizzle home">
            <Image
              src={settings.logoUrl ? getSafeImageUrl(settings.logoUrl) : "/logo.png"}
              alt="Blend N Sizzle logo"
              width={140}
              height={140}
              priority
              className="h-14 w-14 object-contain sm:h-16 sm:w-16"
            />
            <span className="font-heading text-lg font-bold leading-tight tracking-tight text-charcoal sm:text-xl">
              Blend N Sizzle
            </span>
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
      </header>

      {open && (
        <div
          id="mobile-nav-drawer"
          className="fixed inset-x-0 bottom-0 top-20 z-40 overflow-y-auto bg-ivory lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <nav className="flex flex-col gap-1 px-5 py-8" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="focus-ring rounded-lg border-b border-beige px-3 py-4 text-lg font-semibold text-charcoal"
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
    </>
  );
}
