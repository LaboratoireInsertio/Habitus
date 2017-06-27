var socketio = require('socket.io');

module.exports.listen = function(server, log, db, _, moment, globalActivity) {
  var io = socketio.listen(server);
  // Listen connection Client Side for send datas of sensors from MongoDB
  io.on('connection', function(socket) {
    //Get informations abouts sensors
    log.debug('Connection from client side');

    socket.on('datas', function() {
      log.debug('Ask for datas');

      socket.emit('globalActivity', globalActivity);
      
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

    socket.on('pir', function(val){
        io.sockets.emit('pir', val);
    });

    //Receive data from Rasppberry
    socket.on('data', function(sensor, data) {

      if(typeof data == 'object' ){

        //Save Global Activity points (all sensors = 1 points, loud Sound = 5)
        if(sensor == 'sound_loud' && globalActivity.value < globalActivity.maxValue ){
          globalActivity.value = globalActivity.value+5
        }
        else {
          globalActivity.value = globalActivity.value+1
        }
        log.debug('Global Activity :'+globalActivity.value);
        io.sockets.emit('globalActivity',globalActivity.value);

        log.debug('Ask for insertion :', sensor, data);
        db.insertData(sensor, data);
      }
      io.sockets.emit('data', sensor, data)

    });

    socket.on("ctrl", function(typeCtrl){
      log.debug("Ask for : "+typeCtrl);
      io.sockets.emit(typeCtrl,"1");
    });

    socket.on("disconnect", function() {
      log.debug('Client Disconnect');
    });


  });
  return io;
};
