var socketio = require('socket.io');

module.exports.listen = function(server, log, db, _, moment) {
    var io = socketio.listen(server);

    // Listen connection Client Side for send datas of sensors from MongoDB
    io.on('connection', function(socket) {

        socket.on('datas', function() {
            log.debug('Ask for show datas');
            db.pir.find(function(err, docs) {
                var groups = _.groupBy(docs, function(doc) {
                    return moment(doc.x).startOf('minute').format();
                });
                socket.emit('pirData', groups);
            });

            db.sound_loud.find(function(err, docs) {
                var groups = _.groupBy(docs, function(doc) {
                    return moment(doc.x).startOf('minute').format();
                });
                socket.emit('SoundLoudData', groups);
            });

            db.stairs.find(function(err, docs) {
                var groups = _.groupBy(docs, function(doc) {
                    return moment(doc.down).startOf('minute').format();
                });
                socket.emit('StairsData', groups);
            });

            db.sound_global.find(function(err, docs) {
                var groups = _.groupBy(docs, function(doc) {
                    return moment(doc.x).startOf('minute').format();
                });
                socket.emit('SoundGlobalData', groups);
            });
        })

        //Get informations abouts sensors
        log.debug('Connection from client side');

        // socket.on('insertData', function(val){
        // 	log.debug('receive', val);
        // 	db['sound_global'].insert({x: new Date().getTime(), y: val});
        // });

        socket.on('insertData', function(table, data) {
            log.debug('Ask for insertion :', table, data);
            io.sockets.emit('newData', table, data)
            db[table].insert(data);
        });

        socket.on("disconnect", function() {
            log.debug('Client Disconnect');
        })

    });
};
