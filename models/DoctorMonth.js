// // const mongoose = require("mongoose");

// // const doctorMonthSchema = new mongoose.Schema(
// //   {
// //     doctor: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "Doctor",
// //       required: true,
// //       index: true,
// //     },

// //     user: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "User",
// //       required: true,
// //       index: true,
// //     },

// //     // First day of month
// //     month: {
// //       type: Date,
// //       required: true,
// //       index: true,
// //     },

// //     // Dates of interaction within the month
// //     dates: [
// //       {
// //         type: Date,
// //       },
// //     ],

// //     type: {
// //       type: String,
// //       enum: ["call", "record", "camp"],
// //       required: true,
// //     },
// //   },
// //   { timestamps: true }
// // );

// // // One doctor entry per month
// // doctorMonthSchema.index({ doctor: 1, month: 1 }, { unique: true });

// // module.exports = mongoose.model("DoctorMonth", doctorMonthSchema);





// const mongoose = require("mongoose");

// const doctorMonthSchema = new mongoose.Schema(
//   {
//     doctor: {
//       type: String,   // Changed from ObjectId to String
//       required: true,
//       trim: true,
//       index: true,
//     },

//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       index: true,
//     },

//     // Superior of the user creating this entry
//     joint: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//       index: true,
//     },

//     // First day of month
//     month: {
//       type: Date,
//       required: true,
//       index: true,
//     },

//     // Dates of interaction within the month
//     dates: [
//       {
//         type: Date,
//       },
//     ],

//     type: {
//       type: String,
//       enum: ["call", "record", "camp"],
//       required: true,
//     },
//   }
// );

// // One doctor entry per month per user
// doctorMonthSchema.index({ doctor: 1, user: 1, month: 1 }, { unique: true });

// module.exports = mongoose.model("DoctorMonth", doctorMonthSchema);




const mongoose = require("mongoose");

const doctorMonthSchema = new mongoose.Schema(
  {
    doctor: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    joint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    month: {
      type: Date,
      required: true,
      index: true,
    },

    dates: [
      {
        type: Date,
      },
    ],

    type: {
      type: String,
      enum: ["call", "record", "camp"],
      required: true,
    },

    // 🔐 New Lock Field
    lock: {
      type: Boolean,
      default: false,
      index: true,
    },
  }
);

doctorMonthSchema.index(
  { doctor: 1, user: 1, month: 1 },
  { unique: true }
);

module.exports = mongoose.model("DoctorMonth", doctorMonthSchema);