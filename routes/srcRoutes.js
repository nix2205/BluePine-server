// const express = require("express");
// const router = express.Router();

// const {
//   getUserSRCs,
//   createSRC,
//   updateSRC,
//   deleteSRC,
//   getMySRCs,
//   updateDAperStation,
//     updateRsPerKm, // 👈 add this
//     getUserHQ,

// } = require("../controllers/srcController");

// const { protect } = require("../middleware/authMiddleware");
// const { managerOrAdmin } = require("../middleware/roleMiddleware");

// // 🔥 Executive routes
// router.get("/my", protect, getMySRCs);
// router.get("/hq/me", protect, async (req, res) => {
//   try {
//     const hq = await SRC.findOne({
//       user: req.user._id,
//       station: "HQ",
//     });

//     if (!hq) {
//       return res.json({ placeOfWork: "-" });
//     }

//     res.json({ placeOfWork: hq.placeOfWork });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // 🔥 Admin / Manager routes
// router.get("/user/:userId", protect, managerOrAdmin, getUserSRCs);
// router.get("/hq/:userId", protect, managerOrAdmin, getUserHQ);
// router.post("/", protect, managerOrAdmin, createSRC);
// router.put("/:id", protect, managerOrAdmin, updateSRC);
// router.delete("/:id", protect, managerOrAdmin, deleteSRC);

// module.exports = router;






const express = require("express");
const router = express.Router();
const SRC = require("../models/SRC"); // ✅ ADD THIS

const {
  getUserSRCs,
  createSRC,
  updateSRC,
  deleteSRC,
  getMySRCs,
  updateDAperStation,
  updateRsPerKm,
  getUserHQ,
  applyConfigToSRCs
} = require("../controllers/srcController");

const { protect } = require("../middleware/authMiddleware");
const { managerOrAdmin } = require("../middleware/roleMiddleware");

// 🔥 Executive routes
router.get("/my", protect, getMySRCs);

router.get("/hq/me", protect, async (req, res) => {
  try {
    const hq = await SRC.findOne({
      user: req.user._id,
      station: "HQ",
    });

    if (!hq) {
      return res.json({ placeOfWork: "-" });
    }

    res.json({ placeOfWork: hq.placeOfWork });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔥 Admin / Manager routes
router.get("/user/:userId", protect, managerOrAdmin, getUserSRCs);
router.get("/hq/:userId", protect, managerOrAdmin, getUserHQ);
router.post("/", protect, managerOrAdmin, createSRC);
router.put("/:id", protect, managerOrAdmin, updateSRC);
router.delete("/:id", protect, managerOrAdmin, deleteSRC);
router.put("/apply/:userid", protect, managerOrAdmin, applyConfigToSRCs);


module.exports = router;

