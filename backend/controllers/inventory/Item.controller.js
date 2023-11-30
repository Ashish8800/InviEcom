const {
  requestSuccess,
  requestFail,
} = require("../../helpers/RequestResponse.helper");
const { ItemModel, SubCategoryModel, CategoryModel } = require("../../models");
const { generateId, getAdmin } = require("../../helpers/Common.helper");

const pipeline = require("../../database/pipelines/inventory/item.pipeline");

async function list(req, res) {
  let defaultQuery = { ...req.query };
  const list = await ItemModel.aggregate(pipeline(defaultQuery));
  if (list && list.length > 0) {
    return requestSuccess(res, list);
  }
  return requestFail(res, "Can't find item");
}

async function itemById(req, res) {
  // Verify request contained a item id
  if (!req.params.id) {
    return requestFail(res, "Invalid item id");
  }

  // Fetch item detail form database
  const list = await ItemModel.findOne(
    {
      status: { $ne: "deleted" },
      id: req.params.id,
      ...req.query,
    },
    ["-_id", "-__v"]
  );

  // Check we got some result form the database or not
  // if get some result form database the send back to client
  if (list) {
    return requestSuccess(res, list);
  }

  // fail request if nothing worked
  return requestFail(res, "Can't find item");
}

async function create(req, res) {
  // get current user
  let ADMIN = await getAdmin();

  // validate item create data
  let item = null;
  try {
    item = await canCreateitem(req.body);
  } catch (error) {
    return requestFail(res, error.message);
  }

  if (await ItemModel.findOne({ ipn: item.ipn })) {
    return requestFail(res, "Duplicate item name");
  }

  // generate a unique id for item
  const id = `I${generateId(5)}`;

  // add missing detail in the item object
  item.id = id;

  // try {
  //   let fCategory = await CategoryModel.findOne({
  //     id: item.category,
  //   });

  //   item.category = {
  //     id: item.category,
  //     name: fCategory.name,
  //   };
  // } catch (error) {
  //   requestFail(res, "Something went wrong with category");
  // }

  // if (item.subcategory == "") {
  //   item.subcategory = {};
  // } else {
  //   try {
  //     let fSubCategory = await SubCategoryModel.findOne({
  //       id: item.subcategory,
  //     });

  //     item.subcategory = {
  //       id: item.subcategory,
  //       name: fSubCategory.name,
  //     };
  //   } catch (error) {
  //     item.subcategory = {};
  //   }
  // }

  item.createdBy = ADMIN.id;
  item.updatedBy = ADMIN.id;

  // Now try to create a new item
  try {
    const result = await new ItemModel(item).save();
  } catch (error) {
    print(error);
    // Now fail the request
    return requestFail(res, "Something went wrong, Can't create item now.");
  }

  // Everything gets as expected now return request success
  return requestSuccess(res);
}

async function update(req, res) {
  // Verify request contained a item id
  if (!req.params.id) {
    return requestFail(res, "Invalid item id");
  }

  // store all request data into item var
  let item = req.body;

  let ADMIN = await getAdmin();

  // update entry who is updating the field
  item.updatedBy = ADMIN.id;

  if (item.id && req.params.id != item.id)
    requestFail(res, "Something went wrong, Can't update item");

  delete item.id;

  // find item as per name
  let dbitem = await ItemModel.findOne({ ipn: item.ipn });

  ItemModel.updateOne(
    { id: req.params.id },
    { $set: { ...item } },
    (error, result) => {
      print(error);
      if (!error) {
        return requestSuccess(res);
      } else {
        return requestFail(res, "Can't Update item now");
      }
    }
  );
}

async function remove(req, res) {
  // Verify request contained a item id
  if (!req.params.id) {
    return requestFail(res, "Invalid item id");
  }

  let ADMIN = await getAdmin();

  try {
    await ItemModel.updateOne(
      { id: req.params.id },
      { $set: { status: "deleted", updatedBy: ADMIN.id } }
    );
    return requestSuccess(res, "item deleted successfully");
  } catch (error) {
    return requestFail(res, "Can't delete item now");
  }
}

async function canCreateitem(object) {
  const schema = yup.object().shape({
    ipn: yup.string().required(),
    categoryId: yup.string().required(),
    unit: yup.string().required(),
  });

  return await schema.validate(object);
}

module.exports = {
  list,
  get: itemById,
  create,
  update,
  delete: remove,
};
