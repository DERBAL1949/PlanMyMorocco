import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true,
  },
  name: { type: String, required: true },
  description: String,
  type: String, // e.g., "Historical", "Natural", "Entertainment"
  entryFees: Number,
  averagePrice: Number,
  openHours: String, // e.g., "9am - 6pm"
  transportDetails: String,
  tips: String,
  usefulInfo: String,
  category: {
    type: [String],
    enum: ["couple", "solo", "family", "group"],
    default: [],
  },
  rate: {
    type: Number,
    min: 0,
    max: 5,
  },
});

export default mongoose.model("Place", placeSchema);
