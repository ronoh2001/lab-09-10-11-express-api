'use strict';

const debug = require('debug')('note:server');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const sendError = require('./lib/error-response');
const AppError = require('./lib/app-error');

const noteRouter = require('./route/note-router');
const port = process.env.PORT || 3000;


const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/api/note', noteRouter);

app.all('*', sendError, function(req, res){
  const err = new AppError.error404('route not defined');
  res.sendError(err);
  debug('* 404');
  // res.status(404).send('not found');
});

const server = app.listen(port, function(){
  debug('listen');
  console.log('The server has started on port', port);
});

server.isRunning = true;
module.exports = server;
