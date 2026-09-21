"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageOff } from "lucide-react";
import { getSafeImageUrl } from "@/lib/image-url";

type UploadFolder = "products" | "gallery" | "pages" | "misc";

export default function ImageUploadField({
  value,
  folder,
  onChange,
  label,
}: {
  value?: string;
  folder: UploadFolder;
  onChange: (url: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
        setUploading(false);
        return;
      }

      onChange(data.url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {label && <label className="mb-1.5 block text-sm font-semibold text-charcoal">{label}</label>}

      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-beige bg-cream/50">
          {value ? (
            <Image src={getSafeImageUrl(value)} alt="Preview" fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-charcoal/30">
              <ImageOff size={22} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="focus-ring inline-flex items-center gap-2 rounded-lg border border-beige px-3.5 py-2 text-sm font-medium text-charcoal transition-colors hover:border-orange hover:text-orange-deep disabled:opacity-60"
            >
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {uploading ? "Uploading..." : value ? "Replace Image" : "Select Image"}
            </button>
            {value && !uploading && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-beige px-3.5 py-2 text-sm font-medium text-charcoal/60 transition-colors hover:border-orange hover:text-orange-deep"
              >
                <X size={16} />
                Remove
              </button>
            )}
          </div>
          {error && <p className="text-xs text-orange-deep">{error}</p>}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
