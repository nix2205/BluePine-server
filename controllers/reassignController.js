// const User = require("../models/User");
// const SRC = require("../models/SRC");
// const SRCConfig = require("../models/SRCConfig");
// const CityMap = require("../models/CityMap");


// const isDescendant = async (parentId, targetId) => {
//   const children = await User.find({ superior: parentId });

//   for (const child of children) {
//     if (child._id.equals(targetId)) return true;
//     const found = await isDescendant(child._id, targetId);
//     if (found) return true;
//   }
//   return false;
// };

// exports.reassignSuperior = async (req, res) => {
//   try {
//     const { employeeUserId, newSuperiorUserId } = req.body;
//     const company = req.user.company;

//     if (employeeUserId === newSuperiorUserId) {
//       return res.status(400).json({
//         message: "Employee cannot be their own superior",
//       });
//     }

//     const employee = await User.findOne({
//       userId: employeeUserId,
//       company,
//     });

//     const newSuperior = await User.findOne({
//       userId: newSuperiorUserId,
//       company,
//     });

//     if (!employee || !newSuperior) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const circular = await isDescendant(employee._id, newSuperior._id);
//     if (circular) {
//       return res.status(400).json({
//         message: "Cannot assign a subordinate as superior",
//       });
//     }

//     /* =========================
//        UPDATE SUPERIOR
//     ========================= */
//     employee.superior = newSuperior._id;
//     await employee.save();

//     /* =========================
//        UPDATE SRC ORIGIN
//        originUser = newSuperior._id
//     ========================= */
//     await SRC.updateMany(
//       { user: employee._id },
//       { $set: { originUser: newSuperior._id } }
//     );

//     /* =========================
//        UPDATE CITYMAP ORIGIN (if needed)
//     ========================= */
//     await CityMap.updateMany(
//       { user: employee._id },
//       { $set: { originUser: newSuperior._id } }
//     );

//     res.json({
//       message: "Superior reassigned and origin updated successfully",
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Reassignment failed" });
//   }
// };



// // exports.reassignSuperior = async (req, res) => {
// //   try {
// //     const { employeeUserId, newSuperiorUserId } = req.body;
// //     const company = req.user.company;

// //     if (employeeUserId === newSuperiorUserId) {
// //       return res.status(400).json({
// //         message: "Employee cannot be their own superior",
// //       });
// //     }

// //     const employee = await User.findOne({
// //       userId: employeeUserId,
// //       company,
// //     });

// //     const newSuperior = await User.findOne({
// //       userId: newSuperiorUserId,
// //       company,
// //     });

// //     if (!employee || !newSuperior) {
// //       return res.status(404).json({ message: "User not found" });
// //     }

// //     const circular = await isDescendant(employee._id, newSuperior._id);
// //     if (circular) {
// //       return res.status(400).json({
// //         message: "Cannot assign a subordinate as superior",
// //       });
// //     }

// //     const oldSuperiorId = employee.superior;

// //     /* =====================================
// //        UPDATE SUPERIOR
// //     ===================================== */
// //     employee.superior = newSuperior._id;
// //     await employee.save();

// //     /* =====================================
// //        REMOVE OLD PROPAGATED SRC + CITYMAP
// //     ===================================== */
// //     if (oldSuperiorId) {

// //       let current = await User.findById(oldSuperiorId).select("superior");
// //       const visited = new Set();

// //       while (current) {

// //         const currentId = current._id.toString();
// //         if (visited.has(currentId)) break;
// //         visited.add(currentId);

// //         // Remove SRC
// //         await SRC.deleteMany({
// //           user: current._id,
// //           originUser: employee._id,
// //         });

// //         // 🔥 Remove CityMap
// //         await CityMap.deleteMany({
// //           user: current._id,
// //           originUser: employee._id,
// //         });

// //         if (!current.superior) break;
// //         current = await User.findById(current.superior).select("superior");
// //       }
// //     }

// //     /* =====================================
// //        ADD SRC + CITYMAP TO NEW SUPERIOR CHAIN
// //     ===================================== */

// //     const employeeSRCs = await SRC.find({
// //       user: employee._id,
// //       originUser: employee._id,
// //     });

// //     const employeeCityMaps = await CityMap.find({
// //       user: employee._id,
// //       originUser: employee._id,
// //     });

// //     let current = newSuperior;
// //     const visited = new Set();

// //     while (current) {

// //       const currentId = current._id.toString();
// //       if (visited.has(currentId)) break;
// //       visited.add(currentId);

// //       /* ===== Add SRC ===== */
// //       for (const src of employeeSRCs) {
// //         await SRC.create({
// //           user: current._id,
// //           originUser: employee._id,
// //           placeOfWork: src.placeOfWork,
// //           station: src.station,
// //           radius: src.radius,
// //           kms: src.kms,
// //           MOT: src.MOT,
// //           RsPerKmOverride: src.RsPerKmOverride,
// //           DAOverride: src.DAOverride,
// //         });
// //       }

// //       /* ===== Add CityMap ===== */
// //       for (const map of employeeCityMaps) {

// //         // Superior must have this city in THEIR SRC
// //         const superiorSRC = await SRC.findOne({
// //           user: current._id,
// //           placeOfWork: map.city,
// //         });

// //         if (!superiorSRC) continue;

// //         await CityMap.create({
// //           user: current._id,
// //           originUser: employee._id,
// //           city: map.city,
// //           location: map.location,
// //           radiusKm: superiorSRC.radius,     // dynamic override
// //           stationType: superiorSRC.station, // dynamic override
// //           address: map.address,
// //           date: map.date,
// //           time: map.time,
// //         });
// //       }

// //       if (!current.superior) break;
// //       current = await User.findById(current.superior);
// //     }

// //     res.json({
// //       message: "Superior reassigned successfully ✨",
// //     });

// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "Reassignment failed" });
// //   }
// // };


// // exports.reassignSuperior = async (req, res) => {

// //   try {
// //     const { employeeUserId, newSuperiorUserId } = req.body;
// //     const company = req.user.company;

// //     if (employeeUserId === newSuperiorUserId) {
// //       return res
// //         .status(400)
// //         .json({ message: "Employee cannot be their own superior" });
// //     }

// //     const employee = await User.findOne({
// //       userId: employeeUserId,
// //       company,
// //     });

// //     const newSuperior = await User.findOne({
// //       userId: newSuperiorUserId,
// //       company,
// //     });

// //     if (!employee || !newSuperior) {
// //       return res.status(404).json({ message: "User not found" });
// //     }

// //     const circular = await isDescendant(employee._id, newSuperior._id);
// //     if (circular) {
// //       return res.status(400).json({
// //         message: "Cannot assign a subordinate as superior",
// //       });
// //     }

// //     employee.superior = newSuperior._id;
// //     await employee.save();

// //     res.json({ message: "Superior reassigned successfully ✨" });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "Reassignment failed" });
// //   }
// // };






const User = require("../models/User");
const SRC = require("../models/SRC");
const CityMap = require("../models/CityMap");

const isDescendant = async (parentId, targetId) => {
  const children = await User.find({ superior: parentId });

  for (const child of children) {
    if (child._id.equals(targetId)) return true;
    const found = await isDescendant(child._id, targetId);
    if (found) return true;
  }
  return false;
};





exports.reassignSuperior = async (req, res) => {
  try {
    const { employeeUserId, newSuperiorUserId } = req.body;
    const company = req.user.company;

    const employee = await User.findOne({ userId: employeeUserId, company });
    const newSuperior = await User.findOne({ userId: newSuperiorUserId, company });

    if (!employee || !newSuperior) {
      return res.status(404).json({ message: "User not found" });
    }

    const oldSuperiorId = employee.superior;

    /* ======================
       UPDATE SUPERIOR
    ====================== */
    employee.superior = newSuperior._id;
    await employee.save();

    /* ======================
       REMOVE FROM OLD CHAIN
    ====================== */
    if (oldSuperiorId) {
      let current = await User.findById(oldSuperiorId);

      while (current) {
        await SRC.deleteMany({
          user: current._id,
          originUser: employee._id,
        });

        if (!current.superior) break;
        current = await User.findById(current.superior);
      }
    }

    /* ======================
       ADD TO NEW CHAIN
    ====================== */

    const baseSRCs = await SRC.find({
      user: employee._id,
      originUser: employee._id,
    });

    let current = newSuperior;

    while (current) {

      for (const src of baseSRCs) {
        const exists = await SRC.findOne({
          user: current._id,
          originUser: employee._id,
          placeOfWork: src.placeOfWork,
        });

        if (!exists) {
          await SRC.create({
  user: current._id,            // superior
  originUser: employee._id,     // subordinate (source)

  placeOfWork: src.placeOfWork,
  station: src.station,
  radius: src.radius,
  kms: src.kms,
  MOT: src.MOT,

  RsPerKmOverride: 0,           // 🔥 reset for superior
  TAOverride: 0,                // 🔥 reset for superior
  DAOverride: 0,                // 🔥 reset for superior
});
        }
      }

      if (!current.superior) break;
      current = await User.findById(current.superior);
    }

    res.json({ message: "Reassigned correctly." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error." });
  }
};



// exports.reassignSuperior = async (req, res) => {
//   try {
//     const { employeeUserId, newSuperiorUserId } = req.body;
//     const company = req.user.company;

//     if (employeeUserId === newSuperiorUserId) {
//       return res.status(400).json({
//         message: "Employee cannot be their own superior",
//       });
//     }

//     const employee = await User.findOne({
//       userId: employeeUserId,
//       company,
//     });

//     const newSuperior = await User.findOne({
//       userId: newSuperiorUserId,
//       company,
//     });

//     if (!employee || !newSuperior) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const circular = await isDescendant(employee._id, newSuperior._id);
//     if (circular) {
//       return res.status(400).json({
//         message: "Cannot assign a subordinate as superior",
//       });
//     }

//     /* =========================
//        UPDATE SUPERIOR
//     ========================= */
//     employee.superior = newSuperior._id;
//     await employee.save();

//     /* =========================
//        UPDATE SRC ORIGIN
//        originUser = newSuperior._id
//     ========================= */
//     await SRC.updateMany(
//   { user: { $ne: "$originUser" } },
//   [
//     {
//       $set: {
//         originUser: "$user"
//       }
//     }
//   ],
//   { updatePipeline: true }
// );

//     /* =========================
//        UPDATE CITYMAP ORIGIN (if needed)
//     ========================= */
//     await CityMap.updateMany(
//       { user: employee._id },
//       { $set: { originUser: newSuperior._id } }
//     );

//     res.json({
//       message: "Superior reassigned and origin updated successfully",
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Reassignment failed" });
//   }
// };

