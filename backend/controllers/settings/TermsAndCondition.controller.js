const {
  requestSuccess,
  requestFail,
} = require("../../helpers/RequestResponse.helper");
const { TermsAndConditionModel } = require("../../models");
const { generateId, getAdmin } = require("../../helpers/Common.helper");

async function list(req, res) {
  const list = await TermsAndConditionModel.find(
    { status: { $ne: "deleted" }, ...req.query },
    ["-_id", "-__v"]
  );
  if (list && list.length > 0) {
    return requestSuccess(res, list);
  }
  return requestFail(res, "Can't find any policy");
}

async function get(req, res) {
  // Verify request containe a policy id
  if (!req.params.id) {
    return requestFail(res, "Invalid policy id");
  }

  // Fetch policy detail form database
  const list = await TermsAndConditionModel.findOne(
    { status: { $ne: "deleted" }, id: req.params.id },
    ["-_id", "-__v"]
  );

  // Check we got some result form the database or not
  // if get some result form database the send back to client
  if (list) {
    return requestSuccess(res, list);
  }

  // fail request if nothing worked
  return requestFail(res, "Can't find policy");
}

async function create(req, res) {
  // get current user
  let ADMIN = await getAdmin();

  // Get data and verify as per need
  let termsAndCondition = req.body;

  if (!termsAndCondition.name) {
    return requestFail(res, "TermsAndCondition name is required");
  }

  if (await TermsAndConditionModel.findOne({ name: termsAndCondition.name })) {
    return requestFail(res, "Duplicate TermsAndCondition name");
  }

  // generate a unique id for policy
  const id = `T&C${generateId(5)}`;

  // add missing detail in the policy object
  termsAndCondition.id = id;
  termsAndCondition.status = "active";
  termsAndCondition.createdBy = ADMIN.id;
  termsAndCondition.updatedBy = ADMIN.id;

  // Now try to create a new policy
  try {
    await new TermsAndConditionModel(termsAndCondition).save();
    return requestSuccess(res);
  } catch (error) {
    print(error);
  }

  return requestFail(res, "Something went wrong, Can't create policy now.");
}

async function update(req, res) {
  // Verify request containe a policy id
  if (!req.params.id) {
    return requestFail(res, "Invalid termsAndCondition id");
  }

  // store all request data into policy var
  let termsAndCondition = req.body,
    ADMIN = await getAdmin();

  // update entry who is updateing the field
  termsAndCondition.updatedBy = ADMIN.id;

  if (termsAndCondition.id && req.params.id != termsAndCondition.id)
    requestFail(res, "Something went wrong, Can't update termsAndCondition");

  delete termsAndCondition.id;

  // find termsAndCondition as per name
  let dbtermsAndCondition = await TermsAndConditionModel.findOne({
    name: termsAndCondition.name,
  });

  if (dbtermsAndCondition) {
    if (dbtermsAndCondition.id != req.params.id)
      requestFail(res, "termsAndCondition already in use");
  }

  TermsAndConditionModel.updateOne(
    { id: req.params.id },
    { $set: { ...termsAndCondition } },
    (error, result) => {
      if (!error) {
        return requestSuccess(res);
      } else {
        return requestFail(res, "Can't delete termsAndCondition now");
      }
    }
  );
}

async function remove(req, res) {
  // Verify request containe a termsAndCondition id
  if (!req.params.id) {
    return requestFail(res, "Invalid termsAndCondition id");
  }

  let ADMIN = await getAdmin();

  try {
    await TermsAndConditionModel.updateOne(
      { id: req.params.id },
      { $set: { status: "deleted", updatedBy: ADMIN.id } }
    );
    return requestSuccess(res, "termsAndCondition deleted successfully", {
      variant: "error",
    });
  } catch (error) {
    return requestFail(res, "Can't delete termsAndCondition now");
  }
}

module.exports = {
  list,
  get,
  create,
  update,
  delete: remove,
};
