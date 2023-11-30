const mongoose = require("mongoose");

const taxSchema = new mongoose.Schema({
  id: { type: String, required: true},
  gstEnabled:{ type: Boolean, required: true },
  gstNumber: String ,
  legalName: String ,
  tradeName: String ,
  registeredDate: String ,
  taxList: [
    {
      id: String ,
      name: String ,
      rate: String ,
    },
  ],
  createdOn: { type: Date, default: Date.now(), required: true },
  updatedOn: { type: Date, default: Date.now(), required: true },
  createdBy: { type: String, required: true },
  updatedBy: { type: String, required: true },
});

taxSchema.pre("save", function (next) {
  this.updatedOn = Date.now();
  next();
});

module.exports = mongoose.model("tax", taxSchema);
