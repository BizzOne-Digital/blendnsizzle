"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";

export type ToastState = { type: "success" | "error"; message: string } | null;

export default function Toast({ toast }: { toast: ToastState }) {
  if (!toast) return null;

  return (
    <div
      role="status"
      className={`fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
        toast.type === "success" ? "bg-green-deep" : "bg-orange-deep"
      }`}
    >
      {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      {toast.message}
    </div>
  );
}
