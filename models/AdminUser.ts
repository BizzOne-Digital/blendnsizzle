import mongoose, { Schema, Model, models } from "mongoose";

export interface IAdminUser {
  _id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, default: "Admin" },
  },
  { timestamps: true }
);

const AdminUser: Model<IAdminUser> =
  models.AdminUser || mongoose.model<IAdminUser>("AdminUser", AdminUserSchema);

export default AdminUser;
