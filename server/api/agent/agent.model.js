'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var authTypes = ['github', 'twitter', 'facebook', 'google'];

var AgentSchema = new Schema({
  name: {type:String,required:true,unique:true},
  address1: { type: String, required: true },
  address2:String,
  state: { type: String, required: true },
  city: { type: String, required: true },
  phonenumber: { type: String, required: true },
},{timestamps:true});

/**
 * Virtuals
 */


  AgentSchema.virtual('AgencyId').get(function(){
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
AgentSchema.set('toJSON', {
    virtuals: true
});




/**
 * Validations
 */


/**
 * Methods
 */
AgentSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('Agent', AgentSchema);
