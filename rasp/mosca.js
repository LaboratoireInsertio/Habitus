var mosca = require('mosca');
const config = require('../config.json');
var winston = log = require('winston');
winston.level = config.debugLevel;

var mqtt_settings = {
  port: 1883,
  persistence: mosca.persistence.Memory
};

var mqtt_server = new mosca.Server(mqtt_settings, function() {
  console.log('Mosca server is up and running');
});

var pirActive = false,
  CapturingSoundGlobal = false,
  soundLoudActive = false,
  photoCellDownActive = false,
  photoCellUpActive = false,
  SomeOneInStairs = false,
  TimeInStairs,
  UpOrDown;


// Recieve data from remote Arduino

var phoD = 0;
var phoU = 0;
var piez = 0;

mqtt_server.published = function(packet, client, cb) {
  if (packet.topic.indexOf('echo') === 0) {
    return cb();
  }
  console.log(packet);

  var newPacket = {
    topic: 'echo/' + packet.topic,
    payload: packet.payload.toString(),
    retain: packet.retain,
    qos: packet.qos
  };

  if (packet.topic == "feeds/photoDOWN"){
	phoD = parseInt(packet.payload.toString());
  } else if (packet.topic == "feeds/photoUP"){
	phoU = parseInt(packet.payload.toString());
  } else if (packet.topic == "feeds/piezo"){
	piez = parseInt(packet.payload.toString());
  }

   // PHOTOCELLS
   if(phoD >= 500 && !photoCellDownActive ){
   		photoCellDownActive = new Date().getTime();
   		SomeOneInStairs = true;
   		winston.debug('Photocell Down active');
   }

   if(phoU >= 500 && !photoCellUpActive ){
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

  // forward messages to subscribed clients
  mqtt_server.publish(newPacket, cb);
}
