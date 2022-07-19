# KomMonitor Client Config REST Service

This NodeJS project is part of the [KomMonitor](http://kommonitor.de) spatial data infrastructure. As a simple REST service it stores and serves several configuration files consumed by client applications like **KomMonitor web client**.

## Quick Links And Further Information on KomMonitor
   - [DockerHub repositories of KomMonitor Stack](https://hub.docker.com/orgs/kommonitor/repositories)
   - [KomMonitor Docker Repository including default docker-compose templates and default resource files for keycloak and KomMonitor stack](https://github.com/KomMonitor/docker)
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

The service is implemented as a NodeJS server application. 
The described REST operations are specified using [Swagger/OpenAPI v3](https://swagger.io). The corresponding ```openapi.yaml``` containing the REST API specification is located at ```api/openapi.yaml```. To inspect the REST API you may use the online [Swagger Editor](https://editor.swagger.io/) or, having access to a running instance of the **KomMonitor Client Config REST API** simply navigate to ```<pathToDeyployedInstance>/docs```, e.g. ```localhost:8088/docs```.

## Dependencies to other KomMonitor Components
Since version 2.0.0 KomMonitor Client Config service requires **Keycloak** for authenticated access to POST requests. Only KomMonitor administrators shall be allowed to call the POST endpoints of this service. Within the Keycloak realm the **client-config** component must be integrated as a realm client with access type ***confidential*** so that a keycloak secret can be retrieved and configured.
The **client config** component itself is required by **Web client** component.



## Exemplar docker-compose File with explanatory comments

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
       - PORT=8088  # port
       - KEYCLOAK_ENABLED=true # enable/disable keycloak
       - KEYCLOAK_REALM=kommonitor # keycloak realm name
       - KEYCLOAK_AUTH_SERVER_URL=http://localhost:8080/auth/ # keycloak target URL inlcuding /auth/
       - KEYCLOAK_RESOURCE=kommonitor-client-config # keycloak client name
       - KEYCLOAK_CLIENT_SECRET=keycloak-secret # keycloak client secret using access type confidential
       - KOMMONITOR_ADMIN_ROLENAME=kommonitor-creator # name of kommonitor admin role within keycloak - default is 'kommonitor-creator' 

```

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

