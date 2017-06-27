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
  var lastCelDown = 0;
  var lastCelUp = 0;

  var mainBrightness = 20;
  var mainInterval = 60000;
  // should be updated once a day from forecast
  var sunriseTime = 1498553634;
  var sunsetTime = 1498610667;
  var currentTime = Math.floor(Date.now()/1000);
  var lastSunUpdateTime = 0;

  var timerBrightnessCalculation = Date.now();

  var whichBulbSwingUpOnce = 0;
  var timerBulbSwingUpOnce = Date.now();

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
	var date = new Date();
	var currentHour = date.getHours();
	if ((currentHour == 3) && (Date.now() - lastSunUpdateTime > 86400000)){
		forecast.get([46.8078623, -71.2202719], function(err, weather) {
			if(err) return console.dir(err);
		
			sunriseTime = weather.daily.data[0].sunriseTime;
			sunsetTime = weather.daily.data[0].sunsetTime;
		});
		
		lastSunUpdateTime = Date.now();
	}

	// max brightness during night: 20
	// max brightness during inactivity: 60
	// max brightness when someone: 100
	if (Date.now() - timerBrightnessCalculation >= 1000){
		currentTime = Math.floor(Date.now()/10000);
		if (sunriseTime < currentTime && currentTime < sunsetTime){
			if (sensors.cellUp == 1 
				|| sensors.celDown == 1){
					mainBrightness = 100;
					timerBrightnessCalculation = Date.now();
				} else {
					mainBrightness = 60;
				}
		} else {
			if (sensors.cellUp == 1 
				|| sensors.celDown == 1){
					mainBrightness = 40;
					timerBrightnessCalculation = Date.now();
				} else {
					mainBrightness = 20;
				}
		}	
		//log.debug(mainBrightness);
	}
	
	// mainInterval should be a value between 500 and 60000
	//animations.randomBulbBrightnessAll(mainInterval, mainBrightness);
		
	//if(lastelDown != sensors.elDown ){
    //  if(sensors.pir == 1){
    //    whichBulbSwingUpOnce = 0;
    //  }
    //  lastelDown = sensors.elDown;
    //}
	
	if ((Date.now() - timerBulbSwingUpOnce) >= 500 && whichBulbSwingUpOnce < 8){
		
		serialport.sendToMega("D", whichBulbSwingUpOnce + 1, String.fromCharCode(0));
        whichBulbSwingUpOnce++;
		log.debug(whichBulbSwingUpOnce+1);
		serialport.sendToMega("D", whichBulbSwingUpOnce +1, String.fromCharCode(100));
		
		timerBulbSwingUpOnce = Date.now();
	}

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
