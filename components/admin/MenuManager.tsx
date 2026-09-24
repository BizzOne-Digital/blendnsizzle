"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2, Star, X } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import Toast from "@/components/admin/Toast";
import { useToast } from "@/components/admin/useToast";
import { getSafeImageUrl } from "@/lib/image-url";
import { MENU_TAGS } from "@/lib/menu-tags";

type Category = { _id: string; name: string };

type Nutrition = {
  calories?: number;
  protein?: number;
  carbs?: number;
  sugar?: number;
  fat?: number;
};

type MenuItemRow = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price?: number;
  category: { _id: string; name: string } | string;
  image?: string;
  tags: string[];
  featured: boolean;
  available: boolean;
  nutrition?: Nutrition;
};

const NUTRITION_FIELDS: { key: keyof Nutrition; label: string; unit: string }[] = [
  { key: "calories", label: "Calories", unit: "kcal" },
  { key: "protein", label: "Protein", unit: "g" },
  { key: "carbs", label: "Carbs", unit: "g" },
  { key: "sugar", label: "Sugar", unit: "g" },
  { key: "fat", label: "Fat", unit: "g" },
];

const EMPTY_NUTRITION: Record<keyof Nutrition, string> = {
  calories: "",
  protein: "",
  carbs: "",
  sugar: "",
  fat: "",
};

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  tags: [] as string[],
  featured: false,
  available: true,
  nutrition: { ...EMPTY_NUTRITION },
};

export default function MenuManager() {
  const [items, setItems] = useState<MenuItemRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast, showToast } = useToast();

  async function loadData() {
    setLoading(true);
    try {
      const [itemsRes, catsRes] = await Promise.all([
        fetch("/api/admin/menu"),
        fetch("/api/admin/categories"),
      ]);
      const itemsData = await itemsRes.json();
      const catsData = await catsRes.json();
      setItems(itemsData.items || []);
      setCategories(catsData.categories || []);
    } catch {
      showToast("error", "Failed to load menu data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch-on-mount
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, category: categories[0]?._id || "" });
    setFormOpen(true);
  }

  function openEdit(item: MenuItemRow) {
    setEditingId(item._id);
    const nutrition = { ...EMPTY_NUTRITION };
    for (const field of NUTRITION_FIELDS) {
      const value = item.nutrition?.[field.key];
      if (typeof value === "number") nutrition[field.key] = String(value);
    }
    setForm({
      name: item.name,
      description: item.description || "",
      price: typeof item.price === "number" ? String(item.price) : "",
      category: typeof item.category === "string" ? item.category : item.category._id,
      image: item.image || "",
      tags: item.tags || [],
      featured: item.featured,
      available: item.available,
      nutrition,
    });
    setFormOpen(true);
  }

  function toggleTag(tag: string) {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));
  }

  async function handleSave() {
    if (!form.name.trim()) {
      showToast("error", "Item name is required");
      return;
    }
    if (!form.category) {
      showToast("error", "Please select a category");
      return;
    }

    setSaving(true);
    try {
      const nutrition: Nutrition = {};
      for (const field of NUTRITION_FIELDS) {
        const raw = form.nutrition[field.key];
        if (raw.trim() !== "") nutrition[field.key] = Number(raw);
      }

      const payload = {
        ...form,
        price: form.price ? Number(form.price) : undefined,
        nutrition: Object.keys(nutrition).length > 0 ? nutrition : undefined,
      };
      const res = await fetch(editingId ? `/api/admin/menu/${editingId}` : "/api/admin/menu", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        showToast("error", data.error || "Failed to save item");
        return;
      }

      showToast("success", editingId ? "Item updated" : "Item created");
      setFormOpen(false);
      loadData();
    } catch {
      showToast("error", "Failed to save item");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this menu item? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/menu/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.error || "Failed to delete item");
        return;
      }
      showToast("success", "Item deleted");
      loadData();
    } catch {
      showToast("error", "Failed to delete item");
    } finally {
      setDeletingId(null);
    }
  }

  async function toggleAvailable(item: MenuItemRow) {
    try {
      const res = await fetch(`/api/admin/menu/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !item.available }),
      });
      if (!res.ok) throw new Error();
      loadData();
    } catch {
      showToast("error", "Failed to update availability");
    }
  }

  return (
    <div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={openCreate}
          disabled={categories.length === 0}
          className="focus-ring inline-flex items-center gap-2 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-deep disabled:opacity-50"
        >
          <Plus size={16} />
          Add Menu Item
        </button>
      </div>
      {categories.length === 0 && !loading && (
        <p className="mt-2 text-right text-xs text-orange-deep">Create a category first.</p>
      )}

      <div className="mt-6 rounded-2xl border border-beige bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center p-10 text-charcoal/50">
            <Loader2 className="animate-spin" size={22} />
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-sm text-charcoal/55">
            No menu items yet. Add your first item to build out the menu.
          </div>
        ) : (
          <ul className="divide-y divide-beige">
            {items.map((item) => (
              <li key={item._id} className="flex items-center gap-4 p-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream">
                  <Image src={getSafeImageUrl(item.image)} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-charcoal">{item.name}</p>
                    {item.featured && <Star size={14} className="fill-orange text-orange" />}
                  </div>
                  <p className="text-xs text-charcoal/50">
                    {typeof item.category === "string" ? "" : item.category.name}
                    {typeof item.price === "number" ? ` · $${item.price.toFixed(2)}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleAvailable(item)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    item.available ? "bg-green/10 text-green-deep" : "bg-charcoal/10 text-charcoal/50"
                  }`}
                >
                  {item.available ? "Available" : "Unavailable"}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-charcoal/60 hover:bg-cream hover:text-charcoal"
                  aria-label={`Edit ${item.name}`}
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item._id)}
                  disabled={deletingId === item._id}
                  className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-charcoal/60 hover:bg-orange/10 hover:text-orange-deep disabled:opacity-50"
                  aria-label={`Delete ${item.name}`}
                >
                  {deletingId === item._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-charcoal/50 p-4">
          <div className="my-8 w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-charcoal">
                {editingId ? "Edit Menu Item" : "New Menu Item"}
              </h2>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-charcoal/50 hover:bg-cream"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-charcoal">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="focus-ring w-full rounded-xl border border-beige px-4 py-2.5"
                  placeholder="e.g. Espresso Protein Latte"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-charcoal">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="focus-ring w-full rounded-xl border border-beige px-4 py-2.5"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-charcoal">
                    Price <span className="font-normal text-charcoal/40">(optional)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="focus-ring w-full rounded-xl border border-beige px-4 py-2.5"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-charcoal">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="focus-ring w-full resize-none rounded-xl border border-beige px-4 py-2.5"
                />
              </div>

              <ImageUploadField
                label="Item Image"
                folder="products"
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
              />

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-charcoal">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {MENU_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`focus-ring rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        form.tags.includes(tag)
                          ? "border-orange bg-orange text-white"
                          : "border-beige text-charcoal/60 hover:border-orange hover:text-orange-deep"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-charcoal">
                  Nutrition Info <span className="font-normal text-charcoal/40">(optional, per serving)</span>
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {NUTRITION_FIELDS.map((field) => (
                    <div key={field.key}>
                      <label className="mb-1 block text-xs font-medium text-charcoal/60">
                        {field.label} ({field.unit})
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={form.nutrition[field.key]}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            nutrition: { ...form.nutrition, [field.key]: e.target.value },
                          })
                        }
                        className="focus-ring w-full rounded-xl border border-beige px-3 py-2 text-sm"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm font-medium text-charcoal">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="h-4 w-4 rounded border-beige"
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-charcoal">
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(e) => setForm({ ...form, available: e.target.checked })}
                    className="h-4 w-4 rounded border-beige"
                  />
                  Available
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="focus-ring rounded-full px-5 py-2.5 text-sm font-semibold text-charcoal/60 hover:bg-cream"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="focus-ring inline-flex items-center gap-2 rounded-full bg-orange px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-deep disabled:opacity-70"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast toast={toast} />
    </div>
  );
}
