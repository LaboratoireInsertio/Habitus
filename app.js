var mongojs = require('mongojs');
var db = mongojs('sensors', ['sound_global', 'sound_loud', 'stairs', 'pir']);
var _ = require('underscore');
var moment = require('moment');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var winston = require('winston');
winston.level = 'debug';
var serialport = require('serialport'); // include the serialport library

var pirActive = false,
		CapturingSoundGlobal = false,
		soundLoudActive = false,
		photoCellDownActive = false,
		photoCellUpActive = false,
		SomeOneInStairs = false,
		TimeInStairs,
		UpOrDown;

//----------- CONFIGURATION SERVER <-> CLIENT --------------------//

app.use('/assets', express.static('assets'));

server.listen(8844, function(){
	winston.info('Server launch on : '+8844);
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

//----------- CONFIGURATION SERVER <-> ARDUINO --------------------//

var SerialPort = serialport.SerialPort, // make a local instance of serial
portName = process.argv[1],         // get the port name from the command line
portConfig = {
baudRate: 9600,
    // call myPort.on('data') when a newline is received:
parser: serialport.parsers.readline('\n')
};

// open the serial port:
///dev/ttyUSB0
///dev/cu.usbserial-DA013UAA
var myPort = new SerialPort("dev/ttyAMA0", portConfig);

// ------------------------------------------------------------- //



// Listen connection Client Side for send datas of sensors from MongoDB
io.on('connection', function (socket) {

  //Get informations abouts sensors
  winston.debug('Connection accepted from client side!');

  db.pir.find(function(err, docs) {
  	var groups = _.groupBy(docs, function (doc) {
		  return moment(doc.x).startOf('minute').format();
		});
  	socket.emit('pirData', groups);
	});
 	
  db.sound_loud.find(function(err, docs){
  	var groups = _.groupBy(docs, function (doc) {
		  return moment(doc.x).startOf('minute').format();
		});
  	socket.emit('SoundLoudData', groups);
  });

  db.stairs.find(function(err, docs){
  	var groups = _.groupBy(docs, function (doc) {
		  return moment(doc.down).startOf('minute').format();
		});
  	socket.emit('StairsData', groups);
  });

  db.sound_global.find(function(err, docs){
  	var groups = _.groupBy(docs, function (doc) {
		  return moment(doc.x).startOf('minute').format();
		});
  	socket.emit('SoundGlobalData', groups);
  });

});

// Receive Data from the Arduino

var lastTenValueSound = [];
var count = 0;
var averageSound = 0;
var maxValueSound = 0;

myPort.on('data', function (data) {
   var dataIn = data;
   dataSplit = dataIn.split(",");
   // 0 = AnalogRead0 : Sound global
   // 1 = DigitalRead2 : Sound Loud
   // 2 = AnalogRead2 : PhotoCell (bas)
   // 3 = AnalogRead3 : PhotoCell (haut)
   // 4 = DigitalRead3 : PIR
   // console.log('1:' + dataSplit[0] + ' 2:' + dataSplit[1] +' 3:' + dataSplit[2] +' 4:' + dataSplit[3] +' 5:' + dataSplit[4]);

   
   if(lastTenValueSound.length >= 10){
   	lastTenValueSound.splice(0,1);
   }
   lastTenValueSound.push(dataSplit[0]);
   count = 0;
   _.each(lastTenValueSound, function(val){
   	count = +count + +val;
   });

   averageSound = count/lastTenValueSound.length;


   // GLOBAL SOUND
   if(averageSound > 10 ){
   	CapturingSoundGlobal = true;
   	if(averageSound > maxValueSound ) maxValueSound = averageSound;
   }

   if(averageSound < 10 && CapturingSoundGlobal){
   	CapturingSoundGlobal = false;
   	winston.debug('max Value Captured : '+ maxValueSound);
   	db.sound_global.insert({x: new Date().getTime(), y: maxValueSound});
   	maxValueSound = 0;
   }


   // PIR

   if(dataSplit[4] == 1 && !pirActive){
   	pirActive = true;
   	db.pir.insert({x: new Date().getTime(), y: 1});
   	winston.debug('PIR is activate');
   	// the pir sensor take 3 seconds for be inactive
   	setTimeout(function(){
   		pirActive = false;
   		db.pir.insert({x: new Date().getTime(), y: 1});
   	}, 3000);
   }

   //SOUND INTENSE

   if(dataSplit[1] == 1 && !soundLoudActive){
   	winston.debug('BANG!');
   	soundLoudActive = true;
   	db.sound_loud.insert({x: new Date().getTime(), y: 1});
   	setTimeout(function(){
   		soundLoudActive = false;
   	},200);
   }

   // PHOTOCELLS

   if(dataSplit[2] >= 500 && !photoCellDownActive ){
   		photoCellDownActive = new Date().getTime();
   		SomeOneInStairs = true;
   		winston.debug('Photocell Down active');
   }

   if(dataSplit[3] >= 500 && !photoCellUpActive ){
   		photoCellUpActive = new Date().getTime();
   		SomeOneInStairs = true;
   		winston.debug('Photocell Up active');
   }

   if(photoCellUpActive && photoCellDownActive && SomeOneInStairs){
   	SomeOneInStairs =  false;
   
   	TimeInStairs = photoCellUpActive - photoCellDownActive;
   	if(TimeInStairs > 0){
   		winston.debug('Someone up the stairs!', TimeInStairs);
   		UpOrDown = "up";
   	}
   	else {
   		winston.debug('Someone down the stairs', Math.abs(TimeInStairs));
   		UpOrDown = "down";
   	}

		db.stairs.insert({up: photoCellUpActive, down : photoCellDownActive});

   	setTimeout(function(){
   		photoCellDownActive = photoCellUpActive = false;
   	},500);
   }
   

});





// setInterval(function(){
//         db.sound_1.insert({x: new Date().getTime(), y: Math.floor((Math.random() * 100) + 1)});
// },1000);