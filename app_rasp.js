const config = require('./config.json');
var _ = require('underscore');

const express = require('express');
var app = express();
var server = require('http').Server(app);

winston = log = require('winston');
winston.level = config.debugLevel;
global.sensors = {
  cellUp : 0,
  cellDown : 0,
  pir : 0,
  globalSound : 0,
  loudSound : 0,
  globalActivity : 0,
  BulbsTintsActive : true
}
var moduleAnimationActive = false;
var modulesActive = {
  socketDigital : false,
  serialport : false,
  mqtt : false
}

// var stateBulbs = [0,0,0,0,0,0,0,0];
var stateStairs = {
  bulbs : [255,255,255,255,255,255,255,255],
  tints : [0,0,0,0,0,0,0,0]
}
var lifx = require('./lifx');

global.lampsLifx = {}
global.interactions = require('./interactions');
global.animations = require('./animations');


// Express switch on / off Installation
server.listen(8844, function() {
    log.info('Server Express launch on : ' + 8844);

  });

  app.get('/on', function(req, res) {
    sensors.BulbsTintsActive = true;
    log.debug('Turn ON Bulbs and Tints');
    res.send('Turn ON Bulbs and Tints');
  });
  app.get('/off', function(req, res) {

    animations.turnAllBulbOff();
    animations.turnAllTintOff();
    sensors.BulbsTintsActive = false;
    log.debug('Turn OFF Bulbs and Tints');
    res.send('Turn OFF Bulbs and Tints');
  });

//Check if DigitalOcean, Serialport and MQTT is active before launch animation and interaction
var checkStatusModule = setInterval(function(){
  log.debug('Check if modules activate', modulesActive);
  if(modulesActive.socketDigital == true && modulesActive.serialport == true && modulesActive.mqtt == true){
    //stop to check status of modules
    clearInterval(checkStatusModule);
    //Start animation
    animations.init(log, serialport,stateStairs);
    setTimeout(function(){
      interactions.init(log, serialport, socket, stateStairs,_);
    },2000);
  }
}, 500);

//@TODO : Protect the connection
var io = require('socket.io-client'),
  socket = io.connect(config.server, {
    reconnect: true
  });

// Initialization of websocket -> Communication between the Raspberry and the server DigitalOcean Insertio
socket.on('connect', function() {
  modulesActive.socketDigital = true;
  log.info('websocket open on the server ' + config.server);
});

socket.on('globalActivity', function(globalActivity){
    sensors.globalActivity = globalActivity.value;
});

socket.on('disconnect', function(){
  modulesActive.socketDigital = false;
  log.info('webscoket closed!');
})
//Initialization for serialport -> Communication between the arduino Mega and the Raspberry
var serialport = require('./serialport');
serialport.init(socket, modulesActive,sensors, stateStairs);

//Initialization for Mqtt (mosca) -> Communication between the remote arduino (Adafruit Feather) and the Raspberry
require('./rasp/mosca').listen(config, log, socket, modulesActive, sensors, stateStairs);

//Initialization Lifx Lamps
lifx.init(log);


//Send to the server Digital Ocean the value of Tints and Bublbs Every 0.5s
setInterval(function(){
  log.debug('states', stateStairs);
  socket.emit('stateStairs', stateStairs);
},500);

//
//
// socket.on('newData', function(table, value) {
//   log.debug('NEW DATA!', table, value);
// });
//
// socket.on('swingBulbUp', swingBulbUp)
// socket.on('swingBulbDown', swingBulbDown);
//
// socket.on('swingUpTints', function() {
//   log.debug('Ask for swing Up Tints');
// })
//
// socket.on('swingDownTints', function() {
//   log.debug('Ask for swing Down Tints');
// });
//
// socket.on('turnAllBulbOn', turnAllBulbOn);
// socket.on('turnAllBulbOff', turnAllBulbOff);
// socket.on('turnAllTintOn', turnAllTintOn);
// socket.on('turnAllTintOff', turnAllTintOff)

// Main Loop
