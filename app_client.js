const config = require('./config.json');
var 	io = require('socket.io-client'),
		socket = io.connect(config.serverLocal, {reconnect: true}),
		winston = log = require('winston');

//-------------- Winston debug -----------------------//
winston.level = config.debugLevel;


// Add a connect listener
socket.on('connect', function() { 
  log.debug('Connected!');

  setInterval(function() {
  	socket.emit('status', 1);
  	log.debug('send');
  }, 1000);

});

