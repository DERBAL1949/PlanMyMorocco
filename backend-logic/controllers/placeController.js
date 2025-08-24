import Place from "../models/Place.js";
import City from "../models/City.js";

export const getPlaces = async (req, res) => {
  try {
    const cityId = req.params.id;

    const city = await City.findById(cityId);

    const places = await Place.find({ city: cityId });

    res.status(200).json({
      city,
      places,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch city and places", error: err });
  }
};
