const {
  requestSuccess,
  requestFail,
} = require("../../helpers/RequestResponse.helper");
const { CurrencyModel } = require("../../models");
const { generateId, getAdmin } = require("../../helpers/Common.helper");

async function list(req, res) {
  const list = await CurrencyModel.find(
    { status: { $ne: "deleted" }, ...req.query },
    ["-_id", "-__v"]
  );
  if (list && list.length > 0) {
    return requestSuccess(res, list);
  }
  return requestFail(res, "Can't find any currency");
}

async function get(req, res) {
  // Verify request containe a currency id
  if (!req.params.id) {
    return requestFail(res, "Invalid currency id");
  }

  // Fetch currency detail form database
  const list = await CurrencyModel.findOne(
    { status: { $ne: "deleted" }, id: req.params.id },
    ["-_id", "-__v"]
  );

  // Check we got some result form the database or not
  // if get some result form database the send back to client
  if (list) {
    return requestSuccess(res, list);
  }

  // fail request if nothing worked
  return requestFail(res, "Can't find currency");
}

async function create(req, res) {
  // get current user
  let ADMIN = await getAdmin();

  // Get data and verify as per need
  let currency = req.body;

  if (!currency.name) {
    return requestFail(res, "currency name is required");
  }

  if (await CurrencyModel.findOne({ name: currency.name })) {
    return requestFail(res, "Duplicate currency name");
  }

  // generate a unique id for currency
  const id = `CUR${generateId(5)}`;

  // add missing detail in the currency object
  currency.id = id;
  currency.status = "active";
  currency.createdBy = ADMIN.id;
  currency.updatedBy = ADMIN.id;

  // Now try to create a new currency
  try {
    await new CurrencyModel(currency).save();
    return requestSuccess(res);
  } catch (error) {
    print(error);
  }

  return requestFail(res, "Something went wrong, Can't create currency now.");
}

async function update(req, res) {
  // Verify request containe a currency id
  if (!req.params.id) {
    return requestFail(res, "Invalid currency id");
  }

  // store all request data into currency var
  let currency = req.body,
    ADMIN = await getAdmin();

  // update entry who is updateing the field
  currency.updatedBy = ADMIN.id;

  if (currency.id && req.params.id != currency.id)
    return requestFail(res, "Something went wrong, Can't update currency");

  delete currency.id;

  // find currency as per name
  let dbcurrency = await CurrencyModel.findOne({
    name: currency.name,
  });

  if (dbcurrency) {
    if (dbcurrency.id != req.params.id)
      return requestFail(res, "currency already in use");
  }

  CurrencyModel.updateOne(
    { id: req.params.id },
    { $set: { ...currency } },

    (error, result) => {
      if (!error) {
        return requestSuccess(res);
      } else {
        return requestFail(res, "Can't delete currency now");
      }
    }
  );
}

async function remove(req, res) {
  // Verify request containe a currency id
  if (!req.params.id) {
    return requestFail(res, "Invalid currency id");
  }

  let ADMIN = await getAdmin();

  try {
    await CurrencyModel.updateOne(
      { id: req.params.id },
      { $set: { status: "deleted", updatedBy: ADMIN.id } }
    );
    return requestSuccess(res, "currency deleted successfully");
  } catch (error) {
    return requestFail(res, "Can't delete currency now");
  }
}

module.exports = {
  list,
  get,
  create,
  update,
  delete: remove,
};
