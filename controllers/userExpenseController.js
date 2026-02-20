// const NormalExpense = require("../models/NormalExpense");
// const SRC = require("../models/SRC");
// const SRCConfig = require("../models/SRCConfig");
// const calculateFWExpense = require("../utils/fwCalculator");
// const haversineDistance = require("../utils/haversineDistance");
// const CityMap = require("../models/CityMap");
// const OtherExpense = require("../models/OtherExpense");

// // Helpers
// const formatDate = () => {
//   const now = new Date();
//   const day = String(now.getDate()).padStart(2, "0");
//   const month = String(now.getMonth() + 1).padStart(2, "0");
//   const year = String(now.getFullYear()).slice(-2);
//   return `${day}/${month}/${year}`;
// };

// const formatTime = () => {
//   const now = new Date();
//   const hours = String(now.getHours()).padStart(2, "0");
//   const minutes = String(now.getMinutes()).padStart(2, "0");
//   return `${hours}:${minutes}`;
// };

// const checkAlreadySubmittedToday = async (userId, dateObj) => {
//   const start = new Date(dateObj);
//   start.setHours(0, 0, 0, 0);

//   const end = new Date(dateObj);
//   end.setHours(23, 59, 59, 999);

//   const existing = await NormalExpense.findOne({
//     user: userId,
//     date: { $gte: start, $lte: end },
//   });

//   return existing;
// };


// /* =========================
//    FW CONTROLLER
// ========================= */
// // POST /api/fw/record-location
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
//     console.error("FW record location error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };



// exports.previewFWExpense = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { placeOfWork, MOT } = req.body;

//     if (!placeOfWork || !MOT) {
//       return res.status(400).json({ message: "Place and MOT required" });
//     }

//     const today = new Date();

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

//     const today = new Date();

//     const existing = await checkAlreadySubmittedToday(userId, today);
//     if (existing) {
//       return res.status(400).json({
//         message: "You have already submitted an entry for today",
//       });
//     }

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

//     res.status(201).json({
//       message: "FW Expense created successfully",
//       expense,
//       displayDate: formatDate(today),
//     });

//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };



// /* =========================
//    NFW CONTROLLER
// ========================= */
// exports.createNFWExpense = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const {
//       placeOfWork,
//       station,
//       kms,
//       MOT,
//       TA,
//       DA,
//     } = req.body;

//     if (!placeOfWork || !station || kms == null || !MOT || TA == null || DA == null) {
//       return res.status(400).json({
//         message: "All required fields must be provided",
//       });
//     }

//     const today = new Date();

//     const existing = await checkAlreadySubmittedToday(userId, today);
//     if (existing) {
//       return res.status(400).json({
//         message: "You have already submitted an entry for today",
//       });
//     }

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

// /* =========================
//    NW CONTROLLER
// ========================= */
// exports.createNWExpense = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { date, placeOfWork } = req.body;

//     if (!date || !placeOfWork) {
//       return res.status(400).json({
//         message: "Date and placeOfWork are required",
//       });
//     }

//     const parsedDate = new Date(date);

//     if (isNaN(parsedDate.getTime())) {
//       return res.status(400).json({
//         message: "Invalid date format",
//       });
//     }

//     // ===== DATE LIMIT LOGIC =====
//     const today = new Date();

//     // Start of current month
//     const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

//     // Start of previous month
//     const startOfPreviousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

//     // End of current month (last day, 23:59:59)
//     const endOfCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//     endOfCurrentMonth.setHours(23, 59, 59, 999);

//     if (parsedDate > today) {
//       return res.status(400).json({
//         message: "Future dates are not allowed",
//       });
//     }

//     if (parsedDate < startOfPreviousMonth || parsedDate > endOfCurrentMonth) {
//       return res.status(400).json({
//         message: "You can only submit entries for previous month and current month",
//       });
//     }

//     const existing = await checkAlreadySubmittedToday(userId, parsedDate);
//     if (existing) {
//       return res.status(400).json({
//         message: "You have already submitted an entry for this date",
//       });
//     }

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

//     res.status(201).json({
//       message: "NW entry created successfully",
//       expense,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };
// /* =========================
//    OTHER EXPENSE CONTROLLER
// ========================= */
// exports.createOtherExpense = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const { date, amount, description, billNo } = req.body;

//     // ===== REQUIRED VALIDATION =====
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

//     // ===== DATE LOCK LOGIC =====
//     const today = new Date();

//     const startOfPreviousMonth = new Date(
//       today.getFullYear(),
//       today.getMonth() - 1,
//       1
//     );

//     const endOfCurrentMonth = new Date(
//       today.getFullYear(),
//       today.getMonth() + 1,
//       0
//     );
//     endOfCurrentMonth.setHours(23, 59, 59, 999);

//     // ❌ No future date
//     if (parsedDate > today) {
//       return res.status(400).json({
//         message: "Future dates are not allowed",
//       });
//     }

//     // ❌ Only prev + current month allowed
//     if (
//       parsedDate < startOfPreviousMonth ||
//       parsedDate > endOfCurrentMonth
//     ) {
//       return res.status(400).json({
//         message:
//           "You can only add expenses for previous or current month",
//       });
//     }

//     const mainAmount = Number(amount);

//     if (isNaN(mainAmount) || mainAmount <= 0) {
//       return res.status(400).json({
//         message: "Amount must be a valid number greater than 0",
//       });
//     }

//     const total = mainAmount; // extraAmount = 0

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

// Month helper
const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

const getMonthFromDate = (dateObj) => {
  return MONTHS[dateObj.getMonth()];
};


const getCurrentMonth = () => {
  const now = new Date();
  return MONTHS[now.getMonth()];
};




// Helpers
const formatDate = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

const recalculateNWDays = async (userId, monthString) => {
  const monthIndex = MONTHS.indexOf(monthString);

  const now = new Date();
  const year = now.getFullYear(); // assuming same year system

  const startOfMonth = new Date(year, monthIndex, 1);
  const endOfMonth = new Date(year, monthIndex + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);

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


const formatTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const checkAlreadySubmittedToday = async (userId, dateObj) => {
  const start = new Date(dateObj);
  start.setHours(0, 0, 0, 0);

  const end = new Date(dateObj);
  end.setHours(23, 59, 59, 999);

  return await NormalExpense.findOne({
    user: userId,
    date: { $gte: start, $lte: end },
  });
};


exports.recordFWLocation = async (req, res) => {
  try {
    const { lat, lon } = req.body;
    const userId = req.user._id;

    if (!lat || !lon) {
      return res.status(400).json({
        message: "Latitude and longitude required",
      });
    }

    // 1️⃣ Fetch mapped cities for user
    const mappedCities = await CityMap.find({ user: userId });

    if (!mappedCities.length) {
      return res.status(404).json({
        message: "No mapped cities found for this user",
      });
    }

    // 2️⃣ Check distance against each mapped city
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

    // 3️⃣ No match
    return res.json({
      matched: false,
      message: "Location outside mapped territories",
    });

  } catch (err) {
    console.error("FW record location error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.previewFWExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { placeOfWork, MOT } = req.body;

    if (!placeOfWork || !MOT) {
      return res.status(400).json({ message: "Place and MOT required" });
    }

    const today = new Date();

    const result = await calculateFWExpense(userId, placeOfWork, MOT);

    res.json({
      placeOfWork,
      MOT,
      date: formatDate(today),
      time: formatTime(),
      ...result,
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.createFWExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { placeOfWork, MOT } = req.body;

    if (!placeOfWork || !MOT) {
      return res.status(400).json({ message: "Place and MOT required" });
    }

    await ensureMonthlyApprovals();
    const currentMonth = getCurrentMonth();

    const approval = await Approval.findOne({
      user: userId,
      month: currentMonth,
    });

    if (approval?.approvedByUser) {
      return res.status(400).json({
        message: "This month is already approved. You cannot submit expenses.",
      });
    }

    const today = new Date();

    const existing = await checkAlreadySubmittedToday(userId, today);
    if (existing) {
      return res.status(400).json({
        message: "You have already submitted an entry for today",
      });
    }

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
  {
    $set: { lastReported: formatDate() },
  }
);


    res.status(201).json({
      message: "FW Expense created successfully",
      expense,
      displayDate: formatDate(today),
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
    const currentMonth = getCurrentMonth();

    const approval = await Approval.findOne({
      user: userId,
      month: currentMonth,
    });

    if (approval?.approvedByUser) {
      return res.status(400).json({
        message: "This month is already approved. You cannot submit expenses.",
      });
    }

    const today = new Date();

    const existing = await checkAlreadySubmittedToday(userId, today);
    if (existing) {
      return res.status(400).json({
        message: "You have already submitted an entry for today",
      });
    }

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
  {
    $inc: { normalExpTotal: total },
    $set: { lastReported: formatDate() },
  }
);


    res.status(201).json({
      message: "NFW Expense created successfully",
      expense,
      displayDate: formatDate(),
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

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date format",
      });
    }

    await ensureMonthlyApprovals();

    // ✅ Get month from selected date (NOT current month)
    const expenseMonth = getMonthFromDate(parsedDate);

    const approval = await Approval.findOne({
      user: userId,
      month: expenseMonth,
    });

    if (approval?.approvedByUser) {
      return res.status(400).json({
        message: "This month is already approved. You cannot submit expenses.",
      });
    }

    const existing = await checkAlreadySubmittedToday(userId, parsedDate);
    if (existing) {
      return res.status(400).json({
        message: "You have already submitted an entry for this date",
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

    // ✅ Increment NWdays
    await recalculateNWDays(userId, expenseMonth);

await Approval.updateOne(
  { user: userId, month: expenseMonth },
  {
    $set: { lastReported: formatDate() },
  }
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


// exports.createNWExpense = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { date, placeOfWork } = req.body;

//     if (!date || !placeOfWork) {
//       return res.status(400).json({
//         message: "Date and placeOfWork are required",
//       });
//     }

//     const parsedDate = new Date(date);

//     if (isNaN(parsedDate.getTime())) {
//       return res.status(400).json({
//         message: "Invalid date format",
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

//     const existing = await checkAlreadySubmittedToday(userId, parsedDate);
//     if (existing) {
//       return res.status(400).json({
//         message: "You have already submitted an entry for this date",
//       });
//     }

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

//     await Approval.updateOne(
//       { user: userId, month: currentMonth },
//       {
//         $set: { lastReported: formatDate() },
//       }
//     );

//     res.status(201).json({
//       message: "NW entry created successfully",
//       expense,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };


exports.createOtherExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, amount, description, billNo } = req.body;

    if (!date || amount == null || !description) {
      return res.status(400).json({
        message: "Date, amount and description are required",
      });
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date format",
      });
    }

    await ensureMonthlyApprovals();
    const currentMonth = getCurrentMonth();

    const approval = await Approval.findOne({
      user: userId,
      month: currentMonth,
    });

    if (approval?.approvedByUser) {
      return res.status(400).json({
        message: "This month is already approved. You cannot submit expenses.",
      });
    }

    const mainAmount = Number(amount);

    if (isNaN(mainAmount) || mainAmount <= 0) {
      return res.status(400).json({
        message: "Amount must be a valid number greater than 0",
      });
    }

    const total = mainAmount;

    const expense = await OtherExpense.create({
      user: userId,
      date: parsedDate,
      amount: mainAmount,
      description: description.trim(),
      billNo: billNo || "",
      extraAmount: 0,
      extraDescription: "",
      total,
    });

    const expenseMonth = getMonthFromDate(parsedDate);

await Approval.updateOne(
  { user: userId, month: expenseMonth },
  {
    $set: { lastReported: formatDate() },
  }
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






