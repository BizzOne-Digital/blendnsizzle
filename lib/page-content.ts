import "server-only";
import { cache } from "react";
import { connectDB } from "@/lib/mongodb";
import PageContent from "@/models/PageContent";

export { HOME_CONTENT_DEFAULTS, type HomeContent } from "@/lib/home-content-defaults";

/**
 * Fetches a named PageContent document merged over its defaults, so newly
 * added fields degrade gracefully instead of rendering blank.
 */
export const getPageContent = cache(async <T extends Record<string, unknown>>(
  key: string,
  defaults: T
): Promise<T> => {
  await connectDB();
  const doc = await PageContent.findOne({ key }).lean();
  const stored = (doc?.data ?? {}) as Partial<T>;
  return { ...defaults, ...JSON.parse(JSON.stringify(stored)) };
});
