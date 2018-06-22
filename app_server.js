// const mongojs = require('mongojs');
const _ = require('underscore');
const moment = require('moment');
// const db = mongojs('sensors', ['sound_global', 'sound_loud', 'stairs', 'pir']);
const config = require('./config.json');
const express = require('express'),
    winston = log = require('winston');

var db = require('./digital_ocean/mongo');

var path = require('path');
global.appRoot = path.resolve(__dirname);

var app = express();
var server = require('http').Server(app);
var globalActivity = {
  minValue : 0,
  maxValue : 200,
  value : 0,
  sound_loud : 6,
  pir : 3,
  sound_global : 3,
  photocell_up : 2,
  photocell_down : 2
};

winston.level = config.debugLevel;

require('./digital_ocean/express').listen(express,server,app,log,db, moment,_);
var io = require('./digital_ocean/sockets').listen(server, log, db, _, moment, globalActivity);
require('./digital_ocean/mosca').listen(server, log, db);

setInterval(function(){
  log.debug('global Activity : '+globalActivity.value);
  if(globalActivity.value >0){
    globalActivity.value--;
    io.sockets.emit('globalActivity',globalActivity);
  }
  db.insertData("global_activity", {
    x: new Date().getTime(),
    y: globalActivity.value
  });
},30000);
