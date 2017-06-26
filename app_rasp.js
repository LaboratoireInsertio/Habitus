const config = require('./config.json');
var io = require('socket.io-client'),
  socket = io.connect(config.server, {
    reconnect: true
  }),
  winston = log = require('winston');
winston.level = config.debugLevel;
var serialport = require('./serialport');

require('./rasp/mosca').listen(config, log, socket);

// Add a connect listener
socket.on('connect', function() {
  log.info('websocket open on the server ' + config.server);

  // setInterval(function() {
  // 	socket.emit('insertData', 'sound_global', {x:  new Date().getTime(), y: '12'});
  // 	log.debug('send');
  // }, 1000);

});

socket.on('newData', function(table, value) {
  log.debug('NEW DATA!', table, value);
});

socket.on('swingBulbUp', swingBulbUp)
socket.on('swingBulbDown', swingBulbDown);

socket.on('swingUpTints', function() {
  log.debug('Ask for swing Up Tints');
})

socket.on('swingDownTints', function() {
  log.debug('Ask for swing Down Tints');
});

socket.on('turnAllBulbOn', turnAllBulbOn);
socket.on('turnAllBulbOff', turnAllBulbOff);
socket.on('turnAllTintOn', turnAllTintOn);
socket.on('turnAllTintOff', turnAllTintOff)

// Main Loop
setTimeout(function() {
  console.log('------------------- START ------------------------');
  turnAllBulbOff(); 
  setInterval(function() {
    //swingBulbUp(200);
    //swingBulbDown(1000);
    //swingTintUp(1000);
    //swingTintDown(1000);
    //randomBulb(1000);

    //randomBulbBrightnessAll(200);
    randomTint(200);

  }, 30);
}, 3000);

var numLamps = 8;
var bulbMin = 20;
var bulbMax = 95;

function turnAllBulbOn() {
  for (var i = 0; i < numLamps; i++) {
    serialport.sendToMega("D", i + 1, String.fromCharCode(bulbMin));
  }
}

function turnAllBulbOn(brightness){
	for (var i = 0; i < numLamps; i++) {
	    serialport.sendToMega("D", i + 1, String.fromCharCode(brightness));
	}
}

function turnAllBulbOff() {
  for (var i = 0; i < numLamps; i++) {
    serialport.sendToMega("D", i + 1, String.fromCharCode(bulbMax));
  }
}

function turnAllTintOff() {
  for (var i = 0; i < numLamps; i++) {
    serialport.sendToMega("R", i + 1, String.fromCharCode(0));
  }
}

function turnAllTintOn() {
  for (var i = 0; i < numLamps; i++) {
    serialport.sendToMega("R", i + 1, String.fromCharCode(1));
  }
}

var whichBulb1 = 0;
var timerBulb1 = Date.now();
function swingBulbUp(interval) {
  if ((Date.now() - timerBulb1) >= interval) {
    //console.log("UP! "+bulbMin);

    serialport.sendToMega("D", whichBulb1 + 1, String.fromCharCode(bulbMax));

    whichBulb1 = whichBulb1 + 1;
    if (whichBulb1 > numLamps) whichBulb1 = 0;

    serialport.sendToMega("D", whichBulb1 + 1, String.fromCharCode(bulbMin));

    timerBulb1 = Date.now();
  }
}

var whichBulb2 = 0;
var timerBulb2 = Date.now();
function swingBulbDown(interval) {
  if ((Date.now() - timerBulb2) >= interval) {
    //console.log("DOWN! "+bulbMax);

    serialport.sendToMega("D", whichBulb2, String.fromCharCode(bulbMax));

    whichBulb2 = whichBulb2 - 1;
    if (whichBulb2 < 1) whichBulb2 = numLamps;

    serialport.sendToMega("D", whichBulb2, String.fromCharCode(bulbMin));

    timerBulb2 = Date.now();
  }
}


var whichTint1 = 0;
var timerTint1 = Date.now();
function swingTintUp(interval) {
  if ((Date.now() - timerTint1) >= interval) {
    //console.log("UP! "+bulbMin);

    serialport.sendToMega("R", whichTint1 + 1, String.fromCharCode(0));

    whichTint1 = whichTint1 + 1;
    if (whichTint1 > numLamps) whichTint1 = 0;

    serialport.sendToMega("R", whichTint1 + 1, String.fromCharCode(1));

    timerTint1 = Date.now();
  }
}


var whichTint2 = 0;
var timerTint2 = Date.now();
function swingTintDown(interval) {
  if ((Date.now() - timerTint2) >= interval) {
    //console.log("UP! "+bulbMin);

    serialport.sendToMega("R", whichTint2, String.fromCharCode(0));

    whichTint2 = whichTint2 - 1;
    if (whichTint2 < 1) whichTint2 = numLamps;

    serialport.sendToMega("R", whichTint2, String.fromCharCode(1));

    timerTint2 = Date.now();
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var whichRandomBulb = 3;
var timerRandomBulb = Date.now();
function randomBulb(interval) {
  if ((Date.now() - timerRandomBulb) >= interval) {
    //console.log(whichRandomBulb);

    serialport.sendToMega("D", whichRandomBulb, String.fromCharCode(bulbMax));

    whichRandomBulb = getRandomInt(1, 8);
    var randomBright = getRandomInt(bulbMin, bulbMax);

    serialport.sendToMega("D", whichRandomBulb, String.fromCharCode(randomBright));

    timerRandomBulb = Date.now();
  }
}


var whichRandomTint = 6;
var timerRandomTint = Date.now();
function randomTint(interval) {
  if ((Date.now() - timerRandomTint) >= interval) {
    //console.log("UP! "+bulbMin);

    serialport.sendToMega("R", whichRandomTint, String.fromCharCode(0));

    whichRandomTint = getRandomInt(1, 8);

    serialport.sendToMega("R", whichRandomTint, String.fromCharCode(1));

    timerRandomTint = Date.now();
  }
}


var timerRandomBrightnessAll = Date.now();
function randomBulbBrightnessAll(interval) {
  if ((Date.now() - timerRandomBrightnessAll) >= interval) {
    for (var i = 1; i <= 8; i++) {
      var randomBright = getRandomInt(bulbMin, bulbMax);
      serialport.sendToMega("D", i, String.fromCharCode(randomBright));
    }

    timerRandomBrightnessAll = Date.now();
  }
}
