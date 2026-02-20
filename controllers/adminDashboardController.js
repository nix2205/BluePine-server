// const User = require("../models/User");
// const Approval = require("../models/Approval");
// const SRC = require("../models/SRC");

// const MONTHS = [
//   "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
//   "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
// ];

// const getCurrentMonth = () => {
//   const now = new Date();
//   return MONTHS[now.getMonth()];
// };


// /* =========================================
//    ADMIN DASHBOARD SUMMARY
// ========================================= */
// exports.getAdminDashboard = async (req, res) => {
//   try {
//     const requester = req.user;

//     if (requester.role !== "admin") {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     const currentMonth = getCurrentMonth();
//     const prevMonth =
//       MONTHS[(MONTHS.indexOf(currentMonth) - 1 + 12) % 12];

//     const users = await User.find({
//       company: requester.company,
//       isActive: true,
//       role: { $ne: "admin" },
//     }).select("_id userId username role");

//     const dashboardData = [];

//     for (const user of users) {
//       const hq = await SRC.findOne({
//         user: user._id,
//         station: "HQ",
//       }).select("placeOfWork");

//       const approvals = await Approval.find({
//         user: user._id,
//         month: { $in: [currentMonth, prevMonth] },
//       });

//       const currentApproval = approvals.find(
//         (a) => a.month === currentMonth
//       );

//       const prevApproval = approvals.find(
//         (a) => a.month === prevMonth
//       );

//       dashboardData.push({
//         _id: user._id,
//         userId: user.userId,
//         username: user.username,
//         role: user.role,
//         hq: hq?.placeOfWork || "-",

//         currentMonth: {
//           month: currentMonth,
//           normal: currentApproval?.normalExpTotal || 0,
//           other: currentApproval?.otherExpTotal || 0,
//           total:
//             (currentApproval?.normalExpTotal || 0) +
//             (currentApproval?.otherExpTotal || 0),
//           approvedByUser:
//             currentApproval?.approvedByUser || false,
//           approvedBySuperior:
//             currentApproval?.approvedBySuperior || false,
//         },

//         prevMonth: {
//           month: prevMonth,
//           normal: prevApproval?.normalExpTotal || 0,
//           other: prevApproval?.otherExpTotal || 0,
//           total:
//             (prevApproval?.normalExpTotal || 0) +
//             (prevApproval?.otherExpTotal || 0),
//           approvedByUser:
//             prevApproval?.approvedByUser || false,
//           approvedBySuperior:
//             prevApproval?.approvedBySuperior || false,
//         },

//         NWdays: currentApproval?.NWdays || 0,
//         lastReported: currentApproval?.lastReported || "-",
//       });
//     }

//     res.json(dashboardData);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };






const User = require("../models/User");
const Approval = require("../models/Approval");
const SRC = require("../models/SRC");
const NormalExpense = require("../models/NormalExpense");
const OtherExpense = require("../models/OtherExpense");

const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

const getCurrentMonthIndex = () => {
  return new Date().getMonth();
};

const getMonthDateRange = (monthIndex, year) => {
  const start = new Date(year, monthIndex, 1);
  const end = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);
  return { start, end };
};

/* =========================================
   ADMIN DASHBOARD SUMMARY (LIVE TOTALS)
========================================= */
exports.getAdminDashboard = async (req, res) => {
  try {
    const requester = req.user;

    if (requester.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const now = new Date();
    const year = now.getFullYear();

    const currentMonthIndex = getCurrentMonthIndex();
    const prevMonthIndex =
      (currentMonthIndex - 1 + 12) % 12;

    const currentMonthCode = MONTHS[currentMonthIndex];
    const prevMonthCode = MONTHS[prevMonthIndex];

    const { start: currentStart, end: currentEnd } =
      getMonthDateRange(currentMonthIndex, year);

    const { start: prevStart, end: prevEnd } =
      getMonthDateRange(prevMonthIndex, year);

    const users = await User.find({
      company: requester.company,
      isActive: true,
      role: { $ne: "admin" },
    }).select("_id userId username role");

    const dashboardData = [];

    for (const user of users) {

      const hq = await SRC.findOne({
        user: user._id,
        station: "HQ",
      }).select("placeOfWork");

      const approvals = await Approval.find({
        user: user._id,
        month: { $in: [currentMonthCode, prevMonthCode] },
      });

      const currentApproval = approvals.find(
        (a) => a.month === currentMonthCode
      );

      const prevApproval = approvals.find(
        (a) => a.month === prevMonthCode
      );

      // 🔥 NORMAL EXPENSE TOTAL (CURRENT)
      const currentNormal = await NormalExpense.aggregate([
        {
          $match: {
            user: user._id,
            date: { $gte: currentStart, $lte: currentEnd },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]);

      // 🔥 OTHER EXPENSE TOTAL (CURRENT)
      const currentOther = await OtherExpense.aggregate([
        {
          $match: {
            user: user._id,
            date: { $gte: currentStart, $lte: currentEnd },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]);

      // 🔥 NORMAL EXPENSE TOTAL (PREV)
      const prevNormal = await NormalExpense.aggregate([
        {
          $match: {
            user: user._id,
            date: { $gte: prevStart, $lte: prevEnd },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]);

      // 🔥 OTHER EXPENSE TOTAL (PREV)
      const prevOther = await OtherExpense.aggregate([
        {
          $match: {
            user: user._id,
            date: { $gte: prevStart, $lte: prevEnd },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]);

      const currentTotal =
        (currentNormal[0]?.total || 0) +
        (currentOther[0]?.total || 0);

      const prevTotal =
        (prevNormal[0]?.total || 0) +
        (prevOther[0]?.total || 0);

        // 🔥 NW DAYS CALCULATION (LIVE)
const currentNWdays = await NormalExpense.countDocuments({
  user: user._id,
  date: { $gte: currentStart, $lte: currentEnd },
});

const prevNWdays = await NormalExpense.countDocuments({
  user: user._id,
  date: { $gte: prevStart, $lte: prevEnd },
});

      dashboardData.push({
        _id: user._id,
        userId: user.userId,
        username: user.username,
        role: user.role,
        hq: hq?.placeOfWork || "-",

        currentMonth: {
  month: currentMonthCode,
  total: currentTotal,
  approvedByUser:
    currentApproval?.approvedByUser || false,
  approvedBySuperior:
    currentApproval?.approvedBySuperior || false,
  NWdays: currentNWdays,
},

prevMonth: {
  month: prevMonthCode,
  total: prevTotal,
  approvedByUser:
    prevApproval?.approvedByUser || false,
  approvedBySuperior:
    prevApproval?.approvedBySuperior || false,
  NWdays: prevNWdays,
},

NWdays: currentNWdays,
        lastReported: currentApproval?.lastReported || "-",
      });
    }

    res.json(dashboardData);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
