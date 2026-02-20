const mongoose = require("mongoose");

const normalExpenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Reporting date (used for grouping, approvals)
    date: {
      type: Date,
      required: true,
      index: true,
    },

    // Reporting time (UI display, not calculations)
    time: {
      type: String,
      required: true,
    },

    placeOfWork: {
      type: String,
      required: true,
      trim: true,
    },

    station: {
      type: String,
      enum: ["HQ", "EX", "OS", "-"], // "-" allowed for NW
      required: true,
    },

    // Actual travelled kms for the day
    kms: {
      type: Number,
      required: true,
    },

    MOT: {
      type: String,
      enum: ["Local", "Bike", "Bus", "Train", "-"], // updated + "-" allowed
      required: true,
    },

    // Allowances
    TA: {
      type: Number,
      default: 0,
    },

    DA: {
      type: Number,
      default: 0,
    },

    ExtraTA: {
      type: Number,
      default: 0,
    },

    taDesc: {
      type: String,
      default: "",
    },

    ExtraDA: {
      type: Number,
      default: 0,
    },

    daDesc: {
      type: String,
      default: "",
    },

    workType: {
      type: String,
      enum: ["FW", "NFW", "NW"],
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NormalExpense", normalExpenseSchema);
