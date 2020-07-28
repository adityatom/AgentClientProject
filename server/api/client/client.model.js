'use strict';

var mongoose = require('mongoose'),
Schema = mongoose.Schema;
var Agency = require('../agent/agent.model')


var ClientSchema = new Schema({
  agencyId: {type:Schema.Types.ObjectId,ref:'Agency'},
  name: {type:String,required:true},
  email: {type:String,required:true},
  totalbill: {type:String,required:true},
  phonenumber: { type: String, required: true },
});

module.exports = mongoose.model('Client', ClientSchema);