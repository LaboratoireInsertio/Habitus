var socketio = require('socket.io');

module.exports.listen = function(server, log, db, _, moment) {
  var io = socketio.listen(server);

  // Listen connection Client Side for send datas of sensors from MongoDB
  io.on('connection', function(socket) {
    //Get informations abouts sensors
    log.debug('Connection from client side');

    socket.on('datas', function() {
      log.debug('Ask for datas');

      db.getPir(function(datas) {
        socket.emit('pirData', datas);
      });
      db.getSoundLoud(function(datas) {
        socket.emit('SoundLoudData', datas);
      });
      db.getStairs(function(datas) {
        socket.emit('StairsData', datas);
      });
      db.getSoundGlobal(function(datas) {
        socket.emit('SoundGlobalData', datas);
      })
    });

    //Receive Sensors activate
    socket.on('sensorsActive', function(id, value){
      log.debug('Sensor active ',id, value);
      //re-send to the raspberry
      io.sockets.emit(id,value);
    });

    //Insert data in mongo DB
    socket.on('insertData', function(table, data) {
      log.debug('Ask for insertion :', table, data);
      io.sockets.emit('newData', table, data)
    });

    socket.on("ctrl", function(typeCtrl){
      log.debug("Ask for : "+typeCtrl);
      io.sockets.emit(typeCtrl,"1");
    });

    socket.on("disconnect", function() {
      log.debug('Client Disconnect');
    });


  });
};
