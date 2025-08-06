import mongoose from "mongoose";
import xlsx from "xlsx";
import dotenv from "dotenv";
import City from "./models/City.js";
import Place from "./models/Place.js";

dotenv.config();
console.log("Connecting to:", process.env.MONGODB_URL);

// ✅ Helper function to parse entry fees

function parseEntryFees(value) {
  const moroccanMatch = value?.match(/Moroccan:?\s*(\d+)/i);
  const foreignerMatch = value?.match(/Foreigner:?\s*(\d+)/i);

  return {
    moroccan: moroccanMatch ? parseInt(moroccanMatch[1]) : 0,
    foreigner: foreignerMatch ? parseInt(foreignerMatch[1]) : 0,
  };
}
// this is foe avgPrice
function extractNumber(value) {
  const match = typeof value === "string" ? value.match(/\d+(\.\d+)?/) : null;
  return match ? parseFloat(match[0]) : typeof value === "number" ? value : 0;
}

// this is for : type
const allowedTypes = ["nature", "monument", "souk", "museum", "restaurant"];

function parseTypes(value) {
  if (!value) return [];
  return value
    .split("/")
    .map((t) => t.trim().toLowerCase())
    .filter((t) => allowedTypes.includes(t));
}

async function importData() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected");
    // ⚠️ Delete existing data before re-importing
    await City.deleteMany({});
    await Place.deleteMany({});

    const workbook = xlsx.readFile("./data/data.xlsx"); // adjust path

    const citiesSheet = xlsx.utils.sheet_to_json(workbook.Sheets["Cities"]);
    const placesSheet = xlsx.utils.sheet_to_json(workbook.Sheets["Places"]);

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

      const fees = parseEntryFees(place.entryFeesMAD);
      const parsedTypes = parseTypes(place.type);
      const newPlace = new Place({
        name: place.placetovisit,
        description: place.description || "",
        city: cityId,
        type: parsedTypes,
        entryFees: fees || 0,
        averagePrice: extractNumber(place.avgPriceMAD) || 0,
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
