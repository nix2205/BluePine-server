// const NormalExpense = require("../models/NormalExpense");
// const OtherExpense = require("../models/OtherExpense");
// const User = require("../models/User");
// const Approval = require("../models/Approval");

// const MONTHS = [
//   "JAN","FEB","MAR","APR","MAY","JUN",
//   "JUL","AUG","SEP","OCT","NOV","DEC"
// ];

// const getMonthFromDate = (dateObj) => {
//   return MONTHS[dateObj.getMonth()];
// };

// const recalculateNormalExpTotal = async (userId, monthString) => {
//   const monthIndex = MONTHS.indexOf(monthString);
//   const year = new Date().getFullYear();

//   // const startOfMonth = new Date(year, monthIndex, 1);
//   // const endOfMonth = new Date(year, monthIndex + 1, 0);
//   // endOfMonth.setHours(23, 59, 59, 999);

//   const startOfMonth = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0));
// const endOfMonth = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999));

//   const result = await NormalExpense.aggregate([
//     {
//       $match: {
//         user: userId,
//         date: { $gte: startOfMonth, $lte: endOfMonth },
//       },
//     },
//     {
//       $group: {
//         _id: null,
//         total: { $sum: "$total" },
//       },
//     },
//   ]);

//   const total = result[0]?.total || 0;

//   await Approval.updateOne(
//     { user: userId, month: monthString },
//     { $set: { normalExpTotal: total } }
//   );
// };

// const recalculateOtherExpTotal = async (userId, monthString) => {
//   const monthIndex = MONTHS.indexOf(monthString);
//   const year = new Date().getFullYear();

//   // const startOfMonth = new Date(year, monthIndex, 1);
//   // const endOfMonth = new Date(year, monthIndex + 1, 0);
//   // endOfMonth.setHours(23, 59, 59, 999);
//   const startOfMonth = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0));
// const endOfMonth = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999));

//   const result = await OtherExpense.aggregate([
//     {
//       $match: {
//         user: userId,
//         date: { $gte: startOfMonth, $lte: endOfMonth },
//       },
//     },
//     {
//       $group: {
//         _id: null,
//         total: { $sum: "$total" },
//       },
//     },
//   ]);

//   const total = result[0]?.total || 0;

//   await Approval.updateOne(
//     { user: userId, month: monthString },
//     { $set: { otherExpTotal: total } }
//   );
// };


// const recalculateNWDays = async (userId, monthString) => {
//   const monthIndex = MONTHS.indexOf(monthString);

//   const now = new Date();
//   const year = now.getFullYear(); // assuming same year system

//   // const startOfMonth = new Date(year, monthIndex, 1);
//   // const endOfMonth = new Date(year, monthIndex + 1, 0);
//   // endOfMonth.setHours(23, 59, 59, 999);
//   const startOfMonth = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0));
// const endOfMonth = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999));


//   const count = await NormalExpense.countDocuments({
//     user: userId,
//     workType: "NW",
//     date: { $gte: startOfMonth, $lte: endOfMonth }
//   });

//   await Approval.updateOne(
//     { user: userId, month: monthString },
//     { $set: { NWdays: count } }
//   );
// };

// const recalculateTRDays = async (userId, monthString) => {
//   const monthIndex = MONTHS.indexOf(monthString);
//   const year = new Date().getFullYear();

//   const startOfMonth = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0));
//   const endOfMonth = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999));

//   const uniqueDates = await NormalExpense.aggregate([
//     {
//       $match: {
//         user: userId,
//         date: { $gte: startOfMonth, $lte: endOfMonth },
//       },
//     },
//     {
//       $group: {
//         _id: {
//           $dateToString: { format: "%Y-%m-%d", date: "$date" },
//         },
//       },
//     },
//     {
//       $count: "totalDays",
//     },
//   ]);

//   const totalReportingDays = uniqueDates[0]?.totalDays || 0;

//   await Approval.updateOne(
//     { user: userId, month: monthString },
//     { $set: { TR: totalReportingDays } }
//   );
// };

// exports.getMyExpenses = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;

//     const normalExpenses = await NormalExpense.find({
//       user: req.user._id,
//       date: {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate),
//       },
//     }).sort({ date: 1 });

//     const otherExpenses = await OtherExpense.find({
//       user: req.user._id,
//       date: {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate),
//       },
//     }).sort({ date: 1 });

//     res.json({
//       normalExpenses,
//       otherExpenses,
//     });
//   } catch (error) {
//     console.error("Error fetching my expenses:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /*
// ========================================
// GET ALL EXPENSES (USER + ADMIN)
// ========================================
// */

// // exports.getExpenses = async (req, res) => {
// //   try {
// //     const { userId, startDate, endDate } = req.query;

// //     let targetUser;

// //     // Admin can fetch anyone's data
// //     if (req.user.role === "admin") {
// //       if (!userId) {
// //         return res.status(400).json({
// //           message: "userId query param is required for admin",
// //         });
// //       }
// //       targetUser = userId;
// //     } else {
// //       // Normal user → only their own
// //       targetUser = req.user._id;
// //     }

// //     let dateFilter = {};
// //     if (startDate && endDate) {
// //       dateFilter = {
// //         date: {
// //           $gte: new Date(startDate),
// //           $lte: new Date(endDate),
// //         },
// //       };
// //     }

// //     const normalExpenses = await NormalExpense.find({
// //       user: targetUser,
// //       ...dateFilter,
// //     }).sort({ date: -1, createdAt: -1 });

// //     const otherExpenses = await OtherExpense.find({
// //       user: targetUser,
// //       ...dateFilter,
// //     }).sort({ date: -1, createdAt: -1 });

// //     res.status(200).json({
// //       normalExpenses,
// //       otherExpenses,
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Server error while fetching expenses" });
// //   }
// // };

// exports.getExpenses = async (req, res) => {
//   try {
//     const { userId, startDate, endDate } = req.query;

//     let targetUser;

//     // ADMIN → anyone
//     if (req.user.role === "admin") {
//       targetUser = userId;
//     }

//     // MANAGER → only subordinates OR self
//     else if (req.user.role === "manager") {
//       if (userId === req.user._id.toString()) {
//         targetUser = req.user._id;
//       } else {
//         const subordinate = await User.findOne({
//           _id: userId,
//           superior: req.user._id,
//         });

//         if (!subordinate) {
//           return res.status(403).json({
//             message: "Not authorized to view this user's expenses",
//           });
//         }

//         targetUser = userId;
//       }
//     }

//     // EXECUTIVE → only self
//     else {
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

//     res.json({ normalExpenses, otherExpenses });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error while fetching expenses" });
//   }
// };


// /*
// ========================================
// UPDATE NORMAL EXPENSE
// Editable:
// - ExtraTA
// - ExtraDA
// - taDesc
// - daDesc
// Recalculate total:
// total = TA + DA + ExtraTA + ExtraDA
// ========================================
// */

// exports.updateNormalExpense = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { ExtraTA, ExtraDA, taDesc, daDesc } = req.body;

//     const expense = await NormalExpense.findById(id);

//     if (!expense) {
//       return res.status(404).json({ message: "Normal expense not found" });
//     }

//     // Permission check
//     // if (
//     //   req.user.role !== "admin" &&
//     //   expense.user.toString() !== req.user._id.toString()
//     // ) {
//     //   return res.status(403).json({ message: "Not authorized" });
//     // }

//     // ADMIN → allowed
// if (req.user.role === "admin") {
//   // allowed
// }

// // MANAGER → allowed only for subordinates
// else if (req.user.role === "manager") {
//   const subordinate = await User.findOne({
//     _id: expense.user,
//     superior: req.user._id,
//   });

//   if (!subordinate) {
//     return res.status(403).json({ message: "Not authorized" });
//   }
// }

// // EXECUTIVE → only own expense
// else if (expense.user.toString() !== req.user._id.toString()) {
//   return res.status(403).json({ message: "Not authorized" });
// }

//     // Update allowed fields only
//     if (ExtraTA !== undefined)
//       expense.ExtraTA = Number(ExtraTA);

//     if (ExtraDA !== undefined)
//       expense.ExtraDA = Number(ExtraDA);

//     if (taDesc !== undefined)
//       expense.taDesc = taDesc;

//     if (daDesc !== undefined)
//       expense.daDesc = daDesc;

//     // 🔥 Recalculate total (never trust frontend)
//     expense.total =
//       Number(expense.TA || 0) +
//       Number(expense.DA || 0) +
//       Number(expense.ExtraTA || 0) +
//       Number(expense.ExtraDA || 0);

//     await expense.save();

//     const monthString = getMonthFromDate(expense.date);
// await recalculateNormalExpTotal(expense.user, monthString);

// if (expense.workType === "NW") {
//   await recalculateNWDays(expense.user, monthString);
// }

// await recalculateTRDays(expense.user, monthString);   // ✅ ADD THIS

//     res.status(200).json({
//       message: "Normal expense updated successfully",
//       expense,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error while updating normal expense" });
//   }
// };

// /*
// ========================================
// UPDATE OTHER EXPENSE
// Editable:
// - extraAmount (admin enters)
// - extraDescription
// Recalculate total:
// total = amount + extraAmount
// ========================================
// */

// exports.updateOtherExpense = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { extraAmount, extraDescription } = req.body;

//     const expense = await OtherExpense.findById(id);

//     if (!expense) {
//       return res.status(404).json({ message: "Other expense not found" });
//     }

//     // // 🔐 Only admin should update extra fields
//     // if (req.user.role !== "admin") {
//     //   return res.status(403).json({ message: "Only admin can update this expense" });
//     // }

//     if (req.user.role === "admin") {
//   // allowed
// }
// else if (req.user.role === "manager") {
//   const subordinate = await User.findOne({
//     _id: expense.user,
//     superior: req.user._id,
//   });

//   if (!subordinate) {
//     return res.status(403).json({ message: "Not authorized" });
//   }
// }
// else {
//   return res.status(403).json({ message: "Not authorized" });
// }

//     if (extraAmount !== undefined)
//       expense.extraAmount = Number(extraAmount);

//     if (extraDescription !== undefined)
//       expense.extraDescription = extraDescription;

//     // 🔥 Recalculate total
//     expense.total =
//       Number(expense.amount || 0) +
//       Number(expense.extraAmount || 0);

//     await expense.save();
//     const monthString = getMonthFromDate(expense.date);
// await recalculateOtherExpTotal(expense.user, monthString);
// await recalculateTRDays(expense.user, monthString);   // ✅ ADD THIS

//     res.status(200).json({
//       message: "Other expense updated successfully",
//       expense,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error while updating other expense" });
//   }
// };


// exports.deleteNormalExpense = async (req, res) => {
//   try {
//     const requester = req.user;
//     const { id } = req.params;

//     const expense = await NormalExpense.findById(id);

//     if (!expense) {
//       return res.status(404).json({ message: "Normal expense not found" });
//     }

//     // // Executive → only own expense
//     // if (
//     //   requester.role === "executive" &&
//     //   expense.user.toString() !== requester._id.toString()
//     // ) {
//     //   return res.status(403).json({
//     //     message: "Not authorized to delete this expense",
//     //   });
//     // }

//     // ADMIN → allowed
// if (requester.role === "admin") {
//   // do nothing (allowed)
// }

// // MANAGER → only subordinates
// else if (requester.role === "manager") {

//   const subordinate = await User.findOne({
//     _id: expense.user,
//     superior: requester._id,
//   });

//   if (!subordinate) {
//     return res.status(403).json({
//       message: "Not authorized to delete this expense",
//     });
//   }
// }

// // EXECUTIVE → only own expense
// else if (expense.user.toString() !== requester._id.toString()) {
//   return res.status(403).json({
//     message: "Not authorized to delete this expense",
//   });
// }

//     await expense.deleteOne();
//    const monthString = getMonthFromDate(expense.date);

// await recalculateNormalExpTotal(expense.user, monthString);

// if (expense.workType === "NW") {
//   await recalculateNWDays(expense.user, monthString);
// }

// await recalculateTRDays(expense.user, monthString);   // ✅ ADD THIS

//     res.json({ message: "Normal expense deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// exports.deleteOtherExpense = async (req, res) => {
//   try {
//     const requester = req.user;
//     const { id } = req.params;

//     const expense = await OtherExpense.findById(id);

//     if (!expense) {
//       return res.status(404).json({ message: "Other expense not found" });
//     }

//     // // Executive → only own expense
//     // if (
//     //   requester.role === "executive" &&
//     //   expense.user.toString() !== requester._id.toString()
//     // ) {
//     //   return res.status(403).json({
//     //     message: "Not authorized to delete this expense",
//     //   });
//     // }

//     // ADMIN → allowed
// if (requester.role === "admin") {
//   // do nothing (allowed)
// }

// // MANAGER → only subordinates
// else if (requester.role === "manager") {

//   const subordinate = await User.findOne({
//     _id: expense.user,
//     superior: requester._id,
//   });

//   if (!subordinate) {
//     return res.status(403).json({
//       message: "Not authorized to delete this expense",
//     });
//   }
// }

// // EXECUTIVE → only own expense
// else if (expense.user.toString() !== requester._id.toString()) {
//   return res.status(403).json({
//     message: "Not authorized to delete this expense",
//   });
// }

//     await expense.deleteOne();

//     const monthString = getMonthFromDate(expense.date);
// await recalculateOtherExpTotal(expense.user, monthString);
// await recalculateTRDays(expense.user, monthString);   // ✅ ADD THIS

//     res.json({ message: "Other expense deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



// /*
// ========================================
// ADD OTHER EXPENSE (ADMIN / MANAGER)
// Can add even after approval
// Nothing mandatory
// Date auto defaults to today
// ========================================
// */

// exports.addOtherExpenseBySuperior = async (req, res) => {
//   try {
//     const requester = req.user;
//     const {
//       userId,
//       date,
//       amount,
//       extraAmount,
//       description,
//       billNo,
//       extraDescription,
//       category,
//     } = req.body;

//     // 🔐 ROLE CHECK
//     if (requester.role !== "admin" && requester.role !== "manager") {
//       return res.status(403).json({
//         message: "Not authorized to add other expense",
//       });
//     }

//     // MANAGER → only subordinates
//     if (requester.role === "manager") {
//       const subordinate = await User.findOne({
//         _id: userId,
//         superior: requester._id,
//       });

//       if (!subordinate) {
//         return res.status(403).json({
//           message: "Not authorized to add expense for this user",
//         });
//       }
//     }

//     // 📅 AUTO DATE (if not provided)
//     const expenseDate = date ? new Date(date) : new Date();

//     // 🧠 Create dynamically (nothing mandatory)
//     const newExpense = new OtherExpense({
//       user: userId,
//       date: expenseDate,
//     });

//     if (amount !== undefined)
//       newExpense.amount = Number(amount);

//     if (extraAmount !== undefined)
//       newExpense.extraAmount = Number(extraAmount);

//     if (description !== undefined)
//       newExpense.description = description;
    
//     if (billNo !== undefined)
//       newExpense.billNo = billNo;

//     if (extraDescription !== undefined)
//       newExpense.extraDescription = extraDescription;

//     if (category !== undefined)
//       newExpense.category = category;

//     // 🔥 Calculate total safely
//     newExpense.total =
//       Number(newExpense.amount || 0) +
//       Number(newExpense.extraAmount || 0);

//     await newExpense.save();

//     // 📊 RECALCULATE MONTHLY TOTALS
//     const monthString = getMonthFromDate(expenseDate);

//     await recalculateOtherExpTotal(userId, monthString);
//     await recalculateTRDays(userId, monthString);

//     res.status(201).json({
//       message: "Other expense added successfully",
//       expense: newExpense,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Server error while adding other expense",
//     });
//   }
// };















const NormalExpense = require("../models/NormalExpense");
const OtherExpense = require("../models/OtherExpense");
const User = require("../models/User");
const Approval = require("../models/Approval");

const MONTHS = [
  "JAN","FEB","MAR","APR","MAY","JUN",
  "JUL","AUG","SEP","OCT","NOV","DEC"
];

/* ===========================
   DATE HELPERS (STRING BASED)
   =========================== */

const parseDateString = (dateStr) => {
  const [day, month, year] = dateStr.split("-");
  return new Date(year, month - 1, day);
};

const getMonthFromStringDate = (dateStr) => {
  const [, month] = dateStr.split("-");
  return MONTHS[Number(month) - 1];
};

const getYearFromStringDate = (dateStr) => {
  const [, , year] = dateStr.split("-");
  return Number(year);
};

const getMonthYearRegex = (monthString, year) => {
  const monthNumber = String(
    MONTHS.indexOf(monthString) + 1
  ).padStart(2, "0");

  return new RegExp(`-${monthNumber}-${year}$`);
};

/* ===========================
   RECALCULATIONS
   =========================== */

const recalculateNormalExpTotal = async (userId, monthString, year) => {
  const regex = getMonthYearRegex(monthString, year);

  const expenses = await NormalExpense.find({
    user: userId,
    date: { $regex: regex }
  });

  const total = expenses.reduce((sum, e) => sum + e.total, 0);

  await Approval.updateOne(
    { user: userId, month: monthString },
    { $set: { normalExpTotal: total } }
  );
};

const recalculateOtherExpTotal = async (userId, monthString, year) => {
  const regex = getMonthYearRegex(monthString, year);

  const expenses = await OtherExpense.find({
    user: userId,
    date: { $regex: regex }
  });

  const total = expenses.reduce((sum, e) => sum + e.total, 0);

  await Approval.updateOne(
    { user: userId, month: monthString },
    { $set: { otherExpTotal: total } }
  );
};

const recalculateNWDays = async (userId, monthString, year) => {
  const regex = getMonthYearRegex(monthString, year);

  const count = await NormalExpense.countDocuments({
    user: userId,
    workType: "NW",
    date: { $regex: regex }
  });

  await Approval.updateOne(
    { user: userId, month: monthString },
    { $set: { NWdays: count } }
  );
};

const recalculateTRDays = async (userId, monthString, year) => {
  const regex = getMonthYearRegex(monthString, year);

  const expenses = await NormalExpense.find({
    user: userId,
    date: { $regex: regex }
  });

  const uniqueDates = new Set(expenses.map(e => e.date));

  await Approval.updateOne(
    { user: userId, month: monthString },
    { $set: { TR: uniqueDates.size } }
  );
};

/* ===========================
   GET MY EXPENSES
   =========================== */

exports.getMyExpenses = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const allNormal = await NormalExpense.find({
      user: req.user._id,
    });

    const allOther = await OtherExpense.find({
      user: req.user._id,
    });

    let normalExpenses = allNormal;
    let otherExpenses = allOther;

    if (startDate && endDate) {
      const startObj = parseDateString(startDate);
      const endObj = parseDateString(endDate);

      normalExpenses = allNormal.filter(e => {
        const d = parseDateString(e.date);
        return d >= startObj && d <= endObj;
      });

      otherExpenses = allOther.filter(e => {
        const d = parseDateString(e.date);
        return d >= startObj && d <= endObj;
      });
    }

    // Proper chronological sort
    normalExpenses.sort((a, b) =>
      parseDateString(a.date) - parseDateString(b.date)
    );

    otherExpenses.sort((a, b) =>
      parseDateString(a.date) - parseDateString(b.date)
    );

    res.json({ normalExpenses, otherExpenses });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===========================
   GET EXPENSES (ADMIN/MANAGER)
   =========================== */

// exports.getExpenses = async (req, res) => {
//   try {
//     const { userId, startDate, endDate } = req.query;

//     let targetUser;

//     if (req.user.role === "admin") {
//       targetUser = userId;
//     }
//     else if (req.user.role === "manager") {
//       if (userId === req.user._id.toString()) {
//         targetUser = req.user._id;
//       } else {
//         const subordinate = await User.findOne({
//           _id: userId,
//           superior: req.user._id,
//         });

//         if (!subordinate) {
//           return res.status(403).json({
//             message: "Not authorized",
//           });
//         }

//         targetUser = userId;
//       }
//     }
//     else {
//       targetUser = req.user._id;
//     }

//     const allNormal = await NormalExpense.find({ user: targetUser });
//     const allOther = await OtherExpense.find({ user: targetUser });

//     let normalExpenses = allNormal;
//     let otherExpenses = allOther;

//     if (startDate && endDate) {
//       const startObj = parseDateString(startDate);
//       const endObj = parseDateString(endDate);

//       normalExpenses = allNormal.filter(e => {
//         const d = parseDateString(e.date);
//         return d >= startObj && d <= endObj;
//       });

//       otherExpenses = allOther.filter(e => {
//         const d = parseDateString(e.date);
//         return d >= startObj && d <= endObj;
//       });
//     }

//     normalExpenses.sort((a, b) =>
//       parseDateString(b.date) - parseDateString(a.date)
//     );

//     otherExpenses.sort((a, b) =>
//       parseDateString(b.date) - parseDateString(a.date)
//     );

//     res.json({ normalExpenses, otherExpenses });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

exports.getExpenses = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;

    const targetUser = userId || req.user._id;

    const allNormal = await NormalExpense.find({ user: targetUser });
    const allOther = await OtherExpense.find({ user: targetUser });

    let normalExpenses = allNormal;
    let otherExpenses = allOther;

    if (startDate && endDate) {
      const startObj = parseDateString(startDate);
      const endObj = parseDateString(endDate);

      normalExpenses = allNormal.filter(e => {
        const d = parseDateString(e.date);
        return d >= startObj && d <= endObj;
      });

      otherExpenses = allOther.filter(e => {
        const d = parseDateString(e.date);
        return d >= startObj && d <= endObj;
      });
    }

    normalExpenses.sort((a, b) =>
      parseDateString(b.date) - parseDateString(a.date)
    );

    otherExpenses.sort((a, b) =>
      parseDateString(b.date) - parseDateString(a.date)
    );

    res.json({ normalExpenses, otherExpenses });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


/* ===========================
   UPDATE NORMAL EXPENSE
   =========================== */

// exports.updateNormalExpense = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { ExtraTA, ExtraDA, taDesc, daDesc } = req.body;

//     const expense = await NormalExpense.findById(id);
//     if (!expense)
//       return res.status(404).json({ message: "Not found" });

//     // Permission checks (same logic as yours)
//     if (req.user.role === "manager") {
//       const subordinate = await User.findOne({
//         _id: expense.user,
//         superior: req.user._id,
//       });
//       if (!subordinate)
//         return res.status(403).json({ message: "Not authorized" });
//     }
//     else if (
//       req.user.role !== "admin" &&
//       expense.user.toString() !== req.user._id.toString()
//     ) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     if (ExtraTA !== undefined) expense.ExtraTA = Number(ExtraTA);
//     if (ExtraDA !== undefined) expense.ExtraDA = Number(ExtraDA);
//     if (taDesc !== undefined) expense.taDesc = taDesc;
//     if (daDesc !== undefined) expense.daDesc = daDesc;

//     expense.total =
//       Number(expense.TA || 0) +
//       Number(expense.DA || 0) +
//       Number(expense.ExtraTA || 0) +
//       Number(expense.ExtraDA || 0);

//     await expense.save();

//     const monthString = getMonthFromStringDate(expense.date);
//     const year = getYearFromStringDate(expense.date);

//     await recalculateNormalExpTotal(expense.user, monthString, year);

//     if (expense.workType === "NW")
//       await recalculateNWDays(expense.user, monthString, year);

//     await recalculateTRDays(expense.user, monthString, year);

//     res.json({ message: "Updated", expense });

//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

exports.updateNormalExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { ExtraTA, ExtraDA, taDesc, daDesc } = req.body;

    const expense = await NormalExpense.findById(id);
    if (!expense)
      return res.status(404).json({ message: "Not found" });

    if (ExtraTA !== undefined) expense.ExtraTA = Number(ExtraTA);
    if (ExtraDA !== undefined) expense.ExtraDA = Number(ExtraDA);
    if (taDesc !== undefined) expense.taDesc = taDesc;
    if (daDesc !== undefined) expense.daDesc = daDesc;

    expense.total =
      Number(expense.TA || 0) +
      Number(expense.DA || 0) +
      Number(expense.ExtraTA || 0) +
      Number(expense.ExtraDA || 0);

    await expense.save();

    const monthString = getMonthFromStringDate(expense.date);
    const year = getYearFromStringDate(expense.date);

    await recalculateNormalExpTotal(expense.user, monthString, year);

    if (expense.workType === "NW")
      await recalculateNWDays(expense.user, monthString, year);

    await recalculateTRDays(expense.user, monthString, year);

    res.json({ message: "Updated", expense });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


/* ===========================
   UPDATE OTHER EXPENSE
   =========================== */

// exports.updateOtherExpense = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { extraAmount, extraDescription } = req.body;

//     const expense = await OtherExpense.findById(id);
//     if (!expense)
//       return res.status(404).json({ message: "Not found" });

//     if (req.user.role === "manager") {
//       const subordinate = await User.findOne({
//         _id: expense.user,
//         superior: req.user._id,
//       });
//       if (!subordinate)
//         return res.status(403).json({ message: "Not authorized" });
//     }
//     else if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     if (extraAmount !== undefined)
//       expense.extraAmount = Number(extraAmount);

//     if (extraDescription !== undefined)
//       expense.extraDescription = extraDescription;

//     expense.total =
//       Number(expense.amount || 0) +
//       Number(expense.extraAmount || 0);

//     await expense.save();

//     const monthString = getMonthFromStringDate(expense.date);
//     const year = getYearFromStringDate(expense.date);

//     await recalculateOtherExpTotal(expense.user, monthString, year);
//     await recalculateTRDays(expense.user, monthString, year);

//     res.json({ message: "Updated", expense });

//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };


exports.updateOtherExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { extraAmount, extraDescription } = req.body;

    const expense = await OtherExpense.findById(id);
    if (!expense)
      return res.status(404).json({ message: "Not found" });

    if (extraAmount !== undefined)
      expense.extraAmount = Number(extraAmount);

    if (extraDescription !== undefined)
      expense.extraDescription = extraDescription;

    expense.total =
      Number(expense.amount || 0) +
      Number(expense.extraAmount || 0);

    await expense.save();

    const monthString = getMonthFromStringDate(expense.date);
    const year = getYearFromStringDate(expense.date);

    await recalculateOtherExpTotal(expense.user, monthString, year);
    await recalculateTRDays(expense.user, monthString, year);

    res.json({ message: "Updated", expense });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// exports.deleteNormalExpense = async (req, res) => {
//   try {
//     const requester = req.user;
//     const { id } = req.params;

//     const expense = await NormalExpense.findById(id);

//     if (!expense) {
//       return res.status(404).json({ message: "Normal expense not found" });
//     }

//     // ADMIN → allowed
//     if (requester.role === "admin") {
//       // allowed
//     }

//     // MANAGER → only subordinates
//     else if (requester.role === "manager") {
//       const subordinate = await User.findOne({
//         _id: expense.user,
//         superior: requester._id,
//       });

//       if (!subordinate) {
//         return res.status(403).json({
//           message: "Not authorized to delete this expense",
//         });
//       }
//     }

//     // EXECUTIVE → only own
//     else if (expense.user.toString() !== requester._id.toString()) {
//       return res.status(403).json({
//         message: "Not authorized to delete this expense",
//       });
//     }

//     await expense.deleteOne();

//     const monthString = getMonthFromStringDate(expense.date);
//     const year = getYearFromStringDate(expense.date);

//     await recalculateNormalExpTotal(expense.user, monthString, year);

//     if (expense.workType === "NW") {
//       await recalculateNWDays(expense.user, monthString, year);
//     }

//     await recalculateTRDays(expense.user, monthString, year);

//     res.json({ message: "Normal expense deleted successfully" });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

exports.deleteNormalExpense = async (req, res) => {
  try {
    const requester = req.user;
    const { id } = req.params;

    const expense = await NormalExpense.findById(id);

    if (!expense) {
      return res.status(404).json({ message: "Normal expense not found" });
    }

    await expense.deleteOne();

    const monthString = getMonthFromStringDate(expense.date);
    const year = getYearFromStringDate(expense.date);

    await recalculateNormalExpTotal(expense.user, monthString, year);

    if (expense.workType === "NW") {
      await recalculateNWDays(expense.user, monthString, year);
    }

    await recalculateTRDays(expense.user, monthString, year);

    res.json({ message: "Normal expense deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// exports.deleteOtherExpense = async (req, res) => {
//   try {
//     const requester = req.user;
//     const { id } = req.params;

//     const expense = await OtherExpense.findById(id);

//     if (!expense) {
//       return res.status(404).json({ message: "Other expense not found" });
//     }

//     // ADMIN → allowed
//     if (requester.role === "admin") {
//       // allowed
//     }

//     // MANAGER → only subordinates
//     else if (requester.role === "manager") {
//       const subordinate = await User.findOne({
//         _id: expense.user,
//         superior: requester._id,
//       });

//       if (!subordinate) {
//         return res.status(403).json({
//           message: "Not authorized to delete this expense",
//         });
//       }
//     }

//     // EXECUTIVE → only own
//     else if (expense.user.toString() !== requester._id.toString()) {
//       return res.status(403).json({
//         message: "Not authorized to delete this expense",
//       });
//     }

//     await expense.deleteOne();

//     const monthString = getMonthFromStringDate(expense.date);
//     const year = getYearFromStringDate(expense.date);

//     await recalculateOtherExpTotal(expense.user, monthString, year);
//     await recalculateTRDays(expense.user, monthString, year);

//     res.json({ message: "Other expense deleted successfully" });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.addOtherExpenseBySuperior = async (req, res) => {
//   try {
//     const requester = req.user;

//     const {
//       userId,
//       date,
//       amount,
//       extraAmount,
//       description,
//       billNo,
//       extraDescription,
//       category,
//     } = req.body;

//     // 🔐 Only admin or manager
//     if (requester.role !== "admin" && requester.role !== "manager") {
//       return res.status(403).json({
//         message: "Not authorized to add other expense",
//       });
//     }

//     // MANAGER → only subordinates
//     if (requester.role === "manager") {
//       const subordinate = await User.findOne({
//         _id: userId,
//         superior: requester._id,
//       });

//       if (!subordinate) {
//         return res.status(403).json({
//           message: "Not authorized to add expense for this user",
//         });
//       }
//     }

//     // 📅 Handle date
//     let expenseDateString;

//     if (date) {
//       // yyyy-mm-dd → dd-mm-yyyy
//       const [yearInput, monthInput, dayInput] = date.split("-");
//       expenseDateString = `${dayInput}-${monthInput}-${yearInput}`;
//     } else {
//       // default to today
//       const today = new Date();
//       const day = String(today.getDate()).padStart(2, "0");
//       const month = String(today.getMonth() + 1).padStart(2, "0");
//       const year = today.getFullYear();
//       expenseDateString = `${day}-${month}-${year}`;
//     }

//     const newExpense = new OtherExpense({
//       user: userId,
//       date: expenseDateString,
//     });

//     if (amount !== undefined)
//       newExpense.amount = Number(amount);

//     if (extraAmount !== undefined)
//       newExpense.extraAmount = Number(extraAmount);

//     if (description !== undefined)
//       newExpense.description = description;

//     if (billNo !== undefined)
//       newExpense.billNo = billNo;

//     if (extraDescription !== undefined)
//       newExpense.extraDescription = extraDescription;

//     if (category !== undefined)
//       newExpense.category = category;

//     newExpense.total =
//       Number(newExpense.amount || 0) +
//       Number(newExpense.extraAmount || 0);

//     await newExpense.save();

//     const monthString = getMonthFromStringDate(expenseDateString);
//     const year = getYearFromStringDate(expenseDateString);

//     await recalculateOtherExpTotal(userId, monthString, year);
//     await recalculateTRDays(userId, monthString, year);

//     res.status(201).json({
//       message: "Other expense added successfully",
//       expense: newExpense,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Server error while adding other expense",
//     });
//   }
// };

exports.deleteOtherExpense = async (req, res) => {
  try {
    const requester = req.user;
    const { id } = req.params;

    const expense = await OtherExpense.findById(id);

    if (!expense) {
      return res.status(404).json({ message: "Other expense not found" });
    }

    await expense.deleteOne();

    const monthString = getMonthFromStringDate(expense.date);
    const year = getYearFromStringDate(expense.date);

    await recalculateOtherExpTotal(expense.user, monthString, year);
    await recalculateTRDays(expense.user, monthString, year);

    res.json({ message: "Other expense deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.addOtherExpenseBySuperior = async (req, res) => {
  try {
    const requester = req.user;

    const {
      userId,
      date,
      amount,
      extraAmount,
      description,
      billNo,
      extraDescription,
      category,
    } = req.body;

    let expenseDateString;

    if (date) {
      const parts = date.split("-");

      if (parts[0].length === 2) {
        expenseDateString = date;
      }
      else if (parts[0].length === 4) {
        const [yearInput, monthInput, dayInput] = parts;
        expenseDateString = `${dayInput}-${monthInput}-${yearInput}`;
      } 
      else {
        return res.status(400).json({ message: "Invalid date format" });
      }
    } else {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const year = today.getFullYear();
      expenseDateString = `${day}-${month}-${year}`;
    }

    const newExpense = new OtherExpense({
      user: userId,
      date: expenseDateString,
    });

    if (amount !== undefined)
      newExpense.amount = Number(amount);

    if (extraAmount !== undefined)
      newExpense.extraAmount = Number(extraAmount);

    if (description !== undefined)
      newExpense.description = description;

    if (billNo !== undefined)
      newExpense.billNo = billNo;

    if (extraDescription !== undefined)
      newExpense.extraDescription = extraDescription;

    if (category !== undefined)
      newExpense.category = category;

    newExpense.total =
      Number(newExpense.amount || 0) +
      Number(newExpense.extraAmount || 0);

    await newExpense.save();

    const monthString = getMonthFromStringDate(expenseDateString);
    const year = getYearFromStringDate(expenseDateString);

    await recalculateOtherExpTotal(userId, monthString, year);
    await recalculateTRDays(userId, monthString, year);

    res.status(201).json({
      message: "Other expense added successfully",
      expense: newExpense,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while adding other expense",
    });
  }
};

// exports.addOtherExpenseBySuperior = async (req, res) => {
//   try {
//     const requester = req.user;

//     const {
//       userId,
//       date,
//       amount,
//       extraAmount,
//       description,
//       billNo,
//       extraDescription,
//       category,
//     } = req.body;

//     // 🔐 Only admin or manager
//     if (requester.role !== "admin" && requester.role !== "manager") {
//       return res.status(403).json({
//         message: "Not authorized to add other expense",
//       });
//     }

//     // MANAGER → only subordinates
//     if (requester.role === "manager") {
//       const subordinate = await User.findOne({
//         _id: userId,
//         superior: requester._id,
//       });

//       if (!subordinate) {
//         return res.status(403).json({
//           message: "Not authorized to add expense for this user",
//         });
//       }
//     }

//     // 📅 Handle date (FIXED ONLY THIS PART)
//     let expenseDateString;

//     if (date) {
//       const parts = date.split("-");

//       // If already DD-MM-YYYY
//       if (parts[0].length === 2) {
//         expenseDateString = date;
//       }
//       // If YYYY-MM-DD (HTML input format)
//       else if (parts[0].length === 4) {
//         const [yearInput, monthInput, dayInput] = parts;
//         expenseDateString = `${dayInput}-${monthInput}-${yearInput}`;
//       } 
//       else {
//         return res.status(400).json({ message: "Invalid date format" });
//       }
//     } else {
//       const today = new Date();
//       const day = String(today.getDate()).padStart(2, "0");
//       const month = String(today.getMonth() + 1).padStart(2, "0");
//       const year = today.getFullYear();
//       expenseDateString = `${day}-${month}-${year}`;
//     }

//     const newExpense = new OtherExpense({
//       user: userId,
//       date: expenseDateString,
//     });

//     if (amount !== undefined)
//       newExpense.amount = Number(amount);

//     if (extraAmount !== undefined)
//       newExpense.extraAmount = Number(extraAmount);

//     if (description !== undefined)
//       newExpense.description = description;

//     if (billNo !== undefined)
//       newExpense.billNo = billNo;

//     if (extraDescription !== undefined)
//       newExpense.extraDescription = extraDescription;

//     if (category !== undefined)
//       newExpense.category = category;

//     newExpense.total =
//       Number(newExpense.amount || 0) +
//       Number(newExpense.extraAmount || 0);

//     await newExpense.save();

//     const monthString = getMonthFromStringDate(expenseDateString);
//     const year = getYearFromStringDate(expenseDateString);

//     await recalculateOtherExpTotal(userId, monthString, year);
//     await recalculateTRDays(userId, monthString, year);

//     res.status(201).json({
//       message: "Other expense added successfully",
//       expense: newExpense,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Server error while adding other expense",
//     });
//   }
// };