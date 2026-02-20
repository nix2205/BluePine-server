const Announcement = require("../models/Announcement");
const User = require("../models/User");

/* =========================
   CREATE OR UPDATE
========================= */
exports.upsertAnnouncement = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message required" });
    }

    const superiorId = req.user._id; // assuming auth middleware sets req.user

    let announcement = await Announcement.findOne({ superior: superiorId });

    if (announcement) {
      announcement.message = message.trim();
      announcement.version += 1;
      await announcement.save();
    } else {
      announcement = await Announcement.create({
        superior: superiorId,
        message: message.trim(),
      });
    }

    res.json({
      message: "Announcement saved",
      version: announcement.version,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   CHECK ANNOUNCEMENT
========================= */
exports.checkAnnouncement = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.superior) {
      return res.json({ show: false });
    }

    const announcement = await Announcement.findOne({
      superior: user.superior,
    });

    if (!announcement) {
      return res.json({ show: false });
    }

    if (announcement.version > user.lastSeenAnnouncementVersion) {
      return res.json({
        show: true,
        message: announcement.message,
        version: announcement.version,
      });
    }

    return res.json({ show: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   ACKNOWLEDGE
========================= */
exports.acknowledgeAnnouncement = async (req, res) => {
  try {
    const { version } = req.body;

    if (version === undefined) {
      return res.status(400).json({ message: "Version required" });
    }

    await User.findByIdAndUpdate(req.user._id, {
      lastSeenAnnouncementVersion: version,
    });

    res.json({ message: "Acknowledged" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};