const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");
const { managerOrAdmin } = require("../middleware/roleMiddleware");

const {
  getMyApprovals,
  getUserApprovals,
  triggerMonthlyCheck,
  submitMyApproval,
    approveBySuperior


} = require("../controllers/approvalController");

// Submit approval for a month
router.post("/submit", protect, submitMyApproval);
// Superior approval (Admin / Manager)
router.post(
  "/approve-superior",
  protect,
  managerOrAdmin,
  approveBySuperior
);


// Get logged-in user's approvals (last 3 months)
router.get("/me", protect, getMyApprovals);


/*
==================================
   ADMIN / MANAGER ROUTES
==================================
*/

// Get approvals of specific user
router.get("/:userId", protect, managerOrAdmin, getUserApprovals);


/*
==================================
   SYSTEM ROUTE (OPTIONAL)
==================================
*/

// Manually trigger monthly approval check
// (Useful for testing)
router.post("/trigger-month-check", protect, adminOnly, triggerMonthlyCheck);

module.exports = router;
