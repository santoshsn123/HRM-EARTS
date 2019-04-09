var nodemailer = require("nodemailer");
var handlebars = require("handlebars");
var fs = require("fs");
const q = require("q");
const mailjet = require("node-mailjet").connect(
  "a1ebc5d8ab971c1befab3dae5b85181e",
  "436f125a36a9e5b9e9b0f331b2f9708f"
);
const fromEmail = "santosh.narawade1@gmail.com";
const fromName = "Santosh Narwade";

var readHTMLFile = function(path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function(err, html) {
    if (err) {
      throw err;
      callback(err);
    } else {
      callback(null, html);
    }
  });
};

exports.welcomeMail = replacements => {
  let deffered = q.defer();

  readHTMLFile(__dirname + "/templates/welcome.html", function(err, html) {
    var template = handlebars.compile(html);
    var htmlToSend = template(replacements);
    const mailArray = getMailArray({
      to: replacements.to,
      userName: replacements.userName,
      subject: "Welcome to HRM::EntitleArts ",
      htmlToSend: htmlToSend
    });
    const request = mailjet
      .post("send", { version: "v3.1" })
      .request({
        Messages: mailArray
      })
      .then(result => {
        console.log(result.body);
        deffered.resolve(result.body);
      })
      .catch(err => {
        deffered.reject(err.statusCode);
      });
  });
  return deffered.promise;
};

exports.forgetPassword = replacements => {
  let deffered = q.defer();
  readHTMLFile(__dirname + "/templates/forgetPass.html", function(err, html) {
    var template = handlebars.compile(html);
    var htmlToSend = template(replacements);

    const mailArray = getMailArray({
      userName: replacements.userName,
      to: replacements.to,
      subject: "Forget Password Setting HRM::EntitleArts ",
      htmlToSend: htmlToSend
    });

    request = mailjet
      .post("send", { version: "v3.1" })
      .request({
        Messages: mailArray
      })
      .then(result => {
        deffered.resolve(result.body);
      })
      .catch(err => {
        deffered.reject(err.statusCode);
      });
  });
  return deffered.promise;
};

getMailArray = plainObj => {
  return [
    {
      From: {
        Email: fromEmail,
        Name: fromName
      },
      To: [
        {
          Email: plainObj.to,
          Name: plainObj.userName
        }
      ],
      Subject: plainObj.subject,
      TextPart: plainObj.htmlToSend,
      HTMLPart: plainObj.htmlToSend
    }
  ];
};
