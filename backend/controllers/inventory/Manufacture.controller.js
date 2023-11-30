const {
  requestSuccess,
  requestFail,
} = require("../../helpers/RequestResponse.helper");
const { ManufeatureModel } = require("../../models");
const { generateId, getAdmin } = require("../../helpers/Common.helper");

async function list(req, res) {
  const list = await ManufeatureModel.find(
    { status: { $ne: "deleted" }, ...req.query },
    ["-_id", "-__v"]
  );
  if (list && list.length > 0) {
    return requestSuccess(res, list);
  }
  return requestFail(res, "Can't find any manufacture");
}

async function get(req, res) {
  // Verify request contained a manufacture id
  if (!req.params.id) {
    return requestFail(res, "Invalid manufacture id");
  }

  // Fetch manufacture detail form database
  const list = await ManufeatureModel.findOne(
    { status: { $ne: "deleted" }, id: req.params.id },
    ["-_id", "-__v"]
  );

  // Check we got some result form the database or not
  // if get some result form database the send back to client
  if (list) {
    return requestSuccess(res, list);
  }

  // fail request if nothing worked
  return requestFail(res, "Can't find manufacture");
}

async function create(req, res) {
  // get current user
  let ADMIN = await getAdmin();

  // Get data and verify as per need
  let manufacture = req.body;

  if (!manufacture.name) {
    return requestFail(res, "Manufacture name is required");
  }

  if (await ManufeatureModel.findOne({ name: manufacture.name })) {
    return requestFail(res, "Duplicate manufacture name");
  }

  // generate a unique id for manufacture
  const id = `MFT${generateId(5)}`;

  // add missing detail in the manufacture object
  manufacture.id = id;
  manufacture.status = "active";
  manufacture.createdBy = ADMIN.id;
  manufacture.updatedBy = ADMIN.id;

  // Now try to create a new manufacture
  try {
    await new ManufeatureModel(manufacture).save();
    return requestSuccess(res);
  } catch (error) {}

  return requestFail(
    res,
    "Something went wrong, Can't create manufacture now."
  );
}

async function update(req, res) {
  // Verify request contained a manufacture id
  if (!req.params.id) {
    return requestFail(res, "Invalid manufacture id");
  }

  // store all request data into manufacture var
  let manufacture = req.body,
    ADMIN = await getAdmin();

  // update entry who is updating the field
  manufacture.updatedBy = ADMIN.id;

  if (manufacture.id && req.params.id != manufacture.id)
    requestFail(res, "Something went wrong, Can't update manufacture");

  delete manufacture.id;

  // find manufacture as per name
  let dbManufacture = await ManufeatureModel.findOne({
    name: manufacture.name,
  });

  if (dbManufacture) {
    if (dbManufacture.id != req.params.id)
      requestFail(res, "Manufacture already in use");
  }

  ManufeatureModel.updateOne(
    { id: req.params.id },
    { $set: { ...manufacture } },
    (error, result) => {
      if (!error) {
        return requestSuccess(res);
      } else {
        return requestFail(res, "Can't delete manufacture now");
      }
    }
  );
}

async function remove(req, res) {
  // Verify request contained a manufacture id
  if (!req.params.id) {
    return requestFail(res, "Invalid manufacture id");
  }

  let ADMIN = await getAdmin();

  try {
    await ManufeatureModel.updateOne(
      { id: req.params.id },
      { $set: { status: "deleted", updatedBy: ADMIN.id } }
    );
    return requestSuccess(res, "Manufeature deleted successfully");
  } catch (error) {
    return requestFail(res, "Can't delete manufacture now");
  }
}

module.exports = {
  list,
  get,
  create,
  update,
  delete: remove,
};
