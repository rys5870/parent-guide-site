import mongoose, { Schema, models, model } from "mongoose";

const DrawingSchema = new Schema(
  {
    childName: { type: String, required: true, trim: true },
    childAge: { type: Number, required: true, min: 1 },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    contact: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    background: { type: String, default: "", trim: true },
    notes: { type: String, default: "", trim: true },
    imageUrl: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "in_review", "completed"],
      default: "pending",
    },
    response: { type: String, default: "", trim: true },
    submittedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // מוסיף createdAt ו־updatedAt אוטומטית
  }
);

export const DrawingModel =
  mongoose.models.Drawing || mongoose.model("Drawing", DrawingSchema);

export default DrawingModel;