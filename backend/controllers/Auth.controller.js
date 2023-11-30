const { object, string } = require("yup");
const User = require("../models/User.model");
const {
  requestFail,
  requestSuccess,
} = require("../helpers/RequestResponse.helper");

var bcrypt = require("bcryptjs");
const { generateJWT, generateId } = require("../helpers/Common.helper");
const { request } = require("express");

async function login({ body }, res) {
  const LoginSchema = object({
    email: string()
      .required("Please enter an email")
      .min(3, "Email is to short. Look like you enter a wrong email")
      .email(),
    password: string().min(6, "Password must be greater then 6"),
  });
  let reqData = null;

  try {
    reqData = await LoginSchema.validate(body);
  } catch (e) {
    return requestFail(res);
  }

  let user = null;
  let displayPortal = null;

  try {
    if (user === null) {
      user = await User.findOne({ email: reqData.email });
      displayPortal = "admin";

      if (user.status !== "active")
        return requestFail(
          res,
          "You can't login to your account. Maybe your are blocked"
        );
    }
  } catch (e2) {}

  if (!user) return requestFail(res, "Email address not register with us.");

  const isPasswordMatch = await bcrypt.compare(reqData.password, user.password);

  if (!isPasswordMatch)
    return requestFail(res, 4004, "Email or Password is wrong.");

  const responseData = {
    id: user.userId ? user.userId : user.id,
    name: user.userName ? user.userName : user.name,
    email: user.email,
    portal: displayPortal,
    status: user.status,
  };

  if (displayPortal == "customer")
    responseData.emailVerified = user.emailVerified;

  return requestSuccess(res, {
    ...responseData,
    token: generateJWT(responseData),
  });
}

async function register(req, res) {
  const RegisterSchema = object({
    name: string().min(2, "Name is to short"),
    email: string()
      .required("Please enter an email")
      .min(3, "Email is to short. Look like you enter a wrong email")
      .email(),
    password: string().min(6, "Password must be greater then 6"),
  });

  let reqData = null;
  try {
    reqData = await RegisterSchema.validate(req.body);
  } catch (e) {
    return requestFail(res, e.message);
  }

  if (!reqData) return requestFail(res);

  let dbUser = null;

  try {
    dbUser = await User.findOne({ email: reqData.email });
  } catch (error) {}

  if (dbUser)
    return requestFail(res, "Email address already registered successfully");

  const encryptedPassword = bcrypt.hashSync(reqData.password, 8);
  const geneUserId = `U${generateId(10)}`;

  new User({
    id: geneUserId,
    name: reqData.name,
    mobile: "",
    email: reqData.email,
    password: encryptedPassword,
    emailVerified: true,
    status: "active",
    createdOn: new Date(),
    updatedOn: new Date(),
    createdBy: geneUserId,
    updatedBy: geneUserId,
  }).save((err, dbRes) => {
    if (err) return requestFail(res, "Can't register an account");

    let data = {
      id: dbRes.id,
      name: dbRes.name,
      email: dbRes.email,
    };

    return requestSuccess(
      res,
      `Hi ${dbRes.name}, You are registered successfully with us.`,
      {
        name: dbRes.name,
        email: dbRes.email,
        token: generateJWT(data),
      }
    );
  });
}

module.exports = {
  login,
  register,
};
