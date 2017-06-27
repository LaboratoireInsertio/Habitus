// const mongojs = require('mongojs');
const _ = require('underscore');
const moment = require('moment');
// const db = mongojs('sensors', ['sound_global', 'sound_loud', 'stairs', 'pir']);
const config = require('./config.json');
const express = require('express'),
    winston = log = require('winston');

var db = require('./mongo');

var app = express();
var server = require('http').Server(app);
var globalActivity = 0;

winston.level = config.debugLevel;

require('./express').listen(express,server,app,log,db, moment,_);
require('./sockets').listen(server, log, db, _, moment, globalActivity);
require('./mosca').listen(server, log, db);

setInterval(function(){
  log.debug('global Activity : '+globalActivity);
  if(globalActivity >0){
    globalActivity--;
    io.sockets.emit('globalActivity',globalActivity);
  }
},5000);
