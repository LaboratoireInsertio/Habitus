// Require forecast module
var Forecast = require('forecast');

// Initialize foreecast
var forecast = new Forecast({
  service: 'darksky',
  key: '8a8d56f392652507b26ba8c906f6a21a',
  units: 'celcius',
  cache: true,      // Cache API requests
  ttl: {            // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/
    minutes: 27,
    seconds: 45
  }
});

function init(sensors, lamps, animations, log, serialport, socket) {

  log.info('Module Interactions is initialized');

  var timeBlink = 5;
  var countTime = 0;
  var lastPir = 0;

  var brightness = 20;
  // should be updated once a day from forecast
  var sunriseTime = 1498553634;
  var sunsetTime = 1498610667;
  var currentTime = Math.floor(Date.now()/1000);
  var lastSunUpdateTime = 0;

  var loop = setInterval(function() {

    // --------- Direct Interaction Examples --------- //
	/*
	if(sensors.cellUp == 1){
      animations.swingBulbDown(500, 50);
    }
    if(sensors.cellDown == 1){
      animations.swingBulbUp(500, 50);
    }
    if(sensors.loudSound == 1){
      animations.turnAllBulbOff();
    }
	*/

	// --------- LIFX Examples --------- //
	/*
    if(lastPir != sensors.pir ){
      if(sensors.pir == 1){
        log.debug('launch function someOneComing '+timeBlink);
        someOneComing();
      }
      lastPir = sensors.pir;
    }
	*/

	// sensors.pir			0-1
	// sensors.cellUp		0-1
	// sensors.celDown		0-1
	// sensors.loudSound	0-1
	// sensors.globalSound	0-1024

	
	// update sunrise and sunset every day at 3:00 am.
	//if ((Date.now().getHours() == 3) && (Date.now() - lastSunUpdateTime > 86400000)){
	//	forecast.get([46.8078623, -71.2202719], function(err, weather) {
	//		if(err) return console.dir(err);
	//	
	//		sunriseTime = weather.daily.data[0].sunriseTime;
	//		sunsetTime = weather.daily.data[0].sunsetTime;
	//	});
	//	
	//	lastSunUpdateTime = Date.now();
	//}
	

	// max brightness during night: 20
	// max brightness during inactivity: 60
	// max brightness when someone: 100
	currentTime = Math.floor(Date.now()/1000);
	if (sunriseTime < currentTime && currentTime < sunsetTime) brightness = 60;
	else brightness = 20;
	
	animations.randomBulbBrightnessAll(60000, brightness);
		


  }, 30);


  // Demo - Make blink lifx lampfloor when someone active the PIR in the entry
  function someOneComing(){
    //Check if the lamp is present
    if(lamps.floorLamp){
      //Turn on the lamp before sending informations
      lamps.floorLamp.on();
      lamps.floorLamp.color(360, 50, 100, 2500, 0);
      setTimeout(function(){
        lamps.floorLamp.off();
      },250);
      // console.log('finish!',countTime, timeBlink);
      if(countTime < timeBlink){
        setTimeout(someOneComing,500);
        countTime++;
      }else{
        countTime = 0;
      }
    }
  }

  // someOneComing();


  //Example creation animation
  //
  // setTimeout(function() {
  //   console.log('------------------- START ------------------------');
  //   //turnAllBulbOn(bulbMax);
  //   setInterval(function() {
  //     swingBulbUp(200, bulbMax);
  //     swingBulbDown(200, bulbMax);
  //     //swingTintUp(1000);
  //     //swingTintDown(1000);
  //     //randomBulb(1000);
  //
  //     //randomBulbBrightnessAll(200);
  //     //randomTint(200);
  //
  //   }, 30);
  // }, 3000);


}



module.exports = {
  init: init
}
