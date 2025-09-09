import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
  },
});

const AboutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 150,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  sections: {
    type: [SectionSchema],
    default: [],
    validate: {
      validator: function (arr: typeof SectionSchema[]) {
        return arr.length > 0;
      },
      message: "At least one section is required",
    },
  },
});

const AboutModel =
  mongoose.models.about || mongoose.model("about", AboutSchema);

export default AboutModel;