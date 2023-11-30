const mongoose = require("mongoose");

const CustomerCartSchema = new mongoose.Schema({
  customerId: String,
  totalItems: Number,
  activeStep: Number,
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

});

CustomerCartSchema.pre("save", function (next) {
  this.updatedOn = Date.now();
  next();
});

module.exports = mongoose.model("customer_cart", CustomerCartSchema);
