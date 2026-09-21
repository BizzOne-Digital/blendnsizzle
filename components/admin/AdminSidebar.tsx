"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  FolderTree,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Menu Items", href: "/admin/menu", icon: UtensilsCrossed },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Page Content", href: "/admin/pages", icon: FileText },
  { label: "Images", href: "/admin/images", icon: ImageIcon },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ forceVisible = false }: { forceVisible?: boolean }) {
  const pathname = usePathname();

  return (
    <aside
      className={`w-64 shrink-0 border-r border-white/10 bg-charcoal ${forceVisible ? "block" : "hidden lg:block"}`}
    >
      <div className="flex h-16 items-center px-6">
        <Image src="/logo.png" alt="Blend N Sizzle" width={140} height={47} className="h-8 w-auto object-contain" />
      </div>
      <nav className="mt-4 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-orange text-white" : "text-cream/70 hover:bg-white/5 hover:text-cream"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
