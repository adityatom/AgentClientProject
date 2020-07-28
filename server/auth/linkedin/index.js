'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();
router.get('/',
  passport.authenticate('linkedin', { scope: ['r_basicprofile', 'r_emailaddress'] }));

router.get('/auth/linkedin/callback',
  passport.authenticate('linkedin', {
    failureRedirect: '/login'
  }), auth.setTokenCookie);

module.exports = router;