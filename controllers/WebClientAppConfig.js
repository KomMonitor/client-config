'use strict';

var utils = require('../utils/writer.js');
var fs = require("fs");

const storageLocation = "./configStorage/webClientAppConfig.js";

module.exports.getWebAppConfig = function getWebAppConfig(req, res, next) {

  res.download(storageLocation, "appConfig.js");
};

module.exports.postWebAppConfig = function postWebAppConfig(req, res, next) {
  var appConfig = req.files[0];

  fs.writeFileSync(storageLocation, appConfig.buffer, function (error) {
    if (error) {
      console.error("ERROR: response object: " + error);

      var errorResponseWithLocationHeader = utils.respondWithLocationHeader(500, error);
      utils.writeLocationHeader(res, errorResponseWithLocationHeader);

      return;
    }
  });

  console.log("New web app config file was saved!");

  var responseWithLocationHeader = utils.respondWithLocationHeader(201, storageLocation);

  utils.writeLocationHeader(res, responseWithLocationHeader);
};
