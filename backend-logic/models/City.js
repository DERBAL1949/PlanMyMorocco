import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  image: String,
});

export default mongoose.model("City", citySchema);
