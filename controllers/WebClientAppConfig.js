'use strict';

var utils = require('../utils/writer.js');
var WebClientAppConfig = require('../service/WebClientAppConfigService');

module.exports.getWebAppConfig = function getWebAppConfig (req, res, next) {
  WebClientAppConfig.getWebAppConfig()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.postWebAppConfig = function postWebAppConfig (req, res, next) {
  var appConfig = req.swagger.params['appConfig'].value;
  WebClientAppConfig.postWebAppConfig(appConfig)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
