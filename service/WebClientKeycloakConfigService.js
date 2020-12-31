'use strict';


/**
 * retrieve web app client keycloak config.
 * retrieve web app client keycloak config.
 *
 * returns File
 **/
exports.getWebAppKeycloakConfig = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Send web app client keycloak config to be stored on server.
 * Send web app client keycloak config to be stored on server.
 *
 * appConfig File The file to upload as JSON file. (optional)
 * no response value expected for this operation
 **/
exports.postWebAppKeycloakConfig = function(appConfig) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

