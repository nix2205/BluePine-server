const express = require("express");
const router = express.Router();
const {
  getMyExpenses,
  getExpenses,
  updateNormalExpense,
  updateOtherExpense,
  deleteNormalExpense,
  deleteOtherExpense,
  addOtherExpenseBySuperior
} = require("../controllers/expenseController");

const { protect } = require("../middleware/authMiddleware");



router.get("/", protect, getExpenses);
router.get("/my", protect, getMyExpenses);
router.put("/normal/:id", protect, updateNormalExpense);
router.put("/other/:id", protect, updateOtherExpense);
router.delete("/normal/:id", protect, deleteNormalExpense);
router.delete("/other/:id", protect, deleteOtherExpense);
router.post(
  "/add-other-expense-superior",
  protect,addOtherExpenseBySuperior
);


module.exports = router;
