// const mongoose = require("mongoose");

// const cityMapSchema = new mongoose.Schema(
//   {
//     city: {
//       type: String,
//       required: true,
//       unique: true,
//       index: true,
//     },

//     location: {
//       lat: {
//         type: Number,
//         required: true,
//       },
//       lon: {
//         type: Number,
//         required: true,
//       },
//     },

//     radiusKm: {
//       type: Number,
//       required: true,
//     },

//     address: {
//       type: String,
//       default: "",
//     },
    
//   },
// );

// module.exports = mongoose.model("CityMap", cityMapSchema);





const mongoose = require("mongoose");

const cityMapSchema = new mongoose.Schema({
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

  city: {
    type: String,
    required: true,
    trim: true,
  },

  location: {
    lat: {
      type: Number,
      required: true,
    },
    lon: {
      type: Number,
      required: true,
    },
  },

  radiusKm: {
    type: Number,
    required: true,
  },

  stationType: {
    type: String,
    enum: ["HQ", "EX", "OS"],
    required: true,
  },

  address: {
    type: String,
    default: "",
  },

  date: {
    type: Date,
    default: Date.now,
  },

  time: {
    type: String, // store formatted time if needed
    default: () => new Date().toLocaleTimeString(),
  },
});

module.exports = mongoose.model("CityMap", cityMapSchema);
