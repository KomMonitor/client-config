'use strict';

var utils = require('../utils/writer.js');
var WebClientControlsConfig = require('../service/WebClientControlsConfigService');

module.exports.getWebAppControlsConfig = function getWebAppControlsConfig (req, res, next) {
  WebClientControlsConfig.getWebAppControlsConfig()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.postWebAppControlsConfig = function postWebAppControlsConfig (req, res, next) {
  var appConfig = req.swagger.params['appConfig'].value;
  WebClientControlsConfig.postWebAppControlsConfig(appConfig)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
