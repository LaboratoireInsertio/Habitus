function init(animations) {
  log.info('Module Interactions is initialized');

  var loop = setInterval(function() {
    // animations.randomBulbBrightnessAll(200, 50);
    animations.swingBulbUp(1000, 50);
  }, 30);


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
