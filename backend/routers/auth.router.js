const express = require("express");
const router = express.Router();
const controller = require("../controllers/Auth.controller");

const handleAdminLogin =
  require("../controllers/userManagement/User.controller").login;

router.post("/admin/login", handleAdminLogin);

module.exports = router;
