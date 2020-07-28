'use strict';

var should = require('should');
var app = require('../../app');
var Agent = require('./agent.model');

var Agent = new Agent({
  provider: 'local',
  name: 'Fake Agent',
  email: 'test@test.com',
  password: 'password'
});

describe('Agent Model', function() {
  before(function(done) {
    // Clear Agents before testing
    Agent.remove().exec().then(function() {
      done();
    });
  });

  afterEach(function(done) {
    Agent.remove().exec().then(function() {
      done();
    });
  });

  it('should begin with no Agents', function(done) {
    Agent.find({}, function(err, Agents) {
      Agents.should.have.length(0);
      done();
    });
  });

  it('should fail when saving a duplicate Agent', function(done) {
    Agent.save(function() {
      var AgentDup = new Agent(Agent);
      AgentDup.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  it('should fail when saving without an email', function(done) {
    Agent.email = '';
    Agent.save(function(err) {
      should.exist(err);
      done();
    });
  });

  it("should authenticate Agent if password is valid", function() {
    return Agent.authenticate('password').should.be.true;
  });

  it("should not authenticate Agent if password is invalid", function() {
    return Agent.authenticate('blah').should.not.be.true;
  });
});
