const {
  requestSuccess,
  requestFail,
} = require("../../helpers/RequestResponse.helper");
const { RoleModel } = require("../../models");
const { generateId, getAdmin } = require("../../helpers/Common.helper");

async function getAllRoleList(req, res) {
  const list = await RoleModel.find(
    { status: { $ne: "deleted" }, ...req.query },
    ["-_id", "-__v"]
  );
  if (list && list.length > 0) {
    return requestSuccess(res, list);
  }
  return requestFail(res, "Can't find role");
}

async function getRoleById(req, res) {
  // Verify request contained a role id
  if (!req.params.id) {
    return requestFail(res, "Invalid role id");
  }

  // Fetch role detail form database
  const list = await RoleModel.findOne(
    { status: { $ne: "deleted" }, id: req.params.id },
    ["-_id", "-__v"]
  );

  // Check we got some result form the database or not
  // if get some result form database the send back to client
  if (list) {
    return requestSuccess(res, list);
  }

  // fail request if nothing worked
  return requestFail(res, "Can't find role");
}

async function createRole(req, res) {
  // get current user
  let ADMIN = await getAdmin();

  // validate role create data
  let role = null;
  try {
    role = await canCreateRole(req.body);
  } catch (error) {
    return requestFail(res, error.message);
  }

  if (await RoleModel.findOne({ name: role.name })) {
    return requestFail(res, "Duplicate role name");
  }

  // generate a unique id for role
  const id = `R${generateId(5)}`;

  // add missing detail in the role object
  role.id = id;
  role.createdBy = ADMIN.id;
  role.updatedBy = ADMIN.id;

  // Now try to create a new role
  try {
    const result = await new RoleModel(role).save();
  } catch (error) {
    // Now fail the request
    return requestFail(res, "Something went wrong, Can't create role now.");
  }

  // Everything gets as expected now return request success
  return requestSuccess(res);
}

async function update(req, res) {
  // Verify request contained a role id
  if (!req.params.id) {
    return requestFail(res, "Invalid role id");
  }

  // store all request data into role var
  let role = req.body;

  let ADMIN = await getAdmin();

  // update entry who is updating the field
  role.updatedBy = ADMIN.id;

  if (role.id && req.params.id != role.id)
    requestFail(res, "Something went wrong, Can't update role");

  delete role.id;

  // find role as per name
  let dbRole = await RoleModel.findOne({ name: role.name });

  if (dbRole) {
    if (dbRole.id != req.params.id) requestFail(res, "Role already in use");
  }

  RoleModel.updateOne(
    { id: req.params.id },
    { $set: { ...role } },
    (error, result) => {
      if (!error) {
        return requestSuccess(res);
      } else {
        return requestFail(res, "Can't delete role now");
      }
    }
  );
}

async function deleteRole(req, res) {
  // Verify request contained a role id
  if (!req.params.id) {
    return requestFail(res, "Invalid role id");
  }

  let ADMIN = await getAdmin();

  try {
    await RoleModel.updateOne(
      { id: req.params.id },
      { $set: { status: "deleted", updatedBy: ADMIN.id } }
    );
    return requestSuccess(res, "Role deleted successfully");
  } catch (error) {
    return requestFail(res, "Can't delete role now");
  }
}

module.exports = {
  list: getAllRoleList,
  get: getRoleById,
  create: createRole,
  update: update,
  delete: deleteRole,
};

// Create role validation schema ========================================================
async function canCreateRole(object) {
  const schema = yup.object().shape({
    name: yup.string().required("Role name is required"),
  });

  return await schema.validate(object);
}
