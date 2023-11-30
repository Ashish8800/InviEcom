const {
  requestSuccess,
  requestFail,
} = require("../../helpers/RequestResponse.helper");
const { ProjectModel, ClientModel } = require("../../models");
const {
  generateId,
  getAdmin,
  paramProxy,
} = require("../../helpers/Common.helper");
const pipeline = require("../../database/pipelines/setting/Project.pipeline");

async function list(req, res) {
  const query = await paramProxy(req.query);
  const list = await ProjectModel.aggregate(pipeline({ ...query }));
  if (list && list.length > 0) {
    return requestSuccess(res, list);
  }
  return requestFail(res, "Can't find any project");
}

async function get(req, res) {
  // Verify request contained a project id
  if (!req.params.id) {
    return requestFail(res, "Invalid project id");
  }

  // Fetch project detail form database
  const list = await ProjectModel.findOne(
    { status: { $ne: "deleted" }, id: req.params.id },
    ["-_id", "-__v"]
  );

  // Check we got some result form the database or not
  // if get some result form database the send back to client
  if (list) {
    return requestSuccess(res, list);
  }

  // fail request if nothing worked
  return requestFail(res, "Can't find project");
}

async function create(req, res) {
  // get current user
  let ADMIN = await getAdmin();

  // Get data and verify as per need
  let project = req.body;

  if (!project.name) {
    return requestFail(res, "project name is required");
  }

  if (!project.client) {
    return requestFail(res, "Client Id is required");
  }

  let clientId = null;

  try {
    clientId = await ClientModel.findOne({ name: project.client });
    clientId = clientId.id;
  } catch (err) {}

  if (!clientId) {
    return requestFail(res, "Something wrong with client");
  }

  if (await ProjectModel.findOne({ name: project.name })) {
    return requestFail(res, "Duplicate project name");
  }

  // generate a unique id for project
  const id = `PRO${generateId(5)}`;

  // add missing detail in the project object
  project.id = id;
  project.clientId = clientId;
  project.status = "active";
  project.createdBy = ADMIN.id;
  project.updatedBy = ADMIN.id;

  // Now try to create a new project
  try {
    await new ProjectModel(project).save();
    return requestSuccess(res);
  } catch (error) {
    print(error);
  }

  return requestFail(res, "Something went wrong, Can't create project now.");
}

async function update(req, res) {
  // Verify request contained a project id
  if (!req.params.id) {
    return requestFail(res, "Invalid project id");
  }

  // store all request data into project var
  let project = req.body;

  let ADMIN = await getAdmin();

  // update entry who is updating the field
  project.updatedBy = ADMIN.id;

  if (project.id && req.params.id != project.id)
    requestFail(res, "Something went wrong, Can't update project");

  delete project.id;

  // find project as per name
  let dbWarehouse = await ProjectModel.findOne({ name: project.name });

  if (dbWarehouse) {
    if (dbWarehouse.id != req.params.id)
      requestFail(res, "Warehouse already in use");
  }

  ProjectModel.updateOne(
    { id: req.params.id },
    { $set: { ...project } },
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
    await ProjectModel.updateOne(
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
