const NormalExpense = require("../models/NormalExpense");
const OtherExpense = require("../models/OtherExpense");
const User = require("../models/User");

exports.getMyExpenses = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const normalExpenses = await NormalExpense.find({
      user: req.user._id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).sort({ date: 1 });

    const otherExpenses = await OtherExpense.find({
      user: req.user._id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).sort({ date: 1 });

    res.json({
      normalExpenses,
      otherExpenses,
    });
  } catch (error) {
    console.error("Error fetching my expenses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/*
========================================
GET ALL EXPENSES (USER + ADMIN)
========================================
*/

exports.getExpenses = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;

    let targetUser;

    // Admin can fetch anyone's data
    if (req.user.role === "admin") {
      if (!userId) {
        return res.status(400).json({
          message: "userId query param is required for admin",
        });
      }
      targetUser = userId;
    } else {
      // Normal user → only their own
      targetUser = req.user._id;
    }

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    }

    const normalExpenses = await NormalExpense.find({
      user: targetUser,
      ...dateFilter,
    }).sort({ date: -1, createdAt: -1 });

    const otherExpenses = await OtherExpense.find({
      user: targetUser,
      ...dateFilter,
    }).sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      normalExpenses,
      otherExpenses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching expenses" });
  }
};

/*
========================================
UPDATE NORMAL EXPENSE
Editable:
- ExtraTA
- ExtraDA
- taDesc
- daDesc
Recalculate total:
total = TA + DA + ExtraTA + ExtraDA
========================================
*/

exports.updateNormalExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { ExtraTA, ExtraDA, taDesc, daDesc } = req.body;

    const expense = await NormalExpense.findById(id);

    if (!expense) {
      return res.status(404).json({ message: "Normal expense not found" });
    }

    // Permission check
    if (
      req.user.role !== "admin" &&
      expense.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update allowed fields only
    if (ExtraTA !== undefined)
      expense.ExtraTA = Number(ExtraTA);

    if (ExtraDA !== undefined)
      expense.ExtraDA = Number(ExtraDA);

    if (taDesc !== undefined)
      expense.taDesc = taDesc;

    if (daDesc !== undefined)
      expense.daDesc = daDesc;

    // 🔥 Recalculate total (never trust frontend)
    expense.total =
      Number(expense.TA || 0) +
      Number(expense.DA || 0) +
      Number(expense.ExtraTA || 0) +
      Number(expense.ExtraDA || 0);

    await expense.save();

    res.status(200).json({
      message: "Normal expense updated successfully",
      expense,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while updating normal expense" });
  }
};

/*
========================================
UPDATE OTHER EXPENSE
Editable:
- extraAmount (admin enters)
- extraDescription
Recalculate total:
total = amount + extraAmount
========================================
*/

exports.updateOtherExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { extraAmount, extraDescription } = req.body;

    const expense = await OtherExpense.findById(id);

    if (!expense) {
      return res.status(404).json({ message: "Other expense not found" });
    }

    // 🔐 Only admin should update extra fields
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can update this expense" });
    }

    if (extraAmount !== undefined)
      expense.extraAmount = Number(extraAmount);

    if (extraDescription !== undefined)
      expense.extraDescription = extraDescription;

    // 🔥 Recalculate total
    expense.total =
      Number(expense.amount || 0) +
      Number(expense.extraAmount || 0);

    await expense.save();

    res.status(200).json({
      message: "Other expense updated successfully",
      expense,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while updating other expense" });
  }
};


exports.deleteNormalExpense = async (req, res) => {
  try {
    const requester = req.user;
    const { id } = req.params;

    const expense = await NormalExpense.findById(id);

    if (!expense) {
      return res.status(404).json({ message: "Normal expense not found" });
    }

    // Executive → only own expense
    if (
      requester.role === "executive" &&
      expense.user.toString() !== requester._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized to delete this expense",
      });
    }

    await expense.deleteOne();

    res.json({ message: "Normal expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteOtherExpense = async (req, res) => {
  try {
    const requester = req.user;
    const { id } = req.params;

    const expense = await OtherExpense.findById(id);

    if (!expense) {
      return res.status(404).json({ message: "Other expense not found" });
    }

    // Executive → only own expense
    if (
      requester.role === "executive" &&
      expense.user.toString() !== requester._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized to delete this expense",
      });
    }

    await expense.deleteOne();

    res.json({ message: "Other expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
