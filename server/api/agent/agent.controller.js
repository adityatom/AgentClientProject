'use strict';

var Agent = require('./agent.model');//
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var Client = require('../client/client.model')
var validationError = function (res, err) {
  return res.status(422).json(err);
};

/**
 * Get list of Agents
 * restriction: 'admin'
 */
exports.index = function (req, res) {
  Agent.find({}, '-salt -hashedPassword', function (err, Agents) {
    if (err) return res.status(500).send(err);
    res.status(200).json(Agents);
  });
};

/**
 * Creates a new Agent
 */
exports.create = async function (req, res, next) {
  console.log(req.body);
  var user = req.body.agencyDetails;
  var client = req.body.clientDetails;
  const agent = await Agent.findOne({ name: user.name }).exec();
  if (agent) {
    client['agencyId'] = agent._id
    Client.create(client, function (err, newclient) {
      if (newclient) {
        res.status(200).json({ message: "success" ,agent:agent,client:newclient});
      } else if (err) {
        res.status(500).json({ message: "failed", reason: "required Data Missing" });
      }
    })
  } else if (!agent) {
    Agent.create(user, function (err, agnt) {
      if (agnt) {
        client['agencyId'] = agnt._id
        Client.create(client, function (err, newclient) {
          if (newclient) {
            res.status(200).json({ message: "success" ,agent:agnt,client:newclient});
          } else if (err) {
            res.status(500).json({ message: "failed", reason: "required Data Missing" });
          }
        })
      } else if (err) {
        res.status(500).json({ message: "failed", reason: "invalid Data" });
      }
    })
  }

  /* newAgent.save(function(err, Agent) {
     console.log(Agent);
     
     if (err) return validationError(res, err);
     var token = jwt.sign({_id: Agent._id }, config.secrets.session, { expiresIn: 360*5 });
     res.json({ token: token });
   });
   */
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
exports.destroy = function (req, res) {
  Agent.findByIdAndRemove(req.params.id, function (err, Agent) {
    if (err) return res.status(500).send(err);
    return res.status(204).send('No Content');
  });
};

/**
 * Change a Agents password
 */
exports.changePassword = function (req, res, next) {
  var AgentId = req.Agent._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  Agent.findById(AgentId, function (err, Agent) {
    if (Agent.authenticate(oldPass)) {
      Agent.password = newPass;
      Agent.save(function (err) {
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
exports.me = function (req, res, next) {
  var AgentId = req.Agent._id;
  Agent.findOne({
    _id: AgentId
  }, '-salt -hashedPassword', function (err, Agent) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!Agent) return res.status(401).send('Unauthorized');
    res.json(Agent);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function (req, res, next) {
  res.redirect('/');
};
