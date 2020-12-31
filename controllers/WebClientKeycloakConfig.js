'use strict';

var utils = require('../utils/writer.js');
var WebClientKeycloakConfig = require('../service/WebClientKeycloakConfigService');

module.exports.getWebAppKeycloakConfig = function getWebAppKeycloakConfig (req, res, next) {
  WebClientKeycloakConfig.getWebAppKeycloakConfig()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.postWebAppKeycloakConfig = function postWebAppKeycloakConfig (req, res, next) {
  var appConfig = req.swagger.params['appConfig'].value;
  WebClientKeycloakConfig.postWebAppKeycloakConfig(appConfig)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
