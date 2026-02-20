// const User = require("../models/User");

// /**
//  * Utility: check if target is a descendant
//  */
// const isDescendant = async (parentId, targetId) => {
//   const children = await User.find({ superior: parentId });

//   for (const child of children) {
//     if (child._id.equals(targetId)) return true;
//     const found = await isDescendant(child._id, targetId);
//     if (found) return true;
//   }
//   return false;
// };

// /**
//  * PUT /users/reassign-superior
//  */
// exports.reassignSuperior = async (req, res) => {
//   try {
//     const { employeeId, newSuperiorId } = req.body;
//     const company = req.user.company;

//     if (employeeId === newSuperiorId) {
//       return res
//         .status(400)
//         .json({ message: "Employee cannot be their own superior" });
//     }

//     const employee = await User.findOne({
//       _id: employeeId,
//       company,
//     });

//     const newSuperior = await User.findOne({
//       _id: newSuperiorId,
//       company,
//     });

//     if (!employee || !newSuperior) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Prevent circular hierarchy
//     const circular = await isDescendant(employee._id, newSuperior._id);
//     if (circular) {
//       return res.status(400).json({
//         message: "Cannot assign a subordinate as superior",
//       });
//     }

//     employee.superior = newSuperior._id;
//     await employee.save();

//     res.json({
//       message: "Superior reassigned successfully",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Reassignment failed" });
//   }
// };


const User = require("../models/User");


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

    if (employeeUserId === newSuperiorUserId) {
      return res
        .status(400)
        .json({ message: "Employee cannot be their own superior" });
    }

    const employee = await User.findOne({
      userId: employeeUserId,
      company,
    });

    const newSuperior = await User.findOne({
      userId: newSuperiorUserId,
      company,
    });

    if (!employee || !newSuperior) {
      return res.status(404).json({ message: "User not found" });
    }

    const circular = await isDescendant(employee._id, newSuperior._id);
    if (circular) {
      return res.status(400).json({
        message: "Cannot assign a subordinate as superior",
      });
    }

    employee.superior = newSuperior._id;
    await employee.save();

    res.json({ message: "Superior reassigned successfully ✨" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Reassignment failed" });
  }
};
