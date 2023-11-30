const {
  requestSuccess,
  requestFail,
} = require("../../helpers/RequestResponse.helper");
const { ProjectModel, RequestModel, ClientModel } = require("../../models");

const {
  generateId,
  getAdmin,
  paramProxy,
  generatePassword,
  generateNextSerialNumber,
} = require("../../helpers/Common.helper");
const pipeline = require("../../database/pipelines/purchase/Request.pipeline");

async function list(req, res) {
  const query = await paramProxy(req.query);
  const requestQuery = query.query ?? null;
  delete query.query;
  if (requestQuery == "pending_rfq_generation") query.status = "approved";
  let list = await RequestModel.aggregate(pipeline({ ...query }));

  if (list && list.length > 0) {
    if (requestQuery == "pending_rfq_generation") {
      list = list.filter((pr) => {
        let isGenerated = true;
        pr?.items?.forEach((item) => {
          isGenerated = item.status != "rfq_generated" && isGenerated;
        });
        return isGenerated;
      });
    }
    return requestSuccess(res, list);
  }
  return requestFail(res);
}

async function get(req, res) {
  const query = await paramProxy(req.query);

  // Verify request contained a project id
  if (!req.params.id) {
    return requestFail(res, "Invalid project id");
  }

  // Fetch project detail form database
  const list = await RequestModel.aggregate(
    pipeline({ id: req.params.id, ...query })
  );

  // Check we got some result form the database or not
  // if get some result form database the send back to client
  if (list && list.length > 0) {
    return requestSuccess(res, list[0]);
  }

  // fail request if nothing worked
  return requestFail(res, "Can't find project");
}

async function create(req, res) {
  // get current user
  let ADMIN = await getAdmin();

  // Get data and verify as per need
  let formObj = req.body;

  // Remove unwanted fields
  delete formObj.clientName;
  delete formObj.projectName;

  let serialNumberId = await generateNextSerialNumber(RequestModel, 3);

  // generate a unique id for project
  const id = `PRN${new Date().getFullYear()}${(new Date().getMonth() + 1)
    .toString()
    .padStart(2, "0")}${new Date().getDate()}${serialNumberId}`;

  // add missing detail in the project object
  formObj.id = id;
  formObj.status = "pending";
  formObj.createdBy = ADMIN.id;
  formObj.updatedBy = ADMIN.id;

  // Now try to create a new project
  try {
    await new RequestModel(formObj).save();
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
  let prFormObj = req.body;

  let currentUser = await getAdmin();

  // update entry who is updating the field
  prFormObj.updatedBy = currentUser.id;

  if (prFormObj.correctionComment) {
    // get pr request from database
    let tempPRObj = null;

    try {
      tempPRObj = await RequestModel.findOne({ id: req.params.id });
    } catch (error) {}

    if (!tempPRObj) requestFail(res);

    let tempMessageList = tempPRObj.messages;

    if (!Array.isArray(tempMessageList)) {
      tempMessageList = [];
    }

    tempMessageList.push({
      id: generatePassword(17),
      user: currentUser.id,
      userName: currentUser.name,
      message: prFormObj.correctionComment,
      postedAt: new Date().toString(),
    });

    prFormObj.messages = tempMessageList;
  }

  delete prFormObj.id;

  RequestModel.updateOne(
    { id: req.params.id },
    { $set: { ...prFormObj, status: "pending" } },
    (error, result) => {
      print(error);
      if (!error) {
        return requestSuccess(res);
      } else {
        return requestFail(res, "Something went wrong");
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
    await RequestModel.updateOne(
      { id: req.params.id },
      { $set: { status: "deleted", updatedBy: ADMIN.id } }
    );
    return requestSuccess(res, "project deleted successfully");
  } catch (error) {
    return requestFail(res, "Can't delete project now");
  }
}

async function withdraw(req, res) {
  // Verify request contained a project id
  if (!req.params.id) {
    return requestFail(res, "Invalid project id");
  }

  let ADMIN = await getAdmin();

  try {
    await RequestModel.updateOne(
      { id: req.params.id },
      { $set: { status: "withdrawal", updatedBy: ADMIN.id } }
    );
    return requestSuccess(res, "project withdrawal successfully");
  } catch (error) {
    return requestFail(res, "Can't withdraw project now");
  }
}

// PR Request approve
async function changeStatus(req, res) {
  if (!req.params.id || !req.params.status) return requestFail(res);

  // store all request data into project var
  let formData = req.body,
    currentUser = await getAdmin();

  if (!currentUser) requestFail(res, "Unauthorized request");

  // update entry who is updating the field
  formData.updatedBy = currentUser.id;

  // get pr request from database
  let tempPRObj = null;

  try {
    tempPRObj = await RequestModel.findOne({ id: req.params.id });
  } catch (error) {}

  if (!tempPRObj) requestFail(res);

  let tempMessageList = tempPRObj.messages ?? [];

  if (!Array.isArray(tempMessageList)) {
    tempMessageList = [];
  }

  tempMessageList.push({
    id: generatePassword(17),
    user: currentUser.id,
    userName: currentUser.name,
    message: formData.comment,
    postedAt: new Date().toString(),
  });

  formData.status = formData?.status?.toLowerCase()
    ? formData?.status?.toLowerCase()
    : "unknown";

  formData.prApproveDate = new Date().toString();
  formData.prApproveComment = formData.comment;
  formData.messages = tempMessageList;

  RequestModel.updateOne(
    { id: req.params.id },
    { $set: formData },
    (error, result) => {
      if (!error) {
        return requestSuccess(res);
      } else {
        return requestFail(res, "Something went wrong can't approve.");
      }
    }
  );
}
module.exports = {
  list,
  get,
  create,
  update,
  delete: remove,
  withdraw,
  changeStatus,
};
