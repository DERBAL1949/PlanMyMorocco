import mongoose from "mongoose";
import xlsx from "xlsx";
import dotenv from "dotenv";
import City from "./models/City.js";
import Place from "./models/Place.js";

dotenv.config();
console.log("Connecting to:", process.env.MONGODB_URL);

async function importData() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected");

    const workbook = xlsx.readFile("./data/data.xlsx"); // adjust path

    const citiesSheet = xlsx.utils.sheet_to_json(workbook.Sheets["Cities"]);
    const placesSheet = xlsx.utils.sheet_to_json(workbook.Sheets["Places"]);

    // check data is imported succesfuly
    console.log("✅ Loaded cities:", citiesSheet);
    console.log("✅ Loaded places:", placesSheet);

    const cityNameToId = {};

    // Insert cities
    for (const city of citiesSheet) {
      const newCity = new City({
        name: city.name,
        description: city.description || "",
        image: city.image || "",
      });
      const savedCity = await newCity.save();
      cityNameToId[savedCity.name.trim().toLowerCase()] = savedCity._id;
    }
    console.log("Cities imported");

    // Insert places
    for (const place of placesSheet) {
      const cityId = cityNameToId[place.city?.trim().toLowerCase()];
      if (!cityId) {
        console.warn(`City not found for place: ${place.name}`);
        continue;
      }
      const newPlace = new Place({
        name: place.placetovisit,
        description: place.description || "",
        city: cityId,
        type: place.type || "",
        entryFees: place.entryFeesMAD || 0,
        averagePrice: place.avgPriceMAD || 0,
        openHours: place.openHours || "",
        transportDetails: place.transportDetails || "",
        tips: place.tips || "",
        usefulInfo: place.usefulInfo || "",
        category: place.category?.split(",").map((c) => c.trim()) || [],
        rate: place.rate || 0,
      });
      await newPlace.save();
    }
    console.log("Places imported");

    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error(error);
  }
}

importData();
