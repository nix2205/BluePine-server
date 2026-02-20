// const express = require("express");
// const Company = require("../models/Company");

// const router = express.Router();

// router.post("/company", async (req, res) => {
//   const { name, logoUrl } = req.body;

//   const company = await Company.create({ name, logoUrl });
//   res.json(company);
// });

// module.exports = router;


const User = require("../models/User");
const bcrypt = require("bcryptjs");
const express = require("express");

const router = express.Router(); // ✅ THIS LINE WAS MISSING

router.post("/user", async (req, res) => {
  const { userId, username, password, role, company } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    userId,
    username,
    password: hashedPassword,
    role,
    company,
  });

  res.json(user);
});

module.exports = router; // 🔴 THIS LINE IS CRITICAL
