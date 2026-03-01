const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  bulkUploadDoctors,
  addDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorsByUser,
} = require("../controllers/doctorController");

router.post("/bulk-upload", upload.single("file"), bulkUploadDoctors);
router.post("/", addDoctor);
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

router.get("/user/:userId", getDoctorsByUser);

module.exports = router;