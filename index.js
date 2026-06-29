'use strict';

require('dotenv').config();

var fs = require('fs'),
    path = require('path'),
    http = require('http');
const oasTools = require("@oas-tools/core");
const fileUpload = require('express-fileupload');
const logger = require('./utils/logger');

var keycloakHelperService = require("kommonitor-keycloak-helper");
var kommonitorConfigAllowedRolesPostfixes = process.env.KOMMONITOR_CONFIG_ROLES_POSTFIXES.split(",");
keycloakHelperService.initKeycloakHelper(process.env.KEYCLOAK_AUTH_SERVER_URL, process.env.KEYCLOAK_REALM, process.env.KEYCLOAK_RESOURCE, process.env.KEYCLOAK_CLIENT_SECRET, undefined, undefined, process.env.KOMMONITOR_ADMIN_ROLENAME, kommonitorConfigAllowedRolesPostfixes);

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
app.use(express.json({ limit: process.env.REQUEST_BODY_SIZE_LIMIT || '10mb' }));
app.use(fileUpload());

const corsOptions = {
  exposedHeaders: ['Access-Control-Allow-Origin','Location','Connection','Content-Type','Date','Transfer-Encoding','Origin','X-Requested-With', 'Accept'],
  origin: "*"
};  

// Add headers
app.use(/.*/, cors(corsOptions));

const checkProtection = (req, res, next) => {
  return keycloakHelperService.checkKeycloakProtection(req, res, next, ["POST", "PUT", "PATCH", "DELETE"]);
};

const checkProtectionClientConfig = (req, res, next) => {
  return keycloakHelperService.checkKeycloakProtectionClientConfig(req, res, next, ["POST", "PUT", "PATCH", "DELETE"]);
};

if (JSON.parse(process.env.KEYCLOAK_ENABLED)) {
  app.use(
    ['/config/client-app-config', '/config/client-keycloak-config', '/config/client-controls-config', '/config/client-start-page'],
    checkProtection
  );

  app.use('/config/client-filter-config', checkProtectionClientConfig);
}

oasTools.initialize(app).then(() => {
  http.createServer(app).listen(serverPort, () => {
    logger.info(`Server listening on port ${serverPort} (http://localhost:${serverPort})`);
    logger.info(`Swagger-ui available at http://localhost:${serverPort}/docs`);
  });
});
