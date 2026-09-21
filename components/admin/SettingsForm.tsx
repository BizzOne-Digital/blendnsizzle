"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import Toast from "@/components/admin/Toast";
import { useToast } from "@/components/admin/useToast";

type SettingsFormState = {
  businessName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  uberEatsUrl: string;
  doorDashUrl: string;
  googleMapsUrl: string;
  announcementText: string;
  openingStatus: string;
  openingDate: string;
  logoUrl: string;
  cateringEnabled: boolean;
};

const FIELD_GROUPS: { title: string; fields: { key: keyof SettingsFormState; label: string; placeholder?: string }[] }[] = [
  {
    title: "Business Info",
    fields: [
      { key: "businessName", label: "Business Name" },
      { key: "tagline", label: "Tagline" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "address", label: "Address" },
    ],
  },
  {
    title: "Opening Status",
    fields: [
      { key: "openingStatus", label: "Opening Status", placeholder: "e.g. Opening October" },
      { key: "openingDate", label: "Opening Date", placeholder: "e.g. October 2026" },
      { key: "announcementText", label: "Announcement Bar Text" },
    ],
  },
  {
    title: "Ordering Links",
    fields: [
      { key: "uberEatsUrl", label: "Uber Eats URL", placeholder: "https://ubereats.com/..." },
      { key: "doorDashUrl", label: "DoorDash URL", placeholder: "https://doordash.com/..." },
    ],
  },
  {
    title: "Location",
    fields: [{ key: "googleMapsUrl", label: "Google Maps URL" }],
  },
  {
    title: "Social Profiles",
    fields: [
      { key: "instagramUrl", label: "Instagram URL" },
      { key: "facebookUrl", label: "Facebook URL" },
      { key: "tiktokUrl", label: "TikTok URL" },
    ],
  },
];

const DEFAULT_FORM: SettingsFormState = {
  businessName: "",
  tagline: "",
  email: "",
  phone: "",
  address: "",
  instagramUrl: "",
  facebookUrl: "",
  tiktokUrl: "",
  uberEatsUrl: "",
  doorDashUrl: "",
  googleMapsUrl: "",
  announcementText: "",
  openingStatus: "",
  openingDate: "",
  logoUrl: "",
  cateringEnabled: false,
};

export default function SettingsForm() {
  const [form, setForm] = useState<SettingsFormState>(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast, showToast } = useToast();

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setForm({ ...DEFAULT_FORM, ...data.settings });
      })
      .catch(() => showToast("error", "Failed to load settings"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.error || "Failed to save settings");
        return;
      }
      showToast("success", "Settings saved");
    } catch {
      showToast("error", "Failed to save settings");
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
    <div className="space-y-6">
      <div className="rounded-2xl border border-beige bg-white p-6 shadow-sm">
        <h2 className="font-heading text-base font-bold text-charcoal">Logo</h2>
        <div className="mt-4">
          <ImageUploadField folder="pages" value={form.logoUrl} onChange={(url) => setForm({ ...form, logoUrl: url })} />
        </div>
      </div>

      {FIELD_GROUPS.map((group) => (
        <div key={group.title} className="rounded-2xl border border-beige bg-white p-6 shadow-sm">
          <h2 className="font-heading text-base font-bold text-charcoal">{group.title}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {group.fields.map((field) => (
              <div key={field.key} className={field.key === "address" ? "sm:col-span-2" : ""}>
                <label className="mb-1.5 block text-sm font-semibold text-charcoal">{field.label}</label>
                <input
                  value={form[field.key] as string}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="focus-ring w-full rounded-xl border border-beige px-4 py-2.5"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="rounded-2xl border border-beige bg-white p-6 shadow-sm">
        <h2 className="font-heading text-base font-bold text-charcoal">Services</h2>
        <label className="mt-4 flex items-center gap-2 text-sm font-medium text-charcoal">
          <input
            type="checkbox"
            checked={form.cateringEnabled}
            onChange={(e) => setForm({ ...form, cateringEnabled: e.target.checked })}
            className="h-4 w-4 rounded border-beige"
          />
          Show Catering / Meal Options on the Services page
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="focus-ring inline-flex items-center gap-2 rounded-full bg-orange px-7 py-3 text-sm font-semibold text-white hover:bg-orange-deep disabled:opacity-70"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Settings
        </button>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
