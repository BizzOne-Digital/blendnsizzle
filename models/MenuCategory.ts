import mongoose, { Schema, Model, models } from "mongoose";

export interface IMenuCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  sortOrder: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MenuCategorySchema = new Schema<IMenuCategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

MenuCategorySchema.index({ sortOrder: 1 });

const MenuCategory: Model<IMenuCategory> =
  models.MenuCategory || mongoose.model<IMenuCategory>("MenuCategory", MenuCategorySchema);

export default MenuCategory;
