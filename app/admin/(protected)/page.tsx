import type { Metadata } from "next";
import Link from "next/link";
import { UtensilsCrossed, FolderTree, MessageSquare, Image as ImageIcon, Star } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import MenuItem from "@/models/MenuItem";
import MenuCategory from "@/models/MenuCategory";
import ContactMessage from "@/models/ContactMessage";
import StoredUpload from "@/models/StoredUpload";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };

async function getDashboardStats() {
  await connectDB();
  const [totalMenuItems, totalCategories, totalMessages, totalImages, featuredItems, recentMessages] =
    await Promise.all([
      MenuItem.countDocuments(),
      MenuCategory.countDocuments(),
      ContactMessage.countDocuments(),
      StoredUpload.countDocuments(),
      MenuItem.countDocuments({ featured: true }),
      ContactMessage.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

  return {
    totalMenuItems,
    totalCategories,
    totalMessages,
    totalImages,
    featuredItems,
    recentMessages: JSON.parse(JSON.stringify(recentMessages)),
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Total Menu Items", value: stats.totalMenuItems, icon: UtensilsCrossed, href: "/admin/menu" },
    { label: "Categories", value: stats.totalCategories, icon: FolderTree, href: "/admin/categories" },
    { label: "Contact Messages", value: stats.totalMessages, icon: MessageSquare, href: "/admin/messages" },
    { label: "Uploaded Images", value: stats.totalImages, icon: ImageIcon, href: "/admin/images" },
    { label: "Featured Items", value: stats.featuredItems, icon: Star, href: "/admin/menu" },
  ];

  const quickActions = [
    { label: "Add Menu Item", href: "/admin/menu" },
    { label: "Add Category", href: "/admin/categories" },
    { label: "Update Home Content", href: "/admin/pages" },
    { label: "Manage Ordering Links", href: "/admin/settings" },
    { label: "Manage Images", href: "/admin/images" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-charcoal">Dashboard</h1>
        <p className="mt-1 text-sm text-charcoal/60">Overview of your Blend N Sizzle site.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="focus-ring rounded-2xl border border-beige bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange/10 text-orange-deep">
              <card.icon size={20} />
            </span>
            <p className="mt-4 font-heading text-2xl font-bold text-charcoal">{card.value}</p>
            <p className="mt-1 text-xs font-medium text-charcoal/55">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-beige bg-white p-6 shadow-sm">
          <h2 className="font-heading text-lg font-bold text-charcoal">Recent Contact Messages</h2>
          {stats.recentMessages.length === 0 ? (
            <p className="mt-4 text-sm text-charcoal/55">No messages yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-beige">
              {stats.recentMessages.map((msg: { _id: string; name: string; subject: string; email: string; createdAt: string }) => (
                <li key={msg._id} className="py-3">
                  <p className="text-sm font-semibold text-charcoal">{msg.subject}</p>
                  <p className="text-xs text-charcoal/55">
                    {msg.name} · {msg.email}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/messages" className="focus-ring mt-4 inline-block text-sm font-semibold text-orange-deep hover:underline">
            View all messages
          </Link>
        </div>

        <div className="rounded-2xl border border-beige bg-white p-6 shadow-sm">
          <h2 className="font-heading text-lg font-bold text-charcoal">Quick Actions</h2>
          <ul className="mt-4 space-y-2">
            {quickActions.map((action) => (
              <li key={action.label}>
                <Link
                  href={action.href}
                  className="focus-ring block rounded-xl border border-beige px-4 py-3 text-sm font-medium text-charcoal transition-colors hover:border-orange hover:text-orange-deep"
                >
                  {action.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
