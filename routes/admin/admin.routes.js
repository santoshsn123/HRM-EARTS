const express = require("express");
const router = express.Router();

const adminCtrl = require("../../controllers/admin/admin.controller");

router.get("/login", adminCtrl.loginApi);

module.exports = router;
