import City from "../models/City.js";
import Place from "../models/Place.js";

// Create a new city by the Admin
export const createCity = async (req, res) => {
  try {
    const newCity = new City(req.body);
    const savedCity = await newCity.save();
    res.status(201).json(savedCity);
  } catch (err) {
    res.status(500).json({ message: "Failed to create city", error: err });
  }
};

//Get All cities :

export const getAllCities = async (req, res) => {
  try {
    const cities = City.find();
    res.status(200).json(cities);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cities", error: err });
  }
};

//Get one city by ID
export const getCityById = async (req, res) => {
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
