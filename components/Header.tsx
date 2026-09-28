"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import type { ISiteSettings } from "@/models/SiteSettings";
import OrderNowMenu from "@/components/OrderNowMenu";
import { getSafeImageUrl } from "@/lib/image-url";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Menu", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export default function Header({ settings }: { settings: ISiteSettings }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
        <header className="mx-auto max-w-6xl overflow-visible rounded-full border border-white/20 bg-charcoal/45 shadow-xl shadow-charcoal/25 backdrop-blur-2xl">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:h-20 sm:px-6">
            <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2" aria-label="Blend N Sizzle home">
              <Image
                src={settings.logoUrl ? getSafeImageUrl(settings.logoUrl) : "/logo.png"}
                alt="Blend N Sizzle"
                width={140}
                height={140}
                priority
                className="h-10 w-10 shrink-0 object-contain sm:h-14 sm:w-14"
              />
              <Image
                src="/logo2.png"
                alt="Blend N Sizzle"
                width={1666}
                height={340}
                priority
                className="h-4 w-auto min-w-0 object-contain sm:h-7"
              />
            </Link>

            <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
              {NAV_LINKS.map((link) => {
                const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`focus-ring rounded pb-0.5 font-medium transition-colors ${
                      active
                        ? "border-b-2 border-orange text-cream"
                        : "border-b-2 border-transparent text-cream/75 hover:text-cream"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <div className="hidden lg:block">
                <OrderNowMenu settings={settings} />
              </div>

              <button
                type="button"
                className="focus-ring flex h-11 w-11 items-center justify-center rounded-full text-cream transition-colors hover:bg-white/10"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="mobile-nav-drawer"
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </header>
      </div>

      {open && (
        <div
          id="mobile-nav-drawer"
          className="fixed inset-x-0 bottom-0 top-[76px] z-40 overflow-y-auto bg-ivory sm:top-[96px] lg:hidden"
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
