module.exports.listen = function(express, server, app, log, db, moment, _) {
  var collectionsData = [];

  server.listen(8844, function() {
    log.info('Server launch on : ' + 8844);
  });

  //----------- CONFIGURATION SERVER <-> CLIENT --------------------//

  app.use('/assets', express.static('assets'));

  app.get('/', function(req, res) {
    res.sendFile(appRoot + '/index.html');
  });

  app.get('/pir', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    db.getPir(function(datas) {
      res.send(datas);
    });
  });

  app.get('/sound-loud', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    db.getSoundLoud(function(datas) {
      res.send(datas);
    });
  });

  app.get('/sound-global', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    db.getSoundGlobal(function(datas) {
      res.send(datas);
    });
  });

  app.get('/stairs', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    db.getStairs(function(datas) {
      res.send(datas);
    });
  });




}
