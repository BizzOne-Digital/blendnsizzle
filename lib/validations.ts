import { z } from "zod";
import { MENU_TAGS } from "@/models/MenuItem";

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email address").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(4000),
  company: z.string().max(0).optional().or(z.literal("")), // honeypot
});

export const menuCategorySchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  image: z.string().trim().optional().or(z.literal("")),
  sortOrder: z.number().int().optional(),
  active: z.boolean().optional(),
});

export const menuItemSchema = z.object({
  name: z.string().trim().min(1).max(160),
  slug: z.string().trim().min(1).max(160).optional(),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  price: z.number().min(0).optional().nullable(),
  category: z.string().trim().min(1, "Category is required"),
  image: z.string().trim().optional().or(z.literal("")),
  tags: z.array(z.enum(MENU_TAGS)).optional(),
  featured: z.boolean().optional(),
  available: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const siteSettingsSchema = z.object({
  businessName: z.string().trim().max(160).optional(),
  tagline: z.string().trim().max(200).optional(),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional(),
  address: z.string().trim().max(300).optional(),
  instagramUrl: z.string().trim().max(500).optional().or(z.literal("")),
  facebookUrl: z.string().trim().max(500).optional().or(z.literal("")),
  tiktokUrl: z.string().trim().max(500).optional().or(z.literal("")),
  uberEatsUrl: z.string().trim().max(500).optional().or(z.literal("")),
  doorDashUrl: z.string().trim().max(500).optional().or(z.literal("")),
  googleMapsUrl: z.string().trim().max(500).optional().or(z.literal("")),
  announcementText: z.string().trim().max(200).optional().or(z.literal("")),
  openingStatus: z.string().trim().max(200).optional().or(z.literal("")),
  openingDate: z.string().trim().max(100).optional().or(z.literal("")),
  logoUrl: z.string().trim().max(500).optional().or(z.literal("")),
  cateringEnabled: z.boolean().optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});
