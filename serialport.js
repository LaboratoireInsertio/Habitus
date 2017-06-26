var SerialPort = require('serialport');
var winston = log = require('winston');
const config = require('./config.json');

winston.level = config.debugLevel;

var portArduino = '';
SerialPort.list(function (err, ports) {
  ports.forEach(function(port) {
    if(port.manufacturer && port.manufacturer.indexOf('Arduino') <= 0){
      log.debug('Arduino detected  : '+port.comName);
      portArduino  = port.comName;
    }
  });
});
return;


///dev/cu.usbserial-7QVCOHC
var serial = new SerialPort(portArduino, {
// var serial = new SerialPort('/dev/cu.usbmodemfa131', {
  parser: SerialPort.parsers.readline("\n"),
  baudRate: 9600
});

// Values to send over to Arduino.
// const MESSAGE = Buffer.from([R5<~]);
// const LOW = Buffer.from([0]);

serial.on('open', () => {
  console.log('Port is open!');
});

serial.on('data', (data) => {
  // if(data.indexOf('~').length <= 0)
    // console.log(data);
});

module.exports.sendToMega = function(type, id, value, cb) {
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
