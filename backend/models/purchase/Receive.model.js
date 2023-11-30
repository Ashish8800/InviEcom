const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    immutable: true,
    required: true,
  },
  paidAmount: {
    type: String,
  },
  paymentMode: {
    type: String,
  },
  paidToVendor: {
    type: String,
  },
  paymentDate: {
    type: Date,
  },
  receiveDate: {
    type: Date,
  },
  purchaseOrderId: {
    type: String,
  },
  comment: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  status: {
    type: String,
    default: "active",
    enum: [
      "active",
      "inactive",
      "deleted",
      "closed",
      "approved",
      "pending",
      "rejected",
    ],
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

module.exports = mongoose.model("purchase_receive", schema);
