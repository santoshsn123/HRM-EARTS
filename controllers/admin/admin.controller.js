const models = require("../../models");
const jwt = require("jsonwebtoken");
const fs = require("fs");
var privateCert = fs.readFileSync("cert/jwtRS256.key");
const md5 = require("md5");
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
            "You are not active Emp, ask Admin to Activate your Account!!!"
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
              linkCode: md5(randomNumber),
              isActive: false,
              isRegistered: false
            }).then(data => {
              res.status(200).jsonp({
                message: "Employee Added successfully!!",
                data: data
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
