const express = require("express");
const router = express.Router();

const { login } = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");


router.post("/login", login);

router.get("/admin", protect, adminOnly, (req, res) => {
  res.json({
    message: "Welcome Admin 👑",
    user: req.user,
  });
});

module.exports = router;
