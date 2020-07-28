/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
// Insert seed models below
var Client = require('../api/client/client.model');
var Agent = require('../api/agent/agent.model');

// Insert seed data below
var ClientSeed = require('../api/client/client.seed.json');

// Insert seed inserts below
Client.find({}).remove(function() {
  Client.create(ClientSeed);
});