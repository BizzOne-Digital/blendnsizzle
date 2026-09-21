import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-5">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Blend N Sizzle"
            width={160}
            height={54}
            className="mx-auto h-10 w-auto object-contain"
          />
          <h1 className="mt-4 font-heading text-xl font-bold text-charcoal">Admin Sign In</h1>
          <p className="mt-1 text-sm text-charcoal/55">Blend N Sizzle management panel</p>
        </div>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
