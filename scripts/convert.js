require("dotenv").config();
const mongoose = require("mongoose");
const NormalExpense = require("../models/NormalExpense");
const OtherExpense = require("../models/OtherExpense");

mongoose.connect(process.env.MONGO_URI);

function convertUTCToIST(dateObj) {
  // Convert UTC → IST properly
  const istTime = new Date(
    dateObj.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  const day = String(istTime.getDate()).padStart(2, "0");
  const month = String(istTime.getMonth() + 1).padStart(2, "0");
  const year = istTime.getFullYear();

  return `${day}-${month}-${year}`;
}

async function migrateCollection(Model, name) {
  console.log(`Processing ${name}...`);

  const docs = await Model.find({
    date: { $type: "date" } // ONLY old Date entries
  });

  console.log(`${docs.length} documents to update`);

  for (let doc of docs) {
    const originalDate = doc.date;

    const formattedDate = convertUTCToIST(originalDate);

    // Direct DB update to bypass validation issues
    await Model.updateOne(
      { _id: doc._id },
      { $set: { date: formattedDate } }
    );
  }

  console.log(`${name} updated successfully.`);
}

async function run() {
  try {
    console.log("Starting migration...");

    await migrateCollection(NormalExpense, "NormalExpense");
    await migrateCollection(OtherExpense, "OtherExpense");

    console.log("All dates converted to DD-MM-YYYY (IST).");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();