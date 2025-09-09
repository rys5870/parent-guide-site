import mongoose from "mongoose";
const CategoriesSchema = new mongoose.Schema({
category: {
    type: String,
    required: true,
    trim: true,
  },
})
const CategoriesModel =
mongoose.models.Category || mongoose.model("Category", CategoriesSchema);
export default CategoriesModel;