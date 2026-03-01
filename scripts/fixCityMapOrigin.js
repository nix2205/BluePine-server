const mongoose = require("mongoose");
require("dotenv").config();

const CityMap = require("../models/CityMap");

async function fixCityMapOrigin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB...");

    const docs = await CityMap.find({ originUser: { $exists: false } });

    console.log("Documents to fix:", docs.length);

    for (const doc of docs) {
      doc.originUser = doc.user;
      await doc.save();
    }

    console.log("CityMap migration completed successfully.");
    process.exit(0);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

fixCityMapOrigin();