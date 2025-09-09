
import mongoose from "mongoose";
const ContentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
   status: {
    type: String,
    required: false,
    trim: true,
    default: "לא טופל" 
  },

  isDelete: {
    type: Boolean,
    require: false,
    default: false,
  },
});
export const ContentModel =
  mongoose.models.content || mongoose.model("content", ContentSchema);
export default ContentModel;
