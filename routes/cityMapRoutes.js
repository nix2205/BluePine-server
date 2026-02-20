const express = require("express");
const router = express.Router();

const {
  recordLocation,
  getMappedCities,
  deleteMapping,
  resolveUserCityFromCoords,
} = require("../controllers/cityMapController");

// ✅ Proper destructuring from middleware export
const { protect, adminOnly } = require("../middleware/authMiddleware");


// 🔹 1️⃣ Record a new mapped city (executive)
router.post(
  "/record",
  protect,
  recordLocation
);


// 🔹 2️⃣ Get mapped cities (role-based inside controller)
router.get(
  "/",
  protect,
  getMappedCities
);


// 🔹 3️⃣ Delete mapping (admin-only recommended)
router.delete(
  "/:id",
  protect,
  adminOnly, // remove this line if you don’t want restriction
  deleteMapping
);


// 🔹 4️⃣ Resolve city during expense entry
router.post(
  "/resolve-user-city",
  protect,
  resolveUserCityFromCoords
);

module.exports = router;
