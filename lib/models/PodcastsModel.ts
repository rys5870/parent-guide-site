import mongoose from "mongoose";

const PodcastsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl:{
     type: String,
    required: true,
  },
   type: {
  type: String,
  required: true,
  enum: ["audio", "video"],
},
  
  url: {
    type: String,
    required: true,
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  isPublished: {
    type: Boolean,
    required: false,
    default: false,
  },
    isFavorite: {
    type: Boolean,
    required: false,
    default: false,
  },
  playCount: {
  type: Number,
  required: false,
  default: 0,
}


});

  const PodcastsModel = mongoose.models.Podcast || mongoose.model("Podcast", PodcastsSchema, "podcasts");

export default PodcastsModel;