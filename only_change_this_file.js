
// Global accessible variables

//---- SENSORS -----//
/*
 sensors.pir				0-1
 sensors.cellUp			0-1
 sensors.cellDown			0-1
 sensors.loudSound		0-1
 sensors.globalSound		0-1024
 sensors.globalActivity	0-200
*/

// ---- ANIMATIONS -----//
/*
 // Turns all the bulbs on, to the given bightness.
 animations.turnAllBulbOn(brightness)

 // Turns all the bulbs off.
 animations.turnAllBulbOff()

 // Turns all the tints off.
 animations.turnAllTintOff()

 // Turns all the tints on.
 animations.turnAllTintOn()

 // Turns on the bulbs one by one at a given interval and to a given brightness
 // starting from the bottom one and cycling while the function is called.
 animations.swingBulbUp(interval, brightness)

 // Turns on the bulbs one by one at a given interval and to a given brightness
 // starting from the top one and cycling while the function is called.
 animations.swingBulbDown(interval, brightness)

 // Turns on the tints one by one at a given interval and to a given brightness
 // starting from the bottom one and cycling while the function is called.
 animations.swingTintUp(interval)

 // Turns on the tints one by one at a given interval and to a given brightness
 // starting from the top one and cycling while the function is called.
 animations.swingTintDown(interval)

 // Turns on the bulbs one by one at a given interval and to a given brightness
 // in a random order while the function is called.
 animations.randomBulb(interval, maxBrightness)

 // Turns on the tints one by one at a given interval and to a given brightness
 // in a random order while the function is called.
 animations.randomTint(interval)

 // Turns all the the bulbs on, each one with a diferent brightness, slowly
 // fading between states and taking into account the given  bightness maximum 
 // and the given interval.
 animations.randomBulbBrightnessAll(interval, maxBrightness)

 // Randomly toggles all the tints on/off.
 animations.randomTintToggleAll(interval)
*/


// ---- LAMPS LIFX -----//
/*
 lampsLifx.dinningTable
 lampsLifx.florLamp
 lampsLifx.kitchen
*/


var lastPir = 0;
var timeBlink = 5;
var countTime = 0;


function loop(){

  //-------- THIS FUNCTION IS EXECUTED EVERY 30MS -------------//
  //--------- WRITE YOUR CODE HERE ! ------------------------//


  // -------------- LIFX Examples -------------- //
  /*
    if(lastPir != sensors.pir ){
      if(sensors.pir == 1){
        log.debug('launch function someOneComing '+timeBlink);
        someOneComing();
      }
      lastPir = sensors.pir;
    }
    */




}


// Demo - Make blink lifx lampfloor when someone active the PIR in the entry
function someOneComing(){
  //Check if the lamp is present
  if(lampsLifx.floorLamp){
    //Turn on the lamp before sending informations
    lampsLifx.floorLamp.on();
    lampsLifx.floorLamp.color(360, 50, 100, 2500, 0);
    setTimeout(function(){
      lampsLifx.floorLamp.off();
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


// Don't change the code below -------- //
module.exports = {
  loop: loop
}
