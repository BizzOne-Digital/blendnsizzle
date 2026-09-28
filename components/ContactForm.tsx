"use client";

import { useState, type FormEvent } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      company: formData.get("company"), // honeypot
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-green/30 bg-green/5 p-10 text-center">
        <CheckCircle2 size={40} className="text-green-deep" />
        <h3 className="font-heading text-xl font-bold text-charcoal">Message Sent</h3>
        <p className="text-sm text-charcoal/65">
          Thanks for reaching out — we&apos;ll get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="focus-ring mt-2 text-sm font-semibold text-orange-deep hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="hidden">
        <label htmlFor="company">Company</label>
        <input type="text" id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-charcoal">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={120}
            className="focus-ring w-full rounded-xl border border-beige bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/35"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-charcoal">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={200}
            className="focus-ring w-full rounded-xl border border-beige bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/35"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-charcoal">
            Phone <span className="font-normal text-charcoal/40">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            maxLength={40}
            className="focus-ring w-full rounded-xl border border-beige bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/35"
            placeholder="(000) 000-0000"
          />
        </div>
        <div>
          <label htmlFor="subject" className="mb-1.5 block text-sm font-semibold text-charcoal">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            required
            maxLength={200}
            className="focus-ring w-full rounded-xl border border-beige bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/35"
            placeholder="How can we help?"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-charcoal">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          maxLength={4000}
          className="focus-ring w-full resize-none rounded-xl border border-beige bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/35"
          placeholder="Tell us what's on your mind..."
        />
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 rounded-xl bg-orange/10 px-4 py-3 text-sm text-orange-deep">
          <AlertCircle size={18} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange px-7 py-4 font-semibold text-white transition-colors hover:bg-orange-deep disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {status === "loading" && <Loader2 size={18} className="animate-spin" />}
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
