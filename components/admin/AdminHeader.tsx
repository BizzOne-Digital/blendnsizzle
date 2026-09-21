"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Menu, X, ExternalLink } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminHeader({ email }: { email: string }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-beige bg-white px-5 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-charcoal lg:hidden"
            aria-label="Open admin menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>
          <span className="text-sm text-charcoal/60">
            Signed in as <span className="font-semibold text-charcoal">{email}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="focus-ring hidden items-center gap-1.5 text-sm font-medium text-charcoal/70 hover:text-orange-deep sm:flex"
          >
            View Site <ExternalLink size={14} />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="focus-ring flex items-center gap-2 rounded-full border border-beige px-4 py-2 text-sm font-semibold text-charcoal transition-colors hover:border-orange hover:text-orange-deep"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-64 bg-charcoal">
            <div className="flex h-16 items-center justify-end px-4">
              <button
                type="button"
                className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-cream"
                aria-label="Close admin menu"
                onClick={() => setMobileOpen(false)}
              >
                <X size={22} />
              </button>
            </div>
            <div onClick={() => setMobileOpen(false)}>
              <AdminSidebar forceVisible />
            </div>
          </div>
          <div className="flex-1 bg-charcoal/40" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}
