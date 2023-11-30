const mongoose = require("mongoose");
const { MODEL_DEFAULT_FIELDS } = require("../../configs");

const schema = new mongoose.Schema({
  ...MODEL_DEFAULT_FIELDS,
  prRequestId: String,
  vendorId: String,
  termAndCondition: String,
  predefinedTermsAndCondition: Array,
  additionalTermAndCondition: String,
  items: [
    {
      id: String,
      quantity: String,
      total: String,
      ipn: String,
      manufacturer: String,
      mpn: String,
      shortDescription: String,
    },
  ],
  pdf: String,
  pdfUrl: String,
  pdfBase64: String,
});

schema.pre("save", function (next) {
  this.updatedOn = Date.now();
  next();
});

module.exports = mongoose.model("purchase_rfq", schema);
