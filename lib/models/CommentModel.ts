
import mongoose from "mongoose";
const CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  articleId: {
    type: String,
    required: true,
    trim: true,
  },
  timestamp:{
    type: Date,
    default: Date.now,

  },
  isDelete:{
    require:false,
    type:Boolean,
    default:false
  }

});
export const CommentModel =
  mongoose.models.comment || mongoose.model("comment", CommentSchema);
export default CommentModel;
