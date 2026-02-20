// // const Approval = require("../models/Approval");
// // const User = require("../models/User");

// // const MONTHS = [
// //   "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
// //   "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
// // ];

// // // Get current month string
// // const getCurrentMonth = () => {
// //   const now = new Date();
// //   return MONTHS[now.getMonth()];
// // };

// // // Get previous two months
// // const getLastThreeMonths = () => {
// //   const now = new Date();
// //   const currentIndex = now.getMonth();

// //   const months = [];

// //   for (let i = 0; i < 3; i++) {
// //     const index = (currentIndex - i + 12) % 12;
// //     months.push(MONTHS[index]);
// //   }

// //   return months; // [CURRENT, PREV1, PREV2]
// // };

// // // Create approvals for new month (for all users)
// // exports.ensureMonthlyApprovals = async () => {
// //   const currentMonth = getCurrentMonth();

// //   const users = await User.find();

// //   for (const user of users) {
// //     await Approval.findOneAndUpdate(
// //       { user: user._id, month: currentMonth },
// //       {
// //         user: user._id,
// //         month: currentMonth,
// //         normalExpTotal: 0,
// //         otherExpTotal: 0,
// //         lastReported: null,
// //         approvedByUser: false,
// //         approvedBySuperior: false,
// //       },
// //       { upsert: true, new: true }
// //     );
// //   }

// //   // Delete months older than 3-month window
// //   const allowedMonths = getLastThreeMonths();

// //   await Approval.deleteMany({
// //     month: { $nin: allowedMonths }
// //   });
// // };






// const Approval = require("../models/Approval");
// const User = require("../models/User");

// const MONTHS = [
//   "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
//   "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
// ];

// const getCurrentMonth = () => {
//   const now = new Date();
//   return MONTHS[now.getMonth()];
// };

// const getLastThreeMonths = () => {
//   const now = new Date();
//   const currentIndex = now.getMonth();

//   const months = [];

//   for (let i = 0; i < 3; i++) {
//     const index = (currentIndex - i + 12) % 12;
//     months.push(MONTHS[index]);
//   }

//   return months;
// };

// // 🔥 CORE FUNCTION
// exports.ensureMonthlyApprovals = async () => {
//   const currentMonth = getCurrentMonth();
//   const users = await User.find();

//   for (const user of users) {
//     await Approval.findOneAndUpdate(
//       { user: user._id, month: currentMonth },
//       {
//         user: user._id,
//         month: currentMonth,
//         normalExpTotal: 0,
//         otherExpTotal: 0,
//         lastReported: null,
//         approvedByUser: false,
//         approvedBySuperior: false,
//       },
//       { upsert: true }
//     );
//   }

//   const allowedMonths = getLastThreeMonths();

//   await Approval.deleteMany({
//     month: { $nin: allowedMonths }
//   });
// };


// // ============================
// // GET LOGGED-IN USER APPROVALS
// // ============================
// exports.getMyApprovals = async (req, res) => {
//   try {
//     const approvals = await Approval.find({
//       user: req.user._id
//     }).sort({ month: -1 });

//     res.json(approvals);

//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };


// // ============================
// // GET SPECIFIC USER APPROVALS
// // ============================
// exports.getUserApprovals = async (req, res) => {
//   try {
//     const approvals = await Approval.find({
//       user: req.params.userId
//     }).sort({ month: -1 });

//     res.json(approvals);

//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };


// // ============================
// // MANUAL TRIGGER (OPTIONAL)
// // ============================
// exports.triggerMonthlyCheck = async (req, res) => {
//   try {
//     await exports.ensureMonthlyApprovals();

//     res.json({ message: "Monthly approval check executed successfully" });

//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };






const Approval = require("../models/Approval");
const User = require("../models/User");
const NormalExpense = require("../models/NormalExpense");
const OtherExpense = require("../models/OtherExpense");

const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

const getCurrentMonth = () => {
  const now = new Date();
  return MONTHS[now.getMonth()];
};

const getMonthFromDate = (dateObj) => {
  return MONTHS[dateObj.getMonth()];
};

const getLastThreeMonths = () => {
  const now = new Date();
  const currentIndex = now.getMonth();

  const months = [];

  for (let i = 0; i < 3; i++) {
    const index = (currentIndex - i + 12) % 12;
    months.push(MONTHS[index]);
  }

  return months; // [CURRENT, PREV1, PREV2]
};


// exports.ensureMonthlyApprovals = async () => {

//   const now = new Date();
//   const currentMonth = getCurrentMonth();

//   // 1️⃣ Create approval for all users (if not exists)
//   const users = await User.find();

//   for (const user of users) {
//     await Approval.findOneAndUpdate(
//       { user: user._id, month: currentMonth },
//       {
//         user: user._id,
//         month: currentMonth,
//         normalExpTotal: 0,
//         otherExpTotal: 0,
//         lastReported: null,
//         approvedByUser: false,
//         approvedBySuperior: false,
//       },
//       { upsert: true }
//     );
//   }

//   // 2️⃣ Keep only last 3 months (Approval collection)
//   const allowedMonths = getLastThreeMonths();

//   await Approval.deleteMany({
//     month: { $nin: allowedMonths }
//   });

//   // 3️⃣ HARD DELETE OLD EXPENSES

//   // Start of month 2 months ago
//   const thresholdDate = new Date(
//     now.getFullYear(),
//     now.getMonth() - 2,
//     1
//   );

//   await NormalExpense.deleteMany({
//     date: { $lt: thresholdDate }
//   });

//   await OtherExpense.deleteMany({
//     date: { $lt: thresholdDate }
//   });
// };

// exports.ensureMonthlyApprovals = async () => {

//   const now = new Date();
//   const currentMonth = getCurrentMonth();

//   // 1️⃣ Create approval for all users (if not exists)
//   const users = await User.find();

//   for (const user of users) {
//     await Approval.findOneAndUpdate(
//       { user: user._id, month: currentMonth },
//       {
//         user: user._id,
//         month: currentMonth,
//         normalExpTotal: 0,
//         otherExpTotal: 0,
//         NWdays: 0, // ✅ ADDED
//         lastReported: null,
//         approvedByUser: false,
//         approvedBySuperior: false,
//       },
//       { upsert: true }
//     );
//   }

//   // 2️⃣ Keep only last 3 months (Approval collection)
//   const allowedMonths = getLastThreeMonths();

//   await Approval.deleteMany({
//     month: { $nin: allowedMonths }
//   });

//   // 3️⃣ HARD DELETE OLD EXPENSES

//   const thresholdDate = new Date(
//     now.getFullYear(),
//     now.getMonth() - 2,
//     1
//   );

//   await NormalExpense.deleteMany({
//     date: { $lt: thresholdDate }
//   });

//   await OtherExpense.deleteMany({
//     date: { $lt: thresholdDate }
//   });
// };


// exports.ensureMonthlyApprovals = async () => {

//   const now = new Date();
//   const currentMonth = getCurrentMonth();

//   const users = await User.find();

//   for (const user of users) {
//     await Approval.findOneAndUpdate(
//       { user: user._id, month: currentMonth },
//       {
//         user: user._id,
//         month: currentMonth,
//         NWdays: 0,
//         lastReported: null,
//         approvedByUser: false,
//         approvedBySuperior: false,
//       },
//       { upsert: true }
//     );
//   }

//   // Keep only last 3 months
//   const allowedMonths = getLastThreeMonths();

//   await Approval.deleteMany({
//     month: { $nin: allowedMonths }
//   });

//   // Delete old expenses
//   const thresholdDate = new Date(
//     now.getFullYear(),
//     now.getMonth() - 2,
//     1
//   );

//   await NormalExpense.deleteMany({
//     date: { $lt: thresholdDate }
//   });

//   await OtherExpense.deleteMany({
//     date: { $lt: thresholdDate }
//   });
// };

exports.ensureMonthlyApprovals = async () => {

  const now = new Date();
  const currentMonth = getCurrentMonth();

  const users = await User.find();

  for (const user of users) {
    await Approval.findOneAndUpdate(
      { user: user._id, month: currentMonth },
      {
        $setOnInsert: {
          user: user._id,
          month: currentMonth,
          NWdays: 0,
          lastReported: null,
          approvedByUser: false,
          approvedBySuperior: false,
        }
      },
      { upsert: true }
    );
  }

  const allowedMonths = getLastThreeMonths();

  await Approval.deleteMany({
    month: { $nin: allowedMonths }
  });

  const thresholdDate = new Date(
    now.getFullYear(),
    now.getMonth() - 2,
    1
  );

  await NormalExpense.deleteMany({
    date: { $lt: thresholdDate }
  });

  await OtherExpense.deleteMany({
    date: { $lt: thresholdDate }
  });
};


exports.getMyApprovals = async (req, res) => {
  try {
    const approvals = await Approval.find({
      user: req.user._id
    });

    res.json(approvals);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


/* ============================
   GET SPECIFIC USER APPROVALS
============================ */
exports.getUserApprovals = async (req, res) => {
  try {
    const approvals = await Approval.find({
      user: req.params.userId
    });

    res.json(approvals);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


/* ============================
   MANUAL TRIGGER (OPTIONAL)
============================ */
exports.triggerMonthlyCheck = async (req, res) => {
  try {
    await exports.ensureMonthlyApprovals();

    res.json({
      message: "Monthly approval check executed successfully"
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


/* ============================
   USER SUBMIT MONTH APPROVAL
============================ */
exports.submitMyApproval = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month } = req.body; // Expect "JAN", "FEB", etc.

    if (!month) {
      return res.status(400).json({
        message: "Month is required",
      });
    }

    const approval = await Approval.findOne({
      user: userId,
      month,
    });

    if (!approval) {
      return res.status(404).json({
        message: "Approval record not found for this month",
      });
    }

    if (approval.approvedByUser) {
      return res.status(400).json({
        message: "You have already submitted approval for this month",
      });
    }

    approval.approvedByUser = true;
    await approval.save();

    res.json({
      message: "Month submitted successfully. No further entries allowed.",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ============================
   SUPERIOR APPROVES MONTH
============================ */
exports.approveBySuperior = async (req, res) => {
  try {
    const { userId, month } = req.body;

    if (!userId || !month) {
      return res.status(400).json({
        message: "User ID and month are required",
      });
    }

    const approval = await Approval.findOne({
      user: userId,
      month,
    });

    if (!approval) {
      return res.status(404).json({
        message: "Approval record not found",
      });
    }

    // ❗ Cannot approve unless user approved first
    if (!approval.approvedByUser) {
      return res.status(400).json({
        message: "User has not submitted approval yet",
      });
    }

    if (approval.approvedBySuperior) {
      return res.status(400).json({
        message: "Already approved by superior",
      });
    }

    approval.approvedBySuperior = true;
    await approval.save();

    res.json({
      message: "Approved by superior successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
