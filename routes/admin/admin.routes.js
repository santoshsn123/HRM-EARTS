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
  .put("/users/:id", adminCtrl.updateUser) //authentication.loginRequired,
  .put(
    "/usersByAdmin/:id",
    authentication.loginRequired,
    adminCtrl.updateUserbyAdmin
  )
  .delete("/users/:id", authentication.loginRequired, adminCtrl.deleteUser)
  .post("/forgetPassword", adminCtrl.forgetPassword)
  .get("/forgetPassword/:link", adminCtrl.validateLink)
  .put("/forgetPassword/:link", adminCtrl.forgetPassUpdate)
  .put(
    "/userStatus/:id",
    authentication.loginRequired,
    adminCtrl.updateUserStatus
  );

module.exports = router;
