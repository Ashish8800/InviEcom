const mongoose = require("mongoose");
const { MODEL_DEFAULT_FIELDS } = require("../../configs");

const TermsAndConditionSchema = new mongoose.Schema({
 
  ...MODEL_DEFAULT_FIELDS,
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  scope: Array,
  default: Boolean,
  
});

TermsAndConditionSchema.pre("save", function (next) {
  this.updatedOn = Date.now();
  next();
});

module.exports = mongoose.model("settings_terms_and_conditions", TermsAndConditionSchema);
