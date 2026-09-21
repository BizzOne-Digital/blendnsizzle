import "server-only";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import StoredUpload, { UPLOAD_FOLDERS, UploadFolder } from "@/models/StoredUpload";

export { getSafeImageUrl } from "@/lib/image-url";

export const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const MAX_UPLOAD_SIZE = 8 * 1024 * 1024; // 8MB

export function isValidFolder(folder: string): folder is UploadFolder {
  return (UPLOAD_FOLDERS as string[]).includes(folder);
}

export function isSafeFilenameSegment(value: string): boolean {
  if (!value) return false;
  if (value.includes("..") || value.includes("/") || value.includes("\\")) return false;
  return /^[a-zA-Z0-9._-]+$/.test(value);
}

export function generateSecureFilename(mimeType: string): string {
  const extension = ALLOWED_MIME_TYPES[mimeType];
  const random = crypto.randomBytes(8).toString("hex");
  return `${Date.now()}-${random}.${extension}`;
}

export function buildUploadUrl(folder: string, filename: string): string {
  return `/api/uploads/${folder}/${filename}`;
}

/**
 * Deletes the StoredUpload backing a `/api/uploads/<folder>/<filename>` URL.
 * Silently no-ops for any other URL shape (external/legacy URLs).
 */
export async function deleteStoredUploadByUrl(url?: string | null): Promise<void> {
  if (!url || !url.startsWith("/api/uploads/")) return;

  const parts = url.replace("/api/uploads/", "").split("/");
  if (parts.length !== 2) return;

  const [folder, filename] = parts;
  if (!isValidFolder(folder) || !isSafeFilenameSegment(filename)) return;

  await connectDB();
  await StoredUpload.deleteOne({ folder, filename });
}

