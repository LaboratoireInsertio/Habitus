var mosca = require('mosca');

var mqtt_settings = {
  port: 1883,
  persistence: mosca.persistence.Memory
};
var mqtt_server = new mosca.Server(mqtt_settings, function() {
  log.info('Mosca server is up and running (port : 1883)');
});

var photoCellDownActive = false,
  photoCellUpActive = false,
  SomeOneInStairs = false,
  TimeInStairs,
  UpOrDown;

var phoD = 1000;
var phoU = 1000;
var piez = 0;
var receiveData = false;

module.exports.listen = function(config, log, socket) {


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
    if(!receiveData){
      log.info('Receive data from wifi arduino');
      receiveData = true;
    }
    // log.debug(phoD+ ' '+phoU);
    // PHOTOCELLS
    if (phoD <= 750 && !photoCellDownActive) {
      photoCellDownActive = new Date().getTime();
      SomeOneInStairs = true;
      log.debug('Photocell Down active');
    }

    if (phoU <= 750 && !photoCellUpActive) {
      photoCellUpActive = new Date().getTime();
      SomeOneInStairs = true;
      log.debug('Photocell Up active');
    }

    if (photoCellUpActive && photoCellDownActive && SomeOneInStairs && phoU >= 750 && phoD >= 750) {
      SomeOneInStairs = false;

      TimeInStairs = photoCellUpActive - photoCellDownActive;
      if (TimeInStairs > 0) {
        log.debug('Someone up the stairs!', TimeInStairs);
        UpOrDown = "up";
      } else {
        log.debug('Someone down the stairs', Math.abs(TimeInStairs));
        UpOrDown = "down";
      }

      socket.emit("insertData", "stairs", {
        up: photoCellUpActive,
        down: photoCellDownActive
      });

      setTimeout(function() {
        photoCellDownActive = photoCellUpActive = false;
      }, 500);
    }

    // forward messages to subscribed clients
    mqtt_server.publish(newPacket, cb);
  }
}
