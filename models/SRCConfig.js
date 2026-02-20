const mongoose = require("mongoose");

const srcConfigSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  RsPerKm: {
    type: Number,
    default: 0,
  },

  DAperStation: {
    HQ: { type: Number, default: 0 },
    EX: { type: Number, default: 0 },
    OS: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model("SRCConfig", srcConfigSchema);
