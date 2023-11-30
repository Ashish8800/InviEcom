const {
  requestSuccess,
  requestFail,
} = require("../../helpers/RequestResponse.helper");
const { ClientModel } = require("../../models");
const {
  generateId,
  getAdmin,
  paramProxy,
} = require("../../helpers/Common.helper");
const pipeline = require("../../database/pipelines/setting/Client.pipeline");

async function list(req, res) {
  const query = await paramProxy(req.query);
  const list = await ClientModel.aggregate(pipeline({ ...query }));
  if (list && list.length > 0) {
    return requestSuccess(res, list);
  }
  return requestFail(res, "Can't find any client");
}

async function get(req, res) {
  // Verify request contained a client id
  if (!req.params.id) {
    return requestFail(res, "Invalid client id");
  }

  // Fetch client detail form database
  const list = await ClientModel.findOne(
    { status: { $ne: "deleted" }, id: req.params.id },
    ["-_id", "-__v"]
  );

  // Check we got some result form the database or not
  // if get some result form database the send back to client
  if (list) {
    return requestSuccess(res, list);
  }

  // fail request if nothing worked
  return requestFail(res, "Can't find client");
}

async function create(req, res) {
  // get current user
  let ADMIN = await getAdmin();

  // Get data and verify as per need
  let client = req.body;

  if (await ClientModel.findOne({ name: client.name })) {
    return requestFail(res, "Duplicate client name");
  }

  // generate a unique id for client
  const id = `CL${generateId(5)}`;

  // add missing detail in the client object
  client.id = id;
  client.status = "active";
  client.createdBy = ADMIN.id;
  client.updatedBy = ADMIN.id;

  // Now try to create a new client
  try {
    await new ClientModel(client).save();
    return requestSuccess(res);
  } catch (error) {
    print(error);
  }

  return requestFail(res, "Something went wrong, Can't create client now.");
}

async function update(req, res) {
  // Verify request contained a client id
  if (!req.params.id) {
    return requestFail(res, "Invalid client id");
  }

  // store all request data into client var
  let client = req.body;

  let ADMIN = await getAdmin();

  // update entry who is updating the field
  client.updatedBy = ADMIN.id;

  if (client.id && req.params.id != client.id)
    requestFail(res, "Something went wrong, Can't update client");

  delete client.id;

  // // find client as per name
  // let dbWarehouse = await clientModel.findOne({ name: client.name });

  // if (dbWarehouse) {
  //   if (dbWarehouse.id != req.params.id)
  //     requestFail(res, "client already in use");
  // }

  ClientModel.updateOne(
    { id: req.params.id },
    { $set: { ...client } },
    (error, result) => {
      if (!error) {
        return requestSuccess(res);
      } else {
        return requestFail(res, "Can't delete client now");
      }
    }
  );
}

async function remove(req, res) {
  // Verify request contained a client id
  if (!req.params.id) {
    return requestFail(res, "Invalid client id");
  }

  let ADMIN = await getAdmin();

  try {
    await ClientModel.updateOne(
      { id: req.params.id },
      { $set: { status: "deleted", updatedBy: ADMIN.id } }
    );
    return requestSuccess(res, "client deleted successfully");
  } catch (error) {
    return requestFail(res, "Can't delete client now");
  }
}

module.exports = {
  list,
  get,
  create,
  update,
  delete: remove,
};
