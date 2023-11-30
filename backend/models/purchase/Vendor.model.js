const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    immutable: true,
    required: true,
  },
  salutation: String,
  firstName: String,
  lastName: String,
  companyName: String,
  vendorDisplayName: {
    type: String,
    unique: true,
  },
  vendorEmail: String,
  taxRate: String,
  currency: String,
  website: String,
  pan: String,
  billing: {
    address: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
  },
  shipping: {
    address: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
  },
  contactFirstName: String,
  contactLastName: String,
  contactEmail: String,
  contactNumber: String,
  phoneNumber: String,
  status: {
    type: String,
    default: "active",
    enum: ["active", "inactive", "deleted", "closed"],
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  updatedOn: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  updatedBy: {
    type: String,
    required: true,
  },
});

schema.pre("save", function (next) {
  this.updatedOn = Date.now();
  next();
});

module.exports = mongoose.model("vendor", schema);
