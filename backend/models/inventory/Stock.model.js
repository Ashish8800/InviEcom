const mongoose = require("mongoose");
const { MODEL_DEFAULT_FIELDS } = require("../../configs");

const schema = new mongoose.Schema({
  ...MODEL_DEFAULT_FIELDS,
  ipn: {
    type: String,
    required: true,
  },
  warehouseId: {
    type: String,
  },
  warehouse: {
    type: String,
  },
  stock: {
    type: String,
  },
});

schema.pre("save", function (next) {
  this.updatedOn = Date.now();
  next();
});

module.exports = mongoose.model("stock", schema);
