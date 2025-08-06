import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true,
  },
  name: { type: String, required: true },
  description: String,
  type: {
    type: [String],
    required: true,
    enum: ["nature", "monument", "souk", "museum", "restaurant"],
  },
  // e.g., "Historical", "Natural", "Entertainment"
  entryFees: {
    moroccan: {
      type: Number,
      default: 0,
    },
    foreigner: {
      type: Number,
      default: 0,
    },
  }, // it's an object because we will calculate the price based on the nationality
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
