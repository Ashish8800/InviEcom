const {
  requestSuccess,
  requestFail,
} = require("../../helpers/RequestResponse.helper");
const { InvoiceModel, PurchaseOrderModel } = require("../../models");

const {
  generateId,
  getAdmin,
  paramProxy,
} = require("../../helpers/Common.helper");
const pipeline = require("../../database/pipelines/purchase/Invoice.pipeline");

async function list(req, res) {
  const query = await paramProxy(req.query);
  const list = await InvoiceModel.aggregate(pipeline({ ...query }));
  if (list && list.length > 0) {
    return requestSuccess(res, list);
  }
  return requestFail(res, "Can't find any invoice");
}

async function get(req, res) {
  const query = await paramProxy(req.query);

  // Verify request contained a project id
  if (!req.params.id) {
    return requestFail(res, "Invalid project id");
  }

  // Fetch project detail form database
  const list = await InvoiceModel.aggregate(
    pipeline({ id: req.params.id, ...query })
  );

  // Check we got some result form the database or not
  // if get some result form database the send back to client
  if (list && list.length > 0) {
    return requestSuccess(res, list[0]);
  }

  // fail request if nothing worked
  return requestFail(res, "Can't find project");
}

async function create(req, res) {
  // get current user
  let ADMIN = await getAdmin();

  // Get data and verify as per need
  let purchaseInvoiceObj = req.body;

  // generate a unique id for project
  const id = `PI${generateId(11)}`;

  // add missing detail in the project object
  purchaseInvoiceObj.id = id;
  purchaseInvoiceObj.status = "pending";
  purchaseInvoiceObj.createdBy = ADMIN.id;
  purchaseInvoiceObj.updatedBy = ADMIN.id;

  // Now try to create a new project
  try {
    await new InvoiceModel(purchaseInvoiceObj).save();
    PurchaseOrderModel.updateOne(
      {
        id: purchaseInvoiceObj.purchaseOrderId,
      },
      {
        $set: {
          status: "invoice_generated",
        },
      },
      (error, result) => {
        if (!error) {
          return requestSuccess(res);
        } else {
          return requestFail(
            res,
            "Something went wrong, Can't create invoice now"
          );
        }
      }
    );
  } catch (error) {
    print(error);
  }
}

async function update(req, res) {
  // Verify request contained a project id
  if (!req.params.id) {
    return requestFail(res, "Invalid project id");
  }

  // store all request data into project var
  let purchaseOrder = req.body;

  let ADMIN = await getAdmin();

  // update entry who is updating the field
  purchaseOrder.updatedBy = ADMIN.id;

  InvoiceModel.updateOne(
    { id: req.params.id },
    { $set: { ...purchaseOrder } },
    (error, result) => {
      if (!error) {
        return requestSuccess(res);
      } else {
        return requestFail(res, "Can't delete project now");
      }
    }
  );
}

async function remove(req, res) {
  // Verify request contained a project id
  if (!req.params.id) {
    return requestFail(res, "Invalid project id");
  }

  let ADMIN = await getAdmin();

  try {
    await InvoiceModel.updateOne(
      { id: req.params.id },
      { $set: { status: "deleted", updatedBy: ADMIN.id } }
    );
    return requestSuccess(res, "project deleted successfully");
  } catch (error) {
    return requestFail(res, "Can't delete project now");
  }
}

module.exports = {
  list,
  get,
  create,
  update,
  delete: remove,
};
