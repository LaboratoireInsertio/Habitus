var mosca = require('mosca')

var ascoltatore = {
    //using ascoltatore
    type: 'mongo',
    url: 'mongodb://127.0.01:27017/mqtt',
    pubsubCollection: 'ascoltatori',
    mongo: {}
};

var moscaSettings = {
    port: 1883,
    backend: ascoltatore,
    persistence: {
        factory: mosca.persistence.Mongo,
        url: 'mongodb://127.0.0.1:27017/mqtt'
    }
};

module.exports.listen = function(log, db,modulesActive) {

    var server = new mosca.Server(moscaSettings);
    server.on('ready', setup);

    server.on('clientConnected', function(client) {
        console.log('client connected', client.id);
    });

    // fired when a message is received
    server.on('published', function(packet, client) {
        console.log('Published!!', packet);
        if (packet.topic == "/hello") {
            server.publish(message, function() {
                console.log('done!');
            });
        }
    });

    var message = {
        topic: '/hello/world',
        payload: 'abcde', // or a Buffer
        qos: 0, // 0, 1, or 2
        retain: false // or true
    };

    // setTimeout(function() {
    //     server.publish(message, function() {
    //         console.log('done!');
    //     });
    // }, 2000);

    // fired when the mqtt server is ready
    function setup() {
        console.log('Mosca server is up and running');
    }
}
