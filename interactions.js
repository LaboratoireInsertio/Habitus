// Require forecast module
var Forecast = require('forecast');
var onlyChangeThisFile = require('./only_change_this_file');
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


Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function init(log, serialport, socket, stateStairs, _) {

  log.info('Module Interactions is initialized');


  var lastCellDown = 0;
  var timeOutCellDown = 0;
  var timerTimeOutCellDown = 0
  var lastCellUp = 0;
  var timeOutCellUp = 0;
  var timerTimeOutCellUp = 0

  var mainBrightness = 20;
  var mainInterval = 30000;
  // should be updated once a day from forecast
  var sunriseTime = 0;
  var sunsetTime = 0;
  var currentTime = Math.floor(Date.now()/1000);
  var lastSunUpdateTime = 0;

  forecast.get([46.8078623, -71.2202719], function(err, weather) {
  	if(err) return console.dir(err);

  	sunriseTime = weather.daily.data[0].sunriseTime;
  	sunsetTime = weather.daily.data[0].sunsetTime;
		log.info("Sunrise Time: " + sunriseTime);
		log.info("Sunset Time: " + sunsetTime);
  });


  var timerBrightnessCalculation = Date.now();

  var whichBulbSwingUpOnce = 9;
  var timerBulbSwingUpOnce = Date.now();

  var whichBulbSwingDownOnce = 0;
  var timerBulbSwingDownOnce = Date.now();

  var doingSecondaryAnimation1 = false;
  var doingSecondaryAnimation2 = false;

  var timerPrintDebug = Date.now();
	var animationCellDown = false;
	var animationCellUp = false;
	var speedTimeout = 2000;

	log.debug("test function turnAllBulbOn");
	animations.turnAllBulbOn();
	setTimeout(function(){
		animations.turnAllBulbOff();
	},1000);

	function bulbUp(id){
		var idBulb = id;
		stateStairs.bulbs[id] = 255;
		serialport.sendToMega("b");
		setTimeout(function(){
			idBulb++;
			if(idBulb<8){
				bulbUp(idBulb);
			} else {

				log.debug("Animation bulbUp Finish!");
				setTimeout(function(){
					animations.turnAllBulbOff();
					setTimeout(function(){
						animationCellDown = false;
					},2500);
				},1000);
			}
		},200);
	}

	function bulbDown(id){
		var idBulb = id;
		stateStairs.bulbs[id] = 255;
		serialport.sendToMega("b");
		setTimeout(function(){
			idBulb--;
			if(idBulb>=0){
				 bulbDown(idBulb);
			}
			else{
				log.debug("Animation bulbDown Finish!");
				setTimeout(function(){
					animations.turnAllBulbOff();
						setTimeout(function(){
							animationCellUp = false;
						},2500);
				},1000);
			}
		},200);
	}

	function randomTints(){
		setTimeout(function(){

			var tintRand = _.random(0,7);
			var stateRand = _.random(0,1);
			// log.debug("random Tint! ",speedTimeout, sensors.globalActivity, tintRand, stateRand);
			stateStairs.tints[tintRand] = stateRand;
			serialport.sendToMega("t");
			randomTints();
		},speedTimeout);
	}

	randomTints();

  //////////////////////////   MAIN LOOP   //////////////////////////
  var loop = setInterval(function() {



  // --------- Direct Interaction Examples --------- //
  if(sensors.cellDown == 1 && !animationCellDown && !animationCellUp){
  	animationCellDown = true;
  	bulbUp(0);
  }


  if(sensors.cellUp == 1 && !animationCellUp && !animationCellDown){
  	animationCellUp = true;
  	bulbDown(7);
  }

	//GlobalActivity is between 0 and 200 - We map for avec 250 = fast (20ms) ; 0 = slow (2000ms);
	speedTimeout = map_range(sensors.globalActivity,0,200,20000,250);

    onlyChangeThisFile.loop();


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



	// sensors.pir				0-1
	// sensors.cellUp			0-1
	// sensors.cellDown			0-1
	// sensors.loudSound		0-1
	// sensors.globalSound		0-1024
	// sensors.globalActivity	0-200

	// // update sunrise and sunset every day at 3:00 am.
	// var date = new Date();
	// var currentHour = date.getHours();
	// if ((currentHour == 3) && (Date.now() - lastSunUpdateTime > 86400000)){
	// 	forecast.get([46.8078623, -71.2202719], function(err, weather) {
	// 		if(err) return console.dir(err);
	// 		console.log(currentHour);
	// 		//console.dir(weather.daily.data[0].sunriseTime);

	// 		sunriseTime = weather.daily.data[0].sunriseTime;
	// 		sunsetTime = weather.daily.data[0].sunsetTime;

	// 		log.info("Sunrise Time2: " + sunriseTime);
	// 		log.info("Sunset Time2: " + sunsetTime);
	// 	});

	// 	lastSunUpdateTime = Date.now();
	// }


	// if (Date.now() - timerBrightnessCalculation >= 1000){
	// 	// max brightness during night: 20
	// 	// max brightness during inactivity: 60
	// 	// max brightness when someone: 100
	// 	currentTime = Math.floor(Date.now()/1000);
	// 	if (sunriseTime != 0){
	// 		if (sunriseTime < currentTime && currentTime < sunsetTime){
	// 			if (sensors.cellUp == 1 || sensors.celDown == 1){
	// 				mainBrightness = 100;
	// 				timerBrightnessCalculation = Date.now();
	// 			} else {
	// 				mainBrightness = 60;
	// 			}
	// 		} else {
	// 			if (sensors.cellUp == 1 || sensors.celDown == 1){
	// 				mainBrightness = 40;
	// 				timerBrightnessCalculation = Date.now();
	// 			} else {
	// 				mainBrightness = 20;
	// 			}
	// 		}
	// 	}
	// 	//log.debug("Sunrise Time: " + sunriseTime);
	// 	//log.debug("Sunset Time: " + sunsetTime);
	// 	//log.debug("Current Time: " + currentTime);
	// 	//log.debug("Main Brightness: " + mainBrightness);
	// }

	// // Prints to the console everu 30 seconds for debuging
	// if (Date.now() - timerPrintDebug >= 30000){
	// 	log.debug("Sunrise Time: " + sunriseTime);
	// 	log.debug("Sunset Time: " + sunsetTime);
	// 	log.debug("Current Time: " + currentTime);
	// 	log.debug("Main Brightness: " + mainBrightness);

	// 	timerPrintDebug = Date.now();
	// }

	// // mainInterval should be a value between 500 and 60000
	// //animations.randomBulbBrightnessAll(mainInterval, mainBrightness);
	// //animations.randomBulbBrightnessAll(1000, 20);

	// mainInterval = 1000;
	// mainInterval = sensors.globalActivity.map(0, 200, 500, 30000);
	// mainInterval = 30000 - mainInterval + 500;
	// //mainBrightness = 20;

	// // ------------------- Run Main Animation ------------------- //
	// if (!doingSecondaryAnimation1 && !doingSecondaryAnimation2){
	// 	animations.randomBulbBrightnessAll(mainInterval, mainBrightness);
	// }


	// // ----------------- Swing Up When Someone ----------------- //
	// if (timeOutCellUp == 0){
	// 	if(lastCellDown != sensors.cellDown ){
 //     		if(sensors.cellDown == 1){
 //       		whichBulbSwingUpOnce = 0;
	// 			doingSecondaryAnimation1 = true;
	// 			timeOutCellDown = 1;
	// 			timerTimeOutCellDown = Date.now();
 //     		}
 //     		lastCellDown = sensors.cellDown;
 //   	}

	// 	if (Date.now() - timerTimeOutCellDown >= 15000){
	// 		timeOutCellDown = 0;
	// 	}

	// 	if (whichBulbSwingUpOnce <= 8){
	// 		if ((Date.now() - timerBulbSwingUpOnce) >= 500){
	// 			//log.debug(whichBulbSwingUpOnce);
	// 			serialport.sendToMega("D", whichBulbSwingUpOnce, 0);
 //       		whichBulbSwingUpOnce++;
	// 			serialport.sendToMega("D", whichBulbSwingUpOnce, mainBrightness);

	// 			timerBulbSwingUpOnce = Date.now();
	// 		}
	// 	} else {
	// 		doingSecondaryAnimation1 = false;
	// 	}
	// }

	// // ----------------- Swing Down When Someone ----------------- //
	// if (timeOutCellDown == 0){
	// 	if(lastCellUp != sensors.cellUp){
 //     		if(sensors.cellUp == 1){
 //       		whichBulbSwingDownOnce = 9;
	// 			doingSecondaryAnimation2 = true;
	// 			timeOutCellUp = 1;
	// 			timerTimeOutCellUp = Date.now();
 //     		}
 //     		lastCellUp = sensors.cellUp;
 //   	}

	// 	if (Date.now() - timerTimeOutCellUp >= 15000){
	// 		timeOutCellUp = 0;
	// 	}

	// 	if (whichBulbSwingDownOnce >= 1){
	// 		if ((Date.now() - timerBulbSwingDownOnce) >= 500){
	// 			//log.debug(whichBulbSwingDownOnce);
	// 			serialport.sendToMega("D", whichBulbSwingDownOnce, 0);
 //       		whichBulbSwingDownOnce--;
	// 			serialport.sendToMega("D", whichBulbSwingDownOnce, mainBrightness);

	// 			timerBulbSwingDownOnce = Date.now();
	// 		}
	// 	} else {
	// 		doingSecondaryAnimation2 = false;
	// 	}
	// }

  }, 30);




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
