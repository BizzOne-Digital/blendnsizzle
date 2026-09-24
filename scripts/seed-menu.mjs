// Seeds MenuCategory + MenuItem documents from the real Blend N Sizzle menu,
// uploading each public/prod/imgN.png into MongoDB as a StoredUpload (same
// binary-in-Mongo pattern the admin upload flow uses) and pointing each
// MenuItem.image at its resulting /api/uploads/products/<filename> URL.
//
// Run with:  node --env-file=.env scripts/seed-menu.mjs

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set. Run with: node --env-file=.env scripts/seed-menu.mjs");
  process.exit(1);
}

const PROD_DIR = path.resolve(process.cwd(), "public/prod");

const CATEGORIES = [
  { slug: "hot-drinks", name: "Hot Drinks", sortOrder: 0 },
  { slug: "matcha", name: "Matcha", sortOrder: 1 },
  { slug: "chilled-frozen-drinks", name: "Chilled & Frozen Drinks", sortOrder: 2 },
  { slug: "wraps-bowls", name: "Wraps & Bowls", sortOrder: 3 },
  { slug: "sandwiches", name: "Sandwiches", sortOrder: 4 },
  { slug: "chillas", name: "Chillas", sortOrder: 5 },
  { slug: "soups", name: "Soups", sortOrder: 6 },
  { slug: "egg-house", name: "Egg House", sortOrder: 7 },
  { slug: "snack-n-sizzle", name: "Snack N Sizzle", sortOrder: 8 },
  { slug: "smoothie-juice-specials", name: "Smoothie, Juice & Specials", sortOrder: 9 },
  { slug: "sweet-healthy", name: "Sweet & Healthy", sortOrder: 10 },
  { slug: "chilled-sizzle-refreshers", name: "Chilled Sizzle Refreshers", sortOrder: 11 },
  { slug: "chilled-sizzle-energizer", name: "Chilled Sizzle Energizer", sortOrder: 12 },
];

// img = filename in public/prod (imgN.png), price = representative single
// price (smallest listed size variant), featured = true for menu items
// marked with the crown "Barista Special" icon on the source menu.
const ITEMS = [
  { img: 1, name: "Latte", category: "hot-drinks", price: 3.49 },
  { img: 2, name: "Cappuccino", category: "hot-drinks", price: 3.49 },
  { img: 3, name: "Americano", category: "hot-drinks", price: 3.49 },
  { img: 4, name: "Flat White", category: "hot-drinks", price: 3.49 },
  { img: 5, name: "French Vanila", category: "hot-drinks", price: 2.49, featured: true },
  { img: 6, name: "Hot Shardaai", category: "hot-drinks", price: 4.49, featured: true },
  { img: 7, name: "Hot Chocolate", category: "hot-drinks", price: 2.49 },
  { img: 8, name: "Matcha Latte", category: "matcha", price: 2.99 },
  { img: 9, name: "Matcha with Espresso", category: "matcha", price: 3.49 },
  { img: 10, name: "Vanila Matcha", category: "matcha", price: 3.49 },
  { img: 11, name: "Matcha Cremazzo", category: "matcha", price: 3.49, featured: true },
  { img: 12, name: "Strawberry Matcha Latte", category: "matcha", price: 3.79 },
  { img: 13, name: "Matcha with Strawberry Foam", category: "matcha", price: 3.79 },
  { img: 14, name: "Chilled Coffee", category: "chilled-frozen-drinks", price: 2.49 },
  { img: 15, name: "Flavoured Coffee", category: "chilled-frozen-drinks", price: 2.79 },
  { img: 16, name: "Frozzino", category: "chilled-frozen-drinks", price: 2.99 },
  { img: 17, name: "Flavoured Frozzino", category: "chilled-frozen-drinks", price: 3.49 },
  { img: 18, name: "Flavoured Cremazzo", category: "chilled-frozen-drinks", price: 3.49 },
  { img: 19, name: "Chilled Latte", category: "chilled-frozen-drinks", price: 2.79 },
  { img: 20, name: "Flavoured Latte", category: "chilled-frozen-drinks", price: 2.99 },
  { img: 21, name: "Chick Pea", category: "wraps-bowls", price: 6.99 },
  { img: 22, name: "Kidney Beans", category: "wraps-bowls", price: 6.99 },
  { img: 23, name: "Tandoori Paneer Wrap", category: "wraps-bowls", price: 7.49 },
  { img: 24, name: "Egg & Avocado Wrap", category: "wraps-bowls", price: 7.49, featured: true },
  { img: 25, name: "Super Power Bowl", category: "wraps-bowls", price: 8.99, featured: true },
  { img: 26, name: "Potato Sandwich", category: "sandwiches", price: 4.99 },
  { img: 27, name: "Avocado Veggie Sandwich", category: "sandwiches", price: 5.99 },
  { img: 28, name: "Egg Avocado & Cheese Sandwich", category: "sandwiches", price: 6.99 },
  { img: 29, name: "Tandoori Paneer Sandwich", category: "sandwiches", price: 6.99 },
  { img: 30, name: "Besan Veggie Chilla", category: "chillas", price: 5.99 },
  { img: 31, name: "Moong Dal Veggie Chilla", category: "chillas", price: 6.49 },
  { img: 32, name: "Loaded Chilla", category: "chillas", price: 7.99 },
  { img: 33, name: "Broccoli Soup", category: "soups", price: 4.49 },
  { img: 34, name: "Mix Veg Soup", category: "soups", price: 4.99 },
  { img: 35, name: "Chana Soup", category: "soups", price: 4.99 },
  { img: 36, name: "Boiled Eggs 2pcs", category: "egg-house", price: 2.49 },
  { img: 37, name: "Boiled Eggs 3pcs", category: "egg-house", price: 3.49 },
  { img: 38, name: "Classic Bread Omelette", category: "egg-house", price: 3.99 },
  { img: 39, name: "Veggies Bread Omelette", category: "egg-house", price: 4.49 },
  { img: 40, name: "Veggies Egg Omelette", category: "egg-house", price: 4.49 },
  { img: 41, name: "Golden Corn", category: "snack-n-sizzle", price: 3.49 },
  { img: 42, name: "Makhana Magic", category: "snack-n-sizzle", price: 4.99 },
  { img: 43, name: "Sweet Potato Chaat", category: "snack-n-sizzle", price: 4.99 },
  { img: 44, name: "Mix Fruit Smoothie", category: "smoothie-juice-specials", price: 3.99, featured: true },
  { img: 45, name: "Golden Blend", category: "smoothie-juice-specials", price: 4.99, featured: true },
  { img: 46, name: "Fresh Fruit Juice", category: "smoothie-juice-specials", price: 3.49, featured: true },
  { img: 47, name: "Milk Soda", category: "smoothie-juice-specials", price: 3.99 },
  { img: 48, name: "Classic Overnight Oats", category: "sweet-healthy", price: 3.99 },
  { img: 49, name: "Fresh Fruits & Nuts Overnight Oats", category: "sweet-healthy", price: 5.49 },
  { img: 50, name: "Yogurt & Fruit Parfait", category: "sweet-healthy", price: 4.99 },
  { img: 51, name: "Strawberry Sizzle Refresher", category: "chilled-sizzle-refreshers", price: 3.49 },
  { img: 52, name: "Mango Sizzle Refresher", category: "chilled-sizzle-refreshers", price: 3.49, featured: true },
  { img: 53, name: "Mango Dragon Fruit Sizzle Refresher", category: "chilled-sizzle-refreshers", price: 3.49, featured: true },
  { img: 54, name: "Red Bull Energizer", category: "chilled-sizzle-energizer", price: 5.49 },
];

const slugify = (value) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// --- Schemas mirroring models/StoredUpload.ts, models/MenuCategory.ts, models/MenuItem.ts ---

const StoredUpload =
  mongoose.models.StoredUpload ||
  mongoose.model(
    "StoredUpload",
    new mongoose.Schema(
      {
        folder: { type: String, required: true, enum: ["products", "gallery", "pages", "misc"] },
        filename: { type: String, required: true },
        mimeType: { type: String, required: true },
        size: { type: Number, required: true },
        data: { type: Buffer, required: true },
      },
      { timestamps: true }
    ).index({ folder: 1, filename: 1 }, { unique: true })
  );

const MenuCategory =
  mongoose.models.MenuCategory ||
  mongoose.model(
    "MenuCategory",
    new mongoose.Schema(
      {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        description: { type: String, default: "" },
        image: { type: String, default: "" },
        sortOrder: { type: Number, default: 0 },
        active: { type: Boolean, default: true },
      },
      { timestamps: true }
    )
  );

const MenuItem =
  mongoose.models.MenuItem ||
  mongoose.model(
    "MenuItem",
    new mongoose.Schema(
      {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        description: { type: String, default: "" },
        price: { type: Number, min: 0 },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "MenuCategory", required: true },
        image: { type: String, default: "" },
        tags: {
          type: [String],
          enum: ["High Protein", "Low Sugar", "Zero Sugar", "Vegetarian", "Vegan", "Gluten Conscious"],
          default: [],
        },
        featured: { type: Boolean, default: false },
        available: { type: Boolean, default: true },
        sortOrder: { type: Number, default: 0 },
      },
      { timestamps: true }
    )
  );

async function deleteStoredUploadByUrl(url) {
  if (!url || !url.startsWith("/api/uploads/")) return;
  const [folder, filename] = url.replace("/api/uploads/", "").split("/");
  if (!folder || !filename) return;
  await StoredUpload.deleteOne({ folder, filename });
}

async function uploadProductImage(imgNumber) {
  const filePath = path.join(PROD_DIR, `img${imgNumber}.png`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing image file: ${filePath}`);
  }
  const buffer = fs.readFileSync(filePath);
  const filename = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.png`;

  await StoredUpload.create({
    folder: "products",
    filename,
    mimeType: "image/png",
    size: buffer.length,
    data: buffer,
  });

  return `/api/uploads/products/${filename}`;
}

async function main() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);

  console.log(`Seeding ${CATEGORIES.length} categories...`);
  const categoryIdBySlug = new Map();
  for (const cat of CATEGORIES) {
    const doc = await MenuCategory.findOneAndUpdate(
      { slug: cat.slug },
      { $set: { name: cat.name, sortOrder: cat.sortOrder, active: true } },
      { upsert: true, new: true }
    );
    categoryIdBySlug.set(cat.slug, doc._id);
  }

  console.log(`Seeding ${ITEMS.length} menu items with images from public/prod...`);
  let created = 0;
  let updated = 0;

  for (const [index, item] of ITEMS.entries()) {
    const slug = slugify(item.name);
    const categoryId = categoryIdBySlug.get(item.category);
    if (!categoryId) {
      throw new Error(`Unknown category "${item.category}" for item "${item.name}"`);
    }

    const existing = await MenuItem.findOne({ slug });
    if (existing?.image) {
      await deleteStoredUploadByUrl(existing.image);
    }

    const imageUrl = await uploadProductImage(item.img);

    const result = await MenuItem.findOneAndUpdate(
      { slug },
      {
        $set: {
          name: item.name,
          slug,
          price: item.price,
          category: categoryId,
          image: imageUrl,
          featured: Boolean(item.featured),
          available: true,
          sortOrder: index,
        },
      },
      { upsert: true, new: true }
    );

    if (existing) {
      updated += 1;
    } else {
      created += 1;
    }
    console.log(`  [${index + 1}/${ITEMS.length}] ${item.name} -> ${result.slug}`);
  }

  console.log(`\nDone. Categories: ${CATEGORIES.length}. Items created: ${created}, updated: ${updated}.`);
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
