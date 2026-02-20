const User = require("../models/User");

/**
 * Build hierarchy recursively
 */
const buildTree = async (userId, company) => {
  const user = await User.findOne({
    _id: userId,
    company,
    isActive: true,
  }).select("_id userId username role superior");

  if (!user) return null;

  const subordinates = await User.find({
    superior: user._id,
    company,
    isActive: true,
  }).select("_id userId username role superior");

  const children = [];
  for (const sub of subordinates) {
    const childTree = await buildTree(sub._id, company);
    if (childTree) children.push(childTree);
  }

  return {
    _id: user._id,
    userId: user.userId,
    username: user.username,
    role: user.role,
    subordinates: children,
  };
};

/**
 * GET /users/hierarchy
 */
exports.getHierarchy = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const company = loggedInUser.company;

    // Admin → full tree (all top-level users)
    if (loggedInUser.role === "admin") {
      const roots = await User.find({
        company,
        superior: null,
        isActive: true,
      }).select("_id");

      const forest = [];
      for (const root of roots) {
        const tree = await buildTree(root._id, company);
        if (tree) forest.push(tree);
      }

      return res.json(forest);
    }

    // Manager / Executive → only their subtree
    const tree = await buildTree(loggedInUser._id, company);
    res.json(tree ? [tree] : []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load hierarchy" });
  }
};
