const express = require("express");
const router = express.Router();

const adminCtrl = require("../../controllers/admin/admin.controller");
const authentication = require("../../config/auth.js");

router
  .post("/login", adminCtrl.loginApi)
  .post(
    "/basicEmpDetails",
    authentication.loginRequired,
    adminCtrl.addEmpByAdmin
  )
  .get("/userStatus/:id", adminCtrl.getRegStatus)
  .get("/users", authentication.loginRequired, adminCtrl.getUsers)
  .put("/users/:id", authentication.loginRequired, adminCtrl.updateUser)
  .delete("/users/:id", authentication.loginRequired, adminCtrl.deleteUser)
  .put(
    "/userStatus/:id",
    authentication.loginRequired,
    adminCtrl.updateUserStatus
  );

module.exports = router;
