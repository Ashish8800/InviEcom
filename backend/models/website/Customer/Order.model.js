const mongoose = require("mongoose");

const CustomerOrderSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  customerId: String,
  totalItems: Number,
  shippingAddress: {
    name: String,
    mobile: String,
    address: String,
    city: String,
    state: String,
    country: String,
  },
  billingAddress: {
    name: String,
    mobile: String,
    address: String,
    city: String,
    state: String,
    country: String,
  },
  total: Number,
  subtotal: Number,
  discount: Number,
  tax: Number,
  shipping: Number,
  products: Array,
  paymentMode: String,
  paymentStatus: {
    type: String,
    default: "unpaid",
    enum: ["paid", "unpaid", "overdue"],
    required: true,
  },

  transactionId: {
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
      "placed",
      "canceled",
      "packed",
      "shipped",
      "delivered",
    ],
    required: true,
  },
  comment: String,
  createdOn: { type: Date, default: Date.now(), required: true },
  updatedOn: { type: Date, default: Date.now(), required: true },
  createdBy: { type: String, required: true },
  updatedBy: { type: String, required: true },
});

CustomerOrderSchema.pre("save", function (next) {
  this.updatedOn = Date.now();
  next();
});

module.exports = mongoose.model("customer_order", CustomerOrderSchema);
