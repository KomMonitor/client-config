'use strict';

var utils = require('../utils/writer.js');
var fs = require("fs");
var logger = require('../utils/logger');

const rootStorage = "./configStorage/";
const defaultStartPageName = "webClientStartPage.html"

module.exports.getWebAppStartPage = function getWebAppStartPage (req, res, next) {
  if(!req.query.pageName) {
    var storageLocation = rootStorage + defaultStartPageName;
    res.download(storageLocation, defaultStartPageName);
  } else {
    var storageLocation = rootStorage + req.query.pageName;
    if (!fs.existsSync(storageLocation)) {
      var errorResponse = utils.respondWithCode(404, { error: "Requested start page does not exist." });
      utils.writeJson(res, errorResponse);
      return;
    } else {
      res.download(storageLocation, req.query.pageName);
    }
  }
};

module.exports.postWebAppStartPage = function postWebAppStartPage (req, res, next) {
  if(!req.files.startPage) {
    var errorResponse = utils.respondWithCode(500, {error: "Missing parameter 'startPage'."});
    utils.writeJson(res, errorResponse);
    return;
  }
  var startPage = req.files.startPage;

  if(req.body && req.body.pageName) {
    var storageLocation = rootStorage + req.body.pageName;
  } else {
    var storageLocation = rootStorage + defaultStartPageName;
  }

  fs.writeFileSync(storageLocation, startPage.data, function (error) {
    if (error) {
      logger.error("ERROR: response object: " + error);

      var errorResponseWithLocationHeader = utils.respondWithLocationHeader(500, error);
      utils.writeLocationHeader(res, errorResponseWithLocationHeader);

      return;
    }
  });

  logger.info("New web start page file was saved at " + storageLocation + "!");

  var responseWithLocationHeader = utils.respondWithLocationHeader(201, storageLocation);

  utils.writeLocationHeader(res, responseWithLocationHeader);
};
