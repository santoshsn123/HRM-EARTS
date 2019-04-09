const models = require("../../models");
const jwt = require("jsonwebtoken");
const fs = require("fs");
var privateCert = fs.readFileSync("cert/jwtRS256.key");
const md5 = require("md5");
const q = require("q");
const Sequelize = require("sequelize");
var Op = Sequelize.Op;
const mail = require("../../config/mail");

exports.getUser = (req, res) => {
  var id = req.params.id;
  models.Employees.findOne({ where: { id: id } }).then(data => {
    res.send(data);
  });
};

exports.changePass = (req, res) => {
  var id = req.params.id;
  let oldpassword = req.body.oldpassword;
  let newpassword = req.body.newpassword;
  let confpassword = req.body.confpassword;
  if (newpassword !== confpassword) {
    return res.status(403).jsonp({ message: "Password Missmatch" });
  }
  if (req.body.userType == "admin") {
    models.Admin.findOne({
      where: { id: id, password: md5(oldpassword) }
    }).then(data => {
      if (!data) {
        return res.status(403).jsonp({ message: "Wrong Password !!!" });
      } else {
        models.Admin.update(
          { password: md5(newpassword) },
          { where: { id: id } }
        ).then(data => {
          res
            .status(200)
            .jsonp({ message: "Password Changed Successfully !!!" });
        });
      }
    });
  } else {
    models.Employees.findOne({
      where: { id: id, password: md5(oldpassword) }
    }).then(data => {
      if (!data) {
        return res.status(403).jsonp({ message: "Wrong Password !!!" });
      } else {
        models.Employees.update(
          { password: md5(newpassword) },
          { where: { id: id } }
        ).then(data => {
          res
            .status(200)
            .jsonp({ message: "Password Changed Successfully !!!" });
        });
      }
      // res.send(data);
    });
  }
};

exports.getAllUser = (req, res) => {
  models.Employees.findAll({}).then(data => {
    res.send(data);
  });
};

exports.sampleMail = (req, res) => {
  mail
    .welcomeMail({
      userName: "Santosh narwade",
      link: "http://entitledarts.com/hrm/cashless-admin/",
      to: "snarwade59@gmail.com"
    })
    .then(data => {
      res.send({ response: data });
    });

  // const mailjet = require("node-mailjet").connect(
  //   "a1ebc5d8ab971c1befab3dae5b85181e",
  //   "436f125a36a9e5b9e9b0f331b2f9708f"
  // );
  // const request = mailjet.post("send", { version: "v3.1" }).request({
  //   Messages: [
  //     {
  //       From: {
  //         Email: "santosh.narawade1@gmail.com",
  //         Name: "Santosh Narwade"
  //       },
  //       To: [
  //         {
  //           Email: "snarwade59@gmail.com",
  //           Name: "Santosh"
  //         }
  //       ],
  //       Subject: "My Mail is here",
  //       TextPart:
  //         "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
  //       HTMLPart:
  //         "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!"
  //     }
  //   ]
  // });
  // request
  //   .then(result => {
  //     console.log(result.body);
  //     res.send(result.body);
  //   })
  //   .catch(err => {
  //     console.log(err.statusCode);
  //     res.send(err.statusCode);
  //   });
};

exports.imageUpload = (req, res) => {
  let id = req.params.userId;
  // console.log("Image Uploading Here ", req);
  // res.send("Uploading Here ...");
  if (req.file) {
    // console.log("Uploading file...");
    var arr = req.file.originalname.split(".");
    arr[arr.length - 1];
    // var filename = req.file.filename + "." + arr[arr.length - 1];
    // console.log("FileName : - ", filename);
    var uploadStatus = "File Uploaded Successfully";
    models.Employees.findOne({ where: { id: id } }).then(user => {
      const newName = user.firstName + "_" + id + "." + arr[arr.length - 1];
      fs.rename(req.file.path, "uploads/" + newName, error => {
        models.Employees.update({ image: newName }, { where: { id: id } }).then(
          updateDone => {
            res.send({ uploadStatus: uploadStatus, filename: filename });
          }
        );
      });
    });
  } else {
    console.log("No File Uploaded");
    var filename = "FILE NOT UPLOADED";
    var uploadStatus = "File Upload Failed";
  }
};

exports.showImage = (req, res) => {
  let image = req.params.image;

  fs.readFile("uploads/" + image, function(err, content) {
    if (err) {
      res.writeHead(400, { "Content-type": "text/html" });
      console.log(err);
      res.end("No such image");
    } else {
      //specify the content type in the response will be an image
      res.writeHead(200, { "Content-type": "image/jpg" });
      res.end(content);
    }
  });
};
