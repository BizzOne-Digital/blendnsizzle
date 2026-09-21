"use client";

import { useCallback, useRef, useState } from "react";
import type { ToastState } from "@/components/admin/Toast";

export function useToast() {
  const [toast, setToast] = useState<ToastState>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setToast(null), 3500);
  }, []);

  return { toast, showToast };
}
