const express = require("express");
const router = express.Router();

const user = require("../../controllers/user/user.controller");
const authentication = require("../../config/auth.js");

router
  .get("/user/:id", user.getUser)
  .get("/user/", user.getAllUser)
  .put("/changePassword/:id", user.changePass);

module.exports = router;
