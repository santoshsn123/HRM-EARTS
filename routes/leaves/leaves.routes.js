const express = require("express");
const router = express.Router();

const leaves = require("../../controllers/leaves/leaves.controller");
const authentication = require("../../config/auth.js");

router
  .get("/", leaves.getAllLeaves)
  .get("/:id", leaves.getOneLeaves)
  .delete("/:id", leaves.deleteLeaves)
  .post("/", leaves.createLeave)
  .put("/:id", leaves.updateLeave)

  .get("/apply/user/:id", leaves.getUserLeaves)
  .get("/apply/admin/", leaves.getAllAppliedLeaves)
  .put("/apply/:id", leaves.changeStatusByAdmin)
  .post("/apply", leaves.applyLeaves);

//   .get("/user/", user.getAllUser)
//   .put("/changePassword/:id", user.changePass);

module.exports = router;
