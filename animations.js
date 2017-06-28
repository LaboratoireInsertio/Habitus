/*
 *
 *ANIMATIONS.JS
 *
 *In this file there are diferent light and tint animations that should
 *be called from the INTERACTIONS.JS file, inside the main loop. 
 *They need to be inside a loop to work.
 *
 */

var serialport, log;
var whichBulb1 = 0;
var timerBulb1 = Date.now();
var whichBulb2 = 0;
var timerBulb2 = Date.now();
var whichTint1 = 0;
var timerTint1 = Date.now();
var whichRandomTint = 6;
var timerRandomTint = Date.now();
var whichRandomBulb = 3;
var timerRandomBulb = Date.now();
var whichTint2 = 0;
var timerTint2 = Date.now();

var timerRandomBrightnessAll = Date.now();
var desiredBright=[];
for (var i = 0; i < 8; i++) desiredBright[i] = 0;
var currentBright=[];
for (var i = 0; i < 8; i++) currentBright[i] = 0;
var timeBetweenSteps = [];
var individualTimer=[];
for (var i = 0; i < 8; i++) individualTimer[i] = Date.now();

var timerRandomTintToggleAll = Date.now();

//@todo : check this list
var numLamps = 8;
var bulbMin = 0;
var bulbMax = 100;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = {
  init: function(winstonlog, sp) {
    log = winstonlog;
    serialport = sp;
    log.info('Module Animations is initialized');
  },
  // ------------------ Basic Animations ------------------ //
  // Turns all the bulbs on, to the given bightness.
  turnAllBulbOn: function(brightness) {
    for (var i = 0; i < numLamps; i++) {
      serialport.sendToMega("D", i + 1, brightness);
    }
  },
  // Turns all the bulbs off.
  turnAllBulbOff: function() {
    for (var i = 0; i < numLamps; i++) {
      serialport.sendToMega("D", i + 1, bulbMin);
    }
  },
  // Turns all the tints off
  turnAllTintOff: function() {
    for (var i = 0; i < numLamps; i++) {
      serialport.sendToMega("R", i + 1, 0);
    }
  },
  // Turns all the tints on
  turnAllTintOn: function() {
    for (var i = 0; i < numLamps; i++) {
      serialport.sendToMega("R", i + 1, 1);
    }
  },
  // Turns on the bulbs one by one at a given interval and to a given brightness
  // starting from the bottom one and cycling while the function is called
  swingBulbUp: function(interval, brightness) {
    if ((Date.now() - timerBulb1) >= interval) {
      //console.log("UP! "+bulbMin);

      serialport.sendToMega("D", whichBulb1 + 1, bulbMin);

      whichBulb1 = whichBulb1 + 1;
      if (whichBulb1 > numLamps) whichBulb1 = 0;

      serialport.sendToMega("D", whichBulb1 + 1, brightness);

      timerBulb1 = Date.now();
    }
  },
  // Turns on the bulbs one by one at a given interval and to a given brightness
  // starting from the top one and cycling while the function is called
  swingBulbDown: function(interval, brightness) {
    if ((Date.now() - timerBulb2) >= interval) {
      //console.log("DOWN! "+bulbMax);

      serialport.sendToMega("D", whichBulb2, bulbMin);

      whichBulb2 = whichBulb2 - 1;
      if (whichBulb2 < 1) whichBulb2 = numLamps;

      serialport.sendToMega("D", whichBulb2, brightness);

      timerBulb2 = Date.now();
    }
  },
  // Turns on the tints one by one at a given interval and to a given brightness
  // starting from the bottom one and cycling while the function is called
  swingTintUp: function(interval) {
    if ((Date.now() - timerTint1) >= interval) {
      //console.log("UP! "+bulbMin);

      serialport.sendToMega("R", whichTint1 + 1, 0);

      whichTint1 = whichTint1 + 1;
      if (whichTint1 > numLamps) whichTint1 = 0;

      serialport.sendToMega("R", whichTint1 + 1, 1);

      timerTint1 = Date.now();
    }
  },
  // Turns on the tints one by one at a given interval and to a given brightness
  // starting from the top one and cycling while the function is called
  swingTintDown: function(interval) {
    if ((Date.now() - timerTint2) >= interval) {
      //console.log("UP! "+bulbMin);

      serialport.sendToMega("R", whichTint2, 0);

      whichTint2 = whichTint2 - 1;
      if (whichTint2 < 1) whichTint2 = numLamps;

      serialport.sendToMega("R", whichTint2, 1);

      timerTint2 = Date.now();
    }
  },
  // Turns on the bulbs one by one at a given interval and to a given brightness
  // in a random order while the function is called
  randomBulb: function(interval, maxBrightness) {
    if ((Date.now() - timerRandomBulb) >= interval) {
      //console.log(whichRandomBulb);

      serialport.sendToMega("D", whichRandomBulb, bulbMin);

      whichRandomBulb = getRandomInt(1, 8);
      var randomBright = getRandomInt(maxBrightness, bulbMin);

      serialport.sendToMega("D", whichRandomBulb, randomBright);

      timerRandomBulb = Date.now();
    }
  },
  // Turns on the tints one by one at a given interval and to a given brightness
  // in a random order while the function is called
  randomTint: function(interval) {
    if ((Date.now() - timerRandomTint) >= interval) {
      //console.log("UP! "+bulbMin);

      serialport.sendToMega("R", whichRandomTint, 0);

      whichRandomTint = getRandomInt(1, 8);

      serialport.sendToMega("R", whichRandomTint, 1);

      timerRandomTint = Date.now();
    }
  },
  // OLD RANDOM BULB BRIGHTNESS Turns all the the bulbs on each one with a
  // diferent brightness taking into account the given maximum and changing
  // at the given interval
  //randomBulbBrightnessAll: function(interval, maxBrightness) {
  //  // log.debug('active random Bulb Rightness All');
  //  if ((Date.now() - timerRandomBrightnessAll) >= interval) {
  //    for (var i = 1; i <= 8; i++) {
  //      var randomBright = getRandomInt(maxBrightness, bulbMin);
  //      serialport.sendToMega("D", i, randomBright);
  //    }
  //    timerRandomBrightnessAll = Date.now();
  //  }
  //}	,

  // Turns all the the bulbs on, each one with a diferent brightness, slowly
  // fading between states and taking into account the given  bightness maximum 
  // and the given interval
  randomBulbBrightnessAll: function(interval, maxBrightness) {
	if ((Date.now() - timerRandomBrightnessAll) >= interval) {
		for (var i = 0; i < 8; i++) {
			desiredBright[i] = getRandomInt(maxBrightness, bulbMin);
			//log.debug("desiredBright " + i + " " + desiredBright);
			var diference = Math.abs(desiredBright[i] - currentBright[i]);
			//log.debug("diference " + i + " " + diference);
			timeBetweenSteps[i] = Math.floor(interval/diference);
			//log.debug("timeBetweenSteps " + i + " " + timeBetweenSteps[i]);

			if (timeBetweenSteps[i] < 1)
				serialport.sendToMega("D", i+1, desiredBright);
			
		}
		
		//log.debug("desired: " + desiredBright);
		
		timerRandomBrightnessAll = Date.now();
	}
	
	for (var i = 0; i < 8; i++) {
		if (timeBetweenSteps[i] >= 1){
			if ((Date.now() - individualTimer[i] >= timeBetweenSteps[i])){
				//log.debug("timeBetweenSteps " + i + " " + timeBetweenSteps[i]);
				if (desiredBright[i] > currentBright[i]) currentBright[i]++;
				else currentBright[i]--;
				serialport.sendToMega("D", i+1, currentBright[i]);
				
				individualTimer[i] = Date.now();
			}
			
			//log.debug("current: " + currentBright);
		}
	}

  }	,
  // Randomly toggles all the tints on/off
  randomTintToggleAll: function(interval) {
    // log.debug('active random Bulb Rightness All');
    if ((Date.now() - timerRandomTintToggleAll) >= interval) {
      for (var i = 1; i <= 8; i++) {
        var randomToggle = getRandomInt(0, 1);
        serialport.sendToMega("R", i, randomToggle);
      }

      timerRandomTintToggleAll = Date.now();
    }
  }
}
