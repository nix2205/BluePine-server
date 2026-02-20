const mongoose = require("mongoose");

const chemistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
    },

    hosp: {
      type: String,
      default: "",
    },

    spec: {
      type: String,
      default: "",
    },

    area: {
      type: String,
      default: "",
    },

    town: {
      type: String,
      default: "",
    },

    impinfo: {
      type: String,
      default: "",
    },

    visitPlan: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model("Chemist", chemistSchema);
