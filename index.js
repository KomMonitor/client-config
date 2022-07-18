'use strict';

require('dotenv').config();

var fs = require('fs'),
    path = require('path'),
    http = require('http');
var keycloakHelperService = require("kommonitor-keycloak-helper");
keycloakHelperService.initKeycloakHelper(process.env.KEYCLOAK_AUTH_SERVER_URL, process.env.KEYCLOAK_REALM, process.env.KEYCLOAK_RESOURCE, process.env.KEYCLOAK_CLIENT_SECRET, undefined, undefined, process.env.KOMMONITOR_ADMIN_ROLENAME);


var oas3Tools = require('oas3-tools');
var jsyaml = require('js-yaml');
var cors = require('cors');
var express = require('express');
var serverPort = process.env.PORT;

// swaggerRouter configuration
var options = {
  routing: {
      controllers: path.join(__dirname, './controllers')
  },
};

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);

var openApiApp = expressAppConfig.getApp();

var app = express();

const corsOptions = {
  // exposedHeaders: 'Access-Control-Allow-Origin,Location,Connection,Content-Type,Date,Transfer-Encoding'
  exposedHeaders: ['Access-Control-Allow-Origin','Location','Connection','Content-Type','Date','Transfer-Encoding','Origin','X-Requested-With', 'Accept'],
  origin: "*"
};  

// Add headers
app.use(/.*/, cors(corsOptions));

if(JSON.parse(process.env.KEYCLOAK_ENABLED)){
  app.use(async function(req, res, next) {
    // intercept requests to perform any keycloak protection checks.
    await keycloakHelperService.checkKeycloakProtection(req, res, next, "POST");
  });
}


for (let i = 2; i < openApiApp._router.stack.length; i++) {
  app._router.stack.push(openApiApp._router.stack[i]);
}

// Start the server
http.createServer(app).listen(serverPort, function () {
  console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
  console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});
