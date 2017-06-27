
function init(sensors, lamps, animations, log, serialport, socket) {

  log.info('Module Interactions is initialized');

  var timeBlink = 5;
  var countTime = 0;
  var lastPir = 0;

  var loop = setInterval(function() {

    if(sensors.cellUp == 1){
      animations.swingBulbDown(500, 50);
    }

    if(sensors.cellDown == 1){
      animations.swingBulbUp(500, 50);
    }

    if(sensors.loudSound == 1){
      animations.turnAllBulbOff();
    }
    // animations.randomBulbBrightnessAll(200, 50);
    // animations.swingBulbUp(1000, 50);

    if(lastPir != sensors.pir ){
      if(sensors.pir == 1){
        log.debug('launch function someOneComing '+timeBlink);
        someOneComing();
      }
      lastPir = sensors.pir;
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
