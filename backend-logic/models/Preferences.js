// models/Preference.js
import mongoose from "mongoose";

const preferenceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
  travelerType: {
    type: String,
    enum: ["solo", "family", "couple", "group"],
    required: true,
  },
  interests: { type: [{ type: String }], required: true }, // ["nature", "sports", "entertainment"]
  budget: { type: String, enum: ["low", "medium", "high"], required: true },
  days: { type: Number, required: true }, // number of days for itinerary
});
preferenceSchema.index({ user: 1 }, { unique: true });

export default mongoose.model("Preference", preferenceSchema);
