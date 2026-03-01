const SRC = require("../models/SRC");
const SRCConfig = require("../models/SRCConfig");

async function calculateFWExpense(userId, placeOfWork, MOT) {
  const src = await SRC.findOne({
    user: userId,
    placeOfWork,
    MOT,
  });

  if (!src) {
    throw new Error("No SRC found for this place and MOT");
  }

  const srcConfig = await SRCConfig.findOne({ user: userId });

  if (!srcConfig) {
    throw new Error("SRC Config not found");
  }

  const station = src.station;
  const kms = src.kms;

  const rsPerKm =
    src.RsPerKmOverride !== null
      ? src.RsPerKmOverride
      : srcConfig.RsPerKm;

  const TA =
    src.TAOverride ?? (kms * rsPerKm);

  const DA =
    src.DAOverride !== null
      ? src.DAOverride
      : srcConfig.DAperStation[station] || 0;

  const total = TA + DA;

  return {
    station,
    kms,
    TA,
    DA,
    total,
  };
}

module.exports = calculateFWExpense;
