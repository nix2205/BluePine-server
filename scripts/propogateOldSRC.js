const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/User");
const SRC = require("../models/SRC");
const SRCConfig = require("../models/SRCConfig");

async function runMigration() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");

  const allSRCs = await SRC.find();

  for (const src of allSRCs) {

    let currentUser = await User
      .findById(src.user)
      .select("superior");

    const visited = new Set(); // prevent infinite loops

    while (currentUser?.superior) {

      const superiorId = currentUser.superior.toString();

      if (visited.has(superiorId)) break;
      visited.add(superiorId);

      // 🔒 Strong duplicate check (match your real schema)
      const exists = await SRC.findOne({
        user: superiorId,
        placeOfWork: src.placeOfWork.trim(),
        station: src.station,
        MOT: src.station === "HQ" ? "Local" : src.MOT,
      });

      if (!exists) {

        const config =
          (await SRCConfig.findOne({ user: superiorId })) ||
          (await SRCConfig.findOne({ user: src.user }));

        const newSRC = new SRC({
          user: superiorId,
          placeOfWork: src.placeOfWork.trim(),
          station: src.station,
          radius: src.radius,
          kms: src.station === "HQ" ? 0 : src.kms,
          MOT: src.station === "HQ" ? "Local" : src.MOT,
          RsPerKmOverride: src.RsPerKmOverride ?? null,
          DAOverride: src.DAOverride ?? null,
        });

        await newSRC.save();
        console.log(`Created SRC for superior: ${superiorId}`);
      }

      currentUser = await User
        .findById(superiorId)
        .select("superior");
    }
  }

  console.log("Migration complete ✅");
  process.exit();
}

runMigration().catch(err => {
  console.error(err);
  process.exit(1);
});