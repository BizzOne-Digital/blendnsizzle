"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import Toast from "@/components/admin/Toast";
import { useToast } from "@/components/admin/useToast";
import { HOME_CONTENT_DEFAULTS, type HomeContent } from "@/lib/home-content-defaults";

const FIELDS: { key: keyof HomeContent; label: string; multiline?: boolean }[] = [
  { key: "heroEyebrow", label: "Hero Eyebrow Text" },
  { key: "heroSubtitle", label: "Hero Subtitle", multiline: true },
  { key: "aboutHeading", label: "About Section Heading" },
  { key: "aboutText", label: "About Section Text", multiline: true },
  { key: "comingSoonHeading", label: "Coming Soon Banner Heading" },
  { key: "comingSoonSubtext", label: "Coming Soon Banner Subtext" },
];

export default function HomeContentForm() {
  const [form, setForm] = useState<HomeContent>(HOME_CONTENT_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast, showToast } = useToast();

  useEffect(() => {
    fetch("/api/admin/pages?key=home")
      .then((res) => res.json())
      .then((data) => setForm({ ...HOME_CONTENT_DEFAULTS, ...data.content }))
      .catch(() => showToast("error", "Failed to load content"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "home", data: form }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.error || "Failed to save content");
        return;
      }
      showToast("success", "Homepage content saved");
    } catch {
      showToast("error", "Failed to save content");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-beige bg-white p-16">
        <Loader2 className="animate-spin text-charcoal/40" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-5 rounded-2xl border border-beige bg-white p-6 shadow-sm">
      {FIELDS.map((field) => (
        <div key={field.key}>
          <label className="mb-1.5 block text-sm font-semibold text-charcoal">{field.label}</label>
          {field.multiline ? (
            <textarea
              value={form[field.key]}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              rows={4}
              className="focus-ring w-full resize-none rounded-xl border border-beige px-4 py-2.5"
            />
          ) : (
            <input
              value={form[field.key]}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              className="focus-ring w-full rounded-xl border border-beige px-4 py-2.5"
            />
          )}
        </div>
      ))}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="focus-ring inline-flex items-center gap-2 rounded-full bg-orange px-7 py-3 text-sm font-semibold text-white hover:bg-orange-deep disabled:opacity-70"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Content
        </button>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
