"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, GripVertical, X } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import Toast from "@/components/admin/Toast";
import { useToast } from "@/components/admin/useToast";

type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  sortOrder: number;
  active: boolean;
};

const EMPTY_FORM = { name: "", description: "", image: "", active: true };

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast, showToast } = useToast();

  async function loadCategories() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch {
      showToast("error", "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch-on-mount
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  }

  function openEdit(category: Category) {
    setEditingId(category._id);
    setForm({
      name: category.name,
      description: category.description || "",
      image: category.image || "",
      active: category.active,
    });
    setFormOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim()) {
      showToast("error", "Category name is required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        showToast("error", data.error || "Failed to save category");
        return;
      }

      showToast("success", editingId ? "Category updated" : "Category created");
      setFormOpen(false);
      loadCategories();
    } catch {
      showToast("error", "Failed to save category");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.error || "Failed to delete category");
        return;
      }
      showToast("success", "Category deleted");
      loadCategories();
    } catch {
      showToast("error", "Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={openCreate}
          className="focus-ring inline-flex items-center gap-2 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-deep"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-beige bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center p-10 text-charcoal/50">
            <Loader2 className="animate-spin" size={22} />
          </div>
        ) : categories.length === 0 ? (
          <div className="p-10 text-center text-sm text-charcoal/55">
            No categories yet. Add your first category to start building the menu.
          </div>
        ) : (
          <ul className="divide-y divide-beige">
            {categories.map((category) => (
              <li key={category._id} className="flex items-center gap-4 p-4">
                <GripVertical size={18} className="shrink-0 text-charcoal/25" />
                <div className="flex-1">
                  <p className="font-semibold text-charcoal">{category.name}</p>
                  <p className="text-xs text-charcoal/50">/{category.slug}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    category.active ? "bg-green/10 text-green-deep" : "bg-charcoal/10 text-charcoal/50"
                  }`}
                >
                  {category.active ? "Active" : "Inactive"}
                </span>
                <button
                  type="button"
                  onClick={() => openEdit(category)}
                  className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-charcoal/60 hover:bg-cream hover:text-charcoal"
                  aria-label={`Edit ${category.name}`}
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(category._id)}
                  disabled={deletingId === category._id}
                  className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-charcoal/60 hover:bg-orange/10 hover:text-orange-deep disabled:opacity-50"
                  aria-label={`Delete ${category.name}`}
                >
                  {deletingId === category._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-charcoal">
                {editingId ? "Edit Category" : "New Category"}
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
                  placeholder="e.g. Coffee & Espresso Drinks"
                />
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
                label="Category Image"
                folder="gallery"
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
              />
              <label className="flex items-center gap-2 text-sm font-medium text-charcoal">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="h-4 w-4 rounded border-beige"
                />
                Active (visible on site)
              </label>
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
