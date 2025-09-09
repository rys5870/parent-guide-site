import mongoose from "mongoose";

const VisitSchema = new mongoose.Schema({
  path: { type: String, required: true },
  device: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const UserLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin", "moderator"], // אפשר להרחיב לפי הצורך
    },
    visits: [VisitSchema],
  },
  { timestamps: true }
);

export const UsersLogModel =
  mongoose.models.UsersLogModel || mongoose.model("UsersLogModel", UserLogSchema);