"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unable to sign in");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Unable to sign in right now.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-charcoal">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="focus-ring w-full rounded-xl border border-beige bg-cream/40 px-4 py-3 text-charcoal"
          placeholder="admin@blendnsizzle.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-charcoal">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="focus-ring w-full rounded-xl border border-beige bg-cream/40 px-4 py-3 text-charcoal"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-orange/10 px-4 py-3 text-sm text-orange-deep">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="focus-ring flex w-full items-center justify-center gap-2 rounded-full bg-orange px-6 py-3.5 font-semibold text-white transition-colors hover:bg-orange-deep disabled:opacity-70"
      >
        {loading && <Loader2 size={18} className="animate-spin" />}
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
