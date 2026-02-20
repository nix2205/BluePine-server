exports.managerOrAdmin = (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "manager") {
    return next();
  }

  return res.status(403).json({
    message: "Access denied. Admin or Manager only.",
  });
};
