const { getAdmin, getCustomer } = require("../helpers/Common.helper");

module.exports = async (req, res, next) => {
try{
  let user = {},
  admin = await getAdmin(),
  customer = await getCustomer();

user = admin ? admin : customer ?? {};
user.admin = admin;
user.customer = customer;
req.user = user;
}catch(err){print(err)}
  next();
};
