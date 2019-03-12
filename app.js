const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const models = require("./models");
let app = express();
app.server = http.createServer(app);

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

app.get("/", (req, res) => {
  res.send("Welcome to the app New another");
});
app.get("/api", (req, res) => {
  models.Admin.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send(err);
    });
});

app.server.listen(process.env.PORT || 9999, () => {
  console.log(`Started on port ${app.server.address().port}`);
});

exports.app; // default app;
