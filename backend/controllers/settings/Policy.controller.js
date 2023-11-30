const {
  requestSuccess,
  requestFail,
} = require("../../helpers/RequestResponse.helper");
const { PolicyModel } = require("../../models");
const { generateId, getAdmin } = require("../../helpers/Common.helper");

async function list(req, res) {
  const list = await PolicyModel.find(
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
  const list = await PolicyModel.findOne(
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
  let policy = req.body;

  if (!policy.name) {
    return requestFail(res, "policy name is required");
  }

  if (await PolicyModel.findOne({ name: policy.name })) {
    return requestFail(res, "Duplicate policy name");
  }

  // generate a unique id for policy
  const id = `P${generateId(5)}`;

  // add missing detail in the policy object
  policy.id = id;
  policy.status = "active";
  policy.createdBy = ADMIN.id;
  policy.updatedBy = ADMIN.id;

  // Now try to create a new policy
  try {
    await new PolicyModel(policy).save();
    return requestSuccess(res);
  } catch (error) {
    print(error);
  }

  return requestFail(res, "Something went wrong, Can't create policy now.");
}

async function update(req, res) {
  // Verify request containe a policy id
  if (!req.params.id) {
    return requestFail(res, "Invalid policy id");
  }

  // store all request data into policy var
  let policy = req.body,
    ADMIN = await getAdmin();

  // update entry who is updateing the field
  policy.updatedBy = ADMIN.id;

  if (policy.id && req.params.id != policy.id)
    requestFail(res, "Something went wrong, Can't update policy");

  delete policy.id;

  // find policy as per name
  let dbpolicy = await PolicyModel.findOne({
    name: policy.name,
  });

  if (dbpolicy) {
    if (dbpolicy.id != req.params.id) requestFail(res, "Policy already in use");
  }

  PolicyModel.updateOne(
    { id: req.params.id },
    { $set: { ...policy } },
    (error, result) => {
      if (!error) {
        return requestSuccess(res);
      } else {
        return requestFail(res, "Can't delete policy now");
      }
    }
  );
}

async function remove(req, res) {
  // Verify request containe a policy id
  if (!req.params.id) {
    return requestFail(res, "Invalid policy id");
  }

  let ADMIN = await getAdmin();

  try {
    await PolicyModel.updateOne(
      { id: req.params.id },
      { $set: { status: "deleted", updatedBy: ADMIN.id } }
    );
    return requestSuccess(res, "Policy deleted successfully", {
      variant: "error",
    });
  } catch (error) {
    return requestFail(res, "Can't delete policy now");
  }
}

module.exports = {
  list,
  get,
  create,
  update,
  delete: remove,
};
