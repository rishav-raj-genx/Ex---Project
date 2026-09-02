import mongoose, { type Document, Schema } from "mongoose";

export interface IItem {
  name: string;
  description: string;
  status: "active" | "inactive" | "archived";
}

export interface IItemDocument extends IItem, Document {
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<IItemDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive", "archived"],
        message: "Status must be active, inactive, or archived",
      },
      default: "active",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Item = mongoose.model<IItemDocument>("Item", itemSchema);
