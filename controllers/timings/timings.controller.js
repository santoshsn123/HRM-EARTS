const models = require("../../models");
const jwt = require("jsonwebtoken");
const fs = require("fs");
var privateCert = fs.readFileSync("cert/jwtRS256.key");
const md5 = require("md5");
const q = require("q");
const Sequelize = require("sequelize");
var Op = Sequelize.Op;
exports.punchIn = (req, res) => {
  var id = req.params.id;
  models.MainTimings.findOne({
    where: { userId: id },
    order: [["id", "desc"]]
  }).then(data => {
    if (data) {
      console.log(
        "Created Date : - ",
        getProperDate(data.createdAt),
        getProperDate()
      );
      if (getProperDate(data.createdAt) == getProperDate()) {
        createSubTimings(id, data.id).then(created => {
          return res.send(created);
        });
      } else {
        models.MainTimings.create({
          startTime: new Date(),
          userId: id,
          completedStatus: false
        }).then(created => {
          createSubTimings(id, created.id).then(created => {
            return res.send(created);
          });
        });
      }
    } else {
      models.MainTimings.create({
        startTime: new Date(),
        userId: id,
        completedStatus: false
      }).then(created => {
        createSubTimings(id, created.id).then(created => {
          return res.send(created);
        });
      });
    }
  });
};

exports.getStatus = (req, res) => {
  var id = req.params.id;
  models.MainTimings.findOne({
    where: {
      userId: id,
      createdAt: { [Op.gt]: getDateFormated("") + " 00:00:00" }
    },
    order: [["id", "desc"]]
  }).then(data => {
    if (!data) {
      punchinAvailableStat(res);
    } else {
      if (getProperDate(data.createdAt) == getProperDate()) {
        models.SubTimings.findOne({
          where: { userId: id },
          order: [["id", "desc"]]
        }).then(subData => {
          if (subData) {
            if (subData.completedStatus) {
              punchinAvailableStat(res);
            } else {
              punchInNotAvailable(res);
            }
          } else {
            punchinAvailableStat(res);
          }
        });
      } else {
      }
    }
  });
};

exports.getMonthlyStat = (req, res) => {
  const id = req.params.id;
  let date = req.params.date;
  console.log("You are here ", id, date);
  date = new Date(date);
  var firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  console.log(
    getDateFormated(firstDate) + " 00:00:00",
    getDateFormated(lastDate) + " 23:59:59"
  );
  models.MainTimings.findAll({
    where: {
      userId: id,
      startTime: {
        [Op.between]: [
          getDateFormated(firstDate) + " 00:00:00",
          getDateFormated(lastDate) + " 23:59:59"
        ]
      }
    },
    include: [
      {
        model: models.SubTimings
      }
    ]
  }).then(data => {
    data.map(dt => {
      dt.dataValues.formatedStartTime = getTimeFormated(dt.startTime);
      dt.dataValues.formatedEndTime = getTimeFormated(dt.endTime);
      dt.dataValues.totalTiming = timeConversion(
        getCalculatedTimings(dt.SubTimings)
      );
    });

    res.send(data);
  });
};

getDateFormated = date => {
  if (date) {
    var newdate = new Date(date);
  } else {
    var newdate = new Date();
  }

  var mm = newdate.getMonth() + 1;
  var yyyy = newdate.getFullYear();
  let month;
  if (mm < 10) {
    month = "0" + mm;
  }
  console.log(yyyy + "-" + month + "-" + newdate.getDate());
  return yyyy + "-" + month + "-" + newdate.getDate();
};
getCalculatedTimings = array => {
  let tempArr = [];
  let sum = 0;
  array.forEach(ar => {
    tempArr.push(new Date(ar.endTime) - new Date(ar.startTime));
  });
  tempArr.forEach(data => {
    sum += data;
  });
  return sum;
};
getTimeFormated = time => {
  let tm = new Date(time);
  let minutes = tm.getMinutes() < 10 ? "0" + tm.getMinutes() : tm.getMinutes();
  let seconds = tm.getSeconds() < 10 ? "0" + tm.getSeconds() : tm.getSeconds();
  return tm.getHours() + ":" + minutes + ":" + seconds;
};
var timeConversion = millisec => {
  var seconds = (millisec / 1000).toFixed(1);

  var minutes = (millisec / (1000 * 60)).toFixed(1);

  var hours = (millisec / (1000 * 60 * 60)).toFixed(1);

  var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);

  if (seconds < 60) {
    return seconds + " Sec";
  } else if (minutes < 60) {
    return minutes + " Min";
  } else if (hours < 24) {
    return hours + " Hrs";
  } else {
    return days + " Days";
  }
};
exports.punchOut = (req, res) => {
  const id = req.params.id;
  models.MainTimings.findOne({
    where: { userId: id },
    order: [["id", "desc"]]
  }).then(main => {
    models.SubTimings.findOne({
      where: { userId: id },
      order: [["id", "desc"]]
    }).then(subData => {
      models.SubTimings.update(
        { endTime: new Date(), completedStatus: true },
        { where: { id: subData.id } }
      ).then(done => {
        models.MainTimings.update(
          { endTime: new Date(), completedStatus: true },
          { where: { id: main.id } }
        ).then(finalDone => {
          res.send({ status: true });
        });
      });
    });
  });
};
var punchinAvailableStat = res => {
  return res.status(200).jsonp({
    message: "Status Retrived",
    punchin: true,
    punchout: false
  });
};
var punchInNotAvailable = res => {
  res.status(200).jsonp({
    message: "Status Retrived",
    punchin: false,
    punchout: true
  });
};

var getProperDate = date => {
  if (date) {
    var today = new Date(date);
  } else {
    var today = new Date();
  }

  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  return (today = yyyy + "-" + mm + "-" + dd);
};

var createSubTimings = (userId, mainId) => {
  let deffered = q.defer();
  models.SubTimings.create({
    userId: userId,
    mainId: mainId,
    startTime: new Date(),
    completedStatus: false
  }).then(data => {
    deffered.resolve(data);
  });
  return deffered.promise;
};
