const SRCConfig = require("../models/SRCConfig");

/**
 * GET SRC CONFIG (create if not exists)
 * Used when loading SRC page
 */
exports.getSRCConfig = async (req, res) => {
  try {
    const { userId } = req.params;

    let config = await SRCConfig.findOne({ user: userId });

    // 🧠 Auto-create config if missing
    if (!config) {
      config = new SRCConfig({
        user: userId,
        RsPerKm: 0,
        DAperStation: { HQ: 0, EX: 0, OS: 0 },
      });
      await config.save();
    }

    res.json(config);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE Rs PER KM (GLOBAL)
 */
exports.updateRsPerKm = async (req, res) => {
  try {
    const { userId } = req.params;
    const { RsPerKm } = req.body;

    if (RsPerKm == null || RsPerKm < 0) {
      return res.status(400).json({ message: "Invalid RsPerKm value" });
    }

    const config = await SRCConfig.findOneAndUpdate(
      { user: userId },
      { RsPerKm },
      { new: true, upsert: true }
    );

    res.json({
      message: "Rs per Km updated successfully",
      config,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE DA FOR A STATION (HQ / EX / OS)
 */
exports.updateDAperStation = async (req, res) => {
  try {
    const { userId, station } = req.params;
    const { DA } = req.body;

    if (!["HQ", "EX", "OS"].includes(station)) {
      return res.status(400).json({ message: "Invalid station" });
    }

    if (DA == null || DA < 0) {
      return res.status(400).json({ message: "Invalid DA value" });
    }

    const config = await SRCConfig.findOneAndUpdate(
      { user: userId },
      { $set: { [`DAperStation.${station}`]: DA } },
      { new: true, upsert: true }
    );

    res.json({
      message: `${station} DA updated successfully`,
      config,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getMySRCConfig = async (req, res) => {
  try {
    const config = await SRCConfig.findOne({ user: req.user._id });

    if (!config) {
      return res.status(404).json({ message: "Config not found" });
    }

    res.json(config);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
