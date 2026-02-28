const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".xlsx" && ext !== ".xls") {
      return cb(new Error("Only Excel files are allowed"));
    }
    cb(null, true);
  },
});

module.exports = upload;