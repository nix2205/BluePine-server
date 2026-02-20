const mongoose = require("mongoose");

const srcSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  placeOfWork: {
    type: String,
    required: true,
    trim: true,
  },

  station: {
    type: String,
    enum: ["HQ", "EX", "OS"],
    required: true,
  },

  radius: {
    type: Number,
    required: true,
  },

  kms: {
    type: Number,
    required: true,
  },

  MOT: {
    type: String,
    enum: ["Local", "Bike", "Bus", "Train"],
    required: true,
  },

  RsPerKmOverride: {
    type: Number,
    default: null,
  },

  DAOverride: {
    type: Number,
    default: null,
  },
});

module.exports = mongoose.model("SRC", srcSchema);
