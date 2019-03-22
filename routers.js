const express = require("express");
const router = express.Router();
const adminRoutes = require("./routes/admin/admin.routes");
const timingRoutes = require("./routes/timings/timings.routes");
const user = require("./routes/user/user.routes");
const leaves = require("./routes/leaves/leaves.routes");

router.get("/", (req, res) => {
  res.send("From Router File");
});

router
  .use("/api/admin", adminRoutes)
  .use("/api/timings", timingRoutes)
  .use("/api/user", user)
  .use("/api/leaves", leaves);

module.exports = router;
