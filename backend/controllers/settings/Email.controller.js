const {
  requestSuccess,
  requestFail,
} = require("../../helpers/RequestResponse.helper");
const { EmailModel } = require("../../models");
const { generateId, getAdmin } = require("../../helpers/Common.helper");

async function list(req, res) {
  const list = await EmailModel.find(
    { status: { $ne: "deleted" }, ...req.query },
    ["-_id", "-__v"]
  );
  if (list && list.length > 0) {
    return requestSuccess(res, list);
  }
  return requestFail(res, "Can't find any email");
}

async function get(req, res) {
  // Verify request containe a email id
  if (!req.params.id) {
    return requestFail(res, "Invalid email id");
  }

  // Fetch email detail form database
  const list = await EmailModel.findOne(
    { status: { $ne: "deleted" }, id: req.params.id },
    ["-_id", "-__v"]
  );

  // Check we got some result form the database or not
  // if get some result form database the send back to client
  if (list) {
    return requestSuccess(res, list);
  }

  // fail request if nothing worked
  return requestFail(res, "Can't find email");
}

async function create(req, res) {
  // get current user
  let ADMIN = await getAdmin();

  // Get data and verify as per need
  let emailForm = req.body;

  if (!emailForm.email) {
    return requestFail(res, "email  is required");
  }

  if (await EmailModel.findOne({ email: emailForm.email })) {
    return requestFail(res, "Duplicate email name");
  }

  // generate a unique id for email
  const id = `EM${generateId(5)}`;

  // add missing detail in the email object
  emailForm.id = id;
  emailForm.status = "active";
  emailForm.createdBy = ADMIN.id;
  emailForm.updatedBy = ADMIN.id;

  // Now try to create a new email
  try {
    await new EmailModel(emailForm).save();
    return requestSuccess(res);
  } catch (error) {
    print(error);
  }

  return requestFail(res, "Something went wrong, Can't create email now.");
}

async function update(req, res) {
  // Verify request containe a email id
  if (!req.params.id) {
    return requestFail(res, "Invalid email id");
  }

  // store all request data into email var
  let email = req.body,
    ADMIN = await getAdmin();

  // update entry who is updateing the field
  email.updatedBy = ADMIN.id;

  if (email.id && req.params.id != email.id)
    return requestFail(res, "Something went wrong, Can't update email");

  delete email.id;

  // find email as per name
  let dbemail = await EmailModel.findOne({
    name: email.name,
  });

  EmailModel.updateOne(
    { id: req.params.id },
    { $set: { ...email } },
    (error, result) => {
      if (!error) {
        return requestSuccess(res);
      } else {
        return requestFail(res, "Can't delete email now");
      }
    }
  );
}

async function remove(req, res) {
  // Verify request containe a email id
  if (!req.params.id) {
    return requestFail(res, "Invalid email id");
  }

  let ADMIN = await getAdmin();

  try {
    await EmailModel.updateOne(
      { id: req.params.id },
      { $set: { status: "deleted", updatedBy: ADMIN.id } }
    );
    return requestSuccess(res, "Email deleted successfully");
  } catch (error) {
    return requestFail(res, "Can't delete email now");
  }
}

module.exports = {
  list,
  get,
  create,
  update,
  delete: remove,
};
