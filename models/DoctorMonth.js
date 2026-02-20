const mongoose = require("mongoose");

const doctorMonthSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // First day of month
    month: {
      type: Date,
      required: true,
      index: true,
    },

    // Dates of interaction within the month
    dates: [
      {
        type: Date,
      },
    ],

    type: {
      type: String,
      enum: ["call", "record", "camp"],
      required: true,
    },
  },
  { timestamps: true }
);

// One doctor entry per month
doctorMonthSchema.index({ doctor: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("DoctorMonth", doctorMonthSchema);
