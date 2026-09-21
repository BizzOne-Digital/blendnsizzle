import type { Metadata } from "next";
import HomeContentForm from "@/components/admin/HomeContentForm";

export const metadata: Metadata = { title: "Page Content", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminPagesPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-charcoal">Page Content</h1>
      <p className="mt-1 text-sm text-charcoal/60">Edit key text shown on the homepage.</p>
      <div className="mt-6 max-w-2xl">
        <HomeContentForm />
      </div>
    </div>
  );
}
