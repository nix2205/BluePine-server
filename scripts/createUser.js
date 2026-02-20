const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");
const Company = require("../models/Company");

(async () => {
  try {
    // 1️⃣ Connect DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // 2️⃣ Create or fetch company
    let company = await Company.findOne({ name: "BluePine Demo" });

    if (!company) {
      company = await Company.create({
        name: "Truchem",
        logoUrl: "", // optional
      });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash("TC2205", 10);

    // 4️⃣ Create admin user
    await User.create({
      userId: "TCadmin",   // 👈 COMPANY ISSUED ID
      username: "TCadmin",
      password: hashedPassword,
      role: "admin",
      company: company._id,
      superior: null,
      isActive: true,
    });

    console.log("Admin user created successfully 🌲");
    process.exit();
  } catch (error) {
    console.error("Error creating admin user:", error.message);
    process.exit(1);
  }
})();
