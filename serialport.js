var SerialPort = require('serialport');
var winston = log = require('winston');
const config = require('./config.json');

var lastTenValueSound = [];
var count = 0;
var averageSound = 0;
var maxValueSound = 0;

winston.level = config.debugLevel;

// var portArduino = '';
// SerialPort.list(function (err, ports) {
//   ports.forEach(function(port) {
//     if(port.manufacturer && port.manufacturer.indexOf('Arduino') <= 0){
//       log.debug('Arduino detected  : '+port.comName);
//       portArduino  = port.comName;
//     }
//   });
// });
// return;


///dev/cu.usbserial-7QVCOHC
// var serial = new SerialPort('/dev/ttyACM0', {
// var arduinoPort = '/dev/cu.usbmodemfa131';
var arduinoPort = '/dev/ttyACM0';
var serial = new SerialPort(arduinoPort, {
  parser: SerialPort.parsers.readline("\n"),
  baudRate: 9600
});

// Values to send over to Arduino.
// const MESSAGE = Buffer.from([R5<~]);
// const LOW = Buffer.from([0]);

serial.on('open', () => {
  log.info('Arduino port '+arduinoPort+' is open');
});

serial.on('data', (data) => {
     var dataIn = data;
     dataSplit = dataIn.split(",");
     // 1 = AnalogRead0 : Sound global
     // 2 = DigitalRead2 : Sound Loud
     // 3 = DigitalRead3 : PIR
    log.debug('1:' + dataSplit[0] + ' 2:' + dataSplit[1] +' 3:' + dataSplit[2]);


});

module.exports.sendToMega = function(type, id, value, cb) {
  log.debug("send arduino : ",type, id, value);
  serial.write(type + id + value + "~");
}

serial.on('close', () => {
  console.log('Serial port disconnected.');
  io.sockets.emit('close');
});

//test working
// setInterval(function(){
//   console.log('Send');
//   serial.write('R' + 5 + '<' + '~');
// },2000);
