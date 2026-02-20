const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    rxx: {
      type: Boolean,
      default: false,
    },

    doctorName: {
      type: String,
      required: true,
    },

    SPE: {
      type: String,
      default: "",
    },

    avgPD: {
      type: Number,
      default: 0,
    },

    avgBusPM: {
      type: Number,
      default: 0,
    },

    visitPlan: {
      type: Number,
      default: 0,
    },

    LYRS: {
      type: Number,
      default: 0,
    },

    IMPinfo: {
      type: String,
      default: "",
    },

    area: {
      type: String,
      default: "",
    },

    conv: {
      type: String,
      default: "",
    },

    retention: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
