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

      db.getGlobalActivity(function(datas){
          socket.emit('globalActivityData', datas);
      });

      db.getPir(function(datas) {
        socket.emit('pirData', datas);
      });

      db.getCellDown(function(datas){
        socket.emit('CellDownData', datas);
      });

      db.getCellUp(function(datas){
        socket.emit('CellUpData', datas);
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

    //Receive from the rasppberry the state of bulbs and tints
    //We resend the value for the interface web on the digitalOcean server
    socket.on('stateStairs', function(stateStairs){
        io.sockets.emit('stateStairs', stateStairs);
    });

    socket.on('pir', function(val) {
      io.sockets.emit('pir', val);
    });

    //Receive data from Rasppberry
    socket.on('data', function(sensor, data) {

      if (typeof data == 'object') {

        //Save Global Activity points (all sensors = 1 points, loud Sound = 5)
        globalActivity.value = globalActivity.value + globalActivity[sensor]


        if (globalActivity.value > globalActivity.maxValue) globalActivity.value = globalActivity.maxValue;

        log.debug('Global Activity :' + globalActivity.value);
        io.sockets.emit('globalActivity', globalActivity);
        db.insertData(sensor, data);
      }
      io.sockets.emit('data', sensor, data)

    });

    socket.on("disconnect", function() {
      log.debug('Client Disconnect');
    });


  });
  return io;
};
