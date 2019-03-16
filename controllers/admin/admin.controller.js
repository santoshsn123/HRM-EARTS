const models = require("../../models");

exports.loginApi = (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(403).jsonp({ message: "Username / Password is wrong" });
  }
  models.Admin.findOne({
    username: req.body.username,
    password: req.body.password
  }).then(data => {
    res.send(data);
  });
};
