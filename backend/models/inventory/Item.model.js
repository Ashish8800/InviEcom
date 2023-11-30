const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  id: { type: String, required: true },

  ipn: String,
  shortDescription: String,
  description: String,
  categoryId: String,
  unit: String,
  subcategoryId: String,
  thumbnail: String,
  files: [],
  attribute: [],
  otherAttribute: [
    {
      type: { type: String },
      description: String,
    },
  ],
  manufacturer: [
    {
      id: String,

      name: String,
      mpn:String,

      datasheet: String,
    },
  ],
  forSale: Boolean,
  forPurchase: Boolean,

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
