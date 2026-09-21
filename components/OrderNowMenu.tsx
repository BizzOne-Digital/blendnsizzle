"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import type { ISiteSettings } from "@/models/SiteSettings";

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

  const options = [
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
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-beige bg-white shadow-lg"
        >
          {options.map((option) => {
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
        </div>
      )}
    </div>
  );
}
