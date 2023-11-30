const {
  requestSuccess,
  requestFail,
} = require("../../helpers/RequestResponse.helper");
const { PurchaseOrderModel, RequestModel } = require("../../models");

const {
  generateId,
  getAdmin,
  paramProxy,
} = require("../../helpers/Common.helper");
const pipeline = require("../../database/pipelines/purchase/Order.pipeline");

async function list(req, res) {
  const query = await paramProxy(req.query);
  const list = await PurchaseOrderModel.aggregate(pipeline({ ...query }));
  if (list && list.length > 0) {
    return requestSuccess(res, list);
  }
  return requestFail(res, "Can't find any project");
}

async function get(req, res) {
  const query = await paramProxy(req.query);

  // Verify request contained a project id
  if (!req.params.id) {
    return requestFail(res, "Invalid project id");
  }

  // Fetch project detail form database
  const list = await PurchaseOrderModel.aggregate(
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
  let purchaseOrder = req.body;

  // generate a unique id for project
  const id = `PO${generateId(9)}`;

  // add missing detail in the project object
  purchaseOrder.id = id;
  purchaseOrder.status = "pending";
  purchaseOrder.createdBy = ADMIN.id;
  purchaseOrder.updatedBy = ADMIN.id;

  // Now try to create a new project
  try {
    await new PurchaseOrderModel(purchaseOrder).save();
    RequestModel.updateOne(
      { id: purchaseOrder.purchaseRequest },
      { $set: { status: "po_generated" } },
      (error, result) => {
        if (!error) {
          return requestSuccess(res);
        } else {
          return requestFail(
            res,
            "Something went wrong, Can't Purchase Order Now"
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

  if (purchaseOrder.id && req.params.id != purchaseOrder.id)
    return requestFail(res, "Something went wrong, Can't update project");
  delete purchaseOrder.id;

  PurchaseOrderModel.updateOne(
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
    await PurchaseOrderModel.updateOne(
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
