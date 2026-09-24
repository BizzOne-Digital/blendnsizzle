import mongoose, { Schema, Model, models } from "mongoose";
import { MENU_TAGS, type MenuTag } from "@/lib/menu-tags";

export { MENU_TAGS };
export type { MenuTag };

export interface IMenuItemNutrition {
  calories?: number;
  protein?: number;
  carbs?: number;
  sugar?: number;
  fat?: number;
}

export interface IMenuItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price?: number;
  category: mongoose.Types.ObjectId;
  image?: string;
  tags: MenuTag[];
  featured: boolean;
  available: boolean;
  sortOrder: number;
  nutrition?: IMenuItemNutrition;
  createdAt: Date;
  updatedAt: Date;
}

const NutritionSchema = new Schema<IMenuItemNutrition>(
  {
    calories: { type: Number, min: 0 },
    protein: { type: Number, min: 0 },
    carbs: { type: Number, min: 0 },
    sugar: { type: Number, min: 0 },
    fat: { type: Number, min: 0 },
  },
  { _id: false }
);

const MenuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, min: 0 },
    category: { type: Schema.Types.ObjectId, ref: "MenuCategory", required: true },
    image: { type: String, default: "" },
    tags: { type: [String], enum: MENU_TAGS, default: [] },
    featured: { type: Boolean, default: false },
    available: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    nutrition: { type: NutritionSchema, default: undefined },
  },
  { timestamps: true }
);

MenuItemSchema.index({ category: 1, sortOrder: 1 });

const MenuItem: Model<IMenuItem> =
  models.MenuItem || mongoose.model<IMenuItem>("MenuItem", MenuItemSchema);

export default MenuItem;
