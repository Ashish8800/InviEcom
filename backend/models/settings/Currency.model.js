const mongoose = require("mongoose");

const currencySchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true,unique: true},
  symbol: { type: String, required: true },
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

currencySchema.pre("save", function (next) {
  this.updatedOn = Date.now();
  next();
});

module.exports = mongoose.model("currency", currencySchema);
