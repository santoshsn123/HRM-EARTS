const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const models = require("./models");
const router = require("./routers");
let app = express();
app.server = http.createServer(app);

const multer = require("multer");
const upload = multer({ dest: "./uploads/" });

console.log("is this ??");
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
app.use("/imageUpload", upload.single("profilePic"), (req, res) => {
  console.log("Image Uploading Here ", req);
  // res.send("Uploading Here ...");
  if (req.file) {
    console.log("Uploading file...");
    var arr = req.file.originalname.split(".");
    arr[arr.length - 1];
    var filename = req.file.filename + "." + arr[arr.length - 1];
    console.log("FileName : - ", filename);
    var uploadStatus = "File Uploaded Successfully";
  } else {
    console.log("No File Uploaded");
    var filename = "FILE NOT UPLOADED";
    var uploadStatus = "File Upload Failed";
  }
  res.send({ uploadStatus: uploadStatus, filename: filename });
});
app.use("/", router);

app.server.listen(process.env.PORT || 9999, () => {
  console.log(`Started on port ${app.server.address().port}`);
});

exports.app; // default app;
