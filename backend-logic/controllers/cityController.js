import City from "../models/City.js";

// Create a new city by the Admin
// export const createCity = async (req, res) => {
//   try {
//     const newCity = new City(req.body);
//     const savedCity = await newCity.save();
//     res.status(201).json(savedCity);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to create city", error: err });
//   }
// };

//Get All cities :

export const getAllCities = async (req, res) => {
  try {
    const cities = await City.find();
    res.status(200).json(cities);
  } catch (err) {
    console.error("Error fetching cities:", err);

    res.status(500).json({ message: "Failed to fetch cities", error: err });
  }
};
