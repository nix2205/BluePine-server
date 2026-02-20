// // // const mongoose = require("mongoose");

// // // const approvalSchema = new mongoose.Schema(
// // //   {
// // //     user: {
// // //       type: mongoose.Schema.Types.ObjectId,
// // //       ref: "User",
// // //       required: true,
// // //       index: true,
// // //     },

// // //     // First day of the month (e.g. 2026-01-01)
// // //     month: {
// // //       type: Date,
// // //       required: true,
// // //       index: true,
// // //     },

// // //     normalExpTotal: {
// // //       type: Number,
// // //       default: 0,
// // //     },

// // //     otherExpTotal: {
// // //       type: Number,
// // //       default: 0,
// // //     },

// // //     approvedByUser: {
// // //       type: Boolean,
// // //       default: false,
// // //     },

// // //     approvedBySuperior: {
// // //       type: Boolean,
// // //       default: false,
// // //     },
// // //   },
// // //   { timestamps: true }
// // // );

// // // // Ensure ONE approval per user per month
// // // approvalSchema.index({ user: 1, month: 1 }, { unique: true });

// // // module.exports = mongoose.model("Approval", approvalSchema);



// // const mongoose = require("mongoose");

// // const approvalSchema = new mongoose.Schema(
// //   {
// //     user: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "User",
// //       required: true,
// //       index: true,
// //     },

// //     // First day of the month (e.g. 2026-01-01)
// //     month: {
// //       type: Date,
// //       required: true,
// //       index: true,
// //     },

// //     normalExpTotal: {
// //       type: Number,
// //       default: 0,
// //     },

// //     otherExpTotal: {
// //       type: Number,
// //       default: 0,
// //     },

// //     lastReported: {
// //       type: Date,
// //     },

// //     approvedByUser: {
// //       type: Boolean,
// //       default: false,
// //     },

// //     approvedBySuperior: {
// //       type: Boolean,
// //       default: false,
// //     },
// //   }
// // );

// // // Ensure ONE approval per user per month
// // approvalSchema.index({ user: 1, month: 1 }, { unique: true });

// // module.exports = mongoose.model("Approval", approvalSchema);






// const mongoose = require("mongoose");

// const approvalSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       index: true,
//     },

//     // Store as JAN, FEB, MAR etc
//     month: {
//       type: String,
//       required: true,
//       index: true,
//     },

//     normalExpTotal: {
//       type: Number,
//       default: 0,
//     },

//     otherExpTotal: {
//       type: Number,
//       default: 0,
//     },

//     // Store as dd/mm/yy
//     lastReported: {
//       type: String,
//     },

//     approvedByUser: {
//       type: Boolean,
//       default: false,
//     },

//     approvedBySuperior: {
//       type: Boolean,
//       default: false,
//     },
//   }
// );

// // One approval per user per month
// approvalSchema.index({ user: 1, month: 1 }, { unique: true });

// module.exports = mongoose.model("Approval", approvalSchema);








const mongoose = require("mongoose");

const approvalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Store as JAN, FEB, MAR etc
    month: {
      type: String,
      required: true,
      index: true,
    },

    // ✅ NEW FIELD
    // Number of NW entries submitted in that month
    NWdays: {
      type: Number,
      default: 0,
    },

    // Store as dd/mm/yy
    lastReported: {
      type: String,
    },

    approvedByUser: {
      type: Boolean,
      default: false,
    },

    approvedBySuperior: {
      type: Boolean,
      default: false,
    },
  }
);

// One approval per user per month
approvalSchema.index({ user: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Approval", approvalSchema);
