'use strict';

var utils = require('../utils/writer.js');
var fs = require('fs');
var path = require('path');

const storageDirectory = './configStorage/dashboards/';

// Ensure storage directory exists
if (!fs.existsSync(storageDirectory)) {
  fs.mkdirSync(storageDirectory, { recursive: true });
}

/**
 * Create or update a dashboard configuration
 */
module.exports.postDashboardConfig = function postDashboardConfig(req, res, next) {
  try {
    const dashboardId = req.params.dashboardId;
    const body = req.body;

    if (!dashboardId) {
      var errorResponse = utils.respondWithCode(400, { error: 'dashboardId is required' });
      utils.writeJson(res, errorResponse);
      return;
    }

    if (!body || Object.keys(body).length === 0) {
      var errorResponse = utils.respondWithCode(400, { error: 'Request body is required' });
      utils.writeJson(res, errorResponse);
      return;
    }

    const filePath = path.join(storageDirectory, `${dashboardId}.json`);
    const jsonContent = JSON.stringify(body, null, 2);

    fs.writeFileSync(filePath, jsonContent, 'utf8');

    console.log(`Dashboard configuration '${dashboardId}' was saved successfully`);

    var responseWithLocationHeader = utils.respondWithLocationHeader(201, `/dashboards/${dashboardId}`);
    utils.writeLocationHeader(res, responseWithLocationHeader);
  } catch (error) {
    console.error('Error saving dashboard configuration:', error);
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
    console.error('Error retrieving dashboard configuration:', error);
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

    console.log(`Dashboard configuration '${dashboardId}' was deleted successfully`);

    var response = utils.respondWithCode(204, null);
    res.writeHead(204);
    res.end();
  } catch (error) {
    console.error('Error deleting dashboard configuration:', error);
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
    console.error('Error listing dashboard configurations:', error);
    var errorResponse = utils.respondWithCode(500, { error: 'Failed to list dashboard configurations', details: error.message });
    utils.writeJson(res, errorResponse);
  }
};
