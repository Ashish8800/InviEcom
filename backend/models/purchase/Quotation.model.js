const mongoose = require("mongoose");
const { MODEL_DEFAULT_FIELDS } = require("../../configs");

const schema = new mongoose.Schema({
  ...MODEL_DEFAULT_FIELDS,
  // Event
  rfqId: String,
  venderQuotationId: String,
  quotationDate: String,
  quotationValidity: String,
  quotationCurrency: String,
  quotationFiles: [],
  items: [
    {
      ipn: String,
      itemType: String,
      suggestedIpn: String,
      requestedQty: String,
      quotedQuantity: String,
      partNo: String,
      minimumQuantity: String,
      quotedLeadTime: String,
      quotedUnitPrice: String,
    },
  ],
  paymentTerm: String,
  paymentTermsEvents: [
    {
      event: String,
      amount: String,
    },
  ],
  quotationNumber: String,

});

schema.pre("save", function (next) {
  this.updatedOn = Date.now();
  next();
});

module.exports = mongoose.model("purchase_quotation", schema);
