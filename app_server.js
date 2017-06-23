const mongojs = require('mongojs');
const _ = require('underscore');
const moment = require('moment');
const db = mongojs('sensors', ['sound_global', 'sound_loud', 'stairs', 'pir']);
const config = require('./config.json');
const express = require('express'),
    winston = log = require('winston');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//-------------- Winston debug -----------------------//
winston.level = config.debugLevel;

server.listen(8844, function() {
    log.info('Server launch on : ' + 8844);
});
// io = io.listen(server);



//----------- CONFIGURATION SERVER <-> CLIENT --------------------//

app.use('/assets', express.static('assets'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});



// Listen connection Client Side for send datas of sensors from MongoDB
io.on('connection', function(socket) {

    socket.on('datas', function() {
    	log.debug('Ask for show datas');
        db.pir.find(function(err, docs) {
            var groups = _.groupBy(docs, function(doc) {
                return moment(doc.x).startOf('minute').format();
            });
            socket.emit('pirData', groups);
        });

        db.sound_loud.find(function(err, docs) {
            var groups = _.groupBy(docs, function(doc) {
                return moment(doc.x).startOf('minute').format();
            });
            socket.emit('SoundLoudData', groups);
        });

        db.stairs.find(function(err, docs) {
            var groups = _.groupBy(docs, function(doc) {
                return moment(doc.down).startOf('minute').format();
            });
            socket.emit('StairsData', groups);
        });

        db.sound_global.find(function(err, docs) {
            var groups = _.groupBy(docs, function(doc) {
                return moment(doc.x).startOf('minute').format();
            });
            socket.emit('SoundGlobalData', groups);
        });
    })

    //Get informations abouts sensors
    log.debug('Connection from client side');

    // socket.on('insertData', function(val){
    // 	log.debug('receive', val);
    // 	db['sound_global'].insert({x: new Date().getTime(), y: val});
    // });

    socket.on('insertData', function(table, data) {
        log.debug('Ask for insertion :', table, data);
        db[table].insert(data);
    });

    socket.on("disconnect", function() {
        log.debug('Client Disconnect');
    })

});
