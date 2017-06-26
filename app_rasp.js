const config = require('./config.json');
var io = require('socket.io-client'),
  socket = io.connect(config.serverLocal, {
    reconnect: true
  }),
  winston = log = require('winston');
winston.level = config.debugLevel;
var serialport = require('./serialport');


var pirActive = false,
  CapturingSoundGlobal = false,
  soundLoudActive = false,
  photoCellDownActive = false,
  photoCellUpActive = false,
  SomeOneInStairs = false,
  TimeInStairs,
  UpOrDown;


// //---------- MQTT CONFIGURATION SERVER <-> REMOTE ARDUINO ----------//

// var mqtt_settings = {
//   port: 1883,
//   persistence: mosca.persistence.Memory
// };

// var mqtt_server = new mosca.Server(mqtt_settings, function() {
//   //console.log('Mosca server is up and running')
// });

// // ------------------------------------------------------------- //


// Add a connect listener
socket.on('connect', function() {
  log.debug('Connected!');

  // setInterval(function() {
  // 	socket.emit('insertData', 'sound_global', {x:  new Date().getTime(), y: '12'});
  // 	log.debug('send');
  // }, 1000);

});

socket.on('newData', function(table, value) {
  log.debug('NEW DATA!', table, value);
});

var tintIsOn = false;
setTimeout(function() {
  console.log("Open Light 8 ");
	var value = String.fromCharCode(1);
  serialport.sendToMega("D", 8, value);


  setInterval(function() {
    if (!tintIsOn) {
      serialport.sendToMega("D", 8, 255);
      tintIsOn = true;
    } else {
      serialport.sendToMega("D", 8, 0);
      tintIsOn = false;
    }
  }, 2000);

},3500);



// //----------- RECEIVE DATA FROM THE ARDUINO --------------------//

// var lastTenValueSound = [];
// var count = 0;
// var averageSound = 0;
// var maxValueSound = 0;

// myPort.on('data', function (data) {
//    var dataIn = data;
//    dataSplit = dataIn.split(",");
//    // 0 = AnalogRead0 : Sound global
//    // 1 = DigitalRead2 : Sound Loud
//    // 2 = AnalogRead2 : PhotoCell (bas)
//    // 3 = AnalogRead3 : PhotoCell (haut)
//    // 4 = DigitalRead3 : PIR
//    // console.log('1:' + dataSplit[0] + ' 2:' + dataSplit[1] +' 3:' + dataSplit[2] +' 4:' + dataSplit[3] +' 5:' + dataSplit[4]);


//    if(lastTenValueSound.length >= 10){
//    	lastTenValueSound.splice(0,1);
//    }
//    lastTenValueSound.push(dataSplit[0]);
//    count = 0;
//    _.each(lastTenValueSound, function(val){
//    	count = +count + +val;
//    });

//    averageSound = count/lastTenValueSound.length;


//    // GLOBAL SOUND
//    if(averageSound > 10 ){
//    	CapturingSoundGlobal = true;
//    	if(averageSound > maxValueSound ) maxValueSound = averageSound;
//    }

//    if(averageSound < 10 && CapturingSoundGlobal){
//    	CapturingSoundGlobal = false;
//    	winston.debug('max Value Captured : '+ maxValueSound);
//    	db.sound_global.insert({x: new Date().getTime(), y: maxValueSound});
//    	maxValueSound = 0;
//    }


//    // PIR

//    if(dataSplit[4] == 1 && !pirActive){
//    	pirActive = true;
//    	db.pir.insert({x: new Date().getTime(), y: 1});
//    	winston.debug('PIR is activate');
//    	// the pir sensor take 3 seconds for be inactive
//    	setTimeout(function(){
//    		pirActive = false;
//    		db.pir.insert({x: new Date().getTime(), y: 1});
//    	}, 3000);
//    }

//    //SOUND INTENSE

//    if(dataSplit[1] == 1 && !soundLoudActive){
//    	winston.debug('BANG!');
//    	soundLoudActive = true;
//    	db.sound_loud.insert({x: new Date().getTime(), y: 1});
//    	setTimeout(function(){
//    		soundLoudActive = false;
//    	},200);
//    }


//    // PHOTOCELLS
//    if(dataSplit[2] >= 500 && !photoCellDownActive ){
//    		photoCellDownActive = new Date().getTime();
//    		SomeOneInStairs = true;
//    		winston.debug('Photocell Down active');
//    }
//    if(dataSplit[3] >= 500 && !photoCellUpActive ){
//    		photoCellUpActive = new Date().getTime();
//    		SomeOneInStairs = true;
//    		winston.debug('Photocell Up active');
//    }
//    if(photoCellUpActive && photoCellDownActive && SomeOneInStairs){
//    	SomeOneInStairs =  false;

//    	TimeInStairs = photoCellUpActive - photoCellDownActive;
//    	if(TimeInStairs > 0){
//    		winston.debug('Someone up the stairs!', TimeInStairs);
//    		UpOrDown = "up";
//    	}
//    	else {
//    		winston.debug('Someone down the stairs', Math.abs(TimeInStairs));
//    		UpOrDown = "down";
//    	}
// 		db.stairs.insert({up: photoCellUpActive, down : photoCellDownActive});
//    	setTimeout(function(){
//    		photoCellDownActive = photoCellUpActive = false;
//    	},500);
//    }


// });


// // Recieve data from remote Arduino

// var phoD = 0;
// var phoU = 0;
// var piez = 0;

// mqtt_server.published = function(packet, client, cb) {
//   if (packet.topic.indexOf('echo') === 0) {
//     return cb();
//   }

//   var newPacket = {
//     topic: 'echo/' + packet.topic,
//     payload: packet.payload.toString(),
//     retain: packet.retain,
//     qos: packet.qos
//   };

//   if (packet.topic == "feeds/photoDOWN"){
// 	phoD = parseInt(packet.payload.toString());
//   } else if (packet.topic == "feeds/photoUP"){
// 	phoU = parseInt(packet.payload.toString());
//   } else if (packet.topic == "feeds/piezo"){
// 	piez = parseInt(packet.payload.toString());
//   }

//    // PHOTOCELLS
//    if(phoD >= 500 && !photoCellDownActive ){
//    		photoCellDownActive = new Date().getTime();
//    		SomeOneInStairs = true;
//    		winston.debug('Photocell Down active');
//    }

//    if(phoU >= 500 && !photoCellUpActive ){
//    		photoCellUpActive = new Date().getTime();
//    		SomeOneInStairs = true;
//    		winston.debug('Photocell Up active');
//    }

//    if(photoCellUpActive && photoCellDownActive && SomeOneInStairs){
//    	SomeOneInStairs =  false;

//    	TimeInStairs = photoCellUpActive - photoCellDownActive;
//    	if(TimeInStairs > 0){
//    		winston.debug('Someone up the stairs!', TimeInStairs);
//    		UpOrDown = "up";
//    	}
//    	else {
//    		winston.debug('Someone down the stairs', Math.abs(TimeInStairs));
//    		UpOrDown = "down";
//    	}

//     db.stairs.insert({up: photoCellUpActive, down : photoCellDownActive});

//    	setTimeout(function(){
//    		photoCellDownActive = photoCellUpActive = false;
//    	},500);
//    }

//   // forward messages to subscribed clients
//   mqtt_server.publish(newPacket, cb);
// }
