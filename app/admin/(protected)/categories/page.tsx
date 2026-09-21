import type { Metadata } from "next";
import CategoriesManager from "@/components/admin/CategoriesManager";

export const metadata: Metadata = { title: "Categories", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminCategoriesPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-charcoal">Menu Categories</h1>
      <p className="mt-1 text-sm text-charcoal/60">Organize your menu into categories.</p>
      <div className="mt-6">
        <CategoriesManager />
      </div>
    </div>
  );
}
