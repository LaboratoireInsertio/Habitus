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
var currentBright=[];
for (var i = 0; i < 8; i++) currentBright[i] = 0;
var timeBetweenSteps = [];
var individualTimer=[];

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
  turnAllBulbOn: function(brightness) {
    for (var i = 0; i < numLamps; i++) {
      serialport.sendToMega("D", i + 1, String.fromCharCode(brightness));
    }
  },

  turnAllBulbOff: function() {
    for (var i = 0; i < numLamps; i++) {
      serialport.sendToMega("D", i + 1, String.fromCharCode(bulbMin));
    }
  },
  turnAllTintOff: function() {
    for (var i = 0; i < numLamps; i++) {
      serialport.sendToMega("R", i + 1, String.fromCharCode(0));
    }
  },
  turnAllTintOn: function() {
    for (var i = 0; i < numLamps; i++) {
      serialport.sendToMega("R", i + 1, String.fromCharCode(1));
    }
  },
  swingBulbUp: function(interval, brightness) {
    if ((Date.now() - timerBulb1) >= interval) {
      //console.log("UP! "+bulbMin);

      serialport.sendToMega("D", whichBulb1 + 1, String.fromCharCode(bulbMin));

      whichBulb1 = whichBulb1 + 1;
      if (whichBulb1 > numLamps) whichBulb1 = 0;

      serialport.sendToMega("D", whichBulb1 + 1, String.fromCharCode(brightness));

      timerBulb1 = Date.now();
    }
  },
  swingBulbDown: function(interval, brightness) {
    if ((Date.now() - timerBulb2) >= interval) {
      //console.log("DOWN! "+bulbMax);

      serialport.sendToMega("D", whichBulb2, String.fromCharCode(bulbMin));

      whichBulb2 = whichBulb2 - 1;
      if (whichBulb2 < 1) whichBulb2 = numLamps;

      serialport.sendToMega("D", whichBulb2, String.fromCharCode(brightness));

      timerBulb2 = Date.now();
    }
  },
  swingTintUp: function(interval) {
    if ((Date.now() - timerTint1) >= interval) {
      //console.log("UP! "+bulbMin);

      serialport.sendToMega("R", whichTint1 + 1, String.fromCharCode(0));

      whichTint1 = whichTint1 + 1;
      if (whichTint1 > numLamps) whichTint1 = 0;

      serialport.sendToMega("R", whichTint1 + 1, String.fromCharCode(1));

      timerTint1 = Date.now();
    }
  },
  swingTintDown: function(interval) {
    if ((Date.now() - timerTint2) >= interval) {
      //console.log("UP! "+bulbMin);

      serialport.sendToMega("R", whichTint2, String.fromCharCode(0));

      whichTint2 = whichTint2 - 1;
      if (whichTint2 < 1) whichTint2 = numLamps;

      serialport.sendToMega("R", whichTint2, String.fromCharCode(1));

      timerTint2 = Date.now();
    }
  },
  randomBulb: function(interval, maxBrightness) {
    if ((Date.now() - timerRandomBulb) >= interval) {
      //console.log(whichRandomBulb);

      serialport.sendToMega("D", whichRandomBulb, String.fromCharCode(bulbMin));

      whichRandomBulb = getRandomInt(1, 8);
      var randomBright = getRandomInt(maxBrightness, bulbMin);

      serialport.sendToMega("D", whichRandomBulb, String.fromCharCode(randomBright));

      timerRandomBulb = Date.now();
    }
  },
  randomTint: function(interval) {
    if ((Date.now() - timerRandomTint) >= interval) {
      //console.log("UP! "+bulbMin);

      serialport.sendToMega("R", whichRandomTint, String.fromCharCode(0));

      whichRandomTint = getRandomInt(1, 8);

      serialport.sendToMega("R", whichRandomTint, String.fromCharCode(1));

      timerRandomTint = Date.now();
    }
  },
  //randomBulbBrightnessAll: function(interval, maxBrightness) {
  //  // log.debug('active random Bulb Rightness All');
  //  if ((Date.now() - timerRandomBrightnessAll) >= interval) {
  //    for (var i = 1; i <= 8; i++) {
  //      var randomBright = getRandomInt(maxBrightness, bulbMin);
  //      serialport.sendToMega("D", i, String.fromCharCode(randomBright));
  //    }
  //    timerRandomBrightnessAll = Date.now();
  //  }
  //}	,
  randomBulbBrightnessAll: function(interval, maxBrightness) {
    // log.debug('active random Bulb Rightness All');
    //if ((Date.now() - timerRandomBrightnessAll) >= interval) {
    //  for (var i = 1; i <= 8; i++) {
    //    var randomBright = getRandomInt(maxBrightness, bulbMin);
    //    serialport.sendToMega("D", i, String.fromCharCode(randomBright));
    //  }
    //  timerRandomBrightnessAll = Date.now();
    //}

	for (var i = 0; i < 8; i++) {
		if ((Date.now() - timerRandomBrightnessAll) >= interval) {
			var desiredBright = getRandomInt(maxBrightness, bulbMin);
			log.debug(desiredBright);
			var diference = Math.abs(desiredBright - currentBright[i]);
			log.debug(diference);
			timeBetweenSteps[i] = Math.floor(interval/diference);
			
			if (timeBetweenSteps[i] < 1)
				serialport.sendToMega("D", i+1, String.fromCharCode(desiredBright));
	
			
			timerRandomBrightnessAll = Date.now();
		}
		
		if (timeBetweenSteps >= 1){
			if ((Date.now() - individualTimer[i] >= timeBetweenSteps[i])){
				currentBright[i]++;
				serialport.sendToMega("D", i+1, String.fromCharCode(currentBright[i]));

			}
		}
		
	
	}

  }	,
  randomTintToggleAll: function(interval) {
    // log.debug('active random Bulb Rightness All');
    if ((Date.now() - timerRandomTintToggleAll) >= interval) {
      for (var i = 1; i <= 8; i++) {
        var randomToggle = getRandomInt(0, 1);
        serialport.sendToMega("R", i, String.fromCharCode(randomToggle));
      }

      timerRandomTintToggleAll = Date.now();
    }
  }
}
