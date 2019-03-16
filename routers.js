const express = require("express");
const router = express.Router();
const adminRoutes = require("./routes/admin/admin.routes");

router.get("/", (req, res) => {
  res.send("From Router File");
});

router.use("/api/admin", adminRoutes);

module.exports = router;
