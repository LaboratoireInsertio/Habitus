
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


// ---- LAMPS LIFX -----//


var lastPir = 0;
var timeBlink = 5;
var countTime = 0;


function loop(){

  //-------- THIS FUNCTION IS EXECUTED EVERY 30MS -------------//
  //--------- WRITE YOUR CODE HERE ! ------------------------//


  // -------------- LIFX Examples -------------- //

    if(lastPir != sensors.pir ){
      if(sensors.pir == 1){
        log.debug('launch function someOneComing '+timeBlink);
        someOneComing();
      }
      lastPir = sensors.pir;
    }




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
