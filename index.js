'use strict';

require('dotenv').config();

var fs = require('fs'),
    path = require('path'),
    http = require('http');
const oasTools = require("@oas-tools/core");
const fileUpload = require('express-fileupload');

var keycloakHelperService = require("kommonitor-keycloak-helper");
keycloakHelperService.initKeycloakHelper(process.env.KEYCLOAK_AUTH_SERVER_URL, process.env.KEYCLOAK_REALM, process.env.KEYCLOAK_RESOURCE, process.env.KEYCLOAK_CLIENT_SECRET, undefined, undefined, process.env.KOMMONITOR_ADMIN_ROLENAME);

var jsyaml = require('js-yaml');
var cors = require('cors');
var express = require('express');
var serverPort = process.env.PORT;

var options = {
  routing: {
      controllers: path.join(__dirname, './controllers')
  },
};

var app = express();
app.use(fileUpload());

const corsOptions = {
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

oasTools.initialize(app).then(() => {
  http.createServer(app).listen(serverPort, () => function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
  });
});
