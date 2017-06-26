var SerialPort = require('serialport');
var winston = log = require('winston');
const config = require('./config.json');

winston.level = config.debugLevel;

var portArduino = '';
var serial;

SerialPort.list(function (err, ports) {
  ports.forEach(function(port) {
    if(port.manufacturer && port.manufacturer.indexOf('Arduino') <= 0){
      log.debug('Arduino detected  : '+port.comName);
      portArduino  = port.comName;

      serial = new SerialPort(portArduino, {
      // var serial = new SerialPort('/dev/cu.usbmodemfa131', {
        parser: SerialPort.parsers.readline("\n"),
        baudRate: 9600
      });

      serial.on('open', () => {
        console.log('Port is open!');
      });

      serial.on('data', (data) => {
        // if(data.indexOf('~').length <= 0)
          // console.log(data);
      });

      serial.on('close', () => {
        console.log('Serial port disconnected.');
        io.sockets.emit('close');
      });

    }
  });
});

module.exports.sendToMega = function(type, id, value, cb) {
  // log.debug("send  "+type+ " "+ id + " "+value);
  serial.write(type + id + value + "~");
}
///dev/cu.usbserial-7QVCOHC


// Values to send over to Arduino.
// const MESSAGE = Buffer.from([R5<~]);
// const LOW = Buffer.from([0]);


//test working
// setInterval(function(){
//   console.log('Send');
//   serial.write('R' + 5 + '<' + '~');
// },2000);
