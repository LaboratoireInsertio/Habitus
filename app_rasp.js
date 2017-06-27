const config = require('./config.json');
var _ = require('underscore');
winston = log = require('winston');
winston.level = config.debugLevel;
var interactions = require('./interactions');
var moduleAnimationActive = false;
var animations = require('./animations');
var modulesActive = {
  socketDigital : false,
  serialport : false,
  mqtt : false
}

var checkStatusModule = setInterval(function(){
  log.debug('Check if modules activate', modulesActive);
  if(modulesActive.socketDigital == true && modulesActive.serialport == true && modulesActive.mqtt == true){
    //stop to check status of modules
    clearInterval(checkStatusModule);
    //Start animation
    animations.init(log, serialport);
    setTimeout(function(){
      interactions.init(animations);
    },2000);
  }
}, 500);


var io = require('socket.io-client'),
  socket = io.connect(config.server, {
    reconnect: true
  });

// Initialization of websocket -> Communication between the Raspberry and the server DigitalOcean Insertio
socket.on('connect', function() {
  modulesActive.socketDigital = true;
  log.info('websocket open on the server ' + config.server);
});

socket.on('disconnect', function(){
  modulesActive.socketDigital = false;
  log.info('webscoket closed!');
})
//Initialization for serialport -> Communication between the arduino Mega and the Raspberry
var serialport = require('./serialport');
serialport.init(socket, modulesActive);

//Initialization for Mqtt (mosca) -> Communication between the remote arduino (Adafruit Feather) and the Raspberry
require('./rasp/mosca').listen(config, log, socket, modulesActive);

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
