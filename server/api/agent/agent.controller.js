'use strict';

var Agent = require('./agent.model');//
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.status(422).json(err);
};

/**
 * Get list of Agents
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  Agent.find({}, '-salt -hashedPassword', function (err, Agents) {
    if(err) return res.status(500).send(err);
    res.status(200).json(Agents);
  });
};

/**
 * Creates a new Agent
 */
exports.create = function (req, res, next) {
  var newAgent = new Agent(req.body);
  newAgent.provider = 'local';
  newAgent.role = 'Agent';
  newAgent.save(function(err, Agent) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: Agent._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Get a single Agent
 */
exports.show = function (req, res, next) {
  var AgentId = req.params.id;

  Agent.findById(AgentId, function (err, Agent) {
    if (err) return next(err);
    if (!Agent) return res.status(401).send('Unauthorized');
    res.json(Agent.profile);
  });
};

/**
 * Deletes a Agent
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  Agent.findByIdAndRemove(req.params.id, function(err, Agent) {
    if(err) return res.status(500).send(err);
    return res.status(204).send('No Content');
  });
};

/**
 * Change a Agents password
 */
exports.changePassword = function(req, res, next) {
  var AgentId = req.Agent._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  Agent.findById(AgentId, function (err, Agent) {
    if(Agent.authenticate(oldPass)) {
      Agent.password = newPass;
      Agent.save(function(err) {
        if (err) return validationError(res, err);
        res.status(200).send('OK');
      });
    } else {
      res.status(403).send('Forbidden');
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var AgentId = req.Agent._id;
  Agent.findOne({
    _id: AgentId
  }, '-salt -hashedPassword', function(err, Agent) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!Agent) return res.status(401).send('Unauthorized');
    res.json(Agent);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
