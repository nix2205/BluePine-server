const mongoose = require("mongoose");

const otherExpenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    date: {
  type: String,
  required: true,
  index: true,
  match: /^\d{2}-\d{2}-\d{4}$/, // DD-MM-YYYY
},

    amount: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    billNo: {
      type: String,
      default: "",
    },

    extraAmount: {
      type: Number,
      default: 0,
    },

    extraDescription: {
      type: String,
      default: "",
    },

    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OtherExpense", otherExpenseSchema);
