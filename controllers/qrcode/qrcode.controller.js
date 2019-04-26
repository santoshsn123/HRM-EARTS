const models = require("../../models");
// const jwt = require("jsonwebtoken");
// const fs = require("fs");
// var privateCert = fs.readFileSync("cert/jwtRS256.key");
const md5 = require("md5");
// const q = require("q");
// const Sequelize = require("sequelize");
// var Op = Sequelize.Op;

exports.createQrCode = (req, res) => {
  models.QRCode.update({ activeStatus: false }).then(updated => {
    models.QRCode.create({
      punchin: md5((Math.random() * 200000).toFixed(2)),
      punchout: md5((Math.random() * 200000).toFixed(2)),
      activeStatus: true
    }).then(data => {
      res.send(data);
    });
  });
};
exports.getAllQrCodes = (req, res) => {
  models.QRCode.findAll().then(qrcodes => {
    res.send(qrcodes);
  });
};

exports.deleteQrCode = (req, res) => {
  let id = req.params.id;
  models.QRCode.destroy({ where: { id: id } }).then(destroyed => {
    res.send(destroyed);
  });
};

exports.compaireQrCode = (req, res) => {
  let qrnumber = req.body.qrnumber;
  let type = req.body.type;

  models.QRCode.findOne({
    where: {
      $or: [
        {
          punchin: qrnumber
        },
        {
          punchout: qrnumber
        }
      ]
    }
  }).then(found => {
    if (found) {
      if (type == "in") {
        if (found.punchin == qrnumber) {
          res.status(200).jsonp({ message: "Correct QR Code" });
        } else {
          res
            .status(403)
            .jsonp({ message: "QR Code is for punchOut not for PunchIn" });
        }
      } else {
        if (found.punchout == qrnumber) {
          res.status(200).jsonp({ message: "Correct QR Code" });
        } else {
          res
            .status(403)
            .jsonp({ message: "QR Code is for PunchIn not for punchOut" });
        }
      }
    } else {
      res.status(403).jsonp({ message: "Wrong QR Code" });
    }
  });
};
