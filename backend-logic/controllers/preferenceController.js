import Preference from "../models/Preferences.js";

export const savePreferences = async (req, res) => {
  try {
    // Destructure required fields from the request body
    const { userId, cityId, travelerType, interests, budget, days } = req.body;

    // Basic validation for essential fields (though the model handles Mongoose validation)
    if (!userId || !cityId) {
      return res
        .status(400)
        .json({ error: "User ID and City ID are required" });
    }

    // Use findOneAndUpdate to perform an UPSERT operation:
    // 1. Find a document where the 'user' ID matches.
    // 2. If found, update it with the new data.
    // 3. If NOT found, create a new document (due to upsert: true).
    const updatedPrefs = await Preference.findOneAndUpdate(
      { user: userId },
      {
        city: cityId,
        travelerType,
        interests,
        budget,
        days,
      },
      {
        new: true, // Return the updated (or newly created) document
        upsert: true, // Crucial: Create the document if it doesn't exist
        runValidators: true, // Ensure schema validation runs on the update operation
      }
    );

    // Use status 200 (OK) as it covers both update and insertion (upsert)
    res.status(200).json({
      message: "Preferences saved successfully",
      preference: updatedPrefs,
    });
  } catch (err) {
    // This block will catch Mongoose validation errors or database connection issues
    // Note: The E11000 duplicate key error is now resolved by the findOneAndUpdate logic
    console.error("Error saving preferences:", err);
    res.status(500).json({ error: err.message });
  }
};
