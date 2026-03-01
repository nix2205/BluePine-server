// const XLSX = require("xlsx");
// const Doctor = require("../models/Doctor");

// exports.bulkUploadDoctors = async (req, res) => {
//   try {
//     const { userId } = req.body;

//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     if (!userId) {
//       return res.status(400).json({ message: "User ID required" });
//     }

//     // Read Excel from buffer
//     const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
//     const sheetName = workbook.SheetNames[0];
//     const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//     const doctorsToInsert = sheetData.map((row) => ({
//       user: userId,
//       listing: "listed",

//       rxx: row.rxx?.toString().toLowerCase() === "yes",

//       order: Number(row["S.No"] || row.sno || row.order) || 0,

//       doctorName: row.doctorName || row["Doctor Name"],

//       SPE: row.SPE || "-",
//       avgPD: Number(row.avgPD) || 0,
//       avgBusPM: Number(row.avgBusPM) || 0,
//       visitPlan: Number(row.visitPlan) || 0,
//       LYRS: Number(row.LYRS) || 0,
//       IMPinfo: row.IMPinfo || "-",
//       area: row.area || "-",
//       conv: row.conv || "-",
//       retention: row.retention || "-",
//     }));

//     // Filter out rows without doctorName
//     const filteredDoctors = doctorsToInsert.filter(
//       (doc) => doc.doctorName
//     );

//     await Doctor.insertMany(filteredDoctors);

//     res.status(201).json({
//       message: `${filteredDoctors.length} doctors uploaded successfully`,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };



// exports.addDoctor = async (req, res) => {
//   try {
//     const {
//       userId,
//       rxx,
//       doctorName,
//       SPE,
//       avgPD,
//       avgBusPM,
//       visitPlan,
//       LYRS,
//       IMPinfo,
//       area,
//       conv,
//       retention,
//     } = req.body;

//     if (!userId || !doctorName) {
//       return res.status(400).json({ message: "User and doctor name required" });
//     }

//     const newDoctor = await Doctor.create({
//       user: userId,
//       listing: "listed", // manual add = listed
//       rxx: rxx === "Yes" || rxx === true,

//       doctorName: doctorName.trim(),

//       SPE: SPE || "-",
//       avgPD: Number(avgPD) || 0,
//       avgBusPM: Number(avgBusPM) || 0,
//       visitPlan: Number(visitPlan) || 0,
//       LYRS: Number(LYRS) || 0,
//       IMPinfo: IMPinfo || "-",
//       area: area || "-",
//       conv: conv || "-",
//       retention: retention || "-",
//     });

//     res.status(201).json(newDoctor);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// exports.updateDoctor = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const updatedDoctor = await Doctor.findByIdAndUpdate(
//       id,
//       {
//         ...req.body,
//         rxx:
//           req.body.rxx === "Yes" ||
//           req.body.rxx === true ||
//           req.body.rxx === "yes",
//       },
//       { new: true, runValidators: true }
//     );

//     if (!updatedDoctor) {
//       return res.status(404).json({ message: "Doctor not found" });
//     }

//     res.json(updatedDoctor);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.deleteDoctor = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deletedDoctor = await Doctor.findByIdAndDelete(id);

//     if (!deletedDoctor) {
//       return res.status(404).json({ message: "Doctor not found" });
//     }

//     res.json({ message: "Doctor deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };



// exports.getDoctorsByUser = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const doctors = await Doctor.find({ user: userId }).sort({
//       doctorName: 1,
//     });

//     res.json(doctors);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };



// // exports.getFilteredDoctors = async (req, res) => {
// //   try {
// //     const { userId } = req.params;
// //     const { area, SPE, search, page, limit } = req.query;

// //     let query = { user: userId };

// //     // Filtering
// //     if (area) {
// //       query.area = area;
// //     }

// //     if (SPE) {
// //       query.SPE = SPE;
// //     }

// //     // Search by doctorName (case insensitive)
// //     if (search) {
// //       query.doctorName = { $regex: search, $options: "i" };
// //     }

// //     // Pagination logic
// //     const pageNumber = Number(page) || 1;
// //     const pageSize = Number(limit) || 0;

// //     let doctorsQuery = Doctor.find(query).sort({ doctorName: 1 });

// //     if (pageSize > 0) {
// //       doctorsQuery = doctorsQuery
// //         .skip((pageNumber - 1) * pageSize)
// //         .limit(pageSize);
// //     }

// //     const doctors = await doctorsQuery;

// //     res.json(doctors);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };







// exports.getFilteredDoctors = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { area, SPE, search, page = 1, limit = 10 } = req.query;

//     let query = { user: userId };

//     if (area) {
//       query.area = area;
//     }

//     if (SPE) {
//       query.SPE = SPE;
//     }

//     if (search) {
//       query.doctorName = { $regex: search, $options: "i" };
//     }

//     const pageNumber = Number(page);
//     const pageSize = Number(limit);

//     const totalDoctors = await Doctor.countDocuments(query);

//     const doctors = await Doctor.find(query)
//       .sort({ doctorName: 1 })
//       .skip((pageNumber - 1) * pageSize)
//       .limit(pageSize);

//     res.json({
//       total: totalDoctors,
//       page: pageNumber,
//       totalPages: Math.ceil(totalDoctors / pageSize),
//       limit: pageSize,
//       data: doctors,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

















const XLSX = require("xlsx");
const Doctor = require("../models/Doctor");


// ================= BULK UPLOAD =================
exports.bulkUploadDoctors = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Get current max order for this user (in case they upload again)
    const lastDoctor = await Doctor.findOne({ user: userId })
      .sort({ order: -1 });

    let baseOrder = lastDoctor ? lastDoctor.order : 0;

    const doctorsToInsert = sheetData
      .map((row, index) => ({
        user: userId,
        listing: "listed",

        rxx: row.rxx?.toString().toLowerCase() === "yes",

        // Respect S.No if provided, otherwise append sequentially
        order: Number(row["S.No"] || row.sno || row.order) 
          ? Number(row["S.No"] || row.sno || row.order)
          : baseOrder + index + 1,

        doctorName: row.doctorName || row["Doctor Name"],

        SPE: row.SPE || "-",
        avgPD: Number(row.avgPD) || 0,
        avgBusPM: Number(row.avgBusPM) || 0,
        visitPlan: Number(row.visitPlan) || 0,
        LYRS: Number(row.LYRS) || 0,
        IMPinfo: row.IMPinfo || "-",
        area: row.area || "-",
        conv: row.conv || "-",
        retention: row.retention || "-",
      }))
      .filter((doc) => doc.doctorName);

    await Doctor.insertMany(doctorsToInsert);

    res.status(201).json({
      message: `${doctorsToInsert.length} doctors uploaded successfully`,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= ADD DOCTOR (APPEND TO BOTTOM) =================
exports.addDoctor = async (req, res) => {
  try {
    const {
      userId,
      rxx,
      doctorName,
      SPE,
      avgPD,
      avgBusPM,
      visitPlan,
      LYRS,
      IMPinfo,
      area,
      conv,
      retention,
    } = req.body;

    if (!userId || !doctorName) {
      return res.status(400).json({ message: "User and doctor name required" });
    }

    // Get highest order for that user
    const lastDoctor = await Doctor.findOne({ user: userId })
      .sort({ order: -1 });

    const newOrder = lastDoctor ? lastDoctor.order + 1 : 1;

    const newDoctor = await Doctor.create({
      user: userId,
      listing: "listed",
      order: newOrder,

      rxx:
        rxx === "Yes" ||
        rxx === true ||
        rxx === "yes",

      doctorName: doctorName.trim(),

      SPE: SPE || "-",
      avgPD: Number(avgPD) || 0,
      avgBusPM: Number(avgBusPM) || 0,
      visitPlan: Number(visitPlan) || 0,
      LYRS: Number(LYRS) || 0,
      IMPinfo: IMPinfo || "-",
      area: area || "-",
      conv: conv || "-",
      retention: retention || "-",
    });

    res.status(201).json(newDoctor);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= UPDATE DOCTOR =================
exports.updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      {
        ...req.body,
        rxx:
          req.body.rxx === "Yes" ||
          req.body.rxx === true ||
          req.body.rxx === "yes",
      },
      { new: true, runValidators: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(updatedDoctor);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= DELETE DOCTOR =================
exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDoctor = await Doctor.findByIdAndDelete(id);

    if (!deletedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({ message: "Doctor deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= GET DOCTORS (ORDERED) =================
exports.getDoctorsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const doctors = await Doctor.find({ user: userId })
      .sort({ order: 1 });   // IMPORTANT: Always sort by order

    res.json(doctors);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= REORDER DOCTORS =================
exports.reorderDoctors = async (req, res) => {
  try {
    const { updates } = req.body; 
    // Expected format:
    // updates: [{ id: "...", order: 1 }, { id: "...", order: 2 }]

    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ message: "Invalid reorder data" });
    }

    const bulkOps = updates.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order },
      },
    }));

    await Doctor.bulkWrite(bulkOps);

    res.json({ message: "Order updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};