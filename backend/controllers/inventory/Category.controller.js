const {
  requestSuccess,
  requestFail,
} = require("../../helpers/RequestResponse.helper");
const { CategoryModel } = require("../../models");
const { generateId, getAdmin } = require("../../helpers/Common.helper");

async function list(req, res) {
  const list = await CategoryModel.find(
    { status: { $ne: "deleted" }, ...req.query },
    ["-_id", "-__v"]
  );
  if (list && list.length > 0) {
    return requestSuccess(res, list);
  }
  return requestFail(res, "Can't find any category");
}

async function get(req, res) {
  // Verify request contained a category id
  if (!req.params.id) {
    return requestFail(res, "Invalid category id");
  }

  // Fetch category detail form database
  const list = await CategoryModel.findOne(
    { status: { $ne: "deleted" }, id: req.params.id },
    ["-_id", "-__v"]
  );

  // Check we got some result form the database or not
  // if get some result form database the send back to client
  if (list) {
    return requestSuccess(res, list);
  }

  // fail request if nothing worked
  return requestFail(res, "Can't find category");
}

async function create(req, res) {
  // get current user
  let ADMIN = await getAdmin();

  // Get data and verify as per need
  let category = req.body;

  if (!category.name) {
    return requestFail(res, "Category name is required");
  }

  if (await CategoryModel.findOne({ name: category.name })) {
    return requestFail(res, "Duplicate category name");
  }

  // generate a unique id for category
  const id = `C${generateId(5)}`;

  // add missing detail in the category object
  category.id = id;
  category.createdBy = ADMIN.id;
  category.updatedBy = ADMIN.id;

  // Now try to create a new category
  try {
    await new CategoryModel(category).save();
    return requestSuccess(res);
  } catch (error) {}

  return requestFail(res, "Something went wrong, Can't create category now.");
}

async function update(req, res) {
  // Verify request contained a category id
  if (!req.params.id) {
    return requestFail(res, "Invalid category id");
  }

  // store all request data into category var
  let category = req.body;

  let ADMIN = await getAdmin();

  // update entry who is updating the field
  category.updatedBy = ADMIN.id;

  if (category.id && req.params.id != category.id)
    requestFail(res, "Something went wrong, Can't update category");

  delete category.id;

  // find category as per name
  let dbWarehouse = await CategoryModel.findOne({ name: category.name });

  if (dbWarehouse) {
    if (dbWarehouse.id != req.params.id)
      requestFail(res, "Category already in use");
  }

  CategoryModel.updateOne(
    { id: req.params.id },
    { $set: { ...category } },
    (error, result) => {
      if (!error) {
        return requestSuccess(res);
      } else {
        return requestFail(res, "Can't delete category now");
      }
    }
  );
}

async function remove(req, res) {
  // Verify request contained a category id
  if (!req.params.id) {
    return requestFail(res, "Invalid category id");
  }

  let ADMIN = await getAdmin();

  try {
    await CategoryModel.updateOne(
      { id: req.params.id },
      { $set: { status: "deleted", updatedBy: ADMIN.id } }
    );
    return requestSuccess(res, "Category deleted successfully");
  } catch (error) {
    return requestFail(res, "Can't delete category now");
  }
}

module.exports = {
  list,
  get,
  create,
  update,
  delete: remove,
};
