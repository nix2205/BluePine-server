const express = require("express");
const router = express.Router();

const {
  getSRCConfig,
  updateRsPerKm,
  updateDAperStation,
  applyConfigToSRCs,
  getMySRCConfig,
} = require("../controllers/srcConfigController");

const { protect } = require("../middleware/authMiddleware");
const { managerOrAdmin } = require("../middleware/roleMiddleware");

router.get("/my", protect, getMySRCConfig);

router.get("/:userId", protect, managerOrAdmin, getSRCConfig);

router.patch(
  "/rsperkM/:userId",
  protect,
  managerOrAdmin,
  updateRsPerKm
);

router.patch(
  "/da/:userId/:station",
  protect,
  managerOrAdmin,
  updateDAperStation
);

router.put("/apply/:userId", applyConfigToSRCs);




module.exports = router;
