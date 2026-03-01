// const SRC = require("../models/SRC");
// const SRCConfig = require("../models/SRCConfig");
// const User = require("../models/User");

// /* =========================
//    GET USER HQ
// ========================= */
// exports.getUserHQ = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const hq = await SRC.findOne({
//       user: userId,
//       station: "HQ",
//     });

//     if (!hq) {
//       return res.json({ placeOfWork: "-" });
//     }

//     res.json({
//       placeOfWork: hq.placeOfWork,
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// /* =========================
//    GET USER SRCS
// ========================= */
// exports.getUserSRCs = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const srcs = await SRC.find({ user: userId })
//       .sort({ station: 1, placeOfWork: 1 });

//     res.json(srcs);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



// exports.createSRC = async (req, res) => {
//   try {
//     const {
//       user,
//       placeOfWork,
//       station,
//       radius,
//       kms,
//       MOT,
//       RsPerKm,
//       DA,
//     } = req.body;

//     if (!user || !placeOfWork || !station || radius == null || kms == null || !MOT) {
//       return res.status(400).json({
//         message: "All required fields must be provided",
//       });
//     }

//     const normalizedPlace = placeOfWork.trim();

//     const userConfig = await SRCConfig.findOne({ user });

//     if (!userConfig) {
//       return res.status(400).json({
//         message: "SRC configuration not set for this user",
//       });
//     }

//     // 🔹 Create for original user
//     const baseSRC = await createSRCForUser(
//       user,                 // userId (owner)
//       user,                 // originUser (important 🔥)
//       normalizedPlace,
//       station,
//       radius,
//       kms,
//       MOT,
//       RsPerKm,
//       DA,
//       userConfig,
//       false
//     );

//     // 🔥 Propagate upward
//     let currentUser = await User.findById(user).select("superior");
//     const visited = new Set();

//     while (currentUser && currentUser.superior) {

//       const superiorId = currentUser.superior.toString();

//       if (visited.has(superiorId)) break;
//       visited.add(superiorId);

//       const superiorConfig =
//         (await SRCConfig.findOne({ user: superiorId })) ||
//         userConfig;

//       await createSRCForUser(
//         superiorId,          // owner becomes superior
//         user,                // 🔥 origin still original user
//         normalizedPlace,
//         station,
//         radius,
//         kms,
//         MOT,
//         undefined,
//         undefined,
//         superiorConfig,
//         true
//       );

//       currentUser = await User.findById(superiorId).select("superior");
//     }

//     res.status(201).json(baseSRC);

//   } catch (err) {
//     console.error("CREATE SRC ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };



// // async function createSRCForUser(
// //   userId,          // who owns this SRC
// //   originUserId,    // who originally created it 🔥
// //   placeOfWork,
// //   station,
// //   radius,
// //   kms,
// //   MOT,
// //   RsPerKm,
// //   DA,
// //   config,
// //   allowDuplicate = false
// // ) {

// //   const normalizedPlace = placeOfWork.trim();
// //   const finalMOT = station === "HQ" ? "Local" : MOT;

// //   // Strict duplicate check only for base user
// //   if (!allowDuplicate) {
// //     const duplicate = await SRC.findOne({
// //       user: userId,
// //       originUser: originUserId,
// //       placeOfWork: normalizedPlace,
// //       station,
// //       MOT: finalMOT,
// //     });

// //     if (duplicate) return duplicate;
// //   }

// //   const newSRC = new SRC({
// //     user: userId,
// //     originUser: originUserId,   // 🔥 CRITICAL
// //     placeOfWork: normalizedPlace,
// //     station,
// //     radius: Number(radius) || 0,
// //     kms: station === "HQ" ? 0 : Number(kms) || 0,
// //     MOT: finalMOT,
// //     RsPerKmOverride: station === "HQ" ? 0 : (RsPerKm ?? null),
// //     DAOverride: DA ?? null,
// //   });

// //   await newSRC.save();

// //   return newSRC;
// // }


// // async function createSRCForUser(
// //   userId,          // who owns this SRC
// //   originUserId,    // who originally created it
// //   placeOfWork,
// //   station,
// //   radius,
// //   kms,
// //   MOT,
// //   RsPerKm,
// //   DA,
// //   config,
// //   allowDuplicate = false
// // ) {

// //   const normalizedPlace = placeOfWork.trim();
// //   const finalMOT = station === "HQ" ? "Local" : MOT;

// //   // Strict duplicate check only for base user
// //   if (!allowDuplicate) {
// //     const duplicate = await SRC.findOne({
// //       user: userId,
// //       originUser: originUserId,
// //       placeOfWork: normalizedPlace,
// //       station,
// //       MOT: finalMOT,
// //     });

// //     if (duplicate) return duplicate;
// //   }

// //   /* ===============================
// //      BASE USER (Executive)
// //   =============================== */
// //   if (!allowDuplicate) {

// //     const newSRC = new SRC({
// //       user: userId,
// //       originUser: originUserId,
// //       placeOfWork: normalizedPlace,
// //       station,
// //       radius: Number(radius) || 0,
// //       kms: station === "HQ" ? 0 : Number(kms) || 0,
// //       MOT: finalMOT,
// //       RsPerKmOverride: station === "HQ" ? 0 : (RsPerKm ?? null),
// //       TAOverride: null,                  // 🔥 keep untouched
// //       DAOverride: DA ?? null,
// //     });

// //     await newSRC.save();
// //     return newSRC;
// //   }

// //   /* ===============================
// //      SUPERIOR (Manager / Admin)
// //      ALWAYS initialize overrides as 0
// //   =============================== */

// //   const newSRC = new SRC({
// //     user: userId,                 // superior
// //     originUser: originUserId,     // subordinate is source
// //     placeOfWork: normalizedPlace,
// //     station,
// //     radius: Number(radius) || 0,
// //     kms: station === "HQ" ? 0 : Number(kms) || 0,
// //     MOT: finalMOT,

// //     RsPerKmOverride: 0,           // 🔥 always start as 0
// //     TAOverride: 0,                // 🔥 always start as 0
// //     DAOverride: 0,                // 🔥 always start as 0
// //   });

// //   await newSRC.save();
// //   return newSRC;
// // }


// // /* =========================
// //    UPDATE SRC
// // ========================= */
// // exports.updateSRC = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { RsPerKm, DA, ...updates } = req.body;

// //     const src = await SRC.findById(id);

// //     if (!src) {
// //       return res.status(404).json({ message: "SRC not found" });
// //     }

// //     /* 🔒 HQ IMMUTABLE RULES */
// //     if (src.station === "HQ") {
// //       updates.MOT = "Local";
// //       updates.kms = 0;
// //       src.RsPerKmOverride = null;
// //       src.DAOverride = null;
// //     }

// //     if (RsPerKm !== undefined) {
// //       src.RsPerKmOverride = RsPerKm;
// //     }

// //     if (DA !== undefined) {
// //       src.DAOverride = DA;
// //     }

// //     Object.assign(src, updates);

// //     await src.save();

// //     res.json(src);

// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };


// async function createSRCForUser(
//   userId,
//   originUserId,
//   placeOfWork,
//   station,
//   radius,
//   kms,
//   MOT,
//   RsPerKm,
//   DA,
//   config,
//   allowDuplicate = false
// ) {

//   const normalizedPlace = placeOfWork.trim();

//   /* ===============================
//      BASE USER (EXECUTIVE)
//   =============================== */
//   if (!allowDuplicate) {

//     const duplicate = await SRC.findOne({
//       user: userId,
//       originUser: originUserId,
//       placeOfWork: normalizedPlace,
//       station,
//     });

//     if (duplicate) return duplicate;

//     const newSRC = new SRC({
//       user: userId,
//       originUser: originUserId,
//       placeOfWork: normalizedPlace,
//       station,
//       radius: Number(radius) || 0,
//       kms: station === "HQ" ? 0 : Number(kms) || 0,
//       MOT: station === "HQ" ? "Local" : MOT,
//       RsPerKmOverride: station === "HQ" ? 0 : (RsPerKm ?? null),
//       TAOverride: null,
//       DAOverride: DA ?? null,
//       isManuallyEdited: false,
//     });

//     await newSRC.save();
//     return newSRC;
//   }

//   /* ===============================
//      SUPERIOR PROPAGATION
//   =============================== */

//   // Skip duplicate placeOfWork
//   const existing = await SRC.findOne({
//     user: userId,
//     placeOfWork: normalizedPlace,
//   });

//   if (existing) return existing;

//   // Check if superior has any config override
//   const hasOverride =
//     config?.defaultRsPerKm != null ||
//     config?.defaultDA != null ||
//     config?.defaultTA != null;

//   const newSRC = new SRC({
//     user: userId,
//     originUser: originUserId,
//     placeOfWork: normalizedPlace,
//     station: "-",              // 🔥 leave editable later
//     radius: Number(radius) || 0,
//     kms: null,                 // 🔥 empty
//     MOT: null,                 // 🔥 empty
//     RsPerKmOverride: hasOverride ? null : 0,
//     TAOverride: hasOverride ? null : 0,
//     DAOverride: hasOverride ? null : 0,
//     isManuallyEdited: false,
//   });

//   await newSRC.save();
//   return newSRC;
// }


// exports.updateSRC = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = { ...req.body };

//     const src = await SRC.findById(id);
//     if (!src) {
//       return res.status(404).json({ message: "SRC not found" });
//     }

//         // Normalize placeOfWork
//     if (updates.placeOfWork) {
//       updates.placeOfWork = updates.placeOfWork.trim();
//     }

//     const duplicate = await SRC.findOne({
//   user: src.user,
//   _id: { $ne: src._id },
//   placeOfWork: updates.placeOfWork,
// });

// if (duplicate) {
//   return res.status(400).json({
//     message: "Place of work already exists",
//   });
// }

//     // HQ rules
//     if (src.station === "HQ") {
//       updates.MOT = "Local";
//       updates.kms = 0;
//     }

//     Object.assign(src, updates);

//     // 🔥 Mark as manually edited
//     src.isManuallyEdited = true;

//     await src.save();

//     res.json(src);

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.applyConfigToSRCs = async (userId) => {

//   const config = await SRCConfig.findOne({ user: userId });
//   if (!config) return;

//   const srcs = await SRC.find({ user: userId });

//   for (let src of srcs) {

//     // 🔥 Skip manually edited ones
//     if (src.isManuallyEdited) continue;

//     src.RsPerKmOverride = config.defaultRsPerKm ?? 0;
//     src.DAOverride = config.defaultDA ?? 0;
//     src.TAOverride = config.defaultTA ?? 0;


    

//     await src.save();
//   }
// };
// // exports.updateSRC = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { RsPerKm, DA, TA, ...updates } = req.body;

// //     const src = await SRC.findById(id);

// //     if (!src) {
// //       return res.status(404).json({ message: "SRC not found" });
// //     }

// //     /* 🔒 HQ IMMUTABLE RULES */
// //     if (src.station === "HQ") {
// //       updates.MOT = "Local";
// //       updates.kms = 0;
// //       src.RsPerKmOverride = null;
// //       src.DAOverride = null;
// //       src.TAOverride = null;
// //     }

// //     if (RsPerKm !== undefined) {
// //       src.RsPerKmOverride = RsPerKm;
// //     }

// //     if (DA !== undefined) {
// //       src.DAOverride = DA;
// //     }

// //     if (TA !== undefined) {
// //       src.TAOverride = TA;
// //     }

// //     Object.assign(src, updates);

// //     await src.save();

// //     res.json(src);

// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };


// /* =========================
//    DELETE SRC (HARD DELETE)
// ========================= */
// exports.deleteSRC = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deleted = await SRC.findByIdAndDelete(id);

//     if (!deleted) {
//       return res.status(404).json({ message: "SRC not found" });
//     }

//     res.json({ message: "SRC permanently deleted" });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* =========================
//    GET MY SRC (EXECUTIVE)
// ========================= */
// exports.getMySRCs = async (req, res) => {
//   try {
//     const srcs = await SRC.find({ user: req.user._id })
//       .sort({ station: 1, placeOfWork: 1 });

//     res.json(srcs);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };













// // exports.createSRC = async (req, res) => {
// //   try {
// //     const {
// //       user,
// //       placeOfWork,
// //       station,
// //       radius,
// //       kms,
// //       MOT,
// //       RsPerKm,
// //       DA,
// //     } = req.body;

// //     if (!user || !placeOfWork || !station || radius == null || kms == null || !MOT) {
// //       return res.status(400).json({
// //         message: "All required fields must be provided",
// //       });
// //     }

// //     const normalizedPlace = placeOfWork.trim();

// //     const userConfig = await SRCConfig.findOne({ user });

// //     if (!userConfig) {
// //       return res.status(400).json({
// //         message: "SRC configuration not set for this user",
// //       });
// //     }

// //     // 🔹 Create for original user (strict duplicate check)
// //     const baseSRC = await createSRCForUser(
// //       user,
// //       normalizedPlace,
// //       station,
// //       radius,
// //       kms,
// //       MOT,
// //       RsPerKm,
// //       DA,
// //       userConfig,
// //       false
// //     );

// //     // 🔥 Propagate upward (allow duplicates)
// //     let currentUser = await User.findById(user).select("superior");

// //     const visited = new Set();

// //     while (currentUser && currentUser.superior) {

// //       const superiorId = currentUser.superior.toString();

// //       if (visited.has(superiorId)) break;
// //       visited.add(superiorId);

// //       const superiorConfig =
// //         (await SRCConfig.findOne({ user: superiorId })) ||
// //         userConfig;

// //       await createSRCForUser(
// //         superiorId,
// //         normalizedPlace,
// //         station,
// //         radius,
// //         kms,
// //         MOT,
// //         undefined,
// //         undefined,
// //         superiorConfig,
// //         true   // allow duplicates for superiors
// //       );

// //       currentUser = await User.findById(superiorId).select("superior");
// //     }

// //     res.status(201).json(baseSRC);

// //   } catch (err) {
// //     console.error("CREATE SRC ERROR:", err);
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// // async function createSRCForUser(
// //   userId,
// //   placeOfWork,
// //   station,
// //   radius,
// //   kms,
// //   MOT,
// //   RsPerKm,
// //   DA,
// //   config,
// //   allowDuplicate = false
// // ) {

// //   const normalizedPlace = placeOfWork.trim();
// //   const finalMOT = station === "HQ" ? "Local" : MOT;

// //   if (!allowDuplicate) {
// //     const duplicate = await SRC.findOne({
// //       user: userId,
// //       placeOfWork: normalizedPlace,
// //       station,
// //       MOT: finalMOT,
// //     });

// //     if (duplicate) return duplicate;
// //   }

// //   const newSRC = new SRC({
// //   user: userId,
// //   placeOfWork: normalizedPlace,
// //   station,
// //   radius: Number(radius) || 0,
// //   kms: station === "HQ" ? 0 : Number(kms) || 0,
// //   MOT: finalMOT,
// //   RsPerKmOverride: station === "HQ" ? 0 : (RsPerKm ?? null),
// //   DAOverride: DA ?? null,
// // });

// //   await newSRC.save();

// //   return newSRC;
// // }













const SRC = require("../models/SRC");
const SRCConfig = require("../models/SRCConfig");
const User = require("../models/User");

/* =========================
   GET USER HQ
========================= */
exports.getUserHQ = async (req, res) => {
  try {
    const { userId } = req.params;

    const hq = await SRC.findOne({
      user: userId,
      station: "HQ",
    });

    if (!hq) {
      return res.json({ placeOfWork: "-" });
    }

    res.json({
      placeOfWork: hq.placeOfWork,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =========================
   GET USER SRCS
========================= */
exports.getUserSRCs = async (req, res) => {
  try {
    const { userId } = req.params;

    const srcs = await SRC.find({ user: userId })
      .sort({ station: 1, placeOfWork: 1 });

    res.json(srcs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =========================
   CREATE SRC (RESTORED)
========================= */
exports.createSRC = async (req, res) => {
  try {
    const {
      user,
      placeOfWork,
      station,
      radius,
      kms,
      MOT,
      RsPerKm,
      DA,
      TA
    } = req.body;

    if (!user || !placeOfWork || !station || radius == null || kms == null || !MOT) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    const normalizedPlace = placeOfWork.trim();

    const userConfig = await SRCConfig.findOne({ user });

    if (!userConfig) {
      return res.status(400).json({
        message: "SRC configuration not set for this user",
      });
    }

    /* ===============================
       CREATE FOR ORIGINAL USER
    =============================== */
    const baseSRC = await createSRCForUser(
      user,                 // owner
      user,                 // originUser (IMPORTANT)
      normalizedPlace,
      station,
      radius,
      kms,
      MOT,
      RsPerKm,
      DA,
      TA,
      userConfig,
      false
    );

    /* ===============================
       PROPAGATE UPWARD
    =============================== */
    let currentUser = await User.findById(user).select("superior");
    const visited = new Set();

    while (currentUser && currentUser.superior) {

      const superiorId = currentUser.superior.toString();

      if (visited.has(superiorId)) break;
      visited.add(superiorId);

      const superiorConfig =
        (await SRCConfig.findOne({ user: superiorId })) ||
        userConfig;

      await createSRCForUser(
        superiorId,          // now owner becomes superior
        user,                // origin remains original user
        normalizedPlace,
        station,
        radius,
        kms,
        MOT,
        undefined,
        undefined,
        superiorConfig,
        true
      );

      currentUser = await User.findById(superiorId).select("superior");
    }

    res.status(201).json(baseSRC);

  } catch (err) {
    console.error("CREATE SRC ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
/* =========================
   INTERNAL CREATE FUNCTION
========================= */
// async function createSRCForUser(
//   userId,
//   originUserId,
//   placeOfWork,
//   station,
//   radius,
//   kms,
//   MOT,
//   RsPerKm,
//   DA,
//   config,
//   allowDuplicate = false
// ) {

//   const normalizedPlace = placeOfWork.trim();

//   /* ===============================
//      BASE USER
//   =============================== */
//   if (!allowDuplicate) {

//     const duplicate = await SRC.findOne({
//       user: userId,
//       originUser: originUserId,
//       placeOfWork: normalizedPlace,
//       station,
//     });

//     if (duplicate) return duplicate;

//     const newSRC = new SRC({
//       user: userId,
//       originUser: originUserId,
//       placeOfWork: normalizedPlace,
//       station,
//       radius: Number(radius) || 0,
//       kms: station === "HQ" ? 0 : Number(kms) || 0,
//       MOT: station === "HQ" ? "Local" : MOT,
//       RsPerKmOverride: station === "HQ" ? 0 : (RsPerKm ?? null),
//       TAOverride: null,
//       DAOverride: DA ?? null,
//       isManuallyEdited: false,
//     });

//     await newSRC.save();
//     return newSRC;
//   }

//   /* ===============================
//      SUPERIOR PROPAGATION
//   =============================== */

//   const existing = await SRC.findOne({
//   user: userId,
//   originUser: originUserId,
//   placeOfWork: normalizedPlace,
//   station,
//   kms: Number(kms) || 0,
//   MOT,
// });

//   if (existing) return existing;

// const newSRC = new SRC({
//   user: userId,
//   originUser: originUserId,
//   placeOfWork: normalizedPlace,
//   station: "-",
//   radius: Number(radius) || 0,
//   kms: null,
//   MOT: null,
//   RsPerKmOverride: config?.RsPerKm ?? 0,
//   TAOverride: 0,
//   DAOverride: 0,
// });


//   await newSRC.save();
//   return newSRC;
// }

/* =========================
   INTERNAL CREATE FUNCTION
========================= */
async function createSRCForUser(
  userId,
  originUserId,
  placeOfWork,
  station,
  radius,
  kms,
  MOT,
  RsPerKm,
  DA,
  TA,
  config,
  allowDuplicate = false
) {
  const normalizedPlace = placeOfWork.trim();

  /* ===============================
     BASE USER (ALWAYS ALLOW)
  =============================== */
  if (!allowDuplicate) {

    const newSRC = new SRC({
      user: userId,
      originUser: originUserId,
      placeOfWork: normalizedPlace,
      station,
      radius: Number(radius) || 0,
      kms: station === "HQ" ? 0 : Number(kms) || 0,
      MOT: station === "HQ" ? "Local" : MOT,
      RsPerKmOverride: station === "HQ" ? 0 : (RsPerKm ?? null),
      TAOverride: TA ?? null,
      DAOverride: DA ?? null,
      isManuallyEdited: false,
    });

    await newSRC.save();
    return newSRC;
  }

  /* ===============================
     SUPERIOR PROPAGATION
     (BLOCK ONLY SAME placeOfWork)
  =============================== */

  const existing = await SRC.findOne({
    user: userId,               // superior
    placeOfWork: normalizedPlace,
  });

  if (existing) return existing;

  const newSRC = new SRC({
    user: userId,
    originUser: originUserId,
    placeOfWork: normalizedPlace,
    station: "-",
    radius: Number(radius) || 0,
    kms: null,
    MOT: null,
    RsPerKmOverride: config?.RsPerKm ?? 0,
    TAOverride: 0,
    DAOverride: 0,
    isManuallyEdited: false,
  });

  await newSRC.save();
  return newSRC;
}


/* =========================
   UPDATE SRC
========================= */
// exports.updateSRC = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = { ...req.body };

//     const src = await SRC.findById(id);
//     if (!src) {
//       return res.status(404).json({ message: "SRC not found" });
//     }

//     if (updates.placeOfWork) {
//       updates.placeOfWork = updates.placeOfWork.trim();
//     }

//     const duplicate = await SRC.findOne({
//       user: src.user,
//       _id: { $ne: src._id },
//       placeOfWork: updates.placeOfWork,
//     });

//     if (duplicate) {
//       return res.status(400).json({
//         message: "Place of work already exists",
//       });
//     }

//     if (updates.station === "HQ") {
//       updates.MOT = "Local";
//       updates.kms = 0;
//     }

//     Object.assign(src, updates);

//     src.isManuallyEdited = true;

//     await src.save();

//     res.json(src);

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.updateSRC = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = { ...req.body };

//     const src = await SRC.findById(id);
//     if (!src) {
//       return res.status(404).json({ message: "SRC not found" });
//     }

//     if (updates.placeOfWork) {
//       updates.placeOfWork = updates.placeOfWork.trim();
//     }

//     const duplicate = await SRC.findOne({
//       user: src.user,
//       _id: { $ne: src._id },
//       placeOfWork: updates.placeOfWork,
//     });

//     if (duplicate) {
//       return res.status(400).json({
//         message: "Place of work already exists",
//       });
//     }

//     // HQ rules
//     if (updates.station === "HQ") {
//       updates.MOT = "Local";
//       updates.kms = 0;
//       updates.RsPerKmOverride = 0;
//       updates.TAOverride = 0;
//     }

//     Object.assign(src, updates);

//     await src.save();

//     res.json(src);

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

exports.updateSRC = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      placeOfWork,
      station,
      radius,
      kms,
      MOT,
      RsPerKm,
      DA,
      TA,
    } = req.body;

    const src = await SRC.findById(id);
    if (!src) {
      return res.status(404).json({ message: "SRC not found" });
    }

    /* ---------- PLACE DUPLICATE CHECK ---------- */
    if (placeOfWork) {
      const trimmed = placeOfWork.trim();

      const duplicate = await SRC.findOne({
        user: src.user,
        _id: { $ne: src._id },
        placeOfWork: trimmed,
      });

      if (duplicate) {
        return res.status(400).json({
          message: "Place of work already exists",
        });
      }

      src.placeOfWork = trimmed;
    }

    /* ---------- BASIC FIELD UPDATES ---------- */
    if (station !== undefined) src.station = station;
    if (radius !== undefined) src.radius = Number(radius);
    if (kms !== undefined) src.kms = Number(kms);
    if (MOT !== undefined) src.MOT = MOT;

    /* ---------- OVERRIDES (THIS WAS THE BUG) ---------- */
    if (RsPerKm !== undefined) {
      src.RsPerKmOverride = Number(RsPerKm);
    }

    if (DA !== undefined) {
      src.DAOverride = Number(DA);
    }

    if (TA !== undefined) {
      src.TAOverride = Number(TA);
    }

    /* ---------- HQ SAFETY ---------- */
    if (src.station === "HQ") {
      src.MOT = "Local";
      src.kms = 0;
      src.RsPerKmOverride = 0;
      src.TAOverride = 0;
    }

    await src.save();

    res.json(src);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =========================
   APPLY CONFIG TO SRCS
========================= */
exports.applyConfigToSRCs = async (req, res) => {
  try {
    const { userId } = req.params;

    const config = await SRCConfig.findOne({ user: userId });
    if (!config) {
      return res.status(404).json({ message: "Config not found" });
    }

    const srcs = await SRC.find({ user: userId });

    for (let src of srcs) {

      if (src.isManuallyEdited) continue;

      src.RsPerKmOverride = config.RsPerKm ?? 0;

      if (src.station && config.DAperStation) {
        src.DAOverride =
          config.DAperStation[src.station] ?? 0;
      }

      await src.save();
    }

    res.json({ message: "SRCs updated from config" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =========================
   DELETE SRC
========================= */
exports.deleteSRC = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await SRC.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "SRC not found" });
    }

    res.json({ message: "SRC permanently deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =========================
   GET MY SRC
========================= */
exports.getMySRCs = async (req, res) => {
  try {
    const srcs = await SRC.find({ user: req.user._id })
      .sort({ station: 1, placeOfWork: 1 });

    res.json(srcs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





















