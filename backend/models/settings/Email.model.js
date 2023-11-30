const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  id: { type: String, required: true },
  host: { type: String, required: true },
  port: { type: String, required: true },
  email: { type: String, required: true ,unique: true},
  password: { type: String, required: true },
  default: { type: Boolean},
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

emailSchema.pre("save", function (next) {
  this.updatedOn = Date.now();
  next();
});

module.exports = mongoose.model("email", emailSchema);
