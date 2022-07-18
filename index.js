'use strict';

require('dotenv').config();

var fs = require('fs'),
    path = require('path'),
    http = require('http');

var oas3Tools = require('oas3-tools');
var jsyaml = require('js-yaml');
var cors = require('cors');
var express = require('express');
var serverPort = process.env.PORT;

// const session = require('express-session');
// const Keycloak = require('keycloak-connect');

// const memoryStore = new session.MemoryStore();
// const kcConfig = {
//   clientId: 'kommonitor-client-config',
//   bearerOnly: true,
//   serverUrl: 'http://localhost:8090',
//   realm: 'kommonitor-gib',
//   realmPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjaWRPI4mgkwzii8riv4G0Gq4Znjq/UY3Lq3b0+DUUnCqs9ytZ5+1ONGDHi54yV8DjlVmlkay6ckP9QPOgdP3qRa/5y1pG7RqKdnK8twFZ6saqAbhE12gZcXRK7aWD/qQ/VVxOsIYSfmeGY+zzNORN9PGs7lSwZSR9XsFzyolpl4do/WDU/QsJry8nHwOklJjLPlI3+U7gpXKgYtzXtTV8ex93gtrmeWpwNlhGwZ9CSaO/mEKxJpXGtDFmiNGuW8MoluoyOxu0Qb4tkQfmfc4V9polHNDhnprJGZhoSdsBYB49AJ2E1bTVAjQ+2ENfX9K77dtnU0Z7p7E/iYyVaVtlQIDAQAB'
// };

// const keycloak = new Keycloak({ store: memoryStore }, kcConfig);

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

for (let i = 2; i < openApiApp._router.stack.length; i++) {
  app._router.stack.push(openApiApp._router.stack[i]);
}

// Start the server
http.createServer(app).listen(serverPort, function () {
  console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
  console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});
