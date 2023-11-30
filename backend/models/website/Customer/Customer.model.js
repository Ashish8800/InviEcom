const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  mobile: {
    type: String,
  },
  role: {
    type: String,
  },
  organization: {
    type: String,
  },
  country: {
    type: String,
  },
  billing: {
    address: String,
    city: String,
    state: String,
    country: String,
    
  },
  shipping: {
    address: String,
    city: String,
    state: String,
    country: String,
    
  },
  password: String,
  status: {
    type: String,
    default: "active",
    enum: ["active", "inactive", "deleted", "closed"],
    required: true,
  },
  emailVerified: {
    type: Boolean,
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

customerSchema.pre("save", function (next) {
  this.updatedOn = Date.now();
  next();
});

module.exports = mongoose.model("customer", customerSchema);
