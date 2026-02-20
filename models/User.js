const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Company-issued unique ID (login identifier)
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true, // faster lookups
    },

    // Display name (can repeat)
    username: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "manager", "executive"],
      required: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    // Hierarchy
    superior: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastSeenAnnouncementVersion: {
  type: Number,
  default: 0,
}

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
