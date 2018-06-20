var SerialPort = require('serialport');
var Readline = SerialPort.parsers.Readline;
var arduinoPort = '/dev/ttyACM0';
// var arduinoPort = '/dev/ttyACM0';
var serial = new SerialPort(arduinoPort, {
  // parser: SerialPort.parsers.readline("\n"),
  baudRate: 57600
});
var parser = serial.pipe(new Readline());


serial.on('open', () => {
  console.log('Arduino port ' + arduinoPort + ' is open');
});

serial.on('close', () => {
  console.log('Serialport for arduino is disconnected.');
});

parser.on('data', (data) => {
  var dataSplit = data.split(":");
  console.log(dataSplit);
});


setTimeout(function(){
  console.log("send test bulb")
  serial.write("<bulb:8:255>",function(err){
        console.log("test bulb sended!");
        if(err) return console.log(err);
  });
},5000);