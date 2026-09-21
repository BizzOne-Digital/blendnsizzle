import type { Metadata } from "next";
import MessagesManager from "@/components/admin/MessagesManager";

export const metadata: Metadata = { title: "Contact Messages", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminMessagesPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-charcoal">Contact Messages</h1>
      <p className="mt-1 text-sm text-charcoal/60">Messages submitted through the contact form.</p>
      <div className="mt-6">
        <MessagesManager />
      </div>
    </div>
  );
}
