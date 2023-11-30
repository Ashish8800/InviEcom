const {
  requestSuccess,
  requestFail,
} = require("../../helpers/RequestResponse.helper");
const { WarehouseModel } = require("../../models");
const { generateId, getAdmin } = require("../../helpers/Common.helper");

async function getAllWarehouseList(req, res) {
  const list = await WarehouseModel.find(
    { status: { $ne: "deleted" }, ...req.query },
    ["-_id", "-__v"]
  );
  if (list && list.length > 0) {
    return requestSuccess(res, list);
  }
  return requestFail(res, "Can't find warehouse");
}

async function getWarehouseById(req, res) {
  // Verify request contained a warehouse id
  if (!req.params.id) {
    return requestFail(res, "Invalid warehouse id");
  }

  // Fetch warehouse detail form database
  const list = await WarehouseModel.findOne(
    { status: { $ne: "deleted" }, id: req.params.id },
    ["-_id", "-__v"]
  );

  // Check we got some result form the database or not
  // if get some result form database the send back to client
  if (list) {
    return requestSuccess(res, list);
  }

  // fail request if nothing worked
  return requestFail(res, "Can't find warehouse");
}

async function createWarehouse(req, res) {
  // get current user
  let ADMIN = await getAdmin();

  // validate warehouse create data
  let warehouse = null;
  try {
    warehouse = await canCreateWarehouse(req.body);
  } catch (error) {
    return requestFail(res, error.message);
  }

  if (await WarehouseModel.findOne({ name: warehouse.name })) {
    return requestFail(res, "Duplicate warehouse name");
  }

  // generate a unique id for warehouse
  const id = `WH${generateId(5)}`;

  // add missing detail in the warehouse object
  warehouse.id = id;
  warehouse.createdBy = ADMIN.id;
  warehouse.updatedBy = ADMIN.id;

  // Now try to create a new warehouse
  try {
    const result = await new WarehouseModel(warehouse).save();
  } catch (error) {
    // Now fail the request
    return requestFail(
      res,
      "Something went wrong, Can't create warehouse now."
    );
  }

  // Everything gets as expected now return request success
  return requestSuccess(res);
}

async function update(req, res) {
  // Verify request contained a warehouse id
  if (!req.params.id) {
    return requestFail(res, "Invalid warehouse id");
  }

  // store all request data into warehouse var
  let warehouse = req.body;

  let ADMIN = await getAdmin();

  // update entry who is updating the field
  warehouse.updatedBy = ADMIN.id;

  if (warehouse.id && req.params.id != warehouse.id)
    requestFail(res, "Something went wrong, Can't update warehouse");

  delete warehouse.id;

  // find warehouse as per name
  let dbWarehouse = await WarehouseModel.findOne({ name: warehouse.name });

  if (dbWarehouse) {
    if (dbWarehouse.id != req.params.id)
      requestFail(res, "Warehouse already in use");
  }

  WarehouseModel.updateOne(
    { id: req.params.id },
    { $set: { ...warehouse } },
    (error, result) => {
      if (!error) {
        return requestSuccess(res);
      } else {
        return requestFail(res, "Can't delete warehouse now");
      }
    }
  );
}

async function deleteWarehouse(req, res) {
  // Verify request contained a warehouse id
  if (!req.params.id) {
    return requestFail(res, "Invalid warehouse id");
  }

  let ADMIN = await getAdmin();

  try {
    await WarehouseModel.updateOne(
      { id: req.params.id },
      { $set: { status: "deleted", updatedBy: ADMIN.id } }
    );
    return requestSuccess(res, "Warehouse deleted successfully");
  } catch (error) {
    return requestFail(res, "Can't delete warehouse now");
  }
}

module.exports = {
  index: getAllWarehouseList,
  get: getWarehouseById,
  create: createWarehouse,
  update: update,
  delete: deleteWarehouse,
};

// Create warehouse validation schema ========================================================
async function canCreateWarehouse(object) {
  const schema = yup.object().shape({
    name: yup.string().required(),
    contact: yup.string().required(),
    address: yup.string().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    country: yup.string().required(),
    pincode: yup
      .string()
      .required()
      .matches(/^\d{6}$/),
    status: yup.string().oneOf(["active", "inactive", "closed"]).required(),
  });

  return await schema.validate(object);
}
