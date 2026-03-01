const mongoose = require("mongoose");
require("dotenv").config();

const SRC = require("../models/SRC");

async function fixSRCOrigin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB...");

    // Find all SRC without originUser
    const docs = await SRC.find({ originUser: { $exists: false } });

    console.log("Documents to fix:", docs.length);

    for (const doc of docs) {
      doc.originUser = doc.user;
      await doc.save();
    }

    console.log("Migration completed successfully.");
    process.exit(0);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

fixSRCOrigin();