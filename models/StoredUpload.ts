import mongoose, { Schema, Model, models } from "mongoose";

export type UploadFolder = "products" | "gallery" | "pages" | "misc";

export const UPLOAD_FOLDERS: UploadFolder[] = ["products", "gallery", "pages", "misc"];

export interface IStoredUpload {
  _id: string;
  folder: UploadFolder;
  filename: string;
  mimeType: string;
  size: number;
  data: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

const StoredUploadSchema = new Schema<IStoredUpload>(
  {
    folder: { type: String, required: true, enum: UPLOAD_FOLDERS },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

StoredUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });

const StoredUpload: Model<IStoredUpload> =
  models.StoredUpload || mongoose.model<IStoredUpload>("StoredUpload", StoredUploadSchema);

export default StoredUpload;
