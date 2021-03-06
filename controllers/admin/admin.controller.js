const models = require("../../models");
const jwt = require("jsonwebtoken");
const fs = require("fs");
var privateCert = fs.readFileSync("cert/jwtRS256.key");
const md5 = require("md5");
const baseUrl = "http://entitledarts.com/hrm";
const mail = require("../../config/mail");

exports.loginApi = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(403).jsonp({ message: "Please Enter All Fields" });
  }
  // /Check Employee Login/
  models.Employees.findOne({
    where: { email: req.body.email, password: md5(req.body.password) }
  }).then(emp => {
    if (emp) {
      if (!emp.isActive) {
        return res.status(403).jsonp({
          message:
            "Your account is Inactive, ask Admin to Activate your Account!!!"
        });
      } else {
        res.status(200).jsonp({
          status: true,
          userId: emp.id,
          userType: "employee",
          firstName: emp.firstName,
          token: jwt.sign({ subject: "HRM Token" }, privateCert, {
            algorithm: "RS256"
          })
        });
      }
    } else {
      // Check Admin Login
      models.Admin.findOne({
        where: {
          email: req.body.email,
          password: md5(req.body.password)
        }
      }).then(data => {
        if (data) {
          res.status(200).jsonp({
            status: true,
            userId: data.id,
            userType: "admin",
            firstName: data.firstName,
            token: jwt.sign({ subject: "HRM Token" }, privateCert, {
              algorithm: "RS256"
            })
          });
        } else {
          return res
            .status(403)
            .jsonp({ message: "Username / Password is wrong" });
        }
      });
    }
  });
};

//Get List of Users
exports.getUsers = (req, res) => {
  models.Employees.findAll({ order: [["id", "desc"]] }).then(data => {
    res.send(data);
  });
};

//Add Empoyee For First Time by admin
exports.addEmpByAdmin = (req, res) => {
  models.Admin.find({ where: { email: req.body.email } }).then(admin => {
    if (admin) {
      return res
        .status(400)
        .jsonp({ message: "Email already have used for admin account !!" });
    } else {
      models.Employees.findOne({ where: { email: req.body.email } }).then(
        data => {
          if (data) {
            res.status(400).jsonp({ message: "User Already Exists!!" });
          } else {
            const randomNumber = Math.floor(Math.random() * 1000000 + 1);
            models.Employees.create({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              salary: req.body.salary,
              linkCode: md5(randomNumber),
              isActive: false,
              isRegistered: false
            }).then(data => {
              mail
                .welcomeMail({
                  userName: "Santosh narwade",
                  registerLink: baseUrl + "/empRegisterLink/" + data.linkCode,
                  loginLink: baseUrl,
                  to: data.email
                })
                .then(mailres => {
                  res.status(200).jsonp({
                    message: "Employee Added successfully!!",
                    data: data,
                    mailresponse: mailres
                  });
                });
            });
          }
        }
      );
    }
  });
};

//Check User link status
exports.getRegStatus = (req, res) => {
  var id = req.params.id;
  models.Employees.findOne({
    where: { linkCode: id, isRegistered: false }
  })
    .then(data => {
      if (!data) {
        res.status(400).jsonp({ status: false, message: "Link is invalid" });
      } else {
        res.status(200).jsonp(data);
      }
    })
    .catch(data => {
      console.log("inside catch");
    });
};

//Update User Data
exports.updateUser = (req, res) => {
  var id = req.params.id;
  let userDetails = req.body;
  userDetails.isRegistered = true;
  delete userDetails.cpassword;
  if (userDetails.password) {
    userDetails.password = md5(userDetails.password);
  }

  models.Employees.update(userDetails, {
    where: { id: id }
  })
    .then(data => {
      if (!data) {
        res.status(400).jsonp({ status: false, message: "Link is invalid" });
      } else {
        res.status(200).jsonp(data);
      }
    })
    .catch(data => {
      console.log("inside catch");
    });
};
exports.updateUserbyAdmin = (req, res) => {
  console.log("Request Here :--- ");
  var id = req.params.id;
  let userDetails = req.body;
  console.log(userDetails);
  models.Employees.update(userDetails, {
    where: { id: id }
  })
    .then(data => {
      if (!data) {
        res.status(400).jsonp({ status: false, message: "Link is invalid" });
      } else {
        res.status(200).jsonp(data);
      }
    })
    .catch(data => {
      console.log("inside catch");
    });
};

//Update Active inActive Status of User By Admin
exports.updateUserStatus = (req, res) => {
  var id = req.params.id;
  models.Employees.findOne({
    where: { id: id }
  }).then(data => {
    let newStat = data.isActive ? false : true;
    models.Employees.update(
      { isActive: newStat },
      {
        where: { id: id }
      }
    ).then(data => {
      res.status(200).jsonp(data);
    });
  });
};

//Delete User By Admin
exports.deleteUser = (req, res) => {
  var id = req.params.id;
  models.Employees.destroy({
    where: { id: id }
  }).then(data => {
    res.status(200).jsonp(data);
  });
};

exports.forgetPassword = (req, res) => {
  req.body.email;
  const randomNumber = Math.floor(Math.random() * 1000000 + 1);
  models.Employees.findOne({ where: { email: req.body.email } }).then(user => {
    if (user) {
      models.Employees.update(
        { forgetPassword: md5(randomNumber) },
        { where: { id: user.id } }
      ).then(usernew => {
        mail
          .forgetPassword({
            to: user.email,
            resetLink: baseUrl + "/HRM/forgetPassword/" + md5(randomNumber),
            userName: user.firstName,
            loginLink: baseUrl + "/HRM"
          })
          .then(data => {
            return res.status(200).jsonp({
              message: "Email Sent containing information to reset password"
            });
          });
      });
    } else {
      models.Admin.findOne({ where: { email: req.body.email } }).then(admin => {
        if (admin) {
          models.Admin.update(
            { forgetPassword: md5(randomNumber) },
            { where: { id: admin.id } }
          ).then(adminnew => {
            mail
              .forgetPassword({
                to: admin.email,
                resetLink: baseUrl + "/HRM/forgetPassword/" + md5(randomNumber),
                userName: admin.firstName,
                loginLink: baseUrl + "/HRM"
              })
              .then(data => {
                return res.status(200).jsonp({
                  message: "Email Sent containing information to reset password"
                });
              });
          });
          // return res.status(200).jsonp({
          //   message: "Email Sent containing information to reset password"
          // });
        } else {
          return res.status(403).jsonp({
            message: "Email Id is not registered with Us"
          });
        }
      });
    }
  });
};

exports.validateLink = (req, res) => {
  link = req.params.link;
  // models.
  models.Employees.findOne({ where: { forgetPassword: link } }).then(emp => {
    if (emp) {
      return res.status(200).jsonp({
        message: "Valid Link",
        status: true
      });
    } else {
      models.Admin.findOne({ where: { forgetPassword: link } }).then(admin => {
        if (admin) {
          return res.status(200).jsonp({
            message: "Valid Link",
            status: true
          });
        } else {
          return res.status(403).jsonp({
            message: "InValid Link",
            status: false
          });
        }
      });
    }
  });
};

exports.forgetPassUpdate = (req, res) => {
  link = req.params.link;
  let password = req.body.password;
  let cpassword = req.body.cpassword;
  if (password != cpassword) {
    return res.status(403).jsonp({ message: "Password Missmatch" });
  }
  models.Employees.findOne({ where: { forgetPassword: link } }).then(emp => {
    if (emp) {
      models.Employees.update(
        { password: md5(password), forgetPassword: "" },
        { where: { id: emp.id } }
      );
      return res.status(200).jsonp({
        message: "Password Changed Successfully",
        status: true
      });
    } else {
      models.Admin.findOne({ where: { forgetPassword: link } }).then(admin => {
        if (admin) {
          models.Admin.update(
            { password: md5(password), forgetPassword: "" },
            { where: { id: admin.id } }
          );
          return res.status(200).jsonp({
            message: "Password Changed Successfully",
            status: true
          });
        } else {
          return res.status(403).jsonp({
            message: "InValid Link",
            status: false
          });
        }
      });
    }
  });
};
