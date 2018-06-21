var SerialPort = require('serialport');
var Readline = SerialPort.parsers.Readline;
var arduinoPort = '/dev/ttyACM0';
// var arduinoPort = '/dev/ttyACM0';
var serial = new SerialPort(arduinoPort, {
  // parser: SerialPort.parsers.readline("\n"),
  baudRate: 1000000
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
  fadeInOutBulbs();
},3000);


function fadeInOutBulbs(){
  bulbs("t",1);
  bulbs("b",255);
  setTimeout(function(){
    bulbs("t",0);
    bulbs("b",0);
  },2000);
  setTimeout(fadeInOutBulbs,4000);
}

function bulbs(type, val){
  // for(var i=0;i<8;i++){

    serial.write("<"+type+":"+val+":"+val+":"+val+":"+val+":"+val+":"+val+":"+val+":"+val+">",function(err){
      if(err) return console.log(err);

    });

  // }
}