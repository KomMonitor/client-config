'use strict';

var utils = require('../utils/writer.js');
var fs = require("fs");

const storageLocation = "./configStorage/webClientFilterConfig.json";

module.exports.getWebAppFilterConfig = function getWebAppFilterConfig (req, res, next) {
  res.download(storageLocation, "appFilterConfig.json");
};

module.exports.postWebAppFilterConfig = function postWebAppFilterConfig (req, res, next) {
  if(!req.files.appConfig) {
    var errorResponse = utils.respondWithCode(500, {error: "Missing parameter 'appConfig'."});
    utils.writeJson(res, errorResponse);
    return;
  }
  var appConfig = req.files.appConfig;

  fs.writeFileSync(storageLocation, appConfig.data, function (error) {
    if (error) {
      console.error("ERROR: response object: " + error);

      var errorResponseWithLocationHeader = utils.respondWithLocationHeader(500, error);
      utils.writeLocationHeader(res, errorResponseWithLocationHeader);

      return;
    }
  });

  console.log("New web app filter config file was saved!");

  var responseWithLocationHeader = utils.respondWithLocationHeader(201, storageLocation);

  utils.writeLocationHeader(res, responseWithLocationHeader);
};
