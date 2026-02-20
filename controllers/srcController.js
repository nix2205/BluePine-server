const SRC = require("../models/SRC");
const SRCConfig = require("../models/SRCConfig");


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
   CREATE SRC
========================= */
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

//     if (!user || !placeOfWork || !station || !radius || kms == null || !MOT) {
//       return res.status(400).json({
//         message: "All required fields must be provided",
//       });
//     }

//     /* 🔁 CHECK IF PLACE ALREADY EXISTS */
//     const existingPlace = await SRC.findOne({
//       user,
//       placeOfWork,
//     });

//     let finalStation = station;
//     let finalKms = kms;

//     // 🧠 Force same station + kms for same place
//     if (existingPlace) {
//       finalStation = existingPlace.station;
//       finalKms = existingPlace.kms;
//     }

//     /* 🔒 HQ RULES */
//     if (finalStation === "HQ") {
//       const existingHQ = await SRC.findOne({
//         user,
//         station: "HQ",
//       });

//       if (existingHQ) {
//         return res.status(400).json({
//           message: "User already has an HQ",
//         });
//       }

//       if (MOT !== "Local") {
//         return res.status(400).json({
//           message: "HQ MOT must be Local",
//         });
//       }
//     }

//     /* 🔒 DUPLICATE CHECK */
//     const duplicate = await SRC.findOne({
//       user,
//       placeOfWork,
//       station: finalStation,
//       MOT,
//     });

//     if (duplicate) {
//       return res.status(400).json({
//         message: "This place with the selected MOT already exists",
//       });
//     }

//     /* 🧠 LOAD CONFIG */
//     const config = await SRCConfig.findOne({ user });

//     if (!config) {
//       return res.status(400).json({
//         message: "SRC configuration not set for this user",
//       });
//     }

//     /* 🧠 APPLY DEFAULTS OR OVERRIDES (for response preview only) */
//     const finalRsPerKm =
//       finalStation === "HQ"
//         ? 0
//         : RsPerKm !== undefined
//         ? RsPerKm
//         : config.RsPerKm;

//     const finalDA =
//       DA !== undefined
//         ? DA
//         : config.DAperStation[finalStation] || 0;

//     /* 🧾 CREATE SRC */
//     const src = new SRC({
//       user,
//       placeOfWork: placeOfWork.trim(),
//       station: finalStation,
//       radius: Number(radius),
//       kms: finalStation === "HQ" ? 0 : Number(finalKms),
//       MOT: finalStation === "HQ" ? "Local" : MOT,
//       RsPerKmOverride: RsPerKm !== undefined ? RsPerKm : null,
//       DAOverride: DA !== undefined ? DA : null,
//     });

//     await src.save();

//     res.status(201).json({
//       ...src.toObject(),
//       calculatedTA: finalRsPerKm * src.kms,
//       calculatedDA: finalDA,
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

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
    } = req.body;

    if (!user || !placeOfWork || !station || !radius || kms == null || !MOT) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    /* 🔁 CHECK IF PLACE ALREADY EXISTS */
    const existingPlace = await SRC.findOne({
      user,
      placeOfWork,
    });

    let finalStation = station;
    let finalKms = kms;

    if (existingPlace) {
      finalStation = existingPlace.station;
      finalKms = existingPlace.kms;
    }

    /* 🔒 HQ RULES */
    if (finalStation === "HQ") {
      const existingHQ = await SRC.findOne({
        user,
        station: "HQ",
      });

      if (existingHQ) {
        return res.status(400).json({
          message: "User already has an HQ",
        });
      }

      if (MOT !== "Local") {
        return res.status(400).json({
          message: "HQ MOT must be Local",
        });
      }
    }

    /* 🔒 DUPLICATE CHECK */
    const duplicate = await SRC.findOne({
      user,
      placeOfWork,
      station: finalStation,
      MOT,
    });

    if (duplicate) {
      return res.status(400).json({
        message: "This place with the selected MOT already exists",
      });
    }

    /* 🧠 LOAD USER CONFIG */
    const userConfig = await SRCConfig.findOne({ user });

    if (!userConfig) {
      return res.status(400).json({
        message: "SRC configuration not set for this user",
      });
    }

    /* 🧾 CREATE SRC FOR ORIGINAL USER */
    const baseSRC = await createSRCForUser(
      user,
      placeOfWork,
      finalStation,
      radius,
      finalKms,
      MOT,
      RsPerKm,
      DA,
      userConfig
    );

    /* =========================
       🔥 PROPAGATE TO SUPERIORS
    ========================== */

    let currentUser = await require("../models/User")
      .findById(user)
      .select("manager");

    while (currentUser?.manager) {
      const managerId = currentUser.manager;

      const managerConfig =
        (await SRCConfig.findOne({ user: managerId })) ||
        userConfig; // fallback

      await createSRCForUser(
        managerId,
        placeOfWork,
        finalStation,
        radius,
        finalKms,
        MOT,
        undefined,
        undefined,
        managerConfig
      );

      currentUser = await require("../models/User")
        .findById(managerId)
        .select("manager");
    }

    res.status(201).json(baseSRC);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

async function createSRCForUser(
  userId,
  placeOfWork,
  station,
  radius,
  kms,
  MOT,
  RsPerKm,
  DA,
  config
) {
  // Prevent duplicate for superior
  const duplicate = await SRC.findOne({
    user: userId,
    placeOfWork,
    station,
    MOT,
  });

  if (duplicate) return duplicate;

  const finalRsPerKm =
    station === "HQ"
      ? 0
      : RsPerKm !== undefined
      ? RsPerKm
      : config.RsPerKm;

  const finalDA =
    DA !== undefined
      ? DA
      : config.DAperStation[station] || 0;

  const newSRC = new SRC({
    user: userId,
    placeOfWork: placeOfWork.trim(),
    station,
    radius: Number(radius),
    kms: station === "HQ" ? 0 : Number(kms),
    MOT: station === "HQ" ? "Local" : MOT,
    RsPerKmOverride:
      RsPerKm !== undefined ? RsPerKm : null,
    DAOverride:
      DA !== undefined ? DA : null,
  });

  await newSRC.save();

  return {
    ...newSRC.toObject(),
    calculatedTA: finalRsPerKm * newSRC.kms,
    calculatedDA: finalDA,
  };
}

/* =========================
   UPDATE SRC
========================= */
exports.updateSRC = async (req, res) => {
  try {
    const { id } = req.params;
    const { RsPerKm, DA, ...updates } = req.body;

    const src = await SRC.findById(id);

    if (!src) {
      return res.status(404).json({ message: "SRC not found" });
    }

    /* 🔒 HQ IMMUTABLE RULES */
    if (src.station === "HQ") {
      updates.MOT = "Local";
      updates.kms = 0;
      src.RsPerKmOverride = null;
      src.DAOverride = null;
    }

    if (RsPerKm !== undefined) {
      src.RsPerKmOverride = RsPerKm;
    }

    if (DA !== undefined) {
      src.DAOverride = DA;
    }

    Object.assign(src, updates);

    await src.save();

    res.json(src);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =========================
   DELETE SRC (HARD DELETE)
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
   GET MY SRC (EXECUTIVE)
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
