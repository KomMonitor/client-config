'use strict';


/**
 * retrieve web app client config.
 * retrieve web app client config.
 *
 * returns File
 **/
exports.getWebAppConfig = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Send web app client config to be stored on server.
 * Send web app client config to be stored on server.
 *
 * appConfig File The file to upload as javascript file. (optional)
 * no response value expected for this operation
 **/
exports.postWebAppConfig = function(appConfig) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

