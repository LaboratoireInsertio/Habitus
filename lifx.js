var LifxClient = require('node-lifx').Client;
var client = new LifxClient();
var _ = require('underscore');
var lampsId = {
  dinningTable : 'd073d51375c8',
  floorLamp : 'd073d5139da2',
  kitchen : 'd073d51379f3'
}


  module.exports.init = function(log, lamps) {

    client.on('error', function(err) {
      log.info('LIFX error:\n' + err.stack);
      client.destroy();
    });


    client.on('light-new', function(light) {
      _.each(lampsId, function(lamp, name){
        if(lamp == light.id) addLamp(name, light);
      });
    });

    client.on('light-online', function(light) {
      _.each(lampsId, function(lamp, name){
        if(lamp == light.id) addLamp(name, light);
      });
    });

    client.on('light-offline', function(light) {
      log.debug('Light offline. ID:' + light.id + ', IP:' + light.address + ':' + light.port);
    });

    client.on('listening', function() {
      var address = client.address();
      log.info(
        'Started LIFX listening on ' +
        address.address + ':' + address.port + '\n'
      );
    });

    //Add Lamp
    function addLamp(name, light){
      log.debug('New light found. ID:' + light.id + ', IP:' + light.address + ':' + light.port);
      lamps[name] = light;
    }

    client.init();
  }
