"use strict";

const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
let cert = fs.readFileSync(path.join("cert/jwtRS256.key.pub"));

exports.loginRequired = function(req, res, next) {
  if (req.headers && req.headers.authorization) {
    let token = req.headers.authorization.replace(/^Bearer\s/, "");
    try {
      jwt.verify(token, cert, function(err, decoded) {
        if (decoded) {
          next();
        } else {
          return res.status(401).jsonp({
            message: "Invalid Token"
          });
        }
      });
    } catch (e) {
      console.log("exception ", e);
      return res.status(401).json({
        message: "Invalid Token"
      });
    }
  } else
    return res.status(401).json({
      message: "Invalid Token"
    });
};
