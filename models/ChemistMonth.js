const mongoose = require("mongoose");

const chemistMonthSchema = new mongoose.Schema(
  {
    chemist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chemist",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // First day of the month
    month: {
      type: Date,
      required: true,
      index: true,
    },

    // Dates of interaction in this month
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

// One chemist entry per month per user
chemistMonthSchema.index({ chemist: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("ChemistMonth", chemistMonthSchema);
