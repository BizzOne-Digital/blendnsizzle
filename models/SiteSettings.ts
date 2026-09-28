import mongoose, { Schema, Model, models } from "mongoose";

export interface ISiteSettings {
  _id: string;
  businessName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  uberEatsUrl: string;
  doorDashUrl: string;
  googleMapsUrl: string;
  announcementText: string;
  openingStatus: string;
  openingDate: string;
  logoUrl: string;
  cateringEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    businessName: { type: String, default: "Blend N Sizzle" },
    tagline: { type: String, default: "Made for Cravings. Built for Goals." },
    email: { type: String, default: "blendnsizzle@gmail.com" },
    phone: { type: String, default: "613-970-6665" },
    address: { type: String, default: "31 Wilkins St, Belleville, ON K8P 1P2" },
    instagramUrl: { type: String, default: "" },
    facebookUrl: { type: String, default: "" },
    tiktokUrl: { type: String, default: "" },
    uberEatsUrl: { type: String, default: "" },
    doorDashUrl: { type: String, default: "" },
    googleMapsUrl: {
      type: String,
      default: "https://www.google.com/maps/search/?api=1&query=31+Wilkins+St+Belleville+ON+K8P+1P2",
    },
    announcementText: { type: String, default: "Opening Soon in Belleville" },
    openingStatus: { type: String, default: "Opening October" },
    openingDate: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
    cateringEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const SiteSettings: Model<ISiteSettings> =
  models.SiteSettings || mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

export default SiteSettings;
