const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  thumbnail: { type: String, default: "" },
  name: { type: String, required: true },
  category: [
    {
      id: { type: String },
      name: { type: String },
    },
  ],
  subcategory: [
    {
      id: { type: String },
      name: { type: String },
    },
  ],
  files: [
    {
      type: {
        type:String,
      },
      name: String,
      preview: String,
    },
  ],
  manufacturer: { type: String },
  unit: { type: String, required: true },
  length: { type: String },
  length_unit: { type: String },
  height: { type: String },
  height_unit: { type: String },
  width: { type: String },
  width_unit: { type: String },
  weight: { type: String },
  weight_unit: { type: String },
  ipn: { type: String },
  mpn: { type: String },
  ivpn: { type: String },
  hsn: { type: String },
  qlt: { type: String },
  upc: { type: String },
  detail: { type: String },
  isCompositeItem: { type: Boolean, default: false },
  compositeItems: [
    {
      id: { type: String, required: true },
      img: { type: String },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      total: { type: Number, required: true },
    },
  ],
  forSale: { type: Boolean },
  saleData: {
    price: { type: Number },
    description: { type: String },
  },
  forInternalPurchase: { type: Boolean },
  internalPurchaseData: {
    price: { type: Number },
    description: { type: String },
  },
  forExternalPurchase: { type: Boolean },
  externalPurchaseData: {
    price: { type: Number },
    description: { type: String },
  },
  warehouses: [
    {
      id: { type: String },
      currentStock: { type: Number },
      minStock: { type: Number },
    },
  ],
  status: {
    type: String,
    default: "active",
    enum: ["active", "inactive", "deleted", "closed"],
    required: true,
  },
  totalAvailableStock: String,
  createdOn: { type: Date, default: Date.now(), required: true },
  updatedOn: { type: Date, default: Date.now(), required: true },
  createdBy: { type: String, required: true },
  updatedBy: { type: String, required: true },
});

itemSchema.pre("save", function (next) {
  this.updatedOn = Date.now();
  next();
});

module.exports = mongoose.model("item", itemSchema);
