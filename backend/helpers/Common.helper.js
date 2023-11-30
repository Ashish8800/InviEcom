const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const CustomerModel = require("../models/website/Customer/Customer.model");
const { UserModel, CurrencyModel } = require("../models");

const jwtToken = process.env.JWT_SERVER_TOKEN || "token";

//  Define this method to generate random number to represent service _id

/**
 * It generates a random number of a given length
 * @param [length=5] - The length of the ID to be generated.
 * @returns a random number of length 5.
 */

function generateId(length = 5) {
  let id = "";
  for (let i = 0; i < length; i++) {
    id += Math.floor(Math.random() * (9 - 0)) + 0;
  }
  return id;
}

function generatePassword() {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

function generateOTP() {
  var digits = "0123456789";
  var otpLength = 4;
  var otp = "";
  for (let i = 1; i <= otpLength; i++) {
    var index = Math.floor(Math.random() * digits.length);
    otp = otp + digits[index];
  }
  return otp;
}

async function generateNextSerialNumber(model, length = 1) {
  try {
    // Get the current date
    
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const model_query = {
      createdOn: {
        $gte: new Date(
          `${today.getFullYear()}-${(today.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-01T07:35:30.017+00:00`
        ),
      },
    };

    // Find the count of documents created today
    const todayCount = await model.find(model_query);

    // Calculate the next serial number
    const nextSerialNumber = (todayCount.length ?? 0) + 1;

    return nextSerialNumber.toString().padStart(length, "0");
  } catch (error) {
    console.error("Error generating next serial number:", error);
    throw error;
  }
}

function generateJWT(data = null, config = { expiresIn: "10d" }) {
  return jwt.sign(data, jwtToken, config);
}

function verifyJWT(token) {
  try {
    return jwt.verify(token.trim(), jwtToken);
  } catch (error) {
    print(error.message, "function : verifyJWT; file : Common.helper.js");
    return false;
  }
}

async function getAdmin() {
  const requestToken = getRequestToken();
  let user = requestToken ? verifyJWT(requestToken) : null;
  if (user)
    try {
      user = await UserModel.findOne({ email: user.email });
      return { id: user.id, name: user.name, email: user.email };
    } catch (error) {
      return false;
    }
}

async function getCustomer() {
  const requestToken = getRequestToken();
  let user = requestToken ? verifyJWT(requestToken) : null;
  if (user)
    try {
      user = await CustomerModel.findOne({ email: user.email });
      return { id: user.id, name: user.name, email: user.email };
    } catch (error) {
      return false;
    }
}

async function getCurrentUser() {
  // Get token from request and verify
  let tempUser = verifyJWT(getRequestToken());

  let user = false;

  // check user is valid customer
  try {
    user = await CustomerModel.findOne({ id: tempUser.id });
  } catch (err) {
    print(err.message);
  }

  if (!user) {
    try {
      user = await UserModel.findOne({ id: tempUser.id });
    } catch (err) {
      print(err.message);
    }
  }

  if (user) return { id: user.id, name: user.name, email: user.email };

  return user;
}

function getRequestToken() {
  try {
    return currentHttpRequest.headers["authorization"].split(" ")[1];
  } catch (error) {
    return "";
  }
}

async function paramProxy(value) {
  if (typeof value === "object") {
    let cValue = JSON.stringify(value);

    let user = await getCurrentUser();
    if(user) cValue = cValue.replace("__self__", user.id);

    return JSON.parse(cValue);
  }
  return false;
}

module.exports = {
  generateId,
  generatePassword,
  generateOTP,
  generateNextSerialNumber,
  generateJWT,
  verifyJWT,
  getAdmin,
  paramProxy,
  getCustomer,
  getCurrentUser,
};
