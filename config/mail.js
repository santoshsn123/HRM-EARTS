var nodemailer = require("nodemailer");
var handlebars = require("handlebars");
var fs = require("fs");
const q = require("q");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "santosh.narawade1@gmail.com",
    pass: "slaxZenith@123"
  }
});

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
    // mailOptions.html = htmlToSend;

    var mailOptions = {
      from: "santosh.narawade1@gmail.com",
      to: replacements.to,
      subject: "Welcome to HRM::EntitleArts ",
      html: htmlToSend
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
        deffered.reject(error);
      } else {
        console.log("Email sent: " + info.response);
        deffered.resolve(info.response);
        // res.status(200).jsonp({ message: info.response });
      }
    });
  });
  return deffered.promise;
};
