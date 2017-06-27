var serialport, log, socket;
// var sensors;

function init(sensors, animations, winstonLog, sp, socketio) {
  log = winstonLog;
  serialport = sp;
  socket = socketio;

  log.info('Module Interactions is initialized');
  var loop = setInterval(function() {
    // animations.randomBulbBrightnessAll(200, 50);
<<<<<<< HEAD
    // animations.swingBulbUp(1000, 50);
    log.debug('CELLUP : ',sensors.cellUp);
=======
    //animations.swingBulbUp(1000, 100);
    //animations.swingBulbDown(1000, 10);
    //animations.turnAllBulbOff();
    //animations.turnAllBulbOn(100);
	//animations.randomBulb(500,20);
	//animations.randomBulbBrightnessAll(500, 20);
	animations.turnAllBulbOn(10);
	animations.randomTintToggleAll(500);
>>>>>>> cfb00f8aaa1e2928427014bd8c1315035f4b71dd
  }, 30);
  //
  // socket.on('cellUp', myAnimation);
  //
  // function myAnimation(value){
  //   log.debug("Launch my custom animation BulbsDownOne", value);
  // }


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
