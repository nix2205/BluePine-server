// const axios = require("axios");
// const CityMap = require("../models/CityMap");
// const SRC = require("../models/SRC");
// const User = require("../models/User");
// const haversineDistance = require("../utils/haversineDistance");


// // POST /api/mapping/record
// exports.recordLocation = async (req, res) => {
//   try {
//     const { lat, lon, selectedCity } = req.body;
//     const userId = req.user._id; // assuming auth middleware sets this

//     if (!lat || !lon || !selectedCity) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // 1️⃣ Check if city exists in user's SRC
//     const srcEntry = await SRC.findOne({
//       user: userId,
//       placeOfWork: selectedCity,
//     });

//     if (!srcEntry) {
//       return res.status(400).json({
//         message: "Selected city not found in your SRC list",
//       });
//     }

//     // 2️⃣ Ensure city not already mapped by this user
//     const existing = await CityMap.findOne({
//       user: userId,
//       city: selectedCity,
//     });

//     if (existing) {
//       return res.status(400).json({
//         message: "City already mapped",
//       });
//     }

//     // 3️⃣ Reverse Geocode using OpenCage
//     const response = await axios.get(
//       `https://api.opencagedata.com/geocode/v1/json`,
//       {
//         params: {
//           key: process.env.OPENCAGE_API_KEY,
//           q: `${lat},${lon}`,
//         },
//       }
//     );

//     const address =
//       response.data.results[0]?.formatted || "Address not found";

//     // 4️⃣ Create Mapping
//     const newMapping = await CityMap.create({
//       user: userId,
//       city: selectedCity,
//       location: {
//         lat,
//         lon,
//       },
//       radiusKm: srcEntry.radius,
//       stationType: srcEntry.station,
//       address,
//       date: new Date(),
//       time: new Date().toLocaleTimeString(),
//     });

//     res.status(201).json({
//       message: "Location recorded successfully",
//       data: newMapping,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };



// exports.getMappedCities = async (req, res) => {
//   try {
//     const user = req.user;

//     let cities;

//     if (user.role === "admin") {
//       cities = await CityMap.find().populate("user", "username role");
//     }

//     else if (user.role === "manager") {
//       const subordinates = await User.find({ superior: user._id });
//       const subordinateIds = subordinates.map(u => u._id);

//       cities = await CityMap.find({
//         user: { $in: subordinateIds },
//       }).populate("user", "username role");
//     }

//     else if (user.role === "executive") {
//       cities = await CityMap.find({
//         user: user._id,
//       });
//     }

//     res.json(cities);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// exports.deleteMapping = async (req, res) => {
//   try {
//     const { id } = req.params;

//     await CityMap.findByIdAndDelete(id);

//     res.json({ message: "Mapping deleted successfully" });

//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };


// // POST /api/mapping/resolve-user-city
// exports.resolveUserCityFromCoords = async (req, res) => {
//   try {
//     const { lat, lon } = req.body;
//     const userId = req.user._id;

//     if (!lat || !lon) {
//       return res.status(400).json({
//         message: "Latitude and longitude required",
//       });
//     }

//     // 1️⃣ Fetch this user's mapped cities
//     const mappedCities = await CityMap.find({ user: userId });

//     if (!mappedCities.length) {
//       return res.status(404).json({
//         message: "No mapped cities found for this user",
//       });
//     }

//     // 2️⃣ Check each city
//     for (const city of mappedCities) {
//       const dist = haversineDistance(
//         lat,
//         lon,
//         city.location.lat,
//         city.location.lon
//       );

//       if (dist <= city.radiusKm) {
//         return res.json({
//           matched: true,
//           city: city.city,
//           stationType: city.stationType,
//           radiusKm: city.radiusKm,
//           distanceFromCenter: dist.toFixed(2),
//         });
//       }
//     }

//     // 3️⃣ If no match
//     return res.json({
//       matched: false,
//       message: "Location outside mapped territories",
//     });

//   } catch (err) {
//     console.error("Error resolving user city:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };









const axios = require("axios");
const CityMap = require("../models/CityMap");
const SRC = require("../models/SRC");
const User = require("../models/User");
const haversineDistance = require("../utils/haversineDistance");


// ===============================
// POST /api/mapping/record
// ===============================
exports.recordLocation = async (req, res) => {
  try {
    const { lat, lon, selectedCity } = req.body;
    const userId = req.user._id;

    if (!lat || !lon || !selectedCity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1️⃣ Check city exists in user's SRC
    const srcEntry = await SRC.findOne({
      user: userId,
      placeOfWork: selectedCity,
    });

    if (!srcEntry) {
      return res.status(400).json({
        message: "Selected city not found in your SRC list",
      });
    }

    // 2️⃣ Prevent duplicate for this user
    const existing = await CityMap.findOne({
      user: userId,
      city: selectedCity,
    });

    if (existing) {
      return res.status(400).json({
        message: "City already mapped",
      });
    }

    // 3️⃣ Reverse Geocode
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json`,
      {
        params: {
          key: process.env.OPENCAGE_API_KEY,
          q: `${lat},${lon}`,
        },
      }
    );

    const address =
      response.data.results[0]?.formatted || "Address not found";

    // 4️⃣ Create mapping for current user
    const newMapping = await CityMap.create({
      user: userId,
      city: selectedCity,
      location: { lat, lon },
      radiusKm: srcEntry.radius,
      stationType: srcEntry.station,
      address,
      date: new Date(),
      time: new Date().toLocaleTimeString(),
    });

    // ==================================================
    // 🔥 5️⃣ PROPAGATE TO SUPERIORS RECURSIVELY
    // ==================================================

    let currentUser = await User.findById(userId);

    while (currentUser.superior) {
      const superior = await User.findById(currentUser.superior);

      if (!superior) break;

      // Check if superior has this city in SRC
      const superiorSRC = await SRC.findOne({
        user: superior._id,
        placeOfWork: selectedCity,
      });

      if (superiorSRC) {
        // Check duplicate mapping for superior
        const superiorExisting = await CityMap.findOne({
          user: superior._id,
          city: selectedCity,
        });

        if (!superiorExisting) {
          await CityMap.create({
            user: superior._id,
            city: selectedCity,
            location: { lat, lon },
            radiusKm: superiorSRC.radius, // radius same as their SRC
            stationType: superiorSRC.station, // station from THEIR SRC
            address,
            date: new Date(),
            time: new Date().toLocaleTimeString(),
          });
        }
      }

      // Move up the chain
      currentUser = superior;
    }

    res.status(201).json({
      message: "Location recorded successfully",
      data: newMapping,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ===============================
// GET MAPPED CITIES
// ===============================
exports.getMappedCities = async (req, res) => {
  try {
    const user = req.user;
    let cities;

    if (user.role === "admin") {
      cities = await CityMap.find().populate("user", "username role");
    }

    else if (user.role === "manager") {
      const subordinates = await User.find({ superior: user._id });
      const subordinateIds = subordinates.map(u => u._id);

      cities = await CityMap.find({
        user: { $in: subordinateIds },
      }).populate("user", "username role");
    }

    else if (user.role === "executive") {
      cities = await CityMap.find({
        user: user._id,
      });
    }

    res.json(cities);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ===============================
// DELETE MAPPING
// ===============================
exports.deleteMapping = async (req, res) => {
  try {
    const { id } = req.params;

    await CityMap.findByIdAndDelete(id);

    res.json({ message: "Mapping deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// ===============================
// RESOLVE USER CITY FROM COORDS
// ===============================
exports.resolveUserCityFromCoords = async (req, res) => {
  try {
    const { lat, lon } = req.body;
    const userId = req.user._id;

    if (!lat || !lon) {
      return res.status(400).json({
        message: "Latitude and longitude required",
      });
    }

    const mappedCities = await CityMap.find({ user: userId });

    if (!mappedCities.length) {
      return res.status(404).json({
        message: "No mapped cities found for this user",
      });
    }

    for (const city of mappedCities) {
      const dist = haversineDistance(
        lat,
        lon,
        city.location.lat,
        city.location.lon
      );

      if (dist <= city.radiusKm) {
        return res.json({
          matched: true,
          city: city.city,
          stationType: city.stationType,
          radiusKm: city.radiusKm,
          distanceFromCenter: dist.toFixed(2),
        });
      }
    }

    return res.json({
      matched: false,
      message: "Location outside mapped territories",
    });

  } catch (err) {
    console.error("Error resolving user city:", err);
    res.status(500).json({ message: "Server error" });
  }
};