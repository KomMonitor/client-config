# KomMonitor Client Config REST Service

This NodeJS project is part of the [KomMonitor](http://kommonitor.de) spatial data infrastructure. As a simple REST service it stores and serves several configuration files consumed by client applications like **KomMonitor web client**.

**Table of Content**
<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:0 orderedList:0 -->

- [KomMonitor Client Config REST Service](#kommonitor-client-config-rest-service)
	- [Quick Links And Further Information on KomMonitor](#quick-links-and-further-information-on-kommonitor)
	- [Overview](#overview)
	- [Dependencies to other KomMonitor Components](#dependencies-to-other-kommonitor-components)
	- [Installation / Building Information](#installation-building-information)
		- [Configuration](#configuration)
			- [.env - Configure Deployment Details of other Services](#env-configure-deployment-details-of-other-services)
		- [Running the NodeJS KomMonitor Processing Engine](#running-the-nodejs-kommonitor-processing-engine)
			- [Local Manual Startup and Shutdown](#local-manual-startup-and-shutdown)
			- [Production Startup and Shutdown](#production-startup-and-shutdown)
		- [Docker](#docker)
	- [How to Contribute](#how-to-contribute)
	- [Branching](#branching)
	- [Third Party Dependencies](#third-party-dependencies)
	- [Contact](#contact)
	- [Credits and Contributing Organizations](#credits-and-contributing-organizations)

<!-- /TOC -->    

## Quick Links And Further Information on KomMonitor
   - [DockerHub repositories of KomMonitor Stack](https://hub.docker.com/orgs/kommonitor/repositories)
   - [Github Repositories of KomMonitor Stack](https://github.com/KomMonitor)
   - [Github Wiki for KomMonitor Guidance and central Documentation](https://github.com/KomMonitor/KomMonitor-Docs/wiki)
   - [Technical Guidance](https://github.com/KomMonitor/KomMonitor-Docs/wiki/Technische-Dokumentation) and [Deployment Information](https://github.com/KomMonitor/KomMonitor-Docs/wiki/Setup-Guide) for complete KomMonitor stack on Github Wiki
   - [KomMonitor Website](https://kommonitor.de/) 

## Overview
This **Client Config Service** offers REST endpoints to store and fetch configuration files consumed by the KomMonitor **web client** component. Thus it enables dynamic modification of configuration settings within dedicted administration pages of the **web client**. Three configuration files exist within the folder `./configStorage`, each using a non-changeable name for update/retrieval via REST endpoint:

1. general application settings stored in `./configStorage/webClientAppConfig.js`
2. Keycloak connection parameters stored in `./configStorage/webClientKeycloakConfig.js` - only relevant if KomMonitor stack uses active role-based data access via Keycloak
3. role-based app element visibility settings to hide certain app functions/elements for non-authorized users/roles in `./configStorage/webClientControlsConfig.js` - only relevant if KomMonitor stack uses active role-based data access via Keycloak

The respective content of each file may change over time. Please refer to the documentation of the [KomMonitor Web Client component](https://github.com/KomMonitor/web-client) to inspect each config file options or get hints on how to adjust contents. 

The described REST operations are specified using [Swagger/OpenAPI v2](https://swagger.io). The corresponding ```swagger.yaml``` containing the REST API specification is located at ```api/swagger.yaml```. To inspect the REST API you may use the online [Swagger Editor](https://editor.swagger.io/) or, having access to a running instance of the **KomMonitor Client Config REST API** simply navigate to ```<pathToDeyployedInstance>/docs```, e.g. ```localhost:8088/docs```.

The service is implemented as a NodeJS server application.

## Dependencies to other KomMonitor Components
KomMonitor Client Config service currently has no dependencies. It is required by **Web client** component. In Future a Keycloak connection should be implemented to secure REST endpoint access if KomMonitor is launched using Keycloak-based data protection 


## Installation / Building Information
Being a NodeJS server project, installation and building of the service is as simple as calling ```npm install``` to get all the node module dependencies and run `npm start`. This will start the service with default configuration on `localhost:8088`. Even Docker images can be acquired with ease, as described below. However, depending on your environment configuration aspects have to be adjusted first.

### Configuration
Similar to other **KomMonitor** components, some settings are required, especially to adjust connection details to other linked services to your local environment. This NodeJS app makes use of `dotenv` module, which parses a file called `.env` located at project root when starting the app to populate its properties to app components.

#### .env - Configure Deployment Details of other Services
The central configuration file is located at [.env](./.env). Several important aspects must match your target environment when deploying the service. These are:

```yml

# server port
PORT=8088

```

After adjusting the configuration to your target environment, you may continue to build and run the service as described next.

### Running the NodeJS KomMonitor Processing Engine
#### Local Manual Startup and Shutdown
Make sure you have installed all node dependencies by calling `npm install`. The to locally start the server enter command `npm start` from the project root, which will launch the app and serve it according to port setting at `localhost:<PORT>` (per default `localhost:8088`). In a browser call ``localhost:<PORT>/docs`` to inspect the REST API.
To shutdown simply hit `CTRL+c` in the terminal.

#### Production Startup and Shutdown
To launch and monitor any NodeJS app in production environment, we recommend the Node Process Manager [PM2](http://pm2.keymetrics.io/). It is a node module itself and is able to manage and monitor NodeJS application by executing simple command like `pm2 start app.js`, `pm2 restart app.js`, `pm2 stop app.js`, `pm2 delete app.js`. Via ``pm2 list`` a status monitor for running applications can be displayed. See [PM2 Quickstart Guide](http://pm2.keymetrics.io/docs/usage/quick-start/) for further information and way more details.

PM2 can even be registered as system service, so it can be automatically restarted on server restart, thus ensuring that the registered applications will be relaunched also. Depending on your host environment (e.g. ubuntu, windows, mac), the process differs. Please follow [PM2 Startup hints](http://pm2.keymetrics.io/docs/usage/startup/) for detailed information.

When installed and configured PM2, the **KomMonitor Processing Engine** can be started and monitored via `pm2 start index.js --name <app_name>` (while `<app_name>` is optional, it should be set individually, e.g. `km-client-config`, otherwise the application will be called `index`), executed from project root. To check application status just hit `pm2 list` and inspect the resulting dashboard for the entry with the specified `<app_name>`.

To shutdown call `pm2 stop <app_name>` in the terminal. This will stop the service. To completely remove it from PM2, call `pm2 delete <app_name>`.

### Docker
The **KomMonitor Processing Engine** can also be build and deployed as Docker image (i.e. `docker build -t kommonitor/client-config:latest .`). The project contains the associated `Dockerfile` and an exemplar `docker-compose.yml` on project root level. The Dockerfile contains a `RUN npm install --production` command, so necessary node dependencies will be fetched on build time.

The exemplar [docker-compose.yml](./docker-compose.yml) file specifies only a the **web client** and **client config service** components of the KomMonitor stack

### Exemplar docker-compose File with explanatory comments

Only contains subset of whole KomMonitor stack to focus on the config parameters of this component

```yml

version: '2.1'

networks:
  kommonitor:
      name: kommonitor

services:
  
  # web map client - main user interface of KomMonitor
    kommonitor-client:       
      image: 'kommonitor/web-client'
      container_name: kommonitor-client
      #restart: unless-stopped
      volumes:
       - ./client/config-storage-server.json:/usr/share/nginx/html/config/config-storage-server.json    # mount config for client-config-service 
      ports:
        - 8089:80
      networks:
       - kommonitor

    # simple REST service that stores and serves various config files for KomMonitor clients (i.e. web-client)   
    kommonitor-client-config:          
      image: 'kommonitor/client-config'
      container_name: kommonitor-client-config
      #restart: unless-stopped
      ports:
        - 8088:8088
      networks:
       - kommonitor 
      volumes:
       - client_config_storage:/code/configStorage        # persist web client config files on disk
      environment:
       - PORT=8088  

```

### How to Contribute
The technical lead of the whole [KomMonitor](http://kommonitor.de) spatial data infrastructure currently lies at the Bochum University of Applied Sciences, Department of Geodesy. We invite you to participate in the project and in the software development process. If you are interested, please contact any of the persons listed in the [Contact section](#contact):

### Branching
The `master` branch contains latest stable releases. The `develop` branch is the main development branch that will be merged into the `master` branch from time to time. Any other branch focuses certain bug fixes or feature requests.

## Third Party Dependencies
We use [license-checker](https://www.npmjs.com/package/license-checker) to gain insight about used third party libs. I.e. install globally via ```npm install -g license-checker```, navigate to root of the project and then perform ```license-checker --json --out ThirdParty.json``` to create/overwrite the respective file in JSON format.

## Contact
|    Name   |   Organization    |    Mail    |
| :-------------: |:-------------:| :-----:|
| Christian Danowski-Buhren | Bochum University of Applied Sciences | christian.danowski-buhren@hs-bochum.de |
| Andreas Wytzisk  | Bochum University of Applied Sciences | Andreas-Wytzisk@hs-bochum.de |

## Credits and Contributing Organizations
- Department of Geodesy, Bochum University of Applied Sciences
- Department for Cadastre and Geoinformation, Essen
- Department for Geodata Management, Surveying, Cadastre and Housing Promotion, Mülheim an der Ruhr
- Department of Geography, Ruhr University of Bochum
- 52°North GmbH, Münster
- Kreis Recklinghausen

