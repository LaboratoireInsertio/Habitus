var LifxClient = require('node-lifx').Client;
var client = new LifxClient();
var _ = require('underscore');

  module.exports.init = function(log, lamps) {

    client.on('error', function(err) {
      log.info('LIFX error:\n' + err.stack);
      client.destroy();
    });

    client.on('light-new', function(light) {
      // console.log(light);
      log.debug('New light found. ID:' + light.id + ', IP:' + light.address + ':' + light.port);
      _.each(lamps, function(lamp, name){
        if(lamp == light.id) lamps[name] = light;
      });
    });

    client.on('light-online', function(light) {
      log.info('Light back online. ID:' + light.id + ', IP:' + light.address + ':' + light.port);
    });

    client.on('light-offline', function(light) {
      log.info('Light offline. ID:' + light.id + ', IP:' + light.address + ':' + light.port);
    });

    client.on('listening', function() {
      var address = client.address();
      log.info(
        'Started LIFX listening on ' +
        address.address + ':' + address.port + '\n'
      );
    });

    client.init();
  }
