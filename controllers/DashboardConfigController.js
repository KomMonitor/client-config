'use strict';

var utils = require('../utils/writer.js');
var fs = require('fs');
var path = require('path');
var { randomUUID } = require('crypto');
var logger = require('../utils/logger');

const storageDirectory = './configStorage/dashboards/';

// Ensure storage directory exists
if (!fs.existsSync(storageDirectory)) {
  fs.mkdirSync(storageDirectory, { recursive: true });
}

/**
 * Create a new dashboard configuration with auto-generated UUID
 */
module.exports.postDashboardConfig = function postDashboardConfig(req, res, next) {
  try {
    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
      var errorResponse = utils.respondWithCode(400, { error: 'Request body is required' });
      utils.writeJson(res, errorResponse);
      return;
    }

    const dashboardId = randomUUID();
    const filePath = path.join(storageDirectory, `${dashboardId}.json`);
    const jsonContent = JSON.stringify(body, null, 2);

    fs.writeFileSync(filePath, jsonContent, 'utf8');

    logger.info(`Dashboard configuration '${dashboardId}' was saved successfully`);

    var responseWithLocationHeader = utils.respondWithLocationHeader(201, `/dashboards/${dashboardId}`);
    utils.writeLocationHeader(res, responseWithLocationHeader);
  } catch (error) {
    logger.error('Error saving dashboard configuration:', { error: error.message, stack: error.stack });
    var errorResponse = utils.respondWithCode(500, { error: 'Failed to save dashboard configuration', details: error.message });
    utils.writeJson(res, errorResponse);
  }
};

/**
 * Retrieve a dashboard configuration by ID
 */
module.exports.getDashboardConfig = function getDashboardConfig(req, res, next) {
  try {
    const dashboardId = req.params.dashboardId;

    if (!dashboardId) {
      var errorResponse = utils.respondWithCode(400, { error: 'dashboardId is required' });
      utils.writeJson(res, errorResponse);
      return;
    }

    const filePath = path.join(storageDirectory, `${dashboardId}.json`);

    if (!fs.existsSync(filePath)) {
      var errorResponse = utils.respondWithCode(404, { error: `Dashboard configuration '${dashboardId}' not found` });
      utils.writeJson(res, errorResponse);
      return;
    }

    const jsonContent = fs.readFileSync(filePath, 'utf8');
    const dashboard = JSON.parse(jsonContent);

    var response = utils.respondWithCode(200, dashboard);
    utils.writeJson(res, response);
  } catch (error) {
    logger.error('Error retrieving dashboard configuration:', { error: error.message, stack: error.stack });
    var errorResponse = utils.respondWithCode(500, { error: 'Failed to retrieve dashboard configuration', details: error.message });
    utils.writeJson(res, errorResponse);
  }
};

/**
 * Delete a dashboard configuration by ID
 */
module.exports.deleteDashboardConfig = function deleteDashboardConfig(req, res, next) {
  try {
    const dashboardId = req.params.dashboardId;

    if (!dashboardId) {
      var errorResponse = utils.respondWithCode(400, { error: 'dashboardId is required' });
      utils.writeJson(res, errorResponse);
      return;
    }

    const filePath = path.join(storageDirectory, `${dashboardId}.json`);

    if (!fs.existsSync(filePath)) {
      var errorResponse = utils.respondWithCode(404, { error: `Dashboard configuration '${dashboardId}' not found` });
      utils.writeJson(res, errorResponse);
      return;
    }

    fs.unlinkSync(filePath);

    logger.info(`Dashboard configuration '${dashboardId}' was deleted successfully`);

    var response = utils.respondWithCode(204, null);
    res.writeHead(204);
    res.end();
  } catch (error) {
    logger.error('Error deleting dashboard configuration:', { error: error.message, stack: error.stack });
    var errorResponse = utils.respondWithCode(500, { error: 'Failed to delete dashboard configuration', details: error.message });
    utils.writeJson(res, errorResponse);
  }
};

/**
 * List all dashboard configurations
 */
module.exports.listDashboardConfigs = function listDashboardConfigs(req, res, next) {
  try {
    if (!fs.existsSync(storageDirectory)) {
      var response = utils.respondWithCode(200, { dashboards: [] });
      utils.writeJson(res, response);
      return;
    }

    const files = fs.readdirSync(storageDirectory);
    const dashboards = files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));

    var response = utils.respondWithCode(200, { dashboards: dashboards });
    utils.writeJson(res, response);
  } catch (error) {
    logger.error('Error listing dashboard configurations:', { error: error.message, stack: error.stack });
    var errorResponse = utils.respondWithCode(500, { error: 'Failed to list dashboard configurations', details: error.message });
    utils.writeJson(res, errorResponse);
  }
};
