import type { Metadata } from "next";
import SettingsForm from "@/components/admin/SettingsForm";

export const metadata: Metadata = { title: "Site Settings", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-charcoal">Site Settings</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        Business info, ordering links and social profiles used across the site.
      </p>
      <div className="mt-6">
        <SettingsForm />
      </div>
    </div>
  );
}
