const config = require('./config.json');
const	express = require('express'),
		winston = log = require('winston');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//-------------- Winston debug -----------------------//
winston.level = config.debugLevel;

server.listen(8844);



// Add a connect listener
io.sockets.on('connection', function(socket) { 

    log.debug('Client connected.');

    socket.on('status', function(val){
    	log.debug(val);
    })

    // Disconnect listener
    socket.on('disconnect', function() {
        console.log('Client disconnected.');
    });
});