const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    immutable: true,
    required: true,
  },
  comment: String,
  thumbnail: String,
  purchaseOrderId: String,
  invoiceApprover: String,
  totalAmount: String,
  invoiceApproverDate: {
    type: String,
    default: null,
  },
  invoiceApproverComment: String,
  paidAmount: String,
  paymentDate: String,
  paymentMode: String,
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
      "purchase_received",
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

module.exports = mongoose.model("purchase_invoice", schema);
