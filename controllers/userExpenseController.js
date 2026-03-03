// // const NormalExpense = require("../models/NormalExpense");
// // const SRC = require("../models/SRC");
// // const SRCConfig = require("../models/SRCConfig");
// // const calculateFWExpense = require("../utils/fwCalculator");
// // const haversineDistance = require("../utils/haversineDistance");
// // const CityMap = require("../models/CityMap");
// // const OtherExpense = require("../models/OtherExpense");

// // // Helpers
// // const formatDate = () => {
// //   const now = new Date();
// //   const day = String(now.getDate()).padStart(2, "0");
// //   const month = String(now.getMonth() + 1).padStart(2, "0");
// //   const year = String(now.getFullYear()).slice(-2);
// //   return `${day}/${month}/${year}`;
// // };

// // const formatTime = () => {
// //   const now = new Date();
// //   const hours = String(now.getHours()).padStart(2, "0");
// //   const minutes = String(now.getMinutes()).padStart(2, "0");
// //   return `${hours}:${minutes}`;
// // };

// // const checkAlreadySubmittedToday = async (userId, dateObj) => {
// //   const start = new Date(dateObj);
// //   start.setHours(0, 0, 0, 0);

// //   const end = new Date(dateObj);
// //   end.setHours(23, 59, 59, 999);

// //   const existing = await NormalExpense.findOne({
// //     user: userId,
// //     date: { $gte: start, $lte: end },
// //   });

// //   return existing;
// // };


// // /* =========================
// //    FW CONTROLLER
// // ========================= */
// // // POST /api/fw/record-location
// // exports.recordFWLocation = async (req, res) => {
// //   try {
// //     const { lat, lon } = req.body;
// //     const userId = req.user._id;

// //     if (!lat || !lon) {
// //       return res.status(400).json({
// //         message: "Latitude and longitude required",
// //       });
// //     }

// //     // 1️⃣ Fetch mapped cities for user
// //     const mappedCities = await CityMap.find({ user: userId });

// //     if (!mappedCities.length) {
// //       return res.status(404).json({
// //         message: "No mapped cities found for this user",
// //       });
// //     }

// //     // 2️⃣ Check distance against each mapped city
// //     for (const city of mappedCities) {
// //       const dist = haversineDistance(
// //         lat,
// //         lon,
// //         city.location.lat,
// //         city.location.lon
// //       );

// //       if (dist <= city.radiusKm) {
// //         return res.json({
// //           matched: true,
// //           city: city.city,
// //           autoMOT: city.stationType === "HQ" ? "Local" : null,
// //           message: "Location matched successfully",
// //         });
// //       }
// //     }

// //     // 3️⃣ No match
// //     return res.json({
// //       matched: false,
// //       message: "Location outside mapped territories",
// //     });

// //   } catch (err) {
// //     console.error("FW record location error:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };



// // exports.previewFWExpense = async (req, res) => {
// //   try {
// //     const userId = req.user.id;
// //     const { placeOfWork, MOT } = req.body;

// //     if (!placeOfWork || !MOT) {
// //       return res.status(400).json({ message: "Place and MOT required" });
// //     }

// //     const today = new Date(



// //     const result = await calculateFWExpense(userId, placeOfWork, MOT);

// //     res.json({
// //       placeOfWork,
// //       MOT,
// //       date: formatDate(today),
// //       time: formatTime(),
// //       ...result,
// //     });

// //   } catch (error) {
// //     res.status(400).json({ message: error.message });
// //   }
// // };


// // exports.createFWExpense = async (req, res) => {
// //   try {
// //     const userId = req.user.id;
// //     const { placeOfWork, MOT } = req.body;

// //     if (!placeOfWork || !MOT) {
// //       return res.status(400).json({ message: "Place and MOT required" });
// //     }

// //     const today = new Date(


// //     const existing = await checkAlreadySubmittedToday(userId, today);
// //     if (existing) {
// //       return res.status(400).json({
// //         message: "You have already submitted an entry for today",
// //       });
// //     }

// //     const calc = await calculateFWExpense(userId, placeOfWork, MOT);

// //     const expense = await NormalExpense.create({
// //       user: userId,
// //       date: today,
// //       time: formatTime(),
// //       placeOfWork: placeOfWork.trim(),
// //       station: calc.station,
// //       kms: calc.kms,
// //       MOT,
// //       TA: calc.TA,
// //       DA: calc.DA,
// //       ExtraTA: 0,
// //       ExtraDA: 0,
// //       taDesc: "",
// //       daDesc: "",
// //       workType: "FW",
// //       total: calc.total,
// //     });

// //     res.status(201).json({
// //       message: "FW Expense created successfully",
// //       expense,
// //       displayDate: today,
// //     });

// //   } catch (error) {
// //     res.status(400).json({ message: error.message });
// //   }
// // };



// // /* =========================
// //    NFW CONTROLLER
// // ========================= */
// // exports.createNFWExpense = async (req, res) => {
// //   try {
// //     const userId = req.user.id;

// //     const {
// //       placeOfWork,
// //       station,
// //       kms,
// //       MOT,
// //       TA,
// //       DA,
// //     } = req.body;

// //     if (!placeOfWork || !station || kms == null || !MOT || TA == null || DA == null) {
// //       return res.status(400).json({
// //         message: "All required fields must be provided",
// //       });
// //     }


// //     const existing = await checkAlreadySubmittedToday(userId, today);
// //     if (existing) {
// //       return res.status(400).json({
// //         message: "You have already submitted an entry for today",
// //       });
// //     }

// //     const total = Number(TA) + Number(DA);

// //     const expense = await NormalExpense.create({
// //       user: userId,
// //       date: today,
// //       time: formatTime(),
// //       placeOfWork: placeOfWork.trim(),
// //       station,
// //       kms: Number(kms),
// //       MOT,
// //       TA: Number(TA),
// //       DA: Number(DA),
// //       ExtraTA: 0,
// //       ExtraDA: 0,
// //       taDesc: "",
// //       daDesc: "",
// //       workType: "NFW",
// //       total,
// //     });

// //     res.status(201).json({
// //       message: "NFW Expense created successfully",
// //       expense,
// //       displayDate: formatDate(),
// //     });

// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Server Error" });
// //   }
// // };

// // /* =========================
// //    NW CONTROLLER
// // ========================= */
// // exports.createNWExpense = async (req, res) => {
// //   try {
// //     const userId = req.user.id;
// //     const { date, placeOfWork } = req.body;

// //     if (!date || !placeOfWork) {
// //       return res.status(400).json({
// //         message: "Date and placeOfWork are required",
// //       });
// //     }

// //     const parsedDate = new Date(date);

// //     if (isNaN(parsedDate.getTime())) {
// //       return res.status(400).json({
// //         message: "Invalid date format",
// //       });
// //     }

// //     // ===== DATE LIMIT LOGIC =====
// //     const today = new Date(

// //     // Start of current month
// //     const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

// //     // Start of previous month
// //     const startOfPreviousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

// //     // End of current month (last day, 23:59:59)
// //     const endOfCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
// //     endOfCurrentMonth.setHours(23, 59, 59, 999);

// //     if (parsedDate > today) {
// //       return res.status(400).json({
// //         message: "Future dates are not allowed",
// //       });
// //     }

// //     if (parsedDate < startOfPreviousMonth || parsedDate > endOfCurrentMonth) {
// //       return res.status(400).json({
// //         message: "You can only submit entries for previous month and current month",
// //       });
// //     }

// //     const existing = await checkAlreadySubmittedToday(userId, parsedDate);
// //     if (existing) {
// //       return res.status(400).json({
// //         message: "You have already submitted an entry for this date",
// //       });
// //     }

// //     const expense = await NormalExpense.create({
// //       user: userId,
// //       date: parsedDate,
// //       time: "-",
// //       placeOfWork: placeOfWork.trim(),
// //       station: "-",
// //       kms: 0,
// //       MOT: "-",
// //       TA: 0,
// //       DA: 0,
// //       ExtraTA: 0,
// //       ExtraDA: 0,
// //       taDesc: "",
// //       daDesc: "",
// //       workType: "NW",
// //       total: 0,
// //     });

// //     res.status(201).json({
// //       message: "NW entry created successfully",
// //       expense,
// //     });

// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Server Error" });
// //   }
// // };
// // /* =========================
// //    OTHER EXPENSE CONTROLLER
// // ========================= */
// // exports.createOtherExpense = async (req, res) => {
// //   try {
// //     const userId = req.user.id;

// //     const { date, amount, description, billNo } = req.body;

// //     // ===== REQUIRED VALIDATION =====
// //     if (!date || amount == null || !description) {
// //       return res.status(400).json({
// //         message: "Date, amount and description are required",
// //       });
// //     }

// //     const parsedDate = new Date(date);

// //     if (isNaN(parsedDate.getTime())) {
// //       return res.status(400).json({
// //         message: "Invalid date format",
// //       });
// //     }

// //     // ===== DATE LOCK LOGIC =====
// //     const today = new Date(



// //     const startOfPreviousMonth = new Date(
// //       today.getFullYear(),
// //       today.getMonth() - 1,
// //       1
// //     );

// //     const endOfCurrentMonth = new Date(
// //       today.getFullYear(),
// //       today.getMonth() + 1,
// //       0
// //     );
// //     endOfCurrentMonth.setHours(23, 59, 59, 999);

// //     // ❌ No future date
// //     if (parsedDate > today) {
// //       return res.status(400).json({
// //         message: "Future dates are not allowed",
// //       });
// //     }

// //     // ❌ Only prev + current month allowed
// //     if (
// //       parsedDate < startOfPreviousMonth ||
// //       parsedDate > endOfCurrentMonth
// //     ) {
// //       return res.status(400).json({
// //         message:
// //           "You can only add expenses for previous or current month",
// //       });
// //     }

// //     const mainAmount = Number(amount);

// //     if (isNaN(mainAmount) || mainAmount <= 0) {
// //       return res.status(400).json({
// //         message: "Amount must be a valid number greater than 0",
// //       });
// //     }

// //     const total = mainAmount; // extraAmount = 0

// //     const expense = await OtherExpense.create({
// //       user: userId,
// //       date: parsedDate,
// //       amount: mainAmount,
// //       description: description.trim(),
// //       billNo: billNo || "",
// //       extraAmount: 0,
// //       extraDescription: "",
// //       total,
// //     });

// //     res.status(201).json({
// //       message: "Other expense added successfully",
// //       expense,
// //     });

// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Server Error" });
// //   }
// // };







// // const NormalExpense = require("../models/NormalExpense");
// // const SRC = require("../models/SRC");
// // const SRCConfig = require("../models/SRCConfig");
// // const calculateFWExpense = require("../utils/fwCalculator");
// // const haversineDistance = require("../utils/haversineDistance");
// // const CityMap = require("../models/CityMap");
// // const OtherExpense = require("../models/OtherExpense");

// // const Approval = require("../models/Approval");
// // const { ensureMonthlyApprovals } = require("./approvalController");

// // // Month helper
// // const MONTHS = [
// //   "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
// //   "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
// // ];

// // const getMonthFromDate = (dateObj) => {
// //   return MONTHS[dateObj.getMonth()];
// // };


// // const getCurrentMonth = () => {
// //   const now = new Date();
// //   return MONTHS[now.getMonth()];
// // };




// // // Helpers
// // const formatDate = () => {
// //   const now = new Date();
// //   const day = String(now.getDate()).padStart(2, "0");
// //   const month = String(now.getMonth() + 1).padStart(2, "0");
// //   const year = String(now.getFullYear()).slice(-2);
// //   return `${day}/${month}/${year}`;
// // };

// // const recalculateNWDays = async (userId, monthString) => {
// //   const monthIndex = MONTHS.indexOf(monthString);

// //   const now = new Date();
// //   const year = now.getFullYear(); // assuming same year system

// //   // const startOfMonth = new Date(year, monthIndex, 1);
// //   // const endOfMonth = new Date(year, monthIndex + 1, 0);
// //   // endOfMonth.setHours(23, 59, 59, 999);
// //   const startOfMonth = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0));
// // const endOfMonth = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999));


// //   const count = await NormalExpense.countDocuments({
// //     user: userId,
// //     workType: "NW",
// //     date: { $gte: startOfMonth, $lte: endOfMonth }
// //   });

// //   await Approval.updateOne(
// //     { user: userId, month: monthString },
// //     { $set: { NWdays: count } }
// //   );
// // };

// // const recalculateTRDays = async (userId, monthString) => {
// //   const monthIndex = MONTHS.indexOf(monthString);
// //   const year = new Date().getFullYear();

// //   const startOfMonth = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0));
// //   const endOfMonth = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999));

// //   const uniqueDates = await NormalExpense.aggregate([
// //     {
// //       $match: {
// //         user: userId,
// //         date: { $gte: startOfMonth, $lte: endOfMonth },
// //       },
// //     },
// //     {
// //       $group: {
// //         _id: {
// //           $dateToString: { format: "%Y-%m-%d", date: "$date" },
// //         },
// //       },
// //     },
// //     {
// //       $count: "totalDays",
// //     },
// //   ]);

// //   const totalReportingDays = uniqueDates[0]?.totalDays || 0;

// //   await Approval.updateOne(
// //     { user: userId, month: monthString },
// //     { $set: { TR: totalReportingDays } }
// //   );
// // };

// // // const recalculateNormalExpTotal = async (userId, monthString) => {
// // //   const monthIndex = MONTHS.indexOf(monthString);
// // //   const year = new Date().getFullYear();

// // //   const startOfMonth = new Date(year, monthIndex, 1);
// // //   const endOfMonth = new Date(year, monthIndex + 1, 0);
// // //   endOfMonth.setHours(23, 59, 59, 999);

// // //   const result = await NormalExpense.aggregate([
// // //     {
// // //       $match: {
// // //         user: userId,
// // //         date: { $gte: startOfMonth, $lte: endOfMonth },
// // //       },
// // //     },
// // //     {
// // //       $group: {
// // //         _id: null,
// // //         total: { $sum: "$total" },
// // //       },
// // //     },
// // //   ]);

// // //   const total = result[0]?.total || 0;

// // //   await Approval.updateOne(
// // //     { user: userId, month: monthString },
// // //     { $set: { normalExpTotal: total } }
// // //   );
// // // };

// // const recalculateNormalExpTotal = async (userId, monthString) => {
// //   console.log("RecalculateNormalExpTotal called");
// //   console.log("User:", userId);
// //   console.log("Month:", monthString);

// //   const monthIndex = MONTHS.indexOf(monthString);
// //   const year = new Date().getFullYear();

// //   // const startOfMonth = new Date(year, monthIndex, 1);
// //   // const endOfMonth = new Date(year, monthIndex + 1, 0);
// //   // endOfMonth.setHours(23, 59, 59, 999);
// //   const startOfMonth = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0));
// // const endOfMonth = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999));

// //   console.log("StartOfMonth:", startOfMonth);
// //   console.log("EndOfMonth:", endOfMonth);

// //   const result = await NormalExpense.aggregate([
// //     {
// //       $match: {
// //         user: userId,
// //         date: { $gte: startOfMonth, $lte: endOfMonth },
// //       },
// //     },
// //     {
// //       $group: {
// //         _id: null,
// //         total: { $sum: "$total" },
// //       },
// //     },
// //   ]);

// //   console.log("Aggregation Result:", result);

// //   const total = result[0]?.total || 0;

// //   const updateResult = await Approval.updateOne(
// //     { user: userId, month: monthString },
// //     { $set: { normalExpTotal: total } }
// //   );

// //   console.log("Update Result:", updateResult);
// // };

// // const recalculateOtherExpTotal = async (userId, monthString) => {
// //   const monthIndex = MONTHS.indexOf(monthString);
// //   const year = new Date().getFullYear();

// //   // const startOfMonth = new Date(year, monthIndex, 1);
// //   // const endOfMonth = new Date(year, monthIndex + 1, 0);
// //   // endOfMonth.setHours(23, 59, 59, 999);

// //   const startOfMonth = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0));
// // const endOfMonth = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999));

// //   const result = await OtherExpense.aggregate([
// //     {
// //       $match: {
// //         user: userId,
// //         date: { $gte: startOfMonth, $lte: endOfMonth },
// //       },
// //     },
// //     {
// //       $group: {
// //         _id: null,
// //         total: { $sum: "$total" },
// //       },
// //     },
// //   ]);

// //   const total = result[0]?.total || 0;

// //   await Approval.updateOne(
// //     { user: userId, month: monthString },
// //     { $set: { otherExpTotal: total } }
// //   );
// // };

// // const formatTime = () => {
// //   const now = new Date();
// //   const hours = String(now.getHours()).padStart(2, "0");
// //   const minutes = String(now.getMinutes()).padStart(2, "0");
// //   return `${hours}:${minutes}`;
// // };

// // // const checkAlreadySubmittedToday = async (userId, dateObj) => {
// // //   const start = new Date(dateObj);
// // //   start.setHours(0, 0, 0, 0);

// // //   const end = new Date(dateObj);
// // //   end.setHours(23, 59, 59, 999);

// // //   return await NormalExpense.findOne({
// // //     user: userId,
// // //     date: { $gte: start, $lte: end },
// // //   });
// // // };
















// const NormalExpense = require("../models/NormalExpense");
// const SRC = require("../models/SRC");
// const SRCConfig = require("../models/SRCConfig");
// const calculateFWExpense = require("../utils/fwCalculator");
// const haversineDistance = require("../utils/haversineDistance");
// const CityMap = require("../models/CityMap");
// const OtherExpense = require("../models/OtherExpense");
// const Approval = require("../models/Approval");
// const { ensureMonthlyApprovals } = require("./approvalController");

// const MONTHS = [
//   "JAN","FEB","MAR","APR","MAY","JUN",
//   "JUL","AUG","SEP","OCT","NOV","DEC"
// ];

// const IST = "Asia/Kolkata";

// const getTodayString = () => {
//   const now = new Date(
//     new Date().toLocaleString("en-US", { timeZone: IST })
//   );

//   const day = String(now.getDate()).padStart(2, "0");
//   const month = String(now.getMonth() + 1).padStart(2, "0");
//   const year = now.getFullYear();

//   return `${day}-${month}-${year}`; // dd-mm-yyyy
// };

// const parseDateString = (dateStr) => {
//   const [day, month, year] = dateStr.split("-");
//   return new Date(year, month - 1, day);
// };

// const getMonthFromStringDate = (dateStr) => {
//   const [, month] = dateStr.split("-");
//   return MONTHS[Number(month) - 1];
// };

// // const new Date = () => {
// //   const now = new Date();
// //   const istOffset = 5.5 * 60; // IST offset in minutes
// //   const utc = now.getTime() + now.getTimezoneOffset() * 60000;
// //   return new Date(utc + istOffset * 60000);
// // };

// // const getMonthFromDate = (dateObj) => {
// //   return MONTHS[dateObj.getMonth()];
// // };


// const getCurrentMonth = () => {
//   const now = new Date();
//   return MONTHS[now.getMonth()];
// };

// // const formatDate = () => {
// //   const now = new Date();
// //   const day = String(now.getDate()).padStart(2, "0");
// //   const month = String(now.getMonth() + 1).padStart(2, "0");
// //   const year = String(now.getFullYear()).slice(-2);
// //   return `${day}/${month}/${year}`;
// // };

// const formatTime = () => {
//   const now = new Date();
//   const hours = String(now.getHours()).padStart(2, "0");
//   const minutes = String(now.getMinutes()).padStart(2, "0");
//   return `${hours}:${minutes}`;
// };

// /* ===========================
//    FIXED MONTH BOUNDARY LOGIC
//    =========================== */

// // const getMonthRange = (monthString) => {
// //   const monthIndex = MONTHS.indexOf(monthString);
// //   const year = new Date().getFullYear();

// //   const startOfMonth = new Date(year, monthIndex, 1);
// //   const endOfMonth = new Date(year, monthIndex + 1, 0);
// //   endOfMonth.setHours(23, 59, 59, 999);

// //   return { startOfMonth, endOfMonth };
// // };

// // const getMonthRange = (monthString) => {
// //   const monthIndex = MONTHS.indexOf(monthString);

// //   const nowIST =new Date();
// //   const year = nowIST.getFullYear();

// //   const startOfMonth = new Date(year, monthIndex, 1);
// //   startOfMonth.setHours(0, 0, 0, 0);

// //   const endOfMonth = new Date(year, monthIndex + 1, 0);
// //   endOfMonth.setHours(23, 59, 59, 999);

// //   return { startOfMonth, endOfMonth };
// // };


// /* ===========================
//    RECALCULATIONS
//    =========================== */

// // const recalculateNWDays = async (userId, monthString) => {
// //   const { startOfMonth, endOfMonth } = getMonthRange(monthString);

// //   const count = await NormalExpense.countDocuments({
// //     user: userId,
// //     workType: "NW",
// //     date: { $gte: startOfMonth, $lte: endOfMonth }
// //   });

// //   await Approval.updateOne(
// //     { user: userId, month: monthString },
// //     { $set: { NWdays: count } }
// //   );
// // };

// // const recalculateTRDays = async (userId, monthString) => {
// //   const { startOfMonth, endOfMonth } = getMonthRange(monthString);

// //   const uniqueDates = await NormalExpense.aggregate([
// //     {
// //       $match: {
// //         user: userId,
// //         date: { $gte: startOfMonth, $lte: endOfMonth }
// //       }
// //     },
// //     {
// //       $group: {
// //         _id: {
// //           $dateToString: { format: "%Y-%m-%d", date: "$date" }
// //         }
// //       }
// //     },
// //     {
// //       $count: "totalDays"
// //     }
// //   ]);

// //   const totalReportingDays = uniqueDates[0]?.totalDays || 0;

// //   await Approval.updateOne(
// //     { user: userId, month: monthString },
// //     { $set: { TR: totalReportingDays } }
// //   );
// // };

// // const recalculateNormalExpTotal = async (userId, monthString) => {
// //   const { startOfMonth, endOfMonth } = getMonthRange(monthString);

// //   const result = await NormalExpense.aggregate([
// //     {
// //       $match: {
// //         user: userId,
// //         date: { $gte: startOfMonth, $lte: endOfMonth }
// //       }
// //     },
// //     {
// //       $group: {
// //         _id: null,
// //         total: { $sum: "$total" }
// //       }
// //     }
// //   ]);

// //   const total = result[0]?.total || 0;

// //   await Approval.updateOne(
// //     { user: userId, month: monthString },
// //     { $set: { normalExpTotal: total } }
// //   );
// // };


// const recalculateNWDays = async (userId, monthString) => {
//   const count = await NormalExpense.countDocuments({
//     user: userId,
//     workType: "NW",
//     date: { $regex: `-${String(MONTHS.indexOf(monthString) + 1).padStart(2,"0")}-` }
//   });

//   await Approval.updateOne(
//     { user: userId, month: monthString },
//     { $set: { NWdays: count } }
//   );
// };

// const recalculateTRDays = async (userId, monthString) => {
//   const monthNumber = String(MONTHS.indexOf(monthString) + 1).padStart(2,"0");

//   const expenses = await NormalExpense.find({
//     user: userId,
//     date: { $regex: `-${monthNumber}-` }
//   });

//   const uniqueDates = new Set(expenses.map(e => e.date));

//   await Approval.updateOne(
//     { user: userId, month: monthString },
//     { $set: { TR: uniqueDates.size } }
//   );
// };


// // const recalculateTRDays = async (userId, monthString) => {
// //   const { startOfMonth, endOfMonth } = getMonthRange(monthString);

// //   const uniqueDates = await NormalExpense.aggregate([
// //     {
// //       $match: {
// //         user: new mongoose.Types.ObjectId(userId),
// //         date: { $gte: startOfMonth, $lte: endOfMonth }
// //       }
// //     },
// //     {
// //       $group: {
// //         _id: {
// //           $dateToString: { format: "%Y-%m-%d", date: "$date" }
// //         }
// //       }
// //     },
// //     { $count: "totalDays" }
// //   ]);

// //   const totalReportingDays = uniqueDates[0]?.totalDays || 0;

// //   await Approval.updateOne(
// //     { user: userId, month: monthString },
// //     { $set: { TR: totalReportingDays } }
// //   );
// // };

// const mongoose = require("mongoose");

// // const recalculateNormalExpTotal = async (userId, monthString) => {
// //   const { startOfMonth, endOfMonth } = getMonthRange(monthString);

// //   const result = await NormalExpense.aggregate([
// //     {
// //       $match: {
// //         user: new mongoose.Types.ObjectId(userId),
// //         date: { $gte: startOfMonth, $lte: endOfMonth }
// //       }
// //     },
// //     {
// //       $group: {
// //         _id: null,
// //         total: { $sum: "$total" }
// //       }
// //     }
// //   ]);

// //   const total = result[0]?.total || 0;

// //   await Approval.updateOne(
// //     { user: userId, month: monthString },
// //     { $set: { normalExpTotal: total } }
// //   );
// // };

// // const recalculateOtherExpTotal = async (userId, monthString) => {
// //   const { startOfMonth, endOfMonth } = getMonthRange(monthString);

// //   const result = await OtherExpense.aggregate([
// //     {
// //       $match: {
// //         user: userId,
// //         date: { $gte: startOfMonth, $lte: endOfMonth }
// //       }
// //     },
// //     {
// //       $group: {
// //         _id: null,
// //         total: { $sum: "$total" }
// //       }
// //     }
// //   ]);

// //   const total = result[0]?.total || 0;

// //   await Approval.updateOne(
// //     { user: userId, month: monthString },
// //     { $set: { otherExpTotal: total } }
// //   );
// // };


// const recalculateNormalExpTotal = async (userId, monthString) => {
//   const monthNumber = String(MONTHS.indexOf(monthString) + 1).padStart(2,"0");

//   const expenses = await NormalExpense.find({
//     user: userId,
//     date: { $regex: `-${monthNumber}-` }
//   });

//   const total = expenses.reduce((sum, e) => sum + e.total, 0);

//   await Approval.updateOne(
//     { user: userId, month: monthString },
//     { $set: { normalExpTotal: total } }
//   );
// };

// const recalculateOtherExpTotal = async (userId, monthString) => {
//   const monthNumber = String(MONTHS.indexOf(monthString) + 1).padStart(2,"0");

//   const expenses = await OtherExpense.find({
//     user: userId,
//     date: { $regex: `-${monthNumber}-` }
//   });

//   const total = expenses.reduce((sum, e) => sum + e.total, 0);

//   await Approval.updateOne(
//     { user: userId, month: monthString },
//     { $set: { otherExpTotal: total } }
//   );
// };


// // const recalculateOtherExpTotal = async (userId, monthString) => {
// //   const { startOfMonth, endOfMonth } = getMonthRange(monthString);

// //   const result = await OtherExpense.aggregate([
// //     {
// //       $match: {
// //         user: new mongoose.Types.ObjectId(userId),
// //         date: { $gte: startOfMonth, $lte: endOfMonth }
// //       }
// //     },
// //     {
// //       $group: {
// //         _id: null,
// //         total: { $sum: "$total" }
// //       }
// //     }
// //   ]);

// //   const total = result[0]?.total || 0;

// //   await Approval.updateOne(
// //     { user: userId, month: monthString },
// //     { $set: { otherExpTotal: total } }
// //   );
// // };


// // const getExpensesForDate = async (userId, dateObj) => {
// //   const start = new Date(dateObj);
// //   start.setHours(0, 0, 0, 0);

// //   const end = new Date(dateObj);
// //   end.setHours(23, 59, 59, 999);

// //   return await NormalExpense.find({
// //     user: userId,
// //     date: { $gte: start, $lte: end },
// //   });
// // };

// exports.recordFWLocation = async (req, res) => {
//   try {
//     const { lat, lon } = req.body;
//     const userId = req.user._id;

//     if (!lat || !lon) {
//       return res.status(400).json({
//         message: "Latitude and longitude required",
//       });
//     }

//     // 1️⃣ Fetch mapped cities for user
//     const mappedCities = await CityMap.find({ user: userId });

//     if (!mappedCities.length) {
//       return res.status(404).json({
//         message: "No mapped cities found for this user",
//       });
//     }

//     // 2️⃣ Check distance against each mapped city
//     for (const city of mappedCities) {
//       const dist = haversineDistance(
//         lat,
//         lon,
//         city.location.lat,
//         city.location.lon
//       );

//       if (dist <= city.radiusKm) {
//         return res.json({
//           matched: true,
//           city: city.city,
//           autoMOT: city.stationType === "HQ" ? "Local" : null,
//           message: "Location matched successfully",
//         });
//       }
//     }

//     // 3️⃣ No match
//     return res.json({
//       matched: false,
//       message: "Location outside mapped territories",
//     });

//   } catch (err) {
//   console.error("FW record location error:", err);
//   res.status(500).json({ 
//     message: "Server error",
//     error: err.message
//   });
// }
// };



// exports.previewFWExpense = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { placeOfWork, MOT } = req.body;

//     if (!placeOfWork || !MOT) {
//       return res.status(400).json({ message: "Place and MOT required" });
//     }

//     // const today =new Date();
//     const today = getTodayString();


//     const result = await calculateFWExpense(userId, placeOfWork, MOT);

//     res.json({
//       placeOfWork,
//       MOT,
//       date: formatDate(today),
//       time: formatTime(),
//       ...result,
//     });

//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


// exports.createFWExpense = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { placeOfWork, MOT } = req.body;

//     if (!placeOfWork || !MOT) {
//       return res.status(400).json({ message: "Place and MOT required" });
//     }

//     await ensureMonthlyApprovals();
//     const currentMonth = getCurrentMonth();

//     const approval = await Approval.findOne({
//       user: userId,
//       month: currentMonth,
//     });

//     if (approval?.approvedByUser) {
//       return res.status(400).json({
//         message: "This month is already approved. You cannot submit expenses.",
//       });
//     }

// //     const today = new Date(
// //   new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
// // );
// const today = getTodayString();


//     // const existing = await checkAlreadySubmittedToday(userId, today);
//     // if (existing) {
//     //   return res.status(400).json({
//     //     message: "You have already submitted an entry for today",
//     //   });
//     // }

//     // const todayExpenses = await getExpensesForDate(userId, today);

//     const todayExpenses = await NormalExpense.find({
//   user: userId,
//   date: today
// });

// // ❌ If NW already exists → block
// if (todayExpenses.some(e => e.workType === "NW")) {
//   return res.status(400).json({
//     message: "Cannot add FW. NW already marked for this date.",
//   });
// }

// // ❌ If FW already exists → block
// if (todayExpenses.some(e => e.workType === "FW")) {
//   return res.status(400).json({
//     message: "FW already submitted for this date.",
//   });
// }

//     const calc = await calculateFWExpense(userId, placeOfWork, MOT);

//     const expense = await NormalExpense.create({
//       user: userId,
//       date: today,
//       time: formatTime(),
//       placeOfWork: placeOfWork.trim(),
//       station: calc.station,
//       kms: calc.kms,
//       MOT,
//       TA: calc.TA,
//       DA: calc.DA,
//       ExtraTA: 0,
//       ExtraDA: 0,
//       taDesc: "",
//       daDesc: "",
//       workType: "FW",
//       total: calc.total,
//     });

//     const lastUpdate = await Approval.updateOne(
//   { user: userId, month: currentMonth },
//   {
//     $set: { lastReported: formatDate() },
//   }
// );

// console.log("LastReported update result:", lastUpdate);

    

// //    await Approval.updateOne(
// //   { user: userId, month: currentMonth },
// //   {
// //     $set: { lastReported: formatDate() },
// //   }
// // );


//     res.status(201).json({
//       message: "FW Expense created successfully",
//       expense,
//       displayDate: today,
//     });
//     const expenseMonth = getMonthFromStringDate(today);

// console.log("FW Created for user:", userId);
// console.log("Expense Month:", expenseMonth);

// await recalculateNormalExpTotal(userId, expenseMonth);
// await recalculateTRDays(userId, expenseMonth);
// //     const expenseMonth = getMonthFromStringDate(today);

// // await recalculateNormalExpTotal(userId, expenseMonth);

//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


// exports.createNFWExpense = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { placeOfWork, station, kms, MOT, TA, DA } = req.body;

//     if (!placeOfWork || !station || kms == null || !MOT || TA == null || DA == null) {
//       return res.status(400).json({
//         message: "All required fields must be provided",
//       });
//     }

//     await ensureMonthlyApprovals();
//     const currentMonth = getCurrentMonth();

//     const approval = await Approval.findOne({
//       user: userId,
//       month: currentMonth,
//     });

//     if (approval?.approvedByUser) {
//       return res.status(400).json({
//         message: "This month is already approved. You cannot submit expenses.",
//       });
//     }

// // const today =new Date(
// //   new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
// // );

// const today = getTodayString();

//     // const existing = await checkAlreadySubmittedToday(userId, today);
//     // if (existing) {
//     //   return res.status(400).json({
//     //     message: "You have already submitted an entry for today",
//     //   });
//     // }

//     // const todayExpenses = await getExpensesForDate(userId, today);
//     const todayExpenses = await NormalExpense.find({
//   user: userId,
//   date: today
// });

// // ❌ If NW already exists → block
// if (todayExpenses.some(e => e.workType === "NW")) {
//   return res.status(400).json({
//     message: "Cannot add NFW. NW already marked for this date.",
//   });
// }

// // ❌ If NFW already exists → block
// if (todayExpenses.some(e => e.workType === "NFW")) {
//   return res.status(400).json({
//     message: "NFW already submitted for this date.",
//   });
// }

//     const total = Number(TA) + Number(DA);

//     const expense = await NormalExpense.create({
//       user: userId,
//       date: today,
//       time: formatTime(),
//       placeOfWork: placeOfWork.trim(),
//       station,
//       kms: Number(kms),
//       MOT,
//       TA: Number(TA),
//       DA: Number(DA),
//       ExtraTA: 0,
//       ExtraDA: 0,
//       taDesc: "",
//       daDesc: "",
//       workType: "NFW",
//       total,
//     });

// const expenseMonth = getMonthFromStringDate(today);

// await recalculateNormalExpTotal(userId, expenseMonth);
// await recalculateTRDays(userId, expenseMonth);
// await Approval.updateOne(
//   { user: userId, month: currentMonth },
//   { $set: { lastReported: formatDate() } }
// );


//     res.status(201).json({
//       message: "NFW Expense created successfully",
//       expense,
//       displayDate: formatDate(),
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// exports.createNWExpense = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { date, placeOfWork } = req.body;

//     if (!date || !placeOfWork) {
//       return res.status(400).json({
//         message: "Date and placeOfWork are required",
//       });
//     }

// //     // const parsedDate = new Date(date);
// //     const [year, month, day] = date.split("-");
// // const parsedDate = new Date(year, month - 1, day);

//     const [year, month, day] = date.split("-");
// const parsedDate = `${day}-${month}-${year}`; // dd-mm-yyyy

//     if (isNaN(parsedDate.getTime())) {
//       return res.status(400).json({
//         message: "Invalid date format",
//       });
//     }

//     // Normalize both dates
// // const today = new Date(
// //   new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
// // );

// const today = getTodayString();

// today.setHours(0, 0, 0, 0);
// parsedDate.setHours(0, 0, 0, 0);

// // ❌ Block future dates
// if (parsedDate > today) {
//   return res.status(400).json({
//     message: "Future dates are not allowed",
//   });
// }

// // ✅ Allow only current or previous month
// const currentMonthIndex = today.getMonth();
// const currentYear = today.getFullYear();

// const expenseMonthIndex = parsedDate.getMonth();
// const expenseYear = parsedDate.getFullYear();

// const isCurrentMonth =
//   expenseMonthIndex === currentMonthIndex &&
//   expenseYear === currentYear;

// const isPreviousMonth =
//   (
//     expenseYear === currentYear &&
//     expenseMonthIndex === currentMonthIndex - 1
//   ) ||
//   (
//     currentMonthIndex === 0 && // January case
//     expenseMonthIndex === 11 &&
//     expenseYear === currentYear - 1
//   );

// if (!isCurrentMonth && !isPreviousMonth) {
//   return res.status(400).json({
//     message: "You can only submit for current or previous month",
//   });
// }

//     await ensureMonthlyApprovals();

//     // ✅ Get month from selected date (NOT current month)
//     const expenseMonth = getMonthFromDate(parsedDate);

//     const approval = await Approval.findOne({
//       user: userId,
//       month: expenseMonth,
//     });

//     if (approval?.approvedByUser) {
//       return res.status(400).json({
//         message: "This month is already approved. You cannot submit expenses.",
//       });
//     }

//     // const existing = await checkAlreadySubmittedToday(userId, parsedDate);
//     // if (existing) {
//     //   return res.status(400).json({
//     //     message: "You have already submitted an entry for this date",
//     //   });
//     // }

//     // const todayExpenses = await getExpensesForDate(userId, parsedDate);
//     const todayExpenses = await NormalExpense.find({
//   user: userId,
//   date: today
// });


// // ❌ If ANY expense exists → block
// if (todayExpenses.length > 0) {
//   return res.status(400).json({
//     message: "Cannot mark NW. Expense already exists for this date.",
//   });
// }

//     const expense = await NormalExpense.create({
//       user: userId,
//       date: parsedDate,
//       time: "-",
//       placeOfWork: placeOfWork.trim(),
//       station: "-",
//       kms: 0,
//       MOT: "-",
//       TA: 0,
//       DA: 0,
//       ExtraTA: 0,
//       ExtraDA: 0,
//       taDesc: "",
//       daDesc: "",
//       workType: "NW",
//       total: 0,
//     });

//     // ✅ Increment NWdays
//     await recalculateNWDays(userId, expenseMonth);
//     await recalculateNormalExpTotal(userId, expenseMonth);
// await recalculateTRDays(userId, expenseMonth);
// await Approval.updateOne(
//   { user: userId, month: expenseMonth },
//   {
//     $set: { lastReported: formatDate() },
//   }
// );

//     res.status(201).json({
//       message: "NW entry created successfully",
//       expense,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };


// // exports.createNWExpense = async (req, res) => {
// //   try {
// //     const userId = req.user.id;
// //     const { date, placeOfWork } = req.body;

// //     if (!date || !placeOfWork) {
// //       return res.status(400).json({
// //         message: "Date and placeOfWork are required",
// //       });
// //     }

// //     const parsedDate = new Date(date);

// //     if (isNaN(parsedDate.getTime())) {
// //       return res.status(400).json({
// //         message: "Invalid date format",
// //       });
// //     }

// //     await ensureMonthlyApprovals();
// //     const currentMonth = getCurrentMonth();

// //     const approval = await Approval.findOne({
// //       user: userId,
// //       month: currentMonth,
// //     });

// //     if (approval?.approvedByUser) {
// //       return res.status(400).json({
// //         message: "This month is already approved. You cannot submit expenses.",
// //       });
// //     }

// //     const existing = await checkAlreadySubmittedToday(userId, parsedDate);
// //     if (existing) {
// //       return res.status(400).json({
// //         message: "You have already submitted an entry for this date",
// //       });
// //     }

// //     const expense = await NormalExpense.create({
// //       user: userId,
// //       date: parsedDate,
// //       time: "-",
// //       placeOfWork: placeOfWork.trim(),
// //       station: "-",
// //       kms: 0,
// //       MOT: "-",
// //       TA: 0,
// //       DA: 0,
// //       ExtraTA: 0,
// //       ExtraDA: 0,
// //       taDesc: "",
// //       daDesc: "",
// //       workType: "NW",
// //       total: 0,
// //     });

// //     await Approval.updateOne(
// //       { user: userId, month: currentMonth },
// //       {
// //         $set: { lastReported: formatDate() },
// //       }
// //     );

// //     res.status(201).json({
// //       message: "NW entry created successfully",
// //       expense,
// //     });

// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Server Error" });
// //   }
// // };


// exports.createOtherExpense = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { date, amount, description, billNo } = req.body;


//     if (!date || amount == null || !description) {
//       return res.status(400).json({
//         message: "Date, amount and description are required",
//       });
//     }

//     const parsedDate = new Date(date);

//     if (isNaN(parsedDate.getTime())) {
//       return res.status(400).json({
//         message: "Invalid date format",
//       });
//     }

// //     // Normalize both dates
// // const today = new Date(
// //   new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
// // );


// const today = getTodayString();


// today.setHours(0, 0, 0, 0);
// parsedDate.setHours(0, 0, 0, 0);

// // ❌ Block future dates
// if (parsedDate > today) {
//   return res.status(400).json({
//     message: "Future dates are not allowed",
//   });
// }

// // ✅ Allow only current or previous month
// const currentMonthIndex = today.getMonth();
// const currentYear = today.getFullYear();

// const expenseMonthIndex = parsedDate.getMonth();
// const expenseYear = parsedDate.getFullYear();

// const isCurrentMonth =
//   expenseMonthIndex === currentMonthIndex &&
//   expenseYear === currentYear;

// const isPreviousMonth =
//   (
//     expenseYear === currentYear &&
//     expenseMonthIndex === currentMonthIndex - 1
//   ) ||
//   (
//     currentMonthIndex === 0 && // January case
//     expenseMonthIndex === 11 &&
//     expenseYear === currentYear - 1
//   );

// if (!isCurrentMonth && !isPreviousMonth) {
//   return res.status(400).json({
//     message: "You can only submit for current or previous month",
//   });
// }

//     await ensureMonthlyApprovals();
// const expenseMonth = getMonthFromDate(parsedDate);
//     const approval = await Approval.findOne({
//       user: userId,
//       month: expenseMonth,
//     });

//     if (approval?.approvedByUser) {
//       return res.status(400).json({
//         message: "This month is already approved. You cannot submit expenses.",
//       });
//     }

//     const mainAmount = Number(amount);

//     if (isNaN(mainAmount) || mainAmount <= 0) {
//       return res.status(400).json({
//         message: "Amount must be a valid number greater than 0",
//       });
//     }

//     const total = mainAmount;

//     const expense = await OtherExpense.create({
//       user: userId,
//       date: parsedDate,
//       amount: mainAmount,
//       description: description.trim(),
//       billNo: billNo || "",
//       extraAmount: 0,
//       extraDescription: "",
//       total,
//     });

//     await recalculateOtherExpTotal(userId, expenseMonth);
// await recalculateTRDays(userId, expenseMonth);
// await Approval.updateOne(
//   { user: userId, month: expenseMonth },
//   { $set: { lastReported: formatDate() } }
// );



//     res.status(201).json({
//       message: "Other expense added successfully",
//       expense,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };














const NormalExpense = require("../models/NormalExpense");
const SRC = require("../models/SRC");
const SRCConfig = require("../models/SRCConfig");
const calculateFWExpense = require("../utils/fwCalculator");
const haversineDistance = require("../utils/haversineDistance");
const CityMap = require("../models/CityMap");
const OtherExpense = require("../models/OtherExpense");
const Approval = require("../models/Approval");
const { ensureMonthlyApprovals } = require("./approvalController");

const MONTHS = [
  "JAN","FEB","MAR","APR","MAY","JUN",
  "JUL","AUG","SEP","OCT","NOV","DEC"
];

const IST = "Asia/Kolkata";

/* ===========================
   DATE HELPERS (STRING BASED)
   =========================== */

const getTodayString = () => {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: IST })
  );

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  return `${day}-${month}-${year}`;
};

const parseDateString = (dateStr) => {
  const [day, month, year] = dateStr.split("-");
  return new Date(year, month - 1, day);
};

const getMonthFromStringDate = (dateStr) => {
  const [, month] = dateStr.split("-");
  return MONTHS[Number(month) - 1];
};

const getMonthYearRegex = (monthString, year) => {
  const monthNumber = String(
    MONTHS.indexOf(monthString) + 1
  ).padStart(2, "0");

  return new RegExp(`-${monthNumber}-${year}$`);
};

const formatTime = () => {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: IST })
  );
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const getCurrentMonth = () => {
  const todayObj = parseDateString(getTodayString());
  return MONTHS[todayObj.getMonth()];
};

/* ===========================
   RECALCULATIONS
   =========================== */

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

/* ===========================
   FW LOCATION
   =========================== */

exports.recordFWLocation = async (req, res) => {
  try {
    const { lat, lon } = req.body;
    const userId = req.user._id;

    if (!lat || !lon) {
      return res.status(400).json({
        message: "Latitude and longitude required",
      });
    }

    const mappedCities = await CityMap.find({ user: userId });

    if (!mappedCities.length) {
      return res.status(404).json({
        message: "No mapped cities found for this user",
      });
    }

    for (const city of mappedCities) {
      const dist = haversineDistance(
        lat,
        lon,
        city.location.lat,
        city.location.lon
      );

      if (dist <= city.radiusKm) {
        return res.json({
          matched: true,
          city: city.city,
          autoMOT: city.stationType === "HQ" ? "Local" : null,
          message: "Location matched successfully",
        });
      }
    }

    return res.json({
      matched: false,
      message: "Location outside mapped territories",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===========================
   PREVIEW FW
   =========================== */

exports.previewFWExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { placeOfWork, MOT } = req.body;

    if (!placeOfWork || !MOT) {
      return res.status(400).json({ message: "Place and MOT required" });
    }

    const today = getTodayString();
    const result = await calculateFWExpense(userId, placeOfWork, MOT);

    res.json({
      placeOfWork,
      MOT,
      date: today,
      time: formatTime(),
      ...result,
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ===========================
   CREATE FW
   =========================== */

exports.createFWExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { placeOfWork, MOT } = req.body;

    if (!placeOfWork || !MOT) {
      return res.status(400).json({ message: "Place and MOT required" });
    }

    await ensureMonthlyApprovals();

    const today = getTodayString();
    const todayObj = parseDateString(today);
    const year = todayObj.getFullYear();
    const currentMonth = getMonthFromStringDate(today);

    const approval = await Approval.findOne({
      user: userId,
      month: currentMonth,
    });

    if (approval?.approvedByUser) {
      return res.status(400).json({
        message: "This month is already approved.",
      });
    }

    const todayExpenses = await NormalExpense.find({
      user: userId,
      date: today
    });

    if (todayExpenses.some(e => e.workType === "NW"))
      return res.status(400).json({ message: "NW already marked." });

    if (todayExpenses.some(e => e.workType === "FW"))
      return res.status(400).json({ message: "FW already submitted." });

    const calc = await calculateFWExpense(userId, placeOfWork, MOT);

    const expense = await NormalExpense.create({
      user: userId,
      date: today,
      time: formatTime(),
      placeOfWork: placeOfWork.trim(),
      station: calc.station,
      kms: calc.kms,
      MOT,
      TA: calc.TA,
      DA: calc.DA,
      ExtraTA: 0,
      ExtraDA: 0,
      taDesc: "",
      daDesc: "",
      workType: "FW",
      total: calc.total,
    });

    await Approval.updateOne(
      { user: userId, month: currentMonth },
      { $set: { lastReported: today } }
    );

    await recalculateNormalExpTotal(userId, currentMonth, year);
    await recalculateTRDays(userId, currentMonth, year);

    res.status(201).json({
      message: "FW Expense created successfully",
      expense,
      displayDate: today,
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createNFWExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { placeOfWork, station, kms, MOT, TA, DA } = req.body;

    if (!placeOfWork || !station || kms == null || !MOT || TA == null || DA == null) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    await ensureMonthlyApprovals();

    const today = getTodayString();
    const todayObj = parseDateString(today);
    const year = todayObj.getFullYear();
    const currentMonth = getMonthFromStringDate(today);

    const approval = await Approval.findOne({
      user: userId,
      month: currentMonth,
    });

    if (approval?.approvedByUser) {
      return res.status(400).json({
        message: "This month is already approved.",
      });
    }

    const todayExpenses = await NormalExpense.find({
      user: userId,
      date: today
    });

    if (todayExpenses.some(e => e.workType === "NW"))
      return res.status(400).json({ message: "NW already marked." });

    if (todayExpenses.some(e => e.workType === "NFW"))
      return res.status(400).json({ message: "NFW already submitted." });

    const total = Number(TA) + Number(DA);

    const expense = await NormalExpense.create({
      user: userId,
      date: today,
      time: formatTime(),
      placeOfWork: placeOfWork.trim(),
      station,
      kms: Number(kms),
      MOT,
      TA: Number(TA),
      DA: Number(DA),
      ExtraTA: 0,
      ExtraDA: 0,
      taDesc: "",
      daDesc: "",
      workType: "NFW",
      total,
    });

    await Approval.updateOne(
      { user: userId, month: currentMonth },
      { $set: { lastReported: today } }
    );

    await recalculateNormalExpTotal(userId, currentMonth, year);
    await recalculateTRDays(userId, currentMonth, year);

    res.status(201).json({
      message: "NFW Expense created successfully",
      expense,
      displayDate: today,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createNWExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, placeOfWork } = req.body;

    if (!date || !placeOfWork) {
      return res.status(400).json({
        message: "Date and placeOfWork are required",
      });
    }

    // Convert yyyy-mm-dd → dd-mm-yyyy
    const parsedDate = date;
    const parsedDateObj = parseDateString(parsedDate);
    if (isNaN(parsedDateObj.getTime())) {
      return res.status(400).json({
        message: "Invalid date format",
      });
    }

    const todayStr = getTodayString();
    const todayObj = parseDateString(todayStr);

    if (parsedDateObj > todayObj) {
      return res.status(400).json({
        message: "Future dates are not allowed",
      });
    }

    const currentMonthIndex = todayObj.getMonth();
    const currentYear = todayObj.getFullYear();

    const expenseMonthIndex = parsedDateObj.getMonth();
    const expenseYear = parsedDateObj.getFullYear();

    const isCurrentMonth =
      expenseMonthIndex === currentMonthIndex &&
      expenseYear === currentYear;

    const isPreviousMonth =
      (
        expenseYear === currentYear &&
        expenseMonthIndex === currentMonthIndex - 1
      ) ||
      (
        currentMonthIndex === 0 &&
        expenseMonthIndex === 11 &&
        expenseYear === currentYear - 1
      );

    if (!isCurrentMonth && !isPreviousMonth) {
      return res.status(400).json({
        message: "You can only submit for current or previous month",
      });
    }

    await ensureMonthlyApprovals();

    const expenseMonth = getMonthFromStringDate(parsedDate);

    const approval = await Approval.findOne({
      user: userId,
      month: expenseMonth,
    });

    if (approval?.approvedByUser) {
      return res.status(400).json({
        message: "This month is already approved.",
      });
    }

    const existingExpenses = await NormalExpense.find({
      user: userId,
      date: parsedDate
    });

    if (existingExpenses.length > 0) {
      return res.status(400).json({
        message: "Expense already exists for this date.",
      });
    }

    const expense = await NormalExpense.create({
      user: userId,
      date: parsedDate,
      time: "-",
      placeOfWork: placeOfWork.trim(),
      station: "-",
      kms: 0,
      MOT: "-",
      TA: 0,
      DA: 0,
      ExtraTA: 0,
      ExtraDA: 0,
      taDesc: "",
      daDesc: "",
      workType: "NW",
      total: 0,
    });

    const year = parsedDateObj.getFullYear();

    await recalculateNWDays(userId, expenseMonth, year);
    await recalculateNormalExpTotal(userId, expenseMonth, year);
    await recalculateTRDays(userId, expenseMonth, year);

    await Approval.updateOne(
      { user: userId, month: expenseMonth },
      { $set: { lastReported: parsedDate } }
    );

    res.status(201).json({
      message: "NW entry created successfully",
      expense,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createOtherExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, amount, description, billNo } = req.body;

    if (!date || amount == null || !description) {
      return res.status(400).json({
        message: "Date, amount and description are required",
      });
    }

    // yyyy-mm-dd → dd-mm-yyyy
    const parsedDate = date;
    const parsedDateObj = parseDateString(parsedDate);
    if (isNaN(parsedDateObj.getTime())) {
      return res.status(400).json({
        message: "Invalid date format",
      });
    }

    const todayStr = getTodayString();
    const todayObj = parseDateString(todayStr);

    if (parsedDateObj > todayObj) {
      return res.status(400).json({
        message: "Future dates are not allowed",
      });
    }

    await ensureMonthlyApprovals();

    const expenseMonth = getMonthFromStringDate(parsedDate);
    const year = parsedDateObj.getFullYear();

    const approval = await Approval.findOne({
      user: userId,
      month: expenseMonth,
    });

    if (approval?.approvedByUser) {
      return res.status(400).json({
        message: "This month is already approved.",
      });
    }

    const mainAmount = Number(amount);

    if (isNaN(mainAmount) || mainAmount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    const expense = await OtherExpense.create({
      user: userId,
      date: parsedDate,
      amount: mainAmount,
      description: description.trim(),
      billNo: billNo || "",
      extraAmount: 0,
      extraDescription: "",
      total: mainAmount,
    });

    await recalculateOtherExpTotal(userId, expenseMonth, year);
    await recalculateTRDays(userId, expenseMonth, year);

    await Approval.updateOne(
      { user: userId, month: expenseMonth },
      { $set: { lastReported: parsedDate } }
    );

    res.status(201).json({
      message: "Other expense added successfully",
      expense,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
