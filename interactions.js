var serialport, log, socket;
// var sensors;

function init(sensors, animations, winstonLog, sp, socketio) {
  log = winstonLog;
  serialport = sp;
  socket = socketio;

  log.info('Module Interactions is initialized');
  var loop = setInterval(function() {
    log.debug('CELLUP : ',sensors.cellUp);
    // animations.randomBulbBrightnessAll(200, 50);
    // animations.swingBulbUp(1000, 50);

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
