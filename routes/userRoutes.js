// const express = require("express");
// const router = express.Router();

// const { protect, adminOnly } = require("../middleware/authMiddleware");
// const { managerOrAdmin } = require("../middleware/roleMiddleware");

// const {
//   getAllUsers,
//   getUserById,
//   createUser,
//   searchUsers,
//   resetPassword,
//   resetUsername,
//   resetUserId,
// } = require("../controllers/userController");

// const { getHierarchy } = require("../controllers/userHierarchyController");
// const { reassignSuperior } = require("../controllers/reassignController");

// // Create user
// router.post("/create", protect, adminOnly, createUser);

// // Search users
// router.get("/search", protect, searchUsers);

// // Hierarchy
// router.get("/hierarchy", protect, getHierarchy);

// // Reassign superior
// router.put("/reassign-superior", protect, adminOnly, reassignSuperior);

// // Self reset password (no need to send id from frontend)
// router.patch("/me/reset-password", protect, (req, res) => {
//   req.params.id = req.user._id;
//   resetPassword(req, res);
// });

// // Get user by id
// router.get("/:id", protect, managerOrAdmin, getUserById);



// // Reset password (self OR manager/admin)
// router.patch("/:id/reset-password", protect, resetPassword);

// // Reset username
// router.patch("/:id/reset-username", protect, managerOrAdmin, resetUsername);

// // Reset userId
// router.patch("/:id/reset-userid", protect, managerOrAdmin, resetUserId);

// // Get all users
// router.get("/", protect, managerOrAdmin, getAllUsers);

// module.exports = router;




const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");
const { managerOrAdmin } = require("../middleware/roleMiddleware");

const {
  getAllUsers,
  getUserById,
  createUser,
  searchUsers,
  resetPassword,
  resetUsername,
  resetUserId,
  deleteUser,
} = require("../controllers/userController");

const { getHierarchy } = require("../controllers/userHierarchyController");
const { reassignSuperior } = require("../controllers/reassignController");

// Create user
router.post("/create", protect, adminOnly, createUser);

// Search users
router.get("/search", protect, searchUsers);

// Hierarchy
router.get("/hierarchy", protect, getHierarchy);

// Reassign superior
router.put("/reassign-superior", protect, adminOnly, reassignSuperior);

router.delete("/:id", protect , deleteUser);

// 🔥 SELF RESET (must come before /:id routes)
router.patch("/me/reset-password", protect, (req, res) => {
  req.params.id = req.user._id.toString();
  resetPassword(req, res);
});

router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

// Dynamic routes
router.get("/:id", protect, managerOrAdmin, getUserById);

router.patch("/:id/reset-password", protect, resetPassword);

router.patch("/:id/reset-username", protect, managerOrAdmin, resetUsername);

router.patch("/:id/reset-userid", protect, managerOrAdmin, resetUserId);

router.get("/", protect, managerOrAdmin, getAllUsers);

module.exports = router;

