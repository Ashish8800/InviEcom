const { object, string } = require("yup");
const {
  requestSuccess,
  requestFail,
} = require("../../helpers/RequestResponse.helper");
const { UserModel } = require("../../models");
const {
  generateId,
  getAdmin,
  generatePassword,
  generateJWT,
  verifyJWT,
} = require("../../helpers/Common.helper");
const bcrypt = require("bcryptjs");
const pipeline = require("../../database/pipelines/userManagement/User.pipeline");
const {
  userAccountCreate,
  sendRestLinkToUser,
} = require("../../helpers/Mail.helper");

async function list(req, res) {
  const list = await UserModel.find(
    { status: { $ne: "deleted" }, ...req.query },
    ["-_id", "-__v", "-password"]
  );
  if (list && list.length > 0) {
    return requestSuccess(res, list);
  }
  return requestFail(res, "Can't find any user");
}

async function get(req, res) {
  // Verify request contained a user id
  if (!req.params.id) {
    return requestFail(res, "Invalid user id");
  }

  // Fetch user detail form database
  const list = await UserModel.findOne(
    { status: { $ne: "deleted" }, id: req.params.id },
    ["-_id", "-__v", "-password"]
  );

  // Check we got some result form the database or not
  // if get some result form database the send back to client
  if (list) {
    return requestSuccess(res, list);
  }

  // fail request if nothing worked
  return requestFail(res, "Can't find user");
}

async function create(req, res) {
  // get current user
  let ADMIN = await getAdmin();

  // Get data and verify as per need
  let user = req.body;

  if (!user.name) {
    return requestFail(res, "User name is required");
  }

  if (!user.role) {
    return requestFail(res, "Role Id is required");
  }

  if (await UserModel.findOne({ email: user.email })) {
    return requestFail(res, "User already exits");
  }

  // generate a unique id for user
  const id = `U${generateId(7)}`;
  const tempPass = generatePassword();

  print(tempPass);

  // add missing detail in the user object
  user.id = id;
  user.status = "active";
  user.password = bcrypt.hashSync(tempPass, 8);
  user.createdBy = ADMIN.id;
  user.updatedBy = ADMIN.id;

  // Now try to create a new user
  try {
    await new UserModel(user).save();
    userAccountCreate({
      to: user.email,
      userName: user.name,
      userEmail: user.email,
      password: tempPass,
    });
    return requestSuccess(res);
  } catch (error) {
    print(error);
  }

  return requestFail(res, "Something went wrong, Can't create user now.");
}

async function update(req, res) {
  // Verify request contained a user id
  if (!req.params.id) {
    return requestFail(res, "Invalid user id");
  }

  // store all request data into user var
  let user = req.body;

  let ADMIN = await getAdmin();

  // update entry who is updating the field
  user.updatedBy = ADMIN.id;

  if (user.id && req.params.id != user.id)
    requestFail(res, "Something went wrong, Can't update user");

  delete user.id;

  // find user as per email
  let dbWarehouse = await UserModel.findOne({ email: user.email }, [
    "-_id",
    "-__v",
  ]);

  if (dbWarehouse) {
    if (dbWarehouse.id != req.params.id)
      requestFail(res, "User email already in use");
  }

  UserModel.updateOne(
    { id: req.params.id },
    { $set: { ...user } },
    (error, result) => {
      if (!error) {
        return requestSuccess(res);
      } else {
        return requestFail(res, "Can't delete user now");
      }
    }
  );
}

async function remove(req, res) {
  // Verify request contained a user id
  if (!req.params.id) {
    return requestFail(res, "Invalid user id");
  }

  let ADMIN = await getAdmin();

  try {
    await UserModel.updateOne(
      { id: req.params.id },
      { $set: { status: "deleted", updatedBy: ADMIN.id } }
    );
    return requestSuccess(res, "User deleted successfully");
  } catch (error) {
    return requestFail(res, "Can't delete user now");
  }
}

async function login({ body }, res) {
  let loginForm = null;
  let user = null;

  const LoginSchema = object({
    email: string()
      .required("Please enter an email")
      .min(3, "Email is to short. Look like you enter a wrong email")
      .email(),
    password: string().min(6, "Password must be greater then 6"),
  });

  try {
    loginForm = await LoginSchema.validate(body);
  } catch (e) {
    return requestFail(res, e.message);
  }

  try {
    user = await UserModel.aggregate(pipeline({ email: loginForm.email }));
  } catch (e1) {}

  if (user && user.length > 0) {
    user = user[0];
  } else {
    return requestFail(res, "Email address not register with us.");
  }

  if (user.status !== "active")
    return requestFail(
      res,
      "You can't login to your account. Maybe your are blocked"
    );

  const isPasswordMatch = await bcrypt.compare(
    loginForm.password,
    user.password
  );

  if (!isPasswordMatch)
    return requestFail(res, 4004, "Email or Password is wrong.");

  return requestSuccess(res, {
    ...user,
    token: generateJWT({
      id: user.id,
      email: user.email,
      name: user.name,
    }),
  });
}

async function forgetPassword({ body }, res) {
  let fpForm = null;
  let user = null;

  const fpFormSchema = object({
    email: string()
      .required("Please enter an email")
      .min(3, "Email is to short. Look like you enter a wrong email")
      .email(),
  });

  try {
    fpForm = await fpFormSchema.validate(body);
  } catch (e) {
    return requestFail(res, e.message);
  }

  try {
    user = await UserModel.findOne({ email: fpForm.email });
  } catch (e1) {}

  if (!user) return requestFail(res, "Email address not register with us.");

  if (user.status !== "active")
    return requestFail(
      res,
      "You can't reset password of your account. Maybe your are blocked"
    );

  if (user.resetLimit == (process.env.RESET_PASSWORD_ATTEMPT_LIMIT ?? 3)) {
    let lastResetDate = new Date(user.resetDate);
    let currentDate = new Date();

    if (
      lastResetDate &&
      lastResetDate.getDate() == currentDate.getDate() &&
      lastResetDate.getMonth() == currentDate.getMonth()
    ) {
      return requestFail(
        res,
        "You have reach maximum reset password attempt limit,\r\n Try resetting your password after next day"
      );
    }
  }

  let token = generateJWT(
    {
      email: user.email,
      id: user.id,
    },
    {
      expiresIn: "2h",
    }
  );

  try {
    UserModel.updateOne(
      { id: user.id },
      {
        $set: {
          resetToken: token,
          resetLimit: (parseInt(user.resetLimit) ?? 0) + 1,
          resetDate: Date.now(),
        },
      },
      (error, result) => {
        if (!error) {
          sendRestLinkToUser({
            to: user.email,
            userName: user.name,
            userEmail: user.email,
            token: token,
          });
          return requestSuccess(
            res,
            "We have send an email at your register email address"
          );
        } else {
          print(error, result);
          return requestFail(res, "Something went wrong");
        }
      }
    );
  } catch (err) {
    return requestFail(res, err.message);
  }
}

async function changePassword({ body }, res) {
  let cpForm = null;
  let user = null;

  const cpFormSchema = object({
    password: string()
      .required("Please enter an password")
      .min(3, "Email is to short. Look like you enter a wrong email"),
    token: string().required("Something went wrong"),
  });

  try {
    cpForm = await cpFormSchema.validate(body);
  } catch (e) {
    return requestFail(res, e.message);
  }

  // verify token
  let tokenUser = verifyJWT(cpForm.token);

  if (!tokenUser)
    return requestFail(res, "Something went wrong, Retry to change password");

  try {
    user = await UserModel.findOne({ email: tokenUser.email });
  } catch (e1) {}

  if (!user) return requestFail(res, "Email address not register with us.");

  if (user.status !== "active")
    return requestFail(
      res,
      "You can't reset password of your account. Maybe your are blocked"
    );

  if (user.resetToken != cpForm.token) {
    return requestFail(
      res,
      "You are using an invalid link to reset password, Request again to reset you password"
    );
  }

  UserModel.updateOne(
    { id: tokenUser.id },
    {
      $set: {
        password: bcrypt.hashSync(cpForm.password, 8),
        resetLimit: 0,
        resetToken: "",
      },
    },
    (error, result) => {
      if (!error) {
        return requestSuccess(res, "Password updated successfully");
      } else {
        return requestFail(res, "Can't update password");
      }
    }
  );
}

async function updatePassword(req, res) {
  let upForm = null;
  let user = null;

  if (!req.params.id)
    return requestFail(res, "Can't update password try again");

  const upFormSchema = object({
    password: string().required("Please enter an password"),
    currentPassword: string().required("Please enter your current password"),
  });

  try {
    upForm = await upFormSchema.validate(req.body);
  } catch (e) {
    return requestFail(res, e.message);
  }

  try {
    user = await UserModel.findOne({ id: req.params.id });
  } catch (e1) {}

  if (!user) return requestFail(res, "Email address not register with us.");

  if (user.status !== "active")
    return requestFail(
      res,
      "You can't update password of your account. Maybe your are blocked"
    );

  const isPasswordMatch = await bcrypt.compare(
    req.body.currentPassword,
    user.password
  );

  if (!isPasswordMatch)
    return requestFail(res, 4004, "You entered wrong current password");

  UserModel.updateOne(
    { id: req.params.id },
    {
      $set: {
        password: bcrypt.hashSync(upForm.password, 8),
        resetLimit: 0,
        resetToken: "",
      },
    },
    (error, result) => {
      if (!error) {
        return requestSuccess(res, "Password updated successfully");
      } else {
        return requestFail(res, "Can't update password");
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
  login,
  forgetPassword,
  changePassword,
  updatePassword,
};
