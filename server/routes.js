/**
 * Main application routes
 */

'use strict';

var path = require('path');
var express =require('express')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
module.exports = function(app) {
  

  // Insert routes below

  app.use('/api/clients', require('./api/client'));
  app.use('/api/agents', require('./api/agent'));
  app.use('/auth', require('./auth'));
  
  app.use(express.static(path.join(__dirname, './static'))); // server side files rendering 
  app.use(express.static('./static/'));
  //app.get('/', getIndexFile); // get index file
  //app.get('/*', getAllFiles); // get all files
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // swagger path

  function getIndexFile(request, response) {
    response.sendFile(path.resolve('./static/index.html'));
    response.end();
  }
  
  function getAllFiles(request, response) {
    response.sendFile(path.resolve('./static/index.html'));
    response.end();
  }
  
};
