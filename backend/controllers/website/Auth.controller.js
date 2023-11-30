const { object, string } = require("yup");
const { CustomerModel } = require("../../models");
// const sendHtmlEmail = require("end/InviECom_Server/controllers/website/passwordEmail.controller.js");
const sendHtmlEmail = require("./passwordEmail.controller");
const {
  sendResponse,
  requestFail,
  requestSuccess,
} = require("../../helpers/RequestResponse.helper");
const { sendForgetOTP } = require("../../helpers/Mail.helper");
const jwt = require("jsonwebtoken");
const { jwtToken } = require("../../helpers/Common.helper");

var bcrypt = require("bcryptjs");
const {
  generateJWT,
  generateId,
  generateOTP,
  getCustomer,
} = require("../../helpers/Common.helper");

async function verify(req, res) {
  const { body } = req;

  // Customer Schema
  const OTPSchema = object({
    otp: string().required(),
    otpToken: string().required("Something went wrong with OTP request."),
  });

  let rqData = null;

  //   Verify customer schema
  try {
    rqData = await OTPSchema.validate(body);
  } catch (e) {
    return sendResponse(res, 400, e.message);
  }

  if (!rqData) requestFail(res, "Something went wrong. Try again");

  let otpTokenResult = null;

  try {
    otpTokenResult = jwt.verify(rqData.otpToken, jwtToken + rqData.otp);
  } catch (error) {
    requestFail(res, "You enter wrong otp");
  }

  if (otpTokenResult) {
    let customer = await getCustomer();
    if (!customer) return requestFail(res, "Something went wrong.");
    try {
      CustomerModel.updateOne(
        { id: customer.id },
        {
          $set: {
            emailVerified: true,
            status: "active",
            updatedBy: customer.id,
            updatedOn: new Date(),
          },
        },
        async (error, result) => {
          if (error || result.modifiedCount == 0) {
            return requestFail(
              res,
              "Can't verify you email address at this time"
            );
          } else {
            customer = await CustomerModel.findOne({ id: customer.id });
            const successPayload = {
              id: customer.id,
              name: customer.name,
              email: customer.email,
              portal: "customer",
              emailVerified: customer.emailVerified,
              status: customer.status,
            };

            welcome(customer.email);
            return requestSuccess(res, "OTP verified successfully", {
              ...successPayload,
              token: generateJWT(successPayload),
            });
          }
        }
      );
    } catch (error) {
      return requestFail(res, "Can't verify you email address at this time");
    }
  }
}

async function reSendOTP(req, res) {
  let currentCustomer = await getCurrentCustomer(req);

  if (!currentCustomer) return requestFail(res);

  let customer = null;

  customer = await CustomerModel.findOne({ id: currentCustomer.id });

  if (!customer)
    requestFail(
      res,
      "Something went wrong with customer" + JSON.stringify(currentCustomer)
    );

  if (customer?.emailVerified)
    return requestFail(
      res,
      "Can't complete request this time, Maybe customer already verified."
    );

  const OTP = generateOTP();
  sendOTP(customer.email, OTP);
  const data = {
    otpToken: jwt.sign({}, jwtToken + OTP, { expiresIn: 600 }),
  };

  return requestSuccess(res, data);
}

async function forget(req, res) {
  const { body } = req;
  const forgetSchema = object({
    email: string()
      .required("Please enter an email")
      .min(3, "Email is to short. Look like you enter a wrong email")
      .email(),
  });

  let reqData = null;

  //   Verify customer schema
  try {
    reqData = await forgetSchema.validate(body);
  } catch (e) {
    return sendResponse(res, 400, e.message);
  }

  let customer = null;

  try {
    customer = await CustomerModel.findOne({ email: reqData.email }).exec();
  } catch (error) {
    return requestFail(res, "Something went wrong");
  }

  if (!customer)
    return requestFail(
      res,
      "Can't find any account associated with this email address"
    );

  const OTP = generateOTP();
  sendForgetOTP(customer.email, OTP);
  return requestSuccess(res, `OTP sent to your register email address`, {
    otpToken: jwt.sign({ id: customer.id }, jwtToken + OTP, { expiresIn: 600 }),
  });
}

async function changePassword(req, res) {
  const { body } = req;
  const changePasswordSchema = object({
    password: string().min(6, "Password must be greater then 6 ").required(),
    otp: string().required(),
    otpToken: string().required("Something went wrong."),
  });

  let reqData = null;

  //   verify customer provided data
  try {
    reqData = await changePasswordSchema.validate(body);
  } catch (e) {
    return sendResponse(res, 400, e.message);
  }

  let otpTokenResult = null;

  try {
    otpTokenResult = jwt.verify(reqData.otpToken, jwtToken + reqData.otp);
  } catch (error) {
    return requestFail(res, "You entered wrong otp");
  }

  if (!otpTokenResult) return requestFail(res, "You entered wrong otp");

  let customer = null;

  try {
    customer = await CustomerModel.findOne({ id: otpTokenResult.id });
  } catch (error) {
    return requestFail(res, "Something went wrong");
  }

  if (!customer)
    return requestFail(
      res,
      "Can't find any account associated with this email address"
    );

  let encryptedPassword = bcrypt.hashSync(reqData.password, 8);

  try {
    CustomerModel.updateOne(
      { id: otpTokenResult.id },
      {
        $set: {
          password: encryptedPassword,
          updatedBy: otpTokenResult.id,
          updatedOn: new Date(),
        },
      },
      async (error, result) => {
        if (error || result.modifiedCount == 0) {
          return requestFail(res, "Can't change password right now.");
        } else {
          return requestSuccess(res, "Password change successfully.");
        }
      }
    );
  } catch (error) {
    return requestFail(res, "Can't change password now.");
  }
}

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

  let customer = null;
  let displayPortal = null;

  try {
    customer = await CustomerModel.findOne({ email: reqData.email });
    displayPortal = "customer";
  } catch (e1) {}

  if (customer?.status !== "active")
  return requestFail(
    res,
    "You can't login to your account. Maybe your are blocked"
  );


  if (!customer) return requestFail(res, "Email address not register with us.");

  const isPasswordMatch = await bcrypt.compare(
    reqData.password,
    customer.password
  );

  if (!isPasswordMatch)
    return requestFail(res, 4004, "Email or Password is wrong.");

  const responseData = {
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    name: `${customer.firstName} ${customer.lastName}`,
  };

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

  let dbCustomer = null;

  try {
    dbCustomer = await CustomerModel.findOne({ email: reqData.email });
  } catch (error) {}

  if (dbCustomer)
    return requestFail(res, "Email address already registered with us.");

  const encryptedPassword = bcrypt.hashSync(reqData.password, 8);

  const geneCustomerId = `C${generateId(10)}`;

  new CustomerModel({
    id: geneCustomerId,
    firstName: reqData.firstName,
    lastName: reqData.lastName,
    mobile: "",
    email: reqData.email,
    password: encryptedPassword,
    emailVerified: true,
    status: "active",
    createdOn: new Date(),
    updatedOn: new Date(),
    createdBy: geneCustomerId,
    updatedBy: geneCustomerId,
  }).save((err, dbRes) => {
    if (err) return requestFail(res, "Can't register an account");

    let data = {
      id: dbRes.id,
      firstName: dbRes.firstName,
      lastName: dbRes.lastName,
      name: `${dbRes.firstName} ${dbRes.lastName}`,
      email: dbRes.email,
    };

    data.token = generateJWT(data);

    return requestSuccess(res, "Your account created successfully", data);
  });
}

module.exports = {
  verify,
  reSendOTP,
  forget,
  changePassword,
  login,
  register,
};
