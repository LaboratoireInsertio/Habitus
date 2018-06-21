var SerialPort = require('serialport');
var Readline = SerialPort.parsers.Readline;
var _ = require('underscore');
var winston = log = require('winston');
const config = require('./config.json');

var socket,
  stateStairs,
  pirActive = false,
  CapturingSoundGlobal = false,
  soundLoudActive = false,
  lastTenValueSound = [],
  count = 0,
  averageSound = 0,
  maxValueSound = 0,
  sensors;

var arduinoPort = (process.env.ARDUINOPORT ? process.env.ARDUINOPORT : '/dev/ttyACM0');
// var arduinoPort = '/dev/ttyACM0';
var serial = new SerialPort(arduinoPort, {
  baudRate: 1000000
});
var parser = serial.pipe(new Readline());

module.exports.init = function(iosocket, modulesActive, sensorsR, stateS) {
  sensors = sensorsR;
  log.debug('Init serialport');
  stateStairs = stateS;
  socket = iosocket;

  serial.on('open', () => {
    modulesActive.serialport = true;
    log.info('Arduino port ' + arduinoPort + ' is open');
  });

  serial.on('close', () => {
    log.info('Serialport for arduino is disconnected.');
  });

  parser.on('data', (data) => {
    var dataIn = data;
    dataIn = dataIn.split(":");
    // console.log(dataIn);
    // Data sensors are now receive indenpendently
    // sensSoundGlobal, sensSoundInte,sensPir

    if(dataIn[0] == "sensSoundGlobal"){
      log.info("Receive Global Sound data : "+dataIn[1]);
      if(dataIn[1] > 20){
        socket.emit("data", "sound_global", {
          x: new Date().getTime(),
          y: maxValueSound
        });
        setTimeout(function() {
          socket.emit("data", "sound_global", 0);
        }, 3000);
        maxValueSound = 0;
      }
     }
    
    
    if(dataIn[0] == "sensSoundInte" && !soundLoudActive){
      log.info("Receive Intensity data : "+dataIn[1]);
      sensors.loudSound = 1;
      soundLoudActive = true;
      socket.emit("data", "sound_loud", {
        x: new Date().getTime(),
        y: 1
      });
      setTimeout(function() {
        sensors.loudSound = 0;
        socket.emit("data", "sound_loud", 0);
        soundLoudActive = false;
      }, 200);
      
    }
    
    
    if(dataIn[0] == "sensPir" && !pirActive){
      pirActive = true;
      sensors.pir = 1;
      log.info("Receive PIR data : "+dataIn[1]);
      socket.emit("data", "pir", {
        x: new Date().getTime(),
        y: 1
      });
      setTimeout(function() {
        socket.emit("data", "pir", 0);
        pirActive = false;
        sensors.pir = 0;
      }, 3000);
      
    }
    
    

    // 1 = AnalogRead0 : Sound global
    // 2 = DigitalRead2 : Sound Loud
    // 3 = DigitalRead3 : PIR
    // log.debug('1:' + dataSplit[0] + ' 2:' + dataSplit[1] + ' 3:' + dataSplit[2]);

    //
    // if (lastTenValueSound.length >= 10) {
    //   lastTenValueSound.splice(0, 1);
    // }
    //
    // lastTenValueSound.push(dataSplit[0]);
    // count = 0;
    // _.each(lastTenValueSound, function(val) {
    //   count = +count + +val;
    // });
    //
    // averageSound = count / lastTenValueSound.length;
    //
    // sensors.globalSound = averageSound;
    // // GLOBAL SOUND
    // if (averageSound > 10) {
    //   CapturingSoundGlobal = true;
    //   if (averageSound > maxValueSound) maxValueSound = averageSound;
    // }
    //
    // if (averageSound < 10 && CapturingSoundGlobal) {
    //   CapturingSoundGlobal = false;
    //   log.debug('max Value Captured : ' + maxValueSound);
    //
    //   socket.emit("data", "sound_global", {
    //     x: new Date().getTime(),
    //     y: maxValueSound
    //   });
    //   setTimeout(function() {
    //     socket.emit("data", "sound_global", 0);
    //   }, 3000);
    //   maxValueSound = 0;
    // }
    //
    //
    // // PIR
    //
    // if (dataSplit[2] == 1 && !pirActive) {
    //   pirActive = true;
    //   socket.emit("data", "pir", {
    //     x: new Date().getTime(),
    //     y: 1
    //   });
    //   log.debug('PIR is activate');
    //   sensors.pir = 1;
    //   // the pir sensor take 3 seconds for be inactive
    //   setTimeout(function() {
    //     socket.emit("data", "pir", 0);
    //     pirActive = false;
    //     sensors.pir = 0;
    //   }, 3000);
    // }
    //
    // //SOUND INTENSE
    //
    // if (dataSplit[1] == 1 && !soundLoudActive) {
    //   sensors.loudSound = 1;
    //   log.debug('Sound loud is active!');
    //   soundLoudActive = true;
    //   socket.emit("data", "sound_loud", {
    //     x: new Date().getTime(),
    //     y: 1
    //   });
    //   setTimeout(function() {
    //     sensors.loudSound = 0;
    //     socket.emit("data", "sound_loud", 0);
    //     soundLoudActive = false;
    //   }, 200);
    // }
  });
}


module.exports.sendToMega = function(type, id, value, cb) {
  // log.debug("send arduino : ",type, id, value);
  if (sensors.BulbsTintsActive) {
    serial.write(type + id + String.fromCharCode(value) + "~");

    // Message send in the form R1<~ :
    // R can be R for Relay or D for Dimer
    // 1 is the channel number (1-8 on both cases)
    // < is the value encoded in its char representation
    // ~ escape character

    if (type == "D") stateStairs.bulbs[id - 1] = value;
    if (type == "R") stateStairs.tints[id - 1] = value;
  } else {
    log.debug('Bulbs and Tints turn OFF');
  }
}
