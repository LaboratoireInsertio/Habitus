var SerialPort = require('serialport');

///dev/cu.usbserial-7QVCOHC
var serial = new SerialPort('/dev/cu.usbmodemfa131', {
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
  console.log(data);
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
