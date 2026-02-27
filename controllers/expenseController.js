const NormalExpense = require("../models/NormalExpense");
const OtherExpense = require("../models/OtherExpense");
const User = require("../models/User");
const Approval = require("../models/Approval");

const MONTHS = [
  "JAN","FEB","MAR","APR","MAY","JUN",
  "JUL","AUG","SEP","OCT","NOV","DEC"
];

const getMonthFromDate = (dateObj) => {
  return MONTHS[dateObj.getMonth()];
};

const recalculateNormalExpTotal = async (userId, monthString) => {
  const monthIndex = MONTHS.indexOf(monthString);
  const year = new Date().getFullYear();

  // const startOfMonth = new Date(year, monthIndex, 1);
  // const endOfMonth = new Date(year, monthIndex + 1, 0);
  // endOfMonth.setHours(23, 59, 59, 999);

  const startOfMonth = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0));
const endOfMonth = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999));

  const result = await NormalExpense.aggregate([
    {
      $match: {
        user: userId,
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$total" },
      },
    },
  ]);

  const total = result[0]?.total || 0;

  await Approval.updateOne(
    { user: userId, month: monthString },
    { $set: { normalExpTotal: total } }
  );
};

const recalculateOtherExpTotal = async (userId, monthString) => {
  const monthIndex = MONTHS.indexOf(monthString);
  const year = new Date().getFullYear();

  // const startOfMonth = new Date(year, monthIndex, 1);
  // const endOfMonth = new Date(year, monthIndex + 1, 0);
  // endOfMonth.setHours(23, 59, 59, 999);
  const startOfMonth = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0));
const endOfMonth = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999));

  const result = await OtherExpense.aggregate([
    {
      $match: {
        user: userId,
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$total" },
      },
    },
  ]);

  const total = result[0]?.total || 0;

  await Approval.updateOne(
    { user: userId, month: monthString },
    { $set: { otherExpTotal: total } }
  );
};


const recalculateNWDays = async (userId, monthString) => {
  const monthIndex = MONTHS.indexOf(monthString);

  const now = new Date();
  const year = now.getFullYear(); // assuming same year system

  // const startOfMonth = new Date(year, monthIndex, 1);
  // const endOfMonth = new Date(year, monthIndex + 1, 0);
  // endOfMonth.setHours(23, 59, 59, 999);
  const startOfMonth = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0));
const endOfMonth = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999));


  const count = await NormalExpense.countDocuments({
    user: userId,
    workType: "NW",
    date: { $gte: startOfMonth, $lte: endOfMonth }
  });

  await Approval.updateOne(
    { user: userId, month: monthString },
    { $set: { NWdays: count } }
  );
};

const recalculateTRDays = async (userId, monthString) => {
  const monthIndex = MONTHS.indexOf(monthString);
  const year = new Date().getFullYear();

  const startOfMonth = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0));
  const endOfMonth = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999));

  const uniqueDates = await NormalExpense.aggregate([
    {
      $match: {
        user: userId,
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$date" },
        },
      },
    },
    {
      $count: "totalDays",
    },
  ]);

  const totalReportingDays = uniqueDates[0]?.totalDays || 0;

  await Approval.updateOne(
    { user: userId, month: monthString },
    { $set: { TR: totalReportingDays } }
  );
};

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

// exports.getExpenses = async (req, res) => {
//   try {
//     const { userId, startDate, endDate } = req.query;

//     let targetUser;

//     // Admin can fetch anyone's data
//     if (req.user.role === "admin") {
//       if (!userId) {
//         return res.status(400).json({
//           message: "userId query param is required for admin",
//         });
//       }
//       targetUser = userId;
//     } else {
//       // Normal user → only their own
//       targetUser = req.user._id;
//     }

//     let dateFilter = {};
//     if (startDate && endDate) {
//       dateFilter = {
//         date: {
//           $gte: new Date(startDate),
//           $lte: new Date(endDate),
//         },
//       };
//     }

//     const normalExpenses = await NormalExpense.find({
//       user: targetUser,
//       ...dateFilter,
//     }).sort({ date: -1, createdAt: -1 });

//     const otherExpenses = await OtherExpense.find({
//       user: targetUser,
//       ...dateFilter,
//     }).sort({ date: -1, createdAt: -1 });

//     res.status(200).json({
//       normalExpenses,
//       otherExpenses,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error while fetching expenses" });
//   }
// };

exports.getExpenses = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;

    let targetUser;

    // ADMIN → anyone
    if (req.user.role === "admin") {
      targetUser = userId;
    }

    // MANAGER → only subordinates OR self
    else if (req.user.role === "manager") {
      if (userId === req.user._id.toString()) {
        targetUser = req.user._id;
      } else {
        const subordinate = await User.findOne({
          _id: userId,
          superior: req.user._id,
        });

        if (!subordinate) {
          return res.status(403).json({
            message: "Not authorized to view this user's expenses",
          });
        }

        targetUser = userId;
      }
    }

    // EXECUTIVE → only self
    else {
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

    res.json({ normalExpenses, otherExpenses });

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
    // if (
    //   req.user.role !== "admin" &&
    //   expense.user.toString() !== req.user._id.toString()
    // ) {
    //   return res.status(403).json({ message: "Not authorized" });
    // }

    // ADMIN → allowed
if (req.user.role === "admin") {
  // allowed
}

// MANAGER → allowed only for subordinates
else if (req.user.role === "manager") {
  const subordinate = await User.findOne({
    _id: expense.user,
    superior: req.user._id,
  });

  if (!subordinate) {
    return res.status(403).json({ message: "Not authorized" });
  }
}

// EXECUTIVE → only own expense
else if (expense.user.toString() !== req.user._id.toString()) {
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

    const monthString = getMonthFromDate(expense.date);
await recalculateNormalExpTotal(expense.user, monthString);

if (expense.workType === "NW") {
  await recalculateNWDays(expense.user, monthString);
}

await recalculateTRDays(expense.user, monthString);   // ✅ ADD THIS

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

    // // 🔐 Only admin should update extra fields
    // if (req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Only admin can update this expense" });
    // }

    if (req.user.role === "admin") {
  // allowed
}
else if (req.user.role === "manager") {
  const subordinate = await User.findOne({
    _id: expense.user,
    superior: req.user._id,
  });

  if (!subordinate) {
    return res.status(403).json({ message: "Not authorized" });
  }
}
else {
  return res.status(403).json({ message: "Not authorized" });
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
    const monthString = getMonthFromDate(expense.date);
await recalculateOtherExpTotal(expense.user, monthString);
await recalculateTRDays(expense.user, monthString);   // ✅ ADD THIS

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

    // // Executive → only own expense
    // if (
    //   requester.role === "executive" &&
    //   expense.user.toString() !== requester._id.toString()
    // ) {
    //   return res.status(403).json({
    //     message: "Not authorized to delete this expense",
    //   });
    // }

    // ADMIN → allowed
if (requester.role === "admin") {
  // do nothing (allowed)
}

// MANAGER → only subordinates
else if (requester.role === "manager") {

  const subordinate = await User.findOne({
    _id: expense.user,
    superior: requester._id,
  });

  if (!subordinate) {
    return res.status(403).json({
      message: "Not authorized to delete this expense",
    });
  }
}

// EXECUTIVE → only own expense
else if (expense.user.toString() !== requester._id.toString()) {
  return res.status(403).json({
    message: "Not authorized to delete this expense",
  });
}

    await expense.deleteOne();
   const monthString = getMonthFromDate(expense.date);

await recalculateNormalExpTotal(expense.user, monthString);

if (expense.workType === "NW") {
  await recalculateNWDays(expense.user, monthString);
}

await recalculateTRDays(expense.user, monthString);   // ✅ ADD THIS

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

    // // Executive → only own expense
    // if (
    //   requester.role === "executive" &&
    //   expense.user.toString() !== requester._id.toString()
    // ) {
    //   return res.status(403).json({
    //     message: "Not authorized to delete this expense",
    //   });
    // }

    // ADMIN → allowed
if (requester.role === "admin") {
  // do nothing (allowed)
}

// MANAGER → only subordinates
else if (requester.role === "manager") {

  const subordinate = await User.findOne({
    _id: expense.user,
    superior: requester._id,
  });

  if (!subordinate) {
    return res.status(403).json({
      message: "Not authorized to delete this expense",
    });
  }
}

// EXECUTIVE → only own expense
else if (expense.user.toString() !== requester._id.toString()) {
  return res.status(403).json({
    message: "Not authorized to delete this expense",
  });
}

    await expense.deleteOne();

    const monthString = getMonthFromDate(expense.date);
await recalculateOtherExpTotal(expense.user, monthString);
await recalculateTRDays(expense.user, monthString);   // ✅ ADD THIS

    res.json({ message: "Other expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
