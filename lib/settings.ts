import { cache } from "react";
import { connectDB } from "@/lib/mongodb";
import SiteSettings, { ISiteSettings } from "@/models/SiteSettings";

/**
 * Fetches the singleton SiteSettings document, creating it with defaults
 * on first run. Cached per-request via React's cache() so Header/Footer/
 * pages sharing a request don't each issue a query.
 */
export const getSiteSettings = cache(async (): Promise<ISiteSettings> => {
  await connectDB();
  let settings = await SiteSettings.findOne().lean<ISiteSettings | null>();
  if (!settings) {
    const created = await SiteSettings.create({});
    settings = created.toObject();
  }
  return JSON.parse(JSON.stringify(settings));
});
