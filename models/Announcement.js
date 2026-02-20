const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  superior: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
    index: true,
  },

  message: {
    type: String,
    required: true,
  },

  version: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model("Announcement", announcementSchema);