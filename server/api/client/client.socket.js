/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Client = require('./client.model');

exports.register = function(socket) {
  Client.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Client.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('Client:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('Client:remove', doc);
}