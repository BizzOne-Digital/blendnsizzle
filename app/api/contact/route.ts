import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
import { contactFormSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Honeypot: bots that fill hidden fields are silently accepted and dropped.
    if (body.company) {
      return NextResponse.json({ success: true });
    }

    const parsed = contactFormSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Invalid submission";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    await connectDB();
    await ContactMessage.create({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || "",
      subject: parsed.data.subject,
      message: parsed.data.message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form submission failed:", error);
    return NextResponse.json({ error: "Unable to send your message right now." }, { status: 500 });
  }
}
