'use strict';

const Router = require('express').Router;
const debug = require('debug')('note:note-router');
const bodyParser = require('body-parser').json();

// const AppError = require('../lib/app-error');
const storage = require('../lib/storage');
const Note = require('../model/note');
const sendError = require('../lib/error-response');

const noteRouter = module.exports = new Router();

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

noteRouter.post('/', bodyParser, sendError, function(req, res){
  debug('hit endpoint /api/note POST');
  createNote(req.body).then(function(note){
    res.status(200).json(note);
  }).catch(function(err){
    res.sendError(err);
  });
});

noteRouter.get('/:id', sendError, function(req, res){
  debug('hit endpoint /api/note GET');
  storage.fetchItem('note', req.params.id).then(function(note){
    res.status(200).json(note);
  }).catch(function(err){
    res.sendError(err);
  });
});

noteRouter.put('/', bodyParser, sendError, function(req, res){
  debug('hit endpoint /api/note PUT');
  storage.updateItem('note', req.body.id, req.body).then(function(note){
    res.status(200).json(note);
  }).catch(function(err){
    res.sendError(err);
  });
});

noteRouter.delete('/', sendError, function(req, res){
  debug('hit endpoint /api/note DELETE');
  storage.deleteItem('note', req.body.id).then(function(note){
    res.status(200).json(note);
  }).catch(function(err){
    res.sendError(err);
  });
});
