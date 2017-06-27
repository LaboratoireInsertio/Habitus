var mosca = require('mosca');


var photoCellDownActive = false,
  photoCellUpActive = false,
  SomeOneInStairs = false,
  TimeInStairs,
  UpOrDown;

var phoD = 1000;
var phoU = 1000;
var piez = 0;
var receiveData = false;

var upActive = false, downActive = false;

module.exports.listen = function(config, log, socket, modulesActive, sensors) {

  var mqtt_settings = {
    port: 1883,
    persistence: mosca.persistence.Memory
  };
  var mqtt_server = new mosca.Server(mqtt_settings, function() {
    modulesActive.mqtt = true;
    log.info('Mosca server is up and running (port : 1883)');
  });

  // setInterval(function(){
  //   socket.emit('sensorsActive', 'cellUp', new Date().getTime());
  //   // log.debug('test');
  // },1000);

  // Recieve data from remote Arduino

  mqtt_server.published = function(packet, client, cb) {
    if (packet.topic.indexOf('echo') === 0) {
      return cb();
    }

    var newPacket = {
      topic: 'echo/' + packet.topic,
      payload: packet.payload.toString(),
      retain: packet.retain,
      qos: packet.qos
    };

    if (packet.topic == "feeds/photoDOWN") {
      phoD = parseInt(packet.payload.toString());
    } else if (packet.topic == "feeds/photoUP") {
      phoU = parseInt(packet.payload.toString());
    } else if (packet.topic == "feeds/piezo") {
      piez = parseInt(packet.payload.toString());
    }
    if (!receiveData) {
      log.info('Receive data from wifi arduino');
      receiveData = true;
    }

    // log.debug(phoD + ' ' + phoU);


    if(phoU <= 850 && !upActive ){
      upActive = true;
      sensors.cellUp = 1;
      socket.emit('data', 'photocell_up', {x : new Date().getTime(), y : 1 });
    }
    if(phoU > 850 && upActive){
      upActive = false;
      sensors.cellUp = 0;
      socket.emit('data', 'photocell_up', 0);
    }

    if(phoD <= 850 && !downActive ){
      downActive = true;
      sensors.cellDown = 1;
      socket.emit('data', 'photocell_down', {x : new Date().getTime(), y : 1 });
    }
    if(phoD > 850 && downActive){
      downActive = false;
      sensors.cellDown = 0;
      socket.emit('data', 'photocell_down', 0);
    }


    //
    // // PHOTOCELLS
    // if (phoD <= 850 && !photoCellDownActive) {
    //   photoCellDownActive = new Date().getTime();
    //   SomeOneInStairs = true;
    //   socket.emit('data', 'photocell_down', 1);
    //   log.debug('Photocell Down active');
    // }else if(){
    //
    // }
    //
    // if (phoU <= 850 && !photoCellUpActive) {
    //   photoCellUpActive = new Date().getTime();
    //   SomeOneInStairs = true;
    //   socket.emit('sensorsActive', 'cellUp', photoCellUpActive);
    //   log.debug('Photocell Up active');
    // }
    //
    //
    //
    // if (photoCellUpActive && photoCellDownActive && SomeOneInStairs && phoU >= 850 && phoD >= 850) {
    //   SomeOneInStairs = false;
    //
    //   TimeInStairs = photoCellUpActive - photoCellDownActive;
    //   if (TimeInStairs > 0) {
    //     log.debug('Someone up the stairs!', TimeInStairs);
    //     UpOrDown = "up";
    //   } else {
    //     log.debug('Someone down the stairs', Math.abs(TimeInStairs));
    //     UpOrDown = "down";
    //   }
    //
    //   socket.emit("insertData", "stairs", {
    //     up: photoCellUpActive,
    //     down: photoCellDownActive
    //   });
    //
    //   setTimeout(function() {
    //     photoCellDownActive = photoCellUpActive = false;
    //   }, 500);
    // }

    // forward messages to subscribed clients
    mqtt_server.publish(newPacket, cb);
  }
}
