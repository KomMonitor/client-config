'use strict';

var utils = require('../utils/writer.js');
var fs = require("fs");

const storageLocation = "./configStorage/webClientKeycloakConfig.json";

module.exports.getWebAppKeycloakConfig = function getWebAppKeycloakConfig (req, res, next) {
  res.download(storageLocation, "appKeycloakConfig.json");
};

module.exports.postWebAppKeycloakConfig = function postWebAppKeycloakConfig (req, res, next) {
  var appConfig = req.swagger.params['appConfig'].value;

  fs.writeFileSync(storageLocation, appConfig.buffer, function (error) {
    if (error) {
      console.error("ERROR: response object: " + error);

      var errorResponseWithLocationHeader = utils.respondWithLocationHeader(500, error);
      utils.writeLocationHeader(res, errorResponseWithLocationHeader);

      return;
    }
  });

  console.log("New web app keycloak config file was saved!");

  var responseWithLocationHeader = utils.respondWithLocationHeader(201, storageLocation);

  utils.writeLocationHeader(res, responseWithLocationHeader);
};
