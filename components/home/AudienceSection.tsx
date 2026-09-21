import { Dumbbell, HeartPulse, Coffee } from "lucide-react";

const AUDIENCES = [
  {
    icon: Dumbbell,
    title: "For Gym Enthusiasts",
    description: "High-protein and goal-friendly options.",
  },
  {
    icon: HeartPulse,
    title: "For Health-Conscious Customers",
    description: "Lower-sugar and zero-sugar options you'll love.",
  },
  {
    icon: Coffee,
    title: "For Coffee Lovers",
    description: "Rich flavours and premium quality.",
  },
];

export default function AudienceSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
      <div className="grid gap-10 sm:grid-cols-3">
        {AUDIENCES.map((a) => (
          <div key={a.title} className="text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green/10 text-green-deep">
              <a.icon size={28} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <h3 className="mt-5 font-heading text-lg font-bold text-charcoal">{a.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/65">{a.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
