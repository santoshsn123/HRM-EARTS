const express = require("express");
const router = express.Router();

const timings = require("../../controllers/timings/timings.controller");
const authentication = require("../../config/auth.js");

router
  .put("/punchIn/:id", timings.punchIn)
  .get("/getMonthlyStat/:id/:date", timings.getMonthlyStat)
  .get("/getPunchStat/:id", timings.getStatus)
  .put("/punchOut/:id", timings.punchOut);

module.exports = router;
