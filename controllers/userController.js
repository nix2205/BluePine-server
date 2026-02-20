const User = require("../models/User");
const NormalExpense = require("../models/NormalExpense");
const OtherExpense = require("../models/OtherExpense");
const Approval = require("../models/Approval");
const SRC = require("../models/SRC");


/* =========================
   HARD DELETE USER
   + REASSIGN SUBORDINATES
========================= */
exports.deleteUser = async (req, res) => {
  try {
    const requester = req.user;
    const { id } = req.params;

    if (!["admin", "manager"].includes(requester.role)) {
  return res.status(403).json({
    message: "Only admin or manager can delete users",
  });
}
    const user = await User.findOne({
      _id: id,
      company: requester.company,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ❗ Prevent deleting yourself
    if (user._id.toString() === requester._id.toString()) {
      return res.status(400).json({
        message: "You cannot delete your own account",
      });
    }

    /* ==============================
       IF USER IS MANAGER
       REASSIGN SUBORDINATES
    ============================== */
    if (user.role === "manager") {

      if (!user.superior) {
        return res.status(400).json({
          message:
            "Manager has no superior. Cannot reassign subordinates safely.",
        });
      }

      await User.updateMany(
        { superior: user._id },
        { $set: { superior: user.superior } }
      );
    }

    /* ==============================
       DELETE RELATED DATA
    ============================== */
    await NormalExpense.deleteMany({ user: id });
    await OtherExpense.deleteMany({ user: id });
    await Approval.deleteMany({ user: id });
    await SRC.deleteMany({ user: id });

    /* ==============================
       DELETE USER
    ============================== */
    await user.deleteOne();

    res.json({
      message: "User and all related data deleted successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET ALL USERS
========================= */
exports.getAllUsers = async (req, res) => {
  try {
    const requester = req.user;

    if (!["admin", "manager"].includes(requester.role)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const users = await User.find({ company: requester.company })
      .select("_id userId username role")
      .sort({ username: 1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET USER BY ID
========================= */
// exports.getUserById = async (req, res) => {
//   try {
//     const requester = req.user;
//     const { id } = req.params;

//     if (!["admin", "manager"].includes(requester.role)) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     const user = await User.findOne({
//       _id: id,
//       company: requester.company,
//     }).select("-password");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

exports.getUserById = async (req, res) => {
  try {
    const requester = req.user;
    const { id } = req.params;

    if (!["admin", "manager"].includes(requester.role)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const user = await User.findOne({
      _id: id,
      company: requester.company,
    }); // ✅ removed .select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   CREATE USER (NO HASH)
========================= */
exports.createUser = async (req, res) => {
  try {
    const creator = req.user;
    const { userId, username, password, role, superior } = req.body;

    // 🔐 Only admin and manager can create users
    if (!["admin", "manager"].includes(creator.role)) {
      return res.status(403).json({
        message: "Not authorized to create users",
      });
    }

    // 🎯 Role validation based on creator
    if (creator.role === "admin") {
      if (!["manager", "executive"].includes(role)) {
        return res.status(400).json({
          message: "Invalid role",
        });
      }
    }

    if (creator.role === "manager") {
      if (role !== "executive") {
        return res.status(403).json({
          message: "Manager can only create executives",
        });
      }
    }

    // 🚫 Prevent duplicate userId
    const existing = await User.findOne({ userId });
    if (existing) {
      return res.status(400).json({
        message: "UserId already exists",
      });
    }

    // 👤 Create user
    const newUser = await User.create({
      userId,
      username,
      password, // 🔴 PLAIN TEXT (not recommended for production)
      role,
      company: creator.company,
      superior: superior || creator._id,
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// /* =========================
//    CREATE USER (NO HASH)
// ========================= */
// exports.createUser = async (req, res) => {
//   try {
//     const creator = req.user;
//     const { userId, username, password, role, superior } = req.body;

//     if (!["manager", "executive"].includes(role)) {
//       return res.status(400).json({ message: "Invalid role" });
//     }

//     const existing = await User.findOne({ userId });
//     if (existing) {
//       return res.status(400).json({ message: "UserId already exists" });
//     }

//     const newUser = await User.create({
//       userId,
//       username,
//       password, // 🔴 PLAIN TEXT
//       role,
//       company: creator.company,
//       superior: superior || creator._id,
//     });

//     res.status(201).json({
//       message: "User created successfully",
//       user: newUser,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

/* =========================
   SEARCH USERS
========================= */
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const company = req.user.company;

    const users = await User.find({
      company,
      $or: [
        { userId: { $regex: q, $options: "i" } },
        { username: { $regex: q, $options: "i" } },
      ],
    }).select("_id userId username role");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// /* =========================
//    RESET PASSWORD (NO HASH)
// ========================= */
// exports.resetPassword = async (req, res) => {
//   try {
//     const requester = req.user;
//     const { id } = req.params;
//     const { newPassword, oldPassword } = req.body;

//     if (!newPassword || newPassword.length < 6) {
//       return res.status(400).json({
//         message: "Password must be at least 6 characters",
//       });
//     }

//     const targetUser = await User.findOne({
//       _id: id,
//       company: requester.company,
//     });

//     if (!targetUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // SELF RESET
//     if (requester._id.toString() === id) {
//       if (!oldPassword) {
//         return res.status(400).json({ message: "Old password is required" });
//       }

//       if (oldPassword !== targetUser.password) {
//         return res.status(401).json({ message: "Old password is incorrect" });
//       }
//     }
//     // ADMIN / MANAGER RESET
//     else {
//       if (!["admin", "manager"].includes(requester.role)) {
//         return res.status(403).json({
//           message: "Not authorized to reset this password",
//         });
//       }

//       if (
//         requester.role === "manager" &&
//         targetUser.superior?.toString() !== requester._id.toString()
//       ) {
//         return res.status(403).json({
//           message: "Managers can reset only their subordinates",
//         });
//       }
//     }

//     targetUser.password = newPassword;
//     await targetUser.save();

//     res.json({ message: "Password reset successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



/* =========================
   RESET PASSWORD (DIRECT EDIT - NO OLD PASSWORD)
========================= */
// exports.resetPassword = async (req, res) => {
//   try {
//     const requester = req.user;
//     const { id } = req.params;
//     const { newPassword } = req.body;

//     if (!newPassword || newPassword.length < 6) {
//       return res.status(400).json({
//         message: "Password must be at least 6 characters",
//       });
//     }

//     const targetUser = await User.findOne({
//       _id: id,
//       company: requester.company,
//     });

//     if (!targetUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // AUTHORIZATION CHECK
//     if (requester._id.toString() !== id) {
//       // If not self → must be admin or manager
//       if (!["admin", "manager"].includes(requester.role)) {
//         return res.status(403).json({
//           message: "Not authorized to reset this password",
//         });
//       }

//       // Manager can only edit subordinates
//       if (
//         requester.role === "manager" &&
//         targetUser.superior?.toString() !== requester._id.toString()
//       ) {
//         return res.status(403).json({
//           message: "Managers can reset only their subordinates",
//         });
//       }
//     }

//     // DIRECT UPDATE
//     targetUser.password = newPassword;
//     await targetUser.save();

//     res.json({ message: "Password updated successfully" });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// exports.resetPassword = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { newPassword } = req.body;

//     if (!newPassword || newPassword.length < 6) {
//       return res.status(400).json({
//         message: "Password must be at least 6 characters",
//       });
//     }

//     const targetUser = await User.findById(id);

//     if (!targetUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     targetUser.password = newPassword;
//     await targetUser.save();

//     res.json({ message: "Password updated successfully" });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



exports.resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    // 🔎 Validate only if password field is missing
    if (newPassword === undefined) {
      return res.status(400).json({
        message: "New password is required",
      });
    }

    const targetUser = await User.findById(id);

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ✏️ Update password (no length restriction)
    targetUser.password = newPassword;
    await targetUser.save();

    return res.status(200).json({
      message: "Password updated successfully",
    });

  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({
      message: "Server error while updating password",
    });
  }
};


/* =========================
   RESET USERNAME
========================= */
exports.resetUsername = async (req, res) => {
  try {
    const requester = req.user;
    const { id } = req.params;
    const { username } = req.body;

    if (!["admin", "manager"].includes(requester.role)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!username?.trim()) {
      return res.status(400).json({ message: "Username is required" });
    }

    const user = await User.findOne({
      _id: id,
      company: requester.company,
      isActive: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username.trim();
    await user.save();

    res.json({ message: "Username updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   RESET USER ID
========================= */
exports.resetUserId = async (req, res) => {
  try {
    const requester = req.user;
    const { id } = req.params;
    const { newUserId } = req.body;

    if (!["admin", "manager"].includes(requester.role)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!newUserId?.trim()) {
      return res.status(400).json({ message: "New userId is required" });
    }

    const existing = await User.findOne({ userId: newUserId });
    if (existing) {
      return res.status(400).json({ message: "UserId already exists" });
    }

    const user = await User.findOne({
      _id: id,
      company: requester.company,
      isActive: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.userId = newUserId.trim();
    await user.save();

    res.json({ message: "UserId updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

