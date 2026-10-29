import Image from "next/image";

export default function PromoBanner() {
  return (
    <section className="bg-ivory py-12 lg:py-16">
      <div className="mx-auto max-w-md px-5 lg:px-8">
        <div className="relative aspect-[1122/1402] w-full overflow-hidden rounded-3xl shadow-lg">
          <Image
            src="/attachment_0.jpeg"
            alt="Follow us on Instagram for 10% off, leave a Google review for 10% off, or do both for 20% off — show staff at checkout"
            fill
            sizes="(min-width: 1024px) 420px, 90vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
