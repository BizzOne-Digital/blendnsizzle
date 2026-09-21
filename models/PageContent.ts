import mongoose, { Schema, Model, models } from "mongoose";

export interface IPageContent {
  _id: string;
  key: string;
  data: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const PageContentSchema = new Schema<IPageContent>(
  {
    key: { type: String, required: true, unique: true },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

const PageContent: Model<IPageContent> =
  models.PageContent || mongoose.model<IPageContent>("PageContent", PageContentSchema);

export default PageContent;
