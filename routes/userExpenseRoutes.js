const express = require("express");
const router = express.Router();

const {
  createNFWExpense,
  createNWExpense,
  recordFWLocation,
  previewFWExpense,
  createFWExpense,
  createOtherExpense,

} = require("../controllers/userExpenseController");

const { protect } = require("../middleware/authMiddleware");

// ===========================
// USER EXPENSE ROUTES
// ===========================

// 🔐 FW - Record Location
router.post("/fw/record-location", protect, recordFWLocation);

// 🔐 FW - Preview Expense
router.post("/fw/preview", protect, previewFWExpense);

// 🔐 FW - Create Expense
router.post("/fw/create", protect, createFWExpense);


// 🔐 NFW Expense
router.post("/nfw", protect, createNFWExpense);

// 🔐 NW Entry
router.post("/nw", protect, createNWExpense);
router.post("/other", protect, createOtherExpense);


module.exports = router;
