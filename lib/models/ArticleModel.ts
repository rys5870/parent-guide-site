
import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: false, 
    trim: true,
  },
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
const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 150,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
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
isDelete: {
  type: Boolean,
  required: false,
  default: false,
},
isPublished: {
  type: Boolean,
  required: false,
  default: true,
},
isFavorite: {
  type: Boolean,
  required: false,
  default: false,
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
const ArticleModel =
  mongoose.models.article || mongoose.model("article", ArticleSchema);

export default ArticleModel;