import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  type: { type: String, enum: ["text", "image"], required: true },
quote: { type: String },
image: { type: String },
  name: { type: String, required: true },
  details: { type: String },
  show: { type: Boolean, default: true },
}, { timestamps: true });

// וולידציה מותאמת אישית – חייב להיות quote או image
testimonialSchema.pre("validate", function(next) {
  if (!this.quote && !this.image) {
    next(new Error("חייב להיות quote או image"));
  } else {
    next();
  }
});

export default mongoose.models.Testimonial || mongoose.model("Testimonial", testimonialSchema);
