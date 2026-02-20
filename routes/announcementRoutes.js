// const express = require("express");
// const router = express.Router();
// const {
//   upsertAnnouncement,
//   checkAnnouncement,
//   acknowledgeAnnouncement,
// } = require("../controllers/announcementController");

// const requireAuth = require("../middleware/requireAuth");

// // Admin / Manager
// router.post("/upsert", requireAuth, upsertAnnouncement);

// // Executive
// router.get("/check", requireAuth, checkAnnouncement);
// router.post("/ack", requireAuth, acknowledgeAnnouncement);

// module.exports = router;


const express = require("express");
const router = express.Router();

const {
  upsertAnnouncement,
  checkAnnouncement,
  acknowledgeAnnouncement,
} = require("../controllers/announcementController");

const { protect } = require("../middleware/authMiddleware");

// Admin / Manager
router.post("/upsert", protect, upsertAnnouncement);

// Executive
router.get("/check", protect, checkAnnouncement);
router.post("/ack", protect, acknowledgeAnnouncement);

module.exports = router;