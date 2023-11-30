const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    immutable: true,
    required: true,
  },
  items: [
    {
      id: String,
      name: String,
      price: Number,
      quantity: Number,
      total: Number,
      ipn: String,
      manufacturer_name: String,
      manufacturer: String,
      mpn: String,
      shortDescription: String,
      status: String,
      rfq: Array,
    },
  ],
  files: [
    {
      type: {
        type: String,
      },
      name: String,
      preview: String,
    },
  ],

  indentor: String,
  discount: Number,
  taxes: Number,
  requestSource: String,
  requestSourceDetails: String,
  clientId: String,
  projectId: String,
  deliverTo: String,
  description: String,
  prApprover: String,
  prApproveDate: {
    type: String,
    default: null,
  },
  prApproveComment: String,
  thumbnail: String,
  total: String,
  deliveryDate: String,
  messages: [
    {
      id: String,
      user: String,
      userName: String,
      message: String,
      postedAt: {
        type: String,
        default: Date.now(),
      },
    },
  ],
  status: {
    type: String,
    default: "active",
    enum: [
      "active",
      "inactive",
      "deleted",
      "closed",
      "withdrawal",
      "approved",
      "pending",
      "correction",
      "rejected",
      "po_generated",
      "rfq_generated",
      "unknown",
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

schema.pre("updateOne", function (done) {
  this.set("updateOn", Date.now());

  // let isGenerated = null;
  // this.get("items")?.forEach((item) => {
  //   if (isGenerated === null) {
  //     isGenerated = item.status === "rfq_generated";
  //   } else {
  //     isGenerated = item.status === "rfq_generated" && isGenerated;
  //   }
  // });

  // if (isGenerated) this.set("status", "rfq_generated");

  done();
});

module.exports = mongoose.model("purchase_request", schema);
