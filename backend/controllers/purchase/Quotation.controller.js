const {
  requestSuccess,
  requestFail,
} = require("../../helpers/RequestResponse.helper");
const { PurchaseQuotation, RFQModel } = require("../../models");

const {
  generateId,
  getAdmin,
  paramProxy,
  generatePassword,
  generateNextSerialNumber,
} = require("../../helpers/Common.helper");
const {
  basicTablePipeline,
} = require("../../database/pipelines/purchase/Quotation.pipeline");
const QuotationModel = require("../../models/purchase/Quotation.model");

async function create(req, res) {
  let requestForm = req.body;

  const serialNumberId = await generateNextSerialNumber(PurchaseQuotation, 3);

  // generate a unique id for quotation
  const id = `QUO${new Date().getFullYear()}${(new Date().getMonth() + 1)
    .toString()
    .padStart(2, "0")}${new Date().getDate()}${serialNumberId}`;

  // add missing detail in the quotation object
  requestForm.id = id;
  requestForm.createdBy = req.user.id;
  requestForm.updatedBy = req.user.id;

  // Now try to create a new quotation
  try {
    await new PurchaseQuotation(requestForm).save();
    await RFQModel.updateOne(
      { id: requestForm.rfqId },
      { $set: { status: "receive" } }
    );
    return requestSuccess(res);
  } catch (error) {
    print(error);
  }

  return requestFail(res, "Something went wrong, Can't create quotation now.");
}

async function list(req, res) {
  let list = await PurchaseQuotation.aggregate(basicTablePipeline());

  if (list && list.length > 0) {
    return requestSuccess(res, list);
  }

  return requestFail(res);
}

async function get(req, res) {
  // Verify request contained a quotation id
  if (!req.params.id) {
    return requestFail(res, "Invalid quotation id");
  }

  // Fetch quotation detail form database
  const list = await QuotationModel.findOne(
    { status: { $ne: "deleted" }, id: req.params.id },
    ["-_id", "-__v"]
  );

  // Check we got some result form the database or not
  // if get some result form database the send back to client
  if (list) {
    return requestSuccess(res, list);
  }

  // fail request if nothing worked
  return requestFail(res, "Can't find quotation");
}

async function update(req, res) {
  // Verify request contained a quotation id
  if (!req.params.id) {
    return requestFail(res, "Invalid quotation id");
  }

  // store all request data into quotation var
  let quotation = req.body;

  let ADMIN = await getAdmin();

  // update entry who is updating the field
  quotation.updatedBy = ADMIN.id;

  if (quotation.id && req.params.id != quotation.id)
    requestFail(res, "Something went wrong, Can't update quotation");

  delete quotation.id;

  // find quotation as per name
  // let dbQuotation = await QuotationModel.findOne({ name: quotation.name });

  // if (dbQuotation) {
  //   if (dbQuotation.id != req.params.id)
  //     requestFail(res, "Quotation already in use");
  // } 

  QuotationModel.updateOne(
    { id: req.params.id },
    { $set: { ...quotation } },
    (error, result) => {
      if (!error) {
        return requestSuccess(res);
      } else {
        return requestFail(res, "Can't delete quotation now");
      }
    }
  );
}

function basicTable() {
  // TODO:
  // columns : id,rfqId,venderName,components,quotationDate, addedOn, addedOn
}

module.exports = {
  create,
  list,
  get,
  update,
};
