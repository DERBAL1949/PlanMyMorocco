import Place from "../models/Place.js";
import Preference from "../models/Preferences.js";

export const generatePlan = async (req, res) => {
  try {
    const { userId } = req.params; // we’ll get userId from URL

    // 1️⃣ Get user preferences
    const prefs = await Preference.findOne({ user: userId }).populate("city");
    if (!prefs) {
      return res
        .status(404)
        .json({ message: "Preferences not found for user" });
    }

    // Since preferences are required, these checks handle database anomalies
    if (!prefs.city) {
      return res.status(400).json({ message: "Preferences missing city" });
    }

    const city = prefs.city;

    // ensuring interests is always an array, even if Mongoose returns a single string.
    let interests = prefs.interests;
    if (typeof interests === "string" && interests.length > 0) {
      // Case 1: Convert a non-empty string into an array
      interests = [interests];
    } else if (!Array.isArray(interests)) {
      // Case 2: Default to empty array if it's null, undefined, or wrong type
      interests = [];
    }

    const budget = prefs.budget || "medium";
    const days = prefs.days || 1;
    const travelerType = prefs.travelerType || ""; // Fallback for safety

    // Log a warning if no interests are defined, though less likely now that the field is required
    if (interests.length === 0) {
      console.warn(
        `User ${userId} has no interests defined. Filtering by interests will be skipped.`
      );
    }

    // 2️⃣ Get places in that city
    const places = await Place.find({ city: city._id }).lean();

    // 3️⃣ Filter by interests (type) and traveler type
    let filteredPlaces = places.filter((p) => {
      // Defensive check: Ensure p.type is an array before calling some()
      const placeTypes = Array.isArray(p.type) ? p.type : [];

      // Interest filtering: If interests array is empty, all places pass the interest filter.
      const matchesInterest =
        interests.length === 0 || placeTypes.some((t) => interests.includes(t));

      // Traveler Type filtering: Using p.category as per your Place document structure
      const matchesTraveler =
        Array.isArray(p.category) && p.category.includes(travelerType);

      return matchesInterest && matchesTraveler;
    });

    // 4️⃣ Filter by budget
    let priceRange;
    if (budget === "low") priceRange = [0, 100];
    else if (budget === "medium") priceRange = [100, 300];
    else priceRange = [300, Infinity];

    filteredPlaces = filteredPlaces.filter(
      // Use nullish coalescing (?? 0) to handle potentially missing averagePrice fields
      (p) =>
        (p.averagePrice ?? 0) >= priceRange[0] &&
        (p.averagePrice ?? 0) <= priceRange[1]
    );

    // 5️⃣ Shuffle places randomly to get variety
    filteredPlaces = filteredPlaces.sort(() => Math.random() - 0.5);

    // 6️⃣ Divide into days (3 per day)
    const itinerary = [];
    let index = 0;

    for (let day = 1; day <= days; day++) {
      const dayActivities = filteredPlaces.slice(index, index + 3);

      // If we run out of places, stop generating days (unless it's the very first day)
      if (
        dayActivities.length === 0 &&
        index >= filteredPlaces.length &&
        day > 1
      ) {
        break;
      }

      // Only push the day if there are activities planned for it, or it's the first day (to show an empty day)
      if (dayActivities.length > 0 || day === 1) {
        itinerary.push({
          day,
          activities: dayActivities.map((a) => ({
            name: a.placetovisit,
            type: a.type,
            averagePrice: a.averagePrice,
            description: a.description,
            tips: a.tips,
          })),
        });
      }

      index += 3;

      // Stop loop if we have consumed all places and the last day was partial
      if (index >= filteredPlaces.length && dayActivities.length < 3) {
        break;
      }
    }

    res.status(200).json({
      city: city.name,
      totalDays: days,
      itinerary,
    });
  } catch (error) {
    console.error("Error generating plan:", error);
    res
      .status(500)
      .json({ message: "Failed to generate plan", error: error.message });
  }
};
