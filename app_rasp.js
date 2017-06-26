const config = require('./config.json');
var io = require('socket.io-client'),
  socket = io.connect(config.server, {
    reconnect: true
  }),
  winston = log = require('winston');
winston.level = config.debugLevel;
var serialport = require('./serialport');



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

socket.on('swingBulbUp', swingBulbUp)
socket.on('swingBulbDown', swingBulbDown);

socket.on('swingUpTints', function(){
	log.debug('Ask for swing Up Tints');
})

socket.on('swingDownTints', function(){
	log.debug('Ask for swing Down Tints');
});

socket.on('turnAllBulbOn', turnAllBulbOn);
socket.on('turnAllBulbOff', turnAllBulbOff);
socket.on('turnAllTintOn', turnAllTintOn);
socket.on('turnAllTintOff', turnAllTintOff)

// Main Loop
setInterval(function(){
		//swingBulbUp(1000);
		//swingBulbDown(1000);
		//swingTintUp(1000);
		//swingTintDown(1000);
		randomBulb(1000);

},30);

var numLamps = 8;
var bulbMin = 20;
var bulbMax = 95;

function turnAllBulbOn(){
	for (var i = 0; i< numLamps; i++){
		serialport.sendToMega("D", i+1, String.fromCharCode(bulbMin));
	}
}

function turnAllBulbOff(){
	for (var i = 0; i< numLamps; i++){
		serialport.sendToMega("D", i+1, String.fromCharCode(bulbMax));
	}
}

function turnAllTintOff(){
	for (var i = 0; i< numLamps; i++){
		serialport.sendToMega("R", i+1, String.fromCharCode(0));
	}
}

function turnAllTintOn(){
	for (var i = 0; i< numLamps; i++){
		serialport.sendToMega("R", i+1, String.fromCharCode(1));
	}
}

var whichBulb1 = 0;
var timerBulb1 = Date.now();

function swingBulbUp(interval){
	if ((Date.now() - timerBulb1) >= interval){
		//console.log("UP! "+bulbMin);

		serialport.sendToMega("D", whichBulb1+1, String.fromCharCode(bulbMax));

		whichBulb1 = whichBulb1 + 1;
		if (whichBulb1 > numLamps) whichBulb1 = 0;

		serialport.sendToMega("D", whichBulb1+1, String.fromCharCode(bulbMin));

		timerBulb1 = Date.now();
	}
}

var whichBulb2 = 0;
var timerBulb2 = Date.now();

function swingBulbDown(interval){
	if ((Date.now() - timerBulb2) >= interval){
		//console.log("DOWN! "+bulbMax);

		serialport.sendToMega("D", whichBulb2, String.fromCharCode(bulbMax));

		whichBulb2 = whichBulb2 - 1;
		if (whichBulb2 < 1) whichBulb2 = numLamps;

		serialport.sendToMega("D", whichBulb2, String.fromCharCode(bulbMin));

		timerBulb2 = Date.now();
	}
}


var whichTint1 = 0;
var timerTint1 = Date.now();

function swingTintUp(interval){
	if ((Date.now() - timerTint1) >= interval){
		//console.log("UP! "+bulbMin);

		serialport.sendToMega("R", whichTint1+1, String.fromCharCode(0));

		whichTint1 = whichTint1 + 1;
		if (whichTint1 > numLamps) whichTint1 = 0;

		serialport.sendToMega("R", whichTint1+1, String.fromCharCode(1));

		timerTint1 = Date.now();
	}
}


var whichTint2 = 0;
var timerTint2 = Date.now();

function swingTintDown(interval){
	if ((Date.now() - timerTint2) >= interval){
		//console.log("UP! "+bulbMin);

		serialport.sendToMega("R", whichTint2, String.fromCharCode(0));

		whichTint2 = whichTint2 - 1;
		if (whichTint2 < 1) whichTint2 = numLamps;

		serialport.sendToMega("R", whichTint2, String.fromCharCode(1));

		timerTint2 = Date.now();
	}
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var whichRandomBulb = 3;
var timerRandomBulb = Date.now();

function randomBulb(interval){
	if ((Date.now() - timerRandomBulb) >= interval){
		//console.log(whichRandomBulb);

		serialport.sendToMega("D", whichRandomBulb, String.fromCharCode(bulbMax));

		whichRandomBulb = getRandomInt(1, 8);
		var randomBright = getRandomInt(bulbMin, bulbMax);

		serialport.sendToMega("D", whichRandomBulb, String.fromCharCode(randomBright));

		timerRandomBulb = Date.now();
	}
}


var whichRandomTint = 6;
var timerRandomTint = Date.now();

function randomTint(interval){
	if ((Date.now() - timerRandomTint) >= interval){
		//console.log("UP! "+bulbMin);

		serialport.sendToMega("R", whichRandomTint, String.fromCharCode(0));

		whichRandomTint = getRandomInt(1, 8);

		serialport.sendToMega("R", whichRandomTint, String.fromCharCode(1));

		timerRandomTint = Date.now();
	}
}

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
