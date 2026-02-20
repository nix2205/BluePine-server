const NormalExpense = require("../models/NormalExpense");
const User = require("../models/User");
const Approval = require("../models/Approval"); // ✅ ADDED


exports.getNormalExpensesByMonth = async (req, res) => {
  try {
    const { username } = req.params;
    const { month, year } = req.query;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const expenses = await NormalExpense.find({
      user: user._id,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch normal expenses" });
  }
};

const OtherExpense = require("../models/OtherExpense");

exports.getOtherExpensesByMonth = async (req, res) => {
  try {
    const { username } = req.params;
    const { month, year } = req.query;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const expenses = await OtherExpense.find({
      user: user._id,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch other expenses" });
  }
};

exports.updateNormalExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const update = {};

    if (req.body.extraTA !== undefined) update.ExtraTA = req.body.extraTA;
    if (req.body.extraDA !== undefined) update.ExtraDA = req.body.extraDA;
    if (req.body.taDesc !== undefined) update.taDesc = req.body.taDesc;
    if (req.body.daDesc !== undefined) update.daDesc = req.body.daDesc;
    if (req.body.total !== undefined) update.total = req.body.total;

    const expense = await NormalExpense.findByIdAndUpdate(
      expenseId,
      update,
      { new: true }
    );

    if (!expense)
      return res.status(404).json({ message: "Expense not found" });

    res.json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update expense" });
  }
};

exports.deleteNormalExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;

    const deleted = await NormalExpense.findByIdAndDelete(expenseId);
    if (!deleted)
      return res.status(404).json({ message: "Expense not found" });

    res.json({ message: "Normal expense deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete expense" });
  }
};

exports.updateOtherExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const update = {};

    if (req.body.extraAmount !== undefined)
      update.extraAmount = req.body.extraAmount;

    if (req.body.extraDescription !== undefined)
      update.extraDescription = req.body.extraDescription;

    if (req.body.total !== undefined)
      update.total = req.body.total;

    const expense = await OtherExpense.findByIdAndUpdate(
      expenseId,
      update,
      { new: true }
    );

    if (!expense)
      return res.status(404).json({ message: "Expense not found" });

    res.json({ expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update other expense" });
  }
};

exports.deleteOtherExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;

    const deleted = await OtherExpense.findByIdAndDelete(expenseId);
    if (!deleted)
      return res.status(404).json({ message: "Expense not found" });

    res.json({ message: "Other expense deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete expense" });
  }
};








