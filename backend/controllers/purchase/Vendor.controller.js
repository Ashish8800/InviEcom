const {
  requestSuccess,
  requestFail,
} = require("../../helpers/RequestResponse.helper");
const { VendorModel } = require("../../models");
const { generateId, getAdmin } = require("../../helpers/Common.helper");

async function list(req, res) {
  const list = await VendorModel.find(
    { status: { $ne: "deleted" }, ...req.query },
    ["-_id", "-__v"]
  );
  if (list && list.length > 0) {
    return requestSuccess(res, list);
  }
  return requestFail(res, "Can't find any vendor");
}

async function get(req, res) {
  // Verify request contained a vendor id
  if (!req.params.id) {
    return requestFail(res, "Invalid vendor id");
  }

  // Fetch vendor detail form database
  const list = await VendorModel.findOne(
    { status: { $ne: "deleted" }, id: req.params.id },
    ["-_id", "-__v"]
  );

  // Check we got some result form the database or not
  // if get some result form database the send back to client
  if (list) {
    return requestSuccess(res, list);
  }

  // fail request if nothing worked
  return requestFail(res, "Can't find vendor");
}

async function create(req, res) {
  // get current user
  let ADMIN = await getAdmin();

  // Get data and verify as per need
  let vendor = req.body;

  // generate a unique id for vendor
  const id = `V${generateId(5)}`;

  let oldVendor = null;

  try {
    oldVendor = await VendorModel.findOne({
      vendorDisplayName: vendor.vendorDisplayName,
    });
  } catch (error) {}

  if (oldVendor) requestFail(res, "Vendor display name already exits");

  // add missing detail in the vendor object
  vendor.id = id;
  vendor.status = "active";
  vendor.createdBy = ADMIN.id;
  vendor.updatedBy = ADMIN.id;

  // Now try to create a new vendor
  try {
    await new VendorModel(vendor).save();
    return requestSuccess(res);
  } catch (error) {}

  return requestFail(res, "Something went wrong, Can't create vendor now.");
}

async function update(req, res) {
  // Verify request contained a vendor id
  if (!req.params.id) {
    return requestFail(res, "Invalid vendor id");
  }

  // store all request data into vendor var
  let vendor = req.body;

  let ADMIN = await getAdmin();

  // update entry who is updating the field
  vendor.updatedBy = ADMIN.id;

  if (vendor.id && req.params.id != vendor.id)
    requestFail(res, "Something went wrong, Can't update vendor");

  delete vendor.id;

  // // find vendor as per name
  // let dbWarehouse = await VendorModel.findOne({ name: vendor.name });

  // if (dbWarehouse) {
  //   if (dbWarehouse.id != req.params.id)
  //     requestFail(res, "Vendor already in use");
  // }

  VendorModel.updateOne(
    { id: req.params.id },
    { $set: { ...vendor } },
    (error, result) => {
      if (!error) {
        return requestSuccess(res);
      } else {
        return requestFail(res, "Can't delete vendor now");
      }
    }
  );
}

async function remove(req, res) {
  // Verify request contained a vendor id
  if (!req.params.id) {
    return requestFail(res, "Invalid vendor id");
  }

  let ADMIN = await getAdmin();

  try {
    await VendorModel.updateOne(
      { id: req.params.id },
      { $set: { status: "deleted", updatedBy: ADMIN.id } }
    );
    return requestSuccess(res, "Vendor deleted successfully");
  } catch (error) {
    return requestFail(res, "Can't delete vendor now");
  }
}

module.exports = {
  list,
  get,
  create,
  update,
  delete: remove,
};
