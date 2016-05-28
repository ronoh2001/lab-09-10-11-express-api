'use strict';

const uuid = require('node-uuid');
const debug = require('debug');
const AppError = require('../lib/app-error');

module.exports = function(content){
  debug('creating note');
  if(!content)throw AppError.error400('note constructor requires content');
  this.id = uuid.v1();
  this.content = content;
  this.timestamp = new Date();
};
