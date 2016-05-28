'use strict';

const Router = require('express').Router;
const noteRouter = module.exports = new Router();
const debug = require('debug')('note:note-router');
const AppError = require('../lib/app-error');
const storage = require('../lib/storage');
const Note = require('../model/note');
const bodyParser = require('body-parser').json();

function createNote(reqBody){
  debug('createNote');
  return new Promise(function(resolve, reject){
    var note;
    try{
      note = new Note(reqBody.content);
    }catch(err){
      reject(err);
    }
    storage.setItem('note', note).then(function(note){
      resolve(note);
    }).catch(function(err){
      reject(err);
    });
  });
}

noteRouter.post('/', bodyParser, function(req, res){
  debug('hit endpoint /api/note POST');
  createNote(req.body).then(function(note){
    res.status(200).json(note);
  }).catch(function(err){
    console.error(err.message);
    if(AppError.isAppError(err)){
      res.status(err.statusCode).send(err.responseMessage);
      return;
    }
    res.status(500).send('internal server error');
  });
});

noteRouter.get('/', bodyParser, function(req, res){
  storage.fetchItem('note', req.params.id).then(function(note){
    res.status(200).json(note);
  }).catch(function(err){
    console.error(err.message);
    if(AppError.isAppError(err)){
      res.status(err.statusCode).send(err.responseMessage);
      return;
    }
    res.status(500).send('internal server error');
  });
});

noteRouter.put('/', bodyParser, function(req, res){
  storage.updateItem('note', req.params.id).then(function(note){
    res.status(200).json(note);
  }).catch(function(err){
    console.error(err.message);
    if(AppError.isAppError(err)){
      res.status(err.statusCode).send(err.responseMessage);
      res.end();
      return;
    }
    res.status(400).send('bad request');
    res.end();
  });
});

noteRouter.delete('/', function(req, res){
  storage.deleteItem('note', req.params.id).then(function(note){
    res.status(200).json(note);
  }).catch(function(err){
    console.error(err.message);
    if(AppError.isAppError(err)){
      res.status(err.statusCode).send(err.responseMessage);
      return;
    }
    res.status(500).send('internal server error');
  });
});
