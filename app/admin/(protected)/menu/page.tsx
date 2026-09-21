import type { Metadata } from "next";
import MenuManager from "@/components/admin/MenuManager";

export const metadata: Metadata = { title: "Menu Items", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminMenuPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-charcoal">Menu Items</h1>
      <p className="mt-1 text-sm text-charcoal/60">Add, edit and manage your menu.</p>
      <div className="mt-6">
        <MenuManager />
      </div>
    </div>
  );
}
