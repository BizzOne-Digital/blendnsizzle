"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ExternalLink, Phone, MessageCircle } from "lucide-react";
import type { ISiteSettings } from "@/models/SiteSettings";

function toWhatsAppLink(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const withCountryCode = digits.length === 10 ? `1${digits}` : digits;
  return `https://wa.me/${withCountryCode}`;
}

export default function OrderNowMenu({
  settings,
  fullWidth = false,
}: {
  settings: ISiteSettings;
  fullWidth?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const deliveryOptions = [
    { name: "Uber Eats", url: settings.uberEatsUrl },
    { name: "DoorDash", url: settings.doorDashUrl },
  ];

  return (
    <div className={`relative ${fullWidth ? "w-full" : ""}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-orange px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-orange-deep ${fullWidth ? "w-full" : ""}`}
      >
        Order Now
        <ChevronDown size={18} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-beige bg-white shadow-lg"
        >
          {deliveryOptions.map((option) => {
            const disabled = !option.url;
            return disabled ? (
              <div
                key={option.name}
                role="menuitem"
                aria-disabled="true"
                className="flex cursor-not-allowed items-center justify-between px-5 py-3 text-charcoal/40"
                title="Ordering link coming soon"
              >
                <span>{option.name}</span>
                <span className="text-xs">Coming soon</span>
              </div>
            ) : (
              <a
                key={option.name}
                role="menuitem"
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring flex items-center justify-between px-5 py-3 text-charcoal transition-colors hover:bg-cream"
                onClick={() => setOpen(false)}
              >
                <span>{option.name}</span>
                <ExternalLink size={16} />
              </a>
            );
          })}

          {settings.phone && (
            <>
              <div className="border-t border-beige px-5 pb-1 pt-3 text-xs font-bold uppercase tracking-wide text-charcoal/40">
                Pickup Order
              </div>
              <a
                role="menuitem"
                href={`tel:${settings.phone}`}
                className="focus-ring flex items-center justify-between px-5 py-3 text-charcoal transition-colors hover:bg-cream"
                onClick={() => setOpen(false)}
              >
                <span>Call to Order</span>
                <Phone size={16} />
              </a>
              <a
                role="menuitem"
                href={toWhatsAppLink(settings.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring flex items-center justify-between px-5 py-3 text-charcoal transition-colors hover:bg-cream"
                onClick={() => setOpen(false)}
              >
                <span>WhatsApp to Order</span>
                <MessageCircle size={16} />
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}
