const express = require("express");
const router = express.Router();

const timings = require("../../controllers/qrcode/qrcode.controller");
const authentication = require("../../config/auth.js");

router.post("/create", timings.createQrCode);
//   .get("/getMonthlyStat/:id/:date", timings.getMonthlyStat)
//   .get("/getWorkingDays/:date", timings.getWorkingDays)
//   .get("/getLeavesInMonth/:id/:date", timings.getLeavesInMonth)
//   .get("/getSalaryMonth/:id/:date", timings.getSalaryMonth)
//   .get("/getPunchinStatusForDay/:id/:date", timings.getPunchinStatusForDay)
//   .get("/getPunchStat/:id", timings.getStatus)
//   .put("/punchOut/:id", timings.punchOut);

module.exports = router;
