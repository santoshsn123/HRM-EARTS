const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const models = require("./models");
const router = require("./routers");
let app = express();
app.server = http.createServer(app);

console.log("is this ?");
// logger
app.use(morgan("dev"));

// 3rd party middleware
app.use(
  cors({
    exposedHeaders: ["Link"]
  })
);

app.use(
  bodyParser.json({
    limit: "100kb"
  })
);

app.use("/", router);

app.server.listen(process.env.PORT || 9999, () => {
  console.log(`Started on port ${app.server.address().port}`);
});

exports.app; // default app;
