/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /Clients              ->  index
 * POST    /Clients              ->  create
 * GET     /Clients/:id          ->  show
 * PUT     /Clients/:id          ->  update
 * DELETE  /Clients/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Client = require('./client.model');
var Agent = require('../agent/agent.model')
// Get list of Clients
exports.index = function(req, res) {
  Client.aggregate([
    {$match:{}},
    {
        $lookup: {
            from: Agent.collection.name,
            let: { "agent": "$agencyId" },
            pipeline: [{
                $match: {
                    $expr: { $eq: ["$_id", "$$agent"] },
                }
            }],
            as: "agency"
        }
    }, {
        $project: {
            'AgencyName': { "$arrayElemAt": ["$agency.name", 0] },
            'ClientName': "$name",
            'totalbill':1,
        },
    },
    {
      $sort: {
        totalbill:-1
    }

    },
]).exec(function (err, clients) {
    if (err) { return handleError(res, err); }
    if(clients){
      var obj = clients.reduce((r, o) => (o.totalbill < (r[o.AgencyName] || {}).totalbill || (r[o.AgencyName] = o), r), {});

      
    return res.status(200).json(obj);

    }
  


})
};

// Get a single Client
exports.show = function(req, res) {
  Client.findById(req.params.id, function (err, Client) {
    if(err) { return handleError(res, err); }
    if(!Client) { return res.status(404).send('Not Found'); }
    return res.json(Client);
  });
};

// Creates a new Client in the DB.
exports.create = function(req, res) {
  Client.create(req.body, function(err, Client) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(Client);
  });
};

// Updates an existing Client in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Client.findById(req.params.id, function (err, Client) {
    if (err) { return handleError(res, err); }
    if(!Client) { return res.status(404).send('Not Found'); }
    var updated = _.merge(Client, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(Client);
    });
  });
};

// Deletes a Client from the DB.
exports.destroy = function(req, res) {
  Client.findById(req.params.id, function (err, Client) {
    if(err) { return handleError(res, err); }
    if(!Client) { return res.status(404).send('Not Found'); }
    Client.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}