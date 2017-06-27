var SerialPort = require('serialport');
var _ = require('underscore');
var winston = log = require('winston');
const config = require('./config.json');

var socket,
  pirActive = false,
  CapturingSoundGlobal = false,
  soundLoudActive = false,
  lastTenValueSound = [],
  count = 0,
  averageSound = 0,
  maxValueSound = 0;

var arduinoPort = (process.env.ARDUINOPORT ? process.env.ARDUINOPORT : '/dec/ttyACM0');
// var arduinoPort = '/dev/ttyACM0';
var serial = new SerialPort(arduinoPort, {
  parser: SerialPort.parsers.readline("\n"),
  baudRate: 57600
});

module.exports.init = function(iosocket, modulesActive) {
  log.debug('Init serialport');
  socket = iosocket;

  serial.on('open', () => {
    modulesActive.serialport = true;
    log.info('Arduino port ' + arduinoPort + ' is open');
  });

  serial.on('close', () => {
    log.info('Serialport for arduino is disconnected.');
    io.sockets.emit('close');
  });
}

serial.on('data', (data) => {
  var dataIn = data;
  dataSplit = dataIn.split(",");
  // 1 = AnalogRead0 : Sound global
  // 2 = DigitalRead2 : Sound Loud
  // 3 = DigitalRead3 : PIR
  log.debug('1:' + dataSplit[0] + ' 2:' + dataSplit[1] + ' 3:' + dataSplit[2]);


  if (lastTenValueSound.length >= 10) {
    lastTenValueSound.splice(0, 1);
  }

  lastTenValueSound.push(dataSplit[0]);
  count = 0;
  _.each(lastTenValueSound, function(val) {
    count = +count + +val;
  });

  averageSound = count / lastTenValueSound.length;


  // GLOBAL SOUND
  if (averageSound > 10) {
    CapturingSoundGlobal = true;
    if (averageSound > maxValueSound) maxValueSound = averageSound;
  }

  if (averageSound < 10 && CapturingSoundGlobal) {
    CapturingSoundGlobal = false;
    log.debug('max Value Captured : ' + maxValueSound);
    socket.emit("soundGlobal", maxValueSound);
    socket.emit("insertData", "sound_global", {
      x: new Date().getTime(),
      y: maxValueSound
    });

    maxValueSound = 0;
  }


  // PIR

  if (dataSplit[2] == 1 && !pirActive) {
    pirActive = true;
    socket.emit("insertData", "pir", {
      x: new Date().getTime(),
      y: 1
    });
    log.debug('PIR is activate');
    // the pir sensor take 3 seconds for be inactive
    setTimeout(function() {
      pirActive = false;
    }, 3000);
  }

  //SOUND INTENSE

  if (dataSplit[1] == 1 && !soundLoudActive) {
    log.debug('Sound loud is active!');
    soundLoudActive = true;
    socket.emit("insertData", "sound_loud", {
      x: new Date().getTime(),
      y: 1
    });
    setTimeout(function() {
      soundLoudActive = false;
    }, 200);
  }


});

module.exports.sendToMega = function(type, id, value, cb) {
  // log.debug("send arduino : ",type, id, value);
  serial.write(type + id + value + "~");
}


//test working
// setInterval(function(){
//   console.log('Send');
//   serial.write('R' + 5 + '<' + '~');
// },2000);
