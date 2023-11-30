const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  buy: { type: String, required: true },

  company: {
    type: String,
  },
  designation: {
    type: String,
  },
  industry: {
    type: String,
  },
  customer: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  status: {
    type: String,
    default: "active",
    enum: ["active", "inactive", "deleted", "closed"],
    required: true,
  },

  createdOn: { type: Date, default: Date.now(), required: true },
  updatedOn: { type: Date, default: Date.now(), required: true },
});

contactSchema.pre("save", function (next) {
  this.updatedOn = Date.now();
  next();
});

module.exports = mongoose.model("web_contact", contactSchema);
