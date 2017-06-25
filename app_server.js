const mongojs = require('mongojs');
const _ = require('underscore');
const moment = require('moment');
const db = mongojs('sensors', ['sound_global', 'sound_loud', 'stairs', 'pir']);
const config = require('./config.json');
const express = require('express'),
    winston = log = require('winston');

var app = express();
var server = require('http').Server(app);
winston.level = config.debugLevel;


require('./sockets').listen(server, log, db, _, moment);
require('./mosca').listen(server, log, db);
require('./express').listen(express,server,app,log,db, moment,_);
