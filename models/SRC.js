// // // const mongoose = require("mongoose");

// // // const srcSchema = new mongoose.Schema({
// // //   user: {
// // //     type: mongoose.Schema.Types.ObjectId,
// // //     ref: "User",
// // //     required: true,
// // //     index: true,
// // //   },

// // //   originUser: {
// // //   type: mongoose.Schema.Types.ObjectId,
// // //   ref: "User",
// // //   required: true,
// // //   index: true,
// // // },

// // //   placeOfWork: {
// // //     type: String,
// // //     required: true,
// // //     trim: true,
// // //   },

// // //   station: {
// // //     type: String,
// // //     enum: ["HQ", "EX", "OS"],
// // //     required: true,
// // //   },

// // //   radius: {
// // //     type: Number,
// // //     required: true,
// // //   },

// // //   kms: {
// // //     type: Number,
// // //     required: true,
// // //   },

// // //   MOT: {
// // //     type: String,
// // //     enum: ["Local", "Bike", "Bus", "Train"],
// // //     required: true,
// // //   },

// // //   RsPerKmOverride: {
// // //     type: Number,
// // //     default: null,
// // //   },

// // //   DAOverride: {
// // //     type: Number,
// // //     default: null,
// // //   },
// // // });

// // // module.exports = mongoose.model("SRC", srcSchema);





// // const mongoose = require("mongoose");

// // const srcSchema = new mongoose.Schema({
// //   user: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: "User",
// //     required: true,
// //     index: true,
// //   },

// //   originUser: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: "User",
// //     required: true,
// //     index: true,
// //   },

// //   placeOfWork: {
// //     type: String,
// //     required: true,
// //     trim: true,
// //   },

// //   station: {
// //     type: String,
// //     enum: ["HQ", "EX", "OS"],
// //     required: true,
// //   },

// //   radius: {
// //     type: Number,
// //     required: true,
// //   },

// //   kms: {
// //     type: Number,
// //     required: true,
// //   },

// //   MOT: {
// //     type: String,
// //     enum: ["Local", "Bike", "Bus", "Train"],
// //     required: true,
// //   },

// //   RsPerKmOverride: {
// //     type: Number,
// //     default: null,
// //   },

// //   DAOverride: {
// //     type: Number,
// //     default: null,
// //   },
// // });

// // module.exports = mongoose.model("SRC", srcSchema);








// const mongoose = require("mongoose");

// const srcSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//     index: true,
//   },

//   originUser: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//     index: true,
//   },

//   placeOfWork: {
//     type: String,
//     required: true,
//     trim: true,
//   },

//   station: {
//     type: String,
//     enum: ["HQ", "EX", "OS"],
//     required: true,
//   },

//   radius: {
//     type: Number,
//     required: true,
//   },

//   kms: {
//     type: Number,
//     required: true,
//   },

//   MOT: {
//     type: String,
//     enum: ["Local", "Bike", "Bus", "Train"],
//     required: true,
//   },

//   RsPerKmOverride: {
//     type: Number,
//     default: null,
//   },

//   TAOverride: {              // 🔥 Added this
//     type: Number,
//     default: null,
//   },

//   DAOverride: {
//     type: Number,
//     default: null,
//   },
// });

// module.exports = mongoose.model("SRC", srcSchema);














const mongoose = require("mongoose");

const srcSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  originUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  placeOfWork: {
    type: String,
    required: true,
    trim: true,
  },

  station: {
    type: String,
    enum: ["HQ", "EX", "OS", "-"],   // 🔥 allow "-"
    default: "-",
  },

  radius: {
    type: Number,
    default: 0,
  },

  kms: {
    type: Number,
    default: null,                  // 🔥 allow empty
  },

  MOT: {
    type: String,
    enum: ["Local", "Bike", "Bus", "Train", null],  // 🔥 allow null
    default: null,
  },

  RsPerKmOverride: {
    type: Number,
    default: null,
  },

  TAOverride: {
    type: Number,
    default: null,
  },

  DAOverride: {
    type: Number,
    default: null,
  },

}, { timestamps: true });

module.exports = mongoose.model("SRC", srcSchema);