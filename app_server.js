const config = require('./config.json');
const	express = require('express'),
		winston = log = require('winston');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//-------------- Winston debug -----------------------//
winston.level = config.debugLevel;

server.listen(8844, function(){
	log.info('Server launch on : '+8844);
});
// io = io.listen(server);


// Listen connection Client Side for send datas of sensors from MongoDB
io.on('connection', function(socket) {

    //Get informations abouts sensors
    log.debug('Connection from client side');

    socket.on('status', function(val){
    	log.debug('receive', val);
    });

});
