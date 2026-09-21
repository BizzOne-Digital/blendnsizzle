import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";

const JWT_SECRET = process.env.JWT_SECRET;
export const SESSION_COOKIE = "bns_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface AdminSessionPayload {
  adminId: string;
  email: string;
}

function getSecret(): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return JWT_SECRET;
}

export function signSessionToken(payload: AdminSessionPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: SESSION_MAX_AGE });
}

export function verifySessionToken(token: string): AdminSessionPayload | null {
  try {
    return jwt.verify(token, getSecret()) as AdminSessionPayload;
  } catch {
    return null;
  }
}

export async function createAdminSession(payload: AdminSessionPayload) {
  const token = signSessionToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Verifies the caller holds a valid admin session AND the referenced admin
 * user still exists in the database. Returns the session payload or null.
 */
export async function requireAdmin(): Promise<AdminSessionPayload | null> {
  const session = await getAdminSession();
  if (!session) return null;

  await connectDB();
  const admin = await AdminUser.findById(session.adminId).lean();
  if (!admin) return null;

  return session;
}
