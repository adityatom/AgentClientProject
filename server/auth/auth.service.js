'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var Agent = require('../api/agent/agent.model');
var validateJwt = expressJwt({ secret: config.secrets.session });

/**
 * Attaches the Agent object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateJwt(req, res, next);
    })
    // Attach Agent to request
    .use(function(req, res, next) {
      console.log(req);
      
      Agent.findById(req.user._id, function (err, Agent) {
        if (err) return next(err);
        if (!Agent) return res.status(401).send('Unauthorized');

        req.Agent = Agent;
        next();
      });
    });
}

/**
 * Checks if the Agent role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set');

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if (config.AgentRoles.indexOf(req.Agent.role) >= config.AgentRoles.indexOf(roleRequired)) {
        next();
      }
      else {
        res.status(403).send('Forbidden');
      }
    });
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
  return jwt.sign({ _id: id }, config.secrets.session, { expiresIn: 60 * 60 * 5 });
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
  if (!req.Agent) return res.status(404).json({ message: 'Something went wrong, please try again.'});
  var token = signToken(req.Agent._id, req.Agent.role);
  res.cookie('token', JSON.stringify(token));
  const url = require('url');
  var obj={} 
  obj={
    "token": token,
  }  
  res.redirect(url.format({
    pathname:'http://localhost:4200/',
    query:obj
  }));
}

exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;
