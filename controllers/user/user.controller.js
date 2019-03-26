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
};
