const models = require("../../models");
// const jwt = require("jsonwebtoken");
// const fs = require("fs");
// var privateCert = fs.readFileSync("cert/jwtRS256.key");
// const md5 = require("md5");
// const q = require("q");
// const Sequelize = require("sequelize");
// var Op = Sequelize.Op;

exports.getAllLeaves = (req, res) => {
  models.AllLeaves.findAll({ order: [["id", "desc"]] }).then(data => {
    res.send(data);
  });
};

exports.createLeave = (req, res) => {
  console.log("Notify Here :- ", req.body.notify);
  models.AllLeaves.create(req.body).then(data => {
    if (req.body.notify) {
      notifyEmployessAboutLeave(req.body);
    }
    res.send(data);
  });
};
exports.updateLeave = (req, res) => {
  let id = req.params.id;
  models.AllLeaves.update(req.body, { where: { id: id } }).then(data => {
    res.send(data);
  });
};
exports.getOneLeaves = (req, res) => {
  let id = req.params.id;
  models.AllLeaves.findOne({ where: { id: id } }).then(data => {
    res.send(data);
  });
};

exports.deleteLeaves = (req, res) => {
  let id = req.params.id;
  models.AllLeaves.destroy({ where: { id: id } }).then(data => {
    res.status(200).jsonp({ message: "done" });
  });
};

/** Leave Application Functionality Here After */
exports.applyLeaves = (req, res) => {
  let applyLeave = req.body;
  applyLeave.status = 0;
  applyLeave.replyText = "";
  models.LeaveApplications.create(applyLeave).then(created => {
    res.send(created);
  });
};

exports.getUserLeaves = (req, res) => {
  let id = req.params.id;
  models.LeaveApplications.findAll({
    where: { userId: id },
    order: [["id", "desc"]]
  }).then(data => {
    res.send(data);
  });
};

exports.getAllAppliedLeaves = (req, res) => {
  models.LeaveApplications.findAll({
    order: [["id", "desc"]],
    include: [{ model: models.Employees }]
  }).then(data => {
    res.send(data);
  });
};

exports.changeStatusByAdmin = (req, res) => {
  let applyLeave = req.body;
  let id = req.params.id;
  models.LeaveApplications.update(applyLeave, { where: { id: id } }).then(
    data => {
      res.send(data);
    }
  );
};

notifyEmployessAboutLeave = () => {
  models.Employees.findAll().then(Employees => {
    Employees.map(emp => {});
  });
};
