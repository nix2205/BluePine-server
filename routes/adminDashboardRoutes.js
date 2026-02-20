// const express = require("express");
// const router = express.Router();
// const { getAdminDashboard } = require("../controllers/adminDashboardController");
// const authMiddleware = require("../middleware/authMiddleware");

// router.get("/dashboard", authMiddleware, getAdminDashboard);

// module.exports = router;
// // 



const express = require("express");
const router = express.Router();

const {
  getAdminDashboard
} = require("../controllers/adminDashboardController");

const { protect } = require("../middleware/authMiddleware");

// ===========================
// ADMIN DASHBOARD ROUTES
// ===========================

// 🔐 Admin Dashboard Summary
router.get("/dashboard", protect, getAdminDashboard);

module.exports = router;
