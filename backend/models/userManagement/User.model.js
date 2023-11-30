const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },

  phoneNumber: {
    type: String,
  },
  password: {
    type: String,
  },
  status: {
    type: String,
    default: "active",
  },

  address: {
    type: String,
  },
  avatarUrl: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: true,
  },
  pincode: {
    type: String,
  },
  role: {
    type: String,
  },

  resetToken: String,
  resetLimit: String,
  resetDate: {
    type: Date,
    default: null,
  },

  state: {
    type: String,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
  updatedOn: {
    type: Date,
    default: Date.now(),
  },
  createdBy: {
    type: String,
  },
  updatedBy: {
    type: String,
  },
});

schema.pre("save", function (next) {
  this.updatedOn = Date.now();
  next();
});

module.exports = mongoose.model("user", schema);
