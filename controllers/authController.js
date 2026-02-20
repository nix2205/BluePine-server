// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// exports.login = async (req, res) => {
//   try {
//     const { userId, password } = req.body || {};

//     // 1️⃣ Find user + company
//     const user = await User.findOne({ userId, isActive: true })
//       .populate("company");

//     if (!user) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // 2️⃣ Check password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // 3️⃣ Create token
//     const token = jwt.sign(
//       {
//         id: user._id,
//         role: user.role,
//         companyId: user.company._id,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     // 4️⃣ Send EVERYTHING frontend needs
//     res.json({
//       token,
//       user: {
//         id: user._id,
//         userId: user.userId,
//         username: user.username,
//         role: user.role,
//         company: {
//           id: user.company._id,
//           name: user.company.name,
//           logoUrl: user.company.logoUrl, // 👈 THIS IS IMPORTANT
//         },
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };




const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { userId, password } = req.body || {};

    const user = await User.findOne({ userId, isActive: true })
      .populate("company");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔴 DIRECT STRING MATCH
    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        companyId: user.company._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        userId: user.userId,
        username: user.username,
        role: user.role,
        company: {
          id: user.company._id,
          name: user.company.name,
          logoUrl: user.company.logoUrl,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
