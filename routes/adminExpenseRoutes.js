
const express = require("express");
const router = express.Router();

const {
  getNormalExpensesByMonth,
  getOtherExpensesByMonth,
  updateNormalExpense,
  deleteNormalExpense,
  updateOtherExpense,
  deleteOtherExpense,
} = require("../controllers/adminExpenseController");

const { protect } = require("../middleware/authMiddleware");
const { managerOrAdmin } = require("../middleware/roleMiddleware");


/* ===========================
   GET EXPENSES BY MONTH
=========================== */

// Normal Expenses
router.get(
  "/normal/:username",
  protect,
  managerOrAdmin,
  getNormalExpensesByMonth
);

// Other Expenses
router.get(
  "/other/:username",
  protect,
  managerOrAdmin,
  getOtherExpensesByMonth
);


/* ===========================
   UPDATE EXPENSES
=========================== */

// Update Normal Expense
router.put(
  "/normal/:expenseId",
  protect,
  managerOrAdmin,
  updateNormalExpense
);

// Update Other Expense
router.put(
  "/other/:expenseId",
  protect,
  managerOrAdmin,
  updateOtherExpense
);


/* ===========================
   DELETE EXPENSES
=========================== */

// Delete Normal Expense
router.delete(
  "/normal/:expenseId",
  protect,
  managerOrAdmin,
  deleteNormalExpense
);

// Delete Other Expense
router.delete(
  "/other/:expenseId",
  protect,
  managerOrAdmin,
  deleteOtherExpense
);


module.exports = router;
