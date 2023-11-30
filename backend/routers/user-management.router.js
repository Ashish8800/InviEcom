const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userManagement/User.controller");
const RoleController = require("../controllers/userManagement/Role.controller");

router.post("/user/reset-password", UserController.forgetPassword);
router.post("/user/change-password", UserController.changePassword);
router.put("/user/:id/change-password", UserController.updatePassword);
router.get("/user", UserController.list);
router.get("/user/:id", UserController.get);
router.post("/user", UserController.create);
router.put("/user/:id", UserController.update);
router.delete("/user/:id", UserController.delete);

router.get("/role", RoleController.list);
router.get("/role/:id", RoleController.get);
router.post("/role", RoleController.create);
router.put("/role/:id", RoleController.update);
router.delete("/role/:id", RoleController.delete);

module.exports = router;
