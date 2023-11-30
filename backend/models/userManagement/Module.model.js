const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    immutable: true,
  },
  name: {
    type: String,
  },
  group: {
    type: String,
    unique: true,
  },
  permission: [{ type: String }],
  status: {
    type: String,
    default: "active",
    enum: ["active", "inactive", "deleted", "closed"],
    required: true,
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

const model = mongoose.model("module", schema);
module.exports = model;
