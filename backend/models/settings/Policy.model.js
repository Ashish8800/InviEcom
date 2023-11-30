const mongoose = require("mongoose");

const policySchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true ,unique: true},
  description: { type: String, required: true },
  effectiveDate: { type: String, required: true},
  status: {
    type: String,
    default: "active",
    enum: ["active", "inactive", "deleted", "closed"],
    required: true,
  },

  createdOn: { type: Date, default: Date.now(), required: true },
  updatedOn: { type: Date, default: Date.now(), required: true },
  createdBy: { type: String, required: true },
  updatedBy: { type: String, required: true },
});

policySchema.pre("save", function (next) {
  this.updatedOn = Date.now();
  next();
});

module.exports = mongoose.model("policy", policySchema);
