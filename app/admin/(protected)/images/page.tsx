import type { Metadata } from "next";
import ImagesManager from "@/components/admin/ImagesManager";

export const metadata: Metadata = { title: "Images", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminImagesPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-charcoal">Images</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        Uploaded images stored in the database. Remove unused images to keep things tidy.
      </p>
      <div className="mt-6">
        <ImagesManager />
      </div>
    </div>
  );
}
