"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Trash2 } from "lucide-react";
import Toast from "@/components/admin/Toast";
import { useToast } from "@/components/admin/useToast";

type StoredImage = {
  id: string;
  folder: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: string;
  url: string;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ImagesManager() {
  const [images, setImages] = useState<StoredImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast, showToast } = useToast();

  async function loadImages() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/images");
      const data = await res.json();
      setImages(data.images || []);
    } catch {
      showToast("error", "Failed to load images");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch-on-mount
    loadImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this image? Any content referencing it will show a placeholder.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/images/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.error || "Failed to delete image");
        return;
      }
      showToast("success", "Image deleted");
      loadImages();
    } catch {
      showToast("error", "Failed to delete image");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-beige bg-white p-16">
        <Loader2 className="animate-spin text-charcoal/40" size={24} />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="rounded-2xl border border-beige bg-white p-10 text-center text-sm text-charcoal/55">
        No images uploaded yet. Images uploaded from menu items, categories or settings will appear here.
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {images.map((img) => (
        <div key={img.id} className="overflow-hidden rounded-2xl border border-beige bg-white shadow-sm">
          <div className="relative aspect-square w-full bg-cream">
            <Image src={img.url} alt={img.filename} fill className="object-cover" />
          </div>
          <div className="p-3">
            <p className="truncate text-xs font-semibold text-charcoal">{img.filename}</p>
            <p className="mt-0.5 text-xs text-charcoal/50">
              {img.folder} · {formatBytes(img.size)}
            </p>
            <button
              type="button"
              onClick={() => handleDelete(img.id)}
              disabled={deletingId === img.id}
              className="focus-ring mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-orange-deep hover:underline disabled:opacity-50"
            >
              {deletingId === img.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              Delete
            </button>
          </div>
        </div>
      ))}
      <Toast toast={toast} />
    </div>
  );
}
