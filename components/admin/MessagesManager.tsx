"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Mail, Phone, Circle } from "lucide-react";
import Toast from "@/components/admin/Toast";
import { useToast } from "@/components/admin/useToast";

type Message = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast, showToast } = useToast();

  async function loadMessages() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      setMessages(data.messages || []);
    } catch {
      showToast("error", "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch-on-mount
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggleRead(msg: Message) {
    setMessages((prev) => prev.map((m) => (m._id === msg._id ? { ...m, read: !m.read } : m)));
    try {
      await fetch(`/api/admin/messages/${msg._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !msg.read }),
      });
    } catch {
      showToast("error", "Failed to update message");
      loadMessages();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this message?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.error || "Failed to delete message");
        return;
      }
      showToast("success", "Message deleted");
      loadMessages();
    } catch {
      showToast("error", "Failed to delete message");
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

  if (messages.length === 0) {
    return (
      <div className="rounded-2xl border border-beige bg-white p-10 text-center text-sm text-charcoal/55">
        No messages yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div key={msg._id} className="rounded-2xl border border-beige bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleRead(msg)}
                  className="focus-ring flex items-center gap-1.5 text-xs font-semibold text-charcoal/50 hover:text-orange-deep"
                  title={msg.read ? "Mark as unread" : "Mark as read"}
                >
                  <Circle size={8} className={msg.read ? "fill-transparent" : "fill-orange text-orange"} />
                  {msg.read ? "Read" : "Unread"}
                </button>
                <span className="text-xs text-charcoal/40">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>
              <h3 className="mt-1.5 font-heading text-base font-bold text-charcoal">{msg.subject}</h3>
              <p className="mt-0.5 text-sm text-charcoal/60">{msg.name}</p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(msg._id)}
              disabled={deletingId === msg._id}
              className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-charcoal/50 hover:bg-orange/10 hover:text-orange-deep disabled:opacity-50"
              aria-label="Delete message"
            >
              {deletingId === msg._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            </button>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-charcoal/75">{msg.message}</p>

          <div className="mt-4 flex flex-wrap gap-4 border-t border-beige pt-4 text-sm">
            <a href={`mailto:${msg.email}`} className="focus-ring flex items-center gap-1.5 text-charcoal/60 hover:text-orange-deep">
              <Mail size={14} />
              {msg.email}
            </a>
            {msg.phone && (
              <a href={`tel:${msg.phone}`} className="focus-ring flex items-center gap-1.5 text-charcoal/60 hover:text-orange-deep">
                <Phone size={14} />
                {msg.phone}
              </a>
            )}
          </div>
        </div>
      ))}
      <Toast toast={toast} />
    </div>
  );
}
