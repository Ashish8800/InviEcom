const {
  requestSuccess,
  requestFail,
} = require("../../helpers/RequestResponse.helper");
const { ContactModel } = require("../../models");
const { generateId, getAdmin } = require("../../helpers/Common.helper");

async function list(req, res) {
  const list = await ContactModel.find(
    { status: { $ne: "deleted" }, ...req.query },
    ["-_id", "-__v"]
  );
  if (list && list.length > 0) {
    return requestSuccess(res, list);
  }
  return requestFail(res, "Can't find any contact");
}

async function get(req, res) {
  // Verify request containe a contact id
  if (!req.params.id) {
    return requestFail(res, "Invalid contact id");
  }

  // Fetch contact detail form database
  const list = await ContactModel.findOne(
    { status: { $ne: "deleted" }, id: req.params.id },
    ["-_id", "-__v"]
  );

  // Check we got some result form the database or not
  // if get some result form database the send back to client
  if (list) {
    return requestSuccess(res, list);
  }

  // fail request if nothing worked
  return requestFail(res, "Can't find contact");
}

async function create(req, res) {
  // get current user

  // Get data and verify as per need
  let contact = req.body;

  if (!contact.name) {
    return requestFail(res, "contact name is required");
  }

  if (await ContactModel.findOne({ name: contact.name })) {
    return requestFail(res, "Duplicate contact name");
  }

  // generate a unique id for contact
  const id = `T${generateId(5)}`;

  // add missing detail in the contact object
  contact.id = id;
  contact.status = "active";

  // Now try to create a new contact
  try {
    await new ContactModel(contact).save();
    return requestSuccess(res);
  } catch (error) {
    print(error);
  }

  return requestFail(res, "Something went wrong, Can't create contact now.");
}

async function update(req, res) {
  // Verify request containe a contact id
  if (!req.params.id) {
    return requestFail(res, "Invalid contact id");
  }

  // store all request data into contact var
  let contact = req.body,
    ADMIN = await getAdmin();

  // update entry who is updateing the field
  contact.updatedBy = ADMIN.id;

  if (contact.id && req.params.id != contact.id)
    requestFail(res, "Something went wrong, Can't update contact");

  delete contact.id;

  // find contact as per name
  let dbcontact = await ContactModel.findOne({
    name: contact.name,
  });

  if (dbcontact) {
    if (dbcontact.id != req.params.id)
      requestFail(res, "contact already in use");
  }

  contactModel.updateOne(
    { id: req.params.id },
    { $set: { ...contact } },
    (error, result) => {
      if (!error) {
        return requestSuccess(res);
      } else {
        return requestFail(res, "Can't delete contact now");
      }
    }
  );
}

async function remove(req, res) {
  // Verify request containe a contact id
  if (!req.params.id) {
    return requestFail(res, "Invalid contact id");
  }

  let ADMIN = await getAdmin();

  try {
    await ContactModel.updateOne(
      { id: req.params.id },
      { $set: { status: "deleted", updatedBy: ADMIN.id } }
    );
    return requestSuccess(res, "contact deleted successfully");
  } catch (error) {
    return requestFail(res, "Can't delete contact now");
  }
}

module.exports = {
  list,
  get,
  create,
  update,
  delete: remove,
};
