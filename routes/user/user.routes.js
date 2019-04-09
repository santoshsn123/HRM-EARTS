const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ dest: "./uploads/" });
const user = require("../../controllers/user/user.controller");
const authentication = require("../../config/auth.js");

router
  .get("/user/:id", user.getUser)
  .get("/user/", user.getAllUser)
  .get("/sampleMail/", user.sampleMail)
  .post("/imageUpload/:userId", upload.single("profilePic"), user.imageUpload)
  .get("/showImage/:image", user.showImage)
  .put("/changePassword/:id", user.changePass);

module.exports = router;
